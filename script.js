/*
MIT License

Copyright (c) 2023-2026 Georgia Rachel and contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
/* Pulse is a client-side demonstration. Every sample is simulated, not production telemetry. */
(() => {
  'use strict';
  const INTERVAL_MS = 3000;
  const MAX_SAMPLES = 60;
  const $ = (id) => document.getElementById(id);
  const format = new Intl.NumberFormat('en-US');
  const clock = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const defaultTeams = [
    { name: 'Engineering', initials: 'EN', total: 120, done: 105 },
    { name: 'Product & Design', initials: 'PD', total: 80, done: 75 },
    { name: 'Customer Success', initials: 'CS', total: 100, done: 79 },
    { name: 'Operations', initials: 'OP', total: 100, done: 92 }
  ];
  const DEFAULTS = { organization: 'Northstar Organization', owner: 'Operations team', teams: defaultTeams, users: 12846, uptime: 99.95, response: 180, inbound: 220, outbound: 120, resources: [40,25,15,20], manual: false };
  const presetElement = $('pulse-config');
  let preset = null;
  try { preset = presetElement ? JSON.parse(presetElement.textContent) : null; } catch { /* Invalid preset falls back to demo. */ }
  const storageKey = 'pulse-workspace-v1:' + (preset?.workspaceId || 'default');
  const clone = (value) => JSON.parse(JSON.stringify(value));
  function validConfig(value) {
    const finite = (n, max, integer = false) => typeof n === 'number' && Number.isFinite(n) && n >= 0 && n <= max && (!integer || Number.isInteger(n));
    return value && typeof value.organization === 'string' && value.organization.trim().length > 0 && value.organization.length <= 80 && typeof value.owner === 'string' && value.owner.trim().length > 0 && value.owner.length <= 80 && typeof value.manual === 'boolean' && finite(value.users, 1e9, true) && finite(value.uptime, 100) && finite(value.response, 100000, true) && finite(value.inbound, 1e6, true) && finite(value.outbound, 1e6, true) && Array.isArray(value.resources) && value.resources.length === 4 && value.resources.every(n => finite(n,100,true)) && value.resources.reduce((a,b)=>a+b,0) === 100 && Array.isArray(value.teams) && value.teams.length >= 1 && value.teams.length <= 12 && value.teams.every(t => typeof t.name === 'string' && t.name.trim().length > 0 && t.name.length <= 60 && finite(t.total,1e6,true) && t.total > 0 && finite(t.done,t.total,true));
  }
  let config = validConfig(preset) ? clone(preset) : clone(DEFAULTS);
  try { const saved = JSON.parse(localStorage.getItem(storageKey)); if (validConfig(saved)) config = saved; } catch { /* Private browsing or unavailable storage: keep an in-memory workspace. */ }
  let teams = clone(config.teams);
  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
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

  function renderTeamRows() {
    $('team-rows').innerHTML = teams.map((team,index) => {
      const initials = team.name.trim().split(/\s+/).map(word=>word[0]).join('').slice(0,2).toUpperCase();
      return '<tr><th scope="row"><span class="team-name"><span class="team-avatar" aria-hidden="true">'+escapeHTML(initials)+'</span>'+escapeHTML(team.name)+'</span></th><td class="team-count" id="team-count-'+index+'"></td><td><div class="completion-cell"><progress id="team-progress-'+index+'" max="100" value="0" aria-label="'+escapeHTML(team.name)+' task completion"></progress><span id="team-percent-'+index+'"></span></div></td><td><span class="status-pill" id="team-status-'+index+'"></span></td></tr>';
    }).join('');
  }
  renderTeamRows();

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
    if (config.manual) { $('users-change').textContent = 'Your figure'; $('users-change').classList.toggle('warning', false); }
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
    $('traffic-description').textContent = `Latest: inbound ${latest.inbound} Mb/s; outbound ${latest.outbound} Mb/s. ${config.manual ? 'Your manually entered snapshot. No automatic telemetry is connected.' : 'Showing '+Math.min(windowSize, history.length)+' simulated samples, spaced 3 seconds apart while running.'} Hover or tap a chart point for its timestamp.`;
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
        { label: 'Inbound', data: data.inbound, borderColor: accent, backgroundColor: '#86e4b012', fill: true, borderWidth: 2, tension: .35, pointRadius: config.manual ? 4 : 0, pointHitRadius: 16 },
        { label: 'Outbound', data: data.outbound, borderColor: blue, borderDash: [5, 4], backgroundColor: 'transparent', borderWidth: 2, tension: .35, pointRadius: config.manual ? 4 : 0, pointHitRadius: 16 }
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
    trafficChart.data.datasets.forEach(dataset => { dataset.pointRadius = config.manual ? 4 : 0; });
    resourceChart.data.datasets[0].data = current.resources;
    trafficChart.update('none');
    resourceChart.update('none');
  }

  function renderStreamState() {
    const stopped = paused || document.hidden || config.manual;
    $('stream-state').textContent = config.manual ? 'Personal workspace · manual data' : stopped ? 'Simulation paused' : 'Simulated live stream';
    $('stream-dot').classList.toggle('paused', stopped);
    $('pause-button').hidden = config.manual;
    $('history-window').disabled = config.manual;
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
      ['Pulse dashboard snapshot', config.manual ? 'USER-ENTERED DATA' : 'SIMULATED DATA'],
      ['Organization', config.organization], ['Owner', config.owner],
      ['Sample timestamp (UTC)', new Date(current.time).toISOString()],
      ['Metric', 'Value', 'Unit'],
      ['Active users', current.users, 'users'], ['System uptime', current.uptime, '%'],
      ['Task completion', current.completion, '%'], ['Completed tasks', current.done, 'tasks'],
      ['Total tasks', current.total, 'tasks'], ['Response time', current.response, 'ms'],
      ['Inbound traffic', latest.inbound, 'Mb/s'], ['Outbound traffic', latest.outbound, 'Mb/s'],
      ...['Compute', 'Storage', 'Network', 'Available'].map((name, index) => [name, current.resources[index], '%']),
      [], ['Team', 'Completed tasks', 'Total tasks'], ...teams.map((team) => [team.name, team.done, team.total])
    ];
    const csv = rows.map((row) => row.map((cell) => `"${(/^[=+@\-\t\r\n]/.test(String(cell)) ? "'" : "") + String(cell).replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `pulse-demo-snapshot-${new Date(current.time).toISOString().replaceAll(':', '-')}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    $('control-status').textContent = 'KPI snapshot exported as CSV.';
  });

  function manualSample() {
    const done = teams.reduce((n,t)=>n+t.done,0), total = teams.reduce((n,t)=>n+t.total,0);
    history.splice(0,history.length,{time:Date.now(),inbound:config.inbound,outbound:config.outbound});
    return {time:history[0].time, users:config.users, uptime:config.uptime, response:config.response, done,total,completion:Math.round(done/total*100), resources:config.resources.slice()};
  }
  function renderIdentity() {
    $('page-title').textContent = config.manual ? config.organization : 'Performance overview.';
    $('page-subtitle').textContent = config.manual ? 'Performance overview · ' + config.owner : 'A clear view of what’s moving your organization forward.';
    $('organization-name').textContent = config.organization;
    $('users-comparison').textContent = config.manual ? 'manual entry' : 'vs. first sample';
    $('owner-name').textContent = config.owner;
    $('workspace-kind').textContent = config.manual ? 'Personal workspace' : 'Demo workspace';
    $('environment-name').textContent = config.manual ? 'Your workspace' : 'Demo environment';
    $('footer-mode').textContent = config.manual ? 'Your data · saved in this browser · manual updates' : 'Demo data · refreshes every 3 seconds while visible';
    $('personal-note').textContent = config.manual ? 'Your workspace is private to this browser. Use Make it yours to update figures, or download a copy to keep and host.' : 'Free to use, customize, and share. Create your own workspace with Make it yours.';
    document.title = config.manual ? config.organization + ' — Pulse KPI Dashboard' : 'Pulse — Digital KPI Monitoring Dashboard';
  }
  let editorTeams = [];
  function renderEditorTeams() {
    const container = $('team-editor');
    container.replaceChildren();
    editorTeams.forEach((team,index)=>{
      const row = document.createElement('div'); row.className = 'team-editor-row';
      for (const [field,label] of [['name','Team name'],['total','Total tasks'],['done','Completed']]) {
        const wrapper=document.createElement('label');wrapper.textContent=label;
        const input=document.createElement('input'); input.required=true;input.value=team[field];
        if(field==='name') input.maxLength=60; else {input.type='number';input.min=field==='total'?'1':'0';input.max='1000000';input.step='1';}
        input.addEventListener('input',()=>{team[field]=field==='name'?input.value:Number(input.value);});
        wrapper.append(input);row.append(wrapper);
      }
      const remove=document.createElement('button');remove.type='button';remove.className='button';remove.textContent='Remove';remove.disabled=editorTeams.length===1;remove.setAttribute('aria-label','Remove team '+(index+1));
      remove.addEventListener('click',()=>{editorTeams.splice(index,1);renderEditorTeams();$('add-team').focus();});row.append(remove);container.append(row);
    });
    $('add-team').disabled=editorTeams.length>=12;
  }
  $('customize-button').addEventListener('click',()=>{
    const latest=history[history.length-1];
    for(const [field,value] of Object.entries({organization:config.organization,owner:config.owner,users:current.users,uptime:current.uptime,response:current.response,inbound:latest.inbound,outbound:latest.outbound,compute:current.resources[0],storage:current.resources[1],network:current.resources[2]})) $('input-'+field).value=value;
    editorTeams=clone(teams);renderEditorTeams();$('editor-error').textContent='';$('customize-dialog').showModal();
  });
  $('close-customize').addEventListener('click',()=>$('customize-dialog').close());
  $('add-team').addEventListener('click',()=>{if(editorTeams.length<12){editorTeams.push({name:'New team',total:100,done:0});renderEditorTeams();$('team-editor').lastElementChild.querySelector('input').focus();}});
  function applyWorkspace(next) {
    config=next;teams=clone(config.teams);paused=true;
    current=config.manual?manualSample():createSample(true);
    renderTeamRows();renderIdentity();renderMetrics();updateCharts();renderStreamState();
    let saved=true;try{localStorage.setItem(storageKey,JSON.stringify(config));}catch{saved=false;}
    $('control-status').textContent=saved?'Workspace saved in this browser.':'Workspace applied for this session. Browser storage is unavailable; download your dashboard to keep it.';
    $('personal-note').textContent = saved ? $('personal-note').textContent : 'Browser storage is unavailable. This workspace lasts for this session; download your dashboard to keep it.';
    $('customize-dialog').close();
  }
  $('workspace-form').addEventListener('submit',event=>{
    event.preventDefault();
    const num=key=>Number($('input-'+key).value);
    const resources=[num('compute'),num('storage'),num('network')];resources.push(100-resources.reduce((a,b)=>a+b,0));
    const next={organization:$('input-organization').value.trim(),owner:$('input-owner').value.trim(),users:num('users'),uptime:num('uptime'),response:num('response'),inbound:num('inbound'),outbound:num('outbound'),resources,teams:editorTeams.map(t=>({...t,name:t.name.trim()})),manual:true};
    if(!validConfig(next)){$('editor-error').textContent='Check your entries: names cannot be blank, completed tasks must not exceed totals, and allocations must total no more than 100%.';$('editor-error').focus();return;}
    applyWorkspace(next);
  });
  $('restore-demo').addEventListener('click',()=>{history.splice(0,history.length,{time:Date.now(),inbound:220,outbound:120});applyWorkspace(clone(DEFAULTS));});
  $('download-dashboard').addEventListener('click',async()=>{
    const button=$('download-dashboard');button.disabled=true;button.textContent='Preparing your copy…';
    try {
      const load=async(url)=>{const response=await fetch(url);if(!response.ok)throw new Error('Download failed');return response.text();};
      const css= document.querySelector('style[data-pulse]')?.textContent || await load(document.querySelector('link[href^="./style.css"]').href);
      let code= document.querySelector('script[data-pulse]')?.textContent || await load(document.querySelector('script[src^="./script.js"]').src);
      const wrapperStart="document.addEventListener('DOMContentLoaded', function () {\n";
      if (code.startsWith(wrapperStart)) code=code.slice(wrapperStart.length,-4);
      const cloneDoc=document.documentElement.cloneNode(true);
      cloneDoc.querySelector('dialog').removeAttribute('open');
      cloneDoc.querySelector('#team-editor').replaceChildren();
      cloneDoc.querySelector('#workspace-form').reset();
      cloneDoc.querySelector('#editor-error').textContent='';
      cloneDoc.querySelectorAll('#pulse-config, script[data-pulse], style[data-pulse], link[href^="./style.css"], script[src^="./script.js"]').forEach(node=>node.remove());
      const style=document.createElement('style');style.dataset.pulse='';style.textContent=css;cloneDoc.querySelector('head').append(style);
      const embedded=document.createElement('script');embedded.id='pulse-config';embedded.type='application/json';
      const latest=history[history.length-1];
      const copy={...config,manual:true,teams:clone(teams),users:current.users,uptime:current.uptime,response:current.response,inbound:latest.inbound,outbound:latest.outbound,resources:current.resources.slice(),workspaceId:Date.now().toString(36)+Math.random().toString(36).slice(2)};
      embedded.textContent=JSON.stringify(copy).replaceAll('<','\u003c');cloneDoc.querySelector('body').append(embedded);
      const script=document.createElement('script');script.dataset.pulse='';script.textContent="document.addEventListener('DOMContentLoaded', function () {\n"+code.replace(/<\/script/gi,'<\\/script')+"\n});";cloneDoc.querySelector('body').append(script);
      const url=URL.createObjectURL(new Blob(['<!DOCTYPE html>\n<!-- Pulse: MIT License. Copyright (c) 2023-2026 Georgia Rachel and contributors. Permission to use, copy, modify, merge, publish, distribute, sublicense, and sell is granted provided this notice is retained. THE SOFTWARE IS PROVIDED AS IS, WITHOUT WARRANTY OF ANY KIND. -->\n'+cloneDoc.outerHTML],{type:'text/html;charset=utf-8'}));
      const link=document.createElement('a');link.href=url;link.download=(config.organization.toLowerCase().replace(/[^a-z0-9]+/g,'-').slice(0,60)||'my')+'-pulse-dashboard.html';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
      $('control-status').textContent='Your standalone dashboard has been downloaded. It includes your entered figures; charts and fonts need an internet connection.';
    } catch { $('control-status').textContent='The download could not be prepared. Check your connection and try again.'; }
    finally {button.disabled=false;button.textContent='Download my dashboard';}
  });
  renderIdentity();
  current = config.manual ? manualSample() : createSample(true);
  renderMetrics();
  initializeCharts();
  renderStreamState();
  if (paused) $('control-status').textContent = 'Updates start paused to respect your reduced motion preference. Use Resume updates to opt in.';
  // A single timer; hidden tabs do not generate or render samples.
  window.setInterval(() => {
    if (paused || config.manual || document.hidden || $('customize-dialog').open) return;
    current = createSample();
    renderMetrics();
    updateCharts();
  }, INTERVAL_MS);
})();
