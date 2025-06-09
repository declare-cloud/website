# declare-cloud/website

A modern Next.js app using Bun, DevContainers, Commitizen, and CI/CD with Docker & Helm.

---

## Quick Start (with DevContainer)

1. Open this repository in Visual Studio Code.
2. When prompted, **"Reopen in Container"** (or use the Command Palette and select "Dev Containers: Reopen in Container").
3. Your environment is ready. All dependencies, extensions, and tools are installed automatically.

---

## What the DevContainer Automates

- Installs all dependencies with Bun.
- Installs and configures Commitizen for Conventional Commits.
- Sets up VS Code extensions for Prettier, ESLint, Docker, and Conventional Commits.
- Installs Bun globally.
- Forwards port 3000 for the Next.js dev server.
- Terminal is ready for Bun and Commitizen commands.

You do **not** need to manually install Bun, Commitizen, or any extensions when using the DevContainer.

---

## Conventional Commits & Commitizen

All commits **must** follow the [Conventional Commits](https://www.conventionalcommits.org/) standard.

To create a commit with a guided prompt, run:

```
bunx cz
```

or

```
bun run commit
```

The VS Code extension for Conventional Commits is also included for easy commit message composition.

---

## Testing

- **Unit tests with coverage:**

```
bun run test:coverage
```

- **End-to-end tests (Playwright):**

```
bunx playwright install --with-deps
bun run test:e2e
```

- **Format and lint checks:**

```
bun run format:check
bun run lint:check
```

---

## Docker

To build and run the app locally in Docker:

```
bun run build
docker build -t website .docker run -p 3000:3000 website
```

---

## Helm

- The image and tag are set by CI.
- To package and install the chart manually:

```
helm package chart/helm install website chart-*.tgz
```

---

## CI/CD & Automated Versioning

The GitHub Actions workflows in `.github/workflows/` automate the CI/CD pipeline:

- **PR Title Linting (`pr-lint.yml`)**: Validates that pull request titles follow the Conventional Commits standard (e.g., `feat: Add new feature`).
- **CI/CD Pipeline (`ci.yml`)**:
  - **Lint Job**: Runs formatting (`bun run format:check`) and linting (`bun run lint:check`) on all pushes and PRs.
  - **Unit Tests Job**: Runs unit tests with coverage (`bun run test:coverage`) after linting passes.
  - **E2E Tests Job**: Runs Playwright E2E tests (`bun run test:e2e`) for PRs and the `main` branch, uploading test reports on failure.
  - **Build and Push Job**:
    - Builds the Next.js app (`bun run build`).
    - Calculates the SemVer version from commit history using `standard-version` (for `main`).
    - Builds and scans a Docker image for vulnerabilities using `docker scout` (for PRs and `main`).
    - Pushes the Docker image to `ghcr.io/declare-cloud/website` with versioned and `latest` tags (for `main` only).
    - Updates and pushes the Helm chart to GitHub Container Registry (for `main` only).
- **Release Pipeline (`release.yml`)**:
  - Triggers on tags (e.g., `v1.0.0`).
  - Runs linting, unit tests, and builds the app.
  - Lints and packages the Helm chart.
  - Builds, scans, and pushes the Docker image with versioned, `latest`, and Git SHA tags.
  - Generates release notes and creates a GitHub Release.

The version for Docker and Helm is determined by commit history – you don’t need to change it manually. Dependencies are kept up-to-date with Dependabot (see `.github/dependabot.yml`).

---

## Setting Up CI/CD in GitHub

To enable the CI/CD pipelines, follow these steps:

1. **Ensure Workflow Files**:

   - Verify that `.github/workflows/ci.yml`, `.github/workflows/pr-lint.yml`, `.github/workflows/release.yml`, and `.github/dependabot.yml` are in your repository.
   - These files are pre-configured to handle linting, testing, building, and releasing.

2. **Configure GitHub Container Registry (GHCR)**:

   - The workflows use `ghcr.io` for Docker images and Helm charts. No additional setup is needed, as they authenticate using `GITHUB_TOKEN`.
   - Ensure your repository has permissions to write packages (Settings > Actions > General > Workflow permissions > Read and write permissions).

3. **Set Up Branch Protection for `main`**:

   - Go to your repository > **Settings** > **Branches** > **Branch protection rules**.
   - Click **Add rule** and set the branch name pattern to `main`.
   - Enable:
     - **Require status checks to pass before merging**.
     - Select the following status checks: `lint`, `unit-tests`, `e2e-tests`, `build-and-push` (from `ci.yml`), and `lint-pr-title` (from `pr-lint.yml`).
     - **Require branches to be up to date before merging**.
   - Save the rule to prevent merging PRs if any checks fail.

4. **Create a Release**:

   - After merging changes to `main`, create a tag (e.g., `v1.0.0`) using `standard-version` or manually:
     ```
     bun run release
     git push --follow-tags
     ```
   - The `release.yml` workflow will handle building, pushing, and creating a GitHub Release.

5. **Monitor Workflows**:

   - Go to the **Actions** tab in your repository to view workflow runs.
   - Check logs for `ci.yml`, `pr-lint.yml`, and `release.yml` to troubleshoot any failures.

6. **Dependency Updates**:
   - Dependabot (`dependabot.yml`) automatically creates PRs for npm, Docker, and GitHub Actions updates.
   - Review and merge these PRs to keep dependencies current.

---

## Development

After opening in the DevContainer, you can:

- **Start the app:**

```
bun run dev --watch
```

- **Test:**

```
bun testbun run test:coveragebun run test:e2e
```

- **Check formatting and linting:**

```
bun run format:checkbun run lint:check
```

- **Commit:**

bunx cz

- **Push:**
  Let CI/CD handle building, testing, and deploying.

---

## Repository Structure

- `.devcontainer/` - DevContainer configuration (automated setup)
- `.github/workflows/` - GitHub Actions CI/CD workflows
- `.github/dependabot.yml` - Dependabot configuration for dependency updates
- `chart/` - Helm chart for Kubernetes deployment
- `pages/` - Next.js app source code
- `__tests__/` - Unit tests
- `e2e/` - Playwright end-to-end tests
- `package.json`, `README.md`

---

## Example Commit Message

feat(homepage): add welcome banner
BREAKING CHANGE: homepage structure refactored

Always use `bunx cz` to help format your commit messages!

---

## Need Help?

Open an issue or ask in Discussions.

---


# 🚀 GitHub Deployment Workflow Setup

This guide describes how to configure GitHub for the `Deploy Website` workflow, which deploys Helm charts to your Kubernetes environments using GitHub Actions.

---

## 📁 1. Create Environments

Go to your repository’s **Settings → Environments**, then:

1. Click **"New environment"**
2. Create the following environments **exactly** with these names:
   - `dev`
   - `staging`
   - `production`

These environments will control secrets, approvals, and visibility for each deployment stage.

---

## 🔐 2. Add Secrets

Each environment must include a secret that allows the workflow to authenticate to [GitHub Container Registry (GHCR)](https://ghcr.io) to pull Helm charts.

---

### 🔑 Recommended Secrets Per Environment

Note: `GHCR_PASSWORD` is just an example of how to setup a secret, there is no need to set it up.

| Name           | Environment  | Example Value                                 | Purpose                                                            |
|----------------|--------------|-----------------------------------------------|--------------------------------------------------------------------|
| `GHCR_PASSWORD`| `dev`        | PAT with `read:packages`                      | Use GitHub’s built-in token for public or same-org GHCR access    |
| `GHCR_PASSWORD`| `staging`    | PAT with `read:packages`                      | Required for private or cross-org GHCR access                     |
| `GHCR_PASSWORD`| `production` | PAT with `read:packages`                      | Use a dedicated, scoped PAT for security and auditability         |

> ✅ Use the same **secret name** (`GHCR_PASSWORD`) in all environments.

---

### 🛠️ To Add a Secret:
1. Go to your **GitHub repository**
2. Navigate to: **Settings → Environments → [dev / staging / production]**
3. Click **"Add secret"**
4. Set:
   - **Name:** `GHCR_PASSWORD`
   - **Value:** Use the example value for the respective environment above

---

### 🔐 How to Create a Personal Access Token (PAT):

1. Visit [https://github.com/settings/tokens](https://github.com/settings/tokens)
2. Click **"Generate new token (classic)"**
3. Set an **expiration date**
4. Select scopes:
   - ✅ `read:packages`
   - ✅ `repo` (only if GHCR or repo is private)
5. Copy the token and paste it into the appropriate GitHub Environment as `GHCR_PASSWORD`

> ⚠️ Once saved in GitHub Secrets, the token is encrypted and only visible to workflows with access to that environment.

## ⚙️ 3. Add Environment Variables (Optional)

You can define per-environment Helm arguments using environment variables to control upgrade behavior.

### Optional Variable:

| Name              | Environment | Example Value                   | Purpose                                      |
|-------------------|-------------|----------------------------------|----------------------------------------------|
| `HELM_EXTRA_ARGS` | `dev`       | `--atomic --wait`               | Ensure rollout finishes and fails safely     |
| `HELM_EXTRA_ARGS` | `staging`   | `--atomic --wait --timeout 5m`  | Wait up to 5 mins, rollback on failure       |
| `HELM_EXTRA_ARGS` | `production`| `--atomic --wait --timeout 10m` | Longer wait for production rollout stability |

### To add:

1. Go to **Settings → Environments → [dev/staging/production]**
2. Click **"Add variable"**
3. Set:
   - **Name:** `HELM_EXTRA_ARGS`
   - **Value:** (see table above for environment-specific recommendation)

> These args are passed directly to `helm upgrade`, allowing environment-specific behavior.


---

## ✅ 4. Require Manual Approvals (Optional but Recommended)

To enforce a manual approval before deploying:

1. Go to **Settings → Environments → [staging / production]**
2. Under **"Deployment protection rules"**, enable:
   - ✅ **"Required reviewers before deployment"**
3. Select the appropriate team or users

This causes GitHub Actions to **pause before deployment** until someone approves it in the UI.

---

## ⏱️ 5. Deployment Timeout

The workflow includes a 2-hour timeout using this setting:

```yaml
timeout-minutes: 120
```