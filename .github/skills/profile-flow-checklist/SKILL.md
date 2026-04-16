# Profile Flow Checklist

## Purpose

Validate safely any change touching the entrenador flow:

- routing structure and redirects
- stepper progression logic
- profile form validators and age-based document rules
- end-user navigation behavior across steps

## When to use

Use this skill when a task edits any of these files or folders:

- src/app/app.routes.ts
- src/app/core/services/stepper.ts
- src/app/core/services/perfil-form.ts
- src/app/features/crear-perfil/
- src/app/features/escoger-pokemon/
- src/app/features/ver-perfil-completo/
- src/app/features/stepper/

## Inputs expected from the caller

- List of changed files
- Short summary of intended behavior changes
- Whether tests should run fully or only as a final confirmation

## Workflow

1. Map the impact

- Detect whether the change is route-level, stepper-level, form-level, UI-only, or mixed.
- If mixed, execute all relevant branches below.

2. Routing branch

- Open src/app/app.routes.ts.
- Confirm parent route path remains entrenador unless rename is explicitly requested.
- Confirm child order is still crear-perfil -> escoger-pokemon -> ver-perfil-completo.
- Confirm default child redirect points to crear-perfil with pathMatch full.

3. Stepper branch

- Open src/app/core/services/stepper.ts.
- Confirm steps array path values exactly match child route segments.
- Confirm next and back keep users inside /entrenador.
- If any route segment changes, ensure steps mapping updates in the same change.

4. Form and validation branch

- Open src/app/core/services/perfil-form.ts.
- Confirm esAdulto remains derived from cumpleanos.
- Confirm documento is required and Dui-formatted only for adults.
- Confirm documento validators clear for minors and value reset behavior is preserved unless intentionally changed.

5. Feature integration branch

- Open src/app/features/crear-perfil/crear-perfil.ts and template.
- Confirm input masking behavior remains consistent with validator expectations for adults.
- Confirm labels/placeholders reflect adult vs minor mode.

6. Navigation behavior check

- Verify each step can be reached in sequence.
- Verify back navigation does not skip steps.
- Verify unknown or base entrenador path lands on crear-perfil via redirect.

7. Safety and conventions

- Keep OnPush change detection.
- Keep inject-based DI.
- Keep native control flow syntax where used.
- Do not introduce any.

8. Verification

- Run pnpm test after non-trivial changes.
- If tests are unavailable or too broad, report what was not validated and why.

## Decision points

- If only CSS or static markup changed and no bindings/paths changed:
  - Skip branches 2 to 4.
  - Run branch 6 and conventions check only.
- If app.routes.ts changed:
  - Branch 2 is mandatory and branch 3 is mandatory.
- If perfil-form.ts changed:
  - Branch 4 is mandatory and branch 5 is mandatory.
- If stepper.ts changed:
  - Branch 3 and branch 6 are mandatory.

## Completion criteria

The checklist is complete only when all apply:

- Route segments and StepperService paths are consistent.
- Adult/minor document validation behavior is preserved or intentionally updated and documented.
- Forward/back flow remains coherent for the 3-step journey.
- Test execution status is explicitly reported.
- Residual risks are listed if any branch was not fully validated.

## Output format

Return a compact report with:

- Findings ordered by severity
- Files inspected
- Checks passed and checks skipped
- Test status
- Residual risks
