# FitPortal

FitPortal is the customer-facing component of **Dynamic Fit**, a system for creating packing orders, optimising how items are packed into boxes, and visualising the resulting packing solution.

This repository contains the standalone FitPortal frontend and backend.

The complete integrated Dynamic Fit application is maintained in the **Dynamic Fit monorepo**:

**https://github.com/Wasif-ZA/dynamic-fit**

## Dynamic Fit

Dynamic Fit consists of three main components:

- **FitPortal** — Customer-facing interface, order management and API.
- **FitSolver** — Calculates optimised packing solutions.
- **FitVisualiser** — Displays packing solutions in 3D.

The current application flow is:

```text
FitPortal Frontend
        ↓
FitPortal API
        ↓
FitSolver
        ↓
FitPortal API
        ↓
FitVisualiser
```

FitPortal's backend integrates with FitSolver directly as a Python package. A separate Solver server is not required.

The complete Portal, Solver and Visualiser integration is available through the Dynamic Fit monorepo:

**https://github.com/Wasif-ZA/dynamic-fit**

## Repository Structure

```text
comp4050-portal/
├── backend/
│   ├── app/
│   │   ├── db/                 SQLAlchemy persistence models
│   │   ├── repositories/       PostgreSQL reads and writes
│   │   ├── routes/             FastAPI routers
│   │   └── database.py         Engine and session lifecycle
│   ├── tests/
│   ├── .env.example
│   ├── requirements.txt
│   └── requirements-standalone.txt
├── frontend/
├── supabase/
│   ├── config.toml
│   └── migrations/             Authoritative database schema
└── README.md
```

### Backend

The backend is a Python FastAPI application responsible for:

- creating and retrieving orders
- validating Portal data
- persisting orders, order items, Box Inventory and packing solutions in PostgreSQL
- converting Portal orders into the FitSolver input format
- executing packing requests through FitSolver
- storing packing solutions, and
- exposing packing results for the frontend and FitVisualiser.

FastAPI owns all application state. The frontend never reads or writes the
database directly, and no database credentials are exposed to the browser.

### Frontend

The frontend provides the FitPortal user interface for:

- creating orders
- viewing existing orders
- viewing order items and packing status
- submitting orders for packing, and
- displaying packing results.

## Standalone Development

This repository can be used independently for FitPortal development and testing.

Because FitSolver exists in the Dynamic Fit monorepo, the standalone Portal environment installs FitSolver as a Python dependency from the monorepo.

### Prerequisites

