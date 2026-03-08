/**
 * Google ID Finder - Chrome Extension
 * Searches Google People API v2 (people-pa.clients6.google.com) via autocomplete
 * Uses SAPISIDHASH cookie auth from console.cloud.google.com active tab
 * 
 * API: GET /v2/people/autocomplete?client=EMAIL_CENTRIC
 * Auth: SAPISIDHASH + SAPISID1PHASH + SAPISID3PHASH (origin-bound)
 * Key: AIzaSyCI-zsRP85UVOi0DjtiCwWBwQ1djDy741g (Google Cloud Console public key)
 */

// SVG Icons used throughout the UI
const IC = {
  copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  key: `<svg viewBox="0 0 24 24" fill="none" stroke="#5f6368" stroke-width="2" stroke-linecap="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.78 7.78 5.5 5.5 0 017.78-7.78zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>`,
  info: `<svg viewBox="0 0 24 24" fill="none" stroke="#5f6368" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  folder: `<svg viewBox="0 0 24 24" fill="none" stroke="#5f6368" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>`,
  building: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="1"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/><line x1="9" y1="14" x2="9" y2="14.01"/><line x1="15" y1="14" x2="15" y2="14.01"/><path d="M9 22v-4h6v4"/></svg>`,
  user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,4 12,13 2,4"/></svg>`,
  contact: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><path d="M17.5 21v-1.5A3.5 3.5 0 0014 16h-4a3.5 3.5 0 00-3.5 3.5V21"/></svg>`,
  link: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>`,
  yes: `<svg viewBox="0 0 24 24" fill="none" stroke="#137333" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="16 9 10.5 15 8 12.5"/></svg>`,
  no: `<svg viewBox="0 0 24 24" fill="none" stroke="#c5221f" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
  question: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  photo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
  circle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>`,
  warn: `<svg viewBox="0 0 24 24" fill="none" stroke="#c5221f" stroke-width="2" stroke-linecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  err: `<svg viewBox="0 0 24 24" fill="none" stroke="#c5221f" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
};

/** Copy text to clipboard and show check animation */
function copyText(text, el) {
  navigator.clipboard.writeText(text);
  el.classList.add('copied');
  const copyEl = el.querySelector('.field-copy');
  if (copyEl) { const o = copyEl.innerHTML; copyEl.innerHTML = IC.check; setTimeout(() => { el.classList.remove('copied'); copyEl.innerHTML = o; }, 1200); }
}

/** Bind click-to-copy on all .field-row elements with data-copy attribute */
function bindCopy() {
  document.querySelectorAll('.field-row[data-copy]').forEach(el => {
    el.onclick = () => copyText(el.dataset.copy, el);
  });
}

function copyBtn(text, btn) {
  navigator.clipboard.writeText(text);
  btn.classList.add('copied');
  const o = btn.textContent;
  btn.textContent = 'Copied!';
  setTimeout(() => { btn.classList.remove('copied'); btn.textContent = o; }, 1500);
}

/** Detect account type from email metadata and profile info */
function getAccountType(person) {
  const emailMeta = person.email?.[0]?.metadata;
  const userType = person.readOnlyProfileInfo?.[0]?.ownerUserType?.[0];
  const isDomain = emailMeta?.containerType === 'DOMAIN_PROFILE';
  if (isDomain) return 'workspace';
  if (userType === 'GOOGLE_USER') return 'google';
  return 'unknown';
}

/** Render colored tag badges (Google User, Workspace, Verified, In Contacts, Connected) */
function renderTags(person) {
  const tags = [];
  const type = getAccountType(person);
  if (type === 'google') tags.push(`<span class="tag tag-google">${IC.check} Google User</span>`);
  if (type === 'workspace') tags.push(`<span class="tag tag-workspace">${IC.building} Workspace</span>`);

  const emailMeta = person.email?.[0]?.metadata;
  if (emailMeta?.verified) tags.push(`<span class="tag tag-verified">${IC.mail} Verified</span>`);
  if (person.metadata?.contactId) tags.push(`<span class="tag tag-contact">${IC.contact} In Contacts</span>`);
  if (person.socialConnection?.[0]?.type?.includes('DIRECT_CONNECTION')) tags.push(`<span class="tag tag-connected">${IC.link} Connected</span>`);
  return tags.join('');
}

