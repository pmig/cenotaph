# WhosNext

A Next.js frontend for exploring issues from the `getsentry/sentry` repository and preparing them for an agent-powered engineering effort estimation loop.

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. (Optional) Create a `.env.local` file and set a GitHub token to increase the API rate limit:
   ```bash
   GITHUB_TOKEN=ghp_your_token_here
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Visit `http://localhost:3000` to browse live GitHub issues and open individual ticket details.

## Available scripts

- `npm run dev` – start the Next.js development server
- `npm run build` – create a production build
- `npm run start` – run the production build
- `npm run lint` – lint the project with ESLint

## Notes

- Issue lists are refreshed from GitHub every five minutes by default.
- Ticket details render Markdown via `react-markdown` and `remark-gfm` for familiarity with the GitHub issue view.
- Styling is powered by Tailwind CSS with a light theme inspired by the original design prototype.
