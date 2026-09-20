---
description: Work on the next build step toward zero-to-deployment (plan, implement, verify, record).
agent: ship-director
---

Load the `zero-to-deploy` skill. Read `BUILD_PROGRESS.md`, find the current step (or the "Next best
action" it records), then execute it:
1. Plan — list concrete subtasks and the "Done when" check from the skill/blueprint.
2. Implement — small, style-consistent changes that move that step forward without skipping earlier
   steps or pulling in Phase 2/3 scope.
3. Verify — run the verification matrix for the touched layer(s): backend compile + uvicorn smoke +
   pytest when present; frontend `npm run lint` + `npm run build`; any DB work via migrations + RLS
   tests. Show the actual command output.
4. Record — update `BUILD_PROGRESS.md` checkboxes, verification summaries, and open risks.

If the step needs user input (credentials, provider choice, scope call), ask a focused question
first and wait. Report what you did, the verification results, and the next best action.
$ARGUMENTS