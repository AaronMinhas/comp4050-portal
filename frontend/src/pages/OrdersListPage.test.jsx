import React from 'react';
import { act, create } from 'react-test-renderer';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useApp } from '../context/AppContext.jsx';
import OrdersListPage from './OrdersListPage.jsx';
import OrderStatusBadge from '../components/orders/OrderStatusBadge.jsx';
import { listOrders, resumeOrder } from '../api/client.js';
import { useNavigate } from 'react-router-dom';

vi.mock('react-router-dom', () => ({
  Link: ({ children, to, ...props }) => <a href={to} {...props}>{children}</a>,
  useNavigate: vi.fn(),
}));
vi.mock('../context/AppContext.jsx', () => ({ useApp: vi.fn() }));
vi.mock('../api/client.js', () => ({ listOrders: vi.fn(), getSolutionSummary: vi.fn(), archiveOrder: vi.fn(), holdOrder: vi.fn(), resumeOrder: vi.fn(), deleteOrder: vi.fn() }));

let archivePage;
afterEach(() => {
  if (archivePage) act(() => archivePage.unmount());
  archivePage = null;
  vi.unstubAllGlobals();
});

describe('order list rejection badges', () => {
  it('marks only rejected results in red in a list of mixed order states', () => {
    const cases = [
      ['DRAFT', 0, 'Draft'],
      ['AWAITING_OPTIMISATION', 0, 'Awaiting Optimisation'],
      ['OPTIMISED', 0, 'Optimised'],
      ['OPTIMISED', 1, 'Rejected'],
      ['OPTIMISED', 3, 'Rejected'],
      ['FINAL', 0, 'Finalised'],
    ];
    useApp.mockReturnValue({
      orders: cases.map(([Status, RejectedCount], index) => ({
        OrderId: `ORD-${index}`, Reference: `Test ${index}`, Status, RejectedCount,
        Items: [], CreatedAt: '2026-10-20T00:00:00Z',
      })),
      loadingOrders: false, ordersError: null, refreshOrders: vi.fn(),
    });

    const page = create(<OrdersListPage />);
    const badges = page.root.findAllByType(OrderStatusBadge).map((badge) => badge.findAllByType('span').find((span) => span.children.every((child) => typeof child === 'string')));

    expect(badges).toHaveLength(cases.length);
    badges.forEach((badge, index) => {
      expect(badge.children.join('')).toBe(cases[index][2]);
      expect(badge.props.className.includes('text-red-700')).toBe(cases[index][1] > 0);
    });
    page.unmount();
  });
});

