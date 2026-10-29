/**
 * Raízes do Nordeste - Frente de Caixa Multicanal
 * Orquestrador Central e Ponto de Entrada da SPA (js/app.js)
 * Conforme especificado em docs/FSD.md
 */

import { CONFIG } from '../config/config.js';
import { MOCK_DATA } from './models/mockData.js';
import { storageService } from './models/storage.js';

class App {
  constructor() {
    this.config = CONFIG;
    this.mockData = MOCK_DATA;
    this.storage = storageService;
    this.initialized = false;
  }

  /**
   * Inicializa o ciclo de vida da aplicação
   */
  async init() {
    console.info(`[${this.config.app_nome}] Inicializando versão ${this.config.versao} (${this.config.ambiente})...`);
    
    // Inicialização da camada de persistência com semente de dados simulados
    this.storage.initStorage(this.mockData);

    // Registro de auditoria no console sobre a prontidão dos dados
    console.info(`[${this.config.app_nome}] Camada de persistência inicializada. Storage ativo: ${this.storage.isStorageAvailable() ? 'LocalStorage' : 'Contingência memoryStore'}.`);
    console.info(`[${this.config.app_nome}] Filiais carregadas: ${this.mockData.filiais.length} | Pratos no cardápio: ${this.mockData.cardapio.length}`);

    // Atualização dos ícones Lucide
    if (window.lucide) {
      window.lucide.createIcons();
    }

    this.initialized = true;
    console.info(`[${this.config.app_nome}] Fase 2 pronta: Modelos e Persistência carregados com sucesso.`);
  }
}

// Instanciação e disparo no carregamento do DOM
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init().catch(err => console.error('Erro na inicialização da aplicação:', err));

  // Disponibilização no escopo global para facilitar inspeção e testes da banca acadêmica
  window.__RN_APP__ = app;
  window.__RN_STORAGE__ = storageService;
  window.__RN_MOCK__ = MOCK_DATA;
});

export default App;
