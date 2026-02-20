---
description: Guide for the Spec -> Test -> Code cycle for a simplified Spec-Driven Development with defined Agent Roles.
---

# Spec-Driven Task Workflow

## Quick Reference

1. **Spec** - [`spec-creator`](.agent/skills/spec-creator/SKILL.md) drafts specs → 🛑 SPEC APPROVAL
2. **Plan** - [`planner`](.agent/skills/backend-planner/SKILL.md) creates plan → 🛑 PLAN APPROVAL
3. **Implement** - [`developer`](.agent/skills/backend-developer/SKILL.md) writes code (TDD) → 🛑 CODE REVIEW
4. **Review** - [`code-review-specialist`](.agent/skills/code-review-specialist/SKILL.md) audits code
5. **Verify** - [`qa-engineer`](.agent/skills/qa-engineer/SKILL.md) tests edge cases → 🛑 MERGE

## Step 1: Specification (Agent: Spec-Creator)

**Role**: [`spec-creator`](.agent/skills/spec-creator/SKILL.md)

1. **Create Ticket**:
   - Manual: Create `docs/tickets/MVP-XX-name.md`.

2. **Run Agent**:
   - Command: `@spec-creator Update specs for ticket docs/tickets/MVP-XX-name.md`
   - **Output**: Updates to `docs/specs/openapi.yaml` or `ui-components.md`.

3. **User Review**:
   - Approve the Specs before proceeding.

## Step 2: Planning (Agent: Planner)

**Role**: [`backend-planner`](.agent/skills/backend-planner/SKILL.md) or [`frontend-planner`](.agent/skills/frontend-planner/SKILL.md)

1. **Run Agent**:
   - Command: `@backend-planner (or @frontend-planner) Plan the changes for docs/tickets/[ticket-name].md`
   - **Output**: Writes `## Implementation Plan` and updates status to `PLANNED`.

2. **Review Plan**:
   - Approve the Plan.

## Step 3: Implementation (Agent: Developer)

**Role**: [`backend-developer`](.agent/skills/backend-developer/SKILL.md) or [`frontend-developer`](.agent/skills/frontend-developer/SKILL.md)

1. **Run Agent**:
   - Command: `@backend-developer (or @frontend-developer) Implement docs/tickets/[ticket-name].md`
   - **Behavior**: TDD, Implementation, Documentation updates. Updates status to `REVIEW`.

2. **Manual Verification**:
   - Developer runs minimal verification (`npm test`).

## Step 4: Code Review (Agent: Reviewer)

**Role**: [`code-review-specialist`](.agent/skills/code-review-specialist/SKILL.md)

1. **Run Agent**:
   - Command: `@code-review-specialist Review the changes in [folder/file]`
   - **Behavior**: If clean, updates status to `QA`.

2. **Fix Issues**:
   - Developer fixes reported issues.

## Step 5: QA Verification (Agent: QA)

**Role**: [`qa-engineer`](.agent/skills/qa-engineer/SKILL.md)

1. **Run Agent**:
   - Command: `@qa-engineer Verify implementation of docs/tickets/[ticket-name].md`
   - **Behavior**: Regression tests, Edge Cases. If pass, updates status to `READY_TO_MERGE`.

## Step 6: Finalization (Manual)

1. **Commit & Merge**:
   - `git commit -m "feat: ..."`
   - Merge to main.