describe('backlog and archive views', () => {
  const active = { OrderId: 'ORD-ACTIVE', Reference: 'Active test', Status: 'DRAFT', Items: [] };
  const held = { OrderId: 'ORD-HELD', Reference: 'Paused test', Status: 'OPTIMISED', RejectedCount: 2, Items: [], HeldAt: '2026-10-20T00:00:00Z' };
  const archived = { OrderId: 'ORD-ARCHIVED', Reference: 'Archived test', Status: 'FINAL', Items: [], ArchivedAt: '2026-10-20T00:00:00Z' };
  let refreshOrders;
  let navigate;
  function text(node) {
    return node.children.map((child) => typeof child === 'string' ? child : text(child)).join('');
  }
  beforeEach(() => {
    vi.resetAllMocks();
    navigate = vi.fn();
    useNavigate.mockReturnValue(navigate);
    refreshOrders = vi.fn().mockResolvedValue(undefined);
    useApp.mockReturnValue({ identity: { role: 'ADMINISTRATOR' }, orders: [active], loadingOrders: false, ordersError: null, refreshOrders });
    listOrders.mockImplementation(async ({ view }) => view === 'backlog' ? [held] : [archived]);
  });

  it('loads the separate backlog and preserves the saved rejection status', async () => {
    await act(async () => { archivePage = create(<OrdersListPage view="backlog" />); });
    expect(listOrders).toHaveBeenCalledWith({ view: 'backlog' });
    expect(text(archivePage.root)).toContain('Paused test');
    expect(text(archivePage.root)).not.toContain('Active test');
    const badge = archivePage.root.findAllByType('span').find((node) => text(node) === 'Rejected');
    expect(badge.props.className).toContain('text-red-700');
  });

  it('resumes directly from the list and opens the order to continue working', async () => {
    await act(async () => { archivePage = create(<OrdersListPage view="backlog" />); });
    resumeOrder.mockResolvedValue(active);
    listOrders.mockResolvedValue([]);
    await act(async () => {
      await archivePage.root.findAllByType('button').find((node) => text(node) === 'Resume').props.onClick();
    });
    expect(refreshOrders).toHaveBeenCalled();
    expect(resumeOrder).toHaveBeenCalledWith('ORD-HELD');
    expect(navigate).toHaveBeenCalledWith('/orders/ORD-HELD');
    expect(text(archivePage.root)).toContain('No orders on hold');
  });

  it('allows regular Users to read the archive without management controls', async () => {
    useApp.mockReturnValue({ identity: { role: 'USER' }, orders: [], refreshOrders });
    await act(async () => { archivePage = create(<OrdersListPage view="archived" />); });
    expect(text(archivePage.root)).toContain('Archived test');
    expect(archivePage.root.findAllByType('details')).toHaveLength(0);
  });

  it('reports an archive loading failure and supports retry', async () => {
    listOrders.mockRejectedValueOnce(new Error('Archive unavailable'));
    await act(async () => { archivePage = create(<OrdersListPage view="archived" />); });
    expect(text(archivePage.root)).toContain('Archive unavailable');
    expect(archivePage.root.findByProps({ 'aria-label': 'Order views' }).findAllByType('a').map(text)).toEqual(['Active orders', 'On hold', 'Archive']);
    await act(async () => {
      await archivePage.root.findAllByType('button').find((node) => text(node) === 'Try again').props.onClick();
    });
    expect(text(archivePage.root)).toContain('Archived test');
  });

  it('keeps the finalised archive minimal even for managers', async () => {
    await act(async () => { archivePage = create(<OrdersListPage view="archived" />); });
    expect(text(archivePage.root)).toContain('Finalised');
    expect(archivePage.root.findAllByType('details')).toHaveLength(0);
    expect(archivePage.root.findAllByType('th').map(text)).not.toContain('Actions');
  });

  it('keeps all order views available while loading and identifies the selected view', async () => {
    let finishLoading;
    listOrders.mockReturnValue(new Promise((resolve) => { finishLoading = resolve; }));
    act(() => { archivePage = create(<OrdersListPage view="backlog" />); });
    const navigation = archivePage.root.findByProps({ 'aria-label': 'Order views' });
    expect(navigation.findAllByType('a').map(text)).toEqual(['Active orders', 'On hold', 'Archive']);
    expect(navigation.findAllByType('a').find((node) => node.props['aria-current'] === 'page').props.href).toBe('/orders/backlog');
    expect(text(archivePage.root)).toContain('Loading orders...');
    await act(async () => { finishLoading([held]); });
    expect(archivePage.root.findAllByType('th').map(text)).toContain('Progress saved');
    expect(archivePage.root.findAllByType('th').map(text)).toContain('On hold since');
    expect(archivePage.root.findAllByType('details')).toHaveLength(0);
    expect(archivePage.root.findAllByType('button').map(text)).toContain('Resume');
  });

  it('explains who can resume for regular Users without offering unavailable actions', async () => {
    useApp.mockReturnValue({ identity: { role: 'USER' }, orders: [], refreshOrders });
    await act(async () => { archivePage = create(<OrdersListPage view="backlog" />); });
    expect(text(archivePage.root)).toContain('A Supervisor or Administrator can resume an order');
    expect(archivePage.root.findAllByType('button').map(text)).not.toContain('Resume');
  });

  it('keeps a failed resume available for retry without navigating away', async () => {
    resumeOrder.mockRejectedValue(new Error('Could not resume order'));
    await act(async () => { archivePage = create(<OrdersListPage view="backlog" />); });
    await act(async () => {
      await archivePage.root.findAllByType('button').find((node) => text(node) === 'Resume').props.onClick();
    });
    expect(navigate).not.toHaveBeenCalled();
    expect(text(archivePage.root)).toContain('Could not resume order');
    expect(archivePage.root.findAllByType('button').find((node) => text(node) === 'Resume').props.disabled).toBe(false);
  });

  it.each([
    ['active', active], ['backlog', held], ['archived', archived],
  ])('opens an order from the wider row in the %s view and keeps its reference accessible', async (view, order) => {
    await act(async () => { archivePage = create(<OrdersListPage view={view} />); });
    const row = archivePage.root.findByType('tbody').findByType('tr');
    const openLink = row.findAllByType('a').find((link) => link.props['aria-label']?.startsWith('Open order'));
    expect(openLink.props.href).toBe(`/orders/${order.OrderId}`);
    expect(text(openLink)).toBe(order.Reference);
    expect(text(row)).not.toContain('Open order');
    act(() => row.props.onClick({ button: 0, target: { closest: () => null } }));
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith(`/orders/${order.OrderId}`);
  });

  it.each(['a', 'button', '[data-order-actions]', '[role="dialog"]', '[role="tooltip"]'])(
    'keeps clicks on %s independent from opening the row', async (element) => {
      await act(async () => { archivePage = create(<OrdersListPage />); });
      const row = archivePage.root.findByType('tbody').findByType('tr');
      act(() => row.props.onClick({
        button: 0,
        target: { closest: (selector) => selector.split(', ').includes(element) ? {} : null },
      }));
      expect(navigate).not.toHaveBeenCalled();
    }
  );

  it('allows copying row text without opening the order', async () => {
    vi.stubGlobal('getSelection', () => ({ toString: () => 'Active test' }));
    await act(async () => { archivePage = create(<OrdersListPage />); });
    const row = archivePage.root.findByType('tbody').findByType('tr');
    act(() => row.props.onClick({ button: 0, target: { closest: () => null } }));
    expect(navigate).not.toHaveBeenCalled();
  });

  it.each([{ button: 1 }, { button: 0, ctrlKey: true }, { button: 0, metaKey: true }, { button: 0, defaultPrevented: true }])(
    'leaves modified or already-handled clicks to their normal controls (%j)', async (event) => {
      await act(async () => { archivePage = create(<OrdersListPage />); });
      const row = archivePage.root.findByType('tbody').findByType('tr');
      act(() => row.props.onClick({ ...event, target: { closest: () => null } }));
      expect(navigate).not.toHaveBeenCalled();
    }
  );
});
