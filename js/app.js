/**
 * Raízes do Nordeste - Frente de Caixa Multicanal
 * Orquestrador Central e Ponto de Entrada da SPA (js/app.js)
 * Conforme especificado em docs/FSD.md
 */

import { CONFIG } from '../config/config.js';
import { MOCK_DATA } from './models/mockData.js';
import { storageService } from './models/storage.js';
import { channelController } from './controllers/channelController.js';
import { wireframeController } from './controllers/wireframeController.js';
import { branchController } from './controllers/branchController.js';

class App {
  constructor() {
    this.config = CONFIG;
    this.mockData = MOCK_DATA;
    this.storage = storageService;
    this.channelController = channelController;
    this.wireframeController = wireframeController;
    this.branchController = branchController;
    this.initialized = false;
  }

  /**
   * Inicializa o ciclo de vida da aplicação
   */
  async init() {
    console.info(`[${this.config.app_nome}] Inicializando versão ${this.config.versao} (${this.config.ambiente})...`);
    
    // 1. Inicialização da camada de persistência com semente de dados simulados
    this.storage.initStorage(this.mockData);
    console.info(`[${this.config.app_nome}] Persistência inicializada: ${this.storage.isStorageAvailable() ? 'LocalStorage' : 'Contingência memoryStore'}.`);

    // 2. Inicialização dos controladores de auditoria e multicanalidade (Fase 3)
    this.channelController.init('web');
    this.wireframeController.init();
    console.info(`[${this.config.app_nome}] Simulador Multicanal e Modo Wireframe inicializados.`);

    // 3. Inicialização do controlador de filiais (Fase 4)
    this.branchController.init();
    console.info(`[${this.config.app_nome}] Localização e Seleção de Filiais inicializadas.`);

    // 4. Atualização e renderização dos ícones Lucide
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }

    this.initialized = true;
    console.info(`[${this.config.app_nome}] Fase 4 pronta: Localização e Seleção de Filiais ativas.`);
  }
}

// Instanciação e disparo no carregamento do DOM
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init().catch(err => console.error('Erro na inicialização da aplicação:', err));

  // Disponibilização no escopo global para auditoria técnica e acadêmica
  window.__RN_APP__ = app;
  window.__RN_STORAGE__ = storageService;
  window.__RN_MOCK__ = MOCK_DATA;
  window.__RN_CHANNEL__ = channelController;
  window.__RN_WIREFRAME__ = wireframeController;
  window.__RN_BRANCH__ = branchController;
});

export default App;
