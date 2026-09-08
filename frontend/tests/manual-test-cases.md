# FitPortal Frontend Manual Test Cases

Use this file while testing the current FitPortal frontend.

## Result Values

- **PASS** — actual behaviour matches expected behaviour
- **FAIL** — actual behaviour does not match expected behaviour
- **BLOCKED** — test cannot be completed because another dependency is unavailable
- **NOT RUN** — test has not been executed yet

---

## FE-01 — Login with valid input

**Priority:** High  
**Precondition:** User is logged out.

**Steps**
1. Open `http://127.0.0.1:5174/login`.
2. Enter an email address.
3. Enter a password.
4. Select **Sign in**.

**Expected Result**
- User is signed in using the current mocked authentication.
- User is taken to the Orders page.
- No uncaught error appears in the browser console.

**Result:** NOT RUN  
**Actual Behaviour:**  
**Evidence / Issue:**  

---

## FE-02 — Login validation with empty fields

**Priority:** High

**Steps**
1. Open the Login page.
2. Leave the email and password empty.
3. Select **Sign in**.

**Expected Result**
- Login does not continue.
- A clear validation message is displayed.

**Result:** NOT RUN  
**Actual Behaviour:**  
**Evidence / Issue:**  

---

## FE-03 — Protected route while logged out

**Priority:** High

**Steps**
1. Sign out if currently signed in.
2. Enter `/orders` directly in the browser address bar.

**Expected Result**
- User is redirected to the Login page.
- Protected order information is not displayed.

**Result:** NOT RUN  
**Actual Behaviour:**  
**Evidence / Issue:**  

---

## FE-04 — Registration with required fields

**Priority:** High

**Steps**
1. Open the Register page.
2. Enter the required registration values.
3. Submit the form.

**Expected Result**
- Registration succeeds under the current mocked authentication flow.
- User is signed in and redirected to the Orders page.

**Result:** NOT RUN  
**Actual Behaviour:**  
**Evidence / Issue:**  

---

## FE-05 — Registration validation

**Priority:** High

**Steps**
1. Open the Register page.
2. Leave one or more required fields empty.
3. Submit the form.

**Expected Result**
- Registration does not continue.
- A useful validation message is displayed.

**Result:** NOT RUN  
**Actual Behaviour:**  
**Evidence / Issue:**  

---

## FE-06 — Orders list loads

**Priority:** High  
**Precondition:** Frontend and Portal API are running.

**Steps**
1. Sign in.
2. Open the Orders page.

**Expected Result**
- Orders page loads without crashing.
- Existing orders are displayed if data exists.
- Order information is readable.

**Result:** NOT RUN  
**Actual Behaviour:**  
**Evidence / Issue:**  

---

## FE-07 — Open an existing order

**Priority:** High  
**Precondition:** At least one order exists.

**Steps**
1. Open the Orders page.
2. Select an existing order.

**Expected Result**
- Correct order details are displayed.
- Item information and packing status are visible.
- The selected order ID matches the displayed order.

**Result:** NOT RUN  
**Actual Behaviour:**  
**Evidence / Issue:**  

---

## FE-08 — Invalid order ID

**Priority:** Medium

**Steps**
1. While signed in, enter a nonexistent order URL such as `/orders/ORD-999999`.

**Expected Result**
- The app handles the missing order gracefully.
- A useful not-found or error message is shown.
- The page does not crash.

**Result:** NOT RUN  
**Actual Behaviour:**  
**Evidence / Issue:**  

---

## FE-09 — Create an order with valid data

**Priority:** High  
**Precondition:** Portal API is running.

**Steps**
1. Open **New order**.
2. Enter an order reference.
3. Add at least one valid item.
4. Create/submit the order.

**Expected Result**
- The frontend sends the order through the Portal API.
- An order ID is assigned by the API.
- The new order can be opened or is displayed after creation.
- No duplicate order is created from one normal submission.

**Result:** NOT RUN  
**Actual Behaviour:**  
**Evidence / Issue:**  

