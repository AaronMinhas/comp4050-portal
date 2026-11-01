
# FitPortal Frontend Testing

This directory contains the frontend testing documentation for FitPortal, developed as part of the Dynamic Fit project.

The purpose of testing is to verify the application's functionality, reliability, input validation, navigation and usability before submission.

Frontend testing was conducted between September and November 2026 using manual functional testing, automated regression testing, source-code review and production build verification.

The final manual review was completed in November 2026 after the project reached its submission-ready stage. The tester reported that the reviewed application functionality worked as intended, with no errors identified during the final review.

---

## Testing Documentation

The testing documentation is organised into three files:

```text
frontend/tests/
├── README.md
├── manual-test-cases.md
└── test-run-template.md
```

### README.md

Provides an overview of the testing process, test environments, execution commands and result-recording conventions.

### manual-test-cases.md

Contains 32 defined frontend test cases covering:

- Authentication and protected routes.
- User management and account creation.
- Order creation and management.
- Item entry and validation.
- Packing optimisation and re-optimisation.
- Packing solutions and summaries.
- FitVisualiser integration.
- API error handling.
- Responsive layouts and navigation.
- Keyboard accessibility.
- Production build verification.
- General interface responsiveness.

The test cases preserve the September observations, October verification evidence and November manual-testing information.

FE-17 was not defined in the original test-case numbering.

### test-run-template.md

Records testing activities and results across September, October and November 2026.

It includes:

- Initial September manual test results.
- October automated regression results.
- Production build verification.
- November final manual testing.
- Historical issues and their regression evidence.
- Final testing outcomes.

Detailed execution evidence is maintained in this file rather than repeated throughout the README.

---

## Testing Approach

Frontend verification used four complementary methods.

### 1. Manual Functional Testing

Manual testing was performed through the application's user interface to verify that functionality behaved as expected.

The testing covered authentication, user management, order creation, item validation, packing, navigation, responsiveness and other frontend workflows.

The initial manual testing was conducted in September 2026.

Final manual testing was performed in November 2026 on the completed application before submission.

The November review included 17 individually recorded checks covering Administrator functionality, order workflows, optimisation, Supervisor permissions and sign-out protection.

All 17 recorded checks passed.

The tester also confirmed that the completed application was reviewed more broadly and that no errors were reported during the final review.

Detailed test steps and historical results are available in `manual-test-cases.md`.

### 2. Automated Regression Testing

Automated tests use Vitest and the React testing utilities included in the project.

These tests help verify existing functionality and detect regressions when frontend code changes.

From the `frontend` directory, run:

```bash
npm test -- --run
```

Alternatively, from the repository root:

```bash
npm --prefix frontend test -- --run
```

The recorded October 2026 test execution on `main` produced:

| Metric | Result |
|---|---|
| Test files | 18 |
| Tests passed | 247 |
| Tests failed | 0 |
| Overall result | PASS |

Automated coverage includes input validation, order-related components, navigation, packing behaviour, re-optimisation and selected error-handling scenarios.

A separate JSON null-quantity correction recorded 248 passing automated tests on the `fix/json-import-null-quantity` feature branch.

The feature-branch result is kept separate from the recorded `main` branch result.

### 3. Source-Code Review

Source-code review was used during development to inspect implementation details and identify areas requiring verification.

Reviewed functionality included:

- Form validation.
- Authentication and protected routes.
- Account management.
- Error handling.
- Navigation.
- Responsive layout.
- Accessibility attributes.
- Integration points.

Code review provides supporting evidence but is not equivalent to executing a manual test.

### 4. Production Build Verification

The production build checks whether the frontend can be compiled successfully.

From the `frontend` directory, run:

```bash
npm run build
```

Alternatively, from the repository root:

```bash
npm --prefix frontend run build
```

The recorded October 2026 production build completed successfully.

| Metric | Result |
|---|---|
| Build tool | Vite |
| Modules transformed | Approximately 119 |
| Build errors | 0 |
| Overall result | PASS |

A successful production build confirms build compatibility but does not replace functional testing.

---

## Test Environment

### Development Environment

The frontend was developed and tested using:

| Component | Technology |
|---|---|
| Operating system | macOS |
| Development environment | Visual Studio Code |
| Frontend | React / Vite |
| Automated testing | Vitest |
| Primary browser | Safari |
| Backend | Python / FastAPI |
| Authentication and database | Supabase |
| Packing optimisation | FitSolver |

The final local manual-testing environment included the FitPortal frontend, backend, Supabase services and backend-integrated FitSolver.

FitVisualiser is a separate component of the wider Dynamic Fit system.

### Start the Backend

From the configured backend directory:

```bash
uvicorn app.main:app --reload
```

The backend is normally available at:

