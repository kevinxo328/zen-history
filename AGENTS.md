# Project Architecture: Zen History

Zen History is a browser extension developed with the [WXT](https://wxt.dev/) framework. This document provides a high-level overview of the project structure and development environment for AI agents.

## Technology Stack

- **Framework:** [WXT](https://wxt.dev/) (Web Extension Toolbox)
- **Frontend Library:** [Vue 3](https://vuejs.org/)
- **State Management:** [Pinia](https://pinia.vuejs.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Testing:** [Vitest](https://vitest.dev/)
- **I18n:** [Vue I18n](https://vue-i18n.intlify.dev/)
- **Package Manager:** `pnpm`

## Directory Structure

- `src/`: Main source code directory.
  - `entrypoints/`: Extension entry points (background, popup, settings).
  - `components/`: Vue components.
  - `stores/`: Pinia stores.
  - `lib/`: Shared logic and utility functions.
  - `assets/`: Static assets and locales.
  - `types/`: TypeScript definitions.
- `test/`: Unit and integration tests.
- `openspec/`: Project specifications and change tracking.
- `public/`: Static files for the extension manifest.

## Common Scripts

The following scripts are available via `pnpm [script]`:

| Script | Command | Description |
| :--- | :--- | :--- |
| `dev` | `wxt` | Start development mode (Chrome) |
| `dev:firefox` | `wxt -b firefox` | Start development mode (Firefox) |
| `build` | `wxt build` | Build for production (Chrome) |
| `test` | `vitest run && pnpm type-check` | Run tests and type checking |
| `lint` | `eslint . --fix` | Lint and fix code |
| `format` | `prettier --write .` | Format code |
| `type-check` | `vue-tsc --noEmit` | Run TypeScript type check |
| `clean` | `rimraf .wxt dist` | Clean build artifacts |

## AI Agent Guidelines

1. **Follow OpenSpec:** Refer to `openspec/` for requirements before implementing changes.
2. **Standardization:** Adhere to the established directory structure for new files.
3. **Verification:** Always run `pnpm test` and `pnpm lint` before completing a task.
