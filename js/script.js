const WHATSAPP_PHONE = '5521992497289';

// ========= INTEGRAÇÃO COM SISTEMA DE ESTOQUE =========
async function loadConfigs() {
    try {
        const resCat = await fetch('http://localhost:3000/api/data/catalog');
        const dynamicCatalog = await resCat.json();
        if (Array.isArray(dynamicCatalog) && dynamicCatalog.length > 0) {
            PRODUCTS = dynamicCatalog;
            console.log('✅ Catálogo dinâmico carregado da API');
        }

        const resSet = await fetch('http://localhost:3000/api/data/settings');
        const settings = await resSet.json();
        if (settings && settings.businessName) {
            document.title = `${settings.businessName} – Cardápio Digital`;
            const h1 = document.querySelector('.brand h1');
            if (h1) h1.textContent = settings.businessName;
        }
    } catch (e) {
        console.error('Erro ao carregar dados da API:', e);
    }
}

// Inicializa configurações
loadConfigs().then(() => {
    // Re-renderiza quando a API responder para sobrescrever os dados padrao do data.js
    if (typeof renderCategories === 'function') renderCategories();
    if (typeof renderProducts === 'function') renderProducts();
});

// Listener temporizado para buscar alteracoes no cardapio (cada 30 seg)
setInterval(() => {
    loadConfigs().then(() => {
        if (typeof renderCategories === 'function') renderCategories();
        if (typeof renderProducts === 'function') renderProducts();
    });
}, 30000);

// ========= ESTADO =========
const state = {
    category: 'Os mais vendidos',
    cart: [],
    q: '',
    shipping: 0,
    distance: 0,
    addressCoords: null,
    cartStep: 1
};

// ========= UTILITÁRIOS =========
const formatBRL = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const unique = (arr) => [...new Set(arr)];
const normalizeDigits = (s) => String(s || '').replace(/\D+/g, '');
const isMobile = () => window.matchMedia('(max-width: 960px)').matches;
const slugify = (text) => text.toString().toLowerCase().trim()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');

const getEffectivePrice = (p) => {
    let price = p.promoPrice || p.price;
    if (STORE_CONFIG.globalDiscountPercentage > 0) {
        price = price * (1 - (STORE_CONFIG.globalDiscountPercentage / 100));
    }
    return price;
};

function isStoreOpen() {
    const h = new Date().getHours();
    const open = STORE_CONFIG.openingHour;
    const close = STORE_CONFIG.closingHour;

    // Lógica para horário atravessando a meia-noite (ex: 18h até 01h)
    if (close < open) {
        return h >= open || h < close;
    }
    return h >= open && h < close;
}

function updateStoreStatus() {
    const open = isStoreOpen();
    if (dom.storeStatus) {
        dom.storeStatus.className = 'status-badge ' + (open ? 'open' : 'closed');
        dom.storeStatus.textContent = open ? 'Aberto Agora' : 'Fechado';
    }
}

// ========= ELEMENTOS DOM =========
const getEl = (id) => {
    const el = document.getElementById(id);
    if (!el) console.error(`Elemento #${id} não encontrado no DOM!`);
    return el;
};

