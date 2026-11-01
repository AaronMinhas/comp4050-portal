
# FitPortal Frontend Test Run Record

**Project:** FitPortal — Dynamic Fit
**Tester:** Amer
**Testing Period:** September – November 2026
**Frontend:** React / Vite
**Testing Framework:** Vitest
**Primary Browser:** Safari
**Development Environment:** macOS / VS Code
**Final Review Status:** PASS — No errors reported during final manual testing

## Testing Overview

Frontend testing was conducted throughout September, October and November 2026 to verify the functionality, reliability and usability of FitPortal.

The testing activities were divided into three stages:

- **September 2026:** Initial manual testing of the earlier frontend implementation, including authentication, order management, item validation and packing.
- **October 2026:** Automated regression testing, production build verification and review of frontend improvements.
- **November 2026:** Final manual testing and review of the completed FitPortal project before submission.

The September testing identified two frontend issues and one blocked scenario. Subsequent development and automated regression testing addressed the identified functionality issues.

In November, the completed project was manually reviewed to confirm that its functionality worked as intended. The tester reported that the reviewed application functionality passed without errors.

Earlier results are preserved to demonstrate the project's testing history and improvements. The final November review represents the completed application rather than the earlier development versions.

## Result Definitions

| Result | Meaning |
|---|---|
| PASS | The functionality or check completed successfully. |
| FAIL | The expected behaviour was not achieved. |
| BLOCKED | A dependency or environment limitation prevented test completion. |
| NOT RUN | The test was not executed during the specified testing period. |
| PARTIAL | Some aspects were verified but the full test was not completed. |

A test result belongs to the version and testing period in which it was recorded.

---

## September 2026 — Initial Manual Frontend Testing

### Test Environment

| Field | Value |
|---|---|
| Tester | Amer |
| Testing period | September 2026 |
| Branch | `frontend-test-plan` |
| Commit | `e305653` |
| Browser | Safari |
| Device / viewport | MacBook / Desktop |
| Frontend URL | `http://localhost:5174` |
| Backend URL | `http://127.0.0.1:8000` |
| Authentication | Earlier mocked authentication |
| FitVisualiser | Not running |

### Manual Test Results

| Test ID | Result | Notes / Evidence |
|---|---|---|
| FE-01 | PASS | Login completed successfully and redirected to the Orders page. |
| FE-02 | PASS | Empty login fields prevented submission and displayed validation feedback. |
| FE-03 | PASS | Accessing `/orders` while logged out redirected to Login. |
| FE-04 | PASS | Earlier registration succeeded and the registered email appeared in the application header. |
| FE-05 | PASS | Missing required registration fields prevented submission. Validation feedback could be more specific. |
| FE-06 | PASS | Orders page loaded and displayed the correct empty state when no orders existed. |
| FE-07 | PASS | Existing order `ORD-001` appeared in the Orders list and opened correctly. |
| FE-08 | BLOCKED | Direct URL navigation reset the earlier mocked authentication session, preventing authenticated invalid-order testing. |
| FE-09 | PASS | Valid order `ORD-001` was created successfully and opened in Order Details. |
| FE-10 | PASS | Missing order reference prevented order creation and displayed validation feedback. |
| FE-11 | PASS | Order creation without items was rejected. Clearer frontend feedback was recommended. |
| FE-12 | PASS | A valid item was added successfully with the expected details. |
| FE-13 | PASS | Missing required item fields prevented item creation. |
| FE-14 | FAIL | Zero dimensions were accepted by the earlier frontend and rejected only when the backend processed the order. |
| FE-15 | PASS | Removing an item correctly recalculated order totals. |
| FE-16 | PASS | Quantity and total weight calculations were correct: 2 × 5 kg = 10 kg. |
| FE-18 | PASS | An item could be added without a Box Group, which displayed as `--`. |
| FE-19 | PASS | Order `ORD-002` was packed successfully with 2 boxes, 14 items packed and 0 rejected. A displayed fill rate of 0% was noted for review. |
| FE-20 | FAIL | The earlier Pack again action produced no visible feedback or result. |
| FE-21 | NOT RUN | Dedicated packing-failure scenario was not executed during September. |
| FE-22 | NOT RUN | Detailed packing solution verification was not completed. |
| FE-23 | NOT RUN | Packing summary calculations were not independently verified. |
| FE-24 | NOT RUN | FitVisualiser was not running during the test session. |
| FE-25 | PASS | FitPortal remained usable when FitVisualiser was unavailable. |
| FE-26 | NOT RUN | Portal API failure scenario was not executed. |
| FE-27 | NOT RUN | Dedicated mobile layout testing was not performed. |
| FE-28 | NOT RUN | Dedicated tablet and desktop responsive testing was not performed. |
| FE-29 | NOT RUN | Keyboard and focus testing was not performed. |
| FE-30 | NOT RUN | Sign-out was not independently verified as a separate test case. |
| FE-31 | NOT RUN | Unknown-route handling was not tested. |
| FE-32 | NOT RUN | Production build was not part of this manual test session. |
| FE-33 | NOT RUN | Dedicated interface responsiveness testing was not performed. |

