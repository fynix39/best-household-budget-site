// HomeLedger — household budget data store.
// One source of truth: every figure on every page is computed from the
// transaction list below (plus the monthly aggregates for Jun–Sep).
// Persists to localStorage; "Reset demo data" restores this seed.

const STORE_KEY = 'homeledger-v1';

const CATEGORIES = [
  { id: 'income', label: 'Income', color: '#2D6A4F' },
  { id: 'housing', label: 'Housing', color: '#1B4332' },
  { id: 'groceries', label: 'Groceries', color: '#40916C' },
  { id: 'utilities', label: 'Utilities', color: '#E9A23B' },
  { id: 'transport', label: 'Transport', color: '#5B8DEF' },
  { id: 'dining', label: 'Dining out', color: '#E76F51' },
  { id: 'kids', label: 'Kids & school', color: '#9B5DE5' },
  { id: 'health', label: 'Health', color: '#EF476F' },
  { id: 'entertainment', label: 'Entertainment', color: '#F3722C' },
  { id: 'clothing', label: 'Clothing', color: '#7F5539' },
  { id: 'subscriptions', label: 'Subscriptions', color: '#6C757D' },
  { id: 'household', label: 'Household', color: '#2A9D8F' },
  { id: 'insurance', label: 'Insurance', color: '#4361EE' },
  { id: 'savings', label: 'Savings', color: '#B08968' },
];

const MONTHS = [
  { id: '2026-10', label: 'October 2026' },
  { id: '2026-11', label: 'November 2026' },
];

