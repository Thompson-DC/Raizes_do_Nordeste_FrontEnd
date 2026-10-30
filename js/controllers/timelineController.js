/**
 * Raízes do Nordeste - Frente de Caixa Multicanal
 * Controller da Linha do Tempo de Produção (Stepper) (js/controllers/timelineController.js)
 * Conforme especificado em docs/FSD.md (Módulos 6.9, 12.8, 13.6, 14.5 e 18.2)
 */

import { CONFIG } from '../../config/config.js';
import { storageService } from '../models/storage.js';
import { timelineView } from '../views/timelineView.js';

export class TimelineController {
  constructor() {
    this.container = null;
    this.activeOrder = null;
    this.currentStep = 1; // 1: 'received', 2: 'preparing', 3: 'ready'
    this.stepDuration = 4; // 4 segundos por etapa conforme FSD 6.9 e 14.5
    this.timeRemaining = 4;
    this.timerInterval = null;
    this.isAutoPlaying = true;
    this.isVisible = false;
  }

  /**
   * Inicializa o controlador da Linha do Tempo e registra ouvintes de eventos globais
   */
  init() {
    this.container = document.getElementById('timeline-container');
    if (!this.container) {
      console.warn('[TimelineController] Container #timeline-container não encontrado no DOM inicial.');
    }

    // Escuta evento disparado pelo checkoutController quando a transição para a timeline ocorre
    window.addEventListener('rn:order-created', (e) => {
      if (e.detail && e.detail.order) {
        this.startTimeline(e.detail.order);
      }
    });

    // Escuta também rn:order-approved como redundância segura
    window.addEventListener('rn:order-approved', (e) => {
      if (e.detail && e.detail.order && !this.activeOrder) {
        this.activeOrder = e.detail.order;
      }
    });

    // Verifica se já existe um pedido em andamento gravado no histórico (para persistência no F5)
    this._restoreActiveOrderFromStorage();

    console.info(`[TimelineController] Módulo de Linha do Tempo (Stepper) inicializado.`);
  }

  /**
   * Inicia o fluxo visual da Linha do Tempo com um pedido aprovado
   * @param {Object} order Pedido aprovado
   */
  startTimeline(order) {
    if (!order) return;

    this._clearTimer();
    this.activeOrder = { ...order };
    this.currentStep = this._mapStatusToStep(order.status_preparo || 'Recebido');
    this.timeRemaining = this.stepDuration;
    this.isAutoPlaying = this.currentStep < 3;
    this.isVisible = true;

    // Retém o pedido ativo na sessão local para persistência no F5 (inclusive se Pronto para Retirada)
    storageService.saveActiveOrder(this.activeOrder);

    // Ajusta a visibilidade dos containers principais (oculta catálogo e exibe timeline)
    this._toggleMainVisibility(true);

    this.render();

    // Inicia a contagem regressiva automática de 4 segundos apenas se não estiver pronto
    if (this.currentStep < 3) {
      this._startAutoTimer();
    }

    console.info(`[TimelineController] Linha do Tempo iniciada para o pedido ${order.numero_sequencial}. Etapa: ${this._getStepLabel(this.currentStep)}.`);
  }

  /**
   * Avança manualmente para a próxima etapa do stepper (Regra FSD 6.9)
   */
  nextStep() {
    if (this.currentStep >= 3) return;

    this.setStep(this.currentStep + 1);
    console.info(`[TimelineController] Avanço manual: Etapa ${this._getStepLabel(this.currentStep)}.`);
  }

  /**
   * Retorna manualmente para a etapa anterior do stepper (Regra FSD 6.9)
   */
  prevStep() {
    if (this.currentStep <= 1) return;

    this.setStep(this.currentStep - 1);
    console.info(`[TimelineController] Recuo manual: Etapa ${this._getStepLabel(this.currentStep)}.`);
  }

  /**
   * Define pontualmente a etapa do stepper e atualiza a persistência
   * @param {number} step (1, 2 ou 3)
   */
  setStep(step) {
    if (step < 1 || step > 3) return;

    this.currentStep = step;
    this.timeRemaining = this.stepDuration;

    // Atualiza o status de preparo do pedido no histórico
    const statusLabel = this._getStepLabel(this.currentStep);
    this._updateOrderStatusInHistory(statusLabel);

    if (this.currentStep === 3) {
      this.isAutoPlaying = false;
      this._clearTimer();
    }

    this.render();

    // Emite evento para auditoria técnica
    window.dispatchEvent(new CustomEvent('rn:timeline-step-changed', {
      detail: {
        orderId: this.activeOrder ? this.activeOrder.id : null,
        orderSeq: this.activeOrder ? this.activeOrder.numero_sequencial : null,
        step: this.currentStep,
        statusLabel: statusLabel
      }
    }));
  }

