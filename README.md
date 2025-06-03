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
bun testbun run test:coverage
```

- **End-to-end tests (Playwright):**

```
bunx playwright install --with-depsbun run test:e2e
```

- **Format and lint checks:**

```
bun run format:checkbun run lint:check
```

---

## Docker

To build and run the app locally in Docker:

```
bun run builddocker build -t website .docker run -p 3000:3000 website
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
bun run dev
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
