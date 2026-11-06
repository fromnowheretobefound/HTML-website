/* Pulse is a client-side demonstration. Every sample is simulated, not production telemetry. */
(() => {
  'use strict';
  const INTERVAL_MS = 3000;
  const MAX_SAMPLES = 60;
  const $ = (id) => document.getElementById(id);
  const format = new Intl.NumberFormat('en-US');
  const clock = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const teams = [
    { name: 'Engineering', initials: 'EN', total: 120, done: 105 },
    { name: 'Product & Design', initials: 'PD', total: 80, done: 75 },
    { name: 'Customer Success', initials: 'CS', total: 100, done: 79 },
    { name: 'Operations', initials: 'OP', total: 100, done: 92 }
  ];
  const baselineUsers = 12846;
  const history = [];
  let paused = motion.matches;
  let windowSize = 20;
  let trafficChart = null;
  let resourceChart = null;
  let current;
  const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  // Historical points are also synthetic, evenly spaced at three-second intervals.
  const startedAt = Date.now();
  for (let i = MAX_SAMPLES - 1; i >= 0; i -= 1) {
    history.push({ time: startedAt - i * INTERVAL_MS, inbound: random(160, 300), outbound: random(85, 180) });
  }

  $('team-rows').innerHTML = teams.map((team, index) => `
    <tr><th scope="row"><span class="team-name"><span class="team-avatar" aria-hidden="true">${team.initials}</span>${team.name}</span></th>
    <td class="team-count" id="team-count-${index}"></td>
    <td><div class="completion-cell"><progress id="team-progress-${index}" max="100" value="0" aria-label="${team.name} task completion"></progress><span id="team-percent-${index}"></span></div></td>
    <td><span class="status-pill" id="team-status-${index}"></span></td></tr>`).join('');

  function createSample(initial = false) {
    if (!initial) {
      // Each cycle is bounded. A completed cycle starts a new workload automatically.
      if (teams.every((team) => team.done === team.total)) {
        teams.forEach((team) => { team.done = Math.round(team.total * random(65, 80) / 100); });
      } else {
        teams.forEach((team) => { team.done = Math.min(team.total, team.done + random(0, 2)); });
      }
      const last = history[history.length - 1];
      history.push({ time: Date.now(), inbound: clamp(last.inbound + random(-35, 35), 100, 380), outbound: clamp(last.outbound + random(-22, 22), 45, 230) });
      if (history.length > MAX_SAMPLES) history.shift();
    }
    const compute = random(36, 44);
    const storage = random(22, 28);
    const network = random(14, 20);
    const done = teams.reduce((sum, team) => sum + team.done, 0);
    const total = teams.reduce((sum, team) => sum + team.total, 0);
    return {
      time: history[history.length - 1].time,
      users: initial ? baselineUsers : clamp(current.users + random(-80, 110), 10000, 18000),
      uptime: random(9985, 10000) / 100,
      response: random(135, 275),
      done, total, completion: Math.round(done / total * 100),
      resources: [compute, storage, network, 100 - compute - storage - network]
    };
  }

  function renderMetrics() {
    $('active-users').textContent = format.format(current.users);
    const change = (current.users - baselineUsers) / baselineUsers * 100;
    $('users-change').textContent = `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
    $('users-change').classList.toggle('warning', change < 0);
    $('system-uptime').textContent = `${current.uptime.toFixed(2)}%`;
    $('uptime-state').textContent = current.uptime >= 99.9 ? 'On target' : 'Below target';
    $('uptime-state').classList.toggle('warning', current.uptime < 99.9);
    $('task-completion').textContent = `${current.completion}%`;
    $('task-count').textContent = `${current.done} / ${current.total} tasks`;
    $('task-progress').value = current.completion;
    $('task-progress').textContent = `${current.completion}%`;
    $('response-time').textContent = current.response;
    $('latency-state').textContent = current.response < 250 ? 'Within target' : 'Above target';
    $('latency-state').classList.toggle('warning', current.response >= 250);
    $('latency-marker').style.left = `${Math.min(98, current.response / 400 * 100)}%`;
    $('updated-at').textContent = `Updated ${clock.format(current.time)}`;
    const latest = history[history.length - 1];
    $('traffic-total').textContent = latest.inbound + latest.outbound;
    $('traffic-description').textContent = `Latest: inbound ${latest.inbound} Mb/s; outbound ${latest.outbound} Mb/s. Showing ${Math.min(windowSize, history.length)} simulated samples, spaced 3 seconds apart while running. Hover or tap a chart point for its timestamp.`;
    ['compute', 'storage', 'network', 'available'].forEach((key, index) => {
      $(`${key}-value`).textContent = `${current.resources[index]}%`;
    });
    $('allocated-percent').textContent = `${100 - current.resources[3]}%`;
    teams.forEach((team, index) => {
      const percent = Math.round(team.done / team.total * 100);
      $(`team-count-${index}`).textContent = `${team.done} / ${team.total}`;
      $(`team-progress-${index}`).value = percent;
      $(`team-progress-${index}`).textContent = `${percent}%`;
      $(`team-percent-${index}`).textContent = `${percent}%`;
      $(`team-status-${index}`).textContent = percent >= 85 ? 'On track' : 'Needs attention';
      $(`team-status-${index}`).classList.toggle('warning', percent < 85);
    });
  }

  function chartData() {
    const samples = history.slice(-windowSize);
    return { labels: samples.map((sample) => clock.format(sample.time)), inbound: samples.map((sample) => sample.inbound), outbound: samples.map((sample) => sample.outbound) };
  }

  function initializeCharts() {
    if (typeof window.Chart !== 'function') { $('chart-error').hidden = false; return; }
    const colors = getComputedStyle(document.documentElement);
    const accent = colors.getPropertyValue('--accent').trim();
    const blue = colors.getPropertyValue('--blue').trim();
    const violet = colors.getPropertyValue('--violet').trim();
    Chart.defaults.color = '#a4b2be';
    Chart.defaults.font.family = "'Fira Sans', sans-serif";
    Chart.defaults.font.size = 11;
    Chart.defaults.borderColor = '#2b3943';
    const data = chartData();
    const common = { responsive: true, maintainAspectRatio: false, animation: false, plugins: { legend: { display: false } } };
    trafficChart = new Chart($('traffic-chart'), {
      type: 'line',
      data: { labels: data.labels, datasets: [
        { label: 'Inbound', data: data.inbound, borderColor: accent, backgroundColor: '#86e4b012', fill: true, borderWidth: 2, tension: .35, pointRadius: 0, pointHitRadius: 16 },
        { label: 'Outbound', data: data.outbound, borderColor: blue, borderDash: [5, 4], backgroundColor: 'transparent', borderWidth: 2, tension: .35, pointRadius: 0, pointHitRadius: 16 }
      ] },
      options: { ...common, interaction: { intersect: false, mode: 'index' }, plugins: { ...common.plugins, tooltip: { callbacks: { label: (context) => `${context.dataset.label}: ${context.parsed.y} Mb/s` } } }, scales: {
        x: { grid: { display: false }, border: { display: false }, ticks: { maxTicksLimit: 5, maxRotation: 0 } },
        y: { beginAtZero: true, suggestedMax: 400, border: { display: false }, ticks: { maxTicksLimit: 5, callback: (value) => `${value} Mb/s` }, grid: { color: '#26323b' } }
      } }
    });
    resourceChart = new Chart($('resource-chart'), {
      type: 'doughnut',
      data: { labels: ['Compute', 'Storage', 'Network', 'Available'], datasets: [{ data: current.resources, backgroundColor: [accent, blue, violet, '#637382'], borderColor: '#121a20', borderWidth: 5, hoverOffset: 3, borderRadius: 5 }] },
      options: { ...common, cutout: '78%', plugins: { ...common.plugins, tooltip: { callbacks: { label: (context) => `${context.label}: ${context.parsed}%` } } } }
    });
  }

  function updateCharts() {
    if (!trafficChart || !resourceChart) return;
    const data = chartData();
    trafficChart.data.labels = data.labels;
    trafficChart.data.datasets[0].data = data.inbound;
    trafficChart.data.datasets[1].data = data.outbound;
    resourceChart.data.datasets[0].data = current.resources;
    trafficChart.update('none');
    resourceChart.update('none');
  }

  function renderStreamState() {
    const stopped = paused || document.hidden;
    $('stream-state').textContent = stopped ? 'Simulation paused' : 'Simulated live stream';
    $('stream-dot').classList.toggle('paused', stopped);
    $('pause-button').setAttribute('aria-pressed', String(paused));
    $('pause-button').innerHTML = `<i class="fa-solid fa-${paused ? 'play' : 'pause'}" aria-hidden="true"></i><span>${paused ? 'Resume updates' : 'Pause updates'}</span>`;
  }

  $('pause-button').addEventListener('click', () => {
    paused = !paused;
    renderStreamState();
    $('control-status').textContent = paused ? 'Automatic updates paused.' : 'Automatic updates resumed. New samples arrive every three seconds.';
  });
  $('history-window').addEventListener('change', (event) => {
    windowSize = Number(event.target.value);
    updateCharts();
    renderMetrics();
  });
  document.addEventListener('visibilitychange', renderStreamState);
  motion.addEventListener('change', (event) => {
    if (event.matches) {
      paused = true;
      renderStreamState();
      $('control-status').textContent = 'Updates paused to respect your reduced motion preference. Use Resume updates to opt in.';
    }
  });
  $('export-button').addEventListener('click', () => {
    const latest = history[history.length - 1];
    const rows = [
      ['Pulse dashboard snapshot', 'SIMULATED DATA'],
      ['Sample timestamp (UTC)', new Date(current.time).toISOString()],
      ['Metric', 'Value', 'Unit'],
      ['Active users', current.users, 'users'], ['System uptime', current.uptime, '%'],
      ['Task completion', current.completion, '%'], ['Completed tasks', current.done, 'tasks'],
      ['Total tasks', current.total, 'tasks'], ['Response time', current.response, 'ms'],
      ['Inbound traffic', latest.inbound, 'Mb/s'], ['Outbound traffic', latest.outbound, 'Mb/s'],
      ...['Compute', 'Storage', 'Network', 'Available'].map((name, index) => [name, current.resources[index], '%']),
      [], ['Team', 'Completed tasks', 'Total tasks'], ...teams.map((team) => [team.name, team.done, team.total])
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `pulse-demo-snapshot-${new Date(current.time).toISOString().replaceAll(':', '-')}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    $('control-status').textContent = 'Simulated KPI snapshot exported as CSV.';
  });

  current = createSample(true);
  renderMetrics();
  initializeCharts();
  renderStreamState();
  if (paused) $('control-status').textContent = 'Updates start paused to respect your reduced motion preference. Use Resume updates to opt in.';
  // A single timer; hidden tabs do not generate or render samples.
  window.setInterval(() => {
    if (paused || document.hidden) return;
    current = createSample();
    renderMetrics();
    updateCharts();
  }, INTERVAL_MS);
})();
