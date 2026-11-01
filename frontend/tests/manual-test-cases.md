
# FitPortal Manual Frontend Test Cases

These test cases verify the main FitPortal frontend workflows, including authentication, order management, item validation, packing, FitVisualiser integration, error handling, navigation, accessibility and responsiveness.

## Testing Periods

- **September 2026:** Initial manual frontend testing using the earlier application implementation and mocked authentication.
- **October 2026:** Frontend verification against the updated implementation, including automated regression tests, source-code review and production build validation.
- **November 2026:** Standalone local manual testing using the configured FitPortal frontend, backend, Supabase services and backend-integrated FitSolver.

The September results are retained as historical evidence. October automated verification and November manual results are recorded separately so that earlier failures and subsequent regression checks remain traceable.

## Result Values

Use one of the following results:

- **PASS** — The expected functionality was verified successfully.
- **FAIL** — The expected functionality did not work.
- **BLOCKED** — The test could not be completed because of another limitation or dependency.
- **NOT RUN** — The test has not yet been executed.
- **PARTIAL** — Some aspects were verified, but the complete acceptance criteria were not established.

### Verification Methods

- **Manual:** Functionality was tested through the application interface.
- **Automated:** Functionality was verified by an automated test.
- **Code review:** The relevant implementation was inspected, but the behaviour was not necessarily executed.
- **Build:** The production build was executed successfully.

A code-review finding is not equivalent to a manual PASS. Automated results are identified separately from manual results.

### Testing Summary

| Period | Verification | Result |
|---|---|---|
| September 2026 | Initial manual test cases | 17 PASS, 2 FAIL, 1 BLOCKED, 12 NOT RUN |
| October 2026 | Automated tests on `main` | 247 PASS, 0 FAIL, across 18 files |
| October 2026 | Production build | PASS |
| November 2026 | Standalone manual checks | 17 PASS, 0 FAIL |

There are 32 defined FE test cases. FE-17 is not defined in the original numbering.

The November manual checks use identifiers A1–A8 and B1–B9. They support related FE cases but do not automatically establish that every individual step in the original FE case was executed.

---

## Authentication

### FE-01 — Login with valid credentials

**Priority:** High

**Steps:**

1. Open the Login page.
2. Enter a valid email and password.
3. Click Sign in.

**Expected Result:**

The user is authenticated and redirected to the Orders page.

**September Result:** PASS

**September Actual Behaviour:**

Login was successful and the user was redirected to the Orders page.

**September Evidence / Notes:**

Valid mock credentials allowed access to the application.

**October Verification:** NOT RUN — Manual

**October Evidence / Notes:**

The updated implementation uses Supabase authentication through `signInWithPassword`.

The local frontend environment did not contain the required Supabase configuration during the October review.

The authenticated login workflow therefore required a configured environment and valid test credentials before manual verification.

**November Verification:** PASS — Manual

**November Evidence / Notes:**

- A1 — Administrator login: PASS.
- B7 — Supervisor sign-in: PASS.

Both account types were successfully used during the standalone local testing session.

---

### FE-02 — Login validation with empty fields

**Priority:** High

**Steps:**

1. Open the Login page.
2. Submit with both fields empty.
3. Test with only the email entered.
4. Test with only the password entered.

**Expected Result:**

Login is prevented and appropriate validation feedback is displayed.

**September Result:** PASS

**September Actual Behaviour:**

Missing fields correctly prevented login.

The application displayed a general message asking for the email and password.

**September Evidence / Notes:**

The functionality worked, but the validation message was too general.

Suggested improvements:

- Both missing: "Enter your email and password to continue."
- Email missing: "Enter your email to continue."
- Password missing: "Enter your password to continue."

**October Verification:** Code review completed; manual test NOT RUN.

**October Evidence / Notes:**

The current Login page includes required email and password fields and checks for missing credentials.

The implementation includes the message:

`Enter an email and password to continue.`

The complete validation behaviour still requires manual verification.

**November Verification:** NOT RUN — Dedicated test

**November Evidence / Notes:**

Successful Administrator and Supervisor logins were recorded, but the November execution record does not identify separate empty-email or empty-password tests.

The September PASS remains historical evidence.

---

### FE-03 — Protected route while logged out

**Priority:** High

**Steps:**

1. Sign out.
2. Enter `/orders` directly in the browser.

**Expected Result:**

The user cannot access the protected Orders page and is redirected to Login.

**September Result:** PASS

**September Actual Behaviour:**

Direct access to `/orders` while logged out redirected to the Login page.

**September Evidence / Notes:**

Protected route behaviour worked correctly.

**October Verification:** Code review completed; manual test NOT RUN.

**October Evidence / Notes:**

The updated application uses `AppLayout` to protect authenticated routes.

When authentication initialisation is complete and no user identity exists, the layout redirects to `/login`.

The behaviour was confirmed in the implementation but was not independently retested in a configured October environment.

**November Verification:** PASS — Manual sign-out protection

**November Evidence / Notes:**

B9 — Sign-out protection: PASS.

The November session verified that protected functionality was not accessible after sign-out.

The exact direct-URL sequence used during this check was not separately recorded.

---

### FE-04 — Create an account with valid details

**Priority:** High

**Steps:**

1. Sign in with an account authorised to manage users.
2. Open User Management.
3. Click Create account.
4. Enter a valid email and temporary password.
5. Optionally enter a display name.
6. Select an available role.
7. Submit the form.
8. Verify that the account appears in User Management.

**Expected Result:**

The account is created successfully and appears in the user list with the correct details and role.

**September Result:** PASS

**September Actual Behaviour:**

The earlier public registration workflow succeeded and redirected the user to the Orders page.

The registered email appeared in the application header.

**September Evidence / Notes:**

Valid registration worked in the earlier frontend implementation.

**October Verification:** Code review completed; manual test NOT RUN.

**October Evidence / Notes:**

The current frontend no longer provides the earlier public registration route.

Account creation is available through the Create account modal in `UserManagementPage.jsx`.

The form submits the account using `createUser(account)`.

Available roles depend on the current user's role:

- Administrator: User or Supervisor.
- Supervisor: User.

Successful account creation and resulting account details required verification against a configured backend.

**November Verification:** PASS — Manual

