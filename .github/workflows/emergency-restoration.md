# Docs site emergency restoration guide

This guide provides comprehensive instructions for using the tag-based restoration system to quickly recover the documentation site when issues are detected. The restoration system enables rapid rollback to known-good states and provides tools to identify and re-apply changes that were made after the restoration point.

## What is this system?

The tag-based restoration system provides two core capabilities:

1. **Manual tagging workflow:** Creates timestamped restoration points at major, minor, and patch documentation releases.
2. **Restoration workflow:** Quickly restores the site to any tagged state and tracks what changed after that tag.

## Recovery time target

- **Typical restoration time:** 5-10 minutes (depends on build and deployment time)
- **Target mean time to recovery (MTTR):** Under 15 minutes
- **Post-restoration change re-application:** 15-60 minutes depending on number of changes

## When to use this system

Use the restoration system when:

- ✓ Better Stack detects the site is unavailable
- ✓ Build failures prevent the site from deploying
- ✓ Content corruption or accidental deletions are discovered
- ✓ User reports indicate site functionality is broken
- ✓ Recent changes introduced problems that need quick rollback

**When NOT to use this system**

- ✗ For routine site updates (use normal deploy workflow)
- ✗ For minor content fixes (edit directly or use PR workflow)
- ✗ If you're unsure what the problem is (investigate first)

## Quickstart guide

Use these steps to quickly restore the site when an issue is detected.

### Create a tag

1. **Go to GitHub Actions.** Navigate to the repository, and select the **Actions** tab.
2. **Select the "Create restoration tag" workflow.** Look for the workflow with this name in the left sidebar.
3. **Select "Run workflow".** Button appears in the main area when workflow is selected.
4. **Enter the tag name.** Use the `YYYYMMDD` format (for example, `20260515`).
5. **Optionally enter a tag description.** Briefly describe why the tag is being created (for example, `Before dependency updates`).
6. **Optionally toggle build validation.** Enabled by default. Validates that the site builds successfully before creating the tag. Disable only if you need to tag a commit that you know builds correctly and want to skip the extra build time. **Important:** This check relies on the exit code of `npm run build`. A silent failure (where the build exits with code 0 despite producing a broken site) will not be caught. Always verify the live site after tagging before relying on the tag for restoration.
7. **Select "Run workflow" to confirm.**

### Restore the site

1. **Go to GitHub Actions.** Navigate to the repository, and select the **Actions** tab.
2. **Select the "Restore site from tag" workflow.** Look for the workflow with this name in the left sidebar.
3. **Select "Run workflow".** Button appears in the main area when the workflow is selected.
4. **Select a restoration tag.** Enter the most recent `YYYYMMDD` tag.
5. **Monitor the restoration.** Watch the workflow progress in real-time (typical time to restore: 5-10 minutes). A green checkmark indicates a successful restoration but confirm in the action.

## Tag naming convention

Restoration tags follow a consistent naming pattern for easy identification and sorting.

### Format

All restoration tags follow this format:

```
YYYYMMDD
```

### Components

- `YYYY`: Year (4 digits)
- `MM`: Month (2 digits, 01-12)
- `DD`: Day (2 digits, 01-31)

### Examples

- `20260420` — April 20, 2026
- `20260427` — April 27, 2026
- `20260501` — May 1, 2026

### When tags are created

Restoration tags are created:

- Before major documentation releases
- Before minor version updates
- Before patch releases
- At predetermined regular intervals (recommended: weekly)
- When significant changes are made that could impact site stability (feature additions, Docusaurus upgrades, etc.)

## Creating restoration tags

Use the "Create restoration tag" workflow to create a new restoration point.

### Workflow inputs

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `tag_name` | Yes | — | Tag name in `YYYYMMDD` format. Must be unique. The workflow will fail if the tag already exists. |
| `tag_description` | No | — | Short description of why the tag is being created (for example, `Before major redesign`). Stored in the annotated tag message. If omitted, the message defaults to `Restoration tag created on <TIMESTAMP>`. |
| `should_validate` | No | `true` | When enabled, the workflow runs `npm run build` before creating the tag to confirm the site builds successfully from that commit. Disable only when you need to skip the build step and are confident the commit is valid. **Important:** Build validation relies on the exit code of `npm run build`. If the build fails silently (exits with code 0 despite errors), the tag will still be created. After creating a tag, always verify the live site is functioning correctly before treating the tag as a reliable restoration point. |

### What the workflow does

