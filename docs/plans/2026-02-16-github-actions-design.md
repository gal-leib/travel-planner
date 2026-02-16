# Improve Claude GitHub Actions Setup

## Overview

Upgrade the two existing Claude GitHub Actions workflows to be project-aware and more capable for the travel planner repo.

## Workflow 1: `claude.yml` — Interactive Assistant

### Changes from current
- **Permissions**: `contents: write`, `pull-requests: write`, `issues: write`, `actions: read` (was read-only)
- **Bun setup**: Add `oven-sh/setup-bun@v2` step + `bun install --frozen-lockfile`
- **Triggers**: Add `assignee_trigger: "claude"` and `label_trigger: "claude"` for issue-based workflows
- **Allowed tools**: `bun run build`, `bun run lint`, `bun run test`, `bunx *`, `gh pr *`, `gh issue *`
- **CI integration**: `additional_permissions: actions: read` for reading workflow logs
- **Issue events**: Support `labeled` event type for label trigger

### What this enables
- Assign Claude to issues or label them "claude" to trigger work
- Claude can run builds, lint, and tests
- Claude can add shadcn components via `bunx`
- Claude can read CI logs ("why did CI fail?")
- Claude can push code to PRs and comment

## Workflow 2: `claude-code-review.yml` — Automatic PR Reviews

### Changes from current
- **Replace plugin with custom prompt**: Remove generic `code-review` plugin, add project-specific review prompt
- **Skip draft PRs**: `if: ${{ !github.event.pull_request.draft }}`
- **Permissions**: Add `pull-requests: write`, `issues: write`, `actions: read`
- **Bun setup**: Add `oven-sh/setup-bun@v2` step + `bun install --frozen-lockfile`
- **Progress tracking**: `track_progress: true` for live progress comments
- **Sticky comment**: `use_sticky_comment: true` to avoid comment spam on pushes
- **Build verification**: Claude runs `bun run build` and `bun run lint` as part of review
- **Allowed tools**: Build/lint/test commands, inline comments, PR comments

### Project-specific review focus
1. Mobile-first: touch targets, small screen layouts, `lg:` breakpoint usage
2. Tailwind v4: CSS variables, v4 syntax, no deprecated v3 patterns
3. Build verification: `bun run build` and `bun run lint` must pass
4. Component patterns: `cn()` utility, shadcn/ui usage
5. Performance: Server Components by default, no unnecessary client components
6. Code quality: bugs, logic errors, security issues

## Out of scope
- Issue auto-triage (overkill for project size)
- Scheduled maintenance (no value at this scale)
- Dedicated security review workflow (covered by general review)