// ========= CONFIG =========
const WHATSAPP_PHONE = '5521992497289';

// ========= ESTADO =========
const priority = [
    'quero combo',
    'quero combo artesanal'

];

let categoriesToShow = (state.category === 'Todos')
    ? unique(PRODUCTS.map(p => p.category))
    : [state.category];

// Ordena colocando prioritárias primeiro
categoriesToShow = [
    ...priority.filter(c => categoriesToShow.includes(c)),
    ...categoriesToShow.filter(c => !priority.includes(c))
];

// ========= UTILITÁRIOS =========
const formatBRL = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const unique = (arr) => [...new Set(arr)];
const normalizeDigits = (s) => String(s || '').replace(/\D+/g, '');
const isMobile = () => window.matchMedia('(max-width: 960px)').matches;

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

    subtotalVal: document.getElementById('subtotalVal'),
    shippingVal: document.getElementById('shippingVal'),
    distanceVal: document.getElementById('distanceVal'),
    calcShippingBtn: document.getElementById('calcShippingBtn'),

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

    customerName: document.getElementById('customerName'),
    customerPhone: document.getElementById('customerPhone'),
    customerAddress: document.getElementById('customerAddress'),
    paymentMethod: document.getElementById('paymentMethod'),
    noteText: document.getElementById('noteText')
};

// ========= CUSTOM UI STATE =========
const customUI = { open: false, product: null, qty: 1, drinkId: null, addonIds: new Set() };

// ========= CATEGORIAS QUE ABREM ADICIONAIS =========
const CUSTOM_CATEGORIES = [
    'quero combo',
    'quero combo artesanal',
    'quero hamburguer',
    'quero hamburguer artesanal',
    'quero bebida',
    'quero batata'
];

// ========= CATEGORIAS =========
function renderCategories() {
    const cats = ['Todos', ...unique(PRODUCTS.map(p => p.category))];
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

// ========= CARD DE PRODUTO =========
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
          <button type="button" class="minus">−</button>
          <input type="number" min="1" value="1" readonly>
          <button type="button" class="plus">+</button>
        </div>
      </div>
    </div>
  `;

    const input = card.querySelector('input');
    const minus = card.querySelector('.minus');
    const plus = card.querySelector('.plus');

    const stop = (e) => e.stopPropagation();

    minus.onclick = (e) => {
        stop(e);
        const v = parseInt(input.value) || 1;
        if (v > 1) input.value = v - 1;
    };

    plus.onclick = (e) => {
        stop(e);
        input.value = (parseInt(input.value) || 1) + 1;
    };

    input.onclick = stop;

    function doAdd() {
        const q = parseInt(input.value) || 1;
        const category = String(p.category || '').toLowerCase();

        const needsCustomizer = CUSTOM_CATEGORIES.some(c =>
            category.includes(c)
        );

        if (needsCustomizer) {
            openCustomizer(p, q);
        } else {
            addToCart(p, q);
            showToast(`${q}x ${p.name} adicionado!`);
            if (isMobile()) setCartOpen(true);
        }
    }

    card.onclick = doAdd;

    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            doAdd();
        }
    });

    return card;
}

// ========= PRODUTOS =========
function renderProducts() {
    dom.productGrid.innerHTML = '';
    const q = (state.q || '').toLowerCase();

    const filtered = PRODUCTS.filter(p => {
        const matchCat = state.category === 'Todos' || p.category === state.category;
        const matchSearch = !q || `${p.name} ${p.desc} ${p.category}`.toLowerCase().includes(q);
        return matchCat && matchSearch;
    });

    const categoriesToShow = state.category === 'Todos'
        ? unique(PRODUCTS.map(p => p.category))
        : [state.category];

    categoriesToShow.forEach(cat => {
        const items = filtered.filter(p => p.category === cat);
        if (!items.length) return;

        const title = document.createElement('div');
        title.className = 'sectionTitle';
        title.textContent = cat;
        dom.productGrid.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'grid';
        items.forEach(p => grid.appendChild(productCard(p)));
        dom.productGrid.appendChild(grid);
    });
}

// ========= CARRINHO =========
function addToCart(product, qty = 1) {
    const existing = state.cart.find(i => i.id === product.id);
    if (existing) existing.qty += qty;
    else state.cart.push({ ...product, qty });

    renderCart();
}

function renderCart() {
    dom.cartItems.innerHTML = '';

    state.cart.forEach(it => {
        const line = document.createElement('div');
        line.className = 'line';
        line.innerHTML = `
        <div>${it.qty}x ${it.name}</div>
        <div>${formatBRL(it.price * it.qty)}</div>
      `;
        dom.cartItems.appendChild(line);
    });

    const total = state.cart.reduce((s, i) => s + i.price * i.qty, 0);
    dom.totalDisplay.textContent = formatBRL(total);
}

// ========= MODAL =========
function openCustomizer(product, qty) {
    customUI.product = product;
    customUI.qty = qty;
    dom.customTitle.textContent = product.name;
    dom.customSub.textContent = `Base: ${formatBRL(product.price)}`;
    setCustomOpen(true);
}

function setCustomOpen(open) {
    customUI.open = open;
    dom.overlay.classList.toggle('show', open);
    dom.customModal.classList.toggle('open', open);
}

// ========= WHATSAPP =========
function buildWhatsAppText() {
    const lines = ['🧾 *PEDIDO - QUERO BURGUER*'];

    state.cart.forEach(i => {
        lines.push(`${i.qty}x ${i.name} — ${formatBRL(i.price * i.qty)}`);
    });

    const total = state.cart.reduce((s, i) => s + i.price * i.qty, 0);
    lines.push(`TOTAL: ${formatBRL(total)}`);

    return encodeURIComponent(lines.join('\n'));
}

dom.sendBtn.onclick = () => {
    if (!state.cart.length) return;
    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${buildWhatsAppText()}`;
    window.open(url, '_blank');
};

// ========= UI =========
function setCartOpen(open) {
    dom.cartBox.classList.toggle('open', open);
    if (isMobile()) dom.overlay.classList.toggle('show', open);
}

dom.fabCart.onclick = () => setCartOpen(true);
dom.toggleCartBtn.onclick = () => setCartOpen(false);

dom.searchInput.oninput = (e) => {
    state.q = e.target.value;
    renderProducts();
};

function showToast(msg) {
    console.log(msg);
}

// ========= INIT =========
function init() {
    renderCategories();
    renderProducts();
    renderCart();
}

init();



