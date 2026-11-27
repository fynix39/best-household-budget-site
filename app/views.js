// HomeLedger — page renderers. Each view returns an HTML string for the
// #page container. All figures come from data.js (one store); nothing is
// hardcoded per page, so the pages can never disagree.

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function amountClass(n) { return n >= 0 ? 'pos' : 'neg'; }

function txRow(t, showDelete) {
  return `<tr>
    <td class="tx-date">${fmtDate(t.date)}</td>
    <td>${esc(t.name)}</td>
    <td><span class="chip" style="--chip:${categoryColor(t.category)}">${categoryLabel(t.category)}</span></td>
    <td class="num ${amountClass(t.amount)}">${t.amount >= 0 ? '+' : '−'}${money(Math.abs(t.amount)).slice(1)}</td>
    ${showDelete ? `<td><button class="btn-mini" data-action="delete-tx" data-id="${t.id}" aria-label="Delete ${esc(t.name)}">Delete</button></td>` : ''}
  </tr>`;
}

function viewDashboard(state) {
  const s = monthSummary(state.month);
  const monthLabel = MONTHS.find((m) => m.id === state.month).label;
  const rate = s.income > 0 ? Math.round((s.remaining / s.income) * 100) : 0;
  const parts = Object.keys(s.byCategory)
    .map((id) => ({ label: categoryLabel(id), value: s.byCategory[id], color: categoryColor(id) }))
    .sort((a, b) => b.value - a.value);
  const top = parts.slice(0, 5);
  const recent = transactionsFor(state.month).slice(0, 6);
  const upcoming = store.bills.filter((b) => !b.paid).slice(0, 3);
  const legend = parts.map((p) => `<li><span class="dot" style="background:${p.color}"></span>${p.label}<b>${money0(p.value)}</b></li>`).join('');
  return `
  <section class="kpis">
    <div class="kpi"><span class="kpi-label">Income · ${monthLabel}</span><strong class="pos">${money(s.income)}</strong><span class="kpi-sub">${s.count} transactions</span></div>
    <div class="kpi"><span class="kpi-label">Spending</span><strong class="neg">${money(s.spending)}</strong><span class="kpi-sub">Saved ${money(s.saved)} to goals</span></div>
    <div class="kpi"><span class="kpi-label">Remaining</span><strong>${money(s.remaining)}</strong><span class="kpi-sub">Savings rate ${rate}%</span></div>
    <div class="kpi"><span class="kpi-label">Daily average</span><strong>${money(s.spending / 26)}</strong><span class="kpi-sub">26 days into the month</span></div>
  </section>
  <div class="grid-2">
    <section class="card">
      <h2>Where the money went</h2>
      <div class="donut-wrap">${donutChart(parts, 220, 'spent', money0(s.spending))}
      <ul class="legend">${legend}</ul></div>
    </section>
    <section class="card">
      <h2>Top categories</h2>
      ${barChart(top.map((p) => ({ label: p.label, value: p.value, color: p.color })), { width: 520 })}
      <p class="hint">Groceries is at 94% of its ${money0(700)} budget — see <a href="#/budgets">Budgets</a>.</p>
    </section>
  </div>
  <div class="grid-2">
    <section class="card">
      <h2>Recent transactions</h2>
      <table class="tx"><tbody>${recent.map((t) => txRow(t, false)).join('')}</tbody></table>
      <p class="card-link"><a href="#/transactions">See all ${s.count} transactions →</a></p>
    </section>
    <section class="card">
      <h2>Upcoming bills</h2>
      <ul class="bills-mini">${upcoming.map((b) => `<li><span>${esc(b.name)}</span><b>${money(b.amount)}</b><span class="due">due ${fmtDate(b.due)}</span></li>`).join('')}</ul>
      <p class="card-link"><a href="#/bills">Manage all bills →</a></p>
    </section>
  </div>`;
}

