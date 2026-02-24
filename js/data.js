// Configurações Gerais
const STORE_CONFIG = {
    // Desconto em porcentagem para TODA a loja (0 a 100)
    // Ex: 10 para 10% de desconto em tudo
    globalDiscountPercentage: 0,
    // Horário de Funcionamento (Formato 24h)
    openingHour: 18,
    closingHour: 1, // 01:00 da manhã
    // Chave PIX
    pixKey: '62120634000135'
};

// Ordem de prioridade das categorias no menu
const PRIORITY_CATEGORIES = ['Lanches', 'Combos', 'Acompanhamentos', 'Bebidas'];

const PRODUCTS = [
    // ========= LANCHES ARTESANAIS =========
    // DICA: Para promoções individuais, adicione o campo promoPrice: XX.XX
    { id: 'qbsmash', name: 'Quero Smash', price: 18.90, promoPrice: 15.90, category: 'Lanches', featured: true, desc: 'Pão, maionese de bacon, carne (90g), cheddar, cebola caramelizada.', image: 'images/QueroSmashBurguer.jpg' },
    { id: 'qbespecial', name: 'Quero Burguer Especial', price: 22.50, category: 'Lanches', featured: true, desc: 'Pão, maionese de bacon, carne 120g, cheddar, tomate, alface, cebola roxa.', image: 'images/QueroBurguerEspecial.jpg' },
    { id: 'qbsmashduplo', name: 'Quero Smash Duplo', price: 23.90, category: 'Lanches', desc: 'Pão, maionese de bacon, 2 carnes 90g, queijo, bacon.', image: 'images/QueroXDuploBurguer.jpg' },
    { id: 'qbpredileto', name: 'Quero Burguer Predileto', price: 24.80, category: 'Lanches', desc: 'Pão, baconese, tomate, picles, carne 120g, cheddar, cebola caramelizada, bacon.', image: 'images/QueroSupremoBurguer.jpg' },

    // ========= LANCHES PADRÃO =========
    { id: 'qbburguer', name: 'Quero Burguer Kids', price: 8.90, category: 'Lanches', desc: 'Pão, carne, queijo, maionese temperada.', image: 'images/QueroBurguerKids.jpg' },
    { id: 'qbxsalada', name: 'Quero X-Salada', price: 11.90, category: 'Lanches', desc: 'Pão, carne, tomate, alface, cebola roxa, maionese temperada.', image: 'images/QueroXSalada.jpg' },
    { id: 'qbduplo', name: 'Quero Burger Duplo', price: 13.50, category: 'Lanches', desc: 'Pão, maionese temperada, 2 carnes, queijo, bacon.', image: 'images/QueroBurguerDuplo.jpg' },
    { id: 'qbxtudo', name: 'Quero X-Tudo', price: 14.90, category: 'Lanches', desc: 'Pão, carne, ovo, queijo, bacon, presunto, alface, tomate.', image: 'images/QueroXTudo.jpg' },

    // ========= COMBOS =========
    { id: 'comboburguer', name: 'Combo Burguer Kids', price: 15.90, category: 'Combos', desc: '1 Hamburguer + Batata Frita + Guaramor.', image: 'images/QueroComboKids.jpg' },
    { id: 'comboxsalada', name: 'Combo X-Salada', price: 16.50, category: 'Combos', desc: '1 X-Salada + Batata Frita + Guaramor.', image: 'images/QueroComboXSalada.jpg' },
    { id: 'comboduplo', name: 'Combo Burguer Duplo', price: 18.50, category: 'Combos', desc: '1 Hamburguer Duplo + Batata Frita + Guaramor.', image: 'images/QueroComboBurguerDuplo.jpg' },
    { id: 'comboxtudo', name: 'Combo X-Tudo', price: 19.90, category: 'Combos', featured: true, desc: '1 X-Tudo + Batata Frita + Guaramor.', image: 'images/QueroComboXTudo.jpg' },
    { id: 'combosmash', name: 'Combo Smash', price: 24.90, category: 'Combos', featured: true, desc: '1 Quero Smash + Batata Frita + Guaramor.', image: 'images/combo1.jpg' },
    { id: 'combocasal', name: 'Combo Casal', price: 59.90, category: 'Combos', featured: true, desc: '2 X-Tudo + Batata Turbinada + Refrigerante Flexa 2L.', image: 'images/ComboCasal.jpg' },
    { id: 'combofamilia1', name: 'Combo Família 3', price: 68.90, category: 'Combos', featured: true, desc: '3 X-Tudo + Batata Turbinada + Refrigerante Flexa 2L.', image: 'images/combof1.jpeg' },
    { id: 'combofamilia2', name: 'Combo Família 4', price: 89.90, category: 'Combos', featured: true, desc: '4 X-Tudo + Batata Turbinada + Refrigerante Flexa 2L.', image: 'images/combof2.jpeg' },

    // ========= ACOMPANHAMENTOS =========
    { id: 'batatam', name: 'Batata Frita 300g', price: 16.90, category: 'Acompanhamentos', desc: 'Batata frita crocante, porção de 300g.', image: 'images/Batata300g.jpeg' },
    { id: 'batatag', name: 'Batata Frita 140g', price: 8.90, category: 'Acompanhamentos', desc: 'Batata frita crocante, porção generosa.', image: 'images/QueroBatataFrita.jpg' },
    { id: 'batatamtb', name: 'Batata Turbinada 300g', price: 18.90, category: 'Acompanhamentos', desc: 'Batata frita com cheddar e bacon - 300g.', image: 'images/Batataturbinada300g.jpeg' },
    { id: 'batatagtb', name: 'Batata Turbinada 600g', price: 27.90, category: 'Acompanhamentos', desc: 'Batata frita com cheddar e bacon - 600g.', image: 'images/Batataturbinada600g.jpeg' },

    // ========= BEBIDAS =========
    { id: 'guaramor', name: 'Guaramor 250ml', price: 2.90, category: 'Bebidas', desc: 'Guaraná Guaramor gelado, 250ml.', image: 'images/guaramor.jpg' },
    { id: 'coca_lata', name: 'Coca-Cola Lata 350ml', price: 6.00, category: 'Bebidas', desc: 'Coca-Cola Original gelada, lata 350ml.', image: 'images/CocaColaLata.jpg' },
    { id: 'coca_2l', name: 'Coca-Cola 2L', price: 14.90, category: 'Bebidas', desc: 'Coca-Cola Original 2 litros, perfeita para dividir.', image: 'images/CocaCola2L.jpg' },
    { id: 'flexa_guarana', name: 'Flexa Guaraná', price: 7.90, category: 'Bebidas', desc: 'Guaraná Flexa gelado, refrescante.', image: 'images/FlexaGuarana.jpg' },
];

