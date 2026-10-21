# Requirements

FitPortal requirements, grouped by development phase and listed in approximate implementation order within each phase.

Some requirements depend on the [Dynamic Fit monorepo](https://github.com/Wasif-ZA/dynamic-fit) and cannot be fully demonstrated or tested from this repository alone: Req15 and Req27 (FitVisualiser is not included here), Req32 and Req34 (integrated system), and Req33 (partly FitSolver).

## MVP requirements (Req01–Req34)

| ID | Title | Description |
|---|---|---|
| Req01 | Portal Interface | FitPortal SHALL provide a web interface for warehouse staff to create packing orders, manage data and view optimisation results. |
| Req02 | Item Data Structure | Items SHALL support identifiers, references, dimensions, weight, quantities and packing groups. |
| Req03 | Order-Specific Items | Each order SHALL contain its own item list without requiring a shared item catalogue. |
| Req04 | Manual Item Entry | Users SHALL be able to manually enter item details when creating orders. |
| Req05 | Input Validation | FitPortal SHALL validate required fields, measurements and quantities, providing clear errors for invalid data. |
| Req06 | Order Creation | Users SHALL be able to create orders with unique system-generated identifiers and references. |
| Req07 | Order API | FitPortal SHALL expose JSON-based API endpoints for creating and retrieving orders. |
| Req08 | Order List and Details | Users SHALL be able to browse existing orders and view their contents and statuses. |
| Req09 | Packing Groups | Items SHALL support generic packing-group constraints to prevent incompatible items sharing cartons. |
| Req10 | Reusable Box Definitions | FitPortal SHALL maintain reusable box definitions containing dimensions, weight information and availability. |
| Req11 | Solver Request Conversion | FitPortal SHALL translate order and box data into the agreed FitSolver input format. |
| Req12 | Packing Optimisation | Authorised users SHALL be able to run optimisation for eligible orders. |
| Req13 | Packing Results | FitPortal SHALL display saved packing summaries, carton assignments, fill rates and rejected items. |
| Req14 | Unpackable Items | FitPortal SHALL identify rejected items and prevent incomplete solutions from being finalised. |
| Req15 | Visualiser Integration | FitPortal SHALL make packing solutions available to FitVisualiser for 3D visualisation. |
| Req16 | JSON Item Import | Users SHALL be able to import and review item data from uploaded or pasted JSON. |
| Req17 | Data Persistence | FitPortal SHALL persist orders, items, boxes, solutions and account information across sessions. |
| Req18 | Box Inventory Management | Authorised users SHALL be able to create, edit, activate, deactivate and remove box types. |
| Req19 | Box Availability | Only active box types with available stock SHALL be supplied for optimisation. |
| Req20 | JSON Box Import | Authorised users SHALL be able to import box definitions and review inventory changes. |
| Req21 | Authentication and Permissions | FitPortal SHALL authenticate users and enforce User, Supervisor and Administrator permissions. |
| Req22 | User Management | Authorised users SHALL be able to create, update, enable, disable and delete Portal accounts. |
| Req23 | Order Lifecycle | FitPortal SHALL support Draft, Awaiting Optimisation, Optimised and Final order states. |
| Req24 | Order Submission | Regular users SHALL be able to submit orders for optimisation without directly executing the Solver. |
| Req25 | Order Editing | Users SHALL be able to edit unfinished orders, invalidating outdated packing solutions. |
| Req26 | Re-optimisation | Authorised users SHALL be able to rerun optimisation and replace previous results. |
| Req27 | Secure Visualisation Handoff | FitPortal SHALL provide short-lived solution-specific Visualiser access without exposing user credentials. |
| Req28 | Order Finalisation | Authorised users SHALL be able to finalise fully packed orders, making them read-only. |
| Req29 | Inventory Consumption | Finalisation SHALL atomically deduct used stock-limited cartons and prevent duplicate deductions. |
| Req30 | Usability and Responsive Layout | FitPortal SHALL provide clear workflows suitable for warehouse staff on desktop and mobile devices. |
| Req31 | Failure Handling | FitPortal SHALL report invalid requests, unavailable dependencies and unsuccessful optimisation attempts clearly. |
| Req32 | Optimisation Performance | The integrated system SHOULD target approximately 1–2 seconds for typical individual packing requests. |
| Req33 | Extensible Integration | FitPortal SHOULD accommodate future packing rules and Solver modes without major workflow redesign. |
| Req34 | End-to-End Workflow | Dynamic Fit SHALL support order creation, optimisation and visualisation within the integrated application. |

## Post-MVP requirements (Req35–Req43)

These correspond to the functionality delivered after the September MVP, particularly the October feedback changes.

| ID | Title | Description |
|---|---|---|
| Req35 | Rejected Order Indicators | Orders containing rejected items SHALL be visibly distinguished from successfully optimised orders. |
| Req36 | Direct Draft Optimisation | Supervisors and Administrators SHALL be able to optimise draft orders without a separate submission step. |
| Req37 | Optimisation Execution Time | FitPortal SHALL display the Solver execution time alongside packing results. |
| Req38 | Item Text Limits | FitPortal SHALL enforce consistent item code and reference character limits across entry, import and API validation. |
| Req39 | Order Backlog | Authorised users SHALL be able to hold and resume unfinished orders without losing their progress. |
| Req40 | Order Deletion | Authorised users SHALL be able to delete eligible unfinished orders while protecting finalised orders. |
| Req41 | Order Archiving | Finalised orders SHALL support manual and automatic archiving while remaining accessible for reference. |
| Req42 | Dynamic Weight Validation | FitPortal SHALL validate item weights against available box capacities, accounting for empty-box weight. |
| Req43 | Manual Handling Warnings | FitPortal SHALL display configurable advisory weight warnings separately from packing validation errors. |

## Planned requirements (Req44–Req45)

These requirements represent outstanding development work, not verified completed functionality.

| ID | Title | Description |
|---|---|---|
| Req44 | Background Optimisation | FitPortal SHOULD support optimisation continuing independently of the user's browser session. |
| Req45 | Large-Order Handling | The system SHOULD gracefully handle unusually large orders and clearly report processing failures or limitations. |
