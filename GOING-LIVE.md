# Going live

Everything below is done once. Budget about an hour, most of it waiting.

You will create three free accounts. All three should be in your name and your
email, so you own them outright. I never need your passwords.

Where you see a command in a box, open a terminal in this folder and run it.
Where you see a website, do it in your browser.

---

## Before you start

The tool no longer runs on this laptop on its own. It used to keep its data in
a file here, which was fine for testing but cannot be shared. It now expects a
real database, which is Step 1. Until Step 1 is done, the tool will start but
will fail when a school presses "Show my results".

That is expected. Step 1 takes about five minutes.

---

## Step 1. The database, on Neon

Neon holds the school details and results. Free tier is far more than this tool
will use.

1. Go to **neon.tech** and sign up. Choose "Continue with Google" and use the
   account you want to own this.
2. It will offer to create a project. Name it **linchpin-readiness**. Leave the
   Postgres version alone. For region choose the one nearest Kenya, which is
   usually **AWS eu-central-1 (Frankfurt)**.
3. When the project is made you land on a page showing a **connection string**.
   It starts with `postgresql://` and is long.
4. Make sure the toggle above it says **Pooled connection**. The pooled string
   has `-pooler` in it. This matters: without it the site will run out of
   database connections under load.
5. Copy the whole string.

Now put it on this laptop so you can test locally:

6. In this folder there is a file called `.env.example`. Make a copy of it in
   the same folder and name the copy `.env`
7. Open `.env` and replace the example connection string with the one you
   copied. Keep the quotes.
8. Then run:

```bash
npm run db:push
```

That creates the tables. You should see it report the migration applied.

9. Check it worked:

```bash
npm run dev
```

Open http://localhost:3000, do the check, and press "Show my results". If you
get results, the database is live.

**Note:** the test schools you created while we were building are not in this
new database. They lived in the old file. Nothing of value is lost; those were
test runs, and several of them used the old questions anyway.

---

## Step 2. The code, on GitHub

GitHub stores the code so Vercel can read it. It is not public unless you
choose that.

1. Go to **github.com** and sign up, or sign in if you have an account.
2. Click the **+** at the top right, then **New repository**.
3. Name it **linchpin-readiness**. Choose **Private**. Do not tick any of the
   "Initialize this repository" boxes. Click **Create repository**.
4. GitHub then shows you a page of commands. Ignore it and run these instead,
   replacing `YOUR-USERNAME` with your GitHub username:

```bash
git remote add origin https://github.com/YOUR-USERNAME/linchpin-readiness.git
```

```bash
git branch -M main
```

```bash
git push -u origin main
```

It will ask you to sign in to GitHub. A browser window handles it.

Refresh the GitHub page and you should see the files.

---

## Step 3. The website, on Vercel

Vercel runs the site and gives it a web address.

1. Go to **vercel.com** and click **Sign up**. Choose **Continue with GitHub**,
   so the two accounts are already connected.
2. On the dashboard click **Add New**, then **Project**.
3. Find **linchpin-readiness** in the list and click **Import**.
4. Before deploying, open **Environment Variables** and add one:
   - Name: `DATABASE_URL`
   - Value: the same Neon connection string from Step 1
   - Leave it applied to all three environments
5. Click **Deploy**. It takes two or three minutes.

When it finishes you get an address like
`linchpin-readiness.vercel.app`. Open it. The tool should work end to end,
including downloading a report.

**If the build fails**, the error is almost always the `DATABASE_URL`. Check it
was pasted whole, including the `?sslmode=require` at the end.

---

## Step 4. Your own domain

You agreed on `check.linchpineducation.com`. This assumes you already own
`linchpineducation.com`.

1. In Vercel open your project, then **Settings**, then **Domains**.
2. Type `check.linchpineducation.com` and click **Add**.
3. Vercel shows you a **CNAME** record to create. It looks like:
   - Type: `CNAME`
   - Name: `check`
   - Value: `cname.vercel-dns.com`
4. Go to wherever `linchpineducation.com` is registered, find DNS settings, and
   add that record exactly.
5. Come back to Vercel. It usually verifies within ten minutes, occasionally up
   to a few hours. The certificate is issued automatically, so the address will
   be `https://` with no extra work.

---

## One thing you must decide: the Vercel plan

Vercel's free Hobby plan **is not licensed for commercial use**, and a lead
generation tool for a consultancy is commercial. Their words, not mine.

Your options:

- **Vercel Pro, 20 US dollars a month.** Simplest. Upgrade in Settings, Billing.
- **Netlify or Render instead.** Both have commercial-friendly free tiers. I can
  move the project across in about an hour. Nothing in the code is tied to
  Vercel.

Nothing will break if you launch on Hobby. It is a licensing question, not a
technical one, and it is your call. I am flagging it because it would be worse
to find out later.

---

## After it is live

**Seeing your leads.** Until the admin screen is built:

```bash
npm run leads
```

```bash
npm run leads -- --csv
```

The second writes `leads.csv`, which opens in Excel. Both read the live Neon
database, so they work from this laptop wherever the site is running.

**Changing wording.** Edit the file, then run these three commands:

```bash
git add -A
```

```bash
git commit -m "Reworded the questions"
```

```bash
git push
```

Vercel redeploys automatically in about two minutes. The three files worth
knowing:

- `src/content/assessment.ts` for the questions
- `src/content/report.ts` for the report wording
- `src/content/brand.ts` for contact details

**Checking nothing broke.** Before pushing any wording change:

```bash
npm run verify
```

291 checks. If any fail, do not push.

---

## What is not built yet

- **The admin screen.** Agreed to come after launch. `npm run leads` covers you.
- **Email.** Nothing sends any. Schools download their report; they do not
  receive it. You are not alerted when one completes.
- **Spam protection.** Nothing stops someone submitting nonsense repeatedly.
  Worth adding once the address is public.
- **A privacy notice.** You are collecting names, emails and phone numbers.
  Worth having before you promote it widely.
