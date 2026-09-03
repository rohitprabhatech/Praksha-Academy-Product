# Git Branching Guide

```
main
  └── dev
        └── feature/sprint-XX-name
              → develop on branch
              → commit
              → push
              → PR → dev
              → review
              → fix
              → approval
              → merge → dev
```

Never: Developer → `main`.

Developers must **not** push feature work directly to `main`.  
PRs target **`dev`**. Release to `main` only when explicitly approved.

This matches the existing admin assignment rule: branch from `dev`, never work directly on `dev` or `main`.

---

## Branch format

`feature/sprint-{number}-{short-name}`

Examples:

- `feature/sprint-01-frontend-foundation`
- `feature/sprint-02-authentication`
- `feature/sprint-03-public-website`
- `feature/sprint-04-owner-dashboard-shell`
- `feature/sprint-08-owner-course-management`
- `feature/sprint-14-teacher-dashboard`

---

## Branch creation

```bash
git checkout dev
git pull origin dev
git checkout -b feature/sprint-01-frontend-foundation
```

## Checkout / pull latest `dev`

```bash
git checkout dev
git pull origin dev
git checkout feature/sprint-01-frontend-foundation
git merge dev
```

Prefer merge of `dev` into the feature branch (or rebase only if the team already uses rebase and the developer is comfortable). Do not use interactive rebase (`-i`).

## Development

Work only on the sprint branch. Do not commit secrets (`.env`).

## Commit

See `commit-convention.md`.

## Push

```bash
git push -u origin HEAD
```

## PR

```bash
gh pr create --base dev --title "Sprint 01 — Frontend Foundation" --body "..."
```

See `pull-request-guide.md`.

## Review

Reviewer checks out the branch, runs `npm run dev` in `frontend/`, walks the sprint checklist.

## Conflict resolution

1. `git checkout feature/...`
2. `git merge dev`
3. Resolve conflicts in the working tree (no `git rebase -i`)
4. Test
5. Push

## Merge

Squash or merge commit per team convention. Base: `dev`.  
Do not merge to `main` from a sprint PR.

## Branch cleanup

After merge, delete the remote feature branch. Local:

```bash
git checkout dev
git pull origin dev
git branch -d feature/sprint-01-frontend-foundation
```

---

## Protected branches

| Branch | Who pushes |
| --- | --- |
| `main` | Release owner only |
| `dev` | Via reviewed PRs |
| `feature/*` | Assigned sprint developer |