- Python 3.12+ and a virtual environment
- Node 18+ and npm
- A Docker compatible container runtime (Docker Desktop)
- The [Supabase CLI](https://supabase.com/docs/guides/local-development), for the local database

### Database Setup

The Portal stores orders, order items, Box Inventory and packing solutions in
PostgreSQL. Supabase is the PostgreSQL platform; the backend connects to it as
an ordinary database over SQLAlchemy and psycopg.

Start the local Supabase stack from the repository root. This creates the
database and applies every migration in `supabase/migrations/`:

```bash
supabase start
```

Print the local connection details, including the database URL:

```bash
supabase status
```

Copy the backend environment template and set `DATABASE_URL` to that database
URL. `backend/.env` is git-ignored and must never be committed:

```bash
cp backend/.env.example backend/.env
```

For local Supabase the default in the template is usually correct:

```text
DATABASE_URL=postgresql+psycopg://postgres:postgres@127.0.0.1:54322/postgres
```

To rebuild the database from the migrations at any time — this **deletes all
local data**:

```bash
supabase db reset
```

A fresh database is empty, no orders, no solutions, and no Box
Inventory. The migrations deliberately seed no boxes. Populate inventory
through the Box Inventory page by importing `boxes.json`.

### Backend Setup

From the repository root:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r backend/requirements-standalone.txt
```

Start the FastAPI backend:

```bash
cd backend
uvicorn app.main:app --reload
```

The backend refuses to start if `DATABASE_URL` is missing or the database is
unreachable. There is no in-memory fallback, so a misconfigured deployment
fails immediately.

The API will be available at:

```text
http://127.0.0.1:8000
```

Interactive API documentation is available at:

```text
http://127.0.0.1:8000/docs
```

### Frontend Setup

Open another terminal from the repository root:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at:

```text
http://127.0.0.1:5174
```

## FitSolver Integration

FitSolver is installed by `backend/requirements-standalone.txt`.

The standalone requirements file installs the standard Portal dependencies and then installs the FitSolver Python package from:

**https://github.com/Wasif-ZA/dynamic-fit/tree/main/packages/solver**

This allows the following workflow to be tested directly from this repository:

```text
FitPortal Frontend
        ↓
FitPortal API
        ↓
FitSolver
        ↓
Packing Result
        ↓
FitPortal Frontend
```

FitSolver runs in-process with the Portal backend. There is no separate Solver API or server to start.

## FitVisualiser Integration

FitVisualiser is maintained as part of the Dynamic Fit monorepo:

**https://github.com/Wasif-ZA/dynamic-fit/tree/main/apps/visualiser**

FitVisualiser is not included in this standalone repository.

The Portal frontend expects FitVisualiser to be running at:

```text
http://localhost:5173
```

Without FitVisualiser running, order creation, packing and packing summaries will continue to work, but the embedded 3D visualisation will not be available.

To run and test the complete Portal → Solver → Visualiser workflow, use the Dynamic Fit monorepo:

**https://github.com/Wasif-ZA/dynamic-fit**

## API

The current Portal API provides the following routes:

| Method | Route | Purpose |
|---|---|---|
| `POST` | `/orders` | Create an order |
| `GET` | `/orders` | List orders |
| `GET` | `/orders/{id}` | Retrieve an order |
| `POST` | `/orders/{id}/solve` | Pack an existing order using FitSolver |
| `GET` | `/orders/{id}/solution` | Retrieve the packing solution |
| `GET` | `/orders/{id}/solution/summary` | Retrieve the packing summary |
| `GET` | `/health` | API health check |
| `GET` | `/docs` | Interactive OpenAPI documentation |

Order IDs are generated by the Portal API using the `ORD-###` format.

## Testing

The backend suite runs against a real PostgreSQL database, because it covers
transactions, row locking and sequence-backed identity.

Start the local Supabase stack first, then run the suite:

```bash
supabase start
```

```bash
pytest backend/tests
```

The suite creates and migrates its own `fitportal_test` database on the same
server as `DATABASE_URL`, rebuilding the schema from `supabase/migrations/` on
every run.

Because the suite drops and recreates its schema, it refuses to run against a
non-local database host. Set `FITPORTAL_TEST_DATABASE_URL` to override the
target, and never point it at a shared or hosted Supabase project.

The tests cover:

- API health
- Portal data models and validation
- order creation and retrieval
- Portal-to-Solver data conversion
- Solver integration
- packing API routes
- persistence across database sessions and backend restarts
- sequence-backed OrderId and Reference generation
- transaction boundaries for order creation, order editing, box import and finalisation
- row locking, so concurrent finalisations cannot oversubscribe Box Inventory.

## Persistence

### Architecture

```text
React
    ↓
FastAPI routes
    ↓
domain modules (store, boxes, finalisation)
    ↓
repositories
    ↓
SQLAlchemy + psycopg
    ↓
PostgreSQL (Supabase)
```

Routes and domain code never contain SQL. Repositories convert between database
rows and the Pydantic API models, so the API schema and the database schema stay
independent. PostgreSQL columns are `snake_case`, the API contract remains
PascalCase.

### Schema

The authoritative schema lives in `supabase/migrations/`.

| Table | Contents |
|---|---|
| `orders` | OrderId, Reference, lifecycle Status, CreatedAt |
| `order_items` | Each order's items, with an explicit `position` |
| `box_types` | Deployment-wide Box Inventory |
| `solutions` | The one active FitSolver document per order, as JSONB |

`order_id_sequence` and `order_reference_sequence` generate `ORD-001` and
`DF-001`. Because PostgreSQL sequences are not rolled back by a failed
transaction, reference gaps such as `DF-001`, `DF-003` are expected and
accepted; uniqueness and concurrency safety matter more than gapless numbering.

### Role based access control

FastAPI is the only trusted writer. The browser never receives PostgreSQL
credentials, and React never reads or writes these tables directly.

Row Level Security is deliberately **not** the authorisation layer at the moment.

## Development Workflow

Development work is managed using GitHub Issues and the FitPortal GitHub Project board. To be implemented.

The team follows a branch and pull-request workflow:

1. Select an issue from the current sprint.
2. Assign the issue before beginning development.
3. Create a branch for the issue.
4. Implement and test the change.
5. Open a pull request targeting `main`.
6. Link the pull request to the relevant issue.
7. Have another team member review and approve the pull request.
8. Squash merge the approved pull request into `main`.

Direct changes to `main` are restricted.

## Monorepo Integration

FitPortal is also maintained as the Portal component of the Dynamic Fit monorepo:

**https://github.com/Wasif-ZA/dynamic-fit/tree/main/apps/portal**

Within the monorepo, FitSolver is available locally under `packages/solver`. The monorepo therefore installs the local Solver package rather than using the standalone Portal dependency.

`backend/requirements-standalone.txt` exists specifically so this repository can independently run and test Portal-to-Solver integration.

For development and testing of the complete Dynamic Fit system, use the monorepo:

**https://github.com/Wasif-ZA/dynamic-fit**
