# Testing

FitPortal has an automated backend suite, automated frontend unit tests and a manual frontend test plan.

| Suite | Location | Needs |
|---|---|---|
| Backend (pytest) | `backend/tests/` | Local PostgreSQL, normally the Supabase stack |
| Frontend unit tests (Vitest) | `frontend/src/**/*.test.*` | Node dependencies only |
| Frontend manual tests | `frontend/tests/` | Running Portal and backend |

## Backend

The backend suite runs against a real PostgreSQL database, because it covers transactions, row locking and sequence-backed identity.

Start the local Supabase stack from the repository root, then run the suite with the virtual environment from [Local Development](local-development.md#step-1-install-the-backend-environment):

```bash
supabase start
.venv/bin/python -m pytest backend/tests
```

The suite creates and migrates its own `fitportal_test` database on the same server as `DATABASE_URL`, rebuilding the schema from `supabase/migrations/` on every run. It sets placeholder Supabase and token settings through `backend/tests/conftest.py` when they are not already defined.

### Environment safeguards

- The suite drops and recreates its schema, so it **refuses to run against a non-local database host**. Local hosts are `127.0.0.1`, `localhost`, `::1` and `host.docker.internal`.
- Set `FITPORTAL_TEST_DATABASE_URL` to override the target database. Never point it at a shared or hosted Supabase project.
- The database name is always `fitportal_test` unless the override is set, so development data in the main database is not touched.
- If the database is unreachable, the suite stops with instructions to start the local stack.

### Coverage

The tests cover:

- API health
- Portal data models and validation, including item character limits and weight limits
- order creation, retrieval, editing, hold, resume, deletion and archiving
- automatic archiving
- Portal-to-Solver data conversion and Solver integration
- packing API routes
- persistence across database sessions and backend restarts
- sequence-backed `OrderId` and `Reference` generation
- transaction boundaries for order creation, order editing, box import and finalisation
- row locking, so concurrent finalisations cannot oversubscribe Box Inventory
- Box Inventory management, import and inventory feasibility
- authentication, role-based access and Portal account management
- FitVisualiser handoff token security
- database configuration and security settings
- manual handling settings

## Frontend

Vitest unit tests cover item and box validation (including the box import Add and Replace rules), the box group labels in Packing Details, order status display, role-based controls, handling warnings and the order pages.

```bash
npm --prefix frontend install
npm --prefix frontend test
```

`npm test` runs `vitest run` once. It needs no backend or database.

### Manual test plan

Manual functional testing is documented in [`frontend/tests/`](../frontend/tests/README.md):

- [`manual-test-cases.md`](../frontend/tests/manual-test-cases.md): the test cases, covering authentication, orders, item entry, validation, packing, FitVisualiser integration, API failure handling, responsive layout, navigation and the production build.
- [`test-run-template.md`](../frontend/tests/test-run-template.md): the template for recording a run.

## Integration Scope

The tests in this repository cover the Portal frontend, the Portal backend with its database, and FitSolver as installed by `requirements-standalone.txt`.

They do not cover FitVisualiser, which is not in this repository, or the deployed application. The team has manually tested the deployed application end to end, including the Portal, Solver and Visualiser integration. Tests that span Portal, FitSolver and FitVisualiser together live in the [Dynamic Fit monorepo](https://github.com/Wasif-ZA/dynamic-fit), which also runs the solver and Portal suites in one environment.
