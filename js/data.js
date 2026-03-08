// Configurações Gerais
// Configurações Gerais
var STORE_CONFIG = {
    // Desconto em porcentagem para TODA a loja (0 a 100)
    // Ex: 10 para 10% de desconto em tudo
    globalDiscountPercentage: 0,
    // Horário de Funcionamento (Formato 24h)
    openingHour: 0,
    closingHour: 24, // 24h para facilitar testes agora
    // Chave PIX
    pixKey: '62120634000135'
};

// Ordem de prioridade das categorias no menu
var PRIORITY_CATEGORIES = ['Artesanais', 'Tradicionais', 'Combos', 'Acompanhamentos', 'Bebidas'];

var PRODUCTS = [
    // ========= LANCHES ARTESANAIS =========
    // DICA: Para promoções individuais, adicione o campo promoPrice: XX.XX
    { id: 'qbsmash', name: 'Quero Smash', price: 18.90, promoPrice: 16.90, category: 'Artesanais', desc: 'Pão, maionese de bacon, carne (90g), cheddar, cebola caramelizada.', image: 'images/QueroSmashBurguer.jpg' },
    { id: 'qbespecial', name: 'Quero Burguer Especial', price: 22.50, category: 'Artesanais', desc: 'Pão, maionese de bacon, carne 120g, cheddar, tomate, alface, cebola roxa.', image: 'images/QueroBurguerEspecial.jpg' },
    { id: 'qbsmashduplo', name: 'Quero Smash Duplo', price: 23.90, category: 'Artesanais', desc: 'Pão, maionese de bacon, 2 carnes 90g, queijo, bacon.', image: 'images/QueroSmashDuplo.png' },
    { id: 'qbpredileto', name: 'Quero Burguer Predileto', price: 24.80, category: 'Artesanais', desc: 'Pão, baconese, tomate, picles, carne 120g, cheddar, cebola caramelizada, bacon.', image: 'images/Predileto.jpg' },

    // ========= LANCHES PADRÃO =========
    { id: 'qbburguer', name: 'Quero Burguer Kids', price: 8.90, category: 'Tradicionais', desc: 'Pão, carne, queijo, maionese temperada.', image: 'images/QueroBurguerKids.jpg' },
    { id: 'qbxsalada', name: 'Quero X-Salada', price: 11.90, category: 'Tradicionais', desc: 'Pão, carne, tomate, alface, cebola roxa, maionese temperada.', image: 'images/QueroXSalada.jpg' },
    { id: 'qbduplo', name: 'Quero Burger Duplo', price: 13.50, category: 'Tradicionais', desc: 'Pão, maionese temperada, 2 carnes, queijo, bacon.', image: 'images/QueroBurguerDuplo.jpg' },
    { id: 'qbxtudo', name: 'Quero X-Tudo', price: 13.90, category: 'Tradicionais', desc: 'Pão, carne, ovo, queijo, bacon, presunto, alface, tomate.', image: 'images/QueroXtudo.png' },

    // ========= COMBOS =========
    { id: 'comboburguer', name: 'Combo Burguer Kids', price: 14.90, category: 'Combos', desc: '1 Hamburguer + Batata Frita + Guaramor.', image: 'images/QueroComboKids.jpg' },
    { id: 'comboxsalada', name: 'Combo X-Salada', price: 16.50, category: 'Combos', desc: '1 X-Salada + Batata Frita + Guaramor.', image: 'images/QueroComboXSalada.jpg' },
    { id: 'comboduplo', name: 'Combo Burguer Duplo', price: 18.90, category: 'Combos', desc: '1 Hamburguer Duplo + Batata Frita + Guaramor.', image: 'images/QueroComboBurguerDuplo.jpg' },
    { id: 'comboxtudo', name: 'Combo X-Tudo', price: 19.90, category: 'Combos', featured: true, desc: '1 X-Tudo + Batata Frita + Guaramor.', image: 'images/QueroComboXTudo.jpg' },
    { id: 'combocasal', name: 'Combo Casal', price: 53.80, promoPrice: 44.90, category: 'Combos', featured: true, desc: '2 X-Tudo + Batata Turbinada + Refrigerante Flexa 2L.', image: 'images/ComboCasal.png' },
    { id: 'combofamilia1', name: 'Combo Família 3', price: 67.30, promoPrice: 58.50, category: 'Combos', featured: true, desc: '3 X-Tudo + Batata Turbinada + Refrigerante Flexa 2L.', image: 'images/ComboFamilia3.png' },
    { id: 'combofamilia2', name: 'Combo Família 4', price: 87.90, promoPrice: 69.90, category: 'Combos', featured: true, desc: '4 X-Tudo + Batata Turbinada + Refrigerante Flexa 2L.', image: 'images/ComboFamilia4.png' },

    // ========= ACOMPANHAMENTOS =========
    { id: 'batatap', name: 'Batata Frita 140g', price: 7.90, category: 'Acompanhamentos', desc: 'Batata frita crocante, porção generosa.', image: 'images/QueroBatataFrita.jpg' },
    { id: 'batatam', name: 'Batata Frita 300g', price: 16.90, category: 'Acompanhamentos', desc: 'Batata frita crocante, porção de 300g.', image: 'images/Batata300g.jpeg' },
    { id: 'batatag', name: 'Batata Frita 600g', price: 23.90, category: 'Acompanhamentos', desc: 'Batata frita crocante, porção generosa.', image: 'images/Batata300g.jpeg' },
    { id: 'batatamtb', name: 'Batata Turbinada 300g', price: 18.90, category: 'Acompanhamentos', desc: 'Batata frita com cheddar e bacon - 300g.', image: 'images/Batataturbinada300g.jpeg' },
    { id: 'batatagtb', name: 'Batata Turbinada 600g', price: 25.99, category: 'Acompanhamentos', desc: 'Batata frita com cheddar e bacon - 600g.', image: 'images/Batataturbinada600g.jpeg' },

    // ========= BEBIDAS =========
    { id: 'guaramor', name: 'Guaramor 250ml', price: 2.90, category: 'Bebidas', desc: 'Guaraná Guaramor gelado, 250ml.', image: 'images/Guaramor.png' },
    { id: 'fantauva_lata', name: 'Fanta Uva Lata 350ml', price: 6.00, category: 'Bebidas', desc: 'Guaraná Guaramor gelado, 250ml.', image: 'images/FantaUvaLata.jpg' },
    { id: 'coca_lata', name: 'Coca-Cola Lata 350ml', price: 6.00, category: 'Bebidas', desc: 'Coca-Cola Original gelada, lata 350ml.', image: 'images/CocaColaLata.jpg' },
    { id: 'coca_zero_lata', name: 'Coca-Cola Zero Lata 350ml', price: 6.00, category: 'Bebidas', desc: 'Coca-Cola Original 2 litros, perfeita para dividir.', image: 'images/CocaZeroLata.png' },
    { id: 'coca_15l', name: 'Coca-Cola 1.5L', price: 9.90, category: 'Bebidas', desc: 'Coca-Cola Original 2 litros, perfeita para dividir.', image: 'images/coca15.png' },
    { id: 'flexa_guarana', name: 'Flexa Guaraná', price: 7.90, category: 'Bebidas', desc: 'Guaraná Flexa gelado, refrescante.', image: 'images/FlexaGuarana.jpg' },
    { id: 'mineirinho_2l', name: 'Mineirinho 2L', price: 9.90, category: 'Bebidas', desc: 'Coca-Cola Original 2 litros, perfeita para dividir.', image: 'images/Mineirinho2l.png' },
    { id: 'guarana_antartica_2l', name: 'Guaraná Antartica 2L', price: 9.90, category: 'Bebidas', desc: 'Coca-Cola Original 2 litros, perfeita para dividir.', image: 'images/GuaranaAntartica.jpg' },
    { id: 'coca_zero_2l', name: 'Coca-Cola Zero 2L', price: 13.50, category: 'Bebidas', desc: 'Coca-Cola Original 2 litros, perfeita para dividir.', image: 'images/Cocazero.png' },
    { id: 'coca_2l', name: 'Coca-Cola 2L', price: 13.50, category: 'Bebidas', desc: 'Coca-Cola Original 2 litros, perfeita para dividir.', image: 'images/Coca 2l.png' },
];

var DRINK_OPTIONS = [
    { id: 'guaramor', name: 'Guaramor 300ml', price: 2.90 },
    { id: 'fantauva_lata', name: 'Fanta Uva Lata 350ml', price: 6.00 },
    { id: 'coca_lata', name: 'Coca-Cola Lata 350ml', price: 5.90 },
    { id: 'coca_zero_lata', name: 'Coca-Cola Zero Lata 350ml', price: 6.00 },
    { id: 'flexa_guarana', name: 'Flexa Guaraná', price: 7.90 },
    { id: 'coca_15l', name: 'Coca-Cola 1.5L', price: 9.90 },
    { id: 'mineirinho_2l', name: 'Mineirinho 2L', price: 9.90 },
    { id: 'guarana_antartica_2l', name: 'Guaraná Antartica 2L', price: 9.90 },
    { id: 'coca_zero_2l', name: 'Coca-Cola Zero 2L', price: 13.50 },
    { id: 'coca_2l', name: 'Coca-Cola 2L', price: 13.50 },
];

// Opções exclusivas para Combos (Casal, Família 3, Família 4)
var COMBO_DRINK_OPTIONS = [
    { id: 'flexa', name: 'Flexa (Incluso)', price: 0.00 },
    { id: 'coca_15', name: 'Coca-Cola 1.5L', price: 6.90 },
    { id: 'mineirinho', name: 'Mineirinho 2L', price: 6.90 },
    { id: 'guarana_ante', name: 'Guaraná Antarctica 2L', price: 6.90 },
    { id: 'coca_2', name: 'Coca-Cola 2L Original', price: 9.90 },
    { id: 'coca_zero_2', name: 'Coca-Cola 2L Zero', price: 9.90 },
];

// Opções para Combos Normais (Burguer Kids, X-Salada, Duplo, X-Tudo, Smash)
var REGULAR_COMBO_DRINK_OPTIONS = [
    { id: 'guaramor_incluso', name: 'Guaramor 250ml (Incluso)', price: 0.00 },
    { id: 'coca_lata_combo', name: 'Coca-Cola Lata 350ml', price: 4.90 },
    { id: 'coca_zero_lata_combo', name: 'Coca-Cola Zero Lata 350ml', price: 4.90 },
    { id: 'fanta_uva_combo', name: 'Fanta Uva Lata 300ml', price: 4.90 },
    { id: 'coca_1,5L_combo', name: 'Coca-Cola 1.5L', price: 7.90 },

];

var ADDON_OPTIONS = [
    { id: 'cheddar', name: 'Cheddar extra', price: 2.00 },
    { id: 'queijo', name: 'Queijo extra', price: 2.00 },
    { id: 'ovo', name: 'Ovo', price: 2.00 },
    { id: 'cebola', name: 'Cebola caramelizada', price: 2.50 },
    { id: 'bacon', name: 'Bacon extra', price: 2.90 },
    { id: 'carne', name: 'Carne extra', price: 2.90 },

];

// Configuração de Frete
var SHIPPING = {
    active: true,
    storeLat: -22.799933,
    storeLng: -43.018428,
    basePrice: 4.00,
    baseKm: 1,
    pricePerKm: 1.20,
    city: 'São Gonçalo'
};