/** Build full user card HTML — avatar, name, tags, federation keys, account details, identity sources */
function renderUserCard(r) {
  const p = r.person;
  const name = p.name?.[0]?.displayName || 'Unknown';
  const email = r.suggestion || '';
  const id = p.personId || p.metadata?.ownerId || '';
  const photo = p.photo?.[0]?.url || '';
  const type = getAccountType(p);
  const domain = email.includes('@') ? email.split('@')[1] : '';
  const isVerified = p.email?.[0]?.metadata?.verified || false;
  const isDefault = p.photo?.[0]?.isDefault || false;
  const sources = p.metadata?.identityInfo?.sourceIds || [];

  let html = `<div class="user-card">
    <div class="user-top">
      ${photo && !isDefault ? `<img class="user-avatar" src="${photo}" onerror="this.style.display='none'">` : `<div class="user-avatar" style="display:flex;align-items:center;justify-content:center;font-size:20px;color:#1a73e8">${name.charAt(0).toUpperCase()}</div>`}
      <div class="user-info">
        <div class="user-name">${name}</div>
        <div class="user-email">${email}</div>
        <div class="tags">${renderTags(p)}</div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">${IC.key} Federation Keys</div>
      <div class="field-row" data-copy="${id}">
        <span class="field-label">Sub ID (personId)</span>
        <span class="field-value">${id}</span>
        <span class="field-copy">${IC.copy}</span>
      </div>`;

  if (type === 'workspace') {
    html += `<div class="field-row" data-copy="${email}">
        <span class="field-label">Email</span>
        <span class="field-value">${email}</span>
        <span class="field-copy">${IC.copy}</span>
      </div>`;
  }

  html += `</div>

    <div class="section">
      <div class="section-title">${IC.info} Account Details</div>
      <div class="info-grid">
        <div class="info-cell">
          <div class="info-cell-label">Account Type</div>
          <div class="info-cell-value">${type === 'workspace' ? IC.building + ' Google Workspace' : type === 'google' ? IC.user + ' Personal Gmail' : IC.question + ' Unknown'}</div>
        </div>
        <div class="info-cell">
          <div class="info-cell-label">Domain</div>
          <div class="info-cell-value">${domain}</div>
        </div>
        <div class="info-cell">
          <div class="info-cell-label">Email Verified</div>
          <div class="info-cell-value">${isVerified ? IC.yes + ' Yes' : '—'}</div>
        </div>
        <div class="info-cell">
          <div class="info-cell-label">Profile Photo</div>
          <div class="info-cell-value">${isDefault || !photo ? IC.circle + ' Default' : IC.photo + ' Custom'}</div>
        </div>
        <div class="info-cell">
          <div class="info-cell-label">In Your Contacts</div>
          <div class="info-cell-value">${p.metadata?.contactId ? IC.yes + ' Yes' : IC.no + ' No'}</div>
        </div>
        <div class="info-cell">
          <div class="info-cell-label">Connection</div>
          <div class="info-cell-value">${p.socialConnection ? IC.link + ' Direct' : '—'}</div>
        </div>
      </div>
    </div>`;

  if (sources.length) {
    html += `<div class="section">
      <div class="section-title">${IC.folder} Identity Sources</div>`;
    sources.forEach(s => {
      html += `<div class="field-row" data-copy="${s.id}">
        <span class="field-label">${s.containerType}</span>
        <span class="field-value">${s.id}</span>
        <span class="field-copy">${IC.copy}</span>
      </div>`;
    });
    html += `</div>`;
  }

  html += `</div>`;
  return { html, id, email, name };
}

