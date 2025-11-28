# Repository Guidelines

This repo hosts a Mentra Live smart-glasses app that guides users through assembling an wooden box by sending photos to an OpenAI-backed assistant and returning short audio-friendly steps.

## Project Structure & Module Organization
- `index.ts`: Mentra `AppServer` entry; registers the `process_assembly_input` tool, handles session lifecycle, and writes captured photos to `tmp/`.
- `assistant.ts`: Wraps the OpenAI Responses API with assembly-focused system instructions and threads context via `previousResponseId`.
- `mentra-app-config.json`: Mentra manifest; keep tool ids/parameters in sync with `index.ts` and the MentraOS Developer Console.
- Config/support: `.env.example` lists required secrets, `tsconfig.json` uses strict ESNext/bundler settings, `bun.lock`/`package.json` lock dependencies.
- Working dirs: `tmp/` (gitignored) holds camera snapshots; `README.md` covers quick start.

## Build, Test, and Development Commands
- `bun install` — install dependencies.
- `bun run start` (alias `bun run index.ts`) — start the Mentra App locally; requires env vars in `.env`.
- `bun run check-types` — type-check with `tsc --noEmit`. Always run this before committing.
- `bun run format` — apply Prettier to `*.ts` files. Always run this before committing.

## Testing Guidelines
- No automated tests yet; rely on `bun run check-types` and manual Mentra Live flow.
