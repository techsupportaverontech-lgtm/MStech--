// ═══ Laptop Rentals — Frontend JS ═══
const RENTALS_API = 'http://localhost:4000/api/rentals';
let _currentRentalId = null;
let _currentRentalName = '';

// ── Condition badge colours
function rentalConditionBadge(label) {
  const map = {
    'Excellent': { bg: 'rgba(16,185,129,0.15)', color: '#10b981', icon: '⭐' },
    'Good':      { bg: 'rgba(59,130,246,0.15)', color: '#3b82f6', icon: '✅' },
    'Fair':      { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', icon: '🔶' },
  };
  const s = map[label] || map['Good'];
  return `<span style="background:${s.bg}; color:${s.color}; font-size:0.72rem; font-weight:700; padding:3px 9px; border-radius:20px;">${s.icon} ${label}</span>`;
}

// ── Build rental card HTML (Modern E-Commerce Design)
function buildRentalCard(r) {
  const avail = r.available;
  const resolvedImgUrl = r.img_url
    ? (r.img_url.startsWith('/') ? 'http://localhost:4000' + r.img_url : r.img_url)
    : '';

  // Extract brand from name
  const knownBrands = ['Lenovo', 'Dell', 'HP', 'Apple', 'MacBook', 'Asus', 'Acer', 'MSI', 'Intel', 'Samsung'];
  let brand = 'MS TECHNOLOGIES';
  for (const b of knownBrands) {
    if (r.name.toLowerCase().includes(b.toLowerCase())) {
      brand = b.toUpperCase();
      break;
    }
  }

  // Rating calculation (consistent hash rating based on name)
  const nameHash = (r.name || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const ratingVal = (4.2 + (nameHash % 7) * 0.1).toFixed(1);
  const fullStars = Math.floor(parseFloat(ratingVal));
  const halfStar = parseFloat(ratingVal) - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  const starsHtml = '★'.repeat(fullStars) + (halfStar ? '★' : '') + '☆'.repeat(emptyStars);
  const reviewCount = 12 + (nameHash % 35);

  // Spec pills
  const specsList = [];
  if (r.specs) {
    r.specs.split(/[,|•]/).forEach(s => {
      const trimmed = s.trim();
      if (trimmed) specsList.push(trimmed);
    });
  }
  if (specsList.length === 0) {
    specsList.push('8GB RAM', '256GB SSD', 'Intel Core i5');
  }
  const specPillsHtml = specsList.slice(0, 4).map(s => `<span class="spec-pill">${s}</span>`).join('');

  // Primary rental price display (Day / Month rate)
  let mainPriceText = '';
  let subPriceText = '';
  let origPriceText = '';
  let discountTagText = '';

  if (r.price_per_day) {
    const dayVal = Number(r.price_per_day);
    mainPriceText = `₹${dayVal.toLocaleString('en-IN')}<span style="font-size:0.75rem; font-weight:600; color:#64748b;">/day</span>`;
    const origVal = Math.round(dayVal * 1.45);
    origPriceText = `₹${origVal.toLocaleString('en-IN')}`;
    discountTagText = `31% off`;
  } else if (r.price_per_month) {
    const monthVal = Number(r.price_per_month);
    mainPriceText = `₹${monthVal.toLocaleString('en-IN')}<span style="font-size:0.75rem; font-weight:600; color:#64748b;">/month</span>`;
    const origVal = Math.round(monthVal * 1.4);
    origPriceText = `₹${origVal.toLocaleString('en-IN')}`;
    discountTagText = `28% off`;
  } else {
    mainPriceText = `₹500<span style="font-size:0.75rem; font-weight:600; color:#64748b;">/day</span>`;
  }

  // Additional rates line if available
  const otherRates = [];
  if (r.price_per_week) otherRates.push(`Week: ₹${Number(r.price_per_week).toLocaleString('en-IN')}`);
  if (r.price_per_month && r.price_per_day) otherRates.push(`Month: ₹${Number(r.price_per_month).toLocaleString('en-IN')}`);
  if (otherRates.length > 0) {
    subPriceText = `<div style="font-size:0.72rem; color:#64748b; margin-top:2px; font-weight:600;">${otherRates.join(' • ')}</div>`;
  }

  // Image section
  const imgHtml = resolvedImgUrl
    ? `<img src="${resolvedImgUrl}" alt="${r.name}" loading="lazy" decoding="async" onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:3rem;\\'>💻</div>';"/>
       <div class="img-dots-indicator"><span class="img-dot active"></span><span class="img-dot"></span><span class="img-dot"></span></div>`
    : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:3rem;">💻</div>`;

  // Badge
  const useCaseBadge = avail
    ? `<span class="product-usecase-badge">✓ Available for Rent</span>`
    : `<span class="product-usecase-badge" style="background:#fee2e2; color:#991b1b;">❌ Currently Rented</span>`;

  return `
  <div class="product-card animate-on-scroll">
    <div class="product-card-top-bar" style="justify-content: flex-end;">
      <span class="badge-certified-stamp" title="Certified Refurbished & Tested">✓ Verified</span>
    </div>
    <div class="product-card-img-wrap">
      ${imgHtml}
    </div>
    <div class="product-brand-name">${brand}</div>
    <h3>${r.name}</h3>
    <div class="product-rating-row">
      ${starsHtml} <span class="product-rating-count">(${reviewCount})</span>
    </div>
    <div class="product-specs-pills">
      ${specPillsHtml}
    </div>
    ${useCaseBadge}
    <div class="product-price-row">
      <span class="product-current-price">${mainPriceText}</span>
      ${origPriceText ? `<span class="product-original-price">${origPriceText}</span>` : ''}
      ${discountTagText ? `<span class="product-discount-off">${discountTagText}</span>` : ''}
    </div>
    ${subPriceText}
    <div class="product-warranty-row" style="margin-top:6px;">🛡 Free Maintenance &amp; Support Included</div>
    <button class="btn-buy" 
            onclick="openRentalEnquiry(${r.id}, '${r.name.replace(/'/g, "\\'")}')" 
            style="margin-top:auto; ${!avail ? 'opacity:0.5; cursor:not-allowed;' : ''}"
            ${!avail ? 'disabled' : ''}>
      ${avail ? '📩 Enquire to Rent' : 'Unavailable'}
    </button>
  </div>`;
}

let _lastRentalsJson = '';

// ── Load rentals from API
async function loadRentals() {
  const grid = document.getElementById('rentalsGrid');
  const loadMsg = document.getElementById('rentalsLoadingMsg');
  const empty = document.getElementById('rentalsEmptyState');
  if (!grid) return;

  try {
    const res = await fetch(RENTALS_API);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    const rentals = data.rentals || [];

    // Compare with last loaded data to prevent screen flicker/re-animations if nothing changed
    const currentJson = JSON.stringify(rentals);
    if (currentJson === _lastRentalsJson) {
      return;
    }
    _lastRentalsJson = currentJson;

    if (loadMsg) loadMsg.style.display = 'none';
    if (rentals.length === 0) {
      grid.innerHTML = '';
      if (empty) empty.style.display = 'block';
      return;
    }

    grid.innerHTML = rentals.map(buildRentalCard).join('');
    if (empty) empty.style.display = 'none';

    // Directly bind IntersectionObserver for the dynamically rendered cards
    const cards = grid.querySelectorAll('.animate-on-scroll');
    if (cards.length > 0) {
      const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            cardObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08 });
      cards.forEach(card => cardObserver.observe(card));
    }
  } catch (err) {
    if (loadMsg && !_lastRentalsJson) {
      loadMsg.innerHTML = '⚠️ Could not load rentals. Please try again later.';
    }
    console.warn('Rentals load error:', err);
  }
}