/** Render all autocomplete results into the #results container */
function renderResults(data) {
  const results = document.getElementById('results');
  if (!data.results?.length) {
    results.innerHTML = `<div class="error">${IC.err} No users found for this query</div>`;
    return;
  }

  let cardsHtml = '';
  data.results.forEach(r => {
    const { html } = renderUserCard(r);
    cardsHtml += html;
  });
  results.innerHTML = cardsHtml;
  bindCopy();
}

let debounceTimer;

/**
 * Main search function
 * 1. Validates query (min 3 chars)
 * 2. Checks active tab is console.cloud.google.com
 * 3. Injects script into page (MAIN world) to access cookies
 * 4. Computes SAPISIDHASH from SAPISID cookie + timestamp + origin
 * 5. Calls People API autocomplete endpoint
 * 6. Returns JSON results to popup for rendering
 */
async function doSearch() {
  const query = document.getElementById('query').value.trim();
  if (query.length < 3) { document.getElementById('results').innerHTML = ''; document.getElementById('status').textContent = ''; return; }

  const status = document.getElementById('status');
  const results = document.getElementById('results');
  status.textContent = 'Searching...';

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab?.url?.includes('console.cloud.google.com')) {
      results.innerHTML = `<div class="error">${IC.warn} Open <a href="https://console.cloud.google.com" target="_blank">console.cloud.google.com</a> in the active tab first.</div>`;
      return;
    }

    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      world: 'MAIN',
      func: async (q) => {
        try {
          const match = document.cookie.match(/SAPISID=([^;]+)/);
          if (!match) return { error: { message: 'Not logged in. Refresh the page.' } };
          const sapisid = match[1];
          const ts = Math.floor(Date.now() / 1000);
          const origin = 'https://console.cloud.google.com';
          const buf = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(`${ts} ${sapisid} ${origin}`));
          const hash = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
          const h = `${ts}_${hash}`;
          const res = await fetch(
            `https://people-pa.clients6.google.com/v2/people/autocomplete?client=EMAIL_CENTRIC&pageSize=10&query=${encodeURIComponent(q)}&key=AIzaSyCI-zsRP85UVOi0DjtiCwWBwQ1djDy741g`,
            { credentials: 'include', headers: { 'Authorization': `SAPISIDHASH ${h} SAPISID1PHASH ${h} SAPISID3PHASH ${h}`, 'X-Goog-Authuser': '0' } }
          );
          return await res.json();
        } catch (e) { return { error: { message: e.message } }; }
      },
      args: [query]
    });

    if (result?.error) throw new Error(result.error.message);
    status.textContent = `Found ${result.results?.length || 0} result(s)`;
    renderResults(result);

  } catch (e) {
    status.textContent = '';
    results.innerHTML = `<div class="error">${IC.err} ${e.message}</div>`;
  }
}

// Event listeners — 500ms debounce on input, instant on Enter/click
document.getElementById('query').addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(doSearch, 500);
});

document.getElementById('query').addEventListener('keypress', e => {
  if (e.key === 'Enter') { clearTimeout(debounceTimer); doSearch(); }
});

document.getElementById('search').addEventListener('click', () => { clearTimeout(debounceTimer); doSearch(); });

// Dark mode toggle
const toggle = document.getElementById('themeToggle');
const sun = document.getElementById('sunIcon');
const moon = document.getElementById('moonIcon');
const dark = localStorage.getItem('dark') === '1';
if (dark) { document.body.classList.add('dark'); sun.style.display = 'none'; moon.style.display = ''; }
toggle.onclick = () => {
  const on = document.body.classList.toggle('dark');
  sun.style.display = on ? 'none' : '';
  moon.style.display = on ? '' : 'none';
  localStorage.setItem('dark', on ? '1' : '0');
};
