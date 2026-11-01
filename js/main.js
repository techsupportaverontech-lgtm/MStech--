// MS Technologies — Core JavaScript

// 1. Mobile Navigation
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isActive = menu.classList.toggle('active');
    toggle.classList.toggle('active', isActive);
    document.body.style.overflow = isActive ? 'hidden' : '';
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('active');
      toggle.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', (e) => {
    if (menu.classList.contains('active') && !menu.contains(e.target) && !toggle.contains(e.target)) {
      menu.classList.remove('active');
      toggle.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// 2. Sticky Header & Active Nav Links
function initStickyHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

// 3. Scroll Animations & Underline trigger
function initScrollAnimations() {
  const allTargets = document.querySelectorAll('.animate-on-scroll, .section-title');
  if (!allTargets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  allTargets.forEach((el) => observer.observe(el));
}

// 4. Products Database & Live Catalogue (Comprehensive Range: Budget to High-Efficiency Flagship)
const PRODUCTS_DATA = [
  // ─── LED/LCD Monitors & Displays (displays) ──────────────────────────────────
  { name: '19" HD LED Monitor', category: 'displays', price: 'Contact for price', desc: 'Compact energy-efficient 720p/900p display ideal for CCTV setups, office work, and billing counters.', tag: 'Popular', img: 'assets/led_monitor.jpg', brand: 'MS TECHNOLOGIES', specPills: '19 Inch • 60Hz • Anti-Glare • HDMI/VGA' },
  { name: '21.5" Full HD Frameless IPS Monitor', category: 'displays', price: 'Contact for price', desc: '1080p crystal clear IPS panel with ultra-thin bezels. Perfect for home study and multitasking.', tag: 'Popular', img: 'assets/led_monitor.jpg', brand: 'DELL / HP', specPills: '21.5 Inch • 1080p FHD • 75Hz • IPS' },
  { name: '24" FHD 100Hz IPS Eye-Care Monitor', category: 'displays', price: 'Contact for price', desc: 'Smooth 100Hz refresh rate with Low Blue Light and flicker-free technology for long work sessions.', tag: 'Best Seller', img: 'assets/led_monitor.jpg', brand: 'LG / ACER', specPills: '24 Inch • 100Hz • IPS • Eye-Care' },
  { name: '24" 165Hz 1ms IPS Esports Gaming Monitor', category: 'displays', price: 'Contact for price', desc: 'Ultra-fast 165Hz refresh rate with 1ms MPRT response time and AMD FreeSync Premium for competitive gaming.', tag: 'Gaming', img: 'assets/led_monitor.jpg', brand: 'GIGABYTE / MSI', specPills: '24 Inch • 165Hz • 1ms • FreeSync' },
  { name: '27" 2K QHD 180Hz Curved Gaming Monitor', category: 'displays', price: 'Contact for price', desc: '1500R curvature with 2560x1440 resolution, HDR10 support, and high color accuracy for immersive gaming.', tag: 'Gaming Peak', img: 'assets/led_monitor.jpg', brand: 'SAMSUNG / AOC', specPills: '27 Inch 2K • 180Hz • Curved • HDR10' },
  { name: '28" 4K UHD IPS Professional Monitor', category: 'displays', price: 'Contact for price', desc: '3840x2160 ultra-high resolution with 99% sRGB color gamut for CAD, video editing, and graphic design.', tag: 'Upgrade', img: 'assets/led_monitor.jpg', brand: 'BENQ / VIEWSONIC', specPills: '28 Inch 4K • 99% sRGB • HDR400 • DP' },
  { name: '34" Ultrawide WQHD 165Hz Curved Display', category: 'displays', price: 'Contact for price', desc: '21:9 cinematic ultrawide aspect ratio for huge timeline workflows, financial charts, and flight simulations.', tag: 'Gaming Peak', img: 'assets/led_monitor.jpg', brand: 'MSI / LG', specPills: '34 Inch Ultrawide • 165Hz • 21:9 • USB-C' },
  { name: '15.6" Full HD Portable USB-C Display', category: 'displays', price: 'Contact for price', desc: 'Slim lightweight second screen for laptop users and traveling professionals. Plug-and-play via Type-C.', tag: 'Retail', img: 'assets/led_monitor.jpg', brand: 'ASUS / ZEBRONICS', specPills: '15.6 Inch • 1080p • USB-C • Ultra-Slim' },
  { name: 'Laptop Screen Replacement Panel (FHD)', category: 'displays', price: 'Contact for price', desc: 'Original genuine slim LED IPS replacement screens for all Dell, HP, Lenovo, Asus, Acer, and Apple laptops.', tag: 'Service', img: 'assets/led_monitor.jpg', brand: 'GENUINE OEM', specPills: 'FHD IPS • 30/40 Pin • Anti-Glare • Fast Repair' },
  { name: 'Laptop 144Hz / 240Hz High Refresh Panel', category: 'displays', price: 'Contact for price', desc: 'High refresh rate replacement screen for gaming laptops (TUF, Legion, Predator, ROG, Nitro, Omen).', tag: 'Upgrade', img: 'assets/led_monitor.jpg', brand: 'GENUINE OEM', specPills: '144Hz / 240Hz • Gaming Panel • 100% sRGB' },
  { name: 'Laptop Top Panel, Bezel & Hinge Repair', category: 'displays', price: 'Contact for price', desc: 'Complete structural repair and replacement of cracked laptop lids, broken hinges, and front bezel frames.', tag: 'Repair', img: 'assets/led_monitor.jpg', brand: 'MS TECHNOLOGIES', specPills: 'Hinge Fix • Base Frame • Fast Turnaround' },

  // ─── Graphics Cards / GPU (gpu) ──────────────────────────────────────────────
  { name: 'GeForce GT 710 / GT 730 2GB DDR3', category: 'gpu', price: 'Contact for price', desc: 'Entry-level dedicated GPU for multi-monitor desktop display output, media playback, and office systems.', tag: 'Popular', img: 'assets/gaming_graphics_card.jpg', brand: 'ASUS / MSI', specPills: '2GB VRAM • HDMI/DVI/VGA • Low Profile' },
  { name: 'GeForce GT 1030 2GB GDDR5', category: 'gpu', price: 'Contact for price', desc: 'Affordable dedicated graphics card for smooth 1080p video streaming, light photo editing, and esports.', tag: 'Popular', img: 'assets/gaming_graphics_card.jpg', brand: 'GIGABYTE', specPills: '2GB GDDR5 • Silent • Low Power 30W' },
  { name: 'AMD Radeon RX 550 4GB GDDR5', category: 'gpu', price: 'Contact for price', desc: 'Budget 4GB graphics card supporting DirectX 12, FreeSync, and smooth everyday computing.', tag: 'Retail', img: 'assets/gaming_graphics_card.jpg', brand: 'SAPPHIRE / POWERCOLOR', specPills: '4GB GDDR5 • 128-bit • DirectX 12' },
  { name: 'GeForce GTX 1650 4GB GDDR6', category: 'gpu', price: 'Contact for price', desc: 'Turing architecture 1080p gaming GPU for popular titles like GTA V, Valorant, CS2, and Fortnite.', tag: 'Gaming', img: 'assets/gaming_graphics_card.jpg', brand: 'ZOOTAC / INNO3D', specPills: '4GB GDDR6 • 1080p Gaming • No 6-Pin Req' },
  { name: 'AMD Radeon RX 6600 8GB GDDR6', category: 'gpu', price: 'Contact for price', desc: 'Best value 1080p high/ultra gaming graphics card with 8GB VRAM and smart AMD FidelityFX FSR support.', tag: 'Best Seller', img: 'assets/gaming_graphics_card.jpg', brand: 'ASUS / ASROCK', specPills: '8GB GDDR6 • RDNA 2 • FSR 3.0 • High FPS' },
  { name: 'GeForce RTX 3050 6GB/8GB GDDR6', category: 'gpu', price: 'Contact for price', desc: 'Entry point into NVIDIA RTX Ray Tracing and DLSS AI rendering for modern PC titles.', tag: 'Gaming', img: 'assets/gaming_graphics_card.jpg', brand: 'GALAX / MSI', specPills: 'RTX Ray Tracing • DLSS 2 • 8GB VRAM' },
  { name: 'GeForce RTX 3060 12GB GDDR6', category: 'gpu', price: 'Contact for price', desc: 'Heavy 12GB VRAM capacity makes it the #1 choice for gaming, video rendering, Blender, and local AI LLMs.', tag: 'Best Seller', img: 'assets/gaming_graphics_card.jpg', brand: 'ZOOTAC / GIGABYTE', specPills: '12GB VRAM • 3584 CUDA • Ray Tracing' },
  { name: 'GeForce RTX 4060 8GB GDDR6', category: 'gpu', price: 'Contact for price', desc: 'Next-gen Ada Lovelace GPU with DLSS 3 Frame Generation and ultra-low power consumption.', tag: 'Gaming Peak', img: 'assets/gaming_graphics_card.jpg', brand: 'MSI / ASUS', specPills: 'DLSS 3 • Ada Lovelace • Low 115W TDP' },
  { name: 'AMD Radeon RX 7600 XT 16GB GDDR6', category: 'gpu', price: 'Contact for price', desc: 'Massive 16GB memory buffer for 1440p gaming with future-proof texture headroom and AV1 encoding.', tag: 'Upgrade', img: 'assets/gaming_graphics_card.jpg', brand: 'SAPPHIRE', specPills: '16GB VRAM • 1440p Ready • AV1 Encode' },
  { name: 'GeForce RTX 4070 Super 12GB GDDR6X', category: 'gpu', price: 'Contact for price', desc: 'High-end 1440p max settings and 4K gaming powerhouse. Exceptional CUDA acceleration for workstation apps.', tag: 'Gaming Peak', img: 'assets/gaming_graphics_card.jpg', brand: 'GIGABYTE / ZOOTAC', specPills: '12GB GDDR6X • DLSS 3.5 • 7168 CUDA' },
  { name: 'GeForce RTX 4080 Super 16GB GDDR6X', category: 'gpu', price: 'Contact for price', desc: 'Dominant 4K gaming and professional 3D rendering card. Uncompromising speed for VR and Unreal Engine 5.', tag: 'Gaming Peak', img: 'assets/gaming_graphics_card.jpg', brand: 'ASUS ROG / MSI', specPills: '16GB GDDR6X • 4K Ultra • Extreme Power' },
  { name: 'GeForce RTX 4090 24GB GDDR6X', category: 'gpu', price: 'Contact for price', desc: 'The ultimate flagship graphics processor in the world. 24GB VRAM for Deep Learning, AI training, and 8K.', tag: 'Gaming Peak', img: 'assets/gaming_graphics_card.jpg', brand: 'ASUS / GIGABYTE', specPills: '24GB VRAM • 16384 CUDA • Generative AI' },

  // ─── Processors / CPU (cpu) ──────────────────────────────────────────────────
  { name: 'Intel Core i3 10th / 12th Gen', category: 'cpu', price: 'Contact for price', desc: 'Reliable 4-core processor for everyday home, accounting (Tally), web browsing, and office productivity.', tag: 'Popular', img: 'assets/intel_processor_1784087456905.jpg', brand: 'INTEL', specPills: '4 Cores / 8 Threads • Up to 4.3GHz • LGA1700' },
  { name: 'AMD Ryzen 3 3200G with Radeon Vega', category: 'cpu', price: 'Contact for price', desc: 'Budget all-in-one APU with built-in Vega graphics. No separate graphics card needed for everyday work.', tag: 'Popular', img: 'assets/intel_processor_1784087456905.jpg', brand: 'AMD', specPills: '4 Cores • Radeon Vega GPU • AM4' },
  { name: 'Intel Core i5 12400F / 13400F', category: 'cpu', price: 'Contact for price', desc: 'Best selling mainstream gaming and multitasking CPU. Exceptional price-to-performance ratio.', tag: 'Best Seller', img: 'assets/intel_processor_1784087456905.jpg', brand: 'INTEL', specPills: '10 Cores / 16 Threads • 4.6GHz • PCIe 5.0' },
  { name: 'AMD Ryzen 5 5600X / 7600', category: 'cpu', price: 'Contact for price', desc: 'High-FPS 6-core processor loved by competitive esports players and modern mid-tier system builders.', tag: 'Best Seller', img: 'assets/intel_processor_1784087456905.jpg', brand: 'AMD', specPills: '6 Cores / 12 Threads • 5.1GHz • AM5 DDR5' },
  { name: 'Intel Core i7 13700 / 14700K', category: 'cpu', price: 'Contact for price', desc: '20-core beast for 4K video editing, heavy CAD/CAM simulation, streaming, and ultra-high-end gaming.', tag: 'Gaming Peak', img: 'assets/intel_processor_1784087456905.jpg', brand: 'INTEL', specPills: '20 Cores / 28 Threads • Up to 5.6GHz • Intel 7' },
  { name: 'AMD Ryzen 7 7800X3D (3D V-Cache)', category: 'cpu', price: 'Contact for price', desc: 'The world\'s undisputed #1 gaming processor with massive 96MB 3D V-Cache for maximum FPS in all titles.', tag: 'Gaming Peak', img: 'assets/intel_processor_1784087456905.jpg', brand: 'AMD', specPills: '8 Cores / 16 Threads • 96MB V-Cache • Top FPS' },
  { name: 'Intel Core i9 14900K 24-Core', category: 'cpu', price: 'Contact for price', desc: 'Intel\'s flagship enthusiast chip with 24 cores pushing boost clocks up to a blisteringly fast 6.0 GHz.', tag: 'Processor', img: 'assets/intel_processor_1784087456905.jpg', brand: 'INTEL', specPills: '24 Cores / 32 Threads • 6.0 GHz • Extreme' },
  { name: 'AMD Ryzen 9 7950X 16-Core / 32-Thread', category: 'cpu', price: 'Contact for price', desc: 'Heavy production CPU built for Blender, Maya, Premiere Pro rendering, compilation, and virtualization.', tag: 'Processor', img: 'assets/intel_processor_1784087456905.jpg', brand: 'AMD', specPills: '16 Cores / 32 Threads • 5.7GHz • 80MB Cache' },

  // ─── RAM & Storage (storage) ─────────────────────────────────────────────────
  { name: '4GB / 8GB DDR3 1600MHz RAM', category: 'storage', price: 'Contact for price', desc: 'Revive older laptops and desktop motherboards with genuine low-voltage DDR3 / DDR3L memory sticks.', tag: 'Upgrade', img: 'assets/ddr4_ram_modules.jpg', brand: 'CRUCIAL / KINGSTON', specPills: 'DDR3L 1600MHz • 1.35V • Laptop & Desktop' },
  { name: '8GB DDR4 3200MHz Value RAM', category: 'storage', price: 'Contact for price', desc: 'High-speed standard DDR4 module for snappy multitasking, office applications, and smooth browsing.', tag: 'Popular', img: 'assets/ddr4_ram_modules.jpg', brand: 'CORSAIR / ADATA', specPills: 'DDR4 3200MHz • CL22 • High Stability' },
  { name: '16GB (2x8GB) DDR4 3200/3600MHz RGB RAM', category: 'storage', price: 'Contact for price', desc: 'Dual-channel RGB gaming memory kit with aluminum heatsink and Intel XMP 2.0 automatic overclocking.', tag: 'Best Seller', img: 'assets/ddr4_ram_modules.jpg', brand: 'G.SKILL / CORSAIR', specPills: '16GB Dual Channel • 3600MHz • ARGB' },
  { name: '32GB (2x16GB) DDR4 3600MHz Pro Kit', category: 'storage', price: 'Contact for price', desc: 'Large memory buffer for video editors, 3D artists, heavy IDEs, and modern AAA title gaming rigs.', tag: 'Upgrade', img: 'assets/ddr4_ram_modules.jpg', brand: 'CORSAIR VENGEANCE', specPills: '32GB Kit • 3600MHz • Low Latency' },
  { name: '16GB / 32GB DDR5 6000MHz RGB Memory', category: 'storage', price: 'Contact for price', desc: 'Next-generation ultra-fast DDR5 bandwidth supporting latest Intel 14th Gen and AMD AM5 platforms.', tag: 'Gaming Peak', img: 'assets/ddr4_ram_modules.jpg', brand: 'KINGSTON FURY', specPills: 'DDR5 6000MHz • Intel XMP & AMD EXPO' },
  { name: '64GB (2x32GB) DDR5 6000MHz Workstation Kit', category: 'storage', price: 'Contact for price', desc: 'Massive capacity high-frequency memory for 8K video timelines, VM servers, and AI datasets.', tag: 'Upgrade', img: 'assets/ddr4_ram_modules.jpg', brand: 'G.SKILL TRIDENT Z5', specPills: '64GB DDR5 • 6000MHz CL30 • Workstation' },
  { name: '256GB / 512GB 2.5" SATA III SSD', category: 'storage', price: 'Contact for price', desc: 'Instantly speed up slow laptops and desktops by 5X over standard spinning hard drives. Free OS cloning.', tag: 'Best Seller', img: 'assets/internal_ssd_drive.jpg', brand: 'CRUCIAL / WD GREEN', specPills: '540 MB/s Read • SATA III • 3-Yr Warranty' },
  { name: '1TB 2.5" SATA III Internal SSD', category: 'storage', price: 'Contact for price', desc: 'High-capacity solid state drive for large game libraries, photo archives, and smooth system bootup.', tag: 'Storage', img: 'assets/internal_ssd_drive.jpg', brand: 'SAMSUNG 870 EVO', specPills: '1TB Capacity • 560 MB/s • 5-Yr Warranty' },
  { name: '500GB NVMe M.2 PCIe Gen 3/4 SSD', category: 'storage', price: 'Contact for price', desc: 'Compact motherboard M.2 slot drive delivering up to 3500 MB/s read speed. Boots Windows in 6 seconds.', tag: 'Popular', img: 'assets/internal_ssd_drive.jpg', brand: 'WD BLUE / KINGSTON', specPills: 'NVMe M.2 • 3500 MB/s • PCIe Gen4' },
  { name: '1TB NVMe M.2 PCIe 4.0 High-Speed SSD', category: 'storage', price: 'Contact for price', desc: 'Blazing fast Gen4x4 drive reaching 7,000+ MB/s. Zero loading screen delays in latest PC and PS5 games.', tag: 'Best Seller', img: 'assets/internal_ssd_drive.jpg', brand: 'SAMSUNG 980 PRO / WD BLACK', specPills: '7400 MB/s Read • PCIe 4.0 • DRAM Cache' },
  { name: '2TB NVMe M.2 PCIe 4.0 Pro SSD', category: 'storage', price: 'Contact for price', desc: 'Pro creator and high-tier gaming SSD with aluminum heatsink for sustained cool transfer speeds.', tag: 'Upgrade', img: 'assets/internal_ssd_drive.jpg', brand: 'SAMSUNG 990 PRO', specPills: '2TB NVMe • 7450 MB/s • Heatsink Included' },
  { name: '1TB / 2TB External Portable Hard Drive', category: 'storage', price: 'Contact for price', desc: 'Shock-resistant USB 3.0 portable drive for backing up family photos, documents, and business accounts.', tag: 'Storage', img: 'assets/internal_ssd_drive.jpg', brand: 'SEAGATE / WD MY PASSPORT', specPills: 'USB 3.2 Gen 1 • Plug & Play • Auto Backup' },
  { name: '1TB Portable High-Speed External SSD', category: 'storage', price: 'Contact for price', desc: 'Pocket-sized rugged external SSD with speeds up to 1050 MB/s. Transfer 50GB 4K videos in seconds.', tag: 'Best Seller', img: 'assets/internal_ssd_drive.jpg', brand: 'SAMSUNG T7 / SAN-DISK', specPills: '1050 MB/s • USB-C • Shockproof • Drop-Safe' },

  // ─── Parts, Peripherals & Services (parts) ───────────────────────────────────
  { name: 'Tempered Glass RGB Gaming Cabinet', category: 'parts', price: 'Contact for price', desc: 'Mid-tower ATX case with mesh front panel, 4 pre-installed ARGB fans, and clear side glass display.', tag: 'Gaming', img: 'assets/gaming_cpu_cabinet_1784087519325.jpg', brand: 'ANT ESPORTS / CORSAIR', specPills: '4x ARGB Fans • Mesh Front • Tempered Glass' },
  { name: 'Dual-Chamber Panoramic Glass Cabinet', category: 'parts', price: 'Contact for price', desc: 'Showcase-style aquarium PC case with 270-degree seamless tempered glass view for premium builds.', tag: 'Gaming Peak', img: 'assets/gaming_cpu_cabinet_1784087519325.jpg', brand: 'LIAN LI / NZXT', specPills: 'Panoramic Glass • Dual Chamber • Type-C Front' },
  { name: '4-Heatpipe High-Performance Tower Air Cooler', category: 'parts', price: 'Contact for price', desc: 'Direct-contact copper heatpipes with PWM silent fan keeping Core i5 / Ryzen 5 CPUs cool under load.', tag: 'Popular', img: 'assets/gaming_cpu_cabinet_1784087519325.jpg', brand: 'DEEPCOOL AK400', specPills: '4 Direct Heatpipes • 120mm PWM • 220W TDP' },
  { name: '240mm ARGB AIO Liquid CPU Cooler', category: 'parts', price: 'Contact for price', desc: 'Dual-fan liquid cooler with mirror pump cap and addressable RGB synchronization for overclocked CPUs.', tag: 'Gaming', img: 'assets/gaming_cpu_cabinet_1784087519325.jpg', brand: 'COOLER MASTER / CORSAIR', specPills: '240mm Radiator • Dual ARGB • Silent Pump' },
  { name: '360mm High-Performance Liquid Cooler', category: 'parts', price: 'Contact for price', desc: 'Triple 120mm fan flagship cooler for Intel Core i9 / Ryzen 9 chips during continuous heavy rendering.', tag: 'Gaming Peak', img: 'assets/gaming_cpu_cabinet_1784087519325.jpg', brand: 'NZXT KRAKEN / DEEPCOOL', specPills: '360mm Radiator • Triple PWM • LCD/ARGB Pump' },
  { name: '450W / 550W 80 Plus Bronze Power Supply', category: 'parts', price: 'Contact for price', desc: 'Certified efficient power supply unit with active PFC and full circuit protections for home and budget PCs.', tag: 'Parts', img: 'assets/gaming_cpu_cabinet_1784087519325.jpg', brand: 'CORSAIR / ANT ESPORTS', specPills: '80+ Bronze • Flat Cables • 5-Yr Warranty' },
  { name: '650W / 750W 80 Plus Gold Modular SMPS', category: 'parts', price: 'Contact for price', desc: 'High-efficiency Japanese capacitor power unit ready for RTX 4070 series graphics cards and fast CPUs.', tag: 'Best Seller', img: 'assets/gaming_cpu_cabinet_1784087519325.jpg', brand: 'CORSAIR RM / DEEPCOOL', specPills: '80+ Gold • Fully Modular • Japanese Caps' },
  { name: '850W / 1000W ATX 3.0 PCIe 5.0 SMPS', category: 'parts', price: 'Contact for price', desc: 'Native 12VHPWR 16-pin connector PSU engineered to handle power spikes of RTX 4080 / 4090 GPUs.', tag: 'Gaming Peak', img: 'assets/gaming_cpu_cabinet_1784087519325.jpg', brand: 'CORSAIR / MSI MAG', specPills: 'ATX 3.0 • PCIe 5.0 12VHPWR • 10-Yr Warranty' },
  { name: 'Wireless Keyboard & Optical Mouse Combo', category: 'parts', price: 'Contact for price', desc: 'Ergonomic 2.4GHz wireless combo with spill-resistant design and long 18-month battery life.', tag: 'Peripherals', img: 'assets/premium_keyboard_1784087472590.jpg', brand: 'LOGITECH / DELL', specPills: '2.4GHz Wireless • Whisper Quiet • Long Battery' },
  { name: 'Mechanical RGB Gaming Keyboard', category: 'parts', price: 'Contact for price', desc: 'Hot-swappable mechanical switches (Blue/Red), per-key RGB backlighting, and solid aluminum top plate.', tag: 'Gaming', img: 'assets/premium_keyboard_1784087472590.jpg', brand: 'RED-RAGON / COSMIC BYTE', specPills: 'Mechanical Switches • Anti-Ghosting • RGB' },
  { name: 'Precision Gaming Mouse with RGB', category: 'parts', price: 'Contact for price', desc: 'Lightweight ergonomic gaming mouse with high-precision optical sensor up to 12,000 DPI and braided cord.', tag: 'Gaming', img: 'assets/premium_keyboard_1784087472590.jpg', brand: 'RAZER / LOGITECH G', specPills: '12000 DPI • 6 Programmable Buttons • RGB' },
  { name: '2.0 Stereo Multimedia Speakers', category: 'parts', price: 'Contact for price', desc: 'Clear audio stereo speakers with 3.5mm AUX jack and USB power input for desktop or laptop sound.', tag: 'Parts', img: 'assets/laptop_speakers_1784087445407.jpg', brand: 'LOGITECH / CREATIVE', specPills: 'USB Powered • 3.5mm Audio • Volume Knob' },
  { name: '7.1 Surround Sound RGB Gaming Headset', category: 'parts', price: 'Contact for price', desc: 'Over-ear memory foam cushions with spatial audio positioning and flexible noise-cancelling boom mic.', tag: 'Gaming', img: 'assets/laptop_speakers_1784087445407.jpg', brand: 'HYPER-X / REDRAGON', specPills: '7.1 Surround • Noise-Cancelling Mic • USB/3.5mm' },
  { name: 'USB Studio Condenser Microphone', category: 'parts', price: 'Contact for price', desc: 'Cardioid pickup condenser mic with desktop stand and pop filter for podcasts, streaming, and Zoom calls.', tag: 'Peripherals', img: 'assets/laptop_speakers_1784087445407.jpg', brand: 'FIFINE / MAONO', specPills: 'Cardioid Pickup • One-Touch Mute • Gain Knob' },
  { name: 'Full HD 1080p 60FPS Streaming Webcam', category: 'parts', price: 'Contact for price', desc: 'Sharp auto-focus glass lens with dual stereo noise-reduction mics and privacy shutter for online calls.', tag: 'Peripherals', img: 'assets/hikvision_cctv_1784087486609.jpg', brand: 'LOGITECH / LENOVO', specPills: '1080p 60FPS • Auto Focus • Privacy Shutter' },
  { name: 'Dual-Band Wi-Fi 6 + Bluetooth 5.2 PCIe Card', category: 'parts', price: 'Contact for price', desc: 'Internal desktop PCIe card with dual magnetic antennas delivering up to 2400 Mbps wireless speed.', tag: 'Upgrade', img: 'assets/internal_ssd_drive.jpg', brand: 'TP-LINK / INTEL AX200', specPills: 'Wi-Fi 6 (802.11ax) • Bluetooth 5.2 • 2400 Mbps' },
  { name: 'Genuine Laptop Battery Replacement', category: 'parts', price: 'Contact for price', desc: 'Original replacement batteries for Dell Inspiron/XPS, HP Pavilion/Omen, Lenovo ThinkPad, Asus, and Apple.', tag: 'Service', img: 'assets/laptop_battery_1784087506276.jpg', brand: 'OEM CERTIFIED', specPills: 'High Capacity • Safety Tested • 1-Yr Warranty' },
  { name: 'Laptop Replacement Keyboard (Internal)', category: 'parts', price: 'Contact for price', desc: 'Brand-new replacement keyboards with or without backlight for all laptop models and generations.', tag: 'Service', img: 'assets/premium_keyboard_1784087472590.jpg', brand: 'OEM CERTIFIED', specPills: 'Backlit Available • Exact Fit • Fast Fitting' },
  { name: 'Hikvision 4-Camera Smart 1080p CCTV Kit', category: 'parts', price: 'Contact for price', desc: 'Complete outdoor/indoor night vision camera set with 4CH DVR, 1TB surveillance drive, and mobile live view.', tag: 'Security', img: 'assets/hikvision_cctv_1784087486609.jpg', brand: 'HIKVISION', specPills: '4 Cameras • Night Vision • 1TB HDD • Mobile App' },
  { name: 'Hikvision 8-Channel 4MP Smart IP CCTV Kit', category: 'parts', price: 'Contact for price', desc: 'High-definition 4MP IP camera setup with 8CH PoE NVR, 2TB HDD, human motion detection, and cloud remote view.', tag: 'Security', img: 'assets/hikvision_cctv_1784087486609.jpg', brand: 'HIKVISION', specPills: '8x 4MP IP Cams • PoE NVR • Smart Motion • 2TB' },
  { name: '600VA / 1100VA Line-Interactive UPS', category: 'parts', price: 'Contact for price', desc: 'Emergency battery backup power with AVR voltage regulation to protect PC components during power cuts.', tag: 'Parts', img: 'assets/gaming_cpu_cabinet_1784087519325.jpg', brand: 'APC / MICROTEK', specPills: 'Battery Backup • Surge Protector • Auto AVR' }
];

function getCategoryIcon(cat) {
  switch (cat) {
    case 'displays':
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="2" y1="20" x2="22" y2="20"/><line x1="12" y1="17" x2="12" y2="20"/></svg>`;
    case 'gpu':
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="1" y1="20" x2="23" y2="20"/><line x1="1" y1="16" x2="23" y2="16"/><line x1="1" y1="12" x2="23" y2="12"/></svg>`;
    case 'cpu':
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="15" x2="23" y2="15"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="15" x2="4" y2="15"/></svg>`;
    case 'storage':
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>`;
    default:
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
  }
}

function getActiveProductsList() {
  return PRODUCTS_DATA;
}

function renderCatalogue(filterCategory = 'all', searchQuery = '') {
  const grid = document.getElementById('catalogGrid');
  if (!grid) return;

  grid.innerHTML = '';
  const query = searchQuery.toLowerCase().trim();
  const currentProducts = getActiveProductsList();

  const filtered = currentProducts.filter((p) => {
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    const matchesSearch = p.name.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query) || (p.specPills && p.specPills.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: var(--space-2xl); color: var(--text-muted);">No components found matching your search.</div>`;
    return;
  }

  filtered.forEach((p) => {
    const card = document.createElement('div');
    card.className = 'product-card';

    // Extract or read brand name
    let brand = p.brand ? p.brand.toUpperCase() : 'MS TECHNOLOGIES';

    // Rating score & review count
    const ratingVal = (p.rating !== null && p.rating !== undefined && p.rating !== '') ? parseFloat(p.rating).toFixed(1) : (4.4 + (p.name.length % 6) * 0.1).toFixed(1);
    const fullStars = Math.floor(parseFloat(ratingVal));
    const halfStar = parseFloat(ratingVal) - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    const starsHtml = '★'.repeat(fullStars) + (halfStar ? '★' : '') + '☆'.repeat(emptyStars);
    const reviewCount = (p.reviewCount !== null && p.reviewCount !== undefined && p.reviewCount !== '') ? p.reviewCount : (12 + (p.name.length % 35));

    // Spec pills
    let specPillsHtml = '';
    if (p.specPills) {
      const pills = Array.isArray(p.specPills) ? p.specPills : p.specPills.split(/[,|•]/);
      specPillsHtml = pills.map(s => `<span class="spec-pill">${s.trim()}</span>`).join('');
    } else {
      specPillsHtml = `<span class="spec-pill">${p.category.toUpperCase()}</span>`;
    }

    // Use-case badge
    const useCaseMap = { 'Popular': 'Everyday Pick', 'Gaming Peak': 'Pro Grade', 'Gaming': 'Gaming Ready', 'Service': 'Service & Replace', 'Retail': 'Office Ready', 'Upgrade': 'Performance Boost', 'Parts': 'Genuine Component', 'Processor': 'High Speed', 'Security': 'Smart Security', 'Best Seller': 'Best Seller', 'Peripherals': 'Ergonomic', 'Repair': 'Hardware Service', 'Storage': 'High Speed Data' };
    const useCaseBadge = p.tag ? (useCaseMap[p.tag] || p.tag) : 'Genuine Component';

    // Build image
    const imgHtml = p.img
      ? `<img src="${p.img}" alt="${p.name}" loading="lazy" decoding="async" onerror="this.style.display='none';this.parentElement.innerHTML='<div style=\\'width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:3rem;\\'>📦</div>';"/>
         <div class="img-dots-indicator"><span class="img-dot active"></span><span class="img-dot"></span><span class="img-dot"></span></div>`
      : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:3rem;">📦</div>`;

    card.innerHTML = `
      <div class="product-card-top-bar" style="justify-content: flex-end;">
        <span class="badge-certified-stamp" title="Genuine Component">✓ Verified</span>
      </div>
      <div class="product-card-img-wrap">
        ${imgHtml}
      </div>
      <div class="product-brand-name">${brand}</div>
      <h3>${p.name}</h3>
      <div class="product-rating-row">
        ${starsHtml} <span class="product-rating-count">(${reviewCount})</span>
      </div>
      <div class="product-specs-pills">
        ${specPillsHtml}
      </div>
      <span class="product-usecase-badge">${useCaseBadge}</span>
      <p style="font-size:0.83rem; color:var(--text-light); line-height:1.45; margin-top:8px;">${p.desc}</p>
    `;
    grid.appendChild(card);
  });
}

function initCatalogueFilter() {
  const searchInput = document.getElementById('catalogSearch');
  const tabs = document.querySelectorAll('.catalog-tab-btn');

  let currentCategory = 'all';
  let currentSearch = '';

  // Check URL params or hash for initial category (e.g. ?category=displays or #displays)
  const urlParams = new URLSearchParams(window.location.search);
  const paramCategory = urlParams.get('category') || (window.location.hash ? window.location.hash.replace('#', '') : '');
  
  if (paramCategory) {
    const matchingTab = Array.from(tabs).find(t => t.getAttribute('data-category') === paramCategory);
    if (matchingTab) {
      tabs.forEach(t => t.classList.remove('active'));
      matchingTab.classList.add('active');
      currentCategory = paramCategory;

      // Smooth scroll down to products section
      setTimeout(() => {
        const prodSec = document.getElementById('products');
        if (prodSec) {
          const headerOffset = document.getElementById('header')?.offsetHeight || 80;
          const elementPosition = prodSec.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }, 150);
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value;
      renderCatalogue(currentCategory, currentSearch);
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = tab.getAttribute('data-category');
      renderCatalogue(currentCategory, currentSearch);
    });
  });

  window.addEventListener('storage', (e) => {
    if (e.key === 'mst_products_data') {
      renderCatalogue(currentCategory, currentSearch);
    }
  });

  window.addEventListener('mst_products_updated', () => {
    renderCatalogue(currentCategory, currentSearch);
  });

  renderCatalogue(currentCategory, currentSearch);
}

// 5. Popular Times Chart (Replicating Wednesday Peak from image)
const POPULAR_TIMES_DATA = [
  { hour: '9 AM', busy: 15 },
  { hour: '10 AM', busy: 25 },
  { hour: '11 AM', busy: 40 },
  { hour: '12 PM', busy: 50 },
  { hour: '1 PM', busy: 45 },
  { hour: '2 PM', busy: 55 },
  { hour: '3 PM', busy: 70 },
  { hour: '4 PM', busy: 80 },
  { hour: '5 PM', busy: 98, highlight: true }, // "Wednesday 5 pm: Usually as busy as it gets"
  { hour: '6 PM', busy: 85 },
  { hour: '7 PM', busy: 65 },
  { hour: '8 PM', busy: 35 },
  { hour: '9 PM', busy: 5 }
];

function initPopularTimes() {
  const chart = document.getElementById('popularTimesChart');
  if (!chart) return;

  chart.innerHTML = '';
  POPULAR_TIMES_DATA.forEach((d) => {
    const wrapper = document.createElement('div');
    wrapper.className = `popular-times-bar-wrapper ${d.highlight ? 'active' : ''}`;
    wrapper.style.height = '100%';
    
    wrapper.innerHTML = `
      <div class="popular-times-tooltip">Wednesday ${d.hour}: ${d.highlight ? 'Peak busy' : d.busy + '% busy'}</div>
      <div class="popular-times-bar" style="height: ${d.busy}%;"></div>
    `;
    chart.appendChild(wrapper);
  });
}

// 6. Working Hours Open/Closed Detector
function initBusinessHours() {
  const openBadge = document.getElementById('openStatusBadge');
  if (!openBadge) return;

  const now = new Date();
  const day = now.getDay(); // 0 is Sunday
  const hour = now.getHours();

  // Highlight today's row in the table
  const row = document.querySelector(`.business-hours-table tr[data-day="${day}"]`);
  if (row) {
    row.classList.add('today-row');
  }

  // Detect open/closed state (Mon-Sat: 9 AM - 9 PM, Sunday: Closed)
  if (day === 0) {
    openBadge.textContent = 'Closed';
    openBadge.style.background = 'rgba(253,98,98,0.15)';
    openBadge.style.color = '#fd6262';
  } else if (hour >= 9 && hour < 21) {
    openBadge.textContent = 'Open Now';
    openBadge.style.background = 'rgba(46,204,113,0.15)';
    openBadge.style.color = '#2ecc71';
  } else {
    openBadge.textContent = 'Closed';
    openBadge.style.background = 'rgba(253,98,98,0.15)';
    openBadge.style.color = '#fd6262';
  }
}

// 7. Interactive Service Booking — WhatsApp redirect on submit
function initBookingForm() {
  const form = document.getElementById('onlineBookingForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = (document.getElementById('bookingName')?.value    || '').trim();
    const phone   = (document.getElementById('bookingPhone')?.value   || '').trim();
    const service = (document.getElementById('bookingService')?.value  || '').trim();
    const address = (document.getElementById('bookingAddress')?.value  || '').trim();
    const problem = (document.getElementById('bookingProblem')?.value  || '').trim();

    const message =
      `🔧 *New Service Request — MS Technologies*\n\n` +
      `👤 *Name:* ${name}\n` +
      `📞 *Phone:* ${phone}\n` +
      `🛠️ *Service:* ${service}\n` +
      `📍 *Address:* ${address}\n` +
      `📝 *Problem / Details:* ${problem}`;

    const waUrl = `https://wa.me/918880014003?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  });
}

// 8. 3D Tilt Card animations (Disabled to keep boxes upright without leaning)
function initCardTilt() {
  const cards = document.querySelectorAll('.glass-card, .product-card');
  cards.forEach((card) => {
    card.style.transform = '';
  });
}

// 9. Smooth Scroll adjustments
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#' || !targetId.startsWith('#')) return;
      const target = document.querySelector(targetId);
      if (!target) return;

      const headerOffset = document.getElementById('header')?.offsetHeight || 0;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    });
  });
}

// Bootstrap Initialization
function bootstrap() {
  // Clear preloader
  const splash = document.getElementById('splash-screen');
  if (splash) {
    if (sessionStorage.getItem('mst_visited') || sessionStorage.getItem('mst_nav_click') || window.location.hash) {
      splash.remove();
      document.body.style.overflow = '';
    } else {
      sessionStorage.setItem('mst_visited', '1');
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        splash.style.transition = 'opacity 0.6s ease';
        splash.style.opacity = '0';
        setTimeout(() => {
          document.body.style.overflow = '';
          splash.remove();
        }, 600);
      }, 1500);
    }
  }

  // Handle hash scroll on initial load (e.g. #reviews)
  if (window.location.hash) {
    setTimeout(() => {
      const target = document.querySelector(window.location.hash);
      if (target) {
        const headerOffset = document.getElementById('header')?.offsetHeight || 0;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }, 100);
  }

  // Set mouse track coordinates on html root for CSS spotlight
  window.addEventListener('mousemove', (e) => {
    document.documentElement.style.setProperty('--mouse-x', e.clientX + 'px');
    document.documentElement.style.setProperty('--mouse-y', e.clientY + 'px');
  });

  initMobileNav();
  initStickyHeader();
  initScrollAnimations();
  initCatalogueFilter();
  initPopularTimes();
  initBusinessHours();
  initBookingForm();
  initCardTilt();
  initSmoothScrolling();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
