/**
 * auth-modal.js
 * Shared authentication modal logic used across all pages.
 * Handles: sign-in, sign-up, forgot password, nav state, and toast.
 */

// ─── AUTH TAB SWITCHING ────────────────────────────────────────────────────────
window.switchAuthTab = function(tab) {
  const siForm = document.getElementById('signInForm');
  const suForm = document.getElementById('signUpForm');
  const fpForm = document.getElementById('forgotPasswordForm');
  const tabSI  = document.getElementById('tabSignIn');
  const tabSU  = document.getElementById('tabSignUp');

  if (siForm) siForm.style.display = 'none';
  if (suForm) suForm.style.display = 'none';
  if (fpForm) fpForm.style.display = 'none';

  if (tabSI) { tabSI.style.background = 'transparent'; tabSI.style.color = 'var(--text-muted)'; }
  if (tabSU) { tabSU.style.background = 'transparent'; tabSU.style.color = 'var(--text-muted)'; }

  if (tab === 'signin') {
    if (siForm) siForm.style.display = 'block';
    if (tabSI) { tabSI.style.background = 'var(--primary)'; tabSI.style.color = '#fff'; }
  } else if (tab === 'signup') {
    if (suForm) suForm.style.display = 'block';
    if (tabSU) { tabSU.style.background = 'var(--primary)'; tabSU.style.color = '#fff'; }
  } else if (tab === 'forgot') {
    if (fpForm) fpForm.style.display = 'block';
    const fpStep1 = document.getElementById('fpStep1');
    const fpStep2 = document.getElementById('fpStep2');
    const fpError = document.getElementById('fpError');
    const fpSuccess = document.getElementById('fpSuccess');
    const fpIdentifier = document.getElementById('fpIdentifier');
    const fpOtp = document.getElementById('fpOtp');
    const fpNewPassword = document.getElementById('fpNewPassword');
    const fpConfirmPassword = document.getElementById('fpConfirmPassword');
    if (fpStep1) fpStep1.style.display = 'block';
    if (fpStep2) fpStep2.style.display = 'none';
    if (fpError) fpError.style.display = 'none';
    if (fpSuccess) fpSuccess.style.display = 'none';
    if (fpIdentifier) fpIdentifier.value = '';
    if (fpOtp) fpOtp.value = '';
    if (fpNewPassword) fpNewPassword.value = '';
    if (fpConfirmPassword) fpConfirmPassword.value = '';
  }
};

// ─── FORGOT PASSWORD ───────────────────────────────────────────────────────────
window.sendForgotPasswordOtp = async function() {
  const identifier = document.getElementById('fpIdentifier').value.trim();
  const errEl = document.getElementById('fpError');
  errEl.style.display = 'none';
  if (!identifier) {
    errEl.textContent = '⚠️ Please enter your email or phone.';
    errEl.style.display = 'block';
    return;
  }
  try {
    const res = await fetch('http://localhost:4000/api/auth/forgot-password/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier })
    });
    const data = await res.json();
    if (!data.success) {
      errEl.textContent = '⚠️ ' + data.error;
      errEl.style.display = 'block';
      return;
    }
    document.getElementById('fpStep1').style.display = 'none';
    document.getElementById('fpStep2').style.display = 'block';
    const demoBox = document.getElementById('fpDemoOtpBox');
    if (demoBox) {
      if (data.demoOtp) {
        demoBox.innerHTML = `🔧 <strong>Demo Mode:</strong> Your OTP is <strong style="color:#00b4d8;font-size:1.3em;letter-spacing:4px">${data.demoOtp}</strong><br><small style="opacity:0.75">(Set up Fast2SMS or MSG91 API key in .env for real SMS)</small>`;
        demoBox.style.display = 'block';
      } else {
        demoBox.style.display = 'none';
      }
    }
  } catch {
    errEl.textContent = '⚠️ Could not contact verification server.';
    errEl.style.display = 'block';
  }
};

window.handleForgotPasswordReset = async function(e) {
  e.preventDefault();
  const identifier = document.getElementById('fpIdentifier').value.trim();
  const otp = document.getElementById('fpOtp').value.trim();
  const newPassword = document.getElementById('fpNewPassword').value;
  const confirmPassword = document.getElementById('fpConfirmPassword').value;
  const errEl = document.getElementById('fpError');
  const succEl = document.getElementById('fpSuccess');

  errEl.style.display = 'none';
  succEl.style.display = 'none';

  if (newPassword.length < 6) {
    errEl.textContent = '⚠️ Password must be at least 6 characters.';
    errEl.style.display = 'block';
    return;
  }
  if (newPassword !== confirmPassword) {
    errEl.textContent = '⚠️ Passwords do not match.';
    errEl.style.display = 'block';
    return;
  }
  try {
    const res = await fetch('http://localhost:4000/api/auth/forgot-password/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, otp, newPassword })
    });
    const data = await res.json();
    if (!data.success) {
      errEl.textContent = '⚠️ ' + data.error;
      errEl.style.display = 'block';
      return;
    }
    document.getElementById('fpStep2').style.display = 'none';
    succEl.textContent = '🎉 ' + data.message;
    succEl.style.display = 'block';
    setTimeout(() => { window.switchAuthTab('signin'); }, 2500);
  } catch {
    errEl.textContent = '⚠️ Failed to reset password. Please check your connection.';
    errEl.style.display = 'block';
  }
};

