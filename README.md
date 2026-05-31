# A Brown Diary Portfolio

Next.js portfolio and editorial site for A Brown Diary. The public site uses large kinetic typography, smooth scrolling, page transitions, magnetic buttons, hover-preview work lists, project detail pages, and a footer contact reveal inspired by the requested reference.

## Content Editing

Editable content lives in `app/_content/site-content.json`.

The private owner dashboard is available at `/dashboard`. It is not linked in the public navigation and requires these environment variables:

- `ADMIN_PASSWORD`
- `ADMIN_SECRET`
- `GITHUB_TOKEN`
- `GITHUB_REPO` defaults to `abrowndiary/A-Brown-Diary-portfolio`
- `GITHUB_BRANCH` defaults to `main`

When publishing from the dashboard, the app commits the JSON content file back to GitHub. Your host may need a redeploy before visitors see the update.

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
```