const dom = {
    get cartBox() { return getEl('cartBox'); },
    get cartItems() { return getEl('cartItems'); },
    get overlay() { return getEl('overlay'); },
    get sendBtn() { return getEl('sendBtn'); },
    get clearBtn() { return getEl('clearBtn'); },
    get searchInput() { return getEl('searchInput'); },
    get totalDisplay() { return getEl('total'); },
    get menuContainer() { return getEl('menuContainer'); },
    get categoryChips() { return getEl('categoryChips'); },

    // Shipping
    get subtotalVal() { return getEl('subtotalVal'); },
    get shippingVal() { return getEl('shippingVal'); },
    get distanceVal() { return getEl('distanceVal'); },
    get calcShippingBtn() { return getEl('calcShippingBtn'); },

    // Modal
    get customModal() { return getEl('customModal'); },
    get customTitle() { return getEl('customTitle'); },
    get customSub() { return getEl('customSub'); },
    get friesBox() { return getEl('friesOptions'); },
    get friesSection() { return document.getElementById('friesSection'); },
    get drinkBox() { return getEl('drinkOptions'); },
    get addonBox() { return getEl('addonOptions'); },
    get addonSection() { return document.getElementById('addonSection'); },
    get itemNote() { return getEl('itemNote'); },
    get customItemPrice() { return getEl('customItemPrice'); },
    get customCloseBtn() { return getEl('customCloseBtn'); },
    get customConfirmBtn() { return getEl('customConfirmBtn'); },
    get customAddMoreBtn() { return getEl('customAddMoreBtn'); },
    get modalProductImg() { return getEl('modalProductImg'); },
    get modalProductName() { return getEl('modalProductName'); },
    get modalProductDesc() { return getEl('modalProductDesc'); },

    // Checkout Fields
    get customerName() { return getEl('customerName'); },
    get customerPhone() { return getEl('customerPhone'); },
    get customerAddress() { return getEl('customerAddress'); },
    get paymentMethod() { return getEl('paymentMethod'); },
    get noteText() { return getEl('noteText'); },

    // New Optimizations
    get storeStatus() { return getEl('storeStatus'); },

    // Stepped Checkout
    get cartStep1() { return getEl('cartStep1'); },
    get cartStep2() { return getEl('cartStep2'); },
    get cartStep3() { return getEl('cartStep3'); },
    get nextToS2() { return getEl('nextToStep2'); },
    get nextToS3() { return getEl('nextToStep3'); },
    get backToS1() { return getEl('backToStep1'); },
    get backToS2() { return getEl('backToStep2'); },
    get shippingValTotal() { return getEl('shippingValTotal'); },
    get subtotalStep1() { return getEl('subtotalStep1'); },
    get fabCart() { return getEl('fabCart'); },
    get cartBadge() { return getEl('cartBadge'); },
    get toggleCartBtn() { return getEl('toggleCartBtn'); },

    // Pix & Upsell
    get pixCopySection() { return getEl('pixCopySection'); },
    get copyPixBtn() { return getEl('copyPixBtn'); },
    get pixKeyDisplay() { return getEl('pixKeyDisplay'); },
    get customStepBasic() { return getEl('customStepBasic'); },
    get upsellStep() { return getEl('upsellStep'); },
    get upsellTitle() { return getEl('upsellTitle'); },
    get upsellOptionGrid() { return getEl('upsellOptionGrid'); }
};

// ========= CUSTOM UI STATE =========
const customUI = {
    open: false,
    product: null,
    qty: 1,
    drinkId: null,
    friesId: null,
    addonIds: new Set(),
    isSpecialCombo: false,
    isRegularCombo: false,
    upsellPhase: 0, // 0: Basic, 1: Batata, 2: Bebida
    openCartAfter: false
};

// ========= FUNÇÕES DE RENDERIZAÇÃO =========

function renderCategories() {
    const cats = ['Os mais vendidos', ...unique(PRODUCTS.map(p => p.category))];
    dom.categoryChips.innerHTML = '';

    cats.forEach(cat => {
        const b = document.createElement('button');
        b.className = 'chip' + (state.category === cat ? ' active' : '');
        b.type = 'button';
        b.textContent = cat;
        b.dataset.cat = cat;
        b.onclick = () => {
            // Scroll para a seção
            const id = `section-${slugify(cat)}`;
            const el = document.getElementById(id);
            if (el) {
                const offset = 140; // Altura do header pegajoso
                const top = el.offsetTop - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
            state.category = cat;
            // No mobile, se clicar abre o resumo se houver itens?
            // if (isMobile() && state.cart.length > 0) setCartOpen(true); 
            updateActiveChip(cat);
        };
        dom.categoryChips.appendChild(b);
    });
}

function updateActiveChip(activeCat) {
    const chips = dom.categoryChips.querySelectorAll('.chip');
    chips.forEach(c => {
        c.classList.toggle('active', c.dataset.cat === activeCat);
    });
}

function initScrollSpy() {
    const observerOptions = {
        root: null,
        rootMargin: '-150px 0px -70% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cat = entry.target.dataset.category;
                state.category = cat;
                updateActiveChip(cat);
            }
        });
    }, observerOptions);

    // Observa todas as seções de menu
    const sections = document.querySelectorAll('.menu-section');
    sections.forEach(section => observer.observe(section));
}