const DRINK_OPTIONS = [
    { id: 'coca_lata', name: 'Coca-Cola Lata 350ml', price: 6.00 },
    { id: 'guarana_lata', name: 'Guaraná Lata 350ml', price: 5.50 },
    { id: 'suco_uva', name: 'Suco Uva 300ml', price: 6.50 },
    { id: 'agua', name: 'Água 500ml', price: 3.00 },
];

// Opções exclusivas para Combos (Casal, Família 3, Família 4)
const COMBO_DRINK_OPTIONS = [
    { id: 'flexa', name: 'Flexa (Incluso)', price: 0.00 },
    { id: 'coca_15', name: 'Coca-Cola 1.5L', price: 6.00 },
    { id: 'mineirinho', name: 'Mineirinho 2L', price: 7.00 },
    { id: 'guarana_ante', name: 'Guaraná Antarctica 2L', price: 7.00 },
    { id: 'coca_2', name: 'Coca-Cola 2L Original', price: 9.90 },
    { id: 'coca_zero_2', name: 'Coca-Cola 2L Zero', price: 9.90 },
];

const ADDON_OPTIONS = [
    { id: 'bacon', name: 'Bacon extra', price: 3.00 },
    { id: 'cheddar', name: 'Cheddar extra', price: 3.00 },
    { id: 'queijo', name: 'Queijo extra', price: 2.50 },
    { id: 'ovo', name: 'Ovo', price: 2.50 },
    { id: 'cebola', name: 'Cebola caramelizada', price: 2.50 },
];

// Configuração de Frete
const SHIPPING = {
    active: true,
    storeLat: -22.799933,
    storeLng: -43.018428,
    basePrice: 4.00,
    baseKm: 1,
    pricePerKm: 1.50,
    city: 'São Gonçalo'
};
