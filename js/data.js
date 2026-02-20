const PRODUCTS = [
    { id: 'smashburguer', name: 'Quero Smash Burguer', price: 11.90, category: 'Lanches', desc: 'Carne de primeira bem gostosa 100% bovina smash crocante, queijo derretendo encima da carne, deliciosa cebola caramelizada na manteiga, molho da casa no pão brioche macio. Simplesmente, impossível de resistir!', image: 'images/QueroSmashBurguer.jpg' },
    { id: 'combofamilia2', name: 'Combo Família 2', price: 70.90, category: 'Combos', desc: '4 lanches + batata grande turbinada + refri 2l.', image: 'images/combof2.jpg' },
    { id: 'combofamilia1', name: 'Combo Família 1', price: 59.90, category: 'Combos', desc: '2 lanches + 2 batatas + 2 bebidas.', image: 'images/combof1.jpg' },
    { id: 'comboxtudo', name: 'Combo X-Tudo', price: 59.90, category: 'Combos', desc: 'X-Tudo + Batata Frita 140g + Bebida de sua escolha - O completo que você merece! Pão fresquinho, carne suculenta, ovo, queijo derretido, bacon crocante, presunto, alface e tomate fresquinho. Cada mordida é uma explosão de sabor!', image: 'images/combof1.jpg' },
    { id: 'batatam', name: 'Batata Frita Média', price: 18.90, category: 'Acompanhamentos', desc: 'Batata Crocante.', image: 'images/batatam.jpg' },
    { id: 'batatag', name: 'Batata Frita Grande', price: 24.90, category: 'Acompanhamentos', desc: 'Batata Crocante.', image: 'images/batatag.jpg' },
    { id: 'guaramor', name: 'Guaramor 250ml', price: 4.90, category: 'Bebidas', desc: 'Guaraná 250ml.', image: 'images/guaramor.jpg' },
    { id: 'batatamtb', name: 'Batata Turbinada Média', price: 23.90, category: 'Acompanhamentos', desc: 'Batata frita com cheddar e bacon.', image: 'images/batatag1.jpg' },
    { id: 'batatagtb', name: 'Batata Turbinada Grande', price: 27.90, category: 'Acompanhamentos', desc: 'Batata frita com cheddar e bacon.', image: 'images/batatag2.jpg' },
    { id: 'xbacon', name: 'Quero Bacon', price: 18.90, category: 'Lanches', desc: 'Carne 160g, bacon crocante, cheddar e molho especial.', image: 'images/bacon.jpg' },
    { id: 'xtudo', name: 'Quero X-tudo', price: 18.90, category: 'Lanches', desc: 'Carne 160g, bacon crocante, cheddar e molho especial.', image: 'images/Xtudo.jpg' },
    { id: 'qbpredileto', name: 'Quero Burguer Predileto', price: 18.90, category: 'Lanches', desc: 'Um burger artesanal de 120g super suculento, coberto com cheddar derretido e muita cebola caramelizada no ponto perfeito. Ganha crocância com o bacon e frescor com o tomate e os picles.', image: 'images/bacon.jpg' },
    { id: 'qbxtudo', name: 'Quero X-Tudo', price: 18.90, category: 'Lanches', desc: 'Aquele X-Tudo raiz que todo mundo ama! Pão macio, hambúrguer tradicional bem fritinho, queijo derretido, presunto saboroso e um ovo fritinho. Completo com alface, cebola roxa e maionese temperada.', image: 'images/Xtudo.jpg' },
    { id: 'qbsmashduplo', name: 'Quero Smash Duplo 200g', price: 18.90, category: 'Lanches', desc: 'Dois discos de carne smash crocantes por fora e suculentos por dentro, cada um coberto com queijo derretido. Finalizado com bacon crocante e baconese.', image: 'images/bacon.jpg' },
    { id: 'qbxsalada', name: 'Quero X-Salada', price: 18.90, category: 'Lanches', desc: 'Sabor e frescor em cada mordida! Pão macio, carne suculenta, tomate e alface fresquinhos cuidadosamente selecionados.', image: 'images/bacon.jpg' },
    { id: 'qbkids', name: 'Quero Hambúrguer Kids', price: 18.90, category: 'Lanches', desc: 'Pequeno no tamanho, gigante no sabor! Pão macio, carne suculenta e queijo derretido, perfeito para a criançada.', image: 'images/bacon.jpg' },
    { id: 'qbespecial', name: 'Quero Burguer Especial', price: 27.90, category: 'Lanches', desc: 'Burger artesanal de 120g, suculento e bem temperado, coberto com queijo cheddar cremoso. Recebe o frescor do tomate, da alface crocante e da cebola roxa.', image: 'images/.jpg' },
    { id: 'qbduplo', name: 'Quero Hamburguer Duplo', price: 11.90, category: 'Lanches', desc: 'Duplo sabor, dupla intensidade! Pão macio, duas camadas suculentas de carne, queijo derretido e bacon crocante.', image: 'images/smash.jpg' },
];

const DRINK_OPTIONS = [
    { id: 'coca_lata', name: 'Coca-Cola Lata 350ml', price: 6.00 },
    { id: 'guarana_lata', name: 'Guaraná Lata 350ml', price: 5.50 },
    { id: 'suco_uva', name: 'Suco Uva 300ml', price: 6.50 },
    { id: 'agua', name: 'Água 500ml', price: 3.00 },
];

const ADDON_OPTIONS = [
    { id: 'bacon', name: 'Bacon extra', price: 3.00 },
    { id: 'cheddar', name: 'Cheddar extra', price: 3.00 },
    { id: 'queijo', name: 'Queijo extra', price: 2.50 },
    { id: 'ovo', name: 'Ovo', price: 2.50 },
    { id: 'cebola', name: 'Cebola caramelizada', price: 2.50 },
];



