// HomeLedger — router, boot and event handling.
// Hash routes (#/, #/transactions, #/budgets, #/bills, #/goals, #/reports).
// One delegated click/submit/input handler: every control on every page
// works through it, and every change re-renders from the store.

const state = { month: '2026-11', q: '', filterCat: '' };

function currentRoute() {
  const h = location.hash.replace(/^#/, '') || '/';
  return VIEWS[h] ? h : '/';
}

function render() {
  const route = currentRoute();
  document.querySelectorAll('.nav a').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + route);
  });
  const monthSel = document.getElementById('month-select');
  if (monthSel) monthSel.value = state.month;
  document.getElementById('page').innerHTML = VIEWS[route](state);
}

function newTxId() {
  return 'u' + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36);
}

function addTransaction(form) {
  const fd = new FormData(form);
  const kind = fd.get('kind');
  const amount = Math.abs(parseFloat(fd.get('amount')));
  if (!amount || amount <= 0) return;
  store.transactions.push({
    id: newTxId(),
    date: fd.get('date') || state.month + '-27',
    name: String(fd.get('name')).trim() || 'Untitled',
    category: fd.get('category'),
    amount: kind === 'income' ? amount : -amount,
  });
  saveStore();
  render();
}

function deleteTransaction(id) {
  store.transactions = store.transactions.filter((t) => t.id !== id);
  saveStore();
  render();
}

function toggleBill(id) {
  const b = store.bills.find((x) => x.id === id);
  if (b) { b.paid = !b.paid; saveStore(); render(); }
}

function addGoalFunds(form, goalId) {
  const amount = parseFloat(new FormData(form).get('amount'));
  if (!amount || amount <= 0) return;
  const g = store.goals.find((x) => x.id === goalId);
  if (g) { g.saved += amount; saveStore(); render(); }
}

function setBudgetLimit(cat, value) {
  const b = store.budgets.find((x) => x.category === cat);
  const limit = Math.max(0, parseFloat(value) || 0);
  if (b) { b.limit = limit; saveStore(); render(); }
}

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const action = el.getAttribute('data-action');
  if (action === 'delete-tx') deleteTransaction(el.getAttribute('data-id'));
  if (action === 'toggle-bill') toggleBill(el.getAttribute('data-id'));
  if (action === 'reset-data') { if (confirm('Reset all data to the demo household?')) { resetStore(); render(); } }
});

document.addEventListener('submit', (e) => {
  if (e.target.id === 'add-form') { e.preventDefault(); addTransaction(e.target); }
  if (e.target.classList.contains('goal-form')) { e.preventDefault(); addGoalFunds(e.target, e.target.getAttribute('data-goal')); }
});

document.addEventListener('change', (e) => {
  if (e.target.id === 'month-select') { state.month = e.target.value; render(); }
  if (e.target.id === 'filter-cat') { state.filterCat = e.target.value; render(); }
  if (e.target.getAttribute('data-action') === 'edit-limit') {
    setBudgetLimit(e.target.getAttribute('data-cat'), e.target.value);
  }
});

document.addEventListener('input', (e) => {
  if (e.target.id === 'filter-q') { state.q = e.target.value; render(); }
});

window.addEventListener('hashchange', render);

render();
