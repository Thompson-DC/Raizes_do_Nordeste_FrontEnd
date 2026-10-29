/**
 * Raízes do Nordeste - Frente de Caixa Multicanal
 * Orquestrador Central e Ponto de Entrada da SPA (js/app.js)
 * Conforme especificado em docs/FSD.md
 */

import { CONFIG } from '../config/config.js';

class App {
  constructor() {
    this.config = CONFIG;
    this.initialized = false;
  }

  /**
   * Inicializa o ciclo de vida da aplicação
   */
  async init() {
    console.info(`[${this.config.app_nome}] Inicializando versão ${this.config.versao} (${this.config.ambiente})...`);
    
    // Verificação de ambiente e suporte a Web Storage
    this.checkEnvironment();

    // Atualização dos ícones Lucide
    if (window.lucide) {
      window.lucide.createIcons();
    }

    this.initialized = true;
    console.info(`[${this.config.app_nome}] Infraestrutura base pronta para acoplamento dos módulos.`);
  }

  /**
   * Valida compatibilidade básica do navegador
   */
  checkEnvironment() {
    try {
      const testKey = '__rn_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
    } catch (e) {
      console.warn(`[${this.config.app_nome}] Web Storage restrito. O sistema utilizará contingência em memória.`);
    }
  }
}

// Instanciação e disparo no carregamento do DOM
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init().catch(err => console.error('Erro na inicialização da aplicação:', err));
});

export default App;
