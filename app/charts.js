// HomeLedger — small SVG chart builders (no libraries).
// donutChart(parts, size): parts = [{label, value, color}] → SVG donut with
// a center total. barChart(rows, opts): rows = [{label, value, max}] →
// horizontal bars. Both return an SVG string.

function donutChart(parts, size, centerLabel, centerValue) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 8, inner = r * 0.62;
  const total = parts.reduce((s, p) => s + p.value, 0) || 1;
  let a0 = -Math.PI / 2;
  const arcs = parts.map((p) => {
    const frac = p.value / total;
    const a1 = a0 + frac * Math.PI * 2;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const xi1 = cx + inner * Math.cos(a1), yi1 = cy + inner * Math.sin(a1);
    const xi0 = cx + inner * Math.cos(a0), yi0 = cy + inner * Math.sin(a0);
    const d = `M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L ${xi1.toFixed(1)} ${yi1.toFixed(1)} A ${inner} ${inner} 0 ${large} 0 ${xi0.toFixed(1)} ${yi0.toFixed(1)} Z`;
    a0 = a1;
    return `<path d="${d}" fill="${p.color}"><title>${p.label}: ${money(p.value)}</title></path>`;
  }).join('');
  return `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Spending by category" class="donut">` +
    arcs +
    `<text x="${cx}" y="${cy - 4}" text-anchor="middle" class="donut-center-value">${centerValue}</text>` +
    `<text x="${cx}" y="${cy + 16}" text-anchor="middle" class="donut-center-label">${centerLabel}</text></svg>`;
}

function barChart(rows, opts) {
  const o = Object.assign({ width: 560, rowH: 34, barH: 12, maxLabel: 96 }, opts || {});
  const max = Math.max.apply(null, rows.map((r) => r.max || r.value).concat([1]));
  const height = rows.length * o.rowH + 8;
  const x0 = o.maxLabel + 12;
  const w = o.width - x0 - 64;
  const body = rows.map((r, i) => {
    const y = 8 + i * o.rowH;
    const bw = Math.max(2, (r.value / max) * w);
    const pct = r.max ? Math.round((r.value / r.max) * 100) : null;
    return `<g>
      <text x="${o.maxLabel}" y="${y + 12}" text-anchor="end" class="bar-label">${r.label}</text>
      <rect x="${x0}" y="${y}" width="${bw.toFixed(1)}" height="${o.barH}" rx="6" fill="${r.color || '#2D6A4F'}"></rect>
      <text x="${x0 + bw + 8}" y="${y + 12}" class="bar-value">${money0(r.value)}${pct !== null ? ' · ' + pct + '%' : ''}</text>
    </g>`;
  }).join('');
  return `<svg viewBox="0 0 ${o.width} ${height}" role="img" class="bars">${body}</svg>`;
}

function monthBars(months, opts) {
  // months = [{label, income, spending}] → grouped vertical bars.
  const o = Object.assign({ width: 560, height: 220 }, opts || {});
  const max = Math.max.apply(null, months.map((m) => Math.max(m.income, m.spending)).concat([1]));
  const pad = { t: 14, b: 26, l: 44, r: 8 };
  const cw = (o.width - pad.l - pad.r) / months.length;
  const bw = Math.min(22, (cw - 18) / 2);
  const grid = [0.25, 0.5, 0.75, 1].map((f) => {
    const y = pad.t + (1 - f) * (o.height - pad.t - pad.b);
    return `<line x1="${pad.l}" y1="${y}" x2="${o.width - pad.r}" y2="${y}" class="grid-line"></line>
      <text x="${pad.l - 6}" y="${y + 4}" text-anchor="end" class="grid-label">$${Math.round((max * f) / 1000)}k</text>`;
  }).join('');
  const bars = months.map((m, i) => {
    const x = pad.l + i * cw + (cw - bw * 2 - 6) / 2;
    const hI = (m.income / max) * (o.height - pad.t - pad.b);
    const hS = (m.spending / max) * (o.height - pad.t - pad.b);
    const yB = o.height - pad.b;
    return `<g>
      <rect x="${x.toFixed(1)}" y="${(yB - hI).toFixed(1)}" width="${bw}" height="${hI.toFixed(1)}" rx="3" fill="#2D6A4F"><title>${m.label} income ${money(m.income)}</title></rect>
      <rect x="${(x + bw + 6).toFixed(1)}" y="${(yB - hS).toFixed(1)}" width="${bw}" height="${hS.toFixed(1)}" rx="3" fill="#E76F51"><title>${m.label} spending ${money(m.spending)}</title></rect>
      <text x="${(pad.l + i * cw + cw / 2).toFixed(1)}" y="${o.height - 8}" text-anchor="middle" class="grid-label">${m.label}</text>
    </g>`;
  }).join('');
  return `<svg viewBox="0 0 ${o.width} ${o.height}" role="img" class="month-bars">${grid}${bars}</svg>`;
}
