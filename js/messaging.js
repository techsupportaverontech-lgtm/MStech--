// MS Technologies — Shared Messaging System
// localStorage-based message passing between customer site and admin dashboard

const MESSAGES_KEY = 'mst_admin_messages';
const PRODUCTS_KEY = 'mst_products_data';
const ADMIN_CREDS_KEY = 'mst_admin_creds';

// ─── Message Functions ────────────────────────────────────────────────────────

export function generateMessageId() {
  const ts = Date.now().toString(36).toUpperCase();
  const rnd = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `MSG-${ts}-${rnd}`;
}

export function sendMessageToAdmin(messageObj) {
  const messages = getAdminMessages();
  const now = Date.now();
  
  // Prevent duplicate additions (same orderId, or same customer phone + total_amount within 15 seconds)
  const isDuplicate = messages.some(m => {
    if (messageObj.orderId && (m.orderId === messageObj.orderId || m.id === messageObj.orderId)) return true;
    if (messageObj.id && (m.id === messageObj.id || m.orderId === messageObj.id)) return true;

    const mPhone = (m.customer_phone || m.customerPhone || '').replace(/\D/g, '');
    const newPhone = (messageObj.customer_phone || messageObj.customerPhone || '').replace(/\D/g, '');
    const mTime = new Date(m.timestampISO || m.timestamp).getTime();
    const newTotal = messageObj.total_amount || messageObj.totalAmount || 0;
    const mTotal = m.total_amount || m.totalAmount || 0;

    if (mPhone && newPhone && mPhone === newPhone && newTotal === mTotal && Math.abs(now - mTime) < 15000) {
      return true;
    }
    return false;
  });

  if (isDuplicate) return messages[0];

  const msg = {
    id: generateMessageId(),
    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    timestampISO: new Date().toISOString(),
    status: 'new',
    ...messageObj,
  };
  messages.unshift(msg); // newest first
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  window.dispatchEvent(new CustomEvent('mst_messages_updated'));
  return msg;
}

export function getAdminMessages() {
  try {
    return JSON.parse(localStorage.getItem(MESSAGES_KEY)) || [];
  } catch {
    return [];
  }
}

export function getUnreadCount() {
  return getAdminMessages().filter(m => m.status === 'new').length;
}

export function markMessageRead(msgId) {
  const messages = getAdminMessages();
  const msg = messages.find(m => m.id === msgId);
  if (msg) {
    msg.status = 'read';
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  }
}

export function markMessageCompleted(msgId) {
  const messages = getAdminMessages();
  const msg = messages.find(m => m.id === msgId);
  if (msg) {
    msg.status = 'completed';
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  }
}

export function deleteMessage(msgId) {
  let messages = getAdminMessages();
  messages = messages.filter(m => m.id !== msgId);
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
}

// ─── Products Data Functions ──────────────────────────────────────────────────

export function getStoredProducts() {
  try {
    const data = localStorage.getItem(PRODUCTS_KEY);
    return data ? JSON.parse(data) : null; // null means use defaults
  } catch {
    return null;
  }
}

export function saveProducts(productsArray) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(productsArray));
  window.dispatchEvent(new CustomEvent('mst_products_updated'));
}

// ─── Admin Credentials ───────────────────────────────────────────────────────

export function getAdminCreds() {
  try {
    const data = localStorage.getItem(ADMIN_CREDS_KEY);
    return data ? JSON.parse(data) : { username: 'admin', password: 'MStech@2026' };
  } catch {
    return { username: 'admin', password: 'MStech@2026' };
  }
}

export function saveAdminCreds(username, password) {
  localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify({ username, password }));
}

export function validateAdminLogin(username, password) {
  const creds = getAdminCreds();
  return username === creds.username && password === creds.password;
}
