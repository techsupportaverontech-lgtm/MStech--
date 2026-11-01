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
  const response = await fetch('./data/products.json');
  if (!response.ok) throw new Error(`Unable to load products: ${response.status}`);
  const products = await response.json();
  Object.entries(products).forEach(([category, items]) => {
    items.forEach(item => {
      item.image = categoryImages[category] || item.image;
    });
  });
  return products;
}
