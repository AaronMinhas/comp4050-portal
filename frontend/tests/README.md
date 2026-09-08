# FitPortal Frontend Testing

This folder contains the frontend test plan and manual test cases for the FitPortal MVP.

FitPortal is the customer-facing part of Dynamic Fit. The frontend communicates with the FitPortal API, which handles order data and invokes FitSolver. FitVisualiser is used to display the packing solution in 3D.

## Test Objectives

The frontend test suite verifies that users can:

- sign in and access protected pages
- create and view orders
- add and remove order items
- see correct quantities, weights and hazard information
- submit an order for packing
- view packing results
- continue using order and packing summaries when FitVisualiser is unavailable
- use the interface on desktop and mobile screen sizes
- receive useful validation and error messages
- use the interface without unnecessary waiting or frozen UI

## Test Environment

For standalone development:

```bash
# Terminal 1 - backend
source .venv/bin/activate
cd backend
uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://127.0.0.1:5174
```

FitVisualiser is normally expected at:

```text
http://localhost:5173
```

FitVisualiser is not required for order creation, packing, or packing summaries. If it is not running, only the embedded 3D visualisation should be unavailable.

## Current Test Approach

The first frontend testing stage is manual functional testing.

Run the cases in:

```text
frontend/tests/manual-test-cases.md
```

Record the results of each test run using:

```text
frontend/tests/test-run-template.md
```

Record each test as:

- PASS
- FAIL
- BLOCKED
- NOT RUN

For failed tests, record:

- actual behaviour
- browser/device
- screenshot if useful
- console error if present
- related GitHub issue

## Test Areas

The current frontend test plan covers:

1. Authentication and protected routing
2. Orders list and order details
3. Order creation
4. Item entry and validation
5. Hazard handling
6. Packing workflow
7. FitVisualiser fallback behaviour
8. API failure handling
9. Responsive behaviour
10. Accessibility and keyboard navigation
11. Build and basic performance checks

## API Routes Relevant to Frontend Testing

The frontend workflow may use these Portal API routes:

```text
POST /orders
GET /orders
GET /orders/{id}
POST /orders/{id}/solve
GET /orders/{id}/solution
GET /orders/{id}/solution/summary
GET /health
```

The frontend is not responsible for testing the FitSolver packing algorithm itself. Backend tests cover solver integration. Frontend testing verifies that requests are triggered correctly and that success, loading and error states are displayed correctly.

## Entry Criteria

Before running the full frontend test suite:

- dependencies are installed
- frontend starts successfully
- backend starts successfully for API-related cases
- browser developer tools are available
- test data can be created safely

## Exit Criteria

The frontend test pass is considered complete when:

- all High-priority test cases have been run
- no unresolved High-priority failures remain
- failed Medium-priority tests have a GitHub issue or documented reason
- the production frontend build succeeds

## Future Automated Testing

The project currently does not include a frontend test script or frontend test framework.

A later testing issue can add:

- Vitest
- React Testing Library
- `@testing-library/jest-dom`
- jsdom

Recommended first automated tests:

1. Login validation
2. Protected-route redirect
3. Item-entry validation
4. Add/remove item
5. Create-order validation
6. Orders rendering
7. Order details rendering
8. Packing success/error states
9. API unavailable state

Keep automated testing in a separate change from this manual test-plan commit so any setup problems are easier to review and debug.
