---
description: Guide for the Spec -> Test -> Code cycle for a simplified Spec-Driven Development.
---

# Spec-Driven Task Workflow

## Quick Reference

1. **Setup** - Update `task.md`, create/update specs → 🛑 SPEC APPROVAL
2. **Implement** - Developer agent (TDD), update docs
3. **Verify** - Tests/TypeCheck/Lint → 🛑 VERIFICATION APPROVAL

## Step 1: Specification (Planning)

Before writing any code, you must define WHAT you are building.

1. **Update Plans**:
   - Update `docs/planning/task.md` to mark the current task as 'in progress'.
   - Update `docs/planning/implementation_plan.md` if the approach changes.

2. **Write Specifications**:
   - **Backend**: Update `docs/specs/openapi.yaml`.
     - Define endpoints, request bodies, success/error responses.
     - Follow `ai-specs/specs/backend-standards.mdc`.
   - **Frontend**: Update `docs/specs/ui-components.md` (or create a new spec file).
     - Define component props, state, interactions.
     - Follow `ai-specs/specs/frontend-standards.mdc`.

3. **User Review**:
   - Request user approval for the specs.
   - **CRITICAL**: Do NOT proceed to implementation without explicit approval of the specs.

## Step 2: Implementation (Execution)

Once specs are approved, adhere to **Test-Driven Development (TDD)**.

1. **Write Failing Test**:
   - Create a test file (`.test.ts` or Cyress spec) that asserts the behavior defined in the spec.
   - Run the test to confirm it fails (Red).

2. **Write Implementation**:
   - Write the minimum code necessary to pass the test (Green).
   - Use strict TypeScript (no `any`).
   - Use Zod for validation.
   - Adhere to `GEMINI.md` standards.

3. **Refactor**:
   - Clean up code while keeping tests green.

## Step 3: Verification (Finalization)

1. **Run Full Suite**:
   - Backend: `npm test`
   - Frontend: `npm run cypress:run` (or component tests)
   - Lint: `npm run lint`
   - Build: `npm run build`

2. **Documentation**:
   - Update `task.md` (mark as complete).
   - Update `implementation_plan.md` (if needed).

3. **Notify User**:
   - Present the results and ask for final confirmation.
