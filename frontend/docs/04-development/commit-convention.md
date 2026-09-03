# Commit Convention

Use a type prefix. Imperative mood. Explain **why** when it is not obvious.

Types:

- `feat:` new frontend capability
- `fix:` bug fix
- `refactor:` structure change, no behavior change
- `style:` layout, spacing, visual only
- `test:` tests or test docs evidence
- `docs:` documentation
- `chore:` tooling, deps, housekeeping

## Examples

```
feat: add owner course management UI
fix: resolve course filter issue
refactor: improve dashboard layout
style: update responsive spacing
feat: add teacher dashboard shell
fix: show toast container on app root
docs: add sprint 08 requirements
chore: remove unused admin sidebar import
```

## Rules

- One logical change per commit when practical.
- Do not commit `node_modules`, env files, or secrets.
- Do not mix unrelated refactors with feature work.
- Sprint PRs may contain multiple commits of the same type.
