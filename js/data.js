const PRODUCTS = [
    { id: 'qbsmash', name: 'Quero Smash', price: 18.90, category: 'Quero Artesanal', desc: 'Um delicioso Smash Burguer com a carne suculenta por dentro e aquela crostinha por fora, Cheddar e Cebola Caramelizada!', image: 'images/QueroSmashBurguer.jpg' },

    { id: 'comboxtudo', name: 'Combo X-Tudo', price: 18.90, category: 'Quero Combos', desc: 'X-Tudo Delicioso + Batata Frita Crocrante 140g + Bebida Gelada', image: 'images/QueroComboXTudo.png' },
    { id: 'combofamilia3', name: 'Combo Família 3', price: 59.90, category: 'Quero Combos', desc: '3 Deliciosos X-Tudos + Batata Turbinada 600g + Bebida Gelada 2L.', image: 'images/combof1.jpeg' },
    { id: 'combofamilia4', name: 'Combo Família 4', price: 69.90, category: 'Quero Combos', desc: '4 Deliciosos X-Tudos + Batata Turbinada 600g + Bebida Gelada 2L.', image: 'images/combof2.jpeg' },
    
    
    { id: 'batatafritaP', name: 'Batata Frita Crocrante 140g', price: 7.90, category: 'Batatas Fritas', desc: 'Batata Frita na hora, Crocrante por fora e Macia por dentro 140g.', image: 'images/QueroBatataFrita.jpeg' },
    { id: 'batatag', name: 'Batata Frita Grande', price: 24.90, category: 'Acompanhamentos', desc: 'Batata Crocante.', image: 'images/batatag.jpeg' },
   
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

// Configuração de Frete
const SHIPPING = {
    active: true,
    // Coordenadas da Loja (Avenida Trindade, 1996 - São Gonçalo, RJ)
    storeLat: -22.799933,
    storeLng: -43.018428,
    basePrice: 4.00, // Preço mínimo
    baseKm: 1, // Até 1km
    pricePerKm: 1.50, // Adicional por km
    city: 'São Gonçalo' // Cidade padrão para busca
};