**November Evidence / Notes:**

- A3 — User Management: PASS.
- A4 — Create a test user: PASS.
- B8 — Supervisor permissions: PASS.

The November session successfully exercised user-management functionality, account creation and Supervisor role permissions.

---

### FE-05 — Account creation validation

**Priority:** High

**Steps:**

1. Open User Management.
2. Select Create account.
3. Attempt to submit without an email.
4. Attempt to submit without a temporary password.
5. Enter an invalid email format.
6. Enter a temporary password shorter than eight characters.
7. Enter valid required details and submit.

**Expected Result:**

Invalid account details are rejected and the user receives appropriate validation feedback.

The account should not be created until all required details are valid.

**September Result:** PASS

**September Actual Behaviour:**

The earlier registration form prevented submission when required fields were missing.

The application displayed:

`Fill in name, email and password.`

**September Evidence / Notes:**

Validation worked, but the message was too general.

Depot / Site was optional in the earlier registration form.

**October Verification:** Code review completed; manual test NOT RUN.

**October Evidence / Notes:**

The current Create account modal uses the following constraints:

- Email: required, with `type="email"`.
- Temporary password: required, with `minLength="8"`.
- Display name: optional.

The implementation trims and lowercases the email before submission.

Browser validation and backend validation should be tested with invalid inputs before marking the updated workflow PASS.

**November Verification:** NOT RUN — Dedicated validation test

**November Evidence / Notes:**

Account creation was successful in November, but separate invalid-email, missing-password and short-password cases were not recorded.

The original September result remains preserved.

---

## Orders

### FE-06 — Orders list loads

**Priority:** High

**Steps:**

1. Log in.
2. Open the Orders page.

**Expected Result:**

Orders are displayed correctly.

If no orders exist, a suitable empty state is displayed.

**September Result:** PASS

**September Actual Behaviour:**

The Orders page loaded successfully and displayed an empty state with zero orders when no orders existed.

**September Evidence / Notes:**

The empty-order state displayed correctly.

**October Verification:** Code review completed; manual test NOT RUN.

**October Evidence / Notes:**

The current Orders page includes loading, error and empty-list states.

It displays `No active orders` when the active order list is empty.

The authenticated workflow required manual verification.

**November Verification:** PASS — Manual

**November Evidence / Notes:**

- A2 — Dashboard and navigation: PASS.
- A7 — Orders list: PASS.

The Orders list was successfully accessed in the configured standalone application.

A separate empty-state check was not recorded.

---

### FE-07 — Open existing order

**Priority:** High

**Steps:**

1. Open the Orders page.
2. Select an existing order.

**Expected Result:**

The correct Order Details page opens.

**September Result:** PASS

**September Actual Behaviour:**

Existing order `ORD-001` appeared in the Orders list with Draft status and could be opened successfully.

**September Evidence / Notes:**

Correct order information was displayed.

**October Verification:** Automated navigation coverage identified; manual test NOT RUN.

**October Evidence / Notes:**

`OrdersListPage.test.jsx` contains navigation assertions for opening orders.

These automated checks provide supporting evidence but do not replace an end-to-end manual test with the current backend.

**November Verification:** PASS — Manual

**November Evidence / Notes:**

B5 — Persist and reopen order: PASS.

The standalone session verified that an order could be reopened after saving.

---

### FE-08 — Invalid order ID

**Priority:** Medium

**Steps:**

1. Sign in.
2. Attempt to open an invalid order ID, such as `/orders/ORD-999999`.

**Expected Result:**

A clear not-found or error state is displayed without crashing the application.

**September Result:** BLOCKED

**September Actual Behaviour:**

Entering the invalid order URL directly caused the application to reload and return to the Login page because the mocked authentication state was lost.

**September Evidence / Notes:**

Invalid-order handling could not be tested while authenticated through direct URL navigation.

This was a limitation of the mocked authentication implementation.

**October Verification:** Code review completed; manual test NOT RUN.

**October Evidence / Notes:**

`OrderSummaryPage.jsx` includes handling for order-loading errors and displays an `Order not found` message when an order is unavailable.

The current Supabase authentication implementation may allow the test to be performed with a persistent session, but this was not verified in October.

The September BLOCKED result remains part of the historical record.

**November Verification:** NOT RUN — Exact scenario

**November Evidence / Notes:**

The November session successfully reopened a saved order under B5.

However, reopening a valid order does not verify the invalid-ID scenario.

This test remains outstanding.

---

## Order Creation

### FE-09 — Create a valid order

**Priority:** High

**Steps:**

1. Open New Order.
2. Enter an order reference.
3. Add at least one valid item.
4. Click Create order.

**Expected Result:**

The order is created and its Order Details page is displayed.

**September Result:** PASS

**September Actual Behaviour:**

A valid order was created successfully as `ORD-001`, and the application redirected to its Order Details page.

**September Evidence / Notes:**

Order information and totals were displayed correctly.

**October Verification:** NOT RUN — Manual

**October Evidence / Notes:**

Creating a complete order against the current API required an authenticated, configured environment.

**November Verification:** PASS — Manual

**November Evidence / Notes:**

B1 — Create valid order: PASS.

The valid-order creation workflow succeeded using the locally configured frontend and backend.

---

### FE-10 — Missing order reference

**Priority:** High

**Steps:**

1. Open New Order.
2. Leave Order Reference empty.
3. Add a valid item.
4. Attempt to create the order.

**Expected Result:**

Order creation is prevented and a clear validation message is displayed.

**September Result:** PASS

**September Actual Behaviour:**

Order creation was prevented.

**September Evidence / Notes:**

The application displayed:

`Add a reference so the depot can identify this order.`

The message clearly explained the problem.

**October Verification:** NOT RUN — Manual

**October Evidence / Notes:**

The current form should be tested to confirm that the order reference remains required and that its validation message is clear.

**November Verification:** NOT RUN — Dedicated test

**November Evidence / Notes:**

The November session verified valid-order creation and invalid item submission.

A missing-order-reference test was not separately recorded.

---

### FE-11 — Create order with no items

**Priority:** High

**Steps:**

1. Open New Order.
2. Enter a valid Order Reference.
3. Do not add any items.
4. Click Create order.

**Expected Result:**

