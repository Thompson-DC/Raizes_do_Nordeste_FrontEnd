/**
 * Raízes do Nordeste - Frente de Caixa Multicanal
 * Model: Camada de Persistência com Fallback em Memória (js/models/storage.js)
 * Conforme especificado em docs/FSD.md (Seções 9.1, 11.2, 11.4 e 19.1)
 */

import { CONFIG } from '../../config/config.js';

class StorageService {
  constructor() {
    this.memoryStore = {};
    this.storageAvailable = this._testStorage();
  }

  /**
   * Testa a disponibilidade real do localStorage
   * @private
   * @returns {boolean}
   */
  _testStorage() {
    try {
      const testKey = '__rn_storage_probe__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      console.warn('[StorageService] LocalStorage indisponível ou bloqueado. Ativando contingência memoryStore.', e);
      return false;
    }
  }

  /**
   * Informa se o localStorage nativo está operacional
   * @returns {boolean}
   */
  isStorageAvailable() {
    return this.storageAvailable;
  }

  /**
   * Recupera um item serializado do storage ou da contingência em memória
   * @param {string} key 
   * @param {*} [defaultValue=null] 
   * @returns {*}
   */
  getItem(key, defaultValue = null) {
    if (this.storageAvailable) {
      try {
        const raw = window.localStorage.getItem(key);
        if (raw === null || raw === undefined) {
          return defaultValue;
        }
        return JSON.parse(raw);
      } catch (err) {
        console.error(`[StorageService] Falha ao ler ou converter a chave "${key}". Recorrendo à contingência.`, err);
        return Object.prototype.hasOwnProperty.call(this.memoryStore, key) 
          ? this.memoryStore[key] 
          : defaultValue;
      }
    } else {
      return Object.prototype.hasOwnProperty.call(this.memoryStore, key)
        ? this.memoryStore[key]
        : defaultValue;
    }
  }

  /**
   * Grava um valor serializável no storage ou na contingência em memória
   * @param {string} key 
   * @param {*} value 
   * @returns {boolean} Indicador de sucesso
   */
  setItem(key, value) {
    // Mantém sempre uma cópia sincronizada na contingência em memória
    this.memoryStore[key] = value;

    if (this.storageAvailable) {
      try {
        const serialized = JSON.stringify(value);
        window.localStorage.setItem(key, serialized);
        return true;
      } catch (err) {
        console.error(`[StorageService] Erro ao gravar chave "${key}" no LocalStorage (possível cota excedida). Mantendo em memória.`, err);
        this.storageAvailable = false;
        return true;
      }
    }
    return true;
  }

  /**
   * Remove uma chave do storage e da contingência em memória
   * @param {string} key 
   * @returns {boolean}
   */
  removeItem(key) {
    delete this.memoryStore[key];
    if (this.storageAvailable) {
      try {
        window.localStorage.removeItem(key);
        return true;
      } catch (err) {
        console.error(`[StorageService] Falha ao remover chave "${key}".`, err);
      }
    }
    return true;
  }

