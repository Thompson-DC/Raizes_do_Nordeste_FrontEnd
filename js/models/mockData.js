/**
 * Raízes do Nordeste - Frente de Caixa Multicanal
 * Model: Dados Simulados Estáticos e Imutáveis (js/models/mockData.js)
 * Conforme especificado em docs/FSD.md (Seção 11.1)
 */

const RAW_MOCK_DATA = {
  filiais: [
    {
      id: "recife-antigo",
      nome: "Recife Antigo - Matriz",
      endereco: "Rua do Bom Jesus, 120, Recife - PE",
      horario: "11:00 às 22:00",
      tempo_estimado: "15-20 min",
      status: "aberta"
    },
    {
      id: "boa-viagem",
      nome: "Boa Viagem - Orla",
      endereco: "Av. Boa Viagem, 3400, Recife - PE",
      horario: "12:00 às 23:00",
      tempo_estimado: "20-25 min",
      status: "aberta"
    },
    {
      id: "olinda",
      nome: "Olinda - Sítio Histórico",
      endereco: "Rua do Amparo, 45, Olinda - PE",
      horario: "11:30 às 21:00",
      tempo_estimado: "15-20 min",
      status: "aberta"
    }
  ],

  categorias: [
    { id: "todos", nome: "Todos os Pratos", ordem: 1 },
    { id: "cuscuz", nome: "Cuscuz da Casa", ordem: 2 },
    { id: "tapioca", nome: "Tapiocas & Queijo", ordem: 3 },
    { id: "tradicional", nome: "Pratos Sertanejos", ordem: 4 },
    { id: "bebida", nome: "Bebidas Regionais", ordem: 5 },
    { id: "sobremesa", nome: "Sobremesas", ordem: 6 }
  ],

  cardapio: [
    {
      id: "cuscuz-completo",
      nome: "Cuscuz Brasa com Carne de Sol",
      categoria: "cuscuz",
      descricao: "Massa de milho flocada no vapor, recheada com carne de sol desfiada e queijo coalho tostado.",
      preco: 24.90,
      imagem: "assets/img/cuscuz-carne-sol.webp",
      badge_destaque: "★ TRADIÇÃO DA CASA",
      disponibilidade: {
        "recife-antigo": true,
        "boa-viagem": true,
        "olinda": false // Esgotado em Olinda para validação do requisito
      }
    },
    {
      id: "tapioca-rendada",
      nome: "Tapioca Rendada Sertaneja",
      categoria: "tapioca",
      descricao: "Massa fininha e crocante com crosta externa de queijo coalho e manteiga de garrafa.",
      preco: 18.50,
      imagem: "assets/img/tapioca-rendada.webp",
      badge_destaque: "★ MAIS PEDIDO",
      disponibilidade: {
        "recife-antigo": true,
        "boa-viagem": true,
        "olinda": true
      }
    },
    {
      id: "baiao-dois",
      nome: "Baião de Dois Raízes",
      categoria: "tradicional",
      descricao: "Arroz da terra, feijão fradinho, toucinho crocante, queijo coalho em cubos e coentro fresco.",
      preco: 36.00,
      imagem: "assets/img/baiao-dois.webp",
      badge_destaque: "★ COMBINADO REGIONAL",
      disponibilidade: {
        "recife-antigo": true,
        "boa-viagem": false, // Esgotado em Boa Viagem para validação
        "olinda": true
      }
    },
    {
      id: "suco-caja",
      nome: "Suco Natural de Cajá (500ml)",
      categoria: "bebida",
      descricao: "Polpa fresca de cajá do sertão, bem gelada e adoçada suavemente.",
      preco: 9.00,
      imagem: "assets/img/suco-caja.webp",
      badge_destaque: null,
      disponibilidade: {
        "recife-antigo": true,
        "boa-viagem": true,
        "olinda": true
      }
    },
    {
      id: "bolo-rolo",
      nome: "Bolo de Rolo Tradicional com Sorvete",
      categoria: "sobremesa",
      descricao: "Camadas ultrafinas com doce de goiabada cremosa, servido com sorvete de queijo.",
      preco: 16.00,
      imagem: "assets/img/bolo-rolo.webp",
      badge_destaque: "★ DOÇURA DA SERRA",
      disponibilidade: {
        "recife-antigo": true,
        "boa-viagem": true,
        "olinda": true
      }
    }
  ],

  fidelidade_padrao: {
    pontos_por_real_desconto: 10,
    saldo_inicial_cliente: 150
  },

  cliente_padrao: {
    id: "cli-01",
    nome: "Severino da Silva",
    telefone: "(81) 98765-4321",
    saldo_pontos: 150
  }
};

/**
 * Utilitário de congelamento profundo para assegurar imutabilidade estrita dos dados
 * @param {Object} obj 
 * @returns {Object}
 */
function deepFreeze(obj) {
  Object.keys(obj).forEach(prop => {
    if (typeof obj[prop] === 'object' && obj[prop] !== null && !Object.isFrozen(obj[prop])) {
      deepFreeze(obj[prop]);
    }
  });
  return Object.freeze(obj);
}

export const MOCK_DATA = deepFreeze(RAW_MOCK_DATA);
