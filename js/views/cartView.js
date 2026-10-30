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
   * Aplica máscara dinâmica de telefone celular / fixo brasileiro (XX) XXXXX-XXXX
   * @param {string} value 
   * @returns {string}
   */
  formatPhoneMask(value) {
    if (!value) return '';
    const digits = String(value).replace(/\D/g, '').slice(0, 11);
    if (digits.length === 0) return '';
    if (digits.length <= 2) {
      return `(${digits}`;
    }
    if (digits.length <= 6) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    if (digits.length <= 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
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

        <!-- Formulário de Identificação do Cliente e Conformidade LGPD (Fase 8) -->
        ${items.length > 0 ? this._renderIdentificationForm(actualClient, cart) : ''}

        <!-- Botão de Ação / Checkout -->
        <div class="pt-2">
          <button 
            type="button" 
            id="btn-checkout-proceed" 
            class="w-full py-3.5 px-4 rounded-full font-headline-sm font-black text-sm sm:text-base border-[2.5px] border-[#4A1304] flex items-center justify-center gap-2 transition-all shadow-tactile-md ${items.length > 0 ? 'bg-primary-container text-[#4A1304] hover:bg-[#EEB382] pressable cursor-pointer' : 'bg-surface-container-high text-[#4A1304]/40 border-[#4A1304]/40 cursor-not-allowed'}"
            ${items.length === 0 ? 'disabled aria-disabled="true"' : ''}
            title="${items.length > 0 ? 'Avançar para pagamento com identificação e LGPD' : 'Adicione pratos na sacola para prosseguir'}"
          >
            <span>Avançar para Pagamento</span>
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
        <div class="pt-2 border-t border-[#4A1304]/15 flex items-center justify-between gap-3 min-h-[48px]">
          <label 
            id="label-toggle-loyalty" 
            for="toggle-loyalty-points" 
            class="flex-1 cursor-pointer select-none text-xs font-bold text-[#4A1304] leading-snug flex flex-col py-1"
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
            class="btn-switch w-12 h-7 rounded-full border-[2px] border-[#4A1304] p-0.5 transition-colors relative flex items-center shrink-0 shadow-tactile-xs pressable cursor-pointer ${isApplied ? 'bg-[#25D366]' : 'bg-[#E6D8C5]'}"
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
   * Renderiza a seção de Identificação do Cliente e Consentimento LGPD
   * Conforme especificado em docs/FSD.md (Seções 6.6, 6.7, 12.6, 14.4) e docs/DESIGN.md
   * @private
   * @param {Object|null} client 
   * @param {Object} cart 
   * @returns {string}
   */
  _renderIdentificationForm(client, cart) {
    const rawName = (client && client.nome) ? client.nome : '';
    const rawPhone = (client && client.telefone) ? client.telefone : '';
    const formattedPhone = this.formatPhoneMask(rawPhone);
    const isConsentChecked = Boolean(cart && cart.consentimento_lgpd);
    const lgpdConsentText = (CONFIG.lgpd && CONFIG.lgpd.texto_consentimento) 
      ? CONFIG.lgpd.texto_consentimento 
      : 'Li e concordo com os Termos de Privacidade e autorizo o tratamento dos meus dados para emissão do pedido e acúmulo de pontos de fidelidade.';

    return `
      <section 
        id="identification-section" 
        class="bg-surface-container border-[2px] border-[#4A1304] rounded-2xl p-3.5 sm:p-4 shadow-tactile-sm flex flex-col gap-3 transition-all"
        aria-label="Identificação do Cliente e Consentimento LGPD"
      >
        <!-- Cabeçalho da Identificação -->
        <div class="flex items-center gap-2 pb-2 border-b border-[#4A1304]/15">
          <div class="w-8 h-8 rounded-full bg-primary-container border-[2px] border-[#4A1304] flex items-center justify-center text-[#4A1304] shadow-tactile-xs shrink-0">
            <i data-lucide="user-check" class="w-4 h-4"></i>
          </div>
          <div>
            <h3 class="font-headline-sm text-xs sm:text-sm font-black text-[#4A1304] leading-tight">
              Identificação do Pedido
            </h3>
            <p class="text-[11px] font-bold text-on-surface-variant">
              Informe quem vai retirar o pedido no balcão
            </p>
          </div>
        </div>

        <!-- Formulário de Contato -->
        <div class="flex flex-col gap-3">
          <!-- Campo Nome Completo -->
          <div class="flex flex-col gap-1">
            <label for="customer-name" class="text-xs font-bold text-[#4A1304] flex items-center justify-between">
              <span class="flex items-center gap-1">
                <span>Nome Completo</span>
                <span class="text-error font-black" title="Campo obrigatório">*</span>
              </span>
              <span class="text-[10px] text-on-surface-variant/75 font-normal">Mínimo 3 letras</span>
            </label>
            <div class="relative">
              <input 
                type="text" 
                id="customer-name" 
                name="customer-name" 
                value="${this.escapeHtml(rawName)}" 
                placeholder="Ex: Severino da Silva" 
                class="w-full bg-white border-[2px] border-[#4A1304] rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-[#4A1304] placeholder:text-[#5A1A05]/45 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-[#4A1304] transition-all"
                autocomplete="name"
                required
                aria-required="true"
                aria-describedby="error-customer-name"
              >
            </div>
            <div id="error-customer-name" class="hidden text-error text-[11px] font-bold items-center gap-1 mt-0.5" role="alert">
              <i data-lucide="alert-circle" class="w-3.5 h-3.5 shrink-0"></i>
              <span class="error-msg-text">Informe seu nome completo (mínimo de 3 letras).</span>
            </div>
          </div>

          <!-- Campo Telefone Celular / WhatsApp -->
          <div class="flex flex-col gap-1">
            <label for="customer-phone" class="text-xs font-bold text-[#4A1304] flex items-center justify-between">
              <span class="flex items-center gap-1">
                <span>Telefone Celular / WhatsApp</span>
                <span class="text-error font-black" title="Campo obrigatório">*</span>
              </span>
              <span class="text-[10px] text-on-surface-variant/75 font-normal">Com DDD</span>
            </label>
            <div class="relative">
              <input 
                type="tel" 
                id="customer-phone" 
                name="customer-phone" 
                value="${this.escapeHtml(formattedPhone)}" 
                placeholder="(81) 98765-4321" 
                maxlength="15" 
                class="w-full bg-white border-[2px] border-[#4A1304] rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-[#4A1304] placeholder:text-[#5A1A05]/45 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-[#4A1304] transition-all"
                autocomplete="tel"
                required
                aria-required="true"
                aria-describedby="error-customer-phone"
              >
            </div>
            <div id="error-customer-phone" class="hidden text-error text-[11px] font-bold items-center gap-1 mt-0.5" role="alert">
              <i data-lucide="alert-circle" class="w-3.5 h-3.5 shrink-0"></i>
              <span class="error-msg-text">Informe um telefone válido com DDD (Ex: (81) 98765-4321).</span>
            </div>
          </div>

          <!-- Checkbox Obrigatório de Consentimento LGPD -->
          <div id="container-lgpd-checkbox" class="bg-surface-container-lowest border-[2px] border-[#4A1304]/30 rounded-xl p-2.5 sm:p-3 transition-colors flex flex-col gap-1.5">
            <div class="flex items-start gap-2.5">
              <div class="flex items-center h-5 mt-0.5">
                <input 
                  type="checkbox" 
                  id="checkbox-lgpd-consent" 
                  name="checkbox-lgpd-consent" 
                  class="w-4 h-4 text-primary bg-white border-[2px] border-[#4A1304] rounded cursor-pointer focus:ring-2 focus:ring-primary"
                  ${isConsentChecked ? 'checked' : ''}
                  aria-required="true"
                  aria-describedby="error-lgpd-consent"
                >
              </div>
              <label for="checkbox-lgpd-consent" class="text-[11px] sm:text-xs font-semibold text-[#4A1304] leading-snug cursor-pointer select-none">
                ${this.escapeHtml(lgpdConsentText)}
                <button 
                  type="button" 
                  id="btn-cart-terms-link" 
                  class="text-secondary font-black underline hover:text-primary transition-colors ml-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-secondary rounded"
                  title="Consultar Termos de Privacidade e Proteção de Dados"
                >
                  Ler termos completos
                </button>
              </label>
            </div>
            <div id="error-lgpd-consent" class="hidden text-error text-[11px] font-bold items-center gap-1 mt-0.5 pl-6" role="alert">
              <i data-lucide="alert-circle" class="w-3.5 h-3.5 shrink-0"></i>
              <span class="error-msg-text">É obrigatório aceitar os termos de privacidade para gerar o pedido.</span>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  /**
   * Exibe visualmente o erro de um campo específico com mensagem explicativa e borda vermelha
   * @param {'name' | 'phone' | 'lgpd'} field 
   * @param {string} [customMessage] 
   */
  showFieldError(field, customMessage = '') {
    if (field === 'name') {
      const input = document.getElementById('customer-name');
      const errorDiv = document.getElementById('error-customer-name');
      if (input) {
        input.classList.add('border-error', 'bg-[#FFF5F5]', 'ring-1', 'ring-error');
        input.setAttribute('aria-invalid', 'true');
      }
      if (errorDiv) {
        if (customMessage) {
          const txt = errorDiv.querySelector('.error-msg-text');
          if (txt) txt.textContent = customMessage;
        }
        errorDiv.classList.remove('hidden');
        errorDiv.classList.add('flex');
      }
    } else if (field === 'phone') {
      const input = document.getElementById('customer-phone');
      const errorDiv = document.getElementById('error-customer-phone');
      if (input) {
        input.classList.add('border-error', 'bg-[#FFF5F5]', 'ring-1', 'ring-error');
        input.setAttribute('aria-invalid', 'true');
      }
      if (errorDiv) {
        if (customMessage) {
          const txt = errorDiv.querySelector('.error-msg-text');
          if (txt) txt.textContent = customMessage;
        }
        errorDiv.classList.remove('hidden');
        errorDiv.classList.add('flex');
      }
    } else if (field === 'lgpd') {
      const box = document.getElementById('container-lgpd-checkbox');
      const checkbox = document.getElementById('checkbox-lgpd-consent');
      const errorDiv = document.getElementById('error-lgpd-consent');
      if (box) {
        box.classList.add('border-error', 'bg-[#FFF5F5]');
      }
      if (checkbox) {
        checkbox.setAttribute('aria-invalid', 'true');
      }
      if (errorDiv) {
        if (customMessage) {
          const txt = errorDiv.querySelector('.error-msg-text');
          if (txt) txt.textContent = customMessage;
        }
        errorDiv.classList.remove('hidden');
        errorDiv.classList.add('flex');
      }
    }

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  },

  /**
   * Limpa o estado visual de erro de um campo
   * @param {'name' | 'phone' | 'lgpd'} field 
   */
  clearFieldError(field) {
    if (field === 'name') {
      const input = document.getElementById('customer-name');
      const errorDiv = document.getElementById('error-customer-name');
      if (input) {
        input.classList.remove('border-error', 'bg-[#FFF5F5]', 'ring-1', 'ring-error');
        input.removeAttribute('aria-invalid');
      }
      if (errorDiv) {
        errorDiv.classList.add('hidden');
        errorDiv.classList.remove('flex');
      }
    } else if (field === 'phone') {
      const input = document.getElementById('customer-phone');
      const errorDiv = document.getElementById('error-customer-phone');
      if (input) {
        input.classList.remove('border-error', 'bg-[#FFF5F5]', 'ring-1', 'ring-error');
        input.removeAttribute('aria-invalid');
      }
      if (errorDiv) {
        errorDiv.classList.add('hidden');
        errorDiv.classList.remove('flex');
      }
    } else if (field === 'lgpd') {
      const box = document.getElementById('container-lgpd-checkbox');
      const checkbox = document.getElementById('checkbox-lgpd-consent');
      const errorDiv = document.getElementById('error-lgpd-consent');
      if (box) {
        box.classList.remove('border-error', 'bg-[#FFF5F5]');
      }
      if (checkbox) {
        checkbox.removeAttribute('aria-invalid');
      }
      if (errorDiv) {
        errorDiv.classList.add('hidden');
        errorDiv.classList.remove('flex');
      }
    }
  },

  /**
   * Limpa todos os erros visuais do formulário
   */
  clearAllErrors() {
    this.clearFieldError('name');
    this.clearFieldError('phone');
    this.clearFieldError('lgpd');
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

    // 4. Inputs de Identificação e LGPD (Fase 8)
    const nameInput = container.querySelector('#customer-name');
    if (nameInput) {
      nameInput.addEventListener('input', (e) => {
        const val = e.target.value;
        if (typeof handlers.onNameInput === 'function') {
          handlers.onNameInput(val);
        }
        if (val.trim().length >= 3) {
          this.clearFieldError('name');
        }
      });
      nameInput.addEventListener('blur', (e) => {
        const val = e.target.value;
        if (typeof handlers.onNameBlur === 'function') {
          handlers.onNameBlur(val);
        }
        if (val.trim().length > 0 && val.trim().length < 3) {
          this.showFieldError('name');
        }
      });
    }

    const phoneInput = container.querySelector('#customer-phone');
    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
        const raw = e.target.value;
        const formatted = this.formatPhoneMask(raw);
        e.target.value = formatted;
        if (typeof handlers.onPhoneInput === 'function') {
          handlers.onPhoneInput(formatted);
        }
        const cleanDigits = formatted.replace(/\D/g, '');
        if (cleanDigits.length >= 10) {
          this.clearFieldError('phone');
        }
      });
      phoneInput.addEventListener('blur', (e) => {
        const cleanDigits = e.target.value.replace(/\D/g, '');
        if (typeof handlers.onPhoneBlur === 'function') {
          handlers.onPhoneBlur(e.target.value);
        }
        if (cleanDigits.length > 0 && (cleanDigits.length < 10 || cleanDigits.length > 11)) {
          this.showFieldError('phone');
        }
      });
    }

    const lgpdCheckbox = container.querySelector('#checkbox-lgpd-consent');
    if (lgpdCheckbox) {
      lgpdCheckbox.addEventListener('change', (e) => {
        const checked = e.target.checked;
        if (typeof handlers.onLGPDChange === 'function') {
          handlers.onLGPDChange(checked);
        }
        if (checked) {
          this.clearFieldError('lgpd');
        }
      });
    }

    const cartTermsLink = container.querySelector('#btn-cart-terms-link');
    if (cartTermsLink) {
      cartTermsLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (typeof handlers.onOpenTerms === 'function') {
          handlers.onOpenTerms();
        } else {
          window.dispatchEvent(new CustomEvent('rn:open-privacy-terms'));
        }
      });
    }

    // 5. Finalizar Pedido
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
