/**
 * Raízes do Nordeste - Frente de Caixa Multicanal
 * Objeto de Configuração Global Estática
 * Conforme especificado em docs/FSD.md (Seção 20)
 */

export const CONFIG = {
  app_nome: "Raízes do Nordeste",
  versao: "1.0.0",
  ambiente: "producao_local",
  
  // Chaves padronizadas de armazenamento no LocalStorage (com namespacing institucional rn_)
  storage_keys: {
    lgpd_consentimento: "rn_lgpd_consentimento",
    carrinho_atual: "rn_carrinho_atual",
    cliente_sessao: "rn_cliente_sessao",
    historico_pedidos: "rn_historico_pedidos",
    schema_version: "rn_schema_version",
    pedido_ativo: "rn_pedido_ativo"
  },
  
  // Parâmetros do Programa de Fidelidade
  fidelidade: {
    pontos_por_real: 10,
    saldo_padrao: 150
  },
  
  // Parâmetros de Usabilidade do Totem
  totem: {
    min_touch_target_px: 48,
    resolucao_proporcao: "9/16"
  },
  
  // Textos Regulatórios da LGPD
  lgpd: {
    versao_termos: "1.0",
    texto_cookies: "Utilizamos cookies e armazenamento local para viabilizar seus pedidos e personalizar benefícios de acordo com a LGPD.",
    texto_consentimento: "Li e concordo com os Termos de Privacidade e autorizo o tratamento dos meus dados para emissão do pedido e acúmulo de pontos de fidelidade."
  }
};
