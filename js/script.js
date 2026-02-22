// ========= CONFIG =========
const WHATSAPP_PHONE = '5521992497289';

// ========= ESTADO =========
const state = {
  category: 'Todos',
  cart: [],
  q: '',
  shipping: 0,
  distance: 0,
  addressCoords: null
};

// ========= UTILITÁRIOS =========
const formatBRL = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const unique = (arr) => [...new Set(arr)];
const normalizeDigits = (s) => String(s || '').replace(/\D+/g, '');
const isMobile = () => window.matchMedia('(max-width: 960px)').matches;

// ========= ORDEM DE CATEGORIAS (PRIORIDADE) =========
const PRIORITY_FIRST = [
  'Quero Combo',
  'Quero Artesanal'
];

const PRIORITY_LAST = [
  'Bebidas'
];

function sortCategoriesWithPriority(categories) {
  const set = [...new Set(categories)];
  const priority = PRIORITY_CATEGORIES.filter(c => set.includes(c));
  const rest = set.filter(c => !PRIORITY_CATEGORIES.includes(c));
  return [...priority, ...rest];
}

// ========= ELEMENTOS DOM =========
const dom = {
  cartBox: document.getElementById('cartBox'),
  cartItems: document.getElementById('cartItems'),
  overlay: document.getElementById('overlay'),
  fabCart: document.getElementById('fabCart'),
  toggleCartBtn: document.getElementById('toggleCartBtn'),
  sendBtn: document.getElementById('sendBtn'),
  clearBtn: document.getElementById('clearBtn'),
  cartBadge: document.getElementById('cartBadge'),
  searchInput: document.getElementById('searchInput'),
  totalDisplay: document.getElementById('total'),
  productGrid: document.getElementById('productGrid'),
  categoryChips: document.getElementById('categoryChips'),

  // Shipping
  subtotalVal: document.getElementById('subtotalVal'),
  shippingVal: document.getElementById('shippingVal'),
  distanceVal: document.getElementById('distanceVal'),
  calcShippingBtn: document.getElementById('calcShippingBtn'),

  // Modal
  customModal: document.getElementById('customModal'),
  customTitle: document.getElementById('customTitle'),
  customSub: document.getElementById('customSub'),
  drinkBox: document.getElementById('drinkOptions'),
  addonBox: document.getElementById('addonOptions'),
  itemNote: document.getElementById('itemNote'),
  customItemPrice: document.getElementById('customItemPrice'),
  customCloseBtn: document.getElementById('customCloseBtn'),
  customConfirmBtn: document.getElementById('customConfirmBtn'),
  modalProductImg: document.getElementById('modalProductImg'),
  modalProductName: document.getElementById('modalProductName'),
  modalProductDesc: document.getElementById('modalProductDesc'),

  // Checkout Fields
  customerName: document.getElementById('customerName'),
  customerPhone: document.getElementById('customerPhone'),
  customerAddress: document.getElementById('customerAddress'),
  paymentMethod: document.getElementById('paymentMethod'),
  noteText: document.getElementById('noteText')
};

// ========= CUSTOM UI STATE =========
const customUI = { open: false, product: null, qty: 1, drinkId: null, addonIds: new Set() };

// ========= CATEGORIAS QUE ABREM ADICIONAIS =========
// (Com seus dados atuais: Quero Combo e Quero Artesanal)
const CUSTOM_CATEGORIES = [
  'quero combo',
  'quero artesanal'
];

// ========= FUNÇÕES DE RENDERIZAÇÃO =========
function renderCategories() {
  const catsSorted = sortCategoriesWithPriority(PRODUCTS.map(p => p.category));
  const cats = ['Todos', ...catsSorted];

  dom.categoryChips.innerHTML = '';

  cats.forEach(cat => {
    const b = document.createElement('button');
    b.className = 'chip' + (state.category === cat ? ' active' : '');
    b.type = 'button';
    b.textContent = cat;

    b.onclick = () => {
      state.category = cat;
      renderCategories();
      renderProducts();
    };

    dom.categoryChips.appendChild(b);
  });
}

