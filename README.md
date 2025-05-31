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

- **Unit tests:**

```
bun test
```
- **End-to-end tests (Playwright):**
```
bunx playwright install --with-deps
bun run test:e2e
```

---

## Docker

To build and run the app locally in Docker:

```
bun run build
docker build -t website .
docker run -p 3000:3000 website
```

---

## Helm

- The image and tag are set by CI.
- To package and install the chart manually:

```
helm package chart/
helm install website chart-*.tgz
```


---

## CI/CD & Automated Versioning

GitHub Actions workflow will:

- Lint PR commits for Conventional Commit compliance.
- Calculate the next SemVer version from commit history.
- Run all unit and E2E tests.
- Build and push a versioned Docker image to ghcr.io/declare-cloud/website.
- Update the Helm chart version and push to GitHub Container Registry.

The version for Docker and Helm is determined by commit history – you don’t need to change it manually.

---

## Development

After opening in the DevContainer, you can:

- **Start the app:**
```
bun run dev
```
- **Test:**
```
bun test
bun run test:e2e
```
- **Commit:**
```
bunx cz
```
- **Push:**  
Let CI/CD handle building, testing, and deploying.

---

## Repository Structure

- `.devcontainer/` - DevContainer configuration (automated setup)
- `.github/workflows/` - GitHub Actions CI/CD workflows
- `chart/` - Helm chart for Kubernetes deployment
- `pages/` - Next.js app source code
- `__tests__/` - Unit tests
- `e2e/` - Playwright end-to-end tests
- `package.json`, `README.md`

---

## Example Commit Message

```
feat(homepage): add welcome banner

BREAKING CHANGE: homepage structure refactored
```

Always use `bunx cz` to help format your commit messages!

---

## Need Help?

Open an issue or ask in Discussions.

---
