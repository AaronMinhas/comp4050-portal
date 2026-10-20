import React from 'react';
import { create } from 'react-test-renderer';
import { describe, expect, it, vi } from 'vitest';
import { useApp } from '../context/AppContext.jsx';
import OrdersListPage from './OrdersListPage.jsx';

vi.mock('react-router-dom', () => ({
  Link: ({ children, to, ...props }) => <a href={to} {...props}>{children}</a>,
}));
vi.mock('../context/AppContext.jsx', () => ({ useApp: vi.fn() }));

describe('order list rejection badges', () => {
  it('marks only rejected results in red in a list of mixed order states', () => {
    const cases = [
      ['DRAFT', 0, 'Draft'],
      ['AWAITING_OPTIMISATION', 0, 'Awaiting Optimisation'],
      ['OPTIMISED', 0, 'Optimised'],
      ['OPTIMISED', 1, 'Rejected'],
      ['OPTIMISED', 3, 'Rejected'],
      ['FINAL', 0, 'Final'],
    ];
    useApp.mockReturnValue({
      orders: cases.map(([Status, RejectedCount], index) => ({
        OrderId: `ORD-${index}`, Reference: `Test ${index}`, Status, RejectedCount,
        Items: [], CreatedAt: '2026-10-20T00:00:00Z',
      })),
      loadingOrders: false, ordersError: null, refreshOrders: vi.fn(),
    });

    const page = create(<OrdersListPage />);
    const badges = page.root.findAllByType('span');

    expect(badges).toHaveLength(cases.length);
    badges.forEach((badge, index) => {
      expect(badge.children.join('')).toBe(cases[index][2]);
      expect(badge.props.className.includes('text-red-700')).toBe(cases[index][1] > 0);
    });
    page.unmount();
  });
});
