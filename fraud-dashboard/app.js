// app.js

// Sample data (edit yahan se)
const data = {
  total_users_analyzed: 1520,
  fraud_risk_percent: 27,
  alerts: 14,
  avg_risk_score: 42,
  trend_labels: ['6d','5d','4d','3d','2d','1d','Today'],
  trend_values: [30, 45, 60, 40, 70, 50, 42],
  recent_transactions: [
    { txn: 'TXN1021', user: 'John', amount: '₹2,500', risk: 'High' },
    { txn: 'TXN1055', user: 'Ali', amount: '₹1,200', risk: 'Medium' },
    { txn: 'TXN1099', user: 'Kiran', amount: '₹300', risk: 'Low' },
    { txn: 'TXN1100', user: 'Priya', amount: '₹4,500', risk: 'High' },
    { txn: 'TXN1104', user: 'Ramesh', amount: '₹700', risk: 'Medium' }
  ]
};

// Populate summary cards
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('totalUsers').innerText = data.total_users_analyzed;
  document.getElementById('alertsCount').innerText = data.alerts;
  document.getElementById('avgRisk').innerText = data.avg_risk_score;
  document.getElementById('gaugeValue').innerText = data.fraud_risk_percent + '%';

  // Fill table
  const tbody = document.getElementById('txnTableBody');
  data.recent_transactions.forEach(tx => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${tx.txn}</td>
      <td>${tx.user}</td>
      <td>${tx.amount}</td>
      <td>${formatRiskBadge(tx.risk)}</td>
    `;
    tbody.appendChild(tr);
  });

  // Gauge chart as doughnut
  const gaugeCtx = document.getElementById('gaugeChart').getContext('2d');
  new Chart(gaugeCtx, {
    type: 'doughnut',
    data: {
      labels: ['Risk','Safe'],
      datasets: [{
        data: [data.fraud_risk_percent, 100 - data.fraud_risk_percent],
        borderWidth: 0
      }]
    },
    options: {
      cutout: '80%',
      rotation: -90,
      circumference: 180,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      }
    }
  });

  // Trend chart (line)
  const trendCtx = document.getElementById('trendChart').getContext('2d');
  new Chart(trendCtx, {
    type: 'line',
    data: {
      labels: data.trend_labels,
      datasets: [{
        label: 'Avg Risk Score',
        data: data.trend_values,
        tension: 0.4,
        fill: true,
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, max: 100 }
      }
    }
  });

  // Search simple filter
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', function () {
    const q = this.value.toLowerCase();
    Array.from(tbody.children).forEach(row => {
      const text = row.innerText.toLowerCase();
      row.style.display = text.includes(q) ? '' : 'none';
    });
  });

  // load more example (just duplicates)
  document.getElementById('loadMore').addEventListener('click', function () {
    data.recent_transactions.forEach(tx => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${tx.txn + '-x'}</td><td>${tx.user}</td><td>${tx.amount}</td><td>${formatRiskBadge(tx.risk)}</td>`;
      tbody.appendChild(tr);
    });
  });

}); // DOMContentLoaded

function formatRiskBadge(level) {
  if (!level) return '';
  if (level.toLowerCase() === 'high') return '<span class="badge-risk-high">High</span>';
  if (level.toLowerCase() === 'medium' || level.toLowerCase() === 'med') return '<span class="badge-risk-med">Medium</span>';
  return '<span class="badge-risk-low">Low</span>';
}
