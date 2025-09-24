This is a simple hackathon app that allows you to estimate engineering effort for a given issue ticket from Sentry github repo.

The app is built with Next.js, Tailwind CSS, and Shadcn UI if needed.

We fetch real issues from Sentry github repo and display them as cards
User can click on a card to see the details of the issue. The estimation will be handled by an agent loop that will be developed by another team member. We need to implement the frontend - the page and actually fetching issues from the repo.
We already have index.html file, but we need to convert it to a Next.js app.