Order creation is prevented and the user is told that at least one item is required.

**September Result:** PASS

**September Actual Behaviour:**

Order creation was blocked when no items were present.

**September Evidence / Notes:**

The application displayed:

`The server rejected this order. Check the item details.`

The order was correctly rejected, but the message could be clearer.

Suggested message:

`Add at least one item before creating the order.`

**October Verification:** NOT RUN — Manual

**October Evidence / Notes:**

The current order-creation workflow requires verification to confirm that empty orders are rejected and that the user receives an appropriate message.

**November Verification:** NOT RUN — Dedicated test

**November Evidence / Notes:**

The November session confirmed valid-order creation, but no empty-order submission result was separately recorded.

---

## Item Entry and Validation

### FE-12 — Add a valid item

**Priority:** High

**Steps:**

1. Open New Order.
2. Enter valid item details.
3. Add the item.

**Expected Result:**

The item appears in the order item list with the entered details.

**September Result:** PASS

**September Actual Behaviour:**

The valid item was added successfully and appeared in the order.

**September Evidence / Notes:**

Valid item entry worked correctly.

**October Verification:** Automated regression coverage available; manual test NOT RUN.

**October Evidence / Notes:**

`ItemEntryForm.test.jsx` provides automated coverage of item-entry behaviour.

A complete manual order-creation test remained outstanding in October.

**November Verification:** PASS — Manual

**November Evidence / Notes:**

B1 — Create valid order: PASS.

The November order-creation workflow included valid item entry.

---

### FE-13 — Required item validation

**Priority:** High

**Steps:**

1. Leave one required item field empty.
2. Fill the remaining required fields.
3. Attempt to add the item.

**Expected Result:**

The item is not added and appropriate validation feedback is displayed.

**September Result:** PASS

**September Actual Behaviour:**

Missing required item data prevented the item from being added.

The application displayed:

`Item code, reference, dimensions and weight are required.`

**September Evidence / Notes:**

Validation worked, but the message was too general.

It should identify the specific missing field or fields rather than listing every required field.

**October Verification:** Automated regression coverage available; manual test NOT RUN.

**October Evidence / Notes:**

`ItemEntryForm.test.jsx` contains validation tests, including checks for invalid input states.

The current validation messages and complete manual behaviour had not been independently retested in October.

**November Verification:** PASS — General item-validation checks

**November Evidence / Notes:**

- A6 — Item validation: PASS.
- B6 — Invalid item submission: PASS.

The November session verified invalid-item handling.

The specific missing-field combinations were not individually documented.

---

### FE-14 — Invalid numeric item values

**Priority:** High

**Steps:**

1. Enter invalid numeric item values.
2. Test zero dimensions.
3. Test negative weight.
4. Test weight above the maximum.
5. Attempt to add the item.

**Expected Result:**

Invalid numeric values are rejected before the item is added.

**September Result:** FAIL

**September Actual Behaviour:**

Negative weight values were prevented by input validation.

Entering `-1`, for example, displayed a message stating that the value must be greater than or equal to zero.

Weight values above the 32 kg maximum were also rejected.

However, dimensions of `0 × 0 × 0 mm` were accepted by the frontend and the item could be added to the order.

The invalid order was rejected only when the backend processed the order-creation request.

**September Evidence / Notes:**

Observed behaviour:

- Negative weight (`-1`): rejected.
- Weight `0`: allowed by the earlier frontend input constraint.
- Weight above `32 kg`: rejected.
- Dimensions `0 × 0 × 0 mm`: accepted into the frontend order.
- Creating an order containing zero dimensions: rejected by the backend.

Frontend validation needed to prevent invalid zero dimensions before an item was added.

The handling of exactly `0 kg` also required clarification.

**October Verification:** PASS — Automated regression tests; manual retest NOT RUN.

**October Evidence / Notes:**

The numeric-validation defect was addressed through GitHub issue #54 and merged in PR #55.

Automated regression tests cover zero width, length, depth and weight.

The `ItemEntryForm` test suite passed with 15 tests.

The September failure is retained as historical evidence.

The October automated tests demonstrate that the corrected validation is covered, although a fresh manual test had not been completed at that time.

**November Verification:** PASS — General manual invalid-item testing

**November Evidence / Notes:**

- A6 — Item validation: PASS.
- B6 — Invalid item submission: PASS.

These November checks provide manual regression evidence for item validation.

However, the exact numeric boundary values entered during November were not recorded.

The September defect is therefore supported by October's specific automated regression tests and November's broader manual validation checks.

---

### FE-15 — Remove item

**Priority:** High

**Steps:**

1. Add two valid items.
2. Note the order summary.
3. Remove one item.

**Expected Result:**

Only the selected item is removed and the order totals update correctly.

**September Result:** PASS

**September Actual Behaviour:**

The selected item was removed successfully and the order summary updated correctly.

**September Evidence / Notes:**

Line-item, unit and weight totals were recalculated after removal.

**October Verification:** NOT RUN — Manual

**October Evidence / Notes:**

The item-removal workflow and recalculated totals should be confirmed in the current application.

**November Verification:** NOT RUN — Dedicated test

**November Evidence / Notes:**

The November execution record does not separately identify an item-removal and total-recalculation test.

The September PASS remains preserved as historical evidence.

---

### FE-16 — Quantity and total weight

**Priority:** High

**Steps:**

1. Add an item with quantity greater than one.
2. Check Total Units.
3. Check Total Weight.

**Expected Result:**

Quantity and total weight are calculated correctly.

**September Result:** PASS

**September Actual Behaviour:**

Quantity and total weight were calculated correctly.

**September Evidence / Notes:**

A quantity of two with an item weight of 5 kg produced a total weight of 10 kg.

**October Verification:** NOT RUN — Manual

**October Evidence / Notes:**

The current frontend should be checked using known quantities and weights to confirm that the displayed totals remain correct.

**November Verification:** NOT RUN — Dedicated numerical test

**November Evidence / Notes:**

The November session included valid order creation, but no independently recorded quantity-versus-weight calculation was supplied.

The September calculation remains the documented manual evidence.

---

### FE-18 — Optional Box Group

**Priority:** Medium

**Steps:**

1. Enter a valid item.
2. Leave Box Group empty.
3. Add the item.

