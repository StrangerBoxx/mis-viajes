// ── Utilidades de renderizado ──────────────────────────────
function escH(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Modal ──────────────────────────────────────────────────
function showModal(html) {
  document.getElementById('modal').innerHTML = html;
  document.getElementById('modal-bg').style.display = 'flex';
}

function hideModal() {
  document.getElementById('modal-bg').style.display = 'none';
  if (_pendingRender) {
    _pendingRender = false;
    render();
  }
}

document.getElementById('modal-bg').onclick = function (e) {
  if (e.target === this) hideModal();
};

// ── Swatches de color ──────────────────────────────────────
function colorSwatches(selName) {
  return COLORS.map(c =>
    `<div class="color-swatch${c.name === selName ? ' sel' : ''}"
          style="background:${c.bg}"
          title="${c.name}"
          onclick="selectColor('${c.name}')"></div>`
  ).join('');
}

// ── Tabs ───────────────────────────────────────────────────
function renderTabs() {
  const el = document.getElementById('tabs');
  el.innerHTML = '';

  state.panoramas.forEach(p => {
    const tab = document.createElement('div');
    tab.className = 'tab' + (p.id === state.activePanorama ? ' active' : '');
    tab.textContent = p.name;
    tab.onclick = () => { state.activePanorama = p.id; save(); render(); };
    el.appendChild(tab);
  });

  const addBtn = document.createElement('div');
  addBtn.className = 'tab-add';
  addBtn.textContent = '+ Panorama';
  addBtn.onclick = () => showPanoramaModal();
  el.appendChild(addBtn);
}

// ── Vista semanal ──────────────────────────────────────────
function renderWeekly(p) {
  const actMap = {};
  (p.activities || []).forEach(a => {
    const key = a.day + '|' + a.hour;
    if (!actMap[key]) actMap[key] = [];
    actMap[key].push(a);
  });

  let html = `
    <div class="section-actions">
      <span class="section-label">Itinerario semanal</span>
      <div style="display:flex;gap:8px">
        <button class="btn" onclick="editPanorama('${p.id}')">Editar nombre</button>
        <button class="btn danger" onclick="confirmDelete('${p.id}')">Eliminar</button>
      </div>
    </div>
    <div class="grid-wrap">
      <table>
        <thead>
          <tr>
            <th>Hora</th>
            ${DAYS.map(d => `<th>${d}</th>`).join('')}
          </tr>
        </thead>
        <tbody>`;

  HOURS.forEach(h => {
    const hDisp = h.slice(0, 5);
    html += `<tr><td>${hDisp}</td>`;

    DAYS.forEach(d => {
      const acts = actMap[d + '|' + h] || [];
      html += `<td data-day="${d}" data-hour="${h}">`;

      acts.forEach(a => {
        html += `
          <div class="cell-inner">
            <button class="activity-block"
                    data-pid="${p.id}"
                    data-aid="${a.id}"
                    style="background:${a.color.bg};color:${a.color.text}">
              <span style="overflow:hidden;text-overflow:ellipsis">${escH(a.label)}</span>
              <span class="block-del" onclick="event.stopPropagation();deleteActivity('${p.id}','${a.id}')">✕</span>
            </button>
          </div>`;
      });

      html += `
          <div class="cell-inner">
            <button class="cell-add" onclick="addActivity('${p.id}','${d}','${h}')">
              <span class="cell-add-icon">+</span>
            </button>
          </div>
        </td>`;
    });

    html += `</tr>`;
  });

  html += `</tbody></table></div>`;
  document.getElementById('content').innerHTML = html;
}

// ── Vista días libres ──────────────────────────────────────
function renderFree(p) {
  const days = p.days || [];

  let html = `
    <div class="section-actions">
      <span class="section-label">Días libres</span>
      <div style="display:flex;gap:8px">
        <button class="btn primary" onclick="addFreeDay('${p.id}')">+ Día</button>
        <button class="btn" onclick="editPanorama('${p.id}')">Editar nombre</button>
        <button class="btn danger" onclick="confirmDelete('${p.id}')">Eliminar</button>
      </div>
    </div>`;

  if (!days.length) {
    html += `<div class="empty-state">Agrega días con el botón "+ Día"</div>`;
  }

  days.forEach(day => {
    const acts = day.activities || [];
    html += `
      <div class="day-card">
        <div class="day-card-head">
          <span>${escH(day.name || 'Día sin nombre')}</span>
          <div style="display:flex;gap:8px;align-items:center">
            <button class="btn" style="padding:3px 10px;font-size:11px"
                    onclick="addFreeActivity('${p.id}','${day.id}')">+ Actividad</button>
            <button class="btn" style="padding:3px 10px;font-size:11px"
                    onclick="editFreeDay('${p.id}','${day.id}')">✎</button>
            <span class="free-activity-del"
                  onclick="deleteFreeDay('${p.id}','${day.id}')">✕</span>
          </div>
        </div>
        <div class="day-card-body">`;

    if (!acts.length) {
      html += `<div style="font-size:12px;color:#bbb;padding:6px 0">Sin actividades aún</div>`;
    }

    [...acts].sort((a, b) => a.time.localeCompare(b.time)).forEach(a => {
      html += `
          <div class="free-activity">
            <div class="free-dot" style="background:${a.color.bg}"></div>
            <span class="free-activity-time">${escH(a.time)}</span>
            <span class="free-activity-text">${escH(a.label)}</span>
            ${a.notes
              ? `<span style="font-size:11px;color:#bbb;font-style:italic;overflow:hidden;text-overflow:ellipsis;max-width:90px">${escH(a.notes)}</span>`
              : ''}
            <span class="free-activity-del"
                  onclick="editFreeActivity('${p.id}','${day.id}','${a.id}')"
                  title="Editar">✎</span>
            <span class="free-activity-del"
                  onclick="deleteFreeActivity('${p.id}','${day.id}','${a.id}')">✕</span>
          </div>`;
    });

    html += `</div></div>`;
  });

  document.getElementById('content').innerHTML = html;
}

// ── Render principal ───────────────────────────────────────
function render() {
  renderTabs();
  const p = getActive();
  if (!p) {
    document.getElementById('content').innerHTML =
      '<div class="empty-state">Agrega un panorama para comenzar</div>';
    return;
  }
  if (p.type === 'weekly') renderWeekly(p);
  else renderFree(p);
}
