# FitPortal

FitPortal is the customer-facing component of the Dynamic Fit project. It provides the interface through which users interact with the system and coordinates with the other Dynamic Fit components to support the overall packing optimisation workflow.

## Dynamic Fit

Dynamic Fit is divided into three subteams, each responsible for a major component of the system:

- **FitPortal** — Provides the customer-facing application and coordinates the overall user workflow.
- **FitSolver** — Processes packing optimisation requests and returns optimised packing solutions.
- **FitVisualizer** — Provides a visual representation of the optimised packing solution.

The intended high-level interaction between these components is:

`FitPortal → FitSolver → FitPortal → FitVisualizer`

Integration standards and shared interfaces between these components will be documented as they are defined.

## Repository Purpose

This repository contains the source code and documentation for FitPortal.

It also acts as the primary reference point for other Dynamic Fit subteams integrating with FitPortal. Shared integration documentation, API specifications and stable releases will be made available through this repository as development progresses.

## Development Status

FitPortal is currently in **Sprint 0**.

The team is establishing the project structure, development workflow, technology stack and integration standards before feature development begins.

## Project Management

Development work is managed through the FitPortal GitHub Project board using a Scrum-based workflow.

Issues represent items in the Product Backlog and are assigned to Sprints through the project board.

## Contribution Workflow

Development follows a branch and pull-request workflow:

1. Select or create a GitHub Issue for the work.
2. Create a branch for the issue.
3. Make and commit changes on the branch.
4. Open a pull request targeting `main`.
5. Have the pull request reviewed and approved by another team member.
6. Squash merge the approved pull request into `main`.

Direct changes to `main` are restricted.

## Documentation

Project and integration documentation will be added as requirements and interfaces are agreed upon by the Dynamic Fit teams.

This will include documentation such as:

- API specifications
- Integration standards
- Data formats
- Development setup instructions
- Docker usage and stable release instructions