**Expected Result:**

The item is added without requiring a Box Group.

**September Result:** PASS

**September Actual Behaviour:**

The item was added successfully with Box Group left empty.

**September Evidence / Notes:**

The item displayed `--` for Box Group.

**October Verification:** NOT RUN — Manual

**October Evidence / Notes:**

Optional Box Group behaviour should be verified against the current item-entry workflow.

**November Verification:** NOT RUN — Dedicated test

**November Evidence / Notes:**

The November testing session included valid order creation and item validation, but leaving Box Group empty was not recorded as a separate test.

The September PASS remains historical evidence.

---

## Packing

### FE-19 — Pack existing order

**Priority:** High

**Steps:**

1. Create or open a valid saved order.
2. Select Run Optimisation.
3. Wait for the optimisation to complete.
4. Review the packing result.

**Expected Result:**

Optimisation succeeds, the order status is updated and packing results are displayed.

**September Result:** PASS

**September Actual Behaviour:**

Packing completed successfully for `ORD-002`.

The order status changed to Packed and packing results appeared.

**September Evidence / Notes:**

Observed results:

- Boxes: 2
- Items Packed: 14
- Rejected: 0

The Fill Rate displayed `0%`. This requires further verification.

**October Verification:** Code review completed; manual test NOT RUN.

**October Evidence / Notes:**

The updated implementation uses Run Optimisation and the order status `OPTIMISED`.

`OrderSummaryPage.jsx` calls `solveOrder` and displays the resulting packing information.

The complete Solver workflow had not been manually retested against the current backend in October.

**November Verification:** PASS — Manual

**November Evidence / Notes:**

B2 — Run optimisation: PASS.

The November standalone session successfully exercised the optimisation workflow using the locally configured backend-integrated FitSolver.

This confirms that the workflow was usable in the standalone environment. It does not independently establish the numerical accuracy of every packing metric.

---

### FE-20 — Repeated packing

**Priority:** Medium

**Steps:**

1. Open an order with an existing optimisation result.
2. Select Re-optimise.
3. Review the confirmation dialog.
4. Confirm the operation.
5. Observe the result or error message.

**Expected Result:**

The application requests confirmation, performs re-optimisation and displays a clear result or error.

Existing packing information should not be lost unnecessarily if the request fails.

**September Result:** FAIL

**September Actual Behaviour:**

The earlier Pack again button was available, but clicking it produced no visible action, feedback or updated result.

**September Evidence / Notes:**

The interface needed to provide clear feedback when repeated packing was selected.

**October Verification:** PASS — Automated tests; manual retest NOT RUN.

**October Evidence / Notes:**

The updated interface uses Re-optimise.

`OrderSummaryPage.test.jsx` covers the re-optimisation workflow, including:

- Confirmation before re-optimisation.
- Successful completion.
- Failure messages.
- Preservation of previous results.

The Order Summary test suite passed with 42 tests.

The earlier September failure is retained for historical reference.

**November Verification:** PASS — Manual

**November Evidence / Notes:**

B4 — Re-optimise order: PASS.

The November session successfully exercised re-optimisation through the application interface.

This provides manual regression evidence for the earlier unresponsive repeated-packing action.

The separate failure scenario and preservation of previous results remain supported by October automated tests rather than November manual execution.

---

### FE-21 — Packing failure

**Priority:** High

**Steps:**

1. Cause or simulate a Solver or packing API failure.
2. Attempt to optimise an order.
3. Review the displayed error.
4. Check whether the existing order and packing information remain available.
5. Retry when the service is available.

**Expected Result:**

A clear error is displayed, the application remains usable and the user can recover or retry.

**September Result:** NOT RUN

**September Actual Behaviour:**

Not tested.

**September Evidence / Notes:**

No September execution evidence was recorded.

**October Verification:** PASS — Automated failure scenario; manual test NOT RUN.

**October Evidence / Notes:**

`OrderSummaryPage.test.jsx` includes a test in which `solveOrder` rejects with:

`Solver unavailable`

The test verifies that the error is displayed and previous rejection details remain visible.

The implementation also stores optimisation errors in `packError`.

A complete manual recovery and retry test remained outstanding.

**November Verification:** NOT RUN — Manual failure scenario

**November Evidence / Notes:**

Successful optimisation and re-optimisation were recorded during November.

However, deliberate Solver unavailability, failure recovery and retry were not separately tested.

The October automated failure scenario remains the supporting evidence.

---

### FE-22 — Packing solution

**Priority:** High

**Steps:**

1. Optimise a valid order.
2. Review the returned packing solution.
3. Check the displayed boxes and item placements.
4. Verify dimensions, weights and packed-item details.
5. Review any unpacked items.

**Expected Result:**

Packing solution information is displayed correctly and matches the returned Solver data.

**September Result:** NOT RUN

**September Actual Behaviour:**

Not tested.

**September Evidence / Notes:**

No September execution evidence was recorded.

**October Verification:** Code review and partial automated coverage; manual test NOT RUN.

**October Evidence / Notes:**

`PackingDetails.jsx` displays:

- Packed boxes.
- Box groups.
- Inner dimensions.
- Item placements.
- Contents weight.
- Packed weight.
- Fill rate.
- Unpacked items.

`PackingDetails.test.jsx` verifies the display and grouping of rejected items, including the removal of rejection details when all items are packed.

A complete successful packing solution had not been manually checked against actual Solver output.

**November Verification:** PARTIAL — Manual workflow evidence

**November Evidence / Notes:**

- B2 — Run optimisation: PASS.
- B3 — Verify packing summary: PASS.

These checks demonstrate that optimisation results were available and reviewed.

However, the November record does not include a field-by-field comparison of box dimensions, placements and weights against the returned Solver response.

The full FE-22 acceptance criteria therefore remain only partially verified.

---

### FE-23 — Packing summary

**Priority:** High

**Steps:**

1. Optimise a valid order.
2. Review the packing summary.
3. Check the number of boxes.
4. Check packed and rejected item totals.
5. Check the fill rate.
6. Check the execution time.
7. Compare displayed values with the returned Solver result.

**Expected Result:**

Packing summary values accurately represent the returned solution.

**September Result:** NOT RUN

**September Actual Behaviour:**