---

## FE-10 — Missing order reference

**Priority:** High

**Steps**
1. Open **New order**.
2. Add a valid item.
3. Leave the order reference empty.
4. Attempt to create the order.

**Expected Result**
- The order is not submitted.
- A clear validation message is displayed.

**Result:** NOT RUN  
**Actual Behaviour:**  
**Evidence / Issue:**  

---

## FE-11 — Create order with no items

**Priority:** High

**Steps**
1. Open **New order**.
2. Enter an order reference.
3. Do not add any items.
4. Attempt to create the order.

**Expected Result**
- The order is not submitted.
- A message explains that at least one item is required.

**Result:** NOT RUN  
**Actual Behaviour:**  
**Evidence / Issue:**  

---

## FE-12 — Add a valid item

**Priority:** High

**Steps**
1. Open **New order**.
2. Enter valid ItemCode and ItemReference values.
3. Enter valid Width, Length and Depth values in mm.
4. Enter a valid Weight in kg.
5. Enter a quantity.
6. Add the item.

**Expected Result**
- Item appears in the order item list.
- Dimensions, weight and quantity display correctly.
- Summary information updates.

**Result:** NOT RUN  
**Actual Behaviour:**  
**Evidence / Issue:**  

---

## FE-13 — Required item validation

**Priority:** High

**Steps**
1. Open the item-entry form.
2. Leave a required field empty.
3. Attempt to add the item.

**Expected Result**
- Item is not added.
- A validation message identifies missing required data.

**Result:** NOT RUN  
**Actual Behaviour:**  
**Evidence / Issue:**  

---

## FE-14 — Invalid numeric item values

**Priority:** High

**Steps**
1. Open the item-entry form.
2. Try zero or negative values for dimensions, weight or quantity where the UI permits entry.
3. Attempt to add the item.

**Expected Result**
- Invalid packaging values are rejected or clearly reported.
- The application does not create a broken item.

**Result:** NOT RUN  
**Actual Behaviour:**  
**Evidence / Issue:**  

---

## FE-15 — Remove an item

**Priority:** High

**Steps**
1. Add at least two items to a new order.
2. Remove one item.

**Expected Result**
- Only the selected item is removed.
- Line-item count, total units and total weight update correctly.

**Result:** NOT RUN  
**Actual Behaviour:**  
**Evidence / Issue:**  

---

## FE-16 — Quantity and total weight calculation

**Priority:** High

**Steps**
1. Add an item with a known weight.
2. Set quantity greater than 1.
3. Review the order totals.

**Expected Result**
- Total units include the quantity.
- Total weight equals item weight multiplied by quantity.
- Multiple item lines are summed correctly.

**Result:** NOT RUN  
**Actual Behaviour:**  
**Evidence / Issue:**  

---

## FE-17 — Hazardous item flag

**Priority:** High

**Steps**
1. Create an item.
2. Mark it as Hazardous.
3. Add it to an order.
4. Review the item table and order details.

**Expected Result**
- Hazardous state remains attached to the item.
- Hazard indicator/badge is shown where the UI is designed to display it.

**Result:** NOT RUN  
**Actual Behaviour:**  
**Evidence / Issue:**  

---

## FE-18 — Optional BoxGroup field

**Priority:** Medium

**Steps**
1. Add an item with a BoxGroup value.
2. Add another valid item without a BoxGroup value.

**Expected Result**
- Both items can be represented correctly.
- BoxGroup remains optional.
- The value is not lost for the item where it was entered.

**Result:** NOT RUN  
**Actual Behaviour:**  
**Evidence / Issue:**  

---

## FE-19 — Submit an existing order for packing

**Priority:** High  
**Precondition:** Portal API and FitSolver dependency are available.

**Steps**
1. Open a valid existing order.
2. Select the action used to pack/solve the order.
3. Observe the interface while processing.
4. Wait for the result.

**Expected Result**
- The frontend triggers the Portal packing workflow.
- The UI does not freeze.
- User receives visible feedback while packing is in progress.
- A successful packing result is displayed when complete.

