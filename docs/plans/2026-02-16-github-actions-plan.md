# Improve Claude GitHub Actions — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Upgrade both Claude GitHub Actions workflows to be project-aware with proper permissions, Bun tooling, and custom review prompts.

**Architecture:** Two YAML file edits — no code changes, no tests. Validate YAML syntax before committing.

**Tech Stack:** GitHub Actions, Claude Code Action v1, Bun

---

### Task 1: Update `claude.yml` — Interactive Assistant

**Files:**
- Modify: `.github/workflows/claude.yml` (replace entire contents)

**Step 1: Replace `.github/workflows/claude.yml` with the following:**

```yaml
name: Claude Code

on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
  issues:
    types: [opened, assigned, labeled]
  pull_request_review:
    types: [submitted]

jobs:
  claude:
    if: |
      (github.event_name == 'issue_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'pull_request_review_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'pull_request_review' && contains(github.event.review.body, '@claude')) ||
      (github.event_name == 'issues' && (
        contains(github.event.issue.body, '@claude') ||
        contains(github.event.issue.title, '@claude') ||
        github.event.action == 'assigned' ||
        github.event.action == 'labeled'
      ))
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
      issues: write
      id-token: write
      actions: read
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 1

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Run Claude Code
        id: claude
        uses: anthropics/claude-code-action@v1
        with:
          claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
          assignee_trigger: "claude"
          label_trigger: "claude"
          additional_permissions: |
            actions: read
          claude_args: |
            --allowedTools "Bash(bun run build),Bash(bun run lint),Bash(bun run test),Bash(bun run test:*),Bash(bunx *),Bash(gh pr *),Bash(gh issue *)"
```

**Step 2: Validate YAML syntax**

Run: `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/claude.yml'))"`
Expected: No output (valid YAML)

**Step 3: Commit**

```bash
git add .github/workflows/claude.yml
git commit -m "feat: upgrade claude.yml with write permissions, Bun, and CI integration"
```

---

### Task 2: Update `claude-code-review.yml` — Automatic PR Reviews

**Files:**
- Modify: `.github/workflows/claude-code-review.yml` (replace entire contents)

**Step 1: Replace `.github/workflows/claude-code-review.yml` with the following:**

```yaml
name: Claude Code Review

on:
  pull_request:
    types: [opened, synchronize, ready_for_review, reopened]

jobs:
  claude-review:
    if: ${{ !github.event.pull_request.draft }}
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
      issues: write
      id-token: write
      actions: read
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 1

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Run Claude Code Review
        id: claude-review
        uses: anthropics/claude-code-action@v1
        with:
          claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
          track_progress: true
          use_sticky_comment: true
          additional_permissions: |
            actions: read
          prompt: |
            REPO: ${{ github.repository }}
            PR NUMBER: ${{ github.event.pull_request.number }}

            Review this pull request for a Next.js 16 travel planner app.

            ## Project context
            - Uses Bun (not npm/yarn), Tailwind CSS v4, shadcn/ui with Radix Nova theme
            - Mobile-first design — phone usability is critical
            - `lg:` (1024px) breakpoint separates mobile single-panel from desktop multi-panel layouts
            - React Server Components by default
            - Path aliases: @/components, @/lib, @/hooks, @/ui

            ## Review focus
            1. **Mobile-first**: Are touch targets comfortable? Do layouts work on small screens? Is the `lg:` breakpoint used correctly?
            2. **Tailwind v4**: Are CSS variables and v4 syntax used correctly? No deprecated v3 patterns?
            3. **Build verification**: Run `bun run build` and `bun run lint` — report any failures
            4. **Component patterns**: Is `cn()` used for conditional classes? Are shadcn/ui components used correctly?
            5. **Performance**: No unnecessary client components? Proper use of Server Components?
            6. **Code quality**: Bugs, logic errors, security issues

            Use `mcp__github_inline_comment__create_inline_comment` for specific code issues.
            Use `gh pr comment` for a top-level summary.
            Only post GitHub comments — don't submit review text as messages.

          claude_args: |
            --allowedTools "Bash(bun run build),Bash(bun run lint),Bash(bun run test),mcp__github_inline_comment__create_inline_comment,Bash(gh pr comment:*),Bash(gh pr diff:*),Bash(gh pr view:*)"
```

**Step 2: Validate YAML syntax**

Run: `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/claude-code-review.yml'))"`
Expected: No output (valid YAML)

**Step 3: Commit**

```bash
git add .github/workflows/claude-code-review.yml
git commit -m "feat: upgrade code review with project-specific prompts and build verification"
```