  /**
   * Alterna entre pausar e retomar o temporizador automático de 4s
   */
  toggleTimer() {
    if (this.currentStep >= 3) return;

    this.isAutoPlaying = !this.isAutoPlaying;

    if (this.isAutoPlaying) {
      this._startAutoTimer();
    } else {
      this._clearTimer();
    }

    this.render();
    console.info(`[TimelineController] Temporizador automático ${this.isAutoPlaying ? 'RETOMADO' : 'PAUSADO'}.`);
  }

  /**
   * Reinicia o fluxo para um novo pedido (Regra FSD 12.8 e 18.2)
   * Reseta o carrinho com segurança e retorna à tela de catálogo
   */
  startNewOrder() {
    this._clearTimer();
    this.activeOrder = null;
    this.currentStep = 1;
    this.isVisible = false;

    // Limpa a referência de pedido ativo na sessão local
    storageService.clearActiveOrder();

    // Reseta a sacola de compras com segurança através do storage
    storageService.resetCart();

    // Dispara eventos de atualização da sacola e início de novo pedido
    window.dispatchEvent(new CustomEvent('rn:new-order-started'));
    window.dispatchEvent(new CustomEvent('rn:cart-updated', {
      detail: { cart: storageService.getCart() }
    }));

    // Retorna a visualização para o catálogo geral
    this._toggleMainVisibility(false);

    // Rola a página para o topo suavemente
    window.scrollTo({ top: 0, behavior: 'smooth' });

    console.info(`[TimelineController] Novo pedido iniciado. Pedido ativo limpo, sacola resetada e catálogo reexibido.`);
  }