function seedTransactions() {
  return [
    // ---- November 2026 ----
    { id: 't01', date: '2026-11-01', name: 'Salary — Alvarez Household', category: 'income', amount: 4850.00 },
    { id: 't02', date: '2026-11-01', name: 'Rent — Maple Apartments', category: 'housing', amount: -1450.00 },
    { id: 't03', date: '2026-11-02', name: 'Electric bill — City Power', category: 'utilities', amount: -95.20 },
    { id: 't04', date: '2026-11-03', name: 'Whole Foods Market', category: 'groceries', amount: -86.40 },
    { id: 't05', date: '2026-11-03', name: 'Fuel — Shell', category: 'transport', amount: -42.00 },
    { id: 't06', date: '2026-11-04', name: 'School lunch fees', category: 'kids', amount: -45.00 },
    { id: 't07', date: '2026-11-05', name: 'Transfer to emergency fund', category: 'savings', amount: -500.00 },
    { id: 't08', date: '2026-11-05', name: 'Netflix', category: 'subscriptions', amount: -15.49 },
    { id: 't09', date: '2026-11-06', name: 'Pharmacy — CVS', category: 'health', amount: -28.75 },
    { id: 't10', date: '2026-11-07', name: 'Costco — weekly shop', category: 'groceries', amount: -112.75 },
    { id: 't11', date: '2026-11-08', name: 'Dinner — Olive Garden', category: 'dining', amount: -64.30 },
    { id: 't12', date: '2026-11-09', name: 'Monthly bus passes', category: 'transport', amount: -85.00 },
    { id: 't13', date: '2026-11-10', name: 'Internet — Fiber 500', category: 'utilities', amount: -70.00 },
    { id: 't14', date: '2026-11-11', name: "Trader Joe's", category: 'groceries', amount: -94.20 },
    { id: 't15', date: '2026-11-12', name: 'Freelance design — Lopez Studio', category: 'income', amount: 620.00 },
    { id: 't16', date: '2026-11-12', name: "Kids' shoes — Target", category: 'clothing', amount: -58.00 },
    { id: 't17', date: '2026-11-13', name: 'Movie night — AMC', category: 'entertainment', amount: -42.00 },
    { id: 't18', date: '2026-11-14', name: 'Fuel — Chevron', category: 'transport', amount: -38.50 },
    { id: 't19', date: '2026-11-15', name: 'Water bill', category: 'utilities', amount: -45.00 },
    { id: 't20', date: '2026-11-15', name: 'Costco — weekly shop', category: 'groceries', amount: -128.50 },
    { id: 't21', date: '2026-11-16', name: 'Dentist copay', category: 'health', amount: -60.00 },
    { id: 't22', date: '2026-11-17', name: 'Takeout pizza — Domino’s', category: 'dining', amount: -32.80 },
    { id: 't23', date: '2026-11-18', name: 'Phone bill — T-Mobile', category: 'utilities', amount: -85.00 },
    { id: 't24', date: '2026-11-19', name: 'Whole Foods Market', category: 'groceries', amount: -76.30 },
    { id: 't25', date: '2026-11-20', name: 'Car insurance — Geico', category: 'insurance', amount: -132.00 },
    { id: 't26', date: '2026-11-20', name: 'Tax refund — IRS', category: 'income', amount: 86.50 },
    { id: 't27', date: '2026-11-21', name: 'School supplies — Staples', category: 'kids', amount: -36.40 },
    { id: 't28', date: '2026-11-21', name: 'Gym — Planet Fitness', category: 'health', amount: -39.00 },
    { id: 't29', date: '2026-11-22', name: 'Home Depot — light bulbs', category: 'household', amount: -54.20 },
    { id: 't30', date: '2026-11-23', name: "Trader Joe's", category: 'groceries', amount: -103.85 },
    { id: 't31', date: '2026-11-24', name: 'Fuel — Shell', category: 'transport', amount: -41.75 },
    { id: 't32', date: '2026-11-24', name: 'Spotify', category: 'subscriptions', amount: -11.99 },
    { id: 't33', date: '2026-11-25', name: 'Lunch out — Chipotle', category: 'dining', amount: -28.50 },
    { id: 't34', date: '2026-11-26', name: 'Whole Foods Market', category: 'groceries', amount: -58.90 },
    { id: 't35', date: '2026-11-26', name: 'Amazon — household', category: 'household', amount: -47.60 },
    { id: 't36', date: '2026-11-26', name: 'Downtown parking', category: 'transport', amount: -18.00 },
    // ---- October 2026 ----
    { id: 'o01', date: '2026-10-01', name: 'Salary — Alvarez Household', category: 'income', amount: 4850.00 },
    { id: 'o02', date: '2026-10-01', name: 'Rent — Maple Apartments', category: 'housing', amount: -1450.00 },
    { id: 'o03', date: '2026-10-03', name: 'Costco — weekly shop', category: 'groceries', amount: -121.40 },
    { id: 'o04', date: '2026-10-05', name: 'Electric bill — City Power', category: 'utilities', amount: -88.60 },
    { id: 'o05', date: '2026-10-07', name: 'Fuel — Shell', category: 'transport', amount: -44.20 },
    { id: 'o06', date: '2026-10-08', name: "Trader Joe's", category: 'groceries', amount: -98.75 },
    { id: 'o07', date: '2026-10-10', name: 'Internet — Fiber 500', category: 'utilities', amount: -70.00 },
    { id: 'o08', date: '2026-10-11', name: 'Dinner — Red Lobster', category: 'dining', amount: -71.20 },
    { id: 'o09', date: '2026-10-12', name: 'Freelance design — Lopez Studio', category: 'income', amount: 570.00 },
    { id: 'o10', date: '2026-10-13', name: 'School field trip', category: 'kids', amount: -62.00 },
    { id: 'o11', date: '2026-10-14', name: 'Whole Foods Market', category: 'groceries', amount: -88.90 },
    { id: 'o12', date: '2026-10-15', name: 'Water bill', category: 'utilities', amount: -43.50 },
    { id: 'o13', date: '2026-10-16', name: 'Pharmacy — CVS', category: 'health', amount: -34.10 },
    { id: 'o14', date: '2026-10-17', name: 'Costco — weekly shop', category: 'groceries', amount: -117.60 },
    { id: 'o15', date: '2026-10-18', name: 'Phone bill — T-Mobile', category: 'utilities', amount: -85.00 },
    { id: 'o16', date: '2026-10-20', name: 'Fuel — Chevron', category: 'transport', amount: -39.80 },
    { id: 'o17', date: '2026-10-21', name: 'Takeout — Thai Palace', category: 'dining', amount: -41.50 },
    { id: 'o18', date: '2026-10-22', name: 'Kids’ winter jackets', category: 'clothing', amount: -96.00 },
    { id: 'o19', date: '2026-10-23', name: 'Home Depot — faucet repair', category: 'household', amount: -68.30 },
    { id: 'o20', date: '2026-10-24', name: "Trader Joe's", category: 'groceries', amount: -91.30 },
    { id: 'o21', date: '2026-10-25', name: 'Movie night — AMC', category: 'entertainment', amount: -38.00 },
    { id: 'o22', date: '2026-10-26', name: 'Gym — Planet Fitness', category: 'health', amount: -39.00 },
    { id: 'o23', date: '2026-10-27', name: 'Netflix', category: 'subscriptions', amount: -15.49 },
    { id: 'o24', date: '2026-10-28', name: 'Fuel — Shell', category: 'transport', amount: -40.60 },
    { id: 'o25', date: '2026-10-29', name: 'Whole Foods Market', category: 'groceries', amount: -72.45 },
    { id: 'o26', date: '2026-10-30', name: 'Transfer to emergency fund', category: 'savings', amount: -500.00 },
  ];
}