function productCard(p) {
    const card = document.createElement('article');
    card.className = 'card';
    card.tabIndex = 0; // Acessibilidade

    const effectivePrice = getEffectivePrice(p);
    const hasDiscount = effectivePrice < p.price;

    card.innerHTML = `
    <img class="thumb" src="${p.image}" alt="${p.name}" loading="lazy">
    <div class="pad">
      <h4 class="title">${p.name}</h4>
      <p class="desc">${p.desc || ''}</p>
      <div class="priceRow">
        <div class="priceCol">
          ${hasDiscount ? `<span class="oldPrice">${formatBRL(p.price)}</span>` : ''}
          <span class="price">${formatBRL(effectivePrice)}</span>
        </div>
        <div class="qty">
          <button type="button" class="minus" aria-label="Diminuir">−</button>
          <input type="number" min="1" value="1" aria-label="Quantidade" readonly/>
          <button type="button" class="plus" aria="Aumentar">+</button>
        </div>
      </div>
    </div>
  `;

    const input = card.querySelector('input');
    const minus = card.querySelector('.minus');
    const plus = card.querySelector('.plus');

    // Impede propagação do clique para não abrir o modal/adicionar ao carrinho imediatamente
    const stop = (e) => e.stopPropagation();

    minus.addEventListener('click', (e) => {
        stop(e);
        const v = parseInt(input.value) || 1;
        if (v > 1) input.value = v - 1;
    });

    plus.addEventListener('click', (e) => {
        stop(e);
        input.value = (parseInt(input.value) || 1) + 1;
    });

    input.addEventListener('click', stop);
    input.addEventListener('keydown', (e) => e.stopPropagation());

    function doAdd() {
        const q = parseInt(input.value) || 1;
        if ((p.category || '').toLowerCase().includes('lanches') || (p.category || '').toLowerCase().includes('combos')) {
            openCustomizer(p, q);
        } else {
            addToCart(p, q);
            showToast(`${q}x ${p.name} adicionado!`);
            if (isMobile()) setCartOpen(true);
        }
    }

    card.addEventListener('click', doAdd);

    // Acessibilidade: Enter ou Espaço
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            doAdd();
        }
    });

    return card;
}

function renderProducts() {
    if (!dom.menuContainer) return;
    dom.menuContainer.innerHTML = '';

    const allCats = ['Os mais vendidos', ...unique(PRODUCTS.map(p => p.category))];

    allCats.forEach(cat => {
        let items = [];
        if (cat === 'Os mais vendidos') {
            items = PRODUCTS.filter(p => p.featured);
        } else {
            items = PRODUCTS.filter(p => p.category === cat);
        }

        // Se houver busca ativa, filtra os itens
        if (state.q) {
            items = items.filter(p =>
                p.name.toLowerCase().includes(state.q.toLowerCase()) ||
                (p.desc || '').toLowerCase().includes(state.q.toLowerCase())
            );
        }

        if (items.length > 0) {
            items.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));

            const section = document.createElement('section');
            section.className = 'menu-section';
            section.id = `section-${slugify(cat)}`;
            section.dataset.category = cat;

            section.innerHTML = `
                <h2 class="sectionTitle">${cat === 'Os mais vendidos' ? '⭐ ' + cat : cat}</h2>
                <div class="grid"></div>
            `;

            const grid = section.querySelector('.grid');
            items.forEach(p => grid.appendChild(productCard(p)));

            dom.menuContainer.appendChild(section);
        }
    });

    if (dom.menuContainer.innerHTML === '') {
        dom.menuContainer.innerHTML = '<p style="text-align:center; padding:40px; color:var(--text-muted)">Nenhum produto encontrado...</p>';
    }

    // Reinicializa ScrollSpy se não houver busca (na busca o scroll pode ser confuso)
    if (!state.q) {
        initScrollSpy();
    }
}

// ========= CARRINHO =========