// ── OTP verification state
let _otpVerified = false;
let _generatedOtp = '1234'; // Fixed demo OTP

// ── Open enquiry modal
function openRentalEnquiry(id, name) {
  // Require sign-in before allowing enquiry
  if (window.requireSignIn && !window.requireSignIn('submit a rental enquiry')) return;

  _currentRentalId = id;
  _currentRentalName = name;
  _otpVerified = false;

  // Always clear form fields (do NOT autofill)
  const fields = ['rentalEnqName', 'rentalEnqPhone', 'rentalEnqEmail', 'rentalEnqNote'];
  fields.forEach(fid => {
    const el = document.getElementById(fid);
    if (el) el.value = '';
  });
  // Reset OTP UI
  const otpWrap = document.getElementById('rentalOtpWrapper');
  const otpInput = document.getElementById('rentalOtpInput');
  const verifiedBadge = document.getElementById('rentalVerifiedBadge');
  const errEl = document.getElementById('rentalEnqError');
  const sendBtn = document.getElementById('rentalSendOtpBtn');
  const submitBtn = document.getElementById('rentalSubmitBtn');
  if (otpWrap) { otpWrap.style.display = 'none'; }
  if (otpInput) { otpInput.value = ''; }
  if (verifiedBadge) { verifiedBadge.style.display = 'none'; }
  if (errEl) { errEl.style.display = 'none'; errEl.textContent = ''; }
  if (sendBtn) { sendBtn.textContent = 'Verify Mobile'; sendBtn.disabled = false; }
  if (submitBtn) { submitBtn.disabled = true; submitBtn.style.opacity = '0.5'; submitBtn.style.cursor = 'not-allowed'; }

  document.getElementById('rentalEnquiryLaptopName').textContent = '📦 ' + name;
  const modal = document.getElementById('rentalEnquiryModal');
  if (modal) { modal.style.display = 'flex'; }

  // Set min date for rental period
  const today = new Date().toISOString().split('T')[0];
  const fromEl = document.getElementById('rentalEnqFromDate');
  const toEl   = document.getElementById('rentalEnqToDate');
  if (fromEl) { fromEl.min = today; fromEl.value = ''; }
  if (toEl)   { toEl.min = today; toEl.value = ''; }
}

