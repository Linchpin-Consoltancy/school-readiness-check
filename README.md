# School Readiness Check

A free, single screen self assessment for Kenyan school owners and heads, built
for [Linchpin Education](https://linchpineducation.com).

A school leader answers 21 short questions about how their school is set up to
deliver CBE. At the end they give their name, email and phone number, and get a
report showing which of seven areas needs attention first, and why.

The tool exists to start conversations. The report is genuinely useful on its
own, and it shows a school director that Linchpin understands both their school
and where they are trying to take it.

## The seven areas

| Code | Area |
| --- | --- |
| D01 | Leading the Change |
| D02 | Teachers Who Can Deliver |
| D03 | Teaching That Builds Competence |
| D04 | Proof of Learning |
| D05 | Talent and Pathways |
| D06 | Parents as Partners |
| D07 | Character and Trust |

Each area is asked about through three lenses: **Design** (is it planned),
**Delivery** (is it happening), and **Evidence** (can you show it). Where one
lens sits well below the other two, the report says so, because that gap is
usually where the real problem is.

## Running it on this machine

```bash
npm install
npm run dev
```

Then open the address the terminal prints, usually http://localhost:3000.

## Changing the words

Almost all the wording lives in three files, and each one carries instructions
at the top for editing it safely without touching any code.

| File | What is in it |
| --- | --- |
| `src/content/assessment.ts` | The seven areas and all 21 questions |
| `src/content/report.ts` | Every line of the report, including the 28 descriptors |
| `src/content/brand.ts` | Website, email and WhatsApp number shown on every screen |

After any edit, run `npm run verify`. It checks 291 things, including that the
questions still line up with the scoring and that the contact details work.

## Useful commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the tool on this machine |
| `npm run verify` | Check the content and the scoring are sound |
| `npm run leads` | List every school that has completed the check |
| `npm run leads -- --csv` | The same list as a spreadsheet file |
| `npm run build` | Build the production version |

## How the scoring works

Each answer is 1 (Not yet), 2 (Patchy), 3 (Solid) or 4 (Strength).

1. The three lens scores are averaged into one score per area.
2. That score sets a priority: Critical, High, Moderate or Sustain.
3. If any lens sits 1.5 or more away from its area score, the report flags it.
4. Areas are listed weakest first, so the most urgent work is at the top.

The full logic, with worked examples, is in `src/lib/scoring.ts`.

## What is stored

Every completed check saves the school profile, all 21 answers and the seven
area scores. Reports are rebuilt from that record on demand, so a report can
always be produced again later.

Local data lives in a SQLite file that is not committed. Nothing in this
repository contains personal data or credentials.
