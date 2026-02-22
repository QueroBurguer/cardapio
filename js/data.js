const PRODUCTS = [
    { id: 'qbsmash', name: 'Quero Smash', price: 11.90, category: 'Lanches', desc: 'Carne de primeira bem gostosa 100% bovina smash crocante, queijo derretendo encima da carne, deliciosa cebola caramelizada na manteiga, molho da casa no pão brioche macio. Simplesmente, impossível de resistir!', image: 'images/QueroSmashBurguer.jpg' },
    { id: 'combofamilia4', name: 'Combo Família 4', price: 70.90, category: 'Combos', desc: '4 lanches + batata grande turbinada + refri 2l.', image: 'images/Combof2.jpg' },
    { id: 'combofamilia3', name: 'Combo Família 3', price: 59.90, category: 'Combos', desc: '2 lanches + 2 batatas + 2 bebidas.', image: 'images/Combof1.jpg' },
    { id: 'comboxtudo', name: 'Combo X-Tudo', price: 59.90, category: 'Combos', desc: 'X-Tudo + Batata Frita 140g + Bebida de sua escolha - O completo que você merece! Pão fresquinho, carne suculenta, ovo, queijo derretido, bacon crocante, presunto, alface e tomate fresquinho. Cada mordida é uma explosão de sabor!', image: 'images/QueroComboXTudo.jpg' },
    { id: 'batatam', name: 'Batata Frita Média', price: 18.90, category: 'Acompanhamentos', desc: 'Batata Crocante.', image: 'images/QueroBatataFrita.jpg' },
    { id: 'batatag', name: 'Batata Frita Grande', price: 24.90, category: 'Acompanhamentos', desc: 'Batata Crocante.', image: 'images/QueroBatataFrita.jpg' },
    { id: 'guaramor', name: 'Guaramor 250ml', price: 4.90, category: 'Bebidas', desc: 'Guaraná 250ml.', image: 'images/guaramor.jpg' },
    { id: 'batatamtb', name: 'Batata Turbinada Média', price: 23.90, category: 'Acompanhamentos', desc: 'Batata frita com cheddar e bacon.', image: 'images/QueroBatataFrita.jpg' },
    { id: 'batatagtb', name: 'Batata Turbinada Grande', price: 27.90, category: 'Acompanhamentos', desc: 'Batata frita com cheddar e bacon.', image: 'images/QueroBatataFrita.jpg' },
    { id: 'xbacon', name: 'Quero Bacon', price: 18.90, category: 'Lanches', desc: 'Carne 160g, bacon crocante, cheddar e molho especial.', image: 'images/QueroGulosoBurguer.jpg' },
    { id: 'xtudo', name: 'Quero X-tudo', price: 18.90, category: 'Lanches', desc: 'Carne 160g, bacon crocante, cheddar e molho especial.', image: 'images/QueroXTudo.jpg' },
    { id: 'qbpredileto', name: 'Quero Burguer Predileto', price: 18.90, category: 'Lanches', desc: 'Um burger artesanal de 120g super suculento, coberto com cheddar derretido e muita cebola caramelizada no ponto perfeito. Ganha crocância com o bacon e frescor com o tomate e os picles.', image: 'images/QueroSupremoBurguer.jpg' },
    { id: 'qbxtudo', name: 'Quero X-Tudo', price: 18.90, category: 'Lanches', desc: 'Aquele X-Tudo raiz que todo mundo ama! Pão macio, hambúrguer tradicional bem fritinho, queijo derretido, presunto saboroso e um ovo fritinho. Completo com alface, cebola roxa e maionese temperada.', image: 'images/QueroXTudo.jpg' },
    { id: 'qbsmashduplo', name: 'Quero Smash Duplo 200g', price: 18.90, category: 'Lanches', desc: 'Dois discos de carne smash crocantes por fora e suculentos por dentro, cada um coberto com queijo derretido. Finalizado com bacon crocante e baconese.', image: 'images/QueroXDuploBurguer.jpg' },
    { id: 'qbxsalada', name: 'Quero X-Salada', price: 18.90, category: 'Lanches', desc: 'Sabor e frescor em cada mordida! Pão macio, carne suculenta, tomate e alface fresquinhos cuidadosamente selecionados.', image: 'images/QueroXSalada.jpg' },
    { id: 'qbkids', name: 'Quero Hambúrguer Kids', price: 18.90, category: 'Lanches', desc: 'Pequeno no tamanho, gigante no sabor! Pão macio, carne suculenta e queijo derretido, perfeito para a criançada.', image: 'images/QueroBurguerKids.jpg' },
    { id: 'qbespecial', name: 'Quero Burguer Especial', price: 27.90, category: 'Lanches', desc: 'Burger artesanal de 120g, suculento e bem temperado, coberto com queijo cheddar cremoso. Recebe o frescor do tomate, da alface crocante e da cebola roxa.', image: 'images/QueroBurguerEspecial.jpg' },
    { id: 'qbduplo', name: 'Quero Hamburguer Duplo', price: 11.90, category: 'Lanches', desc: 'Duplo sabor, dupla intensidade! Pão macio, duas camadas suculentas de carne, queijo derretido e bacon crocante.', image: 'images/QueroBurguerDuplo.jpg' },
    { id: 'combocasal', name: 'Combo Casal', price: 45.90, category: 'Combos', desc: '2 Lanches + Batata Média + Bebida (Escolha abaixo)', image: 'images/QueroComboXSalada.jpg' },
    { id: 'combofamilia3', name: 'Combo Família 3', price: 85.90, category: 'Combos', desc: '3 Lanches + Batata Grande + Bebida (Escolha abaixo)', image: 'images/QueroComboBurguerDuplo.jpg' },
    { id: 'combofamilia4', name: 'Combo Família 4', price: 110.90, category: 'Combos', desc: '4 Lanches + Batata Gigante + Bebida (Escolha abaixo)', image: 'images/QueroComboBurguerDuplo.jpg' },
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

