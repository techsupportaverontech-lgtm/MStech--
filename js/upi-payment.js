/**
 * upi-payment.js
 * UPI payment integration module.
 * Handles payment initiation and order confirmation via the backend.
 */

const API_BASE = 'http://localhost:4000/api';

/**
 * Initiates a UPI payment request.
 * @param {Object} options - Payment options
 * @param {number} options.amount - Amount in INR
 * @param {string} options.description - Order description
 * @param {Function} options.onSuccess - Callback on payment success
 * @param {Function} options.onError - Callback on payment failure
 */
export async function initiateUpiPayment({ amount, description, onSuccess, onError }) {
  try {
    const token = localStorage.getItem('mst_jwt_token');
    if (!token) {
      const modal = document.getElementById('authModal');
      if (modal) modal.style.display = 'flex';
      if (typeof window.showToast === 'function') {
        window.showToast('⚠️ Please sign in to proceed with payment.');
      }
      return;
    }

    const res = await fetch(`${API_BASE}/payments/upi/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ amount, description })
    });

    const data = await res.json();
    if (data.success) {
      if (typeof onSuccess === 'function') onSuccess(data);
    } else {
      if (typeof onError === 'function') onError(data.error || 'Payment failed');
    }
  } catch (err) {
    console.error('[UPI Payment] Error:', err);
    if (typeof onError === 'function') onError('Could not reach payment server.');
  }
}

/**
 * Show a UPI QR / deep-link payment dialog.
 * @param {Object} options - { amount, orderId, description }
 */
export function showUpiDialog({ amount, orderId, description }) {
  // Remove existing dialog if any
  const existing = document.getElementById('upiPaymentDialog');
  if (existing) existing.remove();

  const dialog = document.createElement('div');
  dialog.id = 'upiPaymentDialog';
  dialog.style.cssText = `
    position:fixed;inset:0;z-index:99998;
    background:rgba(0,0,0,0.75);backdrop-filter:blur(6px);
    display:flex;align-items:center;justify-content:center;
  `;
  dialog.innerHTML = `
    <div style="
      background:#0c1222;border:1px solid rgba(0,180,216,0.3);
      border-radius:18px;padding:36px 32px;max-width:420px;width:90%;
      box-shadow:0 24px 80px rgba(0,0,0,0.6);text-align:center;color:#fff;
    ">
      <h3 style="margin:0 0 8px;font-size:1.3rem;color:#00b4d8;">💳 UPI Payment</h3>
      <p style="color:#94a3b8;font-size:0.9rem;margin:0 0 20px;">${description || 'Complete your payment'}</p>
      <div style="font-size:2rem;font-weight:700;color:#00b4d8;margin-bottom:20px;">₹${Number(amount).toLocaleString('en-IN')}</div>
      <p style="color:#64748b;font-size:0.82rem;margin-bottom:20px;">
        Order ID: <code style="color:#90e0ef;">${orderId || 'N/A'}</code>
      </p>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
        <a href="upi://pay?pa=MSTechnologiees@upi&pn=MS%20Technologies&am=${amount}&cu=INR&tn=${encodeURIComponent(description || 'Order Payment')}"
           style="
             display:inline-flex;align-items:center;gap:8px;padding:12px 22px;
             background:linear-gradient(135deg,#00b4d8,#0077b6);color:#fff;
             border-radius:10px;text-decoration:none;font-weight:600;font-size:0.9rem;
           ">
          📱 Pay via UPI App
        </a>
        <button id="upiCancelBtn" style="
          padding:12px 22px;background:transparent;border:1px solid rgba(255,255,255,0.2);
          color:#94a3b8;border-radius:10px;cursor:pointer;font-size:0.9rem;
        ">Cancel</button>
      </div>
      <p style="color:#475569;font-size:0.76rem;margin-top:16px;">
        After payment, your order will be confirmed automatically.
      </p>
    </div>
  `;

  document.body.appendChild(dialog);
  document.getElementById('upiCancelBtn').addEventListener('click', () => dialog.remove());
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.remove(); });
}
