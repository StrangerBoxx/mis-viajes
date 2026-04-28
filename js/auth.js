// ── Seed usuario por defecto ──────────────────────────────
async function seedDefaultUser() {
  try {
    const ref = _db.collection('users').doc('ConyKakumi');
    const snap = await ref.get();
    if (!snap.exists) {
      await ref.set({
        password:  'TeamoCacu15',
        panoramas: JSON.parse(JSON.stringify(INITIAL_PANORAMAS)),
      });
    }
  } catch (e) {
    console.error('Error al crear usuario por defecto:', e);
  }
}

// ── Helpers de autenticación ──────────────────────────────
async function loginUser(username, password) {
  const snap = await _db.collection('users').doc(username).get();
  if (!snap.exists)               throw new Error('Usuario no encontrado');
  if (snap.data().password !== password) throw new Error('Contraseña incorrecta');
}

async function registerUser(username, password) {
  if (!username || username.length < 3)
    throw new Error('El usuario debe tener al menos 3 caracteres');
  if (!password || password.length < 6)
    throw new Error('La contraseña debe tener al menos 6 caracteres');
  if (!/^[a-zA-Z0-9_]+$/.test(username))
    throw new Error('Solo letras, números y guiones bajos (_)');

  const snap = await _db.collection('users').doc(username).get();
  if (snap.exists) throw new Error('Ese nombre de usuario ya está en uso');

  await _db.collection('users').doc(username).set({
    password,
    panoramas: [],
  });
}

// ── UI: mostrar/ocultar pantallas ─────────────────────────
function showLogin() {
  document.getElementById('app').style.display = 'none';
  document.getElementById('login-screen').style.display = 'flex';
}

function showApp(username) {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  document.getElementById('user-display').textContent = username;
}

// ── Toggle contraseña ─────────────────────────────────────
window.togglePass = function () {
  const inp = document.getElementById('login-pass');
  inp.type = inp.type === 'password' ? 'text' : 'password';
};

// ── Acciones de los botones ───────────────────────────────
window.doLogin = async function () {
  const username = document.getElementById('login-user').value.trim();
  const password = document.getElementById('login-pass').value;
  const errEl    = document.getElementById('login-error');
  const btn      = document.getElementById('btn-login');

  errEl.textContent = '';
  if (!username || !password) { errEl.textContent = 'Completa todos los campos'; return; }

  btn.disabled    = true;
  btn.textContent = 'Ingresando…';

  try {
    await loginUser(username, password);
    localStorage.setItem('viajes_user', username);
    currentUser = username;
    showApp(username);
    initUserSync();
  } catch (e) {
    errEl.textContent = e.message;
  } finally {
    btn.disabled    = false;
    btn.textContent = 'Iniciar sesión';
  }
};

window.doRegister = async function () {
  const username = document.getElementById('login-user').value.trim();
  const password = document.getElementById('login-pass').value;
  const errEl    = document.getElementById('login-error');
  const btn      = document.getElementById('btn-register');

  errEl.textContent = '';

  btn.disabled    = true;
  btn.textContent = 'Creando cuenta…';

  try {
    await registerUser(username, password);
    localStorage.setItem('viajes_user', username);
    currentUser = username;
    showApp(username);
    initUserSync();
  } catch (e) {
    errEl.textContent = e.message;
  } finally {
    btn.disabled    = false;
    btn.textContent = 'Crear cuenta nueva';
  }
};

window.doLogout = function () {
  if (_unsubscribe) { _unsubscribe(); _unsubscribe = null; }
  currentUser = null;
  state.panoramas      = [];
  state.activePanorama = '';
  localStorage.removeItem('viajes_user');
  localStorage.removeItem('viajes_active');
  document.getElementById('login-user').value  = '';
  document.getElementById('login-pass').value  = '';
  document.getElementById('login-error').textContent = '';
  showLogin();
};

// ── Enter en los campos dispara login ─────────────────────
document.getElementById('login-user').addEventListener('keydown', e => {
  if (e.key === 'Enter') doLogin();
});
document.getElementById('login-pass').addEventListener('keydown', e => {
  if (e.key === 'Enter') doLogin();
});

// ── Arranque ──────────────────────────────────────────────
async function initAuth() {
  await seedDefaultUser();

  const stored = localStorage.getItem('viajes_user');
  if (stored) {
    try {
      const snap = await _db.collection('users').doc(stored).get();
      if (snap.exists) {
        currentUser = stored;
        showApp(stored);
        initUserSync();
        return;
      }
    } catch (e) {
      console.error('Error al verificar sesión guardada:', e);
    }
    localStorage.removeItem('viajes_user');
  }

  showLogin();
}

initAuth();