The full summary validation test was not completed.

**September Evidence / Notes:**

FE-19 recorded a displayed Fill Rate of `0%` for a result containing two boxes and 14 packed items.

**October Verification:** Code review completed; manual test NOT RUN.

**October Evidence / Notes:**

`OrderSummaryPage.jsx` displays:

- Boxes.
- Items packed.
- Rejected items.
- Fill rate.
- Execution time.

The summary fill rate is selected using:

`summary?.FillRate ?? solution.metrics.fill_rate`

The displayed percentage is calculated from that value.

Individual box fill rates are also displayed by `PackingDetails.jsx`.

The source of the September `0%` value has not been established.

The API summary, Solver metrics and frontend formatting should be compared using the same known packing result.

**November Verification:** PARTIAL — Packing summary reviewed successfully; numerical accuracy not independently verified

**November Evidence / Notes:**

B3 — Verify packing summary: PASS.

The November session confirmed that the packing summary could be reviewed after optimisation.

However, the test record does not include the underlying Solver response values or a numerical comparison.

Therefore, the earlier `0%` fill-rate observation remains unresolved.

The full numerical accuracy requirement should not be considered completely verified until the displayed values are compared with the actual Solver output.

---

## FitVisualiser

### FE-24 — FitVisualiser available

**Priority:** Medium

**Steps:**

1. Start FitVisualiser on its configured port.
2. Optimise a valid order.
3. Select Open Visualizer.
4. Verify that the visualisation loads.
5. Check that it represents the current packing solution.
6. If available, open the visualisation in a separate tab.

**Expected Result:**

The current packing solution opens successfully in FitVisualiser.

**September Result:** NOT RUN

**September Actual Behaviour:**

Not tested because FitVisualiser was not running.

**September Evidence / Notes:**

The test required the separate FitVisualiser application.

**October Verification:** Code review completed; integration test NOT RUN.

**October Evidence / Notes:**

The frontend constructs a visualiser URL using `VITE_VISUALISER_BASE`, defaulting to `http://localhost:5173`.

The Order Summary page includes:

- Open Visualizer.
- Refresh Visualizer access.
- Open in a new tab.
- An embedded visualiser iframe.

The visualiser requires a solution handoff URL.

Successful end-to-end visualisation had not been verified.

**November Verification:** NOT RUN — Full integration

**November Evidence / Notes:**

The November standalone environment included the FitPortal frontend, backend, Supabase and backend-integrated FitSolver.

The separate FitVisualiser application was not included in the standalone test environment.

FitVisualiser is part of the wider Dynamic Fit monorepo.

Full solution handoff, embedded visualisation and separate-tab access remain outstanding integration tests.

---

### FE-25 — FitVisualiser unavailable

**Priority:** Medium

**Steps:**

1. Leave FitVisualiser stopped.
2. Optimise an order.
3. Attempt to open the visualisation.
4. Return to FitPortal.
5. Confirm that packing results and other Portal functions remain available.

**Expected Result:**

FitPortal remains usable when the external visualiser is unavailable.

**September Result:** PASS

**September Actual Behaviour:**

The FitVisualiser link attempted to open `http://localhost:5173`, but Safari could not connect because FitVisualiser was not running.

Core FitPortal packing results remained available.

**September Evidence / Notes:**

FitPortal remained usable without FitVisualiser.

A possible usability improvement would be to detect when FitVisualiser is unavailable and display a clearer message instead of relying on the browser connection error.

**October Verification:** Code review completed; manual retest NOT RUN.

**October Evidence / Notes:**

The current visualiser is integrated through a separate URL and embedded iframe.

The main packing result is displayed independently of the visualiser.

The September manual PASS is retained.

**November Verification:** PARTIAL — Standalone operation confirmed

**November Evidence / Notes:**

The November session successfully created and optimised orders without the separate FitVisualiser application running.

This supports the conclusion that the main Portal workflow remains usable without FitVisualiser.

However, a dedicated November test of the Open Visualizer failure behaviour and recovery message was not recorded.

---

## API Failure Handling

### FE-26 — Portal API unavailable

**Priority:** High

**Steps:**

1. Stop or simulate an unavailable Portal API.
2. Open the Orders page or perform an API-dependent action.
3. Observe the error state.
4. Restore API availability.
5. Select Try again, where available.

**Expected Result:**

The frontend displays a clear failure state, does not crash and provides an appropriate recovery action.

**September Result:** NOT RUN

**September Actual Behaviour:**

Not tested.

**September Evidence / Notes:**

No September execution evidence was recorded.

**October Verification:** Code review completed; manual test NOT RUN.

**October Evidence / Notes:**

`OrdersListPage.jsx` displays:

`Cannot load orders`

The API error message is shown beneath the heading.

A Try again button calls the refresh function.

The implementation also includes loading and empty states.

The actual behaviour during a disconnected API and subsequent recovery had not been manually tested.

**November Verification:** NOT RUN — Deliberate API outage

**November Evidence / Notes:**

The November session used a functioning local backend.

No deliberate API disconnection and recovery test was recorded.

This case remains outstanding.

---

## Responsive Layout and Accessibility

### FE-27 — Mobile layout

**Priority:** Medium

**Steps:**

1. Open FitPortal using a mobile-sized viewport.
2. Navigate through the main pages.
3. Check navigation controls, tables, forms and dialogs.
4. Confirm that important actions remain accessible.

**Expected Result:**

Content remains readable and usable without major layout problems.

**September Result:** NOT RUN

**September Actual Behaviour:**

Not tested.

**September Evidence / Notes:**

No September mobile testing evidence was recorded.

**October Verification:** Code review completed; manual test NOT RUN.

**October Evidence / Notes:**

The frontend uses responsive layout utilities such as `flex-wrap`, responsive grid columns and horizontal table scrolling.

However, `Sidebar.jsx` uses `hidden` with `md:flex`, meaning the desktop sidebar is hidden below the medium breakpoint.

Mobile navigation must be checked to confirm that users can still reach all required pages.

Responsive CSS alone does not establish a manual PASS.

**November Verification:** PARTIAL — General responsive-layout check passed; mobile-specific verification outstanding

**November Evidence / Notes:**

A8 — Responsive layout: PASS.

