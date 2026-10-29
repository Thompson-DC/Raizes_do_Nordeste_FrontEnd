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
   * @param {Object} handlers Callbacks de interação
   */
  renderCart(container, cart, branchInfo, handlers = {}) {
    if (!container) return;

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

        <!-- Resumo Financeiro & Totais -->
        ${items.length > 0 ? this._renderFinancialSummary(subtotal, discount, total, totalItems) : ''}

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
    this._bindEvents(container, handlers);
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
   * Renderiza o quadro de resumo financeiro
   * @private
   * @param {number} subtotal 
   * @param {number} discount 
   * @param {number} total 
   * @param {number} totalItems 
   * @returns {string}
   */
  _renderFinancialSummary(subtotal, discount, total, totalItems) {
    return `
      <div class="bg-surface-container-low border-[2px] border-[#4A1304] rounded-2xl p-3.5 flex flex-col gap-2">
        <div class="flex items-center justify-between text-xs font-bold text-on-surface-variant">
          <span>Subtotal (${totalItems} ${totalItems === 1 ? 'item' : 'itens'})</span>
          <span class="font-black text-[#4A1304]">${this.formatCurrency(subtotal)}</span>
        </div>

        ${discount > 0 ? `
          <div class="flex items-center justify-between text-xs font-bold text-[#25D366]">
            <span class="flex items-center gap-1">
              <i data-lucide="award" class="w-3.5 h-3.5"></i>
              <span>Nordeste Pontos</span>
            </span>
            <span class="font-black">-${this.formatCurrency(discount)}</span>
          </div>
        ` : `
          <div class="flex items-center justify-between text-[11px] font-bold text-on-surface-variant/80 italic">
            <span class="flex items-center gap-1">
              <i data-lucide="sparkles" class="w-3 h-3 text-secondary"></i>
              <span>Nordeste Pontos</span>
            </span>
            <span class="text-secondary font-semibold">Resgate no checkout</span>
          </div>
        `}

        <div class="border-t-[2px] border-dashed border-[#4A1304]/30 pt-2 flex items-center justify-between">
          <span class="font-headline-sm text-sm font-black text-[#4A1304]">Total Geral</span>
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

    // 3. Finalizar Pedido
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
  }
};
