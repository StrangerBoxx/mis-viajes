// ── Color temporal seleccionado en modal ───────────────────
let _tempColor = COLORS[0];

window.selectColor = function (name) {
  _tempColor = COLORS.find(c => c.name === name) || COLORS[0];
  document.querySelectorAll('.color-swatch').forEach(s =>
    s.classList.toggle('sel', s.title === name)
  );
};

// ── Panoramas ──────────────────────────────────────────────
function showPanoramaModal(existing) {
  const isEdit = !!existing;
  _tempColor = COLORS[0];

  showModal(`
    <h3>${isEdit ? 'Editar panorama' : 'Nuevo panorama'}</h3>
    <div class="type-toggle">
      <button class="type-btn${!isEdit || existing.type === 'weekly' ? ' active' : ''}"
              id="tt-w" onclick="switchType('weekly')">Semanal (lun–dom)</button>
      <button class="type-btn${isEdit && existing.type === 'free' ? ' active' : ''}"
              id="tt-f" onclick="switchType('free')">Días libres</button>
    </div>
    <input type="hidden" id="ptype" value="${isEdit ? existing.type : 'weekly'}">
    <label>Nombre del panorama</label>
    <input id="pname" placeholder="Ej: Viaje a Pucón" value="${isEdit ? escH(existing.name) : ''}">
    <div class="modal-btns">
      <button class="btn" onclick="hideModal()">Cancelar</button>
      <button class="btn primary" onclick="savePanorama('${isEdit ? existing.id : ''}')">Guardar</button>
    </div>`);
}

window.switchType = function (type) {
  document.getElementById('ptype').value = type;
  document.getElementById('tt-w').classList.toggle('active', type === 'weekly');
  document.getElementById('tt-f').classList.toggle('active', type === 'free');
};

window.savePanorama = function (id) {
  const name = document.getElementById('pname').value.trim() || 'Panorama sin nombre';
  const type = document.getElementById('ptype').value;
  if (id) {
    const p = state.panoramas.find(x => x.id === id);
    if (p) { p.name = name; p.type = type; }
  } else {
    const newP = { id: uid(), name, type, activities: [], days: [] };
    state.panoramas.push(newP);
    state.activePanorama = newP.id;
  }
  save(); hideModal(); render();
};

window.editPanorama = function (id) {
  showPanoramaModal(state.panoramas.find(p => p.id === id));
};

window.confirmDelete = function (id) {
  const p = state.panoramas.find(x => x.id === id);
  if (!p) return;
  showModal(`
    <h3>¿Eliminar panorama?</h3>
    <p style="font-size:13px;color:#888;margin-top:.5rem">
      Se eliminará "${escH(p.name)}" y todas sus actividades. Esta acción no se puede deshacer.
    </p>
    <div class="modal-btns">
      <button class="btn" onclick="hideModal()">Cancelar</button>
      <button class="btn danger" onclick="deletePanorama('${id}')">Eliminar</button>
    </div>`);
};

window.deletePanorama = function (id) {
  state.panoramas = state.panoramas.filter(p => p.id !== id);
  if (state.activePanorama === id) {
    state.activePanorama = state.panoramas[0]?.id || '';
  }
  save(); hideModal(); render();
};

// ── Actividades semanales ──────────────────────────────────
window.addActivity = function (pid, day, hour) {
  _tempColor = COLORS[0];
  showModal(`
    <h3>Nueva actividad</h3>
    <label>Etiqueta</label>
    <input id="alabel" placeholder="Ej: RAFTING">
    <label>Notas (opcional)</label>
    <textarea id="anotes" placeholder="Descripción..."></textarea>
    <label>Color</label>
    <div class="color-row">${colorSwatches('teal')}</div>
    <div class="modal-btns">
      <button class="btn" onclick="hideModal()">Cancelar</button>
      <button class="btn primary" onclick="saveActivity('${pid}','','${day}','${hour}')">Agregar</button>
    </div>`);
};

window.editActivity = function (pid, aid) {
  const p = state.panoramas.find(x => x.id === pid);
  const a = p?.activities?.find(x => x.id === aid);
  if (!a) return;
  _tempColor = a.color;
  showModal(`
    <h3>Editar actividad</h3>
    <label>Etiqueta</label>
    <input id="alabel" value="${escH(a.label)}">
    <label>Notas</label>
    <textarea id="anotes">${escH(a.notes || '')}</textarea>
    <label>Color</label>
    <div class="color-row">${colorSwatches(a.color.name)}</div>
    <div class="modal-btns">
      <button class="btn" onclick="hideModal()">Cancelar</button>
      <button class="btn danger" onclick="deleteActivity('${pid}','${aid}');hideModal()">Eliminar</button>
      <button class="btn primary" onclick="saveActivity('${pid}','${aid}','${a.day}','${a.hour}')">Guardar</button>
    </div>`);
};

