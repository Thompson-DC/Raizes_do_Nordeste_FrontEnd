/**
 * Raízes do Nordeste - Frente de Caixa Multicanal
 * View: Renderização das Filiais (js/views/branchView.js)
 * Conforme especificado em docs/FSD.md e docs/DESIGN.md
 * 
 * Implementa o design system "Warm Tactile Neo-Brutalism" com o efeito .stitch,
 * cards em elevação tátil e selo dourado "★ LOJA SELECIONADA".
 */

export const branchView = {
  /**
   * Renderiza a seção de filiais no container fornecido
   * @param {HTMLElement} container - Elemento onde os cards serão injetados
   * @param {Array} branches - Lista de filiais vindas de mockData
   * @param {string} activeBranchId - ID da filial atualmente selecionada
   * @param {Function} onSelectBranch - Callback disparado ao selecionar uma filial
   */
  renderBranches(container, branches, activeBranchId, onSelectBranch) {
    if (!container) return;

    container.innerHTML = `
      <section aria-labelledby="branches-section-title" class="w-full">
        <div class="max-w-5xl mx-auto">
          <!-- Cabeçalho da Seção de Filiais -->
          <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div class="flex-1 min-w-[240px]">
              <div class="flex items-center gap-2">
                <i data-lucide="store" class="w-5 h-5 text-primary"></i>
                <h2 id="branches-section-title" class="font-headline-sm text-lg sm:text-xl font-black text-[#4A1304] tracking-tight">
                  Selecione a Filial de Atendimento
                </h2>
              </div>
              <p class="font-body-sm text-xs sm:text-sm text-on-surface-variant mt-0.5">
                O estoque dos pratos sertanejos e o tempo de preparo são calculados de acordo com a unidade escolhida.
              </p>
            </div>
            <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-high rounded-full border border-[#4A1304]/30 text-xs font-bold text-secondary">
              <span class="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
              3 Lojas em Operação
            </span>
          </div>

          <!-- Grid Responsivo de Filiais com Distribuição Centralizada -->
          <div class="grid-branches w-full" role="radiogroup" aria-label="Filiais disponíveis para retirada">
            ${branches.map(branch => this.renderBranchCard(branch, branch.id === activeBranchId)).join('')}
          </div>
        </div>
      </section>
    `;

    // Vinculação de eventos nos cards
    branches.forEach(branch => {
      const cardBtn = container.querySelector(`[data-branch-select="${branch.id}"]`);
      const cardElement = container.querySelector(`[data-branch-card="${branch.id}"]`);

      const handleSelection = () => {
        if (typeof onSelectBranch === 'function') {
          onSelectBranch(branch.id);
        }
      };

      if (cardBtn) {
        cardBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          handleSelection();
        });
      }

      if (cardElement) {
        cardElement.addEventListener('click', handleSelection);
        cardElement.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSelection();
          }
        });
      }
    });
  },

  /**
   * Gera o fragmento HTML de um card individual de filial
   * @param {Object} branch - Dados da filial
   * @param {boolean} isSelected - Se a filial é a atualmente selecionada
   * @returns {string} Fragmento HTML
   */
  renderBranchCard(branch, isSelected) {
    const cardBgClass = isSelected
      ? 'bg-surface-container-low border-[#B86A2C] shadow-tactile-lg ring-2 ring-[#B86A2C]/40'
      : 'bg-white border-[#4A1304] shadow-tactile-md hover:border-[#B86A2C]/80 hover:shadow-tactile-lg';

    const selectedBadge = isSelected
      ? `
        <div class="absolute -top-3 right-3 z-10 inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#C9962E] text-[#4A1304] border-[2px] border-[#3A0E03] rounded-full text-[10px] sm:text-xs font-black shadow-tactile-sm">
          <span>★</span>
          <span>LOJA SELECIONADA</span>
        </div>
      `
      : '';

    const actionButton = isSelected
      ? `
        <div class="btn-active-branch w-full mt-3 py-1.5 px-3 rounded-full bg-[#B86A2C] text-white border-[2px] border-[#3A0E03] font-label-md text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-tactile-sm" aria-current="true">
          <i data-lucide="check-circle-2" class="w-4 h-4 text-[#ffdea8]"></i>
          <span>Filial Ativa</span>
        </div>
      `
      : `
        <button
          type="button"
          data-branch-select="${branch.id}"
          class="w-full mt-3 py-1.5 px-3 rounded-full bg-surface-container border-[2px] border-[#4A1304] text-[#4A1304] hover:bg-[#E9A36A] hover:text-[#4A1304] font-label-md text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-tactile-sm pressable transition-all"
          aria-label="Selecionar filial ${branch.nome}"
        >
          <i data-lucide="check" class="w-4 h-4"></i>
          <span>Escolher Esta Filial</span>
        </button>
      `;

    return `
      <article
        data-branch-card="${branch.id}"
        role="radio"
        aria-checked="${isSelected}"
        tabindex="0"
        class="relative border-[2.5px] rounded-3xl p-3.5 sm:p-4 transition-all duration-200 cursor-pointer ${cardBgClass} flex flex-col justify-between w-full h-full"
      >
        ${selectedBadge}

        <!-- Efeito Costura de Couro Interno (.stitch) -->
        <div class="stitch p-3 sm:p-3.5 flex flex-col justify-between flex-1 bg-surface-bright/40 w-full">
          <div>
            <!-- Cabeçalho do Card da Filial -->
            <div class="flex items-start justify-between gap-1.5 mb-2">
              <h3 class="font-headline-sm text-sm sm:text-base font-black text-[#4A1304] leading-snug">
                ${branch.nome}
              </h3>
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold ${
                branch.status === 'aberta' ? 'bg-[#25D366]/20 text-[#146c36] border border-[#25D366]' : 'bg-error-container text-error'
              }">
                <span class="w-1.5 h-1.5 rounded-full ${branch.status === 'aberta' ? 'bg-[#25D366]' : 'bg-error'}"></span>
                ${branch.status === 'aberta' ? 'Aberta' : 'Fechada'}
              </span>
            </div>

            <!-- Endereço Físico -->
            <p class="font-body-sm text-[11px] sm:text-xs text-on-surface-variant flex items-start gap-1 mb-2">
              <i data-lucide="map-pin" class="w-3.5 h-3.5 text-primary shrink-0 mt-0.5"></i>
              <span class="line-clamp-2">${branch.endereco}</span>
            </p>

            <!-- Horário e Tempo Estimado -->
            <div class="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#4A1304]/15 text-[11px] text-on-surface-variant">
              <span class="inline-flex items-center gap-1">
                <i data-lucide="clock" class="w-3 h-3 text-secondary"></i>
                <span>${branch.horario}</span>
              </span>
              <span class="text-[#4A1304]/30">•</span>
              <span class="inline-flex items-center gap-1 font-bold text-primary">
                <i data-lucide="timer" class="w-3 h-3"></i>
                <span>~${branch.tempo_estimado}</span>
              </span>
            </div>
          </div>

          <!-- Botão de Ação -->
          <div class="pt-1">
            ${actionButton}
          </div>
        </div>
      </article>
    `;
  },

  /**
   * Atualiza o badge de filial ativa no cabeçalho geral da aplicação
   * @param {HTMLElement} badgeElement - Elemento do cabeçalho
   * @param {Object|null} branch - Filial selecionada
   */
  updateActiveBranchBadge(badgeElement, branch) {
    const targets = typeof document !== 'undefined' ? document.querySelectorAll('.active-branch-badge-target') : [];
    const elementsToUpdate = targets.length > 0 ? Array.from(targets) : (badgeElement ? [badgeElement] : []);

    elementsToUpdate.forEach(el => {
      if (!branch) {
        el.innerHTML = `
          <i data-lucide="store" class="w-4 h-4 text-primary shrink-0"></i>
          <span class="text-xs font-bold text-on-surface truncate">Selecione uma filial</span>
        `;
      } else {
        el.innerHTML = `
          <div class="flex items-center gap-2 min-w-0">
            <span class="w-2 h-2 rounded-full bg-[#25D366] animate-pulse shrink-0"></span>
            <i data-lucide="store" class="w-4 h-4 text-primary shrink-0"></i>
            <div class="flex flex-col text-left min-w-0">
              <span class="text-[10px] uppercase tracking-wider font-extrabold text-secondary leading-none">Filial Ativa</span>
              <span class="text-xs font-black text-[#4A1304] leading-tight truncate">${branch.nome}</span>
            </div>
          </div>
        `;
      }
    });

    if (typeof window !== 'undefined' && window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  },

  /**
   * Sanitização contra injeção de HTML/XSS
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
   * Renderiza o modal de confirmação de troca de filial com carrinho ativo (Regra FSD 14.1)
   * @param {HTMLElement} container - Elemento #modal-container
   * @param {Object} currentBranch - Filial atualmente ativa
   * @param {Object} newBranch - Nova filial pretendida
   * @param {Array<string>} unavailableDishes - Nomes dos pratos esgotados na nova filial
   * @param {Function} onConfirm - Callback ao confirmar
   * @param {Function} onCancel - Callback ao cancelar
   */
  renderBranchChangeModal(container, currentBranch, newBranch, unavailableDishes, onConfirm, onCancel) {
    if (!container) return;

    const currentName = currentBranch ? currentBranch.nome : 'Filial Atual';
    const newName = newBranch ? newBranch.nome : 'Nova Filial';
    const hasUnavailable = Array.isArray(unavailableDishes) && unavailableDishes.length > 0;

    container.innerHTML = `
      <div id="branch-modal-overlay" class="fixed inset-0 bg-[#211b0f]/65 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-200">
        <div 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="branch-modal-title"
          class="bg-surface-container-lowest border-[2.5px] border-[#4A1304] rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-tactile-lg flex flex-col gap-4 animate-scale-in"
        >
          <!-- Ícone e Título -->
          <div class="flex flex-col items-center text-center gap-2">
            <div class="w-12 h-12 rounded-full ${hasUnavailable ? 'bg-error-container text-error' : 'bg-secondary-container text-[#4A1304]'} border-[2px] border-[#4A1304] flex items-center justify-center shadow-tactile-sm">
              <i data-lucide="${hasUnavailable ? 'alert-triangle' : 'store'}" class="w-6 h-6"></i>
            </div>
            <h3 id="branch-modal-title" class="font-headline-sm text-lg sm:text-xl font-black text-[#4A1304] leading-tight">
              Trocar Filial de Retirada?
            </h3>
            <p class="font-body-sm text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Você já possui itens na sua sacola vinculados à unidade <strong>${this.escapeHtml(currentName)}</strong>.
            </p>
          </div>

          <!-- Alerta de Itens Esgotados se houver -->
          ${hasUnavailable ? `
            <div class="bg-error-container/40 border-[2px] border-error rounded-2xl p-3.5 text-xs text-[#93000a] flex items-start gap-2.5">
              <i data-lucide="info" class="w-4 h-4 text-error shrink-0 mt-0.5"></i>
              <div class="flex-1">
                <span class="font-black block uppercase text-[11px] tracking-wider mb-0.5">Itens Indisponíveis na Nova Loja</span>
                <span>Na unidade <strong>${this.escapeHtml(newName)}</strong>, o(s) prato(s) <strong>${unavailableDishes.map(d => `"${this.escapeHtml(d)}"`).join(', ')}</strong> não possui(em) estoque e será(ão) removido(s) da sua sacola.</span>
              </div>
            </div>
          ` : `
            <div class="bg-surface-container border-[1.5px] border-[#4A1304]/30 rounded-2xl p-3 text-xs text-on-surface-variant flex items-center gap-2">
              <i data-lucide="check-circle" class="w-4 h-4 text-[#25D366] shrink-0"></i>
              <span>Todos os pratos da sua sacola estão disponíveis na unidade <strong>${this.escapeHtml(newName)}</strong>.</span>
            </div>
          `}

          <!-- Botões de Ação -->
          <div class="flex items-center justify-end gap-2.5 pt-2 border-t border-[#4A1304]/15">
            <button 
              type="button" 
              id="btn-branch-modal-cancel" 
              class="flex-1 sm:flex-none py-2.5 px-4 rounded-full border-[2px] border-[#4A1304] bg-surface-container hover:bg-surface-dim font-bold text-xs text-[#4A1304] shadow-tactile-sm pressable transition-all cursor-pointer"
            >
              Manter ${this.escapeHtml(currentName.split('-')[0].trim())}
            </button>
            <button 
              type="button" 
              id="btn-branch-modal-confirm" 
              class="flex-1 sm:flex-none py-2.5 px-5 rounded-full border-[2.5px] border-[#4A1304] bg-primary-container hover:bg-[#EEB382] font-black text-xs text-[#4A1304] shadow-tactile-md pressable transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Confirmar Troca</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    if (typeof window !== 'undefined' && window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }

    const close = () => {
      container.innerHTML = '';
    };

    const cancelBtn = container.querySelector('#btn-branch-modal-cancel');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        close();
        if (typeof onCancel === 'function') onCancel();
      });
    }

    const confirmBtn = container.querySelector('#btn-branch-modal-confirm');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        close();
        if (typeof onConfirm === 'function') onConfirm();
      });
    }
  }
};