function addToCart(product, qty = 1, meta = null, uniqueId = null) {
    // Se tem meta (personalização), cria item único
    if (meta) {
        state.cart.push({
            id: uniqueId || `${product.id}_${Date.now()}`,
            baseId: product.id,
            name: product.name, // Nome já virá formatado do modal
            price: getEffectivePrice(product), // Preço unitário base com desconto
            qty,
            meta
        });
    } else {
        // Produto simples, agrupa
        const effectivePrice = getEffectivePrice(product);
        const existing = state.cart.find(i => i.baseId === product.id && !i.meta);
        if (existing) {
            existing.qty += qty;
        } else {
            state.cart.push({
                id: product.id, // ID simples pra produto sem extra
                baseId: product.id,
                name: product.name,
                price: effectivePrice,
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
    if (newQty > 0) {
        it.qty = newQty;
    } else {
        // Opcional: remover se chegar a 0?
        // removeFromCart(id);
    }
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
    if (dom.subtotalStep1) dom.subtotalStep1.textContent = formatBRL(subtotal);

    dom.shippingVal.textContent = state.shipping > 0 ? formatBRL(state.shipping) : (state.distance > 0 ? 'Frete Grátis' : '--');
    if (dom.shippingValTotal) dom.shippingValTotal.textContent = dom.shippingVal.textContent;
    dom.totalDisplay.textContent = formatBRL(subtotal + state.shipping);

    if (state.shipping > 0 && dom.shippingVal) {
        dom.shippingVal.textContent = formatBRL(state.shipping);
        dom.distanceVal.textContent = `(${state.distance.toFixed(1)}km)`;
    } else if (dom.shippingVal) {
        dom.shippingVal.textContent = '--';
        dom.distanceVal.textContent = '';
    }

    const hasItems = state.cart.length > 0;
    if (dom.sendBtn) dom.sendBtn.disabled = state.cart.length === 0 || !isStoreOpen();
    if (dom.clearBtn) dom.clearBtn.disabled = state.cart.length === 0;
    if (dom.nextToS2) dom.nextToS2.disabled = state.cart.length === 0;

    // Badge do FAB
    if (dom.cartBadge) {
        const totalQty = state.cart.reduce((s, i) => s + i.qty, 0);
        dom.cartBadge.textContent = totalQty;
        dom.cartBadge.style.display = totalQty > 0 ? 'grid' : 'none';

        if (dom.fabCart) {
            dom.fabCart.classList.toggle('filled', totalQty > 0);
        }
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
    const d = R * c;
    return d;
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
            alert('Endereço não encontrado. Verifique se digitou corretamento (Rua, Número e Bairro)');
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
        // Reset
        setTimeout(() => {
            if (!customUI.open) {
                customUI.product = null;
                customUI.openCartAfter = false;
                dom.itemNote.value = '';
                if (dom.friesBox) dom.friesBox.innerHTML = '';
                dom.drinkBox.innerHTML = '';
                dom.addonBox.innerHTML = '';
                customUI.isSpecialCombo = false;
                customUI.isRegularCombo = false;
                customUI.drinkId = null;
                customUI.friesId = null;
            }
        }, 200);
    }
}

function openCustomizer(product, qty = 1) {
    customUI.product = product;
    customUI.qty = qty;
    customUI.drinkId = null;

    customUI.isSpecialCombo = ['combocasal', 'combofamilia1', 'combofamilia2'].includes(product.id);
    customUI.isRegularCombo = ['comboburguer', 'comboxsalada', 'comboduplo', 'comboxtudo', 'combosmash'].includes(product.id);

    customUI.friesId = customUI.isSpecialCombo ? 'fries_turbinada_300' : (customUI.isRegularCombo ? 'fries_simples_140' : null);
    customUI.addonIds.clear();
    customUI.itemNote = "";
    customUI.upsellPhase = 0; // Começa no básico (personalização)

    // UI RESET
    dom.customStepBasic.style.display = 'block';
    dom.upsellStep.style.display = 'none';
    if (dom.customConfirmBtn) dom.customConfirmBtn.textContent = 'Finalizar';
    if (dom.customAddMoreBtn) dom.customAddMoreBtn.style.display = 'block';

    dom.modalProductImg.src = product.image;
    dom.modalProductName.textContent = product.name;
    dom.modalProductDesc.textContent = product.desc || '';
    dom.customTitle.textContent = product.name;

    let drinkOpts = [];
    if (customUI.isSpecialCombo) drinkOpts = COMBO_DRINK_OPTIONS;
    else if (customUI.isRegularCombo) drinkOpts = REGULAR_COMBO_DRINK_OPTIONS;
    else if ((product.category || '').toLowerCase().includes('lanches')) drinkOpts = DRINK_OPTIONS;

    if (customUI.isSpecialCombo || customUI.isRegularCombo) {
        if (dom.friesSection) dom.friesSection.style.display = 'block';
        let friesOpts = COMBO_FRIES_OPTIONS;
        if (product.id === 'combofamilia2') friesOpts = COMBO_FAMILIA4_FRIES_OPTIONS;
        else if (customUI.isRegularCombo) friesOpts = REGULAR_COMBO_FRIES_OPTIONS;

        // Ajuste no ID inicial caso seja Família 4
        if (product.id === 'combofamilia2') customUI.friesId = 'fries_turbinada_600_fam';

        renderOptionCards(dom.friesBox, friesOpts, 'fries');
    } else {
        if (dom.friesSection) dom.friesSection.style.display = 'none';
    }

    if (customUI.isSpecialCombo || product.category === 'Artesanais') {
        if (dom.addonSection) dom.addonSection.style.display = 'none';
    } else {
        if (dom.addonSection) dom.addonSection.style.display = 'block';
    }

    renderOptionCards(dom.drinkBox, drinkOpts, 'drink');
    renderOptionCards(dom.addonBox, ADDON_OPTIONS, 'addon');
    updateCustomPrice();

    const effectiveBase = getEffectivePrice(product);
    dom.customSub.textContent = `Base: ${formatBRL(effectiveBase)}`;

    setCustomOpen(true);
}

function renderOptionCards(container, options, type) {
    container.innerHTML = '';
    options.forEach(opt => {
        const card = document.createElement('div');
        card.className = 'optionCard';

        const isChecked = (type === 'drink')
            ? (customUI.drinkId === opt.id)
            : (type === 'fries')
                ? (customUI.friesId === opt.id)
                : customUI.addonIds.has(opt.id);

        if (isChecked) card.classList.add('active');

        card.innerHTML = `
        <div style="display:flex; gap:10px; align-items:center;">
            <input type="${(type === 'drink' || type === 'fries') ? 'radio' : 'checkbox'}" 
                ${isChecked ? 'checked' : ''} 
                style="pointer-events:none">
            <div>
            <div class="optionName">${opt.name}</div>
            <div class="modalHint">${type === 'drink' ? 'Bebida' : type === 'fries' ? 'Batata' : 'Adicional'}</div>
            </div>
        </div>
        <div class="optionPrice">+${formatBRL(opt.price)}</div>
        `;

        card.onclick = () => {
            if (type === 'drink') {
                customUI.drinkId = (customUI.drinkId === opt.id) ? null : opt.id;
            } else if (type === 'fries') {
                customUI.friesId = (customUI.friesId === opt.id) ? null : opt.id;
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
    const base = getEffectivePrice(customUI.product);

    let extras = 0;

    // Usa lista correta para pegar o preço
    let drinkList = DRINK_OPTIONS;
    if (customUI.isSpecialCombo) drinkList = COMBO_DRINK_OPTIONS;
    else if (customUI.isRegularCombo) drinkList = REGULAR_COMBO_DRINK_OPTIONS;

    const drink = drinkList.find(d => d.id === customUI.drinkId);

    if (drink) extras += drink.price;

    if (customUI.isSpecialCombo || customUI.isRegularCombo) {
        let friesOpts = COMBO_FRIES_OPTIONS;
        if (customUI.product.id === 'combofamilia2') friesOpts = COMBO_FAMILIA4_FRIES_OPTIONS;
        else if (customUI.isRegularCombo) friesOpts = REGULAR_COMBO_FRIES_OPTIONS;

        const fries = friesOpts.find(f => f.id === customUI.friesId);
        if (fries) extras += fries.price;
    }

    customUI.addonIds.forEach(id => {
        const add = ADDON_OPTIONS.find(a => a.id === id);
        if (add) extras += add.price;
    });

    const totalOne = base + extras;
    const totalAll = totalOne * customUI.qty;

    dom.customItemPrice.textContent = `${formatBRL(totalAll)} (x${customUI.qty})`;
}

function handleUpsell() {
    // Fase 1: Batata
    if (customUI.upsellPhase === 1) {
        dom.customStepBasic.style.display = 'none';
        dom.upsellStep.style.display = 'block';
        if (dom.customAddMoreBtn) dom.customAddMoreBtn.style.display = 'none';
        dom.upsellTitle.textContent = '🍟 Deseja adicionar uma Batata Frita 140g?';
        if (dom.customConfirmBtn) dom.customConfirmBtn.textContent = 'Pular Oferta';

        const potato = PRODUCTS.find(p => p.id === 'batatam'); // Corrigido ID para 140g
        renderUpsellOption(potato);
    }
    // Fase 2: Bebida
    else if (customUI.upsellPhase === 2) {
        dom.upsellTitle.textContent = '🥤 E uma Bebida gelada para acompanhar?';
        if (dom.customConfirmBtn) dom.customConfirmBtn.textContent = 'Finalizar Compra';

        const drink = PRODUCTS.find(p => p.id === 'guaramor');
        renderUpsellOption(drink);
    }
}

function renderUpsellOption(product) {
    dom.upsellOptionGrid.innerHTML = '';
    if (!product) {
        customUI.upsellPhase++;
        if (customUI.upsellPhase > 2) finishOrder();
        else handleUpsell();
        return;
    }

    const price = getEffectivePrice(product);
    const card = document.createElement('div');
    card.className = 'optionCard active'; // Reusando estilo de card de opção
    card.style.flexDirection = 'row';
    card.style.justifyContent = 'space-between';
    card.style.marginBottom = '12px';

    card.innerHTML = `
        <div style="display:flex; gap:12px; align-items:center">
            <img src="${product.image}" style="width:40px; height:40px; border-radius:4px; object-fit:cover">
            <div style="text-align:left">
                <div style="font-weight:700">${product.name}</div>
                <div style="font-size:12px; color:var(--primary)">+ ${formatBRL(price)}</div>
            </div>
        </div>
        <button class="chip active">Adicionar</button>
    `;

    const skipBtn = document.createElement('button');
    skipBtn.className = 'btn clear';
    skipBtn.style.width = '100%';
    skipBtn.textContent = 'Ainda não, obrigado';
    skipBtn.onclick = (e) => {
        e.stopPropagation();
        customUI.upsellPhase++;
        if (customUI.upsellPhase > 2) finishOrder();
        else handleUpsell();
    };

    card.onclick = () => {
        addToCart(product, 1);
        showToast(`${product.name} adicionado!`);
        customUI.upsellPhase++;
        if (customUI.upsellPhase > 2) finishOrder();
        else handleUpsell();
    };

    dom.upsellOptionGrid.appendChild(card);
    dom.upsellOptionGrid.appendChild(skipBtn);
}

function finishOrder() {
    const base = getEffectivePrice(customUI.product);

    let drinkList = DRINK_OPTIONS;
    if (customUI.isSpecialCombo) drinkList = COMBO_DRINK_OPTIONS;
    else if (customUI.isRegularCombo) drinkList = REGULAR_COMBO_DRINK_OPTIONS;

    const drink = drinkList.find(d => d.id === customUI.drinkId);

    let fries = null;
    if (customUI.isSpecialCombo || customUI.isRegularCombo) {
        let friesOpts = COMBO_FRIES_OPTIONS;
        if (customUI.product.id === 'combofamilia2') friesOpts = COMBO_FAMILIA4_FRIES_OPTIONS;
        else if (customUI.isRegularCombo) friesOpts = REGULAR_COMBO_FRIES_OPTIONS;

        fries = friesOpts.find(f => f.id === customUI.friesId);
    }

    const addons = ADDON_OPTIONS.filter(a => customUI.addonIds.has(a.id));

    let finalName = customUI.product.name;
    const parts = [];
    if (drink) parts.push(`Bebida: ${drink.name}`);
    if (fries) parts.push(`Batata: ${fries.name}`);
    if (addons.length > 0) parts.push(`Add: ${addons.map(a => a.name).join(', ')}`);
    const note = dom.itemNote.value.trim();
    if (note) parts.push(`Obs: ${note}`);

    if (parts.length > 0) {
        finalName += ` (${parts.join(' • ')})`;
    }

    const meta = {
        drink: drink ? drink.name : null,
        fries: fries ? fries.name : null,
        addons: addons.map(a => a.name),
        note: note
    };

    let totalUnit = base;
    if (drink) totalUnit += drink.price;
    if (fries) totalUnit += fries.price;
    addons.forEach(a => totalUnit += a.price);

    // Adiciona o item base customizado
    state.cart.push({
        id: `${customUI.product.id}_${Date.now()}`,
        baseId: customUI.product.id,
        name: finalName,
        price: totalUnit,
        qty: customUI.qty,
        meta: meta
    });

    renderCart();
    showToast(`${customUI.qty}x ${customUI.product.name} adicionado!`);
    setCustomOpen(false);
    if (customUI.openCartAfter) {
        if (isMobile()) setCartOpen(true);
        goToCartStep(2);
    }
}

// Função de confirmação do modal
function handleConfirm(openCart = false) {
    if (!customUI.product) return;
    customUI.openCartAfter = openCart;
    finishOrder();
}

function handleOverlayClick() {
    if (customUI.open) setCustomOpen(false);
    if (dom.cartBox && dom.cartBox.classList.contains('mobile-open')) setCartOpen(false);
}

// ========= WHATSAPP & CHECKOUT =========
function getCustomerFields() {
    return {
        name: dom.customerName ? (dom.customerName.value.trim() || 'Não informado') : 'Não informado',
        phone: dom.customerPhone ? (normalizeDigits(dom.customerPhone.value) || 'Não informado') : 'Não informado',
        address: dom.customerAddress ? (dom.customerAddress.value.trim() || 'Não informado') : 'Não informado',
        pay: dom.paymentMethod ? dom.paymentMethod.value : 'Pix',
        obs: dom.noteText ? (dom.noteText.value.trim() || 'Sem observação') : 'Sem observação'
    };
}

function buildWhatsAppText() {
    const lines = [];
    lines.push('🧾 *PEDIDO - QUERO BURGUER*');
    lines.push('------------------------------');

    state.cart.forEach(i => {
        lines.push(`• ${i.qty}x ${i.name}`);
        lines.push(`  Valor: ${formatBRL(i.price * i.qty)}`);
    });

    lines.push('------------------------------');

    const subtotal = state.cart.reduce((s, i) => s + (i.price * i.qty), 0);
    const shipping = state.shipping || 0;
    lines.push(`Subtotal: ${formatBRL(subtotal)}`);

    if (shipping > 0) {
        lines.push(`Entrega (${state.distance.toFixed(1)}km): ${formatBRL(shipping)}`);
    } else if (state.distance > 0) {
        lines.push(`Entrega: Grátis`);
    }

    lines.push(`*TOTAL FINAL: ${formatBRL(subtotal + shipping)}*`);

    const c = getCustomerFields();
    lines.push('');
    lines.push(`👤 *Cliente:* ${c.name}`);
    lines.push(`📱 *Tel:* ${c.phone}`);
    lines.push(`📍 *Endereço:* ${c.address}`);
    lines.push(`💳 *Pagamento:* ${c.pay}`);
    if (c.pay === 'Pix') lines.push(`_(Aguardando chave Pix do atendente)_`);
    if (c.obs !== 'Sem observação') lines.push(`📝 *Obs Geral:* ${c.obs}`);

    return encodeURIComponent(lines.join('\n'));
}

async function recordSaleLocally() {
    if (state.cart.length === 0) return;

    try {
        const payload = {
            items: state.cart.map(item => ({
                id: item.id,
                baseId: item.baseId, // Isto é o que o Backend lê para dar a baixa
                name: item.name,
                qty: item.qty,
                price: item.price
            }))
        };

        // Dispara pra API dando o sinal q a venda finalizou
        await fetch('http://localhost:3000/api/sales', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        console.log('Venda gravada para o Painel logístico!');
    } catch (e) {
        console.error('Erro ao gravar venda remotamente:', e);
    }
}

function handleCheckout() {
    if (state.cart.length === 0) return;
    if (!isStoreOpen()) {
        alert('Desculpe, a loja está fechada agora. Abrimos das 18:00 às 01:00.');
        return;
    }
    if (dom.customerName && !dom.customerName.value.trim()) {
        alert('Por favor, informe seu nome antes de finalizar.');
        goToCartStep(2);
        dom.customerName.focus();
        return;
    }

    // Grava a venda para o sistema de estoque (LocalStorage compartilhado)
    recordSaleLocally();

    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${buildWhatsAppText()}`;
    window.open(url, '_blank');
}

function handleClearCart() {
    if (confirm('Deseja limpar seu carrinho?')) {
        state.cart = [];
        state.shipping = 0;
        state.distance = 0;
        renderCart();
        goToCartStep(1);
    }
}

// ========= NAVEGAÇÃO CARRINHO =========
function goToCartStep(n) {
    if (n === 3) {
        // Validação estrita
        const name = dom.customerName ? dom.customerName.value.trim() : '';
        const phone = dom.customerPhone ? dom.customerPhone.value.trim() : '';
        const address = dom.customerAddress ? dom.customerAddress.value.trim() : '';

        if (!name) {
            alert('Por favor, informe seu Nome Completo.');
            dom.customerName.focus();
            return;
        }
        if (!phone) {
            alert('Por favor, informe seu número de WhatsApp para contato.');
            dom.customerPhone.focus();
            return;
        }
        if (!address || address.length < 5) {
            alert('Por favor, informe e calcule seu Endereço (Rua, Número, Bairro) antes de prosseguir.');
            dom.customerAddress.focus();
            return;
        }
        // Se ainda não calculou o frete (shippingVal default ou erro), pede para calcular
        if (state.shipping === 0 && state.distance === 0 && dom.shippingVal && !dom.shippingVal.textContent.includes('Grátis')) {
            if (dom.shippingVal.textContent.includes('Aguardando') || dom.shippingVal.textContent.includes('Erro')) {
                alert('Por favor, clique em "Calcular" no seu endereço antes de continuar.');
                dom.customerAddress.focus();
                return;
            }
        }
    }

    state.cartStep = n;
    [dom.cartStep1, dom.cartStep2, dom.cartStep3].forEach((el, i) => {
        if (el) el.classList.toggle('active', i === n - 1);
    });
}

function setCartOpen(open) {
    if (!dom.cartBox || !dom.overlay) return;
    if (open) {
        dom.cartBox.classList.add('open');
        dom.overlay.classList.add('show');
    } else {
        dom.cartBox.classList.remove('open');
        dom.overlay.classList.remove('show');
    }
}

function toggleCart() {
    const isOpen = dom.cartBox.classList.contains('open');
    setCartOpen(!isOpen);
}

// ========= INIT =========
function init() {
    try {
        updateStoreStatus();
        setInterval(updateStoreStatus, 60000);

        if (dom.searchInput) {
            dom.searchInput.oninput = (e) => {
                state.q = e.target.value;
                renderProducts();
            };
        }

        // Navigation Listeners
        const navMap = [
            { el: dom.nextToS2, step: 2 },
            { el: dom.nextToS3, step: 3 },
            { el: dom.backToS1, step: 1 },
            { el: dom.backToS2, step: 2 }
        ];
        navMap.forEach(nav => {
            if (nav.el) nav.el.onclick = () => goToCartStep(nav.step);
        });

        // PIX Key Copy
        if (dom.copyPixBtn && dom.pixKeyDisplay) {
            dom.copyPixBtn.onclick = () => {
                const key = dom.pixKeyDisplay.textContent;
                navigator.clipboard.writeText(key).then(() => {
                    if (dom.copyPixBtn) dom.copyPixBtn.textContent = 'Copiado!';
                    setTimeout(() => { if (dom.copyPixBtn) dom.copyPixBtn.textContent = 'Copiar'; }, 2000);
                });
            };
        }

        if (dom.paymentMethod && dom.pixCopySection) {
            dom.paymentMethod.onchange = (e) => {
                dom.pixCopySection.style.display = e.target.value === 'Pix' ? 'block' : 'none';
            };
        }

        // Main Actions
        if (dom.sendBtn) dom.sendBtn.onclick = handleCheckout;
        if (dom.clearBtn) dom.clearBtn.onclick = handleClearCart;
        if (dom.overlay) dom.overlay.onclick = handleOverlayClick;

        // Modal
        if (dom.customConfirmBtn) dom.customConfirmBtn.onclick = () => handleConfirm(true);
        if (dom.customAddMoreBtn) dom.customAddMoreBtn.onclick = () => handleConfirm(false);
        if (dom.customCloseBtn) dom.customCloseBtn.onclick = () => setCustomOpen(false);

        // Mobile Cart Toggle
        if (dom.fabCart) dom.fabCart.onclick = () => setCartOpen(true);
        if (dom.toggleCartBtn) dom.toggleCartBtn.onclick = () => setCartOpen(false);

        renderCategories();
        renderProducts();
        renderCart();
        setCartOpen(false);
    } catch (err) {
        console.error('Init Error:', err);
    }
}

function showToast(msg) {
    console.log('Toast:', msg);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