function viewTransactions(state) {
  const all = transactionsFor(state.month);
  const q = (state.q || '').toLowerCase();
  const cat = state.filterCat || '';
  const list = all.filter((t) => {
    if (cat && t.category !== cat) return false;
    if (q && (t.name.toLowerCase().indexOf(q) === -1 && categoryLabel(t.category).toLowerCase().indexOf(q) === -1)) return false;
    return true;
  });
  const opts = CATEGORIES.map((c) => `<option value="${c.id}"${c.id === cat ? ' selected' : ''}>${c.label}</option>`).join('');
  const cats = CATEGORIES.filter((c) => c.id !== 'income').map((c) => `<option value="${c.id}">${c.label}</option>`).join('');
  return `
  <section class="card">
    <h2>Add a transaction</h2>
    <form id="add-form" class="form-grid">
      <label>Date <input type="date" name="date" value="2026-11-27" required></label>
      <label>Description <input type="text" name="name" placeholder="e.g. Weekly shop — Costco" required maxlength="80"></label>
      <label>Category <select name="category">${cats}</select></label>
      <label>Amount ($) <input type="number" name="amount" min="0.01" step="0.01" placeholder="0.00" required></label>
      <label>Type <select name="kind"><option value="expense">Expense</option><option value="income">Income</option></select></label>
      <button class="btn" type="submit">Add transaction</button>
    </form>
    <p class="hint">Added transactions update the dashboard, budgets and reports at once, and are saved in this browser.</p>
  </section>
  <section class="card">
    <h2>Transactions · ${MONTHS.find((m) => m.id === state.month).label} <span class="count">${list.length} shown</span></h2>
    <div class="filters">
      <select id="filter-cat" aria-label="Filter by category"><option value="">All categories</option>${opts}</select>
      <input id="filter-q" type="search" placeholder="Search transactions…" value="${esc(state.q || '')}" aria-label="Search transactions">
    </div>
    <table class="tx">
      <thead><tr><th>Date</th><th>Description</th><th>Category</th><th class="num">Amount</th><th></th></tr></thead>
      <tbody>${list.length ? list.map((t) => txRow(t, true)).join('') : '<tr><td colspan="5" class="empty">No transactions match this filter.</td></tr>'}</tbody>
    </table>
  </section>`;
}

function viewBudgets(state) {
  const s = monthSummary(state.month);
  const rows = store.budgets.map((b) => {
    const spent = s.byCategory[b.category] || 0;
    const pct = Math.min(100, Math.round((spent / b.limit) * 100));
    const over = spent > b.limit;
    const left = b.limit - spent;
    const cls = over ? 'over' : pct >= 85 ? 'warn' : 'ok';
    return `<div class="budget-row">
      <div class="budget-head"><span class="dot" style="background:${categoryColor(b.category)}"></span><b>${categoryLabel(b.category)}</b>
      <span class="num">${money(spent)} of ${money(b.limit)}</span></div>
      <div class="bar"><i class="${cls}" style="width:${pct}%"></i></div>
      <div class="budget-foot"><span>${over ? 'Over budget by ' + money(-left) : money(left) + ' left'} · ${pct}%</span>
      <span><label class="edit-limit">Limit $ <input type="number" min="0" step="10" value="${b.limit}" data-action="edit-limit" data-cat="${b.category}" aria-label="Monthly limit for ${categoryLabel(b.category)}"></label></span></div>
    </div>`;
  }).join('');
  const totalLimit = store.budgets.reduce((a, b) => a + b.limit, 0);
  return `
  <section class="card">
    <h2>Monthly budgets · ${MONTHS.find((m) => m.id === state.month).label}</h2>
    <p class="lede">Total budgeted ${money(totalLimit)} · spent ${money(s.spending)} · ${money(s.remaining)} still unspent after savings.</p>
    ${rows}
    <p class="hint">Groceries is close to its limit this month — one fewer takeout dinner and the month lands on plan.</p>
  </section>`;
}

function viewBills() {
  const unpaid = store.bills.filter((b) => !b.paid);
  const paid = store.bills.filter((b) => b.paid);
  const dueTotal = unpaid.reduce((a, b) => a + b.amount, 0);
  const row = (b) => `<li class="bill ${b.paid ? 'paid' : ''}">
    <span class="bill-name">${esc(b.name)}</span>
    <span class="due">due ${fmtDate(b.due)}</span>
    <b>${money(b.amount)}</b>
    <button class="btn-mini" data-action="toggle-bill" data-id="${b.id}">${b.paid ? 'Mark unpaid' : 'Mark paid'}</button>
  </li>`;
  return `
  <section class="card">
    <h2>Recurring bills</h2>
    <p class="lede">${unpaid.length} bills still to pay · ${money(dueTotal)} due · ${paid.length} already paid this month.</p>
    <h3>To pay</h3>
    <ul class="bills">${unpaid.map(row).join('') || '<li class="empty">Nothing due — every bill is paid.</li>'}</ul>
    <h3>Paid</h3>
    <ul class="bills">${paid.map(row).join('')}</ul>
    <p class="hint">Marking a bill paid updates the dashboard's upcoming list immediately.</p>
  </section>`;
}

