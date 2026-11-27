# HomeLedger — Household Budget

A household budget site that runs entirely in the browser: track income and
spending, keep each category on its monthly budget, never miss a bill, and
watch savings goals grow. No account, no cloud, no ads — your data stays in
your browser (localStorage).

## What it does

- **Dashboard** — the month at a glance: income, spending, remaining, savings
  rate, a spending-by-category donut, top categories, recent transactions and
  upcoming bills.
- **Transactions** — the full list for the month, with category filter and
  search. Add income or expenses (they update every page at once) and delete
  any entry. Switch between October and November 2026 from the header.
- **Budgets** — a monthly limit per category with a progress bar, spent vs
  limit, and an editable limit that saves.
- **Bills** — recurring bills with due dates; mark each paid or unpaid.
- **Goals** — savings goals with progress bars and an add-funds control.
- **Reports** — income vs spending for the last 6 months, top spending
  categories, and the biggest single expenses.

All figures are computed live from one transaction list, so the pages can
never disagree. Demo data is the Alvarez household (2 adults, 2 kids);
"Reset demo data" in the footer restores it.

## Run it

Open `app/index.html` in a browser, or serve it locally:

```
node serve.ts
# → http://localhost:8080/
```

No build step, no dependencies, no network requests. Vanilla JavaScript and
hand-rolled SVG charts; first load is about 43 KB.

## Layout

```
app/
  index.html   page shell, nav, month switcher
  style.css    the design (deep green + warm cream + amber)
  data.js      seed data, store, persistence, summaries
  charts.js    SVG donut + bar chart builders
  views.js     the six page renderers
  app.js       hash router, boot, event handling
main.ts        hand-in program: copies app/ + screenshots/ to /output and
               writes dossier.json via vendor/makefun-frontend.ts
```

## Entry

Built for the make.fun competition "Make the best household budget site"
(best-household-budget-site-20261126-1457). MIT licensed.