function productCard(p) {
  const card = document.createElement('article');
  card.className = 'card';
  card.tabIndex = 0;

  card.innerHTML = `
    <img class="thumb" src="${p.image}" alt="${p.name}" loading="lazy">
    <div class="pad">
      <h4 class="title">${p.name}</h4>
      <p class="desc">${p.desc || ''}</p>
      <div class="priceRow">
        <span class="price">${formatBRL(p.price)}</span>
        <div class="qty">
          <button type="button" class="minus" aria-label="Diminuir">−</button>
          <input type="number" min="1" value="1" aria-label="Quantidade" readonly/>
          <button type="button" class="plus" aria-label="Aumentar">+</button>
        </div>
      </div>
    </div>
  `;

  const input = card.querySelector('input');
  const minus = card.querySelector('.minus');
  const plus = card.querySelector('.plus');

  const stop = (e) => e.stopPropagation();

  minus.addEventListener('click', (e) => {
    stop(e);
    const v = parseInt(input.value, 10) || 1;
    if (v > 1) input.value = v - 1;
  });

  plus.addEventListener('click', (e) => {
    stop(e);
    input.value = (parseInt(input.value, 10) || 1) + 1;
  });

  input.addEventListener('click', stop);
  input.addEventListener('keydown', (e) => e.stopPropagation());

  function doAdd() {
    const q = parseInt(input.value, 10) || 1;
    const category = String(p.category || '').toLowerCase();

    const needsCustomizer = CUSTOM_CATEGORIES.some(c => category.includes(c));

    if (needsCustomizer) {
      openCustomizer(p, q);
    } else {
      addToCart(p, q);
      showToast(`${q}x ${p.name} adicionado!`);
      if (isMobile()) setCartOpen(true);
    }
  }

  card.addEventListener('click', doAdd);
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      doAdd();
    }
  });

  return card;
}