1. **Validates the branch:** Confirms the workflow is running on `main`. Tags can only be created from `main`.
2. **Validates the tag name format:** Ensures the name matches `YYYYMMDD`. The workflow fails immediately if the format is wrong.
3. **Checks for duplicates:** The workflow fails if the tag already exists.
4. **Validates the build (if `should_validate` is `true`):** Installs dependencies and runs `npm run build`. The tag is not created if the build fails. **Important:** This check relies on the exit code returned by `npm run build`. A silent failure (where the build exits with code 0 despite producing a broken site) will not be caught. Always verify the live site after tagging before relying on the tag for restoration.
5. **Creates and pushes the tag:** Creates an annotated tag with the provided (or default) message and pushes it to the repository.

## Detailed restoration process

This section covers the full restoration process in detail, including a pre-restoration checklist and post-restoration verification steps.

### Pre-restoration checklist

Before starting restoration:

- [ ] **Confirm the monitoring alert.** Verify the issue is real (check Better Stack or site directly)
- [ ] **Choose a restoration tag.** Select the most recent stable tag (usually most recent tag available)
- [ ] **Document the decision.** Note which tag you're restoring from and why

### During restoration

1. **Start the workflow.**
   - Navigate to: GitHub repo → Actions → "Restore site from tag".
   - Select the "Run workflow" button.
   - Enter the tag name in the text field.
   - Select "Run workflow" to confirm.
2. **Monitor progress.**
   - Watch the workflow status in real-time.
   - Typical stages:
     - Prepare restore (1 min) — Validates tag.
     - Restore and deploy (5-10 min) — Builds and deploys site.
     - Post restoration (1 min) — Generates summary.
3. **What success looks like.**
   - All workflow steps show green checkmarks ✓.
   - Final status shows "Workflow successful".
   - "Post-Restoration" job completes with summary.

### Post-restoration

1. **Verify site accessibility.**
   - Wait 2-5 minutes for GitHub Pages to fully deploy.
   - Visit the site URL directly.
   - Clear browser cache if needed (Ctrl+Shift+Del or Cmd+Shift+Del).
   - Confirm basic functionality works.
2. **Review change tracking report.**
   - In GitHub Actions workflow, go to "Artifacts".
   - Download `site-build` artifact.
   - Extract and open `change-tracking-*.md`.
   - This shows what changes were reverted.
3. **Begin troubleshooting.**
   - Identify what caused the original issue.
   - Plan how to fix it.
   - Prepare fixed version of code.
4. **Re-apply changes.** (See next section.)
   - Use the change tracking report to identify which changes to re-apply.
   - Choose appropriate method for re-applying.
   - Test before pushing.

## Change re-application guidance

After restoration, use the following guidance to re-apply changes that were reverted during the restoration process.

### Understanding the change tracking report

The change tracking report shows:

```
## Files changed since tag

### Added (5 files)
- docs/new-feature.md
- src/components/NewWidget.js
- ...

### Modified (8 files)
- docs/index.md
- README.md
- ...

### Deleted (2 files)
- docs/old-page.md
- ...

## Summary
Total changes: 15
```

### Re-applying changes - Three methods

There are three main methods to re-apply changes after restoration. Choose the method based on the number of changes and your familiarity with Git.

#### Method 1: Cherry-pick individual commits

**Best for:** A few specific commits need to be re-applied.

**Steps:**

```bash
# List commits since restore-point tag
git log <YYYYMMDD>..origin/main --oneline

# Copy the commit SHA you want
# Example: a1b2c3d Fix documentation formatting

# Apply that specific commit
git cherry-pick a1b2c3d

# If conflicts occur, resolve them and continue
git cherry-pick --continue
```

#### Method 2: Interactive rebase

**Best for:** Multiple sequential commits to re-apply with possible edits.

**Steps:**

```bash
# Start interactive rebase from restore-point tag
git rebase -i <YYYYMMDD>

# A text editor will open showing commits
# Keep "pick" for commits you want to re-apply
# Change "pick" to "drop" for commits to skip
# Save and close the editor

# If conflicts occur during rebase
# Resolve conflicts in files
# Then: git rebase --continue

# If rebase goes wrong, abort and start over
git rebase --abort
```

#### Method 3: Merge fixed branch

**Best for:** When changes are on a separate branch that's been fixed.

**Steps:**

```bash
# Ensure main branch is updated to restoration tag state
git checkout main
git pull origin main

# Create new branch for re-application
git checkout -b reapply-changes

# Cherry-pick or rebase the fixed changes onto this branch
git cherry-pick <COMMIT_SHAS>

# Test thoroughly
npm run build

# If successful, push and create PR
git push origin reapply-changes

# Create PR for review before merging
```

### Handling merge conflicts

**If conflicts occur during cherry-pick or rebase:**

1. **Understand the conflict.**

   ```
   <<<<<<< HEAD
   Current version (from restored tag)
   =======
   Version being applied (from after tag)
   >>>>>>> branch-name
   ```

