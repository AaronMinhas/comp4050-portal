import React from 'react';
import { act, create } from 'react-test-renderer';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import * as api from '../api/client.js';
import OrderSummaryPage from './OrderSummaryPage.jsx';

vi.mock('react-router-dom', () => ({
  Link: ({ children, to, ...props }) => <a href={to} {...props}>{children}</a>,
  useParams: vi.fn(),
  useNavigate: () => vi.fn(),
}));
vi.mock('../context/AppContext.jsx', () => ({ useApp: vi.fn() }));
vi.mock('../api/client.js', () => ({
  getOrder: vi.fn(),
  getSolution: vi.fn(),
  getSolutionSummary: vi.fn(),
  getVisualizerHandoff: vi.fn(),
  finaliseOrder: vi.fn(),
  solveOrder: vi.fn(),
  submitOrder: vi.fn(),
  visualiserUrl: vi.fn(),
}));

const ITEM = {
  ItemCode: 'SMALL', ItemReference: 'Small test',
  Width: 100, Length: 100, Depth: 100, Weight: 1, Quantity: 1,
};
const rejectedItem = {
  item_ref: 'TOO-BIG', reason_code: 'NO_FITTING_CARTON', message: 'Too large for any box',
};
const order = (status = 'OPTIMISED', rejectedCount = 3, id = 'ORD-001') => ({
  OrderId: id, Reference: `Test ${id}`, Status: status, RejectedCount: rejectedCount,
  CreatedAt: '2026-10-20T00:00:00Z', Items: [ITEM],
});
const solution = (rejectedCount = 3) => ({
  solution_id: `solution-${rejectedCount}`,
  metrics: { fill_rate: 0.5 },
  rejects: Array.from({ length: rejectedCount }, () => ({ ...rejectedItem })),
  cartons: [{
    carton_id: 'c1', sku: 'CUBE', inner_dims: [200, 200, 200],
    contents_mass: 1000, fill_rate: 0.5,
    placements: [{
      placement_id: 'p1', item_ref: 'SMALL', label: 'Small test',
      dims: [100, 100, 100], position: [0, 0, 0], mass: 1000, sequence: 0, orientation: 0,
    }],
  }],
});
const summary = (rejectedCount = 3) => ({
  BoxCount: 1, ItemsPacked: 1, FillRate: 0.5,
  Rejected: Array.from({ length: rejectedCount }, () => ({
    ItemCode: 'TOO-BIG', Reason: 'NO_FITTING_CARTON', Detail: rejectedItem.message,
  })),
  InventoryFeasibility: { Sufficient: true, Requirements: [] },
});

let page;
let focusListeners;
let refreshOrders;

function text(node) {
  return node.children.map((child) => typeof child === 'string' ? child : text(child)).join('');
}

function buttons(label) {
  return page.root.findAllByType('button').filter((button) => text(button) === label);
}

function expectStatus(label) {
  const badge = page.root.findAllByType('span').find((span) => text(span) === label);
  expect(badge).toBeDefined();
  if (label === 'Rejected') expect(badge.props.className).toContain('text-red-700');
  else expect(badge.props.className).not.toContain('red');
}

async function mount() {
  await act(async () => { page = create(<OrderSummaryPage />); });
}

async function reoptimise() {
  await act(async () => { buttons('Re-optimise')[0].props.onClick(); });
  await act(async () => { buttons('Re-optimise').at(-1).props.onClick(); });
}

async function focus() {
  await act(async () => {
    await Promise.all([...focusListeners].map((listener) => listener()));
  });
}

beforeEach(() => {
  vi.resetAllMocks();
  focusListeners = new Set();
  vi.stubGlobal('window', {
    addEventListener: (event, listener) => { if (event === 'focus') focusListeners.add(listener); },
    removeEventListener: (event, listener) => { if (event === 'focus') focusListeners.delete(listener); },
  });
  refreshOrders = vi.fn().mockResolvedValue(undefined);
  useApp.mockReturnValue({ identity: { role: 'ADMINISTRATOR' }, refreshOrders });
  useParams.mockReturnValue({ id: 'ORD-001' });
  api.getOrder.mockResolvedValue(order());
  api.getSolution.mockResolvedValue(solution());
  api.getSolutionSummary.mockResolvedValue(summary());
});

afterEach(() => {
  if (page) act(() => page.unmount());
  page = null;
  vi.unstubAllGlobals();
});

describe('order rejection display and recovery', () => {
  it.each(['USER', 'SUPERVISOR', 'ADMINISTRATOR'])('shows rejection status to a %s', async (role) => {
    useApp.mockReturnValue({ identity: { role }, refreshOrders });
    await mount();

    expectStatus('Rejected');
    expect(buttons('Re-optimise')).toHaveLength(role === 'USER' ? 0 : 1);
  });

  it.each([1, 3])('shows red Rejected and blocks finalisation for %i rejected units', async (count) => {
    api.getOrder.mockResolvedValue(order('OPTIMISED', count));
    api.getSolution.mockResolvedValue(solution(count));
    api.getSolutionSummary.mockResolvedValue(summary(count));
    await mount();

    expectStatus('Rejected');
    expect(buttons('Finalise Order')[0].props.disabled).toBe(true);
    expect(text(page.root)).toContain(`${count} ${count === 1 ? 'item was' : 'items were'} not packed`);
    expect(text(page.root)).toContain('Items not packed');
  });

  it('keeps ordinary successful orders Optimised and eligible for finalisation', async () => {
    api.getOrder.mockResolvedValue(order('OPTIMISED', 0));
    api.getSolution.mockResolvedValue(solution(0));
    api.getSolutionSummary.mockResolvedValue(summary(0));
    await mount();

    expectStatus('Optimised');
    expect(buttons('Finalise Order')[0].props.disabled).toBe(false);
    expect(text(page.root)).not.toContain('Items not packed');
  });

  it.each(['summary', 'solution', 'both'])('keeps the saved rejection status if %s details cannot load', async (failed) => {
    if (failed !== 'solution') api.getSolutionSummary.mockRejectedValue(new Error('Summary unavailable'));
    if (failed !== 'summary') api.getSolution.mockRejectedValue(new Error('Solution unavailable'));
    await mount();

    expectStatus('Rejected');
    expect(buttons('Finalise Order')[0].props.disabled).toBe(true);
    expect(text(page.root)).toContain('Some optimisation details could not be loaded');
  });

  it('uses the saved solve response even when the follow-up summary request fails', async () => {
    api.getOrder.mockResolvedValue(order('AWAITING_OPTIMISATION', 0));
    api.solveOrder.mockResolvedValue(solution());
    api.getSolutionSummary.mockRejectedValue(new Error('Summary unavailable'));
    await mount();

    await act(async () => { await buttons('Run Optimisation')[0].props.onClick(); });

    expectStatus('Rejected');
    expect(buttons('Finalise Order')[0].props.disabled).toBe(true);
    expect(text(page.root)).toContain('Items not packed');
    expect(text(page.root)).toContain('Summary unavailable');
    expect(refreshOrders).toHaveBeenCalled();
  });

  it('clears rejection indicators after a successful re-optimisation', async () => {
    await mount();
    api.solveOrder.mockResolvedValue(solution(0));
    api.getSolutionSummary.mockResolvedValue(summary(0));

    await reoptimise();

    expectStatus('Optimised');
    expect(buttons('Finalise Order')[0].props.disabled).toBe(false);
    expect(text(page.root)).not.toContain('Items not packed');
    expect(text(page.root)).toContain('Re-optimisation completed');
  });

  it('changes a previously successful order to Rejected without a success banner', async () => {
    api.getOrder.mockResolvedValue(order('OPTIMISED', 0));
    api.getSolution.mockResolvedValue(solution(0));
    api.getSolutionSummary.mockResolvedValue(summary(0));
    await mount();
    api.solveOrder.mockResolvedValue(solution(2));
    api.getSolutionSummary.mockResolvedValue(summary(2));

    await reoptimise();

    expectStatus('Rejected');
    expect(buttons('Finalise Order')[0].props.disabled).toBe(true);
    expect(text(page.root)).not.toContain('Re-optimisation completed');
  });

  it('keeps the last saved rejection result if re-optimisation fails', async () => {
    await mount();
    api.solveOrder.mockRejectedValue(new Error('Solver unavailable'));

    await reoptimise();

    expectStatus('Rejected');
    expect(text(page.root)).toContain('Solver unavailable');
    expect(text(page.root)).toContain('Items not packed');
  });

  it('refreshes the badge and rejection details together on returning to the tab', async () => {
    await mount();
    api.getOrder.mockResolvedValue(order('OPTIMISED', 0));
    api.getSolution.mockResolvedValue(solution(0));
    api.getSolutionSummary.mockResolvedValue(summary(0));

    await focus();

    expectStatus('Optimised');
    expect(text(page.root)).not.toContain('Items not packed');
    expect(refreshOrders).toHaveBeenCalled();
  });

  it('removes old rejection details if another session edits the order back to Draft', async () => {
    await mount();
    api.getOrder.mockResolvedValue(order('DRAFT', 0));

    await focus();

    expectStatus('Draft');
    expect(text(page.root)).not.toContain('Items not packed');
    expect(text(page.root)).not.toContain('Optimisation result');
  });

  it('does not replace the current order with a late response for a previous order', async () => {
    let finishOldLoad;
    api.getOrder.mockImplementation((id) => id === 'ORD-001'
      ? new Promise((resolve) => { finishOldLoad = resolve; })
      : Promise.resolve(order('DRAFT', 0, id)));
    await mount();
    useParams.mockReturnValue({ id: 'ORD-002' });
    await act(async () => { page.update(<OrderSummaryPage />); });

    await act(async () => { finishOldLoad(order()); });

    expectStatus('Draft');
    expect(text(page.root)).toContain('Test ORD-002');
    expect(text(page.root)).not.toContain('Test ORD-001');
  });

  it('does not apply an old optimisation response after navigating to a different order', async () => {
    await mount();
    let finishSolve;
    api.solveOrder.mockReturnValue(new Promise((resolve) => { finishSolve = resolve; }));
    await reoptimise();
    useParams.mockReturnValue({ id: 'ORD-002' });
    api.getOrder.mockResolvedValue(order('DRAFT', 0, 'ORD-002'));
    await act(async () => { page.update(<OrderSummaryPage />); });

    await act(async () => { finishSolve(solution(2)); });

    expectStatus('Draft');
    expect(text(page.root)).toContain('Test ORD-002');
    expect(text(page.root)).not.toContain('Items not packed');
    expect(text(page.root)).not.toContain('Optimisation result');
    expect(buttons('Submit for Optimisation')[0].props.disabled).toBe(false);
  });
});
