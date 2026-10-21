# Local Development

This guide runs the standalone FitPortal frontend and backend against a local Supabase stack running in Docker. It does not connect to a hosted Supabase project.

To run the complete Dynamic Fit system, including FitVisualiser, use the [Dynamic Fit monorepo](https://github.com/Wasif-ZA/dynamic-fit). See [Standalone and Monorepo Development](#standalone-and-monorepo-development).

Complete the steps in order. Unless a step says otherwise, run every command from the repository root.

## Prerequisites

- Python 3.11 or newer (`StrEnum` is used in the backend, and the pinned FitSolver requires 3.11)
- Node 22 or newer and npm (required by `@supabase/supabase-js`)
- A Docker-compatible container runtime, such as Docker Desktop, running
- The [Supabase CLI](https://supabase.com/docs/guides/local-development)
- Network access to GitHub, because FitSolver is installed from the Dynamic Fit monorepo

## Step 1: Install the Backend Environment

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r backend/requirements-standalone.txt
```

`backend/requirements-standalone.txt` installs the standard Portal dependencies from `backend/requirements.txt`, then installs FitSolver as a Python package from the [`packages/solver`](https://github.com/Wasif-ZA/dynamic-fit/tree/main/packages/solver) directory of the monorepo, pinned to a specific commit. There is no separate Solver server to start.

## Step 2: Start Local Supabase

With Docker running:

```bash
supabase start
```

This starts the local PostgreSQL and Auth services and applies every migration in `supabase/migrations/`. Print the local configuration values:

```bash
supabase status -o env
```

Default local ports are set in `supabase/config.toml`: API `54321` and PostgreSQL `54322`.

## Step 3: Configure the Backend

```bash
cp backend/.env.example backend/.env
```

Open `backend/.env` and set the values from `supabase status -o env`:

```text
DATABASE_URL=<DB_URL>
SUPABASE_URL=<API_URL>
SUPABASE_SECRET_KEY=<SECRET_KEY>
SUPABASE_JWKS_URL=http://127.0.0.1:54321/auth/v1/.well-known/jwks.json
VISUALIZER_TOKEN_SECRET=<stable random value containing at least 32 characters>
PORTAL_PUBLIC_API_URL=http://127.0.0.1:8000
```

Use the `SECRET_KEY` value beginning with `sb_secret_`. Do not use the legacy JWT-formatted `SERVICE_ROLE_KEY`. Keep `backend/.env` local and never commit it.

### Backend environment variables

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection URL (`postgresql+psycopg://...`) |
| `SUPABASE_URL` | Yes | Supabase API URL, used for the Auth admin API |
| `SUPABASE_SECRET_KEY` | Yes | Supabase secret key, used by the backend only |
| `SUPABASE_JWKS_URL` | Yes, unless `SUPABASE_JWT_SECRET` is set | Public keys for verifying access tokens |
| `SUPABASE_JWT_SECRET` | Alternative | Shared secret for HS256 tokens |
| `VISUALIZER_TOKEN_SECRET` | Yes | Signs FitVisualiser handoff tokens. At least 32 characters |
| `PORTAL_PUBLIC_API_URL` | Recommended | Base URL used in FitVisualiser handoff URLs. Defaults to the request base URL |
| `FITPORTAL_CORS_ORIGINS` | Hosted only | Comma-separated allowed origins. Defaults to the local Portal and FitVisualiser ports |
| `DATABASE_POOL_SIZE`, `DATABASE_MAX_OVERFLOW` | No | Connection pool tuning |
| `SUPABASE_JWT_ISSUER`, `SUPABASE_JWT_AUDIENCE` | No | Override token issuer and audience checks |
| `VISUALIZER_TOKEN_TTL_SECONDS` | No | Handoff token lifetime. Defaults to 300 |
| `FITPORTAL_TEST_DATABASE_URL` | Tests only | See [Testing](testing.md) |

## Step 4: Create the Local Test Accounts

There is no sign-up page. The bootstrap script creates an Administrator and a Supervisor. Keep the virtual environment from Step 1; the explicit `.venv/bin/python` path avoids using the system Python by accident.

```bash
export BOOTSTRAP_ADMIN_EMAIL=admin@local.test
export BOOTSTRAP_ADMIN_PASSWORD='localtest'
export BOOTSTRAP_SUPERVISOR_EMAIL=supervisor@local.test
export BOOTSTRAP_SUPERVISOR_PASSWORD='localtest'
.venv/bin/python backend/scripts/bootstrap_users.py
```

These credentials are for local testing only. Do not reuse them with hosted Supabase. The bootstrap is idempotent, so running it again leaves existing accounts with the expected roles unchanged. Further accounts are created from the Users page in the Portal.

## Step 5: Start the Backend

```bash
.venv/bin/python -m uvicorn app.main:app --reload --app-dir backend
```

The API is available at `http://127.0.0.1:8000`. Interactive API documentation is at `http://127.0.0.1:8000/docs`.

The backend refuses to start when its database or authentication configuration is missing or unreachable.

## Step 6: Configure the Frontend

Open another terminal at the repository root.

```bash
cp frontend/.env.example frontend/.env
```

Set `VITE_SUPABASE_PUBLISHABLE_KEY` in `frontend/.env` to the `PUBLISHABLE_KEY` printed by `supabase status -o env`. The browser receives only this public key. It must never receive `SUPABASE_SECRET_KEY`.

| Variable | Default | Purpose |
|---|---|---|
| `VITE_PORTAL_API_BASE` | `http://127.0.0.1:8000` | Portal API URL |
| `VITE_VISUALISER_BASE` | `http://localhost:5173` | FitVisualiser URL |
| `VITE_SUPABASE_URL` | `http://127.0.0.1:54321` | Supabase API URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | placeholder | Supabase publishable key |

Vite embeds these values at build time, so hosted values must be set before the frontend is built.

## Step 7: Start the Frontend

```bash
npm --prefix frontend install
npm --prefix frontend run dev
```

The frontend is available at `http://127.0.0.1:5174`. The port is fixed (`strictPort`), so the command fails if `5174` is already in use. Sign in with either account created in Step 4.

A fresh database has no box types, so optimisation is unavailable until Box Inventory is populated. Add box types on the Box Inventory page or import a `boxes.json` file. See the [User Guide](user-guide.md#manage-box-inventory).

## Integration Dependencies

### FitSolver

FitSolver is installed in Step 1 and runs in the backend process. Nothing else is required to pack orders from this repository.

### FitVisualiser

FitVisualiser is maintained in the monorepo ([`apps/visualiser`](https://github.com/Wasif-ZA/dynamic-fit/tree/main/apps/visualiser)) and is not included here. The Portal frontend expects it at `http://localhost:5173` (`VITE_VISUALISER_BASE`).

Without FitVisualiser running, order creation, optimisation and packing summaries continue to work, but the embedded 3D view is unavailable. To run it, follow the monorepo instructions. Open FitVisualiser as `localhost` rather than `127.0.0.1`, as the monorepo documentation advises.

## Resetting Local Supabase

This deletes all local data and reapplies the migrations:

```bash
supabase db reset
```

Run Step 4 again after a reset, because Auth identities and Portal account rows are deleted. A fresh database contains no orders, solutions or box inventory.

To apply new migrations to an existing local database without deleting data:

```bash
supabase migration up
```

## Standalone and Monorepo Development

| | This repository | Dynamic Fit monorepo |
|---|---|---|
| Purpose | Develop and test FitPortal independently | Run and deploy the complete application |
| FitSolver | Installed from the monorepo by `requirements-standalone.txt` | Local `packages/solver` package |
| FitVisualiser | Not included | `apps/visualiser` |
| Supabase CLI | `supabase start` | `supabase start --workdir apps/portal` |
| Backend path | `backend/` | `apps/portal/backend/` |

The monorepo holds its own copy of the Portal under `apps/portal`. The integrated application is built from that copy, not from this repository.

From this repository alone you cannot:

- view the 3D visualisation, because FitVisualiser is not included
- run the complete Portal, Solver and Visualiser workflow
- test the integrated deployment

Use the monorepo for these.

## Common Problems

| Symptom | Cause |
|---|---|
| Backend exits at startup with a database or authentication error | `backend/.env` is missing, incomplete or points at a stopped Supabase stack. Run `supabase status` |
| Sign-in fails for the bootstrap accounts | Step 4 was not run, or was not repeated after `supabase db reset` |
| `npm run dev` fails on port `5174` | Another process is using the port. The port is fixed so it does not collide with FitVisualiser on `5173` |
| Optimisation reports no available box types | Box Inventory is empty or every box is inactive or has zero quantity |
| The 3D view is blank | FitVisualiser is not running at `VITE_VISUALISER_BASE`, or was opened as `127.0.0.1` rather than `localhost` |