2. **Resolve the conflict.**
   - Edit the file and keep the correct version.
   - Remove conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`).
   - Or use `mergetool`: `git mergetool`.
3. **Mark as resolved.**

   ```bash
   git add resolved-file.md
   git cherry-pick --continue  # if cherry-picking
   # OR
   git rebase --continue  # if rebasing
   ```

4. **When to re-create from scratch.**
   - If conflicts are extensive (50+ lines).
   - If you're unsure which version is correct.
   - Create the changes manually instead.

### Testing before pushing

Always test after re-applying changes:

```bash
# Install dependencies
npm ci

# Build the site
npm run build

# Verify build succeeded
ls -la build/

# Optionally, start local dev server
npm run start
```

Only push changes if build succeeds without errors.

## Troubleshooting common issues

Use the following troubleshooting steps if you encounter problems during or after restoration.

### Workflow fails to start

**Problem:** "Run workflow" button is disabled or workflow won't start.

**Solutions:**

1. Refresh the GitHub page and try again.
2. Check that you have permissions to run workflows.
3. Verify GitHub Actions quota hasn't been exceeded (Settings → Billing).
4. Contact repository admin if permissions are limited.

### Restoration workflow fails during build

**Problem:** Build step shows red ✗ error.

**Common causes and fixes:**

1. **Missing dependencies**

   ```
   Error: Cannot find module 'package-name'
   ```

   - Check if `package.json` or `package-lock.json` is corrupted.
   - Try restoring from an earlier tag.
2. **Node.js version issue**

   ```
   Error: Node version required: 18+, but got 16
   ```

   - The restoration tag may require different Node version.
   - Try an earlier tag if available.

3. **Build script error**

   ```
   Error: npm run build failed
   ```
   - Check workflow logs for specific error.
   - Verify the tag points to a working commit.
   - Try different tag if current one is broken.
4. **Large content size**
   - Try reducing content or optimizing assets.
   - Check workflow timeout settings.

### Site doesn't appear after deployment

**Problem:** Site URL shows 404 or old version after restoration.

**Solutions:**

1. **GitHub Pages deployment is slow.**
   - Wait 5 minutes after workflow completes.
   - GitHub Pages can take time to fully propagate.
2. **Browser cache issue.**
   - Clear browser cache: `Ctrl+Shift+Del` (Windows) or `Cmd+Shift+Del` (Mac)
   - Open site in private/incognito window.
   - Try different browser.
3. **GitHub Pages settings.**
   - Go to repository Settings → Pages.
   - Verify "Build and deployment" source is set to "GitHub Actions".
   - Check that publish directory is correct.
4. **Deployment failed silently.**
   - Check workflow logs for errors in "Publish to GitHub Pages" step.
   - Verify repository has GitHub Pages enabled.
   - Check GitHub Actions permissions include `pages: write`.

### Merge conflicts during change re-application

**Problem:** Cherry-pick or rebase shows conflicts.

**If you have few changes:**

```bash
# See the conflicted file
cat docs/conflicted-file.md

# Choose which version to keep and edit
# Then resolve:
git add docs/conflicted-file.md
git cherry-pick --continue
```

**If you have many conflicts:**

```bash
# Abort and try different approach
git cherry-pick --abort

# Instead, re-create the changes manually
# Or try rebasing instead of cherry-picking
```

**For complex situations:**

- Use Visual Studio Code's merge conflict resolution UI.
- Or use `git mergetool` for interactive resolution.

### Change tracking report is incomplete

**Problem:** Change tracking report missing files or looks wrong.

**Workaround - Manual diff generation:**

```bash
# Generate full diff between tag and current state
git diff <YYYYMMDD>..origin/main > changes.diff

# View file-by-file changes
git diff --stat <YYYYMMDD>..origin/main

