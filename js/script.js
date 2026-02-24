// ========= CONFIG =========
const WHATSAPP_PHONE = '5521992497289';

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
const dom = {
    get cartBox() { return document.getElementById('cartBox'); },
    get cartItems() { return document.getElementById('cartItems'); },
    get overlay() { return document.getElementById('overlay'); },
    get fabCart() { return document.getElementById('fabCart'); },
    get toggleCartBtn() { return document.getElementById('toggleCartBtn'); },
    get sendBtn() { return document.getElementById('sendBtn'); },
    get clearBtn() { return document.getElementById('clearBtn'); },
    get cartBadge() { return document.getElementById('cartBadge'); },
    get searchInput() { return document.getElementById('searchInput'); },
    get totalDisplay() { return document.getElementById('total'); },
    get menuContainer() { return document.getElementById('menuContainer'); },
    get categoryChips() { return document.getElementById('categoryChips'); },

    // Shipping
    get subtotalVal() { return document.getElementById('subtotalVal'); },
    get shippingVal() { return document.getElementById('shippingVal'); },
    get distanceVal() { return document.getElementById('distanceVal'); },
    get calcShippingBtn() { return document.getElementById('calcShippingBtn'); },

    // Modal
    get customModal() { return document.getElementById('customModal'); },
    get customTitle() { return document.getElementById('customTitle'); },
    get customSub() { return document.getElementById('customSub'); },
    get drinkBox() { return document.getElementById('drinkOptions'); },
    get addonBox() { return document.getElementById('addonOptions'); },
    get itemNote() { return document.getElementById('itemNote'); },
    get customItemPrice() { return document.getElementById('customItemPrice'); },
    get customCloseBtn() { return document.getElementById('customCloseBtn'); },
    get customConfirmBtn() { return document.getElementById('customConfirmBtn'); },
    get modalProductImg() { return document.getElementById('modalProductImg'); },
    get modalProductName() { return document.getElementById('modalProductName'); },
    get modalProductDesc() { return document.getElementById('modalProductDesc'); },

    // Checkout Fields
    get customerName() { return document.getElementById('customerName'); },
    get customerPhone() { return document.getElementById('customerPhone'); },
    get customerAddress() { return document.getElementById('customerAddress'); },
    get paymentMethod() { return document.getElementById('paymentMethod'); },
    get noteText() { return document.getElementById('noteText'); },

    // New Optimizations
    get storeStatus() { return document.getElementById('storeStatus'); },

    // Stepped Checkout
    get cartStep1() { return document.getElementById('cartStep1'); },
    get cartStep2() { return document.getElementById('cartStep2'); },
    get cartStep3() { return document.getElementById('cartStep3'); },
    get nextToS2() { return document.getElementById('nextToStep2'); },
    get nextToS3() { return document.getElementById('nextToStep3'); },
    get backToS1() { return document.getElementById('backToStep1'); },
    get backToS2() { return document.getElementById('backToStep2'); },
    get shippingValTotal() { return document.getElementById('shippingValTotal'); },

    // Pix & Upsell
    get pixCopySection() { return document.getElementById('pixCopySection'); },
    get copyPixBtn() { return document.getElementById('copyPixBtn'); },
    get pixKeyDisplay() { return document.getElementById('pixKeyDisplay'); },
    get customStepBasic() { return document.getElementById('customStepBasic'); },
    get upsellStep() { return document.getElementById('upsellStep'); },
    get upsellTitle() { return document.getElementById('upsellTitle'); },
    get upsellOptionGrid() { return document.getElementById('upsellOptionGrid'); }
};

// ========= CUSTOM UI STATE =========
const customUI = {
    open: false,
    product: null,
    qty: 1,
    drinkId: null,
    addonIds: new Set(),
    isSpecialCombo: false,
    upsellPhase: 0 // 0: Basic, 1: Batata, 2: Bebida
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
    dom.sendBtn.disabled = state.cart.length === 0 || !isStoreOpen();
    dom.clearBtn.disabled = state.cart.length === 0;
    dom.nextToS2.disabled = state.cart.length === 0;

    // Badge e FAB
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
                dom.itemNote.value = '';
                dom.drinkBox.innerHTML = '';
                dom.addonBox.innerHTML = '';
                customUI.isSpecialCombo = false;
                customUI.drinkId = null;
            }
        }, 200);
    }
}

function openCustomizer(product, qty = 1) {
    customUI.product = product;
    customUI.qty = qty;
    customUI.drinkId = null;
    customUI.addonIds.clear();
    customUI.itemNote = "";
    customUI.upsellPhase = 0; // Começa no básico (personalização)

    // UI RESET
    dom.customStepBasic.style.display = 'block';
    dom.upsellStep.style.display = 'none';
    dom.customConfirmBtn.textContent = 'Avançar';

    dom.modalProductImg.src = product.image;
    dom.modalProductName.textContent = product.name;
    dom.modalProductDesc.textContent = product.desc || '';
    dom.customTitle.textContent = product.name;

    renderOptionCards(dom.drinkBox, (product.id === 'comboburguer' || product.id === 'combocasal') ? DRINK_OPTIONS : [], 'drink');
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
    const base = getEffectivePrice(customUI.product);

    let extras = 0;

    // Usa lista correta para pegar o preço
    const drinkList = customUI.isSpecialCombo ? COMBO_DRINK_OPTIONS : DRINK_OPTIONS;
    const drink = drinkList.find(d => d.id === customUI.drinkId);

    if (drink) extras += drink.price;

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
        dom.upsellTitle.textContent = '🍟 Deseja adicionar uma Batata Frita 140g?';
        dom.customConfirmBtn.textContent = 'Adicionar e Continuar';

        const potato = PRODUCTS.find(p => p.id === 'batatam'); // Corrigido ID para 140g
        renderUpsellOption(potato);
    }
    // Fase 2: Bebida
    else if (customUI.upsellPhase === 2) {
        dom.upsellTitle.textContent = '🥤 E uma Bebida gelada para acompanhar?';
        dom.customConfirmBtn.textContent = 'Finalizar e Adicionar';

        const drink = PRODUCTS.find(p => p.id === 'guaramor');
        renderUpsellOption(drink);
    }
}

