// ── Constantes ────────────────────────────────────────────
const COLORS = [
  { bg: '#9FE1CB', text: '#085041', name: 'teal'   },
  { bg: '#B5D4F4', text: '#042C53', name: 'blue'   },
  { bg: '#F5C4B3', text: '#4A1B0C', name: 'coral'  },
  { bg: '#C0DD97', text: '#173404', name: 'green'  },
  { bg: '#FAC775', text: '#412402', name: 'amber'  },
  { bg: '#F4C0D1', text: '#4B1528', name: 'pink'   },
  { bg: '#CECBF6', text: '#26215C', name: 'purple' },
  { bg: '#D3D1C7', text: '#2C2C2A', name: 'gray'   },
];

const HOURS = [];
for (let h = 5; h <= 22; h++) {
  HOURS.push(`${String(h).padStart(2, '0')}:00:00`);
}

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

// ── Datos iniciales de ejemplo ─────────────────────────────
const INITIAL_PANORAMAS = [{
  id: 'p1',
  name: 'VIAJeSILLO A PUCONSILLO',
  type: 'weekly',
  activities: [
    { id: 'a1',  day: 'Martes',    hour: '05:00:00', label: 'VOLCAN',     color: COLORS[0], notes: '' },
    { id: 'a2',  day: 'Martes',    hour: '06:00:00', label: 'VOLCAN',     color: COLORS[0], notes: '' },
    { id: 'a3',  day: 'Martes',    hour: '07:00:00', label: 'VOLCAN',     color: COLORS[0], notes: '' },
    { id: 'a4',  day: 'Lunes',     hour: '08:00:00', label: 'LLEGADA',    color: COLORS[1], notes: '' },
    { id: 'a5',  day: 'Martes',    hour: '08:00:00', label: 'VOLCAN',     color: COLORS[0], notes: '' },
    { id: 'a6',  day: 'Jueves',    hour: '08:00:00', label: 'Despertar',  color: COLORS[6], notes: '' },
    { id: 'a7',  day: 'Sábado',    hour: '08:00:00', label: 'llegada',    color: COLORS[1], notes: '' },
    { id: 'a8',  day: 'Martes',    hour: '09:00:00', label: 'VOLCAN',     color: COLORS[0], notes: '' },
    { id: 'a9',  day: 'Lunes',     hour: '10:00:00', label: 'cafecito',   color: COLORS[4], notes: '' },
    { id: 'a10', day: 'Martes',    hour: '10:00:00', label: 'VOLCAN',     color: COLORS[0], notes: '' },
    { id: 'a11', day: 'Viernes',   hour: '10:00:00', label: 'RAFTING',    color: COLORS[2], notes: '' },
    { id: 'a12', day: 'Lunes',     hour: '12:00:00', label: 'agencias',   color: COLORS[7], notes: '' },
    { id: 'a13', day: 'Miércoles', hour: '11:00:00', label: 'SALTOS',     color: COLORS[3], notes: '' },
    { id: 'a14', day: 'Jueves',    hour: '11:00:00', label: 'Termas B.',  color: COLORS[5], notes: '' },
    { id: 'a15', day: 'Martes',    hour: '11:00:00', label: 'VOLCAN',     color: COLORS[0], notes: '' },
    { id: 'a16', day: 'Martes',    hour: '12:00:00', label: 'VOLCAN',     color: COLORS[0], notes: '' },
    { id: 'a17', day: 'Miércoles', hour: '12:00:00', label: 'SALTOS',     color: COLORS[3], notes: '' },
    { id: 'a18', day: 'Jueves',    hour: '12:00:00', label: 'Termas B.',  color: COLORS[5], notes: '' },
    { id: 'a19', day: 'Martes',    hour: '13:00:00', label: 'VOLCAN',     color: COLORS[0], notes: '' },
    { id: 'a20', day: 'Miércoles', hour: '13:00:00', label: 'SALTOS',     color: COLORS[3], notes: '' },
    { id: 'a21', day: 'Jueves',    hour: '13:00:00', label: 'Termas B.',  color: COLORS[5], notes: '' },
    { id: 'a22', day: 'Martes',    hour: '14:00:00', label: 'VOLCAN',     color: COLORS[0], notes: '' },
    { id: 'a23', day: 'Miércoles', hour: '14:00:00', label: 'SALTOS',     color: COLORS[3], notes: '' },
    { id: 'a24', day: 'Jueves',    hour: '14:00:00', label: 'Termas B.',  color: COLORS[5], notes: '' },
    { id: 'a25', day: 'Martes',    hour: '15:00:00', label: 'VOLCAN',     color: COLORS[0], notes: '' },
    { id: 'a26', day: 'Miércoles', hour: '15:00:00', label: 'SALTOS',     color: COLORS[3], notes: '' },
    { id: 'a27', day: 'Jueves',    hour: '15:00:00', label: 'Termas B.',  color: COLORS[5], notes: '' },
    { id: 'a28', day: 'Martes',    hour: '16:00:00', label: 'VOLCAN',     color: COLORS[0], notes: '' },
    { id: 'a29', day: 'Miércoles', hour: '16:00:00', label: 'SALTOS',     color: COLORS[3], notes: '' },
    { id: 'a30', day: 'Martes',    hour: '17:00:00', label: 'VOLCAN',     color: COLORS[0], notes: '' },
    { id: 'a31', day: 'Miércoles', hour: '17:00:00', label: 'SALTOS',     color: COLORS[3], notes: '' },
    { id: 'a32', day: 'Jueves',    hour: '17:00:00', label: 'restorant',  color: COLORS[4], notes: '' },
    { id: 'a33', day: 'Miércoles', hour: '18:00:00', label: 'SALTOS',     color: COLORS[3], notes: '' },
    { id: 'a34', day: 'Jueves',    hour: '18:00:00', label: 'paseillo',   color: COLORS[6], notes: '' },
    { id: 'a35', day: 'Domingo',   hour: '20:00:00', label: 'IDA',        color: COLORS[1], notes: '' },
    { id: 'a36', day: 'Jueves',    hour: '20:00:00', label: 'cafecillo',  color: COLORS[4], notes: '' },
    { id: 'a37', day: 'Viernes',   hour: '20:00:00', label: 'VUELTA',     color: COLORS[2], notes: '' },
    { id: 'a38', day: 'Jueves',    hour: '21:00:00', label: 'casita',     color: COLORS[6], notes: '' },
  ],
  days: [],
}];