A general responsive-layout check was reported during the November session.

However, exact mobile viewport dimensions, pages visited and navigation behaviour were not recorded.

The complete mobile-specific FE-27 test should be repeated with documented viewport sizes.

---

### FE-28 — Tablet and desktop layout

**Priority:** Medium

**Steps:**

1. Open the application using tablet and desktop viewport sizes.
2. Navigate through the main pages.
3. Check tables, forms, summaries and navigation.
4. Resize the browser window.
5. Check for clipping, overlap and unwanted horizontal scrolling.

**Expected Result:**

The layout adapts correctly and remains usable.

**September Result:** NOT RUN

**September Actual Behaviour:**

Not tested as a dedicated responsive-layout test.

**September Evidence / Notes:**

The earlier manual testing was performed using Safari on a MacBook desktop viewport.

This does not establish that the complete tablet and desktop responsive test was performed.

**October Verification:** Code review completed; manual test NOT RUN.

**October Evidence / Notes:**

Responsive grid layouts and wrapping controls are present in the Orders, Order Summary, Box Inventory and User Management pages.

Several tables use `overflow-x-auto`.

Actual viewport behaviour remained to be checked.

**November Verification:** PARTIAL — General responsive-layout check passed; exact viewport coverage incomplete

**November Evidence / Notes:**

A8 — Responsive layout: PASS.

The November session included a successful responsive-layout check.

However, separate tablet and desktop dimensions and page-by-page results were not documented.

The general check is recorded as PASS, while detailed viewport verification remains outstanding.

---

### FE-29 — Keyboard and focus

**Priority:** Medium

**Steps:**

1. Open FitPortal.
2. Navigate through forms and controls using Tab and Shift+Tab.
3. Activate buttons and links using the keyboard.
4. Open and close dialogs.
5. Check focus visibility and focus order.
6. Verify that validation errors are understandable.

**Expected Result:**

Interactive controls can be reached and used using the keyboard, with clear and predictable focus behaviour.

**September Result:** NOT RUN

**September Actual Behaviour:**

Not tested.

**September Evidence / Notes:**

No September keyboard accessibility evidence was recorded.

**October Verification:** Code review and partial automated coverage; manual test NOT RUN.

**October Evidence / Notes:**

The frontend includes accessibility attributes such as:

- `aria-label`
- `aria-describedby`
- `aria-invalid`
- `aria-current`
- `role="alert"`
- `role="dialog"`
- `aria-modal`

Automated tests verify selected accessibility attributes in the sidebar, tooltips, item-entry form and order controls.

A full keyboard-navigation and focus-management test had not been performed.

**November Verification:** NOT RUN — Dedicated keyboard test

**November Evidence / Notes:**

No complete keyboard-only navigation or focus-management test was recorded during November.

The October code review and automated assertions remain supporting evidence.

---

## Navigation

### FE-30 — Sign out

**Priority:** High

**Steps:**

1. Sign in.
2. Click Sign out.
3. Confirm that the Login page is displayed.
4. Attempt to access a protected route.
5. Confirm that the previous authenticated session is no longer available.

**Expected Result:**

The user is signed out, returned to Login and prevented from accessing protected pages without signing in again.

**September Result:** NOT RUN

**September Actual Behaviour:**

Not formally tested as a separate test case.

**September Evidence / Notes:**

Although logout was used during other tests, this test was not independently completed.

**October Verification:** Code review completed; manual test NOT RUN.

**October Evidence / Notes:**

`TopBar.jsx` calls `logout()` and then navigates to `/login`.

`AppContext.jsx` clears the authentication state and calls Supabase `signOut()` when the client is configured.

The complete sign-out and protected-route behaviour required manual verification.

**November Verification:** PASS — Manual

**November Evidence / Notes:**

B9 — Sign-out protection: PASS.

The November standalone session verified sign-out protection.

This provides manual evidence for the sign-out and protected-route workflow.

---

### FE-31 — Unknown route

**Priority:** Medium

**Steps:**

1. Sign in.
2. Enter a route that does not exist.
3. Observe the application's response.
4. Repeat while signed out.

**Expected Result:**

The application handles the unknown route without crashing and redirects to an appropriate page.

**September Result:** NOT RUN

**September Actual Behaviour:**

Not tested.

**September Evidence / Notes:**

No September execution evidence was recorded.

**October Verification:** Code review completed; manual test NOT RUN.

**October Evidence / Notes:**

`App.jsx` includes a wildcard route that redirects unknown paths to `/orders`.

Unauthenticated users are subsequently redirected to `/login` by the protected application layout.

The routing implementation was reviewed, but the behaviour had not been manually executed.

**November Verification:** NOT RUN — Dedicated test

**November Evidence / Notes:**

General navigation and sign-out protection passed in November.

However, explicit navigation to an unknown route was not separately recorded.

---

## Build and Responsiveness

### FE-32 — Production build

**Priority:** High

**Steps:**

1. Open the frontend directory.
2. Run:

   ```bash
   npm run build
   ```

3. Check the terminal output.
4. Confirm that the build completes without errors.

**Expected Result:**

The production build completes successfully without build errors.

**September Result:** NOT RUN

**September Actual Behaviour:**

Not tested.

**September Evidence / Notes:**

No September production build result was recorded.

**October Result:** PASS — Build

**October Actual Behaviour:**

The production build completed successfully.

**October Evidence / Notes:**

The Vite build processed approximately 119 modules and completed successfully.

The build result confirms that the frontend can be compiled for production.

It does not replace functional or integration testing.

**November Verification:** No separate build result recorded

**November Evidence / Notes:**

The November session successfully ran the frontend locally.

However, a separate November production build result was not included in the manual testing record.

The October production build PASS remains valid historical evidence.

---

### FE-33 — Basic UI responsiveness

**Priority:** Medium

**Steps:**

1. Navigate between the main pages.
2. Open forms and orders.
3. Perform common frontend actions.
4. Observe loading indicators and interaction feedback.
5. Check for freezing, unexpected crashes or excessive delays.

**Expected Result:**

The interface responds normally without freezing, major delays or unexpected crashes.

**September Result:** NOT RUN

**September Actual Behaviour:**

Not tested as a dedicated responsiveness test.

**September Evidence / Notes:**