window.saveActivity = function (pid, aid, day, hour) {
  const p = state.panoramas.find(x => x.id === pid);
  if (!p) return;
  const label = document.getElementById('alabel').value.trim() || 'Actividad';
  const notes = document.getElementById('anotes').value.trim();
  if (aid) {
    const a = p.activities.find(x => x.id === aid);
    if (a) { a.label = label; a.notes = notes; a.color = _tempColor; }
  } else {
    if (!p.activities) p.activities = [];
    p.activities.push({ id: uid(), day, hour, label, notes, color: _tempColor });
  }
  save(); hideModal(); render();
};

window.deleteActivity = function (pid, aid) {
  const p = state.panoramas.find(x => x.id === pid);
  if (!p) return;
  p.activities = p.activities.filter(x => x.id !== aid);
  save(); render();
};

// ── Días libres ────────────────────────────────────────────
window.addFreeDay = function (pid) {
  showModal(`
    <h3>Nuevo día</h3>
    <label>Nombre del día</label>
    <input id="dname" placeholder="Ej: Día 1 — Llegada">
    <div class="modal-btns">
      <button class="btn" onclick="hideModal()">Cancelar</button>
      <button class="btn primary" onclick="saveFreeDay('${pid}','')">Agregar</button>
    </div>`);
};

window.editFreeDay = function (pid, did) {
  const p = state.panoramas.find(x => x.id === pid);
  const d = p?.days?.find(x => x.id === did);
  if (!d) return;
  showModal(`
    <h3>Editar día</h3>
    <label>Nombre del día</label>
    <input id="dname" value="${escH(d.name)}">
    <div class="modal-btns">
      <button class="btn" onclick="hideModal()">Cancelar</button>
      <button class="btn primary" onclick="saveFreeDay('${pid}','${did}')">Guardar</button>
    </div>`);
};

window.saveFreeDay = function (pid, did) {
  const p = state.panoramas.find(x => x.id === pid);
  if (!p) return;
  const name = document.getElementById('dname').value.trim() || 'Día sin nombre';
  if (did) {
    const d = p.days.find(x => x.id === did);
    if (d) d.name = name;
  } else {
    if (!p.days) p.days = [];
    p.days.push({ id: uid(), name, activities: [] });
  }
  save(); hideModal(); render();
};

window.deleteFreeDay = function (pid, did) {
  const p = state.panoramas.find(x => x.id === pid);
  if (!p) return;
  p.days = p.days.filter(x => x.id !== did);
  save(); render();
};

// ── Actividades de días libres ─────────────────────────────
window.addFreeActivity = function (pid, did) {
  _tempColor = COLORS[0];
  showModal(`
    <h3>Nueva actividad</h3>
    <label>Hora</label>
    <input id="atime" placeholder="Ej: 10:00">
    <label>Etiqueta</label>
    <input id="alabel" placeholder="Ej: Desayuno">
    <label>Notas (opcional)</label>
    <textarea id="anotes"></textarea>
    <label>Color</label>
    <div class="color-row">${colorSwatches('teal')}</div>
    <div class="modal-btns">
      <button class="btn" onclick="hideModal()">Cancelar</button>
      <button class="btn primary" onclick="saveFreeActivity('${pid}','${did}','')">Agregar</button>
    </div>`);
};

window.editFreeActivity = function (pid, did, aid) {
  const p = state.panoramas.find(x => x.id === pid);
  const d = p?.days?.find(x => x.id === did);
  const a = d?.activities?.find(x => x.id === aid);
  if (!a) return;
  _tempColor = a.color;
  showModal(`
    <h3>Editar actividad</h3>
    <label>Hora</label>
    <input id="atime" value="${escH(a.time)}">
    <label>Etiqueta</label>
    <input id="alabel" value="${escH(a.label)}">
    <label>Notas</label>
    <textarea id="anotes">${escH(a.notes || '')}</textarea>
    <label>Color</label>
    <div class="color-row">${colorSwatches(a.color.name)}</div>
    <div class="modal-btns">
      <button class="btn" onclick="hideModal()">Cancelar</button>
      <button class="btn danger" onclick="deleteFreeActivity('${pid}','${did}','${aid}');hideModal()">Eliminar</button>
      <button class="btn primary" onclick="saveFreeActivity('${pid}','${did}','${aid}')">Guardar</button>
    </div>`);
};