function seedBudgets() {
  return [
    { category: 'housing', limit: 1450 },
    { category: 'groceries', limit: 700 },
    { category: 'utilities', limit: 320 },
    { category: 'transport', limit: 380 },
    { category: 'dining', limit: 200 },
    { category: 'kids', limit: 300 },
    { category: 'health', limit: 200 },
    { category: 'entertainment', limit: 150 },
    { category: 'clothing', limit: 120 },
    { category: 'subscriptions', limit: 80 },
    { category: 'household', limit: 150 },
    { category: 'insurance', limit: 150 },
  ];
}

function seedBills() {
  return [
    { id: 'b01', name: 'Rent — Maple Apartments', amount: 1450.00, due: '2026-11-01', paid: true },
    { id: 'b02', name: 'Electric — City Power', amount: 95.20, due: '2026-11-10', paid: true },
    { id: 'b03', name: 'Internet — Fiber 500', amount: 70.00, due: '2026-11-12', paid: true },
    { id: 'b04', name: 'Water bill', amount: 45.00, due: '2026-11-15', paid: true },
    { id: 'b05', name: 'Phone — T-Mobile', amount: 85.00, due: '2026-11-18', paid: true },
    { id: 'b06', name: 'Car insurance — Geico', amount: 132.00, due: '2026-11-20', paid: true },
    { id: 'b07', name: 'Gym — Planet Fitness', amount: 39.00, due: '2026-11-25', paid: true },
    { id: 'b08', name: 'Streaming — Netflix', amount: 15.49, due: '2026-11-27', paid: false },
    { id: 'b09', name: 'Credit card — Chase', amount: 210.00, due: '2026-11-28', paid: false },
    { id: 'b10', name: 'Home insurance — State Farm', amount: 96.00, due: '2026-12-02', paid: false },
  ];
}

function seedGoals() {
  return [
    { id: 'g01', name: 'Emergency fund', target: 6000, saved: 4250, note: '6 months of essentials' },
    { id: 'g02', name: 'Family vacation — Bali', target: 2400, saved: 1180, note: 'Flights + hotel, July 2027' },
    { id: 'g03', name: 'New car down payment', target: 8000, saved: 2900, note: 'Trade in the 2016 Civic' },
    { id: 'g04', name: 'Kids’ college fund', target: 10000, saved: 3400, note: '$150 a month, auto-transfer' },
  ];
}

// Monthly totals for Jun–Sep 2026 (past months, summary only; Oct + Nov are
// computed live from the transaction list above).
const PAST_MONTHS = [
  { id: '2026-06', label: 'Jun', income: 5180, spending: 3940 },
  { id: '2026-07', label: 'Jul', income: 5320, spending: 4120 },
  { id: '2026-08', label: 'Aug', income: 5460, spending: 3870 },
  { id: '2026-09', label: 'Sep', income: 5290, spending: 4050 },
];

function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.transactions)) return parsed;
    }
  } catch (e) { /* corrupted storage: fall through to seed */ }
  return seedStore();
}

function seedStore() {
  return {
    transactions: seedTransactions(),
    budgets: seedBudgets(),
    bills: seedBills(),
    goals: seedGoals(),
  };
}

const store = loadStore();

function saveStore() {
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

function resetStore() {
  const fresh = seedStore();
  store.transactions = fresh.transactions;
  store.budgets = fresh.budgets;
  store.bills = fresh.bills;
  store.goals = fresh.goals;
  saveStore();
}

function monthOf(dateStr) { return dateStr.slice(0, 7); }

function transactionsFor(monthId) {
  return store.transactions
    .filter((t) => monthOf(t.date) === monthId)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

function monthSummary(monthId) {
  const txs = transactionsFor(monthId);
  let income = 0, spending = 0, saved = 0;
  const byCategory = {};
  for (const t of txs) {
    if (t.amount >= 0) income += t.amount;
    else if (t.category === 'savings') saved += -t.amount;
    else {
      spending += -t.amount;
      byCategory[t.category] = (byCategory[t.category] || 0) + -t.amount;
    }
  }
  return { income, spending, saved, remaining: income - spending - saved, byCategory, count: txs.length };
}

function categoryLabel(id) {
  const c = CATEGORIES.find((x) => x.id === id);
  return c ? c.label : id;
}

function categoryColor(id) {
  const c = CATEGORIES.find((x) => x.id === id);
  return c ? c.color : '#6C757D';
}

function money(n) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function money0(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}

function fmtDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