  /**
   * Retorna para visualização do cardápio sem descartar o pedido em andamento
   */
  backToMenu() {
    this._toggleMainVisibility(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    console.info(`[TimelineController] Visualização alternada para o catálogo (pedido permanece em andamento em segundo plano).`);
  }

  /**
   * Reabre a linha do tempo do pedido ativo
   */
  showTimeline() {
    if (!this.activeOrder) return;
    this._toggleMainVisibility(true);
    this.render();
  }

  /**
   * Renderiza a visualização da Linha do Tempo
   */
  render() {
    if (!this.container) {
      this.container = document.getElementById('timeline-container');
      if (!this.container) return;
    }

    timelineView.render(
      this.container,
      {
        order: this.activeOrder,
        currentStep: this.currentStep,
        isAutoPlaying: this.isAutoPlaying,
        timeRemaining: this.timeRemaining,
        stepDuration: this.stepDuration
      },
      {
        onPrevStep: () => this.prevStep(),
        onNextStep: () => this.nextStep(),
        onToggleTimer: () => this.toggleTimer(),
        onNewOrder: () => this.startNewOrder(),
        onBackMenu: () => this.backToMenu()
      }
    );
  }

  /**
   * Inicia o intervalo de contagem regressiva de segundo a segundo
   * @private
   */
  _startAutoTimer() {
    this._clearTimer();

    this.timerInterval = setInterval(() => {
      if (!this.isAutoPlaying) return;

      this.timeRemaining -= 1;

      if (this.timeRemaining <= 0) {
        if (this.currentStep < 3) {
          this.setStep(this.currentStep + 1);
        } else {
          this._clearTimer();
          this.isAutoPlaying = false;
        }
      } else {
        timelineView.updateStepOnly(
          this.container,
          this.currentStep,
          this.timeRemaining,
          this.isAutoPlaying
        );
      }
    }, 1000);
  }

  /**
   * Limpa o timer ativo
   * @private
   */
  _clearTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  /**
   * Alterna a visibilidade entre o Catálogo de Produtos e a Linha do Tempo
   * @private
   * @param {boolean} showTimeline 
   */
  _toggleMainVisibility(showTimeline) {
    const catalogSection = document.getElementById('catalog-section');
    const cartAside = document.getElementById('cart-aside');
    const mobileCartBar = document.getElementById('mobile-cart-bar');
    const branchesContainer = document.getElementById('branches-container');
    const categoriesContainer = document.getElementById('categories-container');
    const menuGridContainer = document.getElementById('menu-grid-container');

    if (!this.container) {
      this.container = document.getElementById('timeline-container');
    }

    if (showTimeline) {
      if (this.container) this.container.classList.remove('hidden');
      if (catalogSection) catalogSection.classList.add('hidden');
      if (branchesContainer) branchesContainer.classList.add('hidden');
      if (categoriesContainer) categoriesContainer.classList.add('hidden');
      if (menuGridContainer) menuGridContainer.classList.add('hidden');
      if (cartAside) cartAside.classList.add('hidden');
      if (mobileCartBar) mobileCartBar.classList.add('hidden');
    } else {
      if (this.container) this.container.classList.add('hidden');
      if (catalogSection) catalogSection.classList.remove('hidden');
      if (branchesContainer) branchesContainer.classList.remove('hidden');
      if (categoriesContainer) categoriesContainer.classList.remove('hidden');
      if (menuGridContainer) menuGridContainer.classList.remove('hidden');
      if (cartAside) cartAside.classList.remove('hidden');
      if (mobileCartBar) mobileCartBar.classList.remove('hidden');
    }
  }

  /**
   * Atualiza o status do pedido dentro do histórico persistido e na sessão local
   * @private
   * @param {string} newStatus 
   */
  _updateOrderStatusInHistory(newStatus) {
    if (!this.activeOrder) return;

    this.activeOrder.status_preparo = newStatus;

    try {
      // 1. Atualiza no array de histórico
      const orders = storageService.getOrders();
      const updatedOrders = orders.map(ord => {
        if (ord.id === this.activeOrder.id || ord.numero_sequencial === this.activeOrder.numero_sequencial) {
          return { ...ord, status_preparo: newStatus };
        }
        return ord;
      });
      storageService.setItem(CONFIG.storage_keys.historico_pedidos, updatedOrders);

      // 2. Atualiza na referência de pedido ativo na sessão local
      storageService.saveActiveOrder(this.activeOrder);
    } catch (err) {
      console.warn('[TimelineController] Erro ao sincronizar status do pedido no histórico:', err);
    }
  }

  /**
   * Restaura o pedido ativo caso a página seja recarregada (F5) conforme FSD 18.2
   * Garante a retenção inclusive quando o status for "Pronto para Retirada"
   * @private
   */
  _restoreActiveOrderFromStorage() {
    try {
      // 1. Prioridade: recupera da chave de pedido ativo na sessão local (rn_pedido_ativo)
      const activeOrder = storageService.getActiveOrder();
      if (activeOrder) {
        console.info(`[TimelineController] Pedido ativo ${activeOrder.numero_sequencial} restaurado da sessão local (status: ${activeOrder.status_preparo}).`);
        this.startTimeline(activeOrder);
        return;
      }

      // 2. Contingência pelo histórico recente se ainda houver pedido em produção (< 2h)
      const orders = storageService.getOrders();
      if (Array.isArray(orders) && orders.length > 0) {
        const latestOrder = orders[0];
        const orderTime = new Date(latestOrder.data_hora).getTime();
        const now = new Date().getTime();
        const diffHours = (now - orderTime) / (1000 * 60 * 60);

        if (diffHours < 2) {
          const step = this._mapStatusToStep(latestOrder.status_preparo || 'Recebido');
          // Se ainda em produção (não finalizado e não pronto), restaura
          if (step < 3) {
            console.info(`[TimelineController] Pedido recente ${latestOrder.numero_sequencial} restaurado do histórico.`);
            this.startTimeline(latestOrder);
          }
        }
      }
    } catch (err) {
      console.warn('[TimelineController] Falha ao verificar pedidos anteriores:', err);
    }
  }

  /**
   * Converte a string de status de preparo para o índice numérico da etapa
   * @private
   * @param {string} status 
   * @returns {number}
   */
  _mapStatusToStep(status) {
    switch (status) {
      case 'Recebido':
        return 1;
      case 'Em Preparo':
        return 2;
      case 'Pronto':
      case 'Pronto para Retirada':
        return 3;
      default:
        return 1;
    }
  }

  /**
   * Retorna o rótulo textual oficial da etapa
   * @private
   * @param {number} step 
   * @returns {string}
   */
  _getStepLabel(step) {
    switch (step) {
      case 1:
        return 'Recebido';
      case 2:
        return 'Em Preparo';
      case 3:
        return 'Pronto';
      default:
        return 'Recebido';
    }
  }
}

export const timelineController = new TimelineController();
export default timelineController;
