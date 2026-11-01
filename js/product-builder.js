import { loadProducts } from './products.js';

const categoryLabels = {
  cpu: 'Processor', gpu: 'Graphics Card', motherboard: 'Motherboard', ram: 'RAM', storage: 'Storage',
  psu: 'Power Supply', cooler: 'Cooling', cabinet: 'Cabinet', monitor: 'Monitor', keyboard: 'Keyboard',
  mouse: 'Mouse', headset: 'Headset'
};

const productContainer = document.getElementById('productContainer');
const categoryTitle = document.getElementById('categoryTitle');
const buildList = document.getElementById('buildList');
let products = {};
let selected = {};
let activeCategory = 'cpu';

function getIdentity(item) {
  const details = item.details || {};
  return {
    brand: details.Brand || 'MS Technologies',
    model: details.Model || item.name
  };
}

function renderSpecifications(item, includeIdentity = false) {
  const details = Object.entries(item.details || {}).filter(([label]) => includeIdentity || !['Brand', 'Model'].includes(label));
  return details.map(([label, value]) => `<span><b>${label}:</b> ${value}</span>`).join('');
}

function renderProducts() {
  const visibleProducts = products[activeCategory] || [];
  document.getElementById('emptyState').hidden = visibleProducts.length > 0;
  productContainer.innerHTML = visibleProducts.map(item => {
    const isSelected = selected[activeCategory].some(product => product.name === item.name);
    const identity = getIdentity(item);
    const specs = renderSpecifications(item);
    return `<article class="product-card ${isSelected ? 'is-selected' : ''}">
      <div class="product-image-wrap"><img src="${item.image}" alt="${item.name}" loading="lazy"></div>
      <div class="product-card-body"><span class="product-brand">Brand: ${identity.brand}</span><h3>Model: ${identity.model}</h3><div class="product-specs">${specs}</div>
      <button type="button" class="select-button" data-category="${activeCategory}" data-name="${item.name}" ${isSelected ? 'disabled' : ''}>${isSelected ? 'Added to Build' : 'Add to Build'}</button></div>
    </article>`;
  }).join('');
}

function loadCategory(category) {
  activeCategory = category;
  categoryTitle.textContent = categoryLabels[category];
  document.querySelectorAll('.category-button').forEach(button => {
    button.classList.toggle('active', button.dataset.category === category);
  });
  renderProducts();
}

function renderItemDetails(item) {
  const specs = renderSpecifications(item, false);
  return specs ? `<div class="build-specs">${specs}</div>` : '';
}

function updateBuildCart() {
  const items = Object.entries(selected).flatMap(([category, categoryItems]) => categoryItems.map(item => ({ category, item })));
  document.getElementById('buildCount').textContent = items.length;
  document.getElementById('totalItems').textContent = items.reduce((total, entry) => total + entry.item.quantity, 0);
  buildList.innerHTML = items.length ? items.map(({ category, item }) => {
    const identity = getIdentity(item);
    return `<article class="build-item">
    <img src="${item.image}" alt="${identity.brand} ${identity.model}"><div class="item-details"><div class="item-topline"><div><span class="build-brand">${identity.brand}</span><h3>${identity.model}</h3></div><button type="button" class="remove-button" data-action="remove" data-category="${category}" data-name="${item.name}" aria-label="Remove ${identity.model}">×</button></div>
    ${renderItemDetails(item)}<div class="quantity-controls"><button type="button" data-action="decrease" data-category="${category}" data-name="${item.name}">−</button><span>Qty ${item.quantity}</span><button type="button" data-action="increase" data-category="${category}" data-name="${item.name}">+</button></div></div></article>`;
  }).join('') : '<p class="empty-cart">No components selected</p>';
}

function selectItem(category, name) {
  const item = products[category].find(product => product.name === name);
  if (item && !selected[category].some(product => product.name === name)) {
    selected[category].push({ ...item, quantity: 1 });
    updateBuildCart();
    renderProducts();
  }
}

function changeQuantity(category, name, amount) {
  const item = selected[category].find(product => product.name === name);
  if (!item) return;
  item.quantity += amount;
  if (item.quantity <= 0) selected[category] = selected[category].filter(product => product.name !== name);
  updateBuildCart();
  renderProducts();
}

function sendWhatsApp() {
  const items = Object.entries(selected).flatMap(([category, categoryItems]) => categoryItems.map(item => ({ category, item })));
  if (!items.length) {
    window.alert('Please select at least one component before sending your build.');
    return;
  }
  const message = ['MS Technology Gaming PC Order', '', ...items.map(({ category, item }) => {
    const identity = getIdentity(item);
    const specs = Object.entries(item.details || {}).filter(([label]) => !['Brand', 'Model'].includes(label)).map(([label, value]) => `${label}: ${value}`).join('\n');
    return `${categoryLabels[category]}\nBrand: ${identity.brand}\nModel: ${identity.model}\nVersion: ${item.version}\n${specs}\nQuantity: ${item.quantity}`;
  })].join('\n\n');
  window.location.href = `https://api.whatsapp.com/send/?phone=918880014003&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
}

document.getElementById('categoryList').addEventListener('click', event => {
  const button = event.target.closest('.category-button');
  if (button) loadCategory(button.dataset.category);
});
productContainer.addEventListener('click', event => {
  const button = event.target.closest('.select-button');
  if (button) selectItem(button.dataset.category, button.dataset.name);
});
buildList.addEventListener('click', event => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const { action, category, name } = button.dataset;
  if (action === 'remove') {
    selected[category] = selected[category].filter(item => item.name !== name);
    updateBuildCart();
    renderProducts();
  } else changeQuantity(category, name, action === 'increase' ? 1 : -1);
});
document.getElementById('whatsappBtn').addEventListener('click', sendWhatsApp);

loadProducts().then(loadedProducts => {
  products = loadedProducts;
  selected = Object.fromEntries(Object.keys(products).map(category => [category, []]));
  loadCategory(activeCategory);
}).catch(error => {
  document.getElementById('emptyState').hidden = false;
  document.getElementById('emptyState').textContent = 'Products are temporarily unavailable.';
  console.error(error);
});