**Result:** NOT RUN  
**Actual Behaviour:**  
**Evidence / Issue:**  

---

## FE-20 — Prevent accidental repeated packing submission

**Priority:** High

**Steps**
1. Open a valid order.
2. Start packing.
3. Rapidly select the packing action more than once.

**Expected Result**
- The frontend does not create unintended duplicate requests.
- The interface remains stable.

**Result:** NOT RUN  
**Actual Behaviour:**  
**Evidence / Issue:**  

---

## FE-21 — Packing request failure

**Priority:** High

**Steps**
1. Create a condition where the packing request fails or use a test order known to fail.
2. Start packing.

**Expected Result**
- A useful error message is displayed.
- User is not left on a permanent loading state.
- Existing order information remains usable.

**Result:** NOT RUN  
**Actual Behaviour:**  
**Evidence / Issue:**  

---

## FE-22 — Packing solution displays

**Priority:** High  
**Precondition:** A packing solution exists.

**Steps**
1. Open a solved order.
2. View its packing result/solution.

**Expected Result**
- Packing result returned through the Portal API is displayed.
- Important result information is readable.
- The frontend does not calculate or invent solver results itself.

**Result:** NOT RUN  
**Actual Behaviour:**  
**Evidence / Issue:**  

---

## FE-23 — Packing summary displays

**Priority:** High  
**Precondition:** A solved order exists.

**Steps**
1. Open a solved order.
2. View the packing summary.

**Expected Result**
- Packing summary loads successfully.
- Summary remains available independently of the 3D visualiser.

**Result:** NOT RUN  
**Actual Behaviour:**  
**Evidence / Issue:**  

---

## FE-24 — FitVisualiser available

**Priority:** Medium  
**Precondition:** FitVisualiser is running at `http://localhost:5173`.

**Steps**
1. Open a solved order.
2. Open/view its packing visualisation.

**Expected Result**
- 3D visualisation is available.
- Normal order controls remain usable.

**Result:** NOT RUN  
**Actual Behaviour:**  
**Evidence / Issue:**  

---

## FE-25 — FitVisualiser unavailable

**Priority:** High  
**Precondition:** Stop FitVisualiser but keep the Portal frontend/backend running.

**Steps**
1. Open a solved order.
2. Attempt to view the visualisation.

**Expected Result**
- Order creation, packing result and packing summary still work.
- Missing visualiser does not crash the page.
- The user receives a graceful fallback or understandable unavailable state.

**Result:** NOT RUN  
**Actual Behaviour:**  
**Evidence / Issue:**  

---

## FE-26 — Portal API unavailable

**Priority:** High

**Steps**
1. Stop the Portal backend.
2. Keep the frontend running.
3. Perform an action that requires API data, such as loading orders or creating an order.

**Expected Result**
- Frontend does not show a blank screen or crash.
- User receives a useful error state.
- Interface remains responsive.

**Result:** NOT RUN  
**Actual Behaviour:**  
**Evidence / Issue:**  

---

## FE-27 — Mobile layout

**Priority:** High

**Steps**
1. Open browser developer tools.
2. Enable responsive/device mode.
3. Use a width around 390 px.
4. Test Login, Orders, New order and Order details.

**Expected Result**
- No important controls overlap.
- Text remains readable.
- Forms remain usable.
- Important navigation remains accessible.
- Horizontal scrolling is only used where intentionally required.

**Result:** NOT RUN  
**Actual Behaviour:**  
**Evidence / Issue:**  

---

## FE-28 — Tablet and desktop layout

**Priority:** Medium

**Steps**
1. Test approximately 768 px width.
2. Test approximately 1440 px width.
3. Navigate through the main workflow.

**Expected Result**
- Layout adapts appropriately.
- Content does not become unnecessarily stretched, clipped or overlapping.

**Result:** NOT RUN  
**Actual Behaviour:**  
**Evidence / Issue:**  

---