No September responsiveness measurements or dedicated test results were recorded.

**October Verification:** Code review completed; manual test NOT RUN.

**October Evidence / Notes:**

The implementation includes loading indicators, pending-action states and disabled controls during several asynchronous operations.

Automated tests cover selected interactions, but a dedicated manual responsiveness test had not been performed.

**November Verification:** PARTIAL — General workflow evidence

**November Evidence / Notes:**

The November session successfully completed navigation, order creation, optimisation and re-optimisation.

No dedicated performance measurements, large-order stress testing or recorded responsiveness timings were provided.

The complete FE-33 test therefore remains outstanding.

---

## October 2026 — Automated Test Evidence

### Automated Test Execution

The frontend automated test suite was executed in October 2026 against the `main` branch.

**Command:**

```bash
npm test -- --run
```

Alternatively, from the repository root:

```bash
npm --prefix frontend test -- --run
```

**October Result:** PASS

| Metric | Result |
|---|---|
| Test files | 18 |
| Tests passed | 247 |
| Tests failed | 0 |
| Overall automated result | PASS |

The automated tests covered functionality including:

- Item entry and validation.
- Order list navigation and actions.
- Order summary and re-optimisation.
- Rejected-item presentation.
- Box and item validation.
- Manual handling settings and warnings.
- Sidebar navigation.
- Tooltips and selected accessibility attributes.
- Packing-related utilities.

These automated tests provide regression evidence for the frontend implementation.

However, passing automated tests does not establish that every manual test case or full-system integration scenario has been executed.

### Separate Feature-Branch Verification

A separate fix for JSON imports containing `Quantity: null` was tested on the `fix/json-import-null-quantity` feature branch.

That branch recorded:

- 248 automated tests passed.
- 0 automated tests failed.

This result is kept separate from the October `main` branch result of 247 passing tests.

The feature-branch result must not be treated as evidence that the additional fix was already merged into `main`.

---

## November 2026 — Standalone Local Manual Testing

### Testing Environment

The November testing session was performed using the standalone FitPortal application with locally configured supporting services.

**Environment:**

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
| Test roles | Administrator and Supervisor |
| FitVisualiser | Not included in standalone testing |

The local environment was configured to support authenticated application testing without depending on the team's shared deployment.

The backend and frontend were started locally, and the application was accessed through Safari.

Administrator and Supervisor test accounts were available.

The local Supabase environment provided authentication and database services.

**Scope:**

The November session focused on:

- Authentication.
- Dashboard and navigation.
- User management.
- Account creation.
- Box Inventory.
- Item validation.
- Order management.
- Responsive layout.
- Packing optimisation.
- Re-optimisation.
- Order persistence.
- Role-based permissions.
- Sign-out protection.

Full FitVisualiser integration was outside the scope of this standalone test session.

### November Manual Test Execution

The November session contained 17 reported manual checks.

The original execution identifiers A1–A8 and B1–B9 are retained to distinguish these checks from the FE-01 through FE-33 test-case catalogue.

#### Group A — Administrator and General Frontend Checks

| ID | Test | Result |
|---|---|---|
| A1 | Administrator login | PASS |
| A2 | Dashboard and navigation | PASS |
| A3 | User Management | PASS |
| A4 | Create a test user | PASS |
| A5 | Box Inventory | PASS |
| A6 | Item validation | PASS |
| A7 | Orders list | PASS |
| A8 | Responsive layout | PASS |

**Group A Result:** 8 PASS, 0 FAIL.

#### Group B — Orders, Packing and Supervisor Checks

| ID | Test | Result |
|---|---|---|
| B1 | Create valid order | PASS |
| B2 | Run optimisation | PASS |
| B3 | Verify packing summary | PASS |
| B4 | Re-optimise order | PASS |
| B5 | Persist and reopen order | PASS |
| B6 | Invalid item submission | PASS |
| B7 | Supervisor sign-in | PASS |
| B8 | Supervisor permissions | PASS |
| B9 | Sign-out protection | PASS |

**Group B Result:** 9 PASS, 0 FAIL.

### November Execution Summary

| Metric | Result |
|---|---|
| Total manual checks | 17 |
| Passed | 17 |
| Failed | 0 |
| Blocked | 0 reported |
| Overall execution result | PASS |

**November Result: 17/17 PASS.**

These results are based on the tester's recorded outcomes.

Individual screenshots, exact viewport dimensions, order identifiers and Solver response values were not supplied as part of this execution record.

Therefore, the November results demonstrate successful completion of the reported checks, but do not automatically establish that every detailed step in the original FE test cases was executed.

---

## November 2026 — Mapping to Original Test Cases

The following table identifies how the November manual checks relate to the original frontend test cases.

| Original Case | November Evidence | Verification |
|---|---|---|
| FE-01 — Valid login | A1, B7 | PASS — Administrator and Supervisor login |
| FE-02 — Empty login fields | Not separately recorded | NOT RUN — Dedicated November test |
| FE-03 — Protected routes | B9 | PASS — General sign-out protection |
| FE-04 — Create account | A3, A4 | PASS — User Management and account creation |
| FE-05 — Account validation | Not separately recorded | NOT RUN — Dedicated November test |
| FE-06 — Orders list | A7 | PASS |
| FE-07 — Open existing order | B5 | PASS — Order reopened |
| FE-08 — Invalid order ID | Not separately recorded | NOT RUN |
| FE-09 — Create valid order | B1 | PASS |
| FE-10 — Missing order reference | Not separately recorded | NOT RUN |
| FE-11 — Order with no items | Not separately recorded | NOT RUN |
| FE-12 — Add valid item | B1 | PASS — Through order creation |
| FE-13 — Required item validation | A6, B6 | PASS — General invalid-item checks |
| FE-14 — Invalid numeric values | A6, B6 | General manual PASS; exact numeric boundaries not recorded |
| FE-15 — Remove item | Not separately recorded | NOT RUN |
| FE-16 — Quantity and total weight | Not separately recorded | NOT RUN — Dedicated numerical test |
| FE-18 — Optional Box Group | Not separately recorded | NOT RUN |
| FE-19 — Pack existing order | B2 | PASS |
| FE-20 — Repeated packing | B4 | PASS |
| FE-21 — Packing failure | Not separately recorded | NOT RUN — Manual outage test |
| FE-22 — Packing solution | B2, B3 | PARTIAL — No field-by-field Solver comparison |
| FE-23 — Packing summary | B3 | PARTIAL — Summary review passed; numerical reconciliation outstanding |
| FE-24 — FitVisualiser available | Not included | NOT RUN |
| FE-25 — FitVisualiser unavailable | B2 | PARTIAL — Portal optimisation worked without visualiser |
| FE-26 — Portal API unavailable | Not separately recorded | NOT RUN |
| FE-27 — Mobile layout | A8 | PARTIAL — General responsive check passed; mobile-specific verification outstanding |
| FE-28 — Tablet and desktop layout | A8 | PARTIAL — General responsive check passed; individual viewport verification outstanding |
| FE-29 — Keyboard and focus | Not separately recorded | NOT RUN |
| FE-30 — Sign out | B9 | PASS |
| FE-31 — Unknown route | Not separately recorded | NOT RUN |
| FE-32 — Production build | October build evidence | NOT RUN — November; October build PASS recorded separately |
| FE-33 — Basic UI responsiveness | General workflow execution | PARTIAL — No dedicated performance measurements |