```text
http://127.0.0.1:8000
```

API documentation may be available at:

```text
http://127.0.0.1:8000/docs
```

The backend requires its dependencies and environment configuration to be set up correctly.

### Start the Frontend

From the `frontend` directory:

```bash
npm install
npm run dev
```

Vite displays the local development URL in the terminal.

For example:

```text
http://127.0.0.1:5174
```

The actual port may differ depending on which ports are available.

Open the URL displayed in the terminal.

### Authentication Configuration

FitPortal uses Supabase authentication.

The frontend environment configuration is documented in:

```text
frontend/.env.example
```

Relevant environment variables include:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

A configured Supabase environment and suitable test accounts are required for authenticated workflows.

The final local manual testing included Administrator and Supervisor accounts.

Do not commit private credentials, access tokens or local environment configuration containing secrets.

### FitVisualiser Configuration

FitVisualiser is used to display packing solutions visually.

The default local address configured for the visualiser is:

```text
http://localhost:5173
```

A different address can be configured using:

```text
VITE_VISUALISER_BASE
```

FitPortal displays core packing results independently of FitVisualiser.

The November standalone testing environment used the backend-integrated FitSolver but did not include the separate FitVisualiser application.

The final manual review outcome therefore should not be interpreted as a separate recorded end-to-end FitVisualiser integration test.

---

## Manual Testing Process

For each test case:

1. Read the test steps and expected result in `manual-test-cases.md`.
2. Prepare the required application environment and test data.
3. Execute the test through the application interface.
4. Compare the observed behaviour with the expected result.
5. Record the test result.
6. Record relevant observations, screenshots or errors where appropriate.
7. Create or reference a GitHub issue for confirmed defects when necessary.
8. Retest the affected functionality after a correction.

Test results are documented in:

```text
frontend/tests/test-run-template.md
```

### Test Result Values

| Result | Meaning |
|---|---|
| PASS | The expected functionality or recorded check completed successfully. |
| FAIL | The expected behaviour was not achieved. |
| BLOCKED | A dependency or environment limitation prevented completion. |
| NOT RUN | The test was not executed during the specified testing period. |
| PARTIAL | Some behaviour was verified, but the complete acceptance criteria were not established. |

Verification methods should be distinguished when reporting results.

Examples include:

- `PASS — Manual`
- `PASS — Automated`
- `PASS — Build`
- `Code review completed`

Historical results should remain recorded after defects are corrected.

For example, a September FAIL may be preserved alongside an October automated regression PASS and a successful November final manual review.

---

## Regression Testing

The initial September manual testing identified two frontend issues that were subsequently addressed.

| Test | Initial Finding | Later Verification |
|---|---|---|
| FE-14 — Invalid numeric item values | Zero dimensions were accepted by the earlier frontend | Fix merged through PR #55, associated with issue #54; October automated regression PASS |
| FE-20 — Repeated packing | Earlier Pack again action provided no visible response | October automated regression PASS; November re-optimisation check PASS |

Additional automated regression coverage included Solver failure handling and JSON null-quantity validation.

The detailed test evidence, issue references and results are recorded in `test-run-template.md`.

The README intentionally contains only a summary to avoid duplicating the full test execution record.

---

## Testing Results Summary

The main recorded testing results are:

| Period | Verification | Result |
|---|---|---|
| September 2026 | Initial manual frontend testing | 17 PASS, 2 FAIL, 1 BLOCKED, 12 NOT RUN |
| October 2026 | Automated frontend tests on `main` | 247 PASS, 0 FAIL |
| October 2026 | Production build | PASS |
| October 2026 | JSON null-quantity feature-branch tests | 248 PASS, 0 FAIL |
| November 2026 | Final recorded manual checks | 17 PASS, 0 FAIL |
| November 2026 | Completed-project manual review | PASS — No errors reported |

### Final Testing Outcome

The September testing identified frontend issues involving numeric item validation and repeated packing.

Automated regression testing in October verified the corresponding frontend improvements, and the production build completed successfully.

November testing was conducted as part of the final review of the completed FitPortal application before submission.

All 17 individually recorded November manual checks passed. The tester also confirmed that the completed application's reviewed functionality worked as intended and that no errors were identified during the final review.

**Final Manual Review Status: PASS**

**Recorded November Checks: 17/17 PASS**

**Errors Reported During Final Review: 0**

These results describe the recorded testing and the tester's final review. Detailed scenario evidence and environment-specific integration coverage remain documented in the accompanying test files.

---

## Related Documentation

For detailed information, refer to:

- **`manual-test-cases.md`** — Test definitions, expected results, historical observations and verification evidence.
- **`test-run-template.md`** — Recorded September, October and November execution results.

This README provides the testing overview and instructions without duplicating the detailed records.

---