// ── Firebase ──────────────────────────────────────────────
firebase.initializeApp(firebaseConfig);
const _db = firebase.firestore();

// ── Estado ────────────────────────────────────────────────
let currentUser  = null;
let _unsubscribe = null;

let state = {
  panoramas:      [],
  activePanorama: '',
};
let _pendingRender = false;

// ── Persistencia ──────────────────────────────────────────
function save() {
  if (!currentUser) return;
  localStorage.setItem('viajes_active', state.activePanorama);
  _db.collection('users').doc(currentUser)
    .update({ panoramas: JSON.parse(JSON.stringify(state.panoramas)) })
    .catch(e => console.error('Error al guardar:', e));
}

function initUserSync() {
  if (!currentUser) return;
  const userDoc = _db.collection('users').doc(currentUser);

  state.activePanorama = localStorage.getItem('viajes_active') || '';

  document.getElementById('content').innerHTML =
    '<div class="empty-state">Conectando…</div>';

  if (_unsubscribe) _unsubscribe();

  _unsubscribe = userDoc.onSnapshot(snap => {
    if (snap.exists) {
      state.panoramas = snap.data().panoramas || [];
      if (state.panoramas.length &&
          !state.panoramas.find(p => p.id === state.activePanorama)) {
        state.activePanorama = state.panoramas[0].id;
        localStorage.setItem('viajes_active', state.activePanorama);
      }
    } else {
      save();
      return;
    }

    const modalOpen = document.getElementById('modal-bg').style.display !== 'none';
    if (modalOpen) {
      _pendingRender = true;
    } else {
      render();
    }
  }, err => console.error('Error de sincronización:', err));
}

// ── Utilidades del modelo ──────────────────────────────────
function uid() {
  return 'id' + Math.random().toString(36).slice(2, 9);
}

function getActive() {
  return state.panoramas.find(p => p.id === state.activePanorama) || state.panoramas[0];
}