// ── Wire OTP buttons
document.addEventListener('DOMContentLoaded', () => {
  const sendOtpBtn = document.getElementById('rentalSendOtpBtn');
  const verifyOtpBtn = document.getElementById('rentalVerifyOtpBtn');

  if (sendOtpBtn) {
    sendOtpBtn.addEventListener('click', () => {
      const phone = document.getElementById('rentalEnqPhone')?.value.trim();
      const errEl = document.getElementById('rentalEnqError');
      if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
        if (errEl) { errEl.textContent = '⚠️ Enter a valid 10-digit Indian mobile number.'; errEl.style.display = 'block'; }
        return;
      }
      if (errEl) errEl.style.display = 'none';
      _generatedOtp = '1234'; // Demo fixed OTP

      const otpWrap = document.getElementById('rentalOtpWrapper');
      if (otpWrap) otpWrap.style.display = 'block';
      sendOtpBtn.textContent = 'OTP Sent ✓';
      sendOtpBtn.disabled = true;
      setTimeout(() => {
        sendOtpBtn.textContent = 'Resend OTP';
        sendOtpBtn.disabled = false;
      }, 30000);
    });
  }

  if (verifyOtpBtn) {
    verifyOtpBtn.addEventListener('click', () => {
      const entered = document.getElementById('rentalOtpInput')?.value.trim();
      const errEl = document.getElementById('rentalEnqError');
      const verifiedBadge = document.getElementById('rentalVerifiedBadge');
      const submitBtn = document.getElementById('rentalSubmitBtn');
      if (entered !== _generatedOtp) {
        if (errEl) { errEl.textContent = '❌ Incorrect OTP. Please try again.'; errEl.style.display = 'block'; }
        return;
      }
      _otpVerified = true;
      const otpWrap = document.getElementById('rentalOtpWrapper');
      if (otpWrap) otpWrap.style.display = 'none';
      if (verifiedBadge) verifiedBadge.style.display = 'block';
      if (errEl) errEl.style.display = 'none';
      if (submitBtn) { submitBtn.disabled = false; submitBtn.style.opacity = '1'; submitBtn.style.cursor = 'pointer'; }
    });
  }
});