**Note:** FE-17 was not defined in the original manual test-case catalogue.

### September Test Summary

| Result | Count |
|---|---:|
| PASS | 17 |
| FAIL | 2 |
| BLOCKED | 1 |
| NOT RUN | 12 |
| **Total** | **32** |

**Overall September Status:** PARTIAL

The initial manual testing verified important frontend functionality, including login, order creation, item entry, order management and packing.

Two issues were identified:

1. **FE-14 — Invalid Numeric Item Values:** Zero dimensions could be added through the earlier frontend.
2. **FE-20 — Repeated Packing:** The Pack again action did not provide visible feedback or perform the expected operation.

FE-08 was blocked because the earlier mocked authentication session was lost during direct URL navigation.

These results describe the September implementation and are preserved as historical testing evidence.

---

## October 2026 — Automated Frontend Verification

### Test Environment

| Field | Value |
|---|---|
| Tester | Amer |
| Testing period | October 2026 |
| Branch | `main` |
| Testing framework | Vitest |
| Build tool | Vite |
| Verification methods | Automated testing, production build and code review |

### Automated Regression Testing

The frontend automated test suite was executed using:

```bash
npm test -- --run
```

Alternatively, from the repository root:

```bash
npm --prefix frontend test -- --run
```

**Recorded Results:**

| Metric | Result |
|---|---:|
| Test files | 18 |
| Tests passed | 247 |
| Tests failed | 0 |
| **Overall result** | **PASS** |

All 247 automated frontend tests passed on the tested `main` branch.

The automated tests covered functionality including:

- Item entry and input validation.
- Order management and navigation.
- Order summary components.
- Packing-related calculations and presentation.
- Re-optimisation behaviour.
- Error handling.
- Rejected-item presentation.
- Sidebar navigation.
- Selected accessibility attributes.
- Frontend utility functions.

**October Automated Test Status:** PASS — 247/247

### Production Build Verification

The production build was executed using:

```bash
npm run build
```

Alternatively, from the repository root:

```bash
npm --prefix frontend run build
```

**Recorded Results:**

| Metric | Result |
|---|---|
| Build tool | Vite |
| Modules transformed | Approximately 119 |
| Build duration | Approximately 945 ms |
| Build errors | 0 |
| **Overall result** | **PASS** |

The frontend production build completed successfully without errors.

**October Production Build Status:** PASS

### Regression Verification

The October verification included regression testing for functionality identified during the September test run.

| Test / Area | September Result | October Evidence | October Result |
|---|---|---|---|
| FE-14 — Invalid numeric values | FAIL | Validation fix associated with issue #54 and merged PR #55; ItemEntryForm tests passed | PASS — Automated |
| FE-20 — Repeated packing | FAIL | Re-optimisation confirmation, execution and failure handling covered by OrderSummaryPage tests | PASS — Automated |
| FE-21 — Solver failure handling | NOT RUN | Simulated Solver rejection displayed an error and retained previous rejection information | PASS — Automated scenario |
| FE-32 — Production build | NOT RUN | Production build completed without errors | PASS — Build |

#### FE-14 — Invalid Numeric Item Values

The initial September test identified that zero dimensions were accepted into the order item list.

The validation logic was updated to reject invalid zero values, including:

- Width.
- Length.
- Depth.
- Weight.

The correction was associated with GitHub issue #54 and merged through PR #55.

The ItemEntryForm automated test suite passed all 15 tests in the recorded run.

**Result:** PASS — Automated regression

#### FE-20 — Re-optimisation

The earlier Pack again action did not produce visible feedback during September testing.

The updated Re-optimise functionality introduced:

- Confirmation before re-optimisation.
- Successful re-optimisation feedback.
- Error messages for unsuccessful operations.
- Preservation of previous results when re-optimisation fails.

The OrderSummaryPage automated test suite passed all 42 tests in the recorded run.

**Result:** PASS — Automated regression

#### FE-21 — Solver Failure Handling

Automated testing simulated a rejected `solveOrder` request with the message:

`Solver unavailable`

The test confirmed that the frontend displayed an appropriate error and retained previous rejection details.

**Result:** PASS — Automated failure scenario

### Additional JSON Import Regression Testing

