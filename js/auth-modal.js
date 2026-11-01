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

// ─── LOCAL STORAGE USERS HELPER ───────────────────────────────────────────────
function getStoredUsers() {
  try {
    const users = JSON.parse(localStorage.getItem('mst_users') || '[]');
    if (users.length === 0) {
      // Default demo account
      const demoUser = {
        name: 'MS Tech Customer',
        phone: '9876543210',
        email: 'customer@mstech.com',
        password: 'password123',
        address: 'Electronic City, Bengaluru'
      };
      localStorage.setItem('mst_users', JSON.stringify([demoUser]));
      return [demoUser];
    }
    return users;
  } catch {
    return [];
  }
}

function saveStoredUsers(users) {
  try {
    localStorage.setItem('mst_users', JSON.stringify(users));
  } catch (e) {
    console.warn('Could not save users to localStorage', e);
  }
}

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

  // Generate demo OTP
  const demoOtp = '1234';
  sessionStorage.setItem('mst_fp_otp', demoOtp);
  sessionStorage.setItem('mst_fp_user', identifier);

  document.getElementById('fpStep1').style.display = 'none';
  document.getElementById('fpStep2').style.display = 'block';
  const demoBox = document.getElementById('fpDemoOtpBox');
  if (demoBox) {
    demoBox.innerHTML = `🔧 <strong>Verification Code:</strong> Your OTP is <strong style="color:#00b4d8;font-size:1.3em;letter-spacing:4px">${demoOtp}</strong>`;
    demoBox.style.display = 'block';
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
  if (otp !== '1234' && otp !== sessionStorage.getItem('mst_fp_otp')) {
    errEl.textContent = '⚠️ Invalid OTP. Please use OTP: 1234';
    errEl.style.display = 'block';
    return;
  }

  // Update password in local storage
  const users = getStoredUsers();
  const user = users.find(u => u.email === identifier || u.phone === identifier);
  if (user) {
    user.password = newPassword;
    saveStoredUsers(users);
  }

  document.getElementById('fpStep2').style.display = 'none';
  succEl.textContent = '🎉 Password reset successfully! You can now sign in.';
  succEl.style.display = 'block';
  setTimeout(() => { window.switchAuthTab('signin'); }, 2000);
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

  setTimeout(() => {
    const users = getStoredUsers();
    const user = users.find(u => (u.email === identifier || u.phone === identifier) && u.password === password);

    if (!user) {
      errEl.textContent = '⚠️ Invalid email/phone or password.';
      errEl.style.display = 'block';
      btn.textContent = 'Sign In →';
      btn.disabled = false;
      return;
    }

    const token = 'mock_mst_token_' + Date.now();
    const safeUser = { name: user.name, phone: user.phone, email: user.email, address: user.address };
    localStorage.setItem('mst_jwt_token', token);
    localStorage.setItem('mst_current_user', JSON.stringify(safeUser));

    const modal = document.getElementById('authModal');
    if (modal) modal.style.display = 'none';
    updateAuthNav();
    showToast('✅ Welcome back, ' + user.name + '!');
    btn.textContent = 'Sign In →';
    btn.disabled = false;
  }, 400);
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

  setTimeout(() => {
    const users = getStoredUsers();
    const exists = users.find(u => (phone && u.phone === phone) || (email && u.email === email));
    if (exists) {
      errEl.textContent = '⚠️ An account with this phone or email already exists.';
      errEl.style.display = 'block';
      btn.textContent = 'Create Account →';
      btn.disabled = false;
      return;
    }

    const newUser = { name, phone, email, password, address, createdAt: new Date().toISOString() };
    users.push(newUser);
    saveStoredUsers(users);

    const token = 'mock_mst_token_' + Date.now();
    const safeUser = { name, phone, email, address };
    localStorage.setItem('mst_jwt_token', token);
    localStorage.setItem('mst_current_user', JSON.stringify(safeUser));

    const modal = document.getElementById('authModal');
    if (modal) modal.style.display = 'none';
    updateAuthNav();
    showToast('🎉 Account created! Welcome, ' + name + '!');
    btn.textContent = 'Create Account →';
    btn.disabled = false;
  }, 400);
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