## FE-29 — Keyboard navigation and focus

**Priority:** Medium

**Steps**
1. Reload a main frontend page.
2. Use only Tab, Shift+Tab, Enter and Space where appropriate.
3. Move through interactive controls.

**Expected Result**
- Interactive controls are reachable.
- Focus is visibly indicated.
- Normal actions can be triggered from the keyboard where applicable.

**Result:** NOT RUN  
**Actual Behaviour:**  
**Evidence / Issue:**  

---

## FE-30 — Sign out

**Priority:** High

**Steps**
1. Sign in.
2. Select **Sign out**.
3. Attempt to return to `/orders`.

**Expected Result**
- User returns to Login.
- Protected order pages are not accessible while logged out.

**Result:** NOT RUN  
**Actual Behaviour:**  
**Evidence / Issue:**  

---

## FE-31 — Unknown route

**Priority:** Medium

**Steps**
1. Enter a nonexistent frontend URL such as `/something-that-does-not-exist`.

**Expected Result**
- Application redirects or handles the route safely.
- No blank page or crash occurs.

**Result:** NOT RUN  
**Actual Behaviour:**  
**Evidence / Issue:**  

---

## FE-32 — Production build

**Priority:** High

**Steps**
1. From `frontend/`, run:

```bash
npm run build
```

**Expected Result**
- Build completes successfully.
- No build-breaking errors are reported.

**Result:** NOT RUN  
**Actual Behaviour:**  
**Evidence / Issue:**  

---

## FE-33 — Basic UI responsiveness

**Priority:** High

**Steps**
1. Navigate quickly between major frontend pages.
2. Add/remove several items.
3. Start a packing request when available.
4. Observe the browser while waiting.

**Expected Result**
- The interface remains responsive.
- User actions give immediate visual feedback.
- Long-running packing work does not make the browser appear frozen.

**Result:** NOT RUN  
**Actual Behaviour:**  
**Evidence / Issue:**  

---

# Test Run Summary

| ID | Test | Priority | Result |
|---|---|---:|---|
| FE-01 | Login with valid input | High | NOT RUN |
| FE-02 | Empty login validation | High | NOT RUN |
| FE-03 | Protected route | High | NOT RUN |
| FE-04 | Registration | High | NOT RUN |
| FE-05 | Registration validation | High | NOT RUN |
| FE-06 | Orders list | High | NOT RUN |
| FE-07 | Existing order | High | NOT RUN |
| FE-08 | Invalid order | Medium | NOT RUN |
| FE-09 | Create order | High | NOT RUN |
| FE-10 | Missing reference | High | NOT RUN |
| FE-11 | No items | High | NOT RUN |
| FE-12 | Add item | High | NOT RUN |
| FE-13 | Item validation | High | NOT RUN |
| FE-14 | Invalid numeric values | High | NOT RUN |
| FE-15 | Remove item | High | NOT RUN |
| FE-16 | Quantity/weight totals | High | NOT RUN |
| FE-17 | Hazard flag | High | NOT RUN |
| FE-18 | BoxGroup | Medium | NOT RUN |
| FE-19 | Pack order | High | NOT RUN |
| FE-20 | Repeated packing request | High | NOT RUN |
| FE-21 | Packing failure | High | NOT RUN |
| FE-22 | Packing solution | High | NOT RUN |
| FE-23 | Packing summary | High | NOT RUN |
| FE-24 | Visualiser available | Medium | NOT RUN |
| FE-25 | Visualiser unavailable | High | NOT RUN |
| FE-26 | API unavailable | High | NOT RUN |
| FE-27 | Mobile layout | High | NOT RUN |
| FE-28 | Tablet/desktop layout | Medium | NOT RUN |
| FE-29 | Keyboard navigation | Medium | NOT RUN |
| FE-30 | Sign out | High | NOT RUN |
| FE-31 | Unknown route | Medium | NOT RUN |
| FE-32 | Production build | High | NOT RUN |
| FE-33 | UI responsiveness | High | NOT RUN |