  /**
   * Limpa exclusivamente as chaves da aplicação (com prefixo institucional rn_)
   */
  clear() {
    this.memoryStore = {};
    if (this.storageAvailable) {
      try {
        const keysToRemove = [];
        for (let i = 0; i < window.localStorage.length; i++) {
          const k = window.localStorage.key(i);
          if (k && k.startsWith('rn_')) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach(k => window.localStorage.removeItem(k));
      } catch (err) {
        console.error('[StorageService] Falha ao limpar chaves da aplicação.', err);
      }
    }
  }

  /**
   * Inicialização Idempotente do Schema e Dados Simulados Iniciais
   * Conforme especificado em docs/FSD.md (Seção 11.4)
   * @param {Object} mockData 
   */
  initStorage(mockData) {
    const schemaKey = CONFIG.storage_keys.schema_version;
    const currentVersion = this.getItem(schemaKey);

    // Se já foi inicializado com a mesma versão, mantém os dados do usuário intactos
    if (currentVersion === CONFIG.versao) {
      // Garante integridade básica das chaves essenciais se alguma foi apagada manualmente
      this._ensureKeyIntegrity(mockData);
      return;
    }

    console.info(`[StorageService] Aplicando migração/semente inicial de dados para a versão ${CONFIG.versao}...`);

    // Semeia dados iniciais preservando o isolamento
    this.setItem(schemaKey, CONFIG.versao);

    // Cliente da sessão local
    if (!this.getItem(CONFIG.storage_keys.cliente_sessao)) {
      this.setItem(CONFIG.storage_keys.cliente_sessao, { ...mockData.cliente_padrao });
    }

    // Carrinho inicial vazio vinculado à filial padrão (Recife Antigo)
    if (!this.getItem(CONFIG.storage_keys.carrinho_atual)) {
      this.setItem(CONFIG.storage_keys.carrinho_atual, {
        filial_id: mockData.filiais[0].id,
        itens: [],
        subtotal: 0,
        pontos_usados: 0,
        valor_desconto: 0,
        total: 0,
        consentimento_lgpd: false
      });
    }

    // Histórico de pedidos inicial
    if (!this.getItem(CONFIG.storage_keys.historico_pedidos)) {
      this.setItem(CONFIG.storage_keys.historico_pedidos, []);
    }
  }

  /**
   * Assegura a integridade das chaves obrigatórias caso alguma tenha sido perdida
   * @private
   * @param {Object} mockData 
   */
  _ensureKeyIntegrity(mockData) {
    if (!this.getItem(CONFIG.storage_keys.carrinho_atual)) {
      this.setItem(CONFIG.storage_keys.carrinho_atual, {
        filial_id: mockData.filiais[0].id,
        itens: [],
        subtotal: 0,
        pontos_usados: 0,
        valor_desconto: 0,
        total: 0,
        consentimento_lgpd: false
      });
    }
    if (!this.getItem(CONFIG.storage_keys.cliente_sessao)) {
      this.setItem(CONFIG.storage_keys.cliente_sessao, { ...mockData.cliente_padrao });
    }
    if (!this.getItem(CONFIG.storage_keys.historico_pedidos)) {
      this.setItem(CONFIG.storage_keys.historico_pedidos, []);
    }
  }

  // ==========================================
  // Métodos Especializados de Domínio da Aplicação
  // ==========================================

  /**
   * Obtém o estado ativo do carrinho
   * @returns {Object}
   */
  getCart() {
    return this.getItem(CONFIG.storage_keys.carrinho_atual, {
      filial_id: "recife-antigo",
      itens: [],
      subtotal: 0,
      pontos_usados: 0,
      valor_desconto: 0,
      total: 0,
      consentimento_lgpd: false
    });
  }

  /**
   * Persiste o estado do carrinho
   * @param {Object} cart 
   * @returns {boolean}
   */
  saveCart(cart) {
    return this.setItem(CONFIG.storage_keys.carrinho_atual, cart);
  }

  /**
   * Reseta o carrinho para uma nova jornada mantendo a filial informada ou a atual
   * @param {string} [filialId]
   * @returns {Object} Novo carrinho limpo
   */
  resetCart(filialId) {
    const current = this.getCart();
    const cleanCart = {
      filial_id: filialId || current.filial_id || "recife-antigo",
      itens: [],
      subtotal: 0,
      pontos_usados: 0,
      valor_desconto: 0,
      total: 0,
      consentimento_lgpd: false
    };
    this.saveCart(cleanCart);
    return cleanCart;
  }

  /**
   * Obtém os dados do cliente em sessão
   * @returns {Object}
   */
  getClient() {
    return this.getItem(CONFIG.storage_keys.cliente_sessao, null);
  }

  /**
   * Atualiza e persiste os dados do cliente em sessão
   * @param {Object} client 
   * @returns {boolean}
   */
  saveClient(client) {
    return this.setItem(CONFIG.storage_keys.cliente_sessao, client);
  }

  /**
   * Obtém o registro de consentimento de cookies da LGPD
   * @returns {Object|null}
   */
  getLGPDConsent() {
    return this.getItem(CONFIG.storage_keys.lgpd_consentimento, null);
  }

  /**
   * Grava o consentimento de cookies da LGPD com data/hora e versão
   * @param {boolean} [accepted=true]
   * @returns {boolean}
   */
  saveLGPDConsent(accepted = true) {
    const consentPayload = {
      data_hora: new Date().toISOString(),
      versao: CONFIG.lgpd.versao_termos,
      cookies_aceitos: accepted
    };
    return this.setItem(CONFIG.storage_keys.lgpd_consentimento, consentPayload);
  }

  /**
   * Obtém o histórico completo de pedidos auditados
   * @returns {Array}
   */
  getOrders() {
    return this.getItem(CONFIG.storage_keys.historico_pedidos, []);
  }

  /**
   * Acrescenta um novo pedido ao histórico auditado
   * @param {Object} order 
   * @returns {boolean}
   */
  saveOrder(order) {
    const orders = this.getOrders();
    orders.unshift(order); // Insere no início para ordem decrescente
    return this.setItem(CONFIG.storage_keys.historico_pedidos, orders);
  }

  /**
   * Obtém o pedido ativo em produção ou finalizado na sessão local
   * @returns {Object|null}
   */
  getActiveOrder() {
    return this.getItem(CONFIG.storage_keys.pedido_ativo, null);
  }

  /**
   * Grava o pedido ativo na sessão local
   * @param {Object} order 
   * @returns {boolean}
   */
  saveActiveOrder(order) {
    return this.setItem(CONFIG.storage_keys.pedido_ativo, order);
  }

  /**
   * Limpa a referência de pedido ativo na sessão local
   * @returns {boolean}
   */
  clearActiveOrder() {
    return this.removeItem(CONFIG.storage_keys.pedido_ativo);
  }
}

// Exporta instância única (Singleton) da camada de persistência
export const storageService = new StorageService();
export default storageService;