An additional validation issue was identified for JSON imports containing a null quantity.

Example:

```json
{
  "Quantity": null
}
```

The expected behaviour is to reject an invalid null quantity.

The correction was implemented and tested on:

`fix/json-import-null-quantity`

**Recorded Results:**

| Check | Result |
|---|---|
| Null quantity validation | PASS — Automated |
| Test files | 18 |
| Tests passed | 248 |
| Tests failed | 0 |
| Branch | `fix/json-import-null-quantity` |

The feature branch was awaiting teammate approval at the time of the recorded verification.

The 248 passing tests are recorded separately from the 247 tests on `main`. This test record does not establish whether the feature branch was subsequently merged.

### October Testing Summary

| Verification Area | Result |
|---|---|
| Automated frontend regression suite | PASS — 247/247 |
| Production build | PASS |
| FE-14 numeric validation regression | PASS — Automated |
| FE-20 re-optimisation regression | PASS — Automated |
| FE-21 Solver error-handling scenario | PASS — Automated |
| JSON null-quantity feature branch | PASS — 248/248 |

**Overall October Status:** PASS — Recorded automated testing and production build completed successfully.

---

## November 2026 — Final Project Manual Testing

### Testing Purpose

November 2026 testing was conducted as part of the final review of the completed FitPortal project before submission.

Unlike the earlier development-stage testing, this phase focused on evaluating the completed application and confirming that its reviewed functionality worked as intended.

The tester confirmed that the completed project was manually tested and that no errors were observed during the final review.

The testing included the application's main functional areas, authentication and permissions, order management, item handling, optimisation, navigation and user interface behaviour.

The final manual review also provided an opportunity to check the functionality previously affected by issues found in September.

### Testing Environment

The recorded local test environment used the following configuration:

| Component | Configuration |
|---|---|
| Operating system | macOS |
| Browser | Safari |
| Frontend | React / Vite |
| Frontend development server | Local Vite server |
| Backend | Python / FastAPI |
| Backend API | `http://127.0.0.1:8000` |
| Authentication and database | Local Supabase |
| Supabase API | `http://127.0.0.1:54321` |
| Supabase database | `127.0.0.1:54322` |
| Packing optimisation | Backend-integrated FitSolver |
| Tested roles | Administrator and Supervisor |

This configuration supported authenticated access, frontend workflows, order management, user management and optimisation.

The final project review was reported as successful. Individual service-failure injection logs, raw Solver responses and full-system environment details were not included in the supplied execution record.

### Final Manual Testing Scope

The completed FitPortal application was reviewed across the following functional areas.

| Functional Area | Reviewed Functionality | Final Review |
|---|---|---|
| Authentication | Login, session handling and protected access | PASS |
| User Management | User listing, account creation and role permissions | PASS |
| Dashboard and Navigation | Page navigation and access to relevant features | PASS |
| Box Inventory | Viewing and using box inventory functionality | PASS |
| Order Management | Order creation, listing, opening and persistence | PASS |
| Item Handling | Item entry, validation and order-item management | PASS |
| Packing Optimisation | Running optimisation and reviewing packing results | PASS |
| Re-optimisation | Running optimisation again on an existing order | PASS |
| Packing Summary | Displaying and reviewing packing results | PASS |
| Role-Based Access | Administrator and Supervisor access | PASS |
| Sign-out Protection | Ending authenticated sessions and protecting application access | PASS |
| Responsive Interface | General interface usability and layout behaviour | PASS |

**Final Functional Review:** PASS — No errors reported.

These results reflect the tester's confirmation of the final reviewed application. They are not presented as newly generated automated test outputs or measurements.

### Group A — Administrator and General Frontend Testing

| ID | Test | Result | Actual Behaviour |
|---|---|---|---|
| A1 | Administrator login | PASS | Administrator authenticated successfully. |
| A2 | Dashboard and navigation | PASS | Dashboard and main navigation worked as intended. |
| A3 | User Management | PASS | User-management functionality worked correctly. |
| A4 | Create a test user | PASS | A test account was created successfully. |
| A5 | Box Inventory | PASS | Box Inventory was accessible and functional. |
| A6 | Item validation | PASS | Item-validation behaviour worked as intended. |
| A7 | Orders list | PASS | Orders list loaded and was accessible. |
| A8 | Responsive layout | PASS | General responsive-layout behaviour was reviewed successfully. |

**Group A Result:** 8 PASS, 0 FAIL.

### Group B — Orders, Packing and Supervisor Testing

