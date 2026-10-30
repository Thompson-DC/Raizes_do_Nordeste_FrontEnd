/**
 * Raízes do Nordeste - Frente de Caixa Multicanal
 * View da Linha do Tempo de Produção (Stepper) (js/views/timelineView.js)
 * Conforme especificado em docs/FSD.md (Módulos 6.9, 12.8, 13.6 e 14.5) e docs/DESIGN.md
 */

export class TimelineView {
  /**
   * Sanitiza strings para exibição segura no DOM prevenindo XSS
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
  }

  /**
   * Formata valores numéricos para o padrão monetário brasileiro (R$ XX,XX)
   * @param {number} value 
   * @returns {string}
   */
  formatCurrency(value) {
    const num = Number(value) || 0;
    return `R$ ${num.toFixed(2).replace('.', ',')}`;
  }

  /**
   * Renderiza a Linha do Tempo de Produção dentro do container alvo
   * @param {HTMLElement} container 
   * @param {Object} state Estado consolidado da timeline e pedido
   * @param {Object} callbacks Funções de retorno para interação
   */
  render(container, state, callbacks = {}) {
    if (!container) return;

    const {
      order,
      currentStep, // 1: 'received', 2: 'preparing', 3: 'ready'
      isAutoPlaying,
      timeRemaining,
      stepDuration
    } = state;

    if (!order) {
      container.innerHTML = this._renderEmptyState(callbacks.onNewOrder);
      this._initLucide();
      return;
    }

    const steps = [
      {
        id: 1,
        key: 'received',
        title: 'Pedido Recebido',
        desc: 'Confirmado no caixa e enviado à cozinha',
        icon: 'clipboard-check',
        color: '#E9A36A'
      },
      {
        id: 2,
        key: 'preparing',
        title: 'Em Preparo',
        desc: 'Nossos cozinheiros estão preparando seus pratos',
        icon: 'flame',
        color: '#C9962E'
      },
      {
        id: 3,
        key: 'ready',
        title: 'Pronto para Retirada',
        desc: 'Disponível no balcão da filial selecionada',
        icon: 'shopping-bag',
        color: '#25D366'
      }
    ];

    const safeSeqNumber = this.escapeHtml(order.numero_sequencial || '#RN-1042');
    const safeBranchName = this.escapeHtml(order.filial ? order.filial.nome : 'Recife Antigo - Matriz');
    const safeClientName = this.escapeHtml(order.cliente ? order.cliente.nome : 'Cliente');
    const safeClientPhone = this.escapeHtml(order.cliente ? order.cliente.telefone : '');
    const safePaymentMethod = this.escapeHtml(order.forma_pagamento || 'PIX Instantâneo');
    const formattedTotal = this.formatCurrency(order.total_pago);

    const progressPercentage = currentStep === 1 ? 15 : currentStep === 2 ? 60 : 100;
    const isReady = currentStep === 3;

    container.innerHTML = `
      <section id="timeline-card" class="w-full bg-surface border-[2.5px] border-[#4A1304] rounded-3xl shadow-tactile-md overflow-hidden flex flex-col p-4 sm:p-6 lg:p-8 animate-fadeIn" aria-labelledby="timeline-title">
        
        <!-- Faixa Superior de Status do Pedido (Artisanal Stitch) -->
        <div class="stitch w-full bg-surface-container rounded-2xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-[2px] border-[#4A1304]">
          <div class="flex items-center gap-3.5">
            <div class="w-12 h-12 rounded-2xl bg-[#4A1304] text-[#ffdea8] flex items-center justify-center shrink-0 border-[2px] border-[#3A0E03] shadow-tactile-sm">
              <i data-lucide="${isReady ? 'check-circle' : 'clock'}" class="w-6 h-6"></i>
            </div>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-xs font-black uppercase tracking-wider text-[#924c0e] bg-secondary-fixed px-2 py-0.5 rounded-full border border-[#4A1304]/30">
                  ${isReady ? 'Pronto no Balcão' : 'Em Produção'}
                </span>
                <span class="text-xs font-bold text-on-surface-variant flex items-center gap-1">
                  <i data-lucide="store" class="w-3.5 h-3.5 text-primary"></i>
                  ${safeBranchName}
                </span>
              </div>
              <h2 id="timeline-title" class="font-headline-md text-2xl sm:text-3xl font-black text-[#4A1304] tracking-tight mt-0.5">
                Pedido <span class="text-primary underline decoration-[#E9A36A] decoration-4">${safeSeqNumber}</span>
              </h2>
            </div>
          </div>

          <!-- Badge de Tempo Estimado ou Pronto -->
          <div class="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-[#4A1304]/20 pt-2 sm:pt-0">
            <span class="text-xs font-bold text-on-surface-variant">Tempo estimado:</span>
            <span class="font-headline-sm font-black text-sm sm:text-base ${isReady ? 'text-[#25D366] bg-[#211b0f]' : 'text-primary bg-primary-fixed'} px-3 py-1 rounded-full border-[1.5px] border-[#4A1304]">
              ${isReady ? '★ RETIRAR AGORA' : '15-20 min'}
            </span>
          </div>
        </div>

        <!-- Stepper Visual de 3 Etapas -->
        <div class="w-full my-4 sm:my-6">
          <!-- Barra de Progresso Traseira -->
          <div class="relative w-full mb-8">
            <div class="w-full h-3 bg-surface-container-highest rounded-full border-[2px] border-[#4A1304] overflow-hidden">
              <div id="timeline-progress-bar" class="h-full bg-gradient-to-r from-primary-container via-tertiary-container to-[#25D366] transition-all duration-700 ease-out" style="width: ${progressPercentage}%;"></div>
            </div>

            <!-- Nós do Stepper (Etapas 1, 2 e 3) -->
            <div class="absolute top-1/2 left-0 w-full -translate-y-1/2 flex justify-between px-2 sm:px-6">
              ${steps.map((s) => {
                const isStepCompleted = currentStep > s.id;
                const isStepActive = currentStep === s.id;
                
                let nodeBg = 'bg-surface-container text-outline border-[#847469]';
                let iconName = s.icon;

                if (isStepCompleted) {
                  nodeBg = 'bg-[#25D366] text-[#211b0f] border-[#4A1304] shadow-tactile-sm';
                  iconName = 'check';
                } else if (isStepActive) {
                  nodeBg = 'bg-primary-container text-[#4A1304] border-[#4A1304] shadow-tactile-md scale-110 ring-4 ring-[#E9A36A]/40 animate-pulse';
                }

                return `
                  <div class="flex flex-col items-center">
                    <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-[2.5px] ${nodeBg} flex items-center justify-center transition-all duration-300 z-10 font-black text-sm sm:text-base" title="${s.title}">
                      <i data-lucide="${iconName}" class="w-5 h-5 sm:w-6 sm:h-6"></i>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Rótulos e Descrições das Etapas -->
          <div class="grid grid-cols-3 gap-2 text-center pt-2">
            ${steps.map((s) => {
              const isActive = currentStep === s.id;
              const isPast = currentStep > s.id;
              
              let titleColor = 'text-outline';
              let badgeState = '';

              if (isActive) {
                titleColor = 'text-[#4A1304] font-black';
                badgeState = `<span class="inline-block mt-1 text-[10px] sm:text-xs font-black uppercase px-2 py-0.5 rounded-full bg-primary-container text-[#4A1304] border border-[#4A1304]/40">Em andamento</span>`;
              } else if (isPast) {
                titleColor = 'text-[#25D366] font-bold';
                badgeState = `<span class="inline-block mt-1 text-[10px] sm:text-xs font-black uppercase px-2 py-0.5 rounded-full bg-[#25D366]/20 text-[#211b0f] border border-[#25D366]/40">Concluído</span>`;
              }

              return `
                <div class="flex flex-col items-center px-1">
                  <h3 class="font-headline-sm text-xs sm:text-base leading-tight ${titleColor}">
                    ${s.title}
                  </h3>
                  <p class="hidden sm:block text-xs text-on-surface-variant mt-1 max-w-[180px]">
                    ${s.desc}
                  </p>
                  ${badgeState}
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Alerta de Conclusão Vibrante quando Pronto -->
        ${isReady ? `
          <div class="w-full bg-[#25D366]/15 border-[2.5px] border-[#25D366] rounded-2xl p-4 sm:p-5 my-4 flex items-center gap-4 text-[#211b0f] animate-bounce">
            <div class="w-12 h-12 rounded-full bg-[#25D366] text-[#211b0f] flex items-center justify-center shrink-0 border-[2px] border-[#4A1304] shadow-tactile-sm">
              <i data-lucide="bell-ring" class="w-6 h-6"></i>
            </div>
            <div class="min-w-0">
              <h4 class="font-headline-sm text-base sm:text-lg font-black text-[#211b0f] uppercase tracking-wide">
                Seu pedido está prontinho no balcão!
              </h4>
              <p class="text-xs sm:text-sm font-semibold text-on-surface">
                Por favor, dirija-se à área de entrega da filial <strong>${safeBranchName}</strong> e apresente o código <strong>${safeSeqNumber}</strong>.
              </p>
            </div>
          </div>
        ` : ''}

        <!-- Painel de Demonstração Acadêmica e Controles do Stepper (Regra FSD 6.9 e 14.5) -->
        <div class="w-full bg-surface-container-high border-[2px] border-[#4A1304] rounded-2xl p-3 sm:p-4 my-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <!-- Status do Temporizador Automático -->
          <div class="flex items-center gap-2.5 w-full md:w-auto">
            <span class="w-2.5 h-2.5 rounded-full ${isAutoPlaying && !isReady ? 'bg-[#25D366] animate-ping' : 'bg-outline'} shrink-0"></span>
            <div class="flex flex-col">
              <span class="font-bold text-on-surface">
                ${isReady 
                  ? 'Ciclo de preparo concluído com êxito' 
                  : (isAutoPlaying 
                      ? `Avanço automático em: <strong id="step-countdown" class="text-primary font-black text-sm">${timeRemaining}s</strong> (ciclo de ${stepDuration}s)`
                      : 'Avanço automático pausado para auditoria manual')}
              </span>
              <span class="text-[11px] text-on-surface-variant">Controles de demonstração acadêmica para a banca examinadora</span>
            </div>
          </div>

          <!-- Botões de Controle Manual (Avançar / Voltar / Pausar) -->
          <div class="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
            <button 
              id="btn-timeline-toggle-timer" 
              type="button" 
              class="px-3 py-1.5 rounded-full border-[1.5px] border-[#4A1304] bg-surface font-bold text-xs hover:bg-surface-container transition-all flex items-center gap-1 shadow-tactile-sm pressable"
              title="${isAutoPlaying ? 'Pausar avanço automático' : 'Retomar avanço automático'}"
              ${isReady ? 'disabled class="opacity-50 cursor-not-allowed"' : ''}>
              <i data-lucide="${isAutoPlaying ? 'pause' : 'play'}" class="w-3.5 h-3.5 text-primary"></i>
              <span>${isAutoPlaying ? 'Pausar' : 'Retomar'}</span>
            </button>

            <button 
              id="btn-timeline-prev-step" 
              type="button" 
              class="px-3 py-1.5 rounded-full border-[1.5px] border-[#4A1304] bg-surface font-bold text-xs hover:bg-surface-container transition-all flex items-center gap-1 shadow-tactile-sm pressable ${currentStep <= 1 ? 'opacity-40 cursor-not-allowed' : ''}"
              ${currentStep <= 1 ? 'disabled' : ''}
              title="Voltar para a etapa anterior">
              <i data-lucide="chevron-left" class="w-3.5 h-3.5"></i>
              <span>Voltar Etapa</span>
            </button>

            <button 
              id="btn-timeline-next-step" 
              type="button" 
              class="px-3.5 py-1.5 rounded-full border-[1.5px] border-[#4A1304] bg-primary text-white font-bold text-xs hover:bg-secondary transition-all flex items-center gap-1 shadow-tactile-sm pressable ${currentStep >= 3 ? 'opacity-40 cursor-not-allowed' : ''}"
              ${currentStep >= 3 ? 'disabled' : ''}
              title="Avançar imediatamente para a próxima etapa">
              <span>Avançar Etapa</span>
              <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>

        <!-- Resumo Compacto dos Itens Adquiridos -->
        <details class="w-full border-[2px] border-[#4A1304] rounded-2xl bg-surface-container-low overflow-hidden my-3 group">
          <summary class="px-4 py-3 font-bold text-xs sm:text-sm text-[#4A1304] flex items-center justify-between cursor-pointer hover:bg-surface-container select-none">
            <span class="flex items-center gap-2">
              <i data-lucide="receipt" class="w-4 h-4 text-primary"></i>
              <span>Resumo do Pedido (${Array.isArray(order.itens) ? order.itens.length : 0} ${Array.isArray(order.itens) && order.itens.length === 1 ? 'item' : 'itens'})</span>
            </span>
            <div class="flex items-center gap-2 font-black text-primary">
              <span>${formattedTotal}</span>
              <i data-lucide="chevron-down" class="w-4 h-4 transition-transform group-open:rotate-180"></i>
            </div>
          </summary>

          <div class="p-4 border-t-[1.5px] border-[#4A1304]/20 flex flex-col gap-2.5 text-xs text-on-surface">
            <!-- Dados do Cliente -->
            <div class="flex justify-between items-center pb-2 border-b border-[#4A1304]/10">
              <span class="text-on-surface-variant font-medium">Cliente:</span>
              <span class="font-bold">${safeClientName} ${safeClientPhone ? `(${safeClientPhone})` : ''}</span>
            </div>

            <!-- Dados do Pagamento -->
            <div class="flex justify-between items-center pb-2 border-b border-[#4A1304]/10">
              <span class="text-on-surface-variant font-medium">Forma de Pagamento:</span>
              <span class="font-bold text-secondary">${safePaymentMethod}</span>
            </div>

            <!-- Lista de Produtos -->
            <div class="flex flex-col gap-1.5 pt-1">
              ${Array.isArray(order.itens) ? order.itens.map(item => `
                <div class="flex justify-between items-center">
                  <span class="font-medium">
                    <strong class="font-black text-[#4A1304]">${item.quantidade}x</strong> 
                    ${this.escapeHtml(item.nome)}
                  </span>
                  <span class="font-bold text-on-surface-variant">${this.formatCurrency(item.subtotal)}</span>
                </div>
              `).join('') : '<p class="text-on-surface-variant italic">Nenhum item discriminado.</p>'}
            </div>

            <!-- Desconto de Fidelidade se houver -->
            ${order.desconto_fidelidade > 0 ? `
              <div class="flex justify-between items-center pt-2 border-t border-[#4A1304]/10 text-[#25D366]">
                <span class="font-bold">Desconto Nordeste Pontos:</span>
                <span class="font-black">- ${this.formatCurrency(order.desconto_fidelidade)}</span>
              </div>
            ` : ''}

            <!-- Total Final -->
            <div class="flex justify-between items-center pt-2 border-t-[2px] border-[#4A1304] font-headline-sm text-sm font-black text-[#4A1304]">
              <span>Total Pago:</span>
              <span>${formattedTotal}</span>
            </div>
          </div>
        </details>

        <!-- Ações de Encerramento e Novo Pedido -->
        <div class="w-full flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t-[2px] border-[#4A1304]/20">
          <button 
            id="btn-timeline-back-menu" 
            type="button" 
            class="w-full sm:w-auto px-4 py-2.5 rounded-full border-[2px] border-[#4A1304] bg-surface-container font-bold text-xs text-[#4A1304] hover:bg-surface-container-high transition-all flex items-center justify-center gap-2 shadow-tactile-sm pressable"
            title="Voltar para visualizar o cardápio mantendo o pedido">
            <i data-lucide="utensils" class="w-4 h-4"></i>
            <span>Ver Cardápio</span>
          </button>

          <button 
            id="btn-timeline-new-order" 
            type="button" 
            class="w-full sm:w-auto px-6 py-3 rounded-full border-[2.5px] border-[#4A1304] bg-primary text-white font-headline-sm font-black text-sm tracking-wide hover:bg-secondary transition-all flex items-center justify-center gap-2 shadow-tactile-md pressable"
            title="Iniciar uma nova jornada de compras">
            <i data-lucide="plus-circle" class="w-5 h-5"></i>
            <span>Fazer Novo Pedido</span>
          </button>
        </div>

      </section>
    `;

    this._bindEvents(container, callbacks);
    this._initLucide();
  }

  /**
   * Atualiza suavemente a barra de progresso e nós sem re-renderizar o DOM completo
   * @param {HTMLElement} container 
   * @param {number} currentStep 
   * @param {number} timeRemaining 
   * @param {boolean} isAutoPlaying 
   */
  updateStepOnly(container, currentStep, timeRemaining, isAutoPlaying) {
    if (!container) return;

    const countdownEl = container.querySelector('#step-countdown');
    if (countdownEl) {
      countdownEl.textContent = `${timeRemaining}s`;
    }

    const toggleBtn = container.querySelector('#btn-timeline-toggle-timer');
    if (toggleBtn) {
      toggleBtn.innerHTML = `
        <i data-lucide="${isAutoPlaying ? 'pause' : 'play'}" class="w-3.5 h-3.5 text-primary"></i>
        <span>${isAutoPlaying ? 'Pausar' : 'Retomar'}</span>
      `;
    }

    this._initLucide();
  }

  /**
   * Renderiza tela amigável caso não haja pedidos no histórico ativo
   * @private
   * @param {Function} onNewOrder 
   * @returns {string}
   */
  _renderEmptyState(onNewOrder) {
    return `
      <div class="w-full bg-surface border-[2.5px] border-[#4A1304] rounded-3xl p-8 text-center flex flex-col items-center justify-center shadow-tactile-md animate-fadeIn my-6">
        <div class="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center border-[2px] border-[#4A1304] text-secondary mb-4 shadow-tactile-sm">
          <i data-lucide="receipt" class="w-8 h-8"></i>
        </div>
        <h3 class="font-headline-md text-xl font-black text-[#4A1304] mb-1">Nenhum Pedido em Produção</h3>
        <p class="text-xs sm:text-sm text-on-surface-variant max-w-md mb-6">
          Você ainda não realizou nenhum pedido nesta sessão ou seu pedido anterior já foi finalizado. Monte sua sacola de delícias sertanejas!
        </p>
        <button 
          id="btn-timeline-empty-new" 
          type="button" 
          class="px-6 py-2.5 rounded-full border-[2.5px] border-[#4A1304] bg-primary text-white font-bold text-xs hover:bg-secondary transition-all flex items-center gap-2 shadow-tactile-sm pressable">
          <i data-lucide="shopping-bag" class="w-4 h-4"></i>
          <span>Explorar Cardápio</span>
        </button>
      </div>
    `;
  }

  /**
   * Conecta os eventos de clique aos botões do componente
   * @private
   */
  _bindEvents(container, callbacks) {
    const prevBtn = container.querySelector('#btn-timeline-prev-step');
    if (prevBtn && typeof callbacks.onPrevStep === 'function') {
      prevBtn.addEventListener('click', () => callbacks.onPrevStep());
    }

    const nextBtn = container.querySelector('#btn-timeline-next-step');
    if (nextBtn && typeof callbacks.onNextStep === 'function') {
      nextBtn.addEventListener('click', () => callbacks.onNextStep());
    }

    const toggleBtn = container.querySelector('#btn-timeline-toggle-timer');
    if (toggleBtn && typeof callbacks.onToggleTimer === 'function') {
      toggleBtn.addEventListener('click', () => callbacks.onToggleTimer());
    }

    const newOrderBtn = container.querySelector('#btn-timeline-new-order');
    if (newOrderBtn && typeof callbacks.onNewOrder === 'function') {
      newOrderBtn.addEventListener('click', () => callbacks.onNewOrder());
    }

    const emptyNewBtn = container.querySelector('#btn-timeline-empty-new');
    if (emptyNewBtn && typeof callbacks.onNewOrder === 'function') {
      emptyNewBtn.addEventListener('click', () => callbacks.onNewOrder());
    }

    const backMenuBtn = container.querySelector('#btn-timeline-back-menu');
    if (backMenuBtn && typeof callbacks.onBackMenu === 'function') {
      backMenuBtn.addEventListener('click', () => callbacks.onBackMenu());
    }
  }

  /**
   * Inicializa com segurança os ícones Lucide no DOM atualizado
   * @private
   */
  _initLucide() {
    if (typeof window !== 'undefined' && window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }
}

export const timelineView = new TimelineView();
export default timelineView;