# List only file names
git diff --name-only <YYYYMMDD>..origin/main
```

## Best practices

Following these best practices reduces the need for restoration and ensures a smooth recovery process when needed.

### Creating restoration tags

- **Create before major changes:** Tag before risky updates.
- **Use meaningful descriptions:** Include reason tag was created.

  ```
  Example: "Before major redesign" or "Before dependency updates"
  ```

- **Test the tag:** Verify site still builds from tagged commit.
- **Regular intervals:** Create weekly or bi-weekly tags as backups.

### Minimizing re-application work

- **Keep changes small:** Smaller commits are easier to re-apply.
- **Meaningful commit messages:** Helps identify which commits to re-apply.
- **Document changes:** Keep notes on what was changed and why.
- **Test before committing:** Reduces need for restoration.

### During restoration

- **Notify stakeholders:** Post in Slack when restoration starts/completes.
- **Stay calm:** Restoration usually works; focus on root cause after.
- **Document the incident:** Record what happened for future prevention.
- **Plan prevention:** Discuss how to prevent similar issues.

### After restoration

- **Communicate clearly:** Explain to team what was restored.
- **Verify thoroughly:** Test key site functionality before and after re-application.
- **Review changes carefully:** Don't blindly re-apply; understand what's being restored.
- **Celebrate recovery:** Acknowledge team for quick response.

## Restoration scenarios with examples

The following examples walk through common scenarios that may require using the restoration system.

### Scenario 1: Recent commit broke build

**Situation:** Better Stack alerts that site is down. You notice a recent commit had a syntax error.

**Steps:**

1. **Identify the issue:** Review recent commits, find the breaking change.
2. **Restore to previous tag:** Use "Restore site from tag" workflow, select most recent tag.
3. **Restore time:** 5-10 minutes.
4. **Fix the issue:** Correct the syntax error in your editor.
5. **Re-apply the fix:**

   ```bash
   git checkout main
   git pull origin main
   git cherry-pick <commit-with-fix>
   ```

6. **Test and verify:** `npm run build` succeeds.
7. **Push:** `git push origin main`.
8. **Site rebuilds:** Regular deploy workflow takes over.

### Scenario 2: Multiple changes, need to isolate problem

**Situation:** Site was working 3 days ago but broke today. Multiple changes were made between then.

**Steps:**

1. **Restore to 3-day-old tag:** Use a tag from that date (for example, `20260424`).
2. **Review change tracking report:** Identify all 25 changes made since then.
3. **Select subset to re-apply:** Start with the most critical changes.

   ```bash
   git cherry-pick <COMMIT_1> <COMMIT_2> <COMMIT_3>
   ```

4. **Test:** Rebuild and verify site works.
5. **Gradually add more changes:** If still working, add more commits.
6. **Identify breaking change:** When site breaks, you've found the problematic commit.
7. **Fix the problem commit:** Edit and correct the error.
8. **Push fixed version:** `git push origin main`

### Scenario 3: Accidental content deletion

**Situation:** Important documentation file was accidentally deleted in yesterday's commit.

**Steps:**

1. **Restore to yesterday's tag:** File will reappear.
2. **Verify file exists:** Check that deleted file is back.
3. **Manually copy or merge:** Copy the restored file content.
4. **Create new commit:** Re-add the file with proper changes.

   ```bash
   git checkout <YYYYMMDD> -- docs/important-file.md
   git add docs/important-file.md
   git commit -m "Restore accidentally deleted file"
   ```

5. **Push:** `git push origin main`

## Emergency contacts and escalation

If the restoration process is unsuccessful or you need additional assistance, use the following contacts and escalation paths.

### Primary contacts

- **Documentation maintainer:** See repository contributors.
- **Documentation Slack channel members:** Slack channel `#eng-documentation-feedback`.
- **Site availability:** Check Better Stack alerts at https://scalar-labs.betteruptime.com/.

### Slack channel

- **Channel:** `#eng-documentation-feedback`
- **Use for:** Announcing restoration events, discussing site issues
- **Template:**

  ```
  🔄 Site Restoration [Status]
  Repository: docs / docs-scalardb / docs-scalardl / docs-archive
  Tag restored: `YYYYMMDD`
  Issue: [Brief description]
  Status: Restoration complete / In progress / Failed
  ```

### When to contact GitHub support

- GitHub Actions permissions not working as expected.
- GitHub Pages deployment errors that can't be resolved.
- Repository access or permission issues.
- GitHub Actions quota exceeded.

### Escalation paths

**For build issues:**

1. Check workflow logs for error details.
2. Try restoring from earlier tag.
3. Contact engineering team on Slack.

**For GitHub issues:**

1. Verify using GitHub community forum.
2. Contact GitHub support with workflow run URL.
3. Reference similar issues from past incidents.

## Reference section

The following references provide additional context for the tools and procedures used in this guide.

### Useful Git commands

```bash
# List all restore-point tags
git tag -l '20*' --sort=-version:refname

# Show tag details
git show <YYYYMMDD>

# View commits since a tag
git log <YYYYMMDD>..main --oneline

# Diff between tag and current
git diff <YYYYMMDD> -- docs/

# Create a local branch from a tag (for testing)
git checkout -b test-branch <YYYYMMDD>
```

### Common commands quick reference

| Task | Command |
|------|---------|
| List restore-point tags | `git tag -l '20*'` |
| Cherry-pick a commit | `git cherry-pick <sha>` |
| Start interactive rebase | `git rebase -i <tag>` |
| Continue after conflict | `git cherry-pick --continue` |
| Abort operation | `git cherry-pick --abort` or `git rebase --abort` |
| View specific file version | `git show <tag>:path/to/file` |
| Compare tag to main | `git diff <tag> main -- docs/` |
