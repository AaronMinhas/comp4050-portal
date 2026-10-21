# User Guide

This guide covers the workflows available in the FitPortal web interface. To use the hosted application, open [https://dynamicfit.aaron-d02.workers.dev/](https://dynamicfit.aaron-d02.workers.dev/). To run FitPortal locally, see [Local Development](local-development.md).

## Roles

Your account has one of three roles. The interface hides controls your role cannot use, and the server enforces the same rules.

| Action | User | Supervisor | Administrator |
|---|---|---|---|
| View orders, results and Box Inventory | Yes | Yes | Yes |
| Create and edit orders; submit for optimisation | Yes | Yes | Yes |
| Run optimisation and finalise orders | No | Yes | Yes |
| Hold, resume, archive and delete orders | No | Yes | Yes |
| Manage Box Inventory and handling warnings | No | Yes | Yes |
| Manage accounts | No | `USER` accounts | `USER` and `SUPERVISOR` accounts |

## Sign In

1. Open the Portal and enter your email and password on the **Sign in** page.
2. Select **Sign in**. You are taken to the Orders page.
3. Select **Sign out** in the top bar when finished.

There is no sign-up page. Accounts are created by a Supervisor or Administrator from **User management**. A disabled account cannot sign in.

## Navigation

The sidebar links to **Orders**, **New order**, **Box Inventory** and, for Supervisors and Administrators, **User management**.

The Orders page has three views:

| View | Contents |
|---|---|
| Active orders | Orders in progress |
| On hold | Unfinished orders that have been paused |
| Archive | Finalised orders that have been archived |

## Create an Order

1. Select **New order** (or **+ New order** on the Orders page).
2. Add items using **Manual entry** or **Import JSON** (see below).
3. Review the order summary: line items, total units and total weight.
4. Select **Create order**.

The order is created as a **Draft** and given an order ID (`ORD-###`) and a reference.

### Add items manually

Fill in the item fields and select **Add item to order**:

| Field | Notes |
|---|---|
| Item code | Your identifier. Up to 32 characters |
| Item reference | A description. Up to 100 characters |
| Width, length, depth | Millimetres, greater than zero |
| Weight | Kilograms, greater than zero. Cannot exceed what the largest available box can carry |
| Box group | Optional. A client-defined way to keep items apart |
| Quantity | At least 1 |

Fields are checked as you type. Values are never silently shortened.

### Import items from JSON

Choose **Import JSON**, paste the JSON (or choose a file), then select **Review pasted JSON**. The import accepts a single item, an array of items, or an object with an `Items` array:

```json
[
  {
    "ItemCode": "ITM-004",
    "ItemReference": "Widget C",
    "Width": 200,
    "Length": 300,
    "Depth": 150,
    "Weight": 4.5,
    "Quantity": 2,
    "BoxGroup": "GROUP-A"
  }
]
```

Validation errors are listed and nothing is imported until the file is valid. A review step lets you edit or remove imported items before they are added to the order.

## Edit an Order

Select **Edit order** on the order page, change the items and select **Save order changes**. Editing returns the order to **Draft** and discards any existing packing result, so it needs to be optimised again.

Orders that are on hold, archived or finalised cannot be edited.

## Optimise an Order

| Your role | Draft order | After submitting |
|---|---|---|
| User | **Submit for Optimisation** | A Supervisor or Administrator runs optimisation. The order shows **Awaiting Optimisation** |
| Supervisor or Administrator | **Run Optimisation** directly | **Run Optimisation** on orders awaiting optimisation |

Optimisation needs at least one box type that is active and has quantity available. If Box Inventory has none, an error explains this.

When it completes, the order shows **Optimised** and the result section appears.

## View Results

The **Optimisation result** section shows the number of boxes, items packed, rejected items, fill rate and execution time. Packing details list each packed box, its items and each box group.

- If any items could not be packed, the order is marked **Rejected** and the rejected items and reasons are listed. Edit the order or re-optimise to resolve them.
- If a handling warning threshold is set, heavy packed boxes are flagged. These warnings are advisory only.
- If current Box Inventory cannot cover the boxes the result needs, a warning is shown and **Finalise Order** is unavailable.

### 3D visualisation

Select **Open Visualizer** to load the packing in FitVisualiser, embedded on the order page. Access is short-lived, so select **Refresh Visualizer access** if it expires. FitVisualiser must be running; in a local standalone setup it is not included. See [Local Development](local-development.md#fitvisualiser).

## Re-optimise and Finalise

Supervisors and Administrators see these actions on an **Optimised** order:

- **Re-optimise** packs the order again using current Box Inventory.
- **Finalise Order** locks the order and subtracts the boxes used from any box type with a set quantity. It asks for confirmation. An order with rejected items cannot be finalised.

Finalised orders are read-only.

## Hold, Resume, Archive and Delete

Supervisors and Administrators can manage orders from the Orders list or the order page:

| Action | Applies to | Effect |
|---|---|---|
| **Hold** | Unfinished orders | Moves the order to **On hold**. Items and results are kept. It cannot be edited or optimised until resumed |
| **Resume** | Orders on hold | Returns the order to Active at the same stage |
| **Delete** | Unfinished orders, active or on hold | Permanently removes the order, its items and its saved result after confirmation |
| **Archive** | Finalised orders | Moves the order to **Archive** immediately |

In the Orders list, each action has a short explanation on its info icon, shown on hover, keyboard focus or tap. Resuming from the list opens the resumed order so you can continue immediately. **Archive** is shown on finalised orders.

Finalised orders are also archived automatically one calendar month after finalisation. Archived orders remain readable but cannot be resumed or deleted. None of these actions change box stock.

## Manage Box Inventory

Open **Box Inventory** to see each box type with its dimensions, maximum packed weight, box weight, available quantity and status. All users can view it. Supervisors and Administrators can change it.

- **+ Add Box Type** creates a box type. Reference, width, length and depth are required. Leave available quantity blank for no limit, or enter `0` for none available.
- **Edit** changes a box type. **Deactivate** keeps a box type out of packing without deleting it, and **Activate** restores it.
- **Import JSON** loads a `boxes.json` file or pasted JSON. You review the results before anything is saved. If an imported box already exists with a quantity, choose whether to replace the current quantity or add to it.
- Deleting a box type is permanent. An optimised order that uses a deleted box type cannot be finalised until it is re-optimised.

The **Handling warnings** section on this page sets the packed weight above which a box is flagged. Supervisors and Administrators can set or turn off the threshold. Other users see it read-only.

## Manage Users

Supervisors and Administrators open **User management** to list accounts.

- **+ Create account** adds an account with an email, temporary password, optional display name and role.
- **Edit** changes the display name or role.
- **Disable** blocks sign-in without deleting the account. **Re-enable** restores it.
- **Delete** permanently removes the account after confirmation. Disabling is normally safer.

Supervisors can manage only `USER` accounts and cannot promote anyone. Administrators can also manage `SUPERVISOR` accounts. Administrator accounts come from the bootstrap process, an Administrator cannot modify another Administrator, and the system will not allow the last active Administrator to be removed or disabled.
