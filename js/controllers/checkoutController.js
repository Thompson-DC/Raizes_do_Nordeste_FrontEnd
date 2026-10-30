/**
 * Raízes do Nordeste - Frente de Caixa Multicanal
 * Controller do Modal Mock de Gateway de Pagamento (js/controllers/checkoutController.js)
 * Conforme especificado em docs/FSD.md (Módulo 8, 12.7, 13.6 e 13.7)
 */

import { CONFIG } from '../../config/config.js';
import { storageService } from '../models/storage.js';
import { checkoutView } from '../views/checkoutView.js';

export class CheckoutController {
  constructor() {
    this.container = null;
    this.isOpen = false;
    this.currentMethod = 'pix';
    this.activeCart = null;
    this.activeClient = null;
    this.activeBranch = null;
    this.status = 'idle'; // 'idle' | 'processing' | 'approved' | 'rejected'
    this.countdownTimer = null;
    this.allowedMethods = ['pix', 'credit', 'debit', 'cash'];
  }

  /**
   * Inicializa o controlador e registra os ouvintes de eventos da aplicação
   */
  init() {
    this.container = document.getElementById('modal-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'modal-container';
      this.container.className = 'relative z-50';
      document.body.appendChild(this.container);
    }

    // Escuta evento disparado pelo cartController quando o usuário clica em "Ir para Pagamento" (Fase 8)
    window.addEventListener('rn:cart-checkout', (e) => {
      if (e.detail) {
        const { cart, client, branch } = e.detail;
        this.openCheckout(cart, client, branch);
      }
    });

    // Fechar modal ao pressionar tecla ESC (acessibilidade WCAG)
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen && this.status !== 'approved') {
        this.closeCheckout();
      }
    });

    console.info(`[CheckoutController] Módulo de Gateway de Pagamento Mockado inicializado com sucesso.`);
  }

  /**
   * Abre o modal de checkout com os dados consolidados da compra
   * @param {Object} cart Carrinho atualizado
   * @param {Object} client Dados de contato e sessão do cliente
   * @param {Object} branch Filial ativa de retirada
   */
  openCheckout(cart, client, branch) {
    if (!cart || !Array.isArray(cart.itens) || cart.itens.length === 0) {
      console.warn('[CheckoutController] Tentativa de abrir checkout com sacola vazia bloqueada.');
      return;
    }

    this.activeCart = { ...cart };
    this.activeClient = client ? { ...client } : (storageService.getClient() || { nome: 'Cliente', telefone: '' });
    this.activeBranch = branch || { id: 'recife-antigo', nome: 'Recife Antigo - Matriz' };
    this.currentMethod = 'pix';
    this.status = 'idle';
    this.isOpen = true;

    this.render();

    console.info(`[CheckoutController] Checkout aberto para "${this.activeClient.nome}". Total: R$ ${this.activeCart.total.toFixed(2)}. Forma: ${this.currentMethod.toUpperCase()}`);
  }

  /**
   * Altera a forma de pagamento selecionada com sanitização estrita
   * @param {string} method 
   */
  selectMethod(method) {
    if (!this.allowedMethods.includes(method)) {
      console.warn(`[CheckoutController] Método de pagamento inválido ignorado: ${method}`);
      return;
    }

    this.currentMethod = method;
    checkoutView.updateSelectedMethod(
      this.container,
      this.currentMethod,
      this.activeCart ? this.activeCart.total : 0,
      () => this.copyPixCode()
    );

    // Emite evento customizado para auditoria
    window.dispatchEvent(new CustomEvent('rn:payment-method-selected', {
      detail: {
        method: this.currentMethod,
        methodLabel: this._getMethodLabel(this.currentMethod)
      }
    }));

    console.info(`[CheckoutController] Forma de pagamento selecionada: ${this._getMethodLabel(this.currentMethod)}`);
  }

  /**
   * Copia o código PIX simulado para a área de transferência do usuário
   */
  async copyPixCode() {
    const codeEl = this.container ? this.container.querySelector('#pix-mock-code') : null;
    const labelEl = this.container ? this.container.querySelector('#copy-pix-label') : null;
    const textToCopy = codeEl ? codeEl.textContent : '00020126580014br.gov.bcb.pix...';

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback para navegadores sem permissão de clipboard
        const tempInput = document.createElement('textarea');
        tempInput.value = textToCopy;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }

      if (labelEl) {
        const originalText = labelEl.textContent;
        labelEl.textContent = 'Copiado!';
        labelEl.classList.add('text-[#25D366]');
        setTimeout(() => {
          if (labelEl) {
            labelEl.textContent = originalText;
            labelEl.classList.remove('text-[#25D366]');
          }
        }, 2000);
      }
    } catch (err) {
      console.warn('[CheckoutController] Não foi possível copiar para a área de transferência:', err);
    }
  }

  /**
   * Ação de Teste do Gateway: FORÇAR APROVAÇÃO (Sucesso)
   * Conforme especificado na Seção 6.8 e 13.6 do FSD
   */
  forceApproval() {
    if (this.status === 'approved') return;

    this.status = 'approved';

    // 1. Gera código sequencial amigável para balcão (#RN-1042...)
    const existingOrders = storageService.getOrders();
    const nextSeqNumber = `#RN-${1040 + existingOrders.length + 1}`;
    const orderId = `RN-${new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14)}`;

    // 2. Monta o objeto oficial do Pedido conforme Esquema FSD 10.7 e 11.2
    const approvedOrder = {
      id: orderId,
      numero_sequencial: nextSeqNumber,
      data_hora: new Date().toISOString(),
      filial: {
        id: this.activeBranch.id,
        nome: this.activeBranch.nome
      },
      cliente: {
        nome: this.activeClient.nome,
        telefone: this.activeClient.telefone
      },
      itens: Array.isArray(this.activeCart.itens) 
        ? this.activeCart.itens.map(item => ({ ...item })) 
        : [],
      subtotal: Number(this.activeCart.subtotal) || 0,
      desconto_fidelidade: Number(this.activeCart.valor_desconto) || 0,
      total_pago: Number(this.activeCart.total) || 0,
      forma_pagamento: this._getMethodLabel(this.currentMethod),
      status_transacao: 'Aprovado',
      status_preparo: 'Recebido'
    };

    // 3. Persiste o pedido aprovado no LocalStorage através de storageService
    storageService.saveOrder(approvedOrder);
    storageService.saveActiveOrder(approvedOrder);

    // 4. Emite evento institucional de aprovação do pedido
    window.dispatchEvent(new CustomEvent('rn:order-approved', {
      detail: {
        order: approvedOrder,
        method: this.currentMethod
      }
    }));

    // 5. Renderiza a transição visual de SUCESSO (Verde Macaxeira #25D366)
    checkoutView.renderApprovalState(
      this.container,
      approvedOrder,
      () => this.proceedToTimeline(approvedOrder)
    );

    // 6. Transição automática temporizada após 1,5 segundos (Regra FSD 13.6)
    let remainingMs = 1500;
    const interval = 100;
    const countdownEl = this.container.querySelector('#approval-countdown');

    this.countdownTimer = setInterval(() => {
      remainingMs -= interval;
      if (countdownEl && remainingMs >= 0) {
        countdownEl.textContent = `${(remainingMs / 1000).toFixed(1)}s`;
      }
      if (remainingMs <= 0) {
        clearInterval(this.countdownTimer);
        this.countdownTimer = null;
        this.proceedToTimeline(approvedOrder);
      }
    }, interval);

    console.info(`[CheckoutController] SUCESSO! Pedido ${approvedOrder.numero_sequencial} aprovado via ${approvedOrder.forma_pagamento}. Gravado no histórico.`);
  }

  /**
   * Ação de Teste do Gateway: FORÇAR RECUSA (Falha simulada com retentativa)
   * Conforme especificado na Seção 6.8 e 13.7 do FSD
   */
  forceRejection() {
    this.status = 'rejected';

    // Emite evento de auditoria da recusa simulada
    window.dispatchEvent(new CustomEvent('rn:order-rejected', {
      detail: {
        reason: 'Transação Não Autorizada pela Operadora (Retorno Simulado 51)',
        method: this.currentMethod,
        timestamp: new Date().toISOString()
      }
    }));

    // Renderiza a transição visual de RECUSA (Vermelho Erro #BA1A1A)
    checkoutView.renderRejectionState(this.container, {
      onRetry: () => this.retryPayment(),
      onCancel: () => this.closeCheckout()
    });

    console.warn(`[CheckoutController] SIMULAÇÃO DE RECUSA: Transação negada para o método ${this._getMethodLabel(this.currentMethod)}. Carrinho preservado integralmente.`);
  }

  /**
   * Permite retentar o pagamento após uma recusa mantendo os itens salvos (Regra FSD 13.7)
   */
  retryPayment() {
    this._clearTimers();
    this.status = 'idle';
    this.render();
    console.info(`[CheckoutController] Retentativa de pagamento acionada. Retornando ao seletor de métodos.`);
  }

  /**
   * Transiciona o usuário para a Linha do Tempo de Produção (Fase 10)
   * @param {Object} order Pedido aprovado
   */
  proceedToTimeline(order) {
    this._clearTimers();
    this.closeCheckout();

    // Emite evento para que o módulo de Linha do Tempo (Fase 10) apresente o pedido
    window.dispatchEvent(new CustomEvent('rn:order-created', {
      detail: {
        order: order
      }
    }));

    console.info(`[CheckoutController] Transição para Linha do Tempo disparada para o pedido: ${order.numero_sequencial}`);
  }

  /**
   * Fecha o modal e limpa os estados transitórios
   */
  closeCheckout() {
    this._clearTimers();
    checkoutView.closeModal(this.container);
    this.isOpen = false;
    this.status = 'idle';
  }

  /**
   * Limpa timers e intervalos pendentes
   * @private
   */
  _clearTimers() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
  }

  /**
   * Retorna o rótulo legível do método de pagamento
   * @private
   * @param {string} method 
   * @returns {string}
   */
  _getMethodLabel(method) {
    switch (method) {
      case 'pix':
        return 'PIX Instantâneo';
      case 'credit':
        return 'Cartão de Crédito';
      case 'debit':
        return 'Cartão de Débito';
      case 'cash':
        return 'Dinheiro / Balcão';
      default:
        return 'PIX Instantâneo';
    }
  }

  /**
   * Renderiza a visualização do modal
   */
  render() {
    if (!this.container) return;

    checkoutView.renderModal(
      this.container,
      {
        cart: this.activeCart,
        client: this.activeClient,
        branch: this.activeBranch,
        currentMethod: this.currentMethod
      },
      {
        onSelectMethod: (method) => this.selectMethod(method),
        onForceApprove: () => this.forceApproval(),
        onForceReject: () => this.forceRejection(),
        onClose: () => this.closeCheckout(),
        onCopyPix: () => this.copyPixCode()
      }
    );
  }
}

export const checkoutController = new CheckoutController();
export default checkoutController;
