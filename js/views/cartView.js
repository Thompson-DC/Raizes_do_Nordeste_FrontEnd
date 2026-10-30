/**
 * Raízes do Nordeste - Frente de Caixa Multicanal
 * View: Sacola de Compras e Resumo Financeiro (js/views/cartView.js)
 * Conforme especificado em docs/FSD.md e docs/DESIGN.md
 */

import { CONFIG } from '../../config/config.js';

export const cartView = {
  /**
   * Função utilitária para sanitização e escape contra XSS
   * @param {string} str 
   * @returns {string}
   */
  escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  /**
   * Formata número em moeda corrente Real Brasileiro (BRL)
   * @param {number} value 
   * @returns {string}
   */
  formatCurrency(value) {
    const num = Number(value) || 0;
    return num.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  },

  /**
   * Renderiza a sacola de compras completa dentro do container alvo
   * @param {HTMLElement} container 
   * @param {Object} cart Dados atuais do carrinho
   * @param {Object} branchInfo Dados da filial ativa
   * @param {Object|null} [clientInfo=null] Dados do cliente ou handlers caso 4º parâmetro
   * @param {Object} [handlers={}] Callbacks de interação
   */
  renderCart(container, cart, branchInfo, clientInfo = null, handlers = {}) {
    if (!container) return;

    // Garante retrocompatibilidade se o 4º argumento for os handlers
    let actualHandlers = handlers;
    let actualClient = clientInfo;
    if (clientInfo && typeof clientInfo === 'object' && ('onIncrease' in clientInfo || 'onCheckout' in clientInfo || 'onToggleLoyalty' in clientInfo)) {
      actualHandlers = clientInfo;
      actualClient = null;
    }

    const items = Array.isArray(cart.itens) ? cart.itens : [];
    const totalItems = items.reduce((sum, item) => sum + (parseInt(item.quantidade, 10) || 0), 0);
    const subtotal = Number(cart.subtotal) || 0;
    const discount = Number(cart.valor_desconto) || 0;
    const total = Number(cart.total) || 0;
    const branchName = branchInfo ? branchInfo.nome : 'Unidade Selecionada';

    const html = `
      <section 
        id="cart-card" 
        class="w-full bg-surface-container-lowest border-[2.5px] border-[#4A1304] rounded-3xl p-4 sm:p-5 shadow-tactile-md flex flex-col gap-4 transition-all"
        aria-label="Sacola de Compras"
      >
        <!-- Cabeçalho da Sacola -->
        <div class="flex items-center justify-between pb-3 border-b-[2px] border-[#4A1304]/20">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-full bg-primary-container border-[2px] border-[#4A1304] flex items-center justify-center text-[#4A1304] shadow-tactile-sm">
              <i data-lucide="shopping-bag" class="w-5 h-5"></i>
            </div>
            <div>
              <h2 class="font-headline-sm text-base sm:text-lg font-black text-[#4A1304] leading-tight">Sua Sacola</h2>
              <p class="text-[11px] font-bold text-on-surface-variant flex items-center gap-1">
                <i data-lucide="map-pin" class="w-3 h-3 text-primary"></i>
                <span class="truncate max-w-[180px]">${this.escapeHtml(branchName)}</span>
              </p>
            </div>
          </div>
          ${items.length > 0 ? `
            <button 
              type="button" 
              id="btn-clear-cart" 
              class="text-xs font-bold text-error hover:text-[#93000a] hover:underline flex items-center gap-1 transition-colors px-2 py-1 rounded"
              title="Esvaziar todos os itens da sacola"
            >
              <i data-lucide="trash" class="w-3.5 h-3.5"></i>
              <span>Limpar</span>
            </button>
          ` : `
            <span class="text-xs font-bold bg-surface-container px-2.5 py-1 rounded-full border border-[#4A1304]/30 text-on-surface-variant">
              0 itens
            </span>
          `}
        </div>

        <!-- Lista de Itens ou Estado Vazio -->
        <div class="flex-1 flex flex-col gap-2.5 max-h-[380px] overflow-y-auto pr-1 no-scrollbar">
          ${items.length === 0 ? this._renderEmptyState() : items.map(item => this._renderCartItem(item)).join('')}
        </div>

        <!-- Painel do Programa de Fidelidade "Nordeste Pontos" (Fase 7) -->
        ${items.length > 0 ? this._renderLoyaltyCard(cart, actualClient) : ''}

        <!-- Resumo Financeiro & Totais -->
        ${items.length > 0 ? this._renderFinancialSummary(subtotal, discount, total, totalItems, cart.pontos_usados) : ''}

        <!-- Botão de Ação / Checkout -->
        <div class="pt-2">
          <button 
            type="button" 
            id="btn-checkout-proceed" 
            class="w-full py-3.5 px-4 rounded-full font-headline-sm font-black text-sm sm:text-base border-[2.5px] border-[#4A1304] flex items-center justify-center gap-2 transition-all shadow-tactile-md ${items.length > 0 ? 'bg-primary-container text-[#4A1304] hover:bg-[#EEB382] pressable cursor-pointer' : 'bg-surface-container-high text-[#4A1304]/40 border-[#4A1304]/40 cursor-not-allowed'}"
            ${items.length === 0 ? 'disabled aria-disabled="true"' : ''}
            title="${items.length > 0 ? 'Prosseguir para identificação e pagamento' : 'Adicione pratos na sacola para prosseguir'}"
          >
            <span>Finalizar Pedido</span>
            <i data-lucide="arrow-right" class="w-4 h-4"></i>
          </button>
        </div>
      </section>
    `;

    container.innerHTML = html;
    this._bindEvents(container, actualHandlers);
  },

  /**
   * Renderiza o estado visual da sacola vazia
   * @private
   * @returns {string}
   */
  _renderEmptyState() {
    return `
      <div class="flex flex-col items-center justify-center py-8 px-4 text-center bg-surface-container-low rounded-2xl border-[2px] border-dashed border-[#4A1304]/30">
        <div class="w-14 h-14 rounded-full bg-surface-container border-[2px] border-[#4A1304] flex items-center justify-center text-primary mb-3 shadow-tactile-sm">
          <i data-lucide="utensils-crossed" class="w-6 h-6"></i>
        </div>
        <h3 class="font-headline-sm text-sm sm:text-base font-black text-[#4A1304] mb-1">
          Sua sacola está vazia
        </h3>
        <p class="font-body-sm text-xs text-on-surface-variant max-w-[220px]">
          Escolha pratos arretados no cardápio acima para iniciar seu pedido sertanejo!
        </p>
      </div>
    `;
  },

  /**
   * Renderiza um item individual da sacola
   * @private
   * @param {Object} item 
   * @returns {string}
   */
  _renderCartItem(item) {
    const unitPrice = Number(item.preco_unitario) || 0;
    const itemSubtotal = Number(item.subtotal) || (unitPrice * (item.quantidade || 1));
    const qty = Math.max(1, parseInt(item.quantidade, 10) || 1);

    return `
      <article 
        class="bg-white border-[2px] border-[#4A1304] rounded-2xl p-3 shadow-tactile-sm flex flex-col gap-2 transition-all hover:border-[#885120]"
        data-cart-item-id="${this.escapeHtml(item.produto_id)}"
      >
        <div class="flex items-start justify-between gap-2">
          <div class="flex-1 min-w-0">
            <h4 class="font-headline-sm text-xs sm:text-sm font-black text-[#4A1304] truncate leading-tight" title="${this.escapeHtml(item.nome)}">
              ${this.escapeHtml(item.nome)}
            </h4>
            <span class="text-[11px] font-bold text-on-surface-variant">
              ${this.formatCurrency(unitPrice)} un.
            </span>
          </div>

          <!-- Botão de Exclusão Rápida -->
          <button 
            type="button" 
            class="text-on-surface-variant hover:text-error transition-colors p-1 rounded-full hover:bg-error-container/40"
            data-action="remove-item"
            data-product-id="${this.escapeHtml(item.produto_id)}"
            title="Remover prato da sacola"
            aria-label="Remover ${this.escapeHtml(item.nome)} da sacola"
          >
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        </div>

        <div class="flex items-center justify-between pt-1 border-t border-[#4A1304]/10">
          <!-- Stepper de Quantidade Estilo Pílula Neo-Brutalista -->
          <div class="flex items-center bg-surface-container-lowest border-[2px] border-[#4A1304] rounded-full overflow-hidden shadow-tactile-sm">
            <button 
              type="button" 
              class="w-7 h-7 flex items-center justify-center font-black text-xs text-[#4A1304] hover:bg-surface-container active:bg-surface-dim transition-colors pressable"
              data-action="decrease-qty"
              data-product-id="${this.escapeHtml(item.produto_id)}"
              title="Diminuir quantidade"
              aria-label="Diminuir quantidade de ${this.escapeHtml(item.nome)}"
            >
              <i data-lucide="minus" class="w-3 h-3"></i>
            </button>
            <span 
              class="w-7 text-center font-headline-sm text-xs font-black text-[#4A1304] select-none"
              aria-label="Quantidade: ${qty}"
            >
              ${qty}
            </span>
            <button 
              type="button" 
              class="w-7 h-7 flex items-center justify-center font-black text-xs text-[#4A1304] hover:bg-surface-container active:bg-surface-dim transition-colors pressable"
              data-action="increase-qty"
              data-product-id="${this.escapeHtml(item.produto_id)}"
              title="Aumentar quantidade"
              aria-label="Aumentar quantidade de ${this.escapeHtml(item.nome)}"
            >
              <i data-lucide="plus" class="w-3 h-3"></i>
            </button>
          </div>

          <!-- Subtotal do Item -->
          <span class="font-headline-sm text-xs sm:text-sm font-black text-[#4A1304]">
            ${this.formatCurrency(itemSubtotal)}
          </span>
        </div>
      </article>
    `;
  },

  /**
   * Renderiza o card do programa de fidelidade "Nordeste Pontos"
   * Conforme especificado em docs/FSD.md (Seção 6.5 e 14.3) e docs/DESIGN.md
   * @private
   * @param {Object} cart
   * @param {Object|null} [client]
   * @returns {string}
   */
  _renderLoyaltyCard(cart, client) {
    const defaultPoints = (CONFIG.fidelidade && CONFIG.fidelidade.saldo_padrao) || 150;
    const availablePoints = (client && client.saldo_pontos !== undefined) ? Number(client.saldo_pontos) : defaultPoints;
    const pointsPerReal = (CONFIG.fidelidade && CONFIG.fidelidade.pontos_por_real) || 10;
    const maxDiscountValue = Number((availablePoints / pointsPerReal).toFixed(2));

    const isApplied = Boolean(cart && (Number(cart.pontos_usados) > 0 || Number(cart.valor_desconto) > 0));

    return `
      <section 
        id="loyalty-card" 
        class="bg-surface-container border-[2px] border-[#4A1304] rounded-2xl p-3 sm:p-3.5 shadow-tactile-sm flex flex-col gap-2.5 transition-all relative overflow-hidden"
        aria-label="Programa de Fidelidade Nordeste Pontos"
      >
        <!-- Cabeçalho do Card de Fidelidade -->
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-[#C9962E] border-[2px] border-[#4A1304] flex items-center justify-center text-[#4A1304] shadow-tactile-xs shrink-0">
              <i data-lucide="award" class="w-4 h-4"></i>
            </div>
            <div>
              <div class="flex items-center gap-1.5 flex-wrap">
                <h3 class="font-headline-sm text-xs sm:text-sm font-black text-[#4A1304] leading-tight">Nordeste Pontos</h3>
                <span class="text-[10px] font-black uppercase px-1.5 py-0.5 rounded-full bg-[#C9962E]/25 text-[#7C5800] border border-[#7C5800]/30">
                  Fidelidade
                </span>
              </div>
              <p class="text-[11px] font-bold text-on-surface-variant flex items-center gap-1">
                <span>Saldo disponível:</span>
                <strong class="text-[#4A1304] font-black">${availablePoints} pontos</strong>
                <span class="text-on-surface-variant/75 text-[10px]">(${this.formatCurrency(maxDiscountValue)})</span>
              </p>
            </div>
          </div>
          ${isApplied ? `
            <span class="text-[10px] font-black bg-[#25D366]/20 text-[#1E8E3E] border border-[#25D366]/50 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-tactile-xs">
              <i data-lucide="check" class="w-3 h-3"></i>
              <span>Ativo</span>
            </span>
          ` : ''}
        </div>

        <!-- Área de Ação e Switch Toggle Neo-Brutalista -->
        <div class="pt-2 border-t border-[#4A1304]/15 flex items-center justify-between gap-3">
          <label 
            id="label-toggle-loyalty" 
            for="toggle-loyalty-points" 
            class="flex-1 cursor-pointer select-none text-xs font-bold text-[#4A1304] leading-snug flex flex-col"
          >
            <span>
              Usar <strong>${availablePoints} pontos</strong> para obter <strong>${this.formatCurrency(maxDiscountValue)}</strong> de desconto
            </span>
            <span class="text-[10px] text-on-surface-variant font-medium mt-0.5">
              ${isApplied ? 'Desconto abatido no total da sacola' : 'Toque no interruptor para abater na sua compra'}
            </span>
          </label>

          <!-- Switch Neo-Brutalista com acessibilidade WCAG (role="switch") -->
          <button 
            type="button" 
            role="switch"
            id="toggle-loyalty-points"
            data-action="toggle-loyalty"
            aria-checked="${isApplied ? 'true' : 'false'}"
            aria-labelledby="label-toggle-loyalty"
            class="w-12 h-7 rounded-full border-[2px] border-[#4A1304] p-0.5 transition-colors relative flex items-center shrink-0 shadow-tactile-xs pressable cursor-pointer ${isApplied ? 'bg-[#25D366]' : 'bg-[#E6D8C5]'}"
            title="${isApplied ? 'Remover desconto de fidelidade' : 'Aplicar desconto de fidelidade'}"
          >
            <span 
              class="w-5 h-5 rounded-full bg-white border-[1.5px] border-[#4A1304] shadow-sm transform transition-transform duration-200 ease-in-out flex items-center justify-center ${isApplied ? 'translate-x-5' : 'translate-x-0'}"
            >
              <i data-lucide="${isApplied ? 'check' : 'sparkles'}" class="w-3 h-3 ${isApplied ? 'text-[#25D366]' : 'text-on-surface-variant'}"></i>
            </span>
          </button>
        </div>
      </section>
    `;
  },

  /**
   * Renderiza o quadro de resumo financeiro
   * @private
   * @param {number} subtotal 
   * @param {number} discount 
   * @param {number} total 
   * @param {number} totalItems 
   * @param {number} [pointsUsed=0] 
   * @returns {string}
   */
  _renderFinancialSummary(subtotal, discount, total, totalItems, pointsUsed = 0) {
    const isDiscountActive = discount > 0;

    return `
      <div class="bg-surface-container-low border-[2px] border-[#4A1304] rounded-2xl p-3.5 flex flex-col gap-2">
        <div class="flex items-center justify-between text-xs font-bold text-on-surface-variant">
          <span>Subtotal (${totalItems} ${totalItems === 1 ? 'item' : 'itens'})</span>
          <span class="font-black text-[#4A1304]">${this.formatCurrency(subtotal)}</span>
        </div>

        ${isDiscountActive ? `
          <div class="flex items-center justify-between text-xs font-bold text-[#1E8E3E] bg-[#25D366]/15 px-2.5 py-1.5 rounded-xl border border-[#25D366]/40">
            <span class="flex items-center gap-1.5">
              <i data-lucide="award" class="w-4 h-4 text-[#25D366]"></i>
              <span class="text-[#4A1304]">Nordeste Pontos (${pointsUsed || 150} pts)</span>
            </span>
            <span class="font-black text-[#1E8E3E]">-${this.formatCurrency(discount)}</span>
          </div>
        ` : `
          <div class="flex items-center justify-between text-[11px] font-bold text-on-surface-variant/80 italic px-0.5">
            <span class="flex items-center gap-1.5">
              <i data-lucide="sparkles" class="w-3.5 h-3.5 text-[#C9962E]"></i>
              <span>Nordeste Pontos</span>
            </span>
            <span class="text-secondary font-semibold">Resgate disponível</span>
          </div>
        `}

        <div class="border-t-[2px] border-dashed border-[#4A1304]/30 pt-2 flex items-center justify-between">
          <div>
            <span class="font-headline-sm text-sm font-black text-[#4A1304] block leading-tight">Total Geral</span>
            ${isDiscountActive && total === 0 ? `
              <span class="text-[10px] font-extrabold text-[#1E8E3E] uppercase tracking-wider">100% coberto por pontos</span>
            ` : ''}
          </div>
          <span class="font-headline-sm text-base sm:text-lg font-black text-secondary">
            ${this.formatCurrency(total)}
          </span>
        </div>
      </div>
    `;
  },

  /**
   * Atualiza o badge indicador de itens e total no cabeçalho geral
   * @param {number} totalItems 
   * @param {number} totalValue 
   */
  updateHeaderBadge(totalItems, totalValue) {
    const countEl = document.getElementById('cart-header-count');
    const totalEl = document.getElementById('cart-header-total');
    const btnEl = document.getElementById('cart-header-btn');

    if (countEl) {
      countEl.textContent = totalItems.toString();
    }
    if (totalEl) {
      totalEl.textContent = this.formatCurrency(totalValue);
    }
    if (btnEl) {
      if (totalItems > 0) {
        btnEl.classList.add('animate-pulse');
        setTimeout(() => btnEl.classList.remove('animate-pulse'), 400);
      }
    }
  },

  /**
   * Renderiza barra de pedido flutuante no rodapé para canais móveis (App e Totem)
   * @param {HTMLElement} container 
   * @param {number} totalItems 
   * @param {number} totalValue 
   * @param {Function} onClick 
   */
  renderMobileCartBar(container, totalItems, totalValue, onClick) {
    if (!container) return;

    if (totalItems <= 0) {
      container.innerHTML = '';
      container.classList.add('hidden');
      return;
    }

    container.classList.remove('hidden');
    container.innerHTML = `
      <div class="w-full max-w-sm sm:max-w-md mx-auto p-2">
        <button 
          type="button" 
          id="btn-mobile-cart-toggle" 
          class="w-full bg-primary-container border-[2.5px] border-[#4A1304] rounded-full py-3 px-4 shadow-tactile-lg flex items-center justify-between pressable text-[#4A1304]"
        >
          <div class="flex items-center gap-2 font-headline-sm text-xs sm:text-sm font-black">
            <span class="w-6 h-6 rounded-full bg-[#4A1304] text-white flex items-center justify-center text-xs">
              ${totalItems}
            </span>
            <span>Ver Sacola</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-headline-sm text-sm sm:text-base font-black">
              ${this.formatCurrency(totalValue)}
            </span>
            <i data-lucide="chevron-up" class="w-4 h-4"></i>
          </div>
        </button>
      </div>
    `;

    const btn = container.querySelector('#btn-mobile-cart-toggle');
    if (btn && typeof onClick === 'function') {
      btn.addEventListener('click', onClick);
    }

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  },

  /**
   * Vincula os ouvintes de eventos da sacola
   * @private
   * @param {HTMLElement} container 
   * @param {Object} handlers 
   */
  _bindEvents(container, handlers) {
    // 1. Limpar Sacola
    const clearBtn = container.querySelector('#btn-clear-cart');
    if (clearBtn && typeof handlers.onClear === 'function') {
      clearBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handlers.onClear();
      });
    }

    // 2. Incrementar / Decrementar / Excluir
    container.addEventListener('click', (e) => {
      const target = e.target.closest('[data-action]');
      if (!target) return;

      const action = target.getAttribute('data-action');
      const productId = target.getAttribute('data-product-id');
      if (!productId) return;

      e.preventDefault();

      if (action === 'increase-qty' && typeof handlers.onIncrease === 'function') {
        handlers.onIncrease(productId);
      } else if (action === 'decrease-qty' && typeof handlers.onDecrease === 'function') {
        handlers.onDecrease(productId);
      } else if (action === 'remove-item' && typeof handlers.onRemove === 'function') {
        handlers.onRemove(productId);
      }
    });

    // 3. Resgate do Programa de Fidelidade (Fase 7)
    const loyaltyToggle = container.querySelector('#toggle-loyalty-points');
    if (loyaltyToggle && typeof handlers.onToggleLoyalty === 'function') {
      loyaltyToggle.addEventListener('click', (e) => {
        e.preventDefault();
        handlers.onToggleLoyalty();
      });
    }

    const loyaltyLabel = container.querySelector('#label-toggle-loyalty');
    if (loyaltyLabel && typeof handlers.onToggleLoyalty === 'function') {
      loyaltyLabel.addEventListener('click', (e) => {
        e.preventDefault();
        handlers.onToggleLoyalty();
      });
    }

    // 4. Finalizar Pedido
    const checkoutBtn = container.querySelector('#btn-checkout-proceed');
    if (checkoutBtn && typeof handlers.onCheckout === 'function') {
      checkoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handlers.onCheckout();
      });
    }

    // Inicializa ícones Lucide
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  },

  /**
   * Exibe toast de alerta/aviso temporário e não-bloqueante no topo da tela
   * @param {string} message - Texto informativo
   * @param {'info' | 'warning' | 'success'} [type='info'] - Tipo visual do toast
   */
  showToast(message, type = 'info') {
    if (typeof document === 'undefined' || !document.body) return;

    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'fixed top-16 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none w-full max-w-sm sm:max-w-md px-4';
      if (document.body && typeof document.body.appendChild === 'function') {
        document.body.appendChild(toastContainer);
      }
    }

    if (!toastContainer || typeof toastContainer.appendChild !== 'function') return;

    const toast = document.createElement('div');
    const isWarning = type === 'warning';
    toast.className = `w-full pointer-events-auto border-[2.5px] border-[#4A1304] rounded-2xl p-3.5 shadow-tactile-lg text-xs font-bold flex items-center gap-2.5 transition-all duration-300 transform -translate-y-4 opacity-0 ${
      isWarning ? 'bg-[#FFDAD6] text-[#93000A]' : 'bg-surface-container-high text-[#4A1304]'
    }`;

    toast.innerHTML = `
      <i data-lucide="${isWarning ? 'alert-triangle' : 'info'}" class="w-4 h-4 shrink-0 text-error"></i>
      <span class="flex-1 leading-snug">${this.escapeHtml(message)}</span>
      <button type="button" class="shrink-0 text-[#4A1304] hover:opacity-75 p-1" title="Fechar aviso">
        <i data-lucide="x" class="w-3.5 h-3.5"></i>
      </button>
    `;

    const closeBtn = toast.querySelector('button');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        toast.remove();
      });
    }

    toastContainer.appendChild(toast);
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }

    requestAnimationFrame(() => {
      toast.classList.remove('-translate-y-4', 'opacity-0');
    });

    setTimeout(() => {
      toast.classList.add('opacity-0', '-translate-y-4');
      setTimeout(() => toast.remove(), 350);
    }, 5000);
  }
};