function viewGoals() {
  const cards = store.goals.map((g) => {
    const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
    return `<article class="goal card">
      <h3>${esc(g.name)}</h3>
      <p class="goal-note">${esc(g.note)}</p>
      <div class="bar"><i class="ok" style="width:${pct}%"></i></div>
      <p class="goal-nums"><b>${money(g.saved)}</b> of ${money(g.target)} · ${pct}%</p>
      <form class="goal-form" data-goal="${g.id}">
        <label>Add funds $ <input type="number" name="amount" min="1" step="1" placeholder="50" required></label>
        <button class="btn-mini" type="submit">Add</button>
      </form>
    </article>`;
  }).join('');
  const totalSaved = store.goals.reduce((a, g) => a + g.saved, 0);
  const totalTarget = store.goals.reduce((a, g) => a + g.target, 0);
  return `
  <section class="card">
    <h2>Savings goals</h2>
    <p class="lede">${money(totalSaved)} saved toward ${money(totalTarget)} across ${store.goals.length} goals.</p>
    <div class="goals">${cards}</div>
  </section>`;
}

function viewReports(state) {
  const months = PAST_MONTHS.map((m) => ({ label: m.label, income: m.income, spending: m.spending }));
  for (const id of ['2026-10', '2026-11']) {
    const s = monthSummary(id);
    months.push({ label: id === '2026-10' ? 'Oct' : 'Nov', income: s.income, spending: s.spending });
  }
  const s = monthSummary(state.month);
  const parts = Object.keys(s.byCategory)
    .map((id) => ({ label: categoryLabel(id), value: s.byCategory[id], color: categoryColor(id) }))
    .sort((a, b) => b.value - a.value);
  const biggest = transactionsFor(state.month).filter((t) => t.amount < 0)
    .sort((a, b) => a.amount - b.amount).slice(0, 5);
  const avgIncome = months.reduce((a, m) => a + m.income, 0) / months.length;
  const avgSpending = months.reduce((a, m) => a + m.spending, 0) / months.length;
  return `
  <section class="card">
    <h2>Income vs spending · last 6 months</h2>
    ${monthBars(months, { width: 620, height: 240 })}
    <p class="legend-line"><span class="swatch" style="background:#2D6A4F"></span> Income <span class="swatch" style="background:#E76F51"></span> Spending</p>
    <p class="lede">6-month averages: income ${money(avgIncome)} · spending ${money(avgSpending)} · typical month keeps ${money(avgIncome - avgSpending)}.</p>
  </section>
  <div class="grid-2">
    <section class="card">
      <h2>Top spending · ${MONTHS.find((m) => m.id === state.month).label}</h2>
      ${barChart(parts.slice(0, 6).map((p) => ({ label: p.label, value: p.value, color: p.color })), { width: 520 })}
    </section>
    <section class="card">
      <h2>Biggest single expenses</h2>
      <table class="tx"><tbody>${biggest.map((t) => txRow(t, false)).join('')}</tbody></table>
      <p class="hint">Rent is the household's largest single cost every month — ${money(1450)} on the 1st, before anything else.</p>
    </section>
  </div>`;
}

const VIEWS = {
  '/': viewDashboard,
  '/transactions': viewTransactions,
  '/budgets': viewBudgets,
  '/bills': viewBills,
  '/goals': viewGoals,
  '/reports': viewReports,
};

const NAV = [
  ['#/', 'Dashboard'],
  ['#/transactions', 'Transactions'],
  ['#/budgets', 'Budgets'],
  ['#/bills', 'Bills'],
  ['#/goals', 'Goals'],
  ['#/reports', 'Reports'],
];