window.saveFreeActivity = function (pid, did, aid) {
  const p = state.panoramas.find(x => x.id === pid);
  if (!p) return;
  const d = p.days.find(x => x.id === did);
  if (!d) return;
  const time  = document.getElementById('atime').value.trim()  || '00:00';
  const label = document.getElementById('alabel').value.trim() || 'Actividad';
  const notes = document.getElementById('anotes').value.trim();
  if (aid) {
    const a = d.activities.find(x => x.id === aid);
    if (a) { a.time = time; a.label = label; a.notes = notes; a.color = _tempColor; }
  } else {
    if (!d.activities) d.activities = [];
    d.activities.push({ id: uid(), time, label, notes, color: _tempColor });
  }
  save(); hideModal(); render();
};

window.deleteFreeActivity = function (pid, did, aid) {
  const p = state.panoramas.find(x => x.id === pid);
  if (!p) return;
  const d = p.days.find(x => x.id === did);
  if (!d) return;
  d.activities = d.activities.filter(x => x.id !== aid);
  save(); render();
};

// ── Drag & Drop ────────────────────────────────────────────
let drag = { active: false, pid: null, aid: null, ghost: null, startX: 0, startY: 0, moved: false };

function clientXY(e) {
  if (e.touches && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  return { x: e.clientX, y: e.clientY };
}

function onDragStart(e) {
  const btn = e.target.closest('.activity-block');
  if (!btn || e.target.closest('.block-del')) return;
  const pid = btn.dataset.pid;
  const aid = btn.dataset.aid;
  if (!pid || !aid) return;

  const { x, y } = clientXY(e);
  drag = { active: true, pid, aid, ghost: null, startX: x, startY: y, moved: false };

  const ghost = document.createElement('div');
  ghost.className = 'drag-ghost';
  ghost.style.background = btn.style.background;
  ghost.style.color = btn.style.color;
  ghost.textContent = btn.querySelector('span').textContent;
  ghost.style.left = x + 'px';
  ghost.style.top  = y + 'px';
  ghost.style.opacity = '0';
  document.body.appendChild(ghost);
  drag.ghost = ghost;

  e.preventDefault();
}

function onDragMove(e) {
  if (!drag.active) return;
  e.preventDefault();
  const { x, y } = clientXY(e);
  const dx = x - drag.startX;
  const dy = y - drag.startY;

  if (!drag.moved && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
    drag.moved = true;
    drag.ghost.style.opacity = '1';
    const srcBtn = document.querySelector(`.activity-block[data-aid="${drag.aid}"]`);
    if (srcBtn) srcBtn.classList.add('dragging');
  }

  if (drag.moved) {
    drag.ghost.style.left = (x + 10) + 'px';
    drag.ghost.style.top  = (y - 16) + 'px';
    document.querySelectorAll('td.drop-target').forEach(t => t.classList.remove('drop-target'));
    const el = document.elementFromPoint(x, y);
    const td = el && el.closest('td[data-day]');
    if (td) td.classList.add('drop-target');
  }
}

function onDragEnd(e) {
  if (!drag.active) return;
  const { x, y } = clientXY(e);

  if (drag.ghost) { drag.ghost.remove(); drag.ghost = null; }
  document.querySelectorAll('.activity-block.dragging').forEach(b => b.classList.remove('dragging'));
  document.querySelectorAll('td.drop-target').forEach(t => t.classList.remove('drop-target'));

  if (drag.moved) {
    const el = document.elementFromPoint(x, y);
    const td = el && el.closest('td[data-day]');
    if (td) {
      const p = state.panoramas.find(x => x.id === drag.pid);
      if (p) {
        const a = p.activities.find(x => x.id === drag.aid);
        if (a) { a.day = td.dataset.day; a.hour = td.dataset.hour; save(); render(); }
      }
    }
  } else {
    editActivity(drag.pid, drag.aid);
  }

  drag = { active: false, pid: null, aid: null, ghost: null, startX: 0, startY: 0, moved: false };
}

function initDrag() {
  document.addEventListener('mousedown',  onDragStart, true);
  document.addEventListener('mousemove',  onDragMove);
  document.addEventListener('mouseup',    onDragEnd);
  document.addEventListener('touchstart', onDragStart, { passive: false, capture: true });
  document.addEventListener('touchmove',  onDragMove,  { passive: false });
  document.addEventListener('touchend',   onDragEnd);
}

// ── Arranque ───────────────────────────────────────────────
initDrag();
initSync();