**Note:** FE-17 was not defined in the original test-case catalogue and has not been assigned a new test retrospectively.

The table maps the November execution record to existing FE cases. It does not represent 32 separate November test executions.

---

## Outstanding Verification

The following items remain outstanding or require more specific evidence before they can be considered fully verified.

### 1. Invalid Order Navigation

**Related case:** FE-08

Test direct navigation to an invalid order ID while authenticated.

Verify that:

- The authenticated session persists.
- The application displays a clear not-found message.
- The page does not crash.
- Refreshing the invalid URL does not cause unexpected behaviour.

### 2. Solver Failure and Recovery

**Related case:** FE-21

Simulate or deliberately cause a Solver failure.

Verify that:

- The frontend displays a clear error.
- Existing order information remains available.
- Previous packing information is preserved where appropriate.
- The user can retry after service recovery.

October automated coverage exists, but the live manual recovery scenario has not been recorded.

### 3. Packing Summary Accuracy

**Related cases:** FE-22 and FE-23

Use a known packing result and compare:

- Number of boxes.
- Packed-item count.
- Rejected-item count.
- Box dimensions.
- Item placements.
- Total packed weight.
- Fill rate.
- Execution time.

The September 0% fill-rate observation should be investigated using the same Solver response and frontend display.

### 4. FitVisualiser Integration

**Related case:** FE-24

Verify the full integration within the Dynamic Fit environment.

Test:

- Starting FitVisualiser.
- Generating or retrieving the solution handoff URL.
- Opening the embedded visualiser.
- Opening the visualiser in a separate tab.
- Confirming that the visualisation represents the correct packing solution.
- Handling expired or invalid access links.

This integration was not included in the standalone November testing session.

### 5. Portal API Failure and Recovery

**Related case:** FE-26

Stop or simulate an unavailable Portal API.

Verify that:

- The Orders page displays an appropriate error.
- The application does not crash.
- The user can retry.
- The page recovers after the API becomes available again.

### 6. Detailed Responsive Layout Testing

**Related cases:** FE-27 and FE-28

The November general responsive-layout check passed.

Additional evidence should record:

- Mobile viewport dimensions.
- Tablet viewport dimensions.
- Desktop viewport dimensions.
- Navigation availability.
- Form usability.
- Table scrolling.
- Dialog positioning.
- Layout clipping or overlap.

Mobile navigation deserves particular attention because the desktop sidebar is hidden below the medium breakpoint.

### 7. Keyboard Accessibility

**Related case:** FE-29

Perform a dedicated keyboard-only test.

Verify:

- Tab and Shift+Tab navigation.
- Focus visibility.
- Focus order.
- Button and link activation.
- Dialog focus handling.
- Form validation feedback.
- Escape or close behaviour where applicable.

### 8. Unknown Route Handling

**Related case:** FE-31

Enter an unknown route while authenticated and unauthenticated.

Confirm that the application redirects appropriately without crashing.

### 9. Dedicated Responsiveness and Performance

**Related case:** FE-33

Record responsiveness observations during:

- Navigation.
- Order creation.
- Packing.
- Re-optimisation.
- Loading states.
- Larger orders.

No dedicated performance measurements were recorded in the November session.

### 10. Full-System Integration

The standalone November testing confirms the main Portal workflows using local services.

However, full integration within the team's Dynamic Fit monorepo or shared deployment still requires confirmation.

This includes:

- Portal frontend.
- Portal backend.
- Authentication and database configuration.
- FitSolver integration.
- FitVisualiser integration.
- Shared deployment configuration.

Standalone success should not be presented as complete verification of the full Dynamic Fit system.

---

## Final Testing Assessment

The September manual run recorded **17 PASS, 2 FAIL, 1 BLOCKED and 12 NOT RUN** across 32 defined FE cases. The two failures (FE-14 numeric validation and FE-20 repeated packing) have subsequent October automated regression evidence; FE-20 also passed the November manual re-optimisation check.

On `main`, October automated verification recorded **247/247 passing tests across 18 files**, and the Vite production build passed. The separate `fix/json-import-null-quantity` branch recorded 248 passing tests; its result is not attributed to `main`.

The November standalone session recorded **17/17 PASS** across its A1–A8 and B1–B9 checks. These are execution-check results, not 17 independent completions of the original FE catalogue. The FE mapping above identifies partial and unverified acceptance criteria.

**Overall assessment:** The recorded standalone frontend workflows and October automated/build checks passed within their respective scopes. Numerical packing-summary reconciliation, selected error and accessibility scenarios, FitVisualiser integration, and shared deployment verification remain outstanding.

---

## Reproduction Commands

From the repository root, the frontend automated tests can be executed using:

```bash
npm --prefix frontend test -- --run
```

The production build can be executed using:

```bash
npm --prefix frontend run build
```

The local frontend development server can be started using:

```bash
npm --prefix frontend run dev
```

The automated test and build commands should be rerun before the final submission if additional frontend code changes have been made.

The resulting test counts and build output should be recorded accurately rather than assuming that earlier results remain unchanged.

---
