// Ordem de prioridade das categorias no menu
const PRIORITY_CATEGORIES = ['Lanches', 'Combos', 'Acompanhamentos', 'Bebidas'];

const PRODUCTS = [
    // ========= LANCHES ARTESANAIS =========
    { id: 'qbsmash', name: 'Quero Smash', price: 18.90, category: 'Lanches', desc: 'Pão, maionese de bacon, carne (90g), cheddar, cebola caramelizada.', image: 'images/QueroSmashBurguer.jpg' },
    { id: 'qbespecial', name: 'Quero Burguer Especial', price: 22.50, category: 'Lanches', desc: 'Pão, maionese de bacon, carne 120g, cheddar, tomate, alface, cebola roxa.', image: 'images/QueroBurguerEspecial.jpg' },
    { id: 'qbsmashduplo', name: 'Quero Smash Duplo', price: 23.90, category: 'Lanches', desc: 'Pão, maionese de bacon, 2 carnes 90g, queijo, bacon.', image: 'images/QueroXDuploBurguer.jpg' },
    { id: 'qbpredileto', name: 'Quero Burguer Predileto', price: 24.80, category: 'Lanches', desc: 'Pão, baconese, tomate, picles, carne 120g, cheddar, cebola caramelizada, bacon.', image: 'images/QueroSupremoBurguer.jpg' },

    // ========= LANCHES PADRÃO =========
    { id: 'qbburguer', name: 'Quero Burguer Kids', price: 8.50, category: 'Lanches', desc: 'Pão, carne, queijo, maionese temperada.', image: 'images/QueroMcBurguer.jpg' },
    { id: 'qbxsalada', name: 'Quero X-Salada', price: 11.90, category: 'Lanches', desc: 'Pão, carne, tomate, alface, cebola roxa, maionese temperada.', image: 'images/QueroXSalada.jpg' },
    { id: 'qbduplo', name: 'Quero Burger Duplo', price: 12.50, category: 'Lanches', desc: 'Pão, maionese temperada, 2 carnes, queijo, bacon.', image: 'images/QueroBurguerDuplo.jpg' },
    { id: 'qbxtudo', name: 'Quero X-Tudo', price: 13.50, category: 'Lanches', desc: 'Pão, carne, ovo, queijo, bacon, presunto, alface, tomate.', image: 'images/QueroXTudo.jpg' },

    // ========= COMBOS =========
    { id: 'comboburguer', name: 'Combo Burguer Kids', price: 14.50, category: 'Combos', desc: '1 Hamburguer + Batata Frita + Guaramor.', image: 'images/QueroComboKids.jpg' },
    { id: 'comboxsalada', name: 'Combo X-Salada', price: 16.50, category: 'Combos', desc: '1 X-Salada + Batata Frita + Guaramor.', image: 'images/QueroComboXSalada.jpg' },
    { id: 'comboduplo', name: 'Combo Burguer Duplo', price: 17.50, category: 'Combos', desc: '1 Hamburguer Duplo + Batata Frita + Guaramor.', image: 'images/QueroComboBurguerDuplo.jpg' },
    { id: 'comboxtudo', name: 'Combo X-Tudo', price: 18.90, category: 'Combos', desc: '1 X-Tudo + Batata Frita + Guaramor.', image: 'images/QueroComboXTudo.jpg' },
    { id: 'combosmash', name: 'Combo Smash', price: 24.90, category: 'Combos', desc: '1 Quero Smash + Batata Frita + Guaramor.', image: 'images/combo1.jpg' },
    { id: 'combocasal', name: 'Combo Casal', price: 44.99, category: 'Combos', desc: '2 X-Tudo + Batata Turbinada + Refrigerante Flexa 2L.', image: 'images/combo_familia.jpg' },
    { id: 'combofamilia1', name: 'Combo Família 1', price: 58.50, category: 'Combos', desc: '3 X-Tudo + Batata Turbinada + Refrigerante Flexa 2L.', image: 'images/combof1.jpeg' },
    { id: 'combofamilia2', name: 'Combo Família 2', price: 69.90, category: 'Combos', desc: '4 X-Tudo + Batata Turbinada + Refrigerante Flexa 2L.', image: 'images/combof2.jpeg' },

    // ========= ACOMPANHAMENTOS =========
    { id: 'batatam', name: 'Batata Frita 140g', price: 7.90, category: 'Acompanhamentos', desc: 'Batata frita crocante, porção de 140g.', image: 'QueroBatataFrita.jpg' },
    { id: 'batatam', name: 'Batata Frita 300g', price: 14.90, category: 'Acompanhamentos', desc: 'Batata frita crocante, porção de 300g.', image: 'images/Batata300g.jpeg' },
    { id: 'batatag', name: 'Batata Frita 600g', price: 23.50, category: 'Acompanhamentos', desc: 'Batata frita crocante, porção generosa.', image: 'images/QueroBatataFrita.jpg' },
    { id: 'batatamtb', name: 'Batata Turbinada 300g', price: 18.90, category: 'Acompanhamentos', desc: 'Batata frita com cheddar e bacon - 300g.', image: 'images/Batataturbinada300g.jpeg' },
    { id: 'batatagtb', name: 'Batata Turbinada 600g', price: 27.90, category: 'Acompanhamentos', desc: 'Batata frita com cheddar e bacon - 600g.', image: 'images/Batataturbinada600g.jpeg' },

    // ========= BEBIDAS =========
    { id: 'guaramor', name: 'Guaramor 250ml', price: 2.90, category: 'Bebidas', desc: 'Guaraná Guaramor gelado, 250ml.', image: 'images/guaramor.jpg' },
    { id: 'fantauva_lata', name: 'Fanta Uva Lata 350ml', price: 5.90, category: 'Bebidas', desc: 'Fanta Uva gelada, lata 350ml.', image: 'images/CocaColaLata.jpg' },
    { id: 'coca_lata', name: 'Coca-Cola Lata 350ml', price: 5.90, category: 'Bebidas', desc: 'Coca-Cola Original gelada, lata 350ml.', image: 'images/CocaColaLata.jpg' },
    { id: 'cocazero_lata', name: 'Coca-Cola Zero Lata 350ml', price: 5.90, category: 'Bebidas', desc: 'Coca-Cola Zero gelada, lata 350ml.', image: 'images/CocaColaLata.jpg' },
    { id: 'flexa_guarana', name: 'Flexa Guaraná 2L', price: 7.50, category: 'Bebidas', desc: 'Guaraná Flexa gelado, refrescante.', image: 'images/FlexaGuarana.jpg' },
    { id: 'coca_15', name: 'Coca-Cola 1,5L', price: 9.90, category: 'Bebidas', desc: 'Coca-Cola Original 1,5 litros, perfeita para dividir.', image: 'images/CocaCola2L.jpg' },
    { id: 'coca_2l', name: 'Coca-Cola 2L', price: 13.90, category: 'Bebidas', desc: 'Coca-Cola Original 2 litros, perfeita para dividir.', image: 'images/CocaCola2L.jpg' },
    { id: 'cocazero_2l', name: 'Coca-Cola Zero 2L', price: 13.90, category: 'Bebidas', desc: 'Coca-Cola Zero 2 litros, perfeita para dividir.', image: 'images/CocaCola2L.jpg' },

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

