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
        <!-- Cabeçalho da Seção de Filiais -->
        <div class="flex flex-wrap items-center justify-between gap-2.5 mb-4">
          <div class="flex-1 min-w-[220px]">
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

        <!-- Grid Responsivo Adaptativo de Filiais (Auto-fit Minmax) -->
        <div class="grid-branches" role="radiogroup" aria-label="Filiais disponíveis para retirada">
          ${branches.map(branch => this.renderBranchCard(branch, branch.id === activeBranchId)).join('')}
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
        <div class="absolute -top-3.5 right-4 z-10 inline-flex items-center gap-1.5 px-3 py-1 bg-[#C9962E] text-[#4A1304] border-[2px] border-[#3A0E03] rounded-full text-xs font-black shadow-tactile-sm">
          <span>★</span>
          <span>LOJA SELECIONADA</span>
        </div>
      `
      : '';

    const actionButton = isSelected
      ? `
        <div class="w-full mt-4 py-2 px-4 rounded-full bg-[#B86A2C] text-white border-[2px] border-[#3A0E03] font-label-md text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-tactile-sm" aria-current="true">
          <i data-lucide="check-circle-2" class="w-4 h-4 text-[#ffdea8]"></i>
          <span>Filial Ativa</span>
        </div>
      `
      : `
        <button
          type="button"
          data-branch-select="${branch.id}"
          class="w-full mt-4 py-2 px-4 rounded-full bg-surface-container border-[2px] border-[#4A1304] text-[#4A1304] hover:bg-[#E9A36A] hover:text-[#4A1304] font-label-md text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-tactile-sm pressable transition-all"
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
        class="relative border-[2.5px] rounded-3xl p-4 sm:p-5 transition-all duration-200 cursor-pointer ${cardBgClass} flex flex-col justify-between"
      >
        ${selectedBadge}

        <!-- Efeito Costura de Couro Interno (.stitch) -->
        <div class="stitch p-3.5 flex flex-col justify-between flex-1 bg-surface-bright/40">
          <div>
            <!-- Cabeçalho do Card da Filial -->
            <div class="flex items-start justify-between gap-2 mb-2">
              <h3 class="font-headline-sm text-base sm:text-lg font-black text-[#4A1304] leading-snug">
                ${branch.nome}
              </h3>
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                branch.status === 'aberta' ? 'bg-[#25D366]/20 text-[#146c36] border border-[#25D366]' : 'bg-error-container text-error'
              }">
                <span class="w-1.5 h-1.5 rounded-full ${branch.status === 'aberta' ? 'bg-[#25D366]' : 'bg-error'}"></span>
                ${branch.status === 'aberta' ? 'Aberta' : 'Fechada'}
              </span>
            </div>

            <!-- Endereço Físico -->
            <p class="font-body-sm text-xs text-on-surface-variant flex items-start gap-1.5 mb-2.5">
              <i data-lucide="map-pin" class="w-4 h-4 text-primary shrink-0 mt-0.5"></i>
              <span>${branch.endereco}</span>
            </p>

            <!-- Horário e Tempo Estimado -->
            <div class="flex flex-wrap items-center gap-2 pt-2 border-t border-[#4A1304]/15 text-xs text-on-surface-variant">
              <span class="inline-flex items-center gap-1">
                <i data-lucide="clock" class="w-3.5 h-3.5 text-secondary"></i>
                <span>${branch.horario}</span>
              </span>
              <span class="text-[#4A1304]/30">•</span>
              <span class="inline-flex items-center gap-1 font-bold text-primary">
                <i data-lucide="timer" class="w-3.5 h-3.5"></i>
                <span>Preparo: ~${branch.tempo_estimado}</span>
              </span>
            </div>
          </div>

          <!-- Botão de Ação -->
          <div class="pt-2">
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
    if (!badgeElement) return;

    if (!branch) {
      badgeElement.innerHTML = `
        <i data-lucide="store" class="w-4 h-4 text-primary"></i>
        <span class="text-xs font-bold text-on-surface">Selecione uma filial</span>
      `;
      return;
    }

    badgeElement.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
        <i data-lucide="store" class="w-4 h-4 text-primary"></i>
        <div class="flex flex-col text-left">
          <span class="text-[10px] uppercase tracking-wider font-extrabold text-secondary">Filial Ativa</span>
          <span class="text-xs font-black text-[#4A1304] leading-none">${branch.nome}</span>
        </div>
      </div>
    `;

    badgeElement.classList.remove('hidden');
    badgeElement.classList.add('flex');
  }
};