// ─── SIGN IN ───────────────────────────────────────────────────────────────────
window.handleSignIn = async function(e) {
  e.preventDefault();
  const identifier = document.getElementById('siIdentifier').value.trim();
  const password   = document.getElementById('siPassword').value;
  const errEl      = document.getElementById('siError');
  errEl.style.display = 'none';
  const btn = e.target.querySelector('button[type=submit]');
  btn.textContent = 'Signing in…'; btn.disabled = true;
  try {
    const res = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });
    const data = await res.json();
    if (!data.success) { errEl.textContent = data.error; errEl.style.display = 'block'; return; }
    localStorage.setItem('mst_jwt_token', data.token);
    localStorage.setItem('mst_current_user', JSON.stringify(data.user));
    const modal = document.getElementById('authModal');
    if (modal) modal.style.display = 'none';
    updateAuthNav();
    if (data.redirectAdmin) { window.location.href = 'admin.html'; }
    else { showToast('✅ Welcome back, ' + data.user.name + '!'); }
  } catch {
    errEl.textContent = '⚠️ Could not connect to server. Make sure backend is running (npm run server).';
    errEl.style.display = 'block';
  } finally { btn.textContent = 'Sign In →'; btn.disabled = false; }
};

// ─── SIGN UP ───────────────────────────────────────────────────────────────────
window.handleSignUp = async function(e) {
  e.preventDefault();
  const name     = document.getElementById('suName').value.trim();
  const phone    = document.getElementById('suPhone').value.trim();
  const email    = document.getElementById('suEmail').value.trim();
  const password = document.getElementById('suPassword').value;
  const address  = document.getElementById('suAddress').value.trim();
  const errEl    = document.getElementById('suError');
  errEl.style.display = 'none';
  const btn = e.target.querySelector('button[type=submit]');
  btn.textContent = 'Creating…'; btn.disabled = true;
  try {
    const res = await fetch('http://localhost:4000/api/auth/signup', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, email, password, address })
    });
    const data = await res.json();
    if (!data.success) { errEl.textContent = data.error; errEl.style.display = 'block'; return; }
    localStorage.setItem('mst_jwt_token', data.token);
    localStorage.setItem('mst_current_user', JSON.stringify(data.user));
    const modal = document.getElementById('authModal');
    if (modal) modal.style.display = 'none';
    updateAuthNav();
    showToast('🎉 Account created! Welcome, ' + data.user.name + '!');
  } catch {
    errEl.textContent = '⚠️ Server not reachable. Run: npm run server';
    errEl.style.display = 'block';
  } finally { btn.textContent = 'Create Account →'; btn.disabled = false; }
};

// ─── NAV AUTH STATE ────────────────────────────────────────────────────────────
function updateAuthNav() {
  const user       = JSON.parse(localStorage.getItem('mst_current_user') || 'null');
  const authBtn    = document.getElementById('authNavBtn');
  const userBadge  = document.getElementById('userProfileBadge');
  const userName   = document.getElementById('authUserName');
  const ordersLink = document.getElementById('navOrdersLink');
  if (user) {
    if (authBtn)    authBtn.style.display = 'none';
    if (userBadge)  userBadge.style.display = 'inline-flex';
    if (userName)   userName.textContent = '👤 ' + user.name.split(' ')[0];
    if (ordersLink) ordersLink.style.display = 'inline-flex';
  } else {
    if (authBtn)    authBtn.style.display = 'inline-flex';
    if (userBadge)  userBadge.style.display = 'none';
    if (ordersLink) ordersLink.style.display = 'none';
  }
}
window.updateAuthNav = updateAuthNav;

// ─── TOAST ─────────────────────────────────────────────────────────────────────
function showToast(msg) {
  let t = document.getElementById('globalToast');
  if (!t) {
    t = document.createElement('div'); t.id = 'globalToast';
    t.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:99999;background:#0c1222;border:1px solid rgba(0,180,216,0.4);color:#fff;padding:14px 22px;border-radius:12px;font-size:0.9rem;box-shadow:0 8px 30px rgba(0,0,0,0.5);transition:opacity 0.3s;opacity:0;pointer-events:none;';
    document.body.appendChild(t);
  }
  t.textContent = msg; t.style.opacity = '1';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.style.opacity = '0'; }, 3500);
}
window.showToast = showToast;

// ─── INIT ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  updateAuthNav();
  const authNavBtn = document.getElementById('authNavBtn');
  if (authNavBtn) authNavBtn.addEventListener('click', () => {
    const modal = document.getElementById('authModal');
    if (modal) modal.style.display = 'flex';
  });
  const authLogoutBtn = document.getElementById('authLogoutBtn');
  if (authLogoutBtn) authLogoutBtn.addEventListener('click', () => {
    localStorage.removeItem('mst_jwt_token');
    localStorage.removeItem('mst_current_user');
    updateAuthNav();
    showToast('👋 You have been signed out.');
  });
  // Close modal on backdrop click
  const modal = document.getElementById('authModal');
  if (modal) modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });
});