function renderProducts() {
  dom.productGrid.innerHTML = '';
  const q = (state.q || '').trim().toLowerCase();

  const filtered = PRODUCTS.filter(p => {
    const matchCat = state.category === 'Todos' || p.category === state.category;
    const matchSearch = !q || `${p.name} ${p.desc} ${p.category}`.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  let categoriesToShow = (state.category === 'Todos')
    ? unique(PRODUCTS.map(p => p.category))
    : [state.category];

  if (state.category === 'Todos') {
    categoriesToShow = sortCategoriesWithPriority(categoriesToShow);
  }

  let renderedAny = false;

  categoriesToShow.forEach(cat => {
    const items = filtered.filter(p => p.category === cat);
    if (!items.length) return;

    renderedAny = true;

    const title = document.createElement('div');
    title.className = 'sectionTitle';
    title.textContent = cat;
    dom.productGrid.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'grid';
    items.forEach(p => grid.appendChild(productCard(p)));
    dom.productGrid.appendChild(grid);
  });

  if (!renderedAny) {
    dom.productGrid.innerHTML = `
      <div style="padding: 40px; text-align: center; color: var(--text-muted);">
        <p>Nenhum item encontrado.</p>
      </div>
    `;
  }
}

// ========= CARRINHO =========
function addToCart(product, qty = 1, meta = null, uniqueId = null) {
  // Se tem meta (personalização), cria item único
  if (meta) {
    state.cart.push({
      id: uniqueId || `${product.id}_${Date.now()}`,
      baseId: product.id,
      name: product.name,
      price: product.price,
      qty,
      meta
    });
  } else {
    // Produto simples, agrupa
    const existing = state.cart.find(i => i.baseId === product.id && !i.meta);
    if (existing) {
      existing.qty += qty;
    } else {
      state.cart.push({
        id: product.id,
        baseId: product.id,
        name: product.name,
        price: product.price,
        qty
      });
    }
  }
  renderCart();
}

function removeFromCart(id) {
  state.cart = state.cart.filter(i => i.id !== id);
  renderCart();
}

function updateQty(id, delta) {
  const it = state.cart.find(i => i.id === id);
  if (!it) return;

  const newQty = it.qty + delta;
  if (newQty > 0) it.qty = newQty;

  renderCart();
}

function renderCart() {
  dom.cartItems.innerHTML = '';

  state.cart.forEach(it => {
    const line = document.createElement('div');
    line.className = 'line';
    line.innerHTML = `
      <div>
        <div class="name">${it.name}</div>
        <div class="unit">${formatBRL(it.price)}</div>
      </div>
      <div class="subtotal">${formatBRL(it.price * it.qty)}</div>
      <div class="line-actions">
        <button class="chip minus" type="button">−</button>
        <button class="chip" type="button" style="cursor:default; border-color:transparent">${it.qty}</button>
        <button class="chip plus" type="button">+</button>
        <button class="chip del" type="button" style="background:rgba(255,77,79,0.2);color:#ff4d4f;border-color:transparent">×</button>
      </div>
    `;

    line.querySelector('.minus').onclick = () => updateQty(it.id, -1);
    line.querySelector('.plus').onclick = () => updateQty(it.id, 1);
    line.querySelector('.del').onclick = () => removeFromCart(it.id);

    dom.cartItems.appendChild(line);
  });

  const subtotal = state.cart.reduce((s, i) => s + (i.price * i.qty), 0);
  const total = subtotal + (state.shipping || 0);

  if (dom.subtotalVal) dom.subtotalVal.textContent = formatBRL(subtotal);
  if (dom.totalDisplay) dom.totalDisplay.textContent = formatBRL(total);

  if (state.shipping > 0 && dom.shippingVal) {
    dom.shippingVal.textContent = formatBRL(state.shipping);
    dom.distanceVal.textContent = `(${state.distance.toFixed(1)}km)`;
  } else if (dom.shippingVal) {
    dom.shippingVal.textContent = '--';
    dom.distanceVal.textContent = '';
  }

  const hasItems = state.cart.length > 0;
  dom.sendBtn.disabled = !hasItems;
  dom.clearBtn.disabled = !hasItems;

  // Badge / FAB
  const totalQty = state.cart.reduce((s, i) => s + i.qty, 0);
  if (totalQty > 0) {
    dom.cartBadge.style.display = 'grid';
    dom.cartBadge.textContent = totalQty;
    dom.fabCart.classList.add('filled');
  } else {
    dom.cartBadge.style.display = 'none';
    dom.fabCart.classList.remove('filled');
  }
}

// ========= CÁLCULO DE FRETE (NOMINATIM / HAVERSINE) =========
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

async function fetchCoordinates(address) {
  try {
    const query = `${address}, ${SHIPPING.city}, Brasil`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
    const res = await fetch(url, { headers: { 'User-Agent': 'QueroBurguerApp/1.0' } });
    const data = await res.json();
    if (data && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
    }
    return null;
  } catch (error) {
    console.error("Erro ao buscar coordenadas", error);
    return null;
  }
}

if (dom.calcShippingBtn) {
  dom.calcShippingBtn.addEventListener('click', async () => {
    const address = dom.customerAddress.value.trim();
    if (!address || address.length < 5) {
      alert('Digite o endereço completo (Rua, Número, Bairro) para calcular.');
      return;
    }

    const originalText = dom.calcShippingBtn.textContent;
    dom.calcShippingBtn.textContent = '...';
    dom.calcShippingBtn.disabled = true;

    const coords = await fetchCoordinates(address);

    if (coords) {
      const d = getDistanceFromLatLonInKm(SHIPPING.storeLat, SHIPPING.storeLng, coords.lat, coords.lon);

      // margem de segurança 30%
      const safeDist = d * 1.3;
      state.distance = safeDist;

      let cost = SHIPPING.basePrice;
      if (safeDist > SHIPPING.baseKm) {
        const extraKm = safeDist - SHIPPING.baseKm;
        cost += extraKm * SHIPPING.pricePerKm;
      }

      cost = Math.ceil(cost * 100) / 100;

      state.shipping = cost;
      state.addressCoords = coords;

      renderCart();
      dom.calcShippingBtn.textContent = 'OK';
    } else {
      alert('Endereço não encontrado. Verifique se digitou corretamente (Rua, Número e Bairro).');
      state.shipping = 0;
      state.distance = 0;
      renderCart();
      dom.calcShippingBtn.textContent = 'Erro';
    }

    setTimeout(() => {
      dom.calcShippingBtn.disabled = false;
      dom.calcShippingBtn.textContent = originalText;
    }, 2000);
  });
}

// ========= MODAL (PERSONALIZAÇÃO) =========
function setCustomOpen(open) {
  customUI.open = open;

  if (open) {
    dom.overlay.classList.add('show');
    dom.customModal.classList.add('open');
    dom.customModal.setAttribute('aria-hidden', 'false');
  } else {
    dom.overlay.classList.remove('show');
    dom.customModal.classList.remove('open');
    dom.customModal.setAttribute('aria-hidden', 'true');

    setTimeout(() => {
      if (!customUI.open) {
        customUI.product = null;
        dom.itemNote.value = '';
        dom.drinkBox.innerHTML = '';
        dom.addonBox.innerHTML = '';
      }
    }, 200);
  }
}

function openCustomizer(product, qty) {
  customUI.product = product;
  customUI.qty = qty || 1;
  customUI.drinkId = null;
  customUI.addonIds = new Set();

  dom.customTitle.textContent = product.name;
  dom.customSub.textContent = `Base: ${formatBRL(product.price)}`;

  dom.modalProductImg.src = product.image || '';
  dom.modalProductName.textContent = product.name;
  dom.modalProductDesc.textContent = product.desc || '';

  renderOptionCards(dom.drinkBox, DRINK_OPTIONS, 'drink');
  renderOptionCards(dom.addonBox, ADDON_OPTIONS, 'addon');
  updateCustomPrice();

  setCustomOpen(true);
}

function renderOptionCards(container, options, type) {
  container.innerHTML = '';
  options.forEach(opt => {
    const card = document.createElement('div');
    card.className = 'optionCard';

    const isChecked = (type === 'drink')
      ? (customUI.drinkId === opt.id)
      : customUI.addonIds.has(opt.id);

    if (isChecked) card.classList.add('active');

    card.innerHTML = `
      <div style="display:flex; gap:10px; align-items:center;">
        <input type="${type === 'drink' ? 'radio' : 'checkbox'}"
               ${isChecked ? 'checked' : ''}
               style="pointer-events:none">
        <div>
          <div class="optionName">${opt.name}</div>
          <div class="modalHint">${type === 'drink' ? 'Bebida' : 'Adicional'}</div>
        </div>
      </div>
      <div class="optionPrice">+${formatBRL(opt.price)}</div>
    `;

    card.onclick = () => {
      if (type === 'drink') {
        customUI.drinkId = (customUI.drinkId === opt.id) ? null : opt.id;
      } else {
        if (customUI.addonIds.has(opt.id)) customUI.addonIds.delete(opt.id);
        else customUI.addonIds.add(opt.id);
      }
      renderOptionCards(container, options, type);
      updateCustomPrice();
    };

    container.appendChild(card);
  });
}

function updateCustomPrice() {
  if (!customUI.product) return;
  const base = customUI.product.price;

  let extras = 0;
  const drink = DRINK_OPTIONS.find(d => d.id === customUI.drinkId);
  if (drink) extras += drink.price;

  customUI.addonIds.forEach(id => {
    const add = ADDON_OPTIONS.find(a => a.id === id);
    if (add) extras += add.price;
  });

  const totalOne = base + extras;
  const totalAll = totalOne * customUI.qty;

  dom.customItemPrice.textContent = `${formatBRL(totalAll)} (x${customUI.qty})`;
}

dom.customConfirmBtn.onclick = () => {
  if (!customUI.product) return;

  const base = customUI.product.price;
  const drink = DRINK_OPTIONS.find(d => d.id === customUI.drinkId);

  const addons = [];
  customUI.addonIds.forEach(id => {
    const a = ADDON_OPTIONS.find(x => x.id === id);
    if (a) addons.push(a);
  });

  let extrasTotal = 0;
  if (drink) extrasTotal += drink.price;
  addons.forEach(a => extrasTotal += a.price);

  const finalUnitPrice = base + extrasTotal;

  const parts = [];
  if (drink) parts.push(`Bebida: ${drink.name}`);
  if (addons.length) parts.push(`Add: ${addons.map(a => a.name).join(', ')}`);

  const obs = dom.itemNote.value.trim();
  if (obs) parts.push(`Obs: ${obs}`);

  const displayName = parts.length
    ? `${customUI.product.name} (${parts.join(' • ')})`
    : customUI.product.name;

  const meta = {
    baseId: customUI.product.id,
    drink: drink ? { id: drink.id, name: drink.name, price: drink.price } : null,
    addons: addons.map(a => ({ id: a.id, name: a.name, price: a.price })),
    obs: obs
  };

  addToCart({
    id: customUI.product.id,
    name: displayName,
    price: finalUnitPrice
  }, customUI.qty, meta);

  setCustomOpen(false);
  if (isMobile()) setCartOpen(true);
};

dom.customCloseBtn.onclick = () => setCustomOpen(false);

dom.overlay.addEventListener('click', () => {
  if (customUI.open) setCustomOpen(false);
  if (isMobile() && dom.cartBox.classList.contains('open')) setCartOpen(false);
});

// ========= WHATSAPP & CHECKOUT =========
function getCustomerFields() {
  return {
    name: dom.customerName.value.trim() || 'Não informado',
    phone: normalizeDigits(dom.customerPhone.value) || 'Não informado',
    address: dom.customerAddress.value.trim() || 'Não informado',
    pay: dom.paymentMethod.value,
    obs: dom.noteText.value.trim() || 'Sem observação'
  };
}

function buildWhatsAppText() {
  const lines = [];
  lines.push('🧾 *PEDIDO - QUERO BURGUER*');
  lines.push('------------------------------');

  state.cart.forEach(i => {
    const totalItem = i.price * i.qty;
    lines.push(`• ${i.qty}x ${i.name}`);
    lines.push(`  Valor: ${formatBRL(totalItem)}`);
  });

  lines.push('------------------------------');

  const subtotal = state.cart.reduce((s, i) => s + (i.price * i.qty), 0);
  lines.push(`Subtotal: ${formatBRL(subtotal)}`);

  if (state.shipping > 0) {
    lines.push(`Entrega (${state.distance.toFixed(1)}km): ${formatBRL(state.shipping)}`);
    lines.push(`*TOTAL FINAL: ${formatBRL(subtotal + state.shipping)}*`);
  } else {
    lines.push(`*TOTAL: ${formatBRL(subtotal)}*`);
    lines.push(`(Frete não calculado ou a combinar)`);
  }

  const c = getCustomerFields();
  lines.push('');
  lines.push(`👤 *Cliente:* ${c.name}`);
  lines.push(`📱 *Tel:* ${c.phone}`);
  lines.push(`📍 *Endereço:* ${c.address}`);
  lines.push(`💳 *Pagamento:* ${c.pay}`);
  if (c.obs !== 'Sem observação') lines.push(`📝 *Obs Geral:* ${c.obs}`);

  return encodeURIComponent(lines.join('\n'));
}

dom.sendBtn.addEventListener('click', () => {
  if (state.cart.length === 0) return;

  if (!dom.customerName.value.trim()) {
    alert('Por favor, digite seu nome.');
    dom.customerName.focus();
    return;
  }

  if (state.shipping === 0 && dom.customerAddress.value.trim().length > 5) {
    if (!confirm('O frete não foi calculado. Deseja enviar assim mesmo (frete a combinar)?')) return;
  }

  const url = `https://wa.me/${WHATSAPP_PHONE}?text=${buildWhatsAppText()}`;
  window.open(url, '_blank');
});

dom.clearBtn.addEventListener('click', () => {
  if (confirm('Limpar o carrinho?')) {
    state.cart = [];
    state.shipping = 0;
    state.distance = 0;
    renderCart();
  }
});

// ========= UI EVENTS =========
function setCartOpen(open) {
  if (open) {
    dom.cartBox.classList.add('open');
    if (isMobile()) dom.overlay.classList.add('show');
  } else {
    dom.cartBox.classList.remove('open');
    dom.overlay.classList.remove('show');
  }
}

dom.fabCart.onclick = () => setCartOpen(true);
dom.toggleCartBtn.onclick = () => setCartOpen(false);

dom.searchInput.addEventListener('input', (e) => {
  state.q = e.target.value;
  renderProducts();
});

function showToast(msg) {
  console.log('Toast:', msg);
}

// ========= INIT =========
function init() {
  renderCategories();
  renderProducts();
  renderCart();

  document.querySelectorAll('form').forEach(f => f.onsubmit = (e) => e.preventDefault());
}

init();

