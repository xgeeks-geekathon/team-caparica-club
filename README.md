# AI Assistant for Residency

## Database

So you will need to point to a working mysql database in .env like:

```txt
DATABASE_URL='mysql://advisor:PASSWORd@HOST:3306/advisor?ssl={"rejectUnauthorized":false}'
```

We are using prisma as database orm. The schema is defined at `server/db/schema.ts`. Make updates to it and push via:

```bash
npm run db:push
```

View the database records with the studio:

```bash
npm run db:studio
```

## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run Next.js AI Chatbot. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables) for this, but a `.env` file is all that is necessary.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control access to your various OpenAI and authentication provider accounts.

1. Install Vercel CLI: `npm i -g vercel`
2. Link local instance with Vercel and GitHub accounts (creates `.vercel` directory): `vercel link`
3. Download your environment variables: `vercel env pull`

```bash
npm install
npm run dev
```

Your app template should now be running on [localhost:3000](http://localhost:3000/).