// ── Submit rental enquiry
async function submitRentalEnquiry() {
  const name  = document.getElementById('rentalEnqName')?.value.trim();
  const phone = document.getElementById('rentalEnqPhone')?.value.trim();
  const email = document.getElementById('rentalEnqEmail')?.value.trim();
  const from  = document.getElementById('rentalEnqFromDate')?.value;
  const to    = document.getElementById('rentalEnqToDate')?.value;
  const note  = document.getElementById('rentalEnqNote')?.value.trim();
  const errEl = document.getElementById('rentalEnqError');

  if (!name || !phone) {
    if (errEl) { errEl.textContent = '⚠️ Name and phone number are required.'; errEl.style.display = 'block'; }
    return;
  }
  if (!/^[6-9]\d{9}$/.test(phone)) {
    if (errEl) { errEl.textContent = '⚠️ Enter a valid 10-digit Indian mobile number.'; errEl.style.display = 'block'; }
    return;
  }
  if (!_otpVerified) {
    if (errEl) { errEl.textContent = '⚠️ Please verify your mobile number first.'; errEl.style.display = 'block'; }
    return;
  }
  if (errEl) errEl.style.display = 'none';

  // ── 1. Save to admin messages via localStorage (always works, no backend needed)
  try {
    const { sendMessageToAdmin } = await import('./messaging.js');
    sendMessageToAdmin({
      type: 'service_booking',
      service: 'Laptop Rental',
      orderId: 'RNT-' + Date.now().toString(36).toUpperCase(),
      customer_name: name,
      customer_phone: phone,
      customer_email: email || '',
      items: [{ name: _currentRentalName, rentalId: _currentRentalId, from, to }],
      total_amount: 0,
      problemDesc: `Rental Enquiry for: ${_currentRentalName}${from && to ? ` | Period: ${from} to ${to}` : ''}${note ? ` | Notes: ${note}` : ''}`,
      locationAddress: '',
      phone_verified: true,
    });
  } catch (e) {
    console.warn('localStorage messaging fallback:', e);
  }

  // ── 2. Also try backend API (optional, won't block success if offline)
  const orderId = 'RNT-' + Date.now().toString(36).toUpperCase();
  const payload = {
    type: 'service_booking',
    orderId,
    customerName: name,
    customerPhone: phone,
    customerEmail: email || '',
    service: 'Laptop Rental',
    items: [{ name: _currentRentalName, rentalId: _currentRentalId, from, to }],
    totalAmount: 0,
    problemDesc: `Rental Enquiry for: ${_currentRentalName}${from && to ? ` | Period: ${from} to ${to}` : ''}${note ? ` | Notes: ${note}` : ''}`,
    locationAddress: '',
  };

  const btn = document.getElementById('rentalSubmitBtn');
  if (btn) btn.textContent = '⏳ Sending...';

  // Show success immediately (localStorage message is already saved)
  const modal = document.getElementById('rentalEnquiryModal');
  if (modal) {
    modal.querySelector('div').innerHTML = `
      <div style="text-align:center; padding:40px 20px;">
        <div style="font-size:3.5rem; margin-bottom:16px;">🎉</div>
        <h3 style="color:#0f172a; margin:0 0 10px; font-size:1.3rem;">Enquiry Sent!</h3>
        <p style="color:#475569; font-size:0.92rem; line-height:1.7;">We've received your rental enquiry for <strong style="color:#0ea5e9;">${_currentRentalName}</strong>.<br>Our team will contact you on <strong>+91 ${phone}</strong> within a few hours.</p>
        <button onclick="document.getElementById('rentalEnquiryModal').style.display='none';" 
                class="btn btn-primary" style="margin-top:24px; padding:12px 32px; font-size:0.95rem; font-weight:700;">✓ Done</button>
      </div>`;
  }

  // Fire & forget backend
  fetch('http://localhost:4000/api/orders/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => {});
}

// ── Auto-load and start polling every 3 seconds for instant updates
loadRentals();
setInterval(loadRentals, 3000);

// Expose functions to window object for inline HTML event handlers
window.openRentalEnquiry = openRentalEnquiry;
window.submitRentalEnquiry = submitRentalEnquiry;
window.loadRentals = loadRentals;

// Close modal on outside click
document.addEventListener('click', (e) => {
  const modal = document.getElementById('rentalEnquiryModal');
  if (modal && e.target === modal) modal.style.display = 'none';
});