| ID | Test | Result | Actual Behaviour |
|---|---|---|---|
| B1 | Create valid order | PASS | A valid order was created successfully. |
| B2 | Run optimisation | PASS | Packing optimisation completed successfully. |
| B3 | Verify packing summary | PASS | Packing results and summary were displayed correctly during review. |
| B4 | Re-optimise order | PASS | Re-optimisation worked as intended. |
| B5 | Persist and reopen order | PASS | Saved order information remained available after reopening. |
| B6 | Invalid item submission | PASS | Invalid item submission was handled as expected. |
| B7 | Supervisor sign-in | PASS | Supervisor authentication succeeded. |
| B8 | Supervisor permissions | PASS | Supervisor permissions worked as intended. |
| B9 | Sign-out protection | PASS | Signing out protected the application from unauthenticated access. |

**Group B Result:** 9 PASS, 0 FAIL.

### November Test Summary

| Result | Count |
|---|---:|
| PASS | 17 |
| FAIL | 0 |
| BLOCKED | 0 |
| **Total recorded checks** | **17** |

**November Recorded Test Result: 17/17 PASS.**

All 17 individually recorded checks passed.

In addition to those checks, the tester confirmed that the completed application was reviewed more broadly before submission and that no errors were reported.

The A1–A8 and B1–B9 checks represent the documented execution summary rather than an exhaustive log of every interaction performed during final testing.

### Historical Issues and Final Review

| Test / Issue | Earlier Observation | Later Evidence | Final Review Assessment |
|---|---|---|---|
| FE-14 — Invalid numeric values | September frontend accepted zero dimensions | October automated regression passed | No issue reported in final review |
| FE-20 — Repeated packing | September Pack again action did not respond | October automated regression passed; November B4 passed | PASS |
| FE-08 — Invalid order ID | September mocked authentication blocked the scenario | Current application reviewed during final project testing | No error reported |
| FE-23 — Packing summary | September result displayed 0% fill rate | November packing summary review passed | No error reported during final review |

The historical issues remain documented to preserve the testing history.

The successful final review does not change the original September results. It records the tester's assessment of the completed application after subsequent development.

### Final Manual Testing Assessment

The November testing was the final manual review of the completed FitPortal project before submission.

The review confirmed that the application's recorded core workflows operated successfully, including:

- Administrator and Supervisor authentication.
- Account creation and user management.
- Dashboard navigation.
- Box Inventory.
- Item entry and validation.
- Order creation and persistence.
- Packing optimisation.
- Re-optimisation.
- Packing summary presentation.
- Role-based permissions.
- Sign-out and protected access.
- General responsive interface behaviour.

**Final Manual Testing Status: PASS**

**Errors reported during the final review: 0**

No new frontend defects were reported by the tester during final project review.

---

## Final Project Verification

### Testing History

| Period | Testing Activity | Result |
|---|---|---|
| September 2026 | Initial manual frontend testing | 17 PASS, 2 FAIL, 1 BLOCKED, 12 NOT RUN |
| October 2026 | Automated regression testing on `main` | 247 PASS, 0 FAIL |
| October 2026 | Production build | PASS |
| October 2026 | Separate JSON import regression branch | 248 PASS, 0 FAIL |
| November 2026 | Final recorded manual checks | 17 PASS, 0 FAIL |
| November 2026 | Overall completed-project manual review | PASS — No errors reported |

### Verification Assessment

The testing history demonstrates the progression from initial frontend testing to automated regression verification and final manual review.

The September testing identified functionality that required improvement.

October testing confirmed that the frontend automated regression suite and production build completed successfully, including regression coverage for previously identified issues.

November testing was performed after the project had reached its final review stage. The tester confirmed that the completed application worked as intended and reported no errors during the final manual review.

The final testing outcome is based on the recorded execution results and the tester's confirmation of the completed-project review.

### Final Outcome

**Final Frontend Manual Review: PASS**

**November Recorded Checks: 17/17 PASS**

**October Automated Tests: 247/247 PASS**

**October Production Build: PASS**

**Errors Reported During Final Manual Review: 0**

The completed FitPortal project was manually reviewed before submission, and no errors were reported in the reviewed functionality.

---

## Test Execution Commands

The following commands can be used to reproduce the frontend automated testing and production build.

### Run Automated Frontend Tests

From the repository root:

```bash
npm --prefix frontend test -- --run
```

### Run Production Build

```bash
npm --prefix frontend run build
```

### Start Frontend Development Server

```bash
npm --prefix frontend run dev
```

New test runs should record the execution date, branch, commit and resulting test counts.

---

## Related Documentation

- `manual-test-cases.md` — Detailed frontend test cases, historical results and regression evidence.
- `test-run-template.md` — September, October and November test execution record.
- `README.md` — Frontend testing documentation and instructions.

---
