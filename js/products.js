import productsData from '../data/products.json';

const categoryImages = {
  cpu: '',
  gpu: '',
  motherboard: '',
  ram: '',
  storage: '',
  psu: '',
  cooler: '',
  cabinet: '',
  monitor: '',
  keyboard: '',
  mouse: '',
  headset: ''
};

export async function loadProducts() {
  let products = productsData;
  try {
    const response = await fetch('./data/products.json');
    if (response.ok) {
      products = await response.json();
    }
  } catch (err) {
    console.warn('[Products] Fetch failed, using bundled data.', err);
  }

  const processed = JSON.parse(JSON.stringify(products));
  Object.entries(processed).forEach(([category, items]) => {
    if (Array.isArray(items)) {
      items.forEach(item => {
        item.image = categoryImages[category] || item.image;
      });
    }
  });
  return processed;
}