function renderUpsellOption(product) {
    dom.upsellOptionGrid.innerHTML = '';
    if (!product) {
        customUI.upsellPhase++;
        if (customUI.upsellPhase > 2) finishCustomization();
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
        if (customUI.upsellPhase > 2) finishCustomization();
        else handleUpsell();
    };

    card.onclick = () => {
        addToCart(product, 1);
        showToast(`${product.name} adicionado!`);
        customUI.upsellPhase++;
        if (customUI.upsellPhase > 2) finishCustomization();
        else handleUpsell();
    };

    dom.upsellOptionGrid.appendChild(card);
    dom.upsellOptionGrid.appendChild(skipBtn);
}

function finishCustomization() {
    const base = getEffectivePrice(customUI.product);
    const drink = DRINK_OPTIONS.find(d => d.id === customUI.drinkId);
    const addons = ADDON_OPTIONS.filter(a => customUI.addonIds.has(a.id));

    let finalName = customUI.product.name;
    const parts = [];
    if (drink) parts.push(`Bebida: ${drink.name}`);
    if (addons.length > 0) parts.push(`Add: ${addons.map(a => a.name).join(', ')}`);
    const note = dom.itemNote.value.trim();
    if (note) parts.push(`Obs: ${note}`);

    if (parts.length > 0) {
        finalName += ` (${parts.join(' • ')})`;
    }

    const meta = {
        drink: drink ? drink.name : null,
        addons: addons.map(a => a.name),
        note: note
    };

    let totalUnit = base;
    if (drink) totalUnit += drink.price;
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
    if (isMobile()) setCartOpen(true);
}

dom.customConfirmBtn.onclick = () => {
    if (!customUI.product) return;
    if (customUI.upsellPhase === 0) {
        customUI.upsellPhase = 1;
        handleUpsell();
    } else {
        finishCustomization();
    }
};

dom.customCloseBtn.onclick = () => setCustomOpen(false);
dom.overlay.addEventListener('click', () => {
    if (customUI.open) setCustomOpen(false);
    if (dom.cartBox.classList.contains('mobile-open')) setCartOpen(false);
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
    if (c.pay === 'Pix') lines.push(`_(Pagamento realizado via chave Pix da loja)_`);
    if (c.obs !== 'Sem observação') lines.push(`📝 *Obs Geral:* ${c.obs}`);

    return encodeURIComponent(lines.join('\n'));
}

dom.sendBtn.addEventListener('click', () => {
    if (state.cart.length === 0) return;
    if (!isStoreOpen()) {
        alert('Desculpe, a loja está fechada agora. Abrimos das 18:00 às 01:00.');
        return;
    }
    if (!dom.customerName.value.trim()) {
        alert('Por favor, informe seu nome antes de finalizar.');
        goToCartStep(2);
        dom.customerName.focus();
        return;
    }

    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${buildWhatsAppText()}`;
    window.open(url, '_blank');
});

dom.clearBtn.addEventListener('click', () => {
    if (confirm('Deseja limpar seu carrinho?')) {
        state.cart = [];
        state.shipping = 0;
        state.distance = 0;
        renderCart();
        goToCartStep(1);
    }
});

// ========= NAVEGAÇÃO CARRINHO =========
function goToCartStep(n) {
    state.cartStep = n;
    [dom.cartStep1, dom.cartStep2, dom.cartStep3].forEach((el, i) => {
        if (el) el.classList.toggle('active', i === n - 1);
    });
}

function setCartOpen(open) {
    if (open) {
        dom.cartBox.classList.add('mobile-open');
        dom.overlay.classList.add('active');
        goToCartStep(1);
    } else {
        dom.cartBox.classList.remove('mobile-open');
        dom.overlay.classList.remove('active');
    }
}

dom.fabCart.onclick = () => setCartOpen(true);
dom.toggleCartBtn.onclick = () => setCartOpen(false);

// ========= INIT =========
function init() {
    try {
        updateStoreStatus();
        setInterval(updateStoreStatus, 60000);

        dom.searchInput.oninput = (e) => {
            state.q = e.target.value;
            renderProducts();
        };

        // Navigation Listeners
        if (dom.nextToS2) dom.nextToS2.onclick = () => goToCartStep(2);
        if (dom.nextToS3) dom.nextToS3.onclick = () => goToCartStep(3);
        if (dom.backToS1) dom.backToS1.onclick = () => goToCartStep(1);
        if (dom.backToS2) dom.backToS2.onclick = () => goToCartStep(2);

        // PIX Key Copy
        if (dom.copyPixBtn) {
            dom.copyPixBtn.onclick = () => {
                const key = dom.pixKeyDisplay.textContent;
                navigator.clipboard.writeText(key).then(() => {
                    dom.copyPixBtn.textContent = 'Copiado!';
                    setTimeout(() => dom.copyPixBtn.textContent = 'Copiar', 2000);
                });
            };
        }

        if (dom.paymentMethod) {
            dom.paymentMethod.onchange = (e) => {
                dom.pixCopySection.style.display = e.target.value === 'Pix' ? 'block' : 'none';
            };
        }

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
