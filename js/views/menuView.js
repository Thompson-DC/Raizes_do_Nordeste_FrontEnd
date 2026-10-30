/**
 * Raízes do Nordeste - Frente de Caixa Multicanal
 * View: Renderização do Cardápio Regional e Filtros de Categoria (js/views/menuView.js)
 * Conforme especificado em docs/FSD.md e docs/DESIGN.md
 * 
 * Implementa o design system "Warm Tactile Neo-Brutalism":
 * - Chips de categorias com estados ativos táteis;
 * - Cards de pratos com bordas sólidas #4A1304, sombras 3D #3A0E03;
 * - Selos de destaque dourados;
 * - Proteção de imagem via fallback SVG temático sertanejo inline;
 * - Tratamento para pratos indisponíveis na filial ativa (opacidade/grayscale e bloqueio do botão).
 */

export const menuView = {
  /**
   * Formata número para a moeda brasileira (BRL)
   * @param {number} value 
   * @returns {string} Ex: "R$ 24,90"
   */
  formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  },

  /**
   * Retorna um Data URI de SVG temático para contingência visual de imagem inexistente
   * @param {string} category 
   * @param {string} title 
   * @returns {string} SVG em formato data URI
   */
  getSvgFallback(category, title) {
    let iconPath = '';
    let bgColor = '#FFF2DF';
    let accentColor = '#E9A36A';

    switch (category) {
      case 'cuscuz':
        bgColor = '#faecd8';
        accentColor = '#C9962E';
        // Ícone estilizado de cuscuzeira / cuscuz fumegante
        iconPath = `
          <ellipse cx="100" cy="125" rx="55" ry="18" fill="#dfa940" stroke="#4A1304" stroke-width="4"/>
          <path d="M 50 120 C 55 75, 145 75, 150 120 Z" fill="#f5bd52" stroke="#4A1304" stroke-width="4"/>
          <path d="M 90 60 Q 95 45 90 35 M 100 60 Q 105 45 100 35 M 110 60 Q 115 45 110 35" stroke="#B86A2C" stroke-width="3" stroke-linecap="round" fill="none"/>
        `;
        break;
      case 'tapioca':
        bgColor = '#fff8f2';
        accentColor = '#B86A2C';
        // Ícone estilizado de tapioca dobrada
        iconPath = `
          <path d="M 45 125 C 45 70, 155 70, 155 125 Z" fill="#ffffff" stroke="#4A1304" stroke-width="4"/>
          <path d="M 60 120 Q 100 100 140 120" stroke="#dfa940" stroke-width="6" stroke-linecap="round" fill="none"/>
          <circle cx="85" cy="98" r="3" fill="#B86A2C"/>
          <circle cx="115" cy="95" r="3" fill="#B86A2C"/>
        `;
        break;
      case 'tradicional':
        bgColor = '#faecd8';
        accentColor = '#885120';
        // Ícone estilizado de panela de barro sertaneja
        iconPath = `
          <ellipse cx="100" cy="120" rx="60" ry="22" fill="#5A1A05" stroke="#3A0E03" stroke-width="4"/>
          <path d="M 40 120 C 40 155, 160 155, 160 120 Z" fill="#885120" stroke="#4A1304" stroke-width="4"/>
          <path d="M 28 110 C 25 120, 38 125, 42 120" stroke="#4A1304" stroke-width="4" fill="none"/>
          <path d="M 172 110 C 175 120, 162 125, 158 120" stroke="#4A1304" stroke-width="4" fill="none"/>
        `;
        break;
      case 'bebida':
        bgColor = '#fff2df';
        accentColor = '#dfa940';
        // Ícone estilizado de copo de suco refrescante
        iconPath = `
          <path d="M 65 65 L 75 145 C 76 152, 124 152, 125 145 L 135 65 Z" fill="#fea360" stroke="#4A1304" stroke-width="4"/>
          <line x1="120" y1="40" x2="85" y2="135" stroke="#25D366" stroke-width="4" stroke-linecap="round"/>
          <circle cx="100" cy="110" r="4" fill="#ffffff" opacity="0.7"/>
          <circle cx="108" cy="95" r="3" fill="#ffffff" opacity="0.7"/>
        `;
        break;
      case 'sobremesa':
        bgColor = '#faecd8';
        accentColor = '#ba1a1a';
        // Ícone de fatia de bolo de rolo
        iconPath = `
          <path d="M 50 125 C 50 85, 150 85, 150 125 Z" fill="#ffdad6" stroke="#4A1304" stroke-width="4"/>
          <circle cx="100" cy="105" r="28" fill="#f4e6d3" stroke="#4A1304" stroke-width="3"/>
          <circle cx="100" cy="105" r="16" fill="#ba1a1a"/>
          <circle cx="100" cy="105" r="6" fill="#ffffff"/>
        `;
        break;
      default:
        bgColor = '#fff8f2';
        accentColor = '#E9A36A';
        iconPath = `
          <circle cx="100" cy="100" r="45" fill="#e9a36a" stroke="#4A1304" stroke-width="4"/>
          <path d="M 85 95 L 115 95 M 100 80 L 100 110" stroke="#4A1304" stroke-width="4" stroke-linecap="round"/>
        `;
    }

    const svgString = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 170" width="100%" height="100%">
        <rect width="100%" height="100%" fill="${bgColor}"/>
        <!-- Padrão geométrico suave de fundo sertanejo -->
        <circle cx="20" cy="20" r="2" fill="#EAC8A0" opacity="0.6"/>
        <circle cx="60" cy="30" r="2" fill="#EAC8A0" opacity="0.6"/>
        <circle cx="140" cy="25" r="2" fill="#EAC8A0" opacity="0.6"/>
        <circle cx="180" cy="40" r="2" fill="#EAC8A0" opacity="0.6"/>
        <circle cx="30" cy="150" r="2" fill="#EAC8A0" opacity="0.6"/>
        <circle cx="170" cy="145" r="2" fill="#EAC8A0" opacity="0.6"/>
        
        <!-- Ilustração Central -->
        <g id="illustration">
          ${iconPath}
        </g>
        
        <!-- Legenda Temática -->
        <text x="100" y="160" font-family="Epilogue, sans-serif" font-size="10" font-weight="800" fill="#4A1304" text-anchor="middle" letter-spacing="0.5">
          SABOR SERTANEJO
        </text>
      </svg>
    `.trim();

    return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
  },

  /**
   * Renderiza a barra de categorias (chips de filtro)
   * @param {HTMLElement} container 
   * @param {Array} categories 
   * @param {string} activeCategoryId 
   * @param {Function} onSelectCategory 
   */
  renderCategories(container, categories, activeCategoryId, onSelectCategory) {
    if (!container) return;

    container.innerHTML = `
      <section aria-labelledby="menu-categories-heading" class="w-full">
        <div class="flex items-center justify-between gap-3 mb-3">
          <div class="flex items-center gap-2">
            <i data-lucide="utensils" class="w-5 h-5 text-primary"></i>
            <h2 id="menu-categories-heading" class="font-headline-sm text-lg sm:text-xl font-black text-[#4A1304] tracking-tight">
              Cardápio Regional
            </h2>
          </div>
          <span class="text-xs font-bold text-on-surface-variant hidden sm:inline-block">
            Filtrar por especialidade
          </span>
        </div>

        <!-- Barra de Chips de Categorias (Wrap Responsivo Sem Cortes) -->
        <nav aria-label="Filtro de Categorias do Cardápio" class="w-full">
          <div class="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full" role="tablist">
            ${categories.map(cat => {
              const isActive = cat.id === activeCategoryId;
              const activeClass = isActive
                ? 'bg-[#C9962E] text-[#4A1304] border-[#4A1304] shadow-tactile-sm scale-[1.02] ring-2 ring-[#4A1304]/30'
                : 'bg-surface-container text-[#4A1304] border-[#4A1304] hover:bg-surface-container-high hover:shadow-tactile-sm';
              
              return `
                <button
                  type="button"
                  role="tab"
                  aria-selected="${isActive ? 'true' : 'false'}"
                  data-category-id="${cat.id}"
                  class="btn-category-chip px-3.5 sm:px-4 py-2 rounded-full border-[2px] font-label-md text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 cursor-pointer select-none active:translate-y-0.5 whitespace-nowrap flex-shrink-0 ${activeClass}"
                >
                  <span>${cat.nome}</span>
                </button>
              `;
            }).join('')}
          </div>
        </nav>
      </section>
    `;

    // Vincula eventos aos botões de categorias
    categories.forEach(cat => {
      const btn = container.querySelector(`[data-category-id="${cat.id}"]`);
      if (btn) {
        btn.addEventListener('click', () => {
          if (typeof onSelectCategory === 'function') {
            onSelectCategory(cat.id);
          }
        });
      }
    });
  },

  /**
   * Renderiza a grade de pratos do cardápio com validação de estoque por filial
   * @param {HTMLElement} container 
   * @param {Array} dishes - Lista de pratos filtrados
   * @param {string} activeBranchId - ID da filial atualmente selecionada
   * @param {Function} onAddToCart - Callback disparado ao clicar em Adicionar
   */
  renderMenuGrid(container, dishes, activeBranchId, onAddToCart) {
    if (!container) return;

    if (!dishes || dishes.length === 0) {
      container.innerHTML = `
        <div class="w-full p-8 text-center bg-surface-container-low rounded-2xl border-[2.5px] border-dashed border-[#4A1304] my-4">
          <i data-lucide="utensils-crossed" class="w-10 h-10 mx-auto text-secondary mb-2"></i>
          <h3 class="font-headline-sm text-base font-bold text-[#4A1304]">Nenhum prato encontrado nesta categoria</h3>
          <p class="font-body-sm text-xs text-on-surface-variant mt-1">Selecione "Todos os Pratos" para navegar pelo menu completo.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="grid-menu w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5" role="region" aria-label="Pratos disponíveis">
        ${dishes.map(dish => this.renderDishCard(dish, activeBranchId)).join('')}
      </div>
    `;

    // Vincula eventos de clique e proteção de imagem
    dishes.forEach(dish => {
      const cardElement = container.querySelector(`[data-dish-card="${dish.id}"]`);
      const addBtn = container.querySelector(`[data-add-to-cart="${dish.id}"]`);
      const imgElement = container.querySelector(`[data-dish-img="${dish.id}"]`);

      // Fallback robusto para imagem caso não exista ou falhe
      if (imgElement) {
        imgElement.addEventListener('error', () => {
          imgElement.src = this.getSvgFallback(dish.categoria, dish.nome);
        });
      }

      // Adição ao carrinho
      if (addBtn && !addBtn.disabled) {
        addBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (typeof onAddToCart === 'function') {
            onAddToCart(dish);
          }
        });
      }
    });
  },

  /**
   * Constrói o HTML de um card individual de prato
   * @param {Object} dish 
   * @param {string} activeBranchId 
   * @returns {string} Fragmento HTML do card
   */
  renderDishCard(dish, activeBranchId) {
    // Validação estrita de disponibilidade na filial ativa
    const isAvailable = Boolean(dish.disponibilidade && dish.disponibilidade[activeBranchId] !== false);
    
    // Tratamento visual para produto indisponível
    const cardAvailabilityClass = isAvailable
      ? 'bg-white border-[#4A1304] shadow-tactile-md hover:shadow-tactile-lg'
      : 'bg-surface-container-highest/60 border-[#847469] opacity-75 grayscale-[0.4] shadow-tactile-sm';

    // Selos superiores (destaque promocional e/ou indisponibilidade)
    let badgeHtml = '';
    if (!isAvailable) {
      badgeHtml = `
        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#BA1A1A] text-white border-[1.5px] border-[#3A0E03] rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
          <i data-lucide="alert-circle" class="w-3 h-3"></i>
          <span>Indisponível nesta Filial</span>
        </span>
      `;
    } else if (dish.badge_destaque) {
      badgeHtml = `
        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#C9962E] text-[#4A1304] border-[1.5px] border-[#3A0E03] rounded-full text-[10px] font-black tracking-wider shadow-tactile-xs">
          <span>${dish.badge_destaque}</span>
        </span>
      `;
    }

    // Botão de Adição
    const btnHtml = isAvailable
      ? `
        <button
          type="button"
          data-add-to-cart="${dish.id}"
          class="btn-add-dish inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:py-2.5 bg-[#E9A36A] hover:bg-[#EEB382] text-[#4A1304] border-[2px] border-[#4A1304] rounded-full font-label-md text-xs sm:text-sm font-black shadow-tactile-sm active:translate-y-0.5 active:shadow-tactile-xs transition-all cursor-pointer min-h-[44px]"
          aria-label="Adicionar ${dish.nome} por ${this.formatCurrency(dish.preco)}"
        >
          <i data-lucide="plus" class="w-4 h-4 text-[#4A1304]"></i>
          <span>Adicionar</span>
        </button>
      `
      : `
        <button
          type="button"
          disabled
          class="inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:py-2.5 bg-[#d7c3b6] text-[#52443a] border-[2px] border-[#847469] rounded-full font-label-md text-xs sm:text-sm font-black cursor-not-allowed opacity-75 min-h-[44px]"
          aria-label="${dish.nome} indisponível nesta unidade"
          title="Prato esgotado no momento para esta filial"
        >
          <i data-lucide="slash" class="w-3.5 h-3.5"></i>
          <span>Esgotado</span>
        </button>
      `;

    return `
      <article
        data-dish-card="${dish.id}"
        class="card-dish relative flex flex-col justify-between p-3.5 sm:p-4 rounded-3xl border-[2.5px] transition-all duration-200 overflow-hidden ${cardAvailabilityClass}"
      >
        <div>
          <!-- Moldura da Imagem com Proteção e Fallback SVG -->
          <div class="relative w-full h-44 sm:h-48 rounded-2xl border-[2px] border-[#4A1304] overflow-hidden bg-surface-container mb-3.5 flex items-center justify-center">
            <img
              src="${dish.imagem}"
              alt="${dish.nome}"
              data-dish-img="${dish.id}"
              class="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
              loading="lazy"
              onerror="this.onerror=null; this.src='${this.getSvgFallback(dish.categoria, dish.nome)}';"
            />
            <!-- Badges Sobrepostos -->
            <div class="absolute top-2 left-2 z-10 flex flex-wrap gap-1.5 max-w-[90%]">
              ${badgeHtml}
            </div>
          </div>

          <!-- Título e Descrição do Prato -->
          <h3 class="font-headline-sm text-base sm:text-lg font-black text-[#4A1304] leading-snug tracking-tight mb-1">
            ${dish.nome}
          </h3>
          <p class="font-body-sm text-xs sm:text-sm text-on-surface-variant line-clamp-2 leading-relaxed mb-3">
            ${dish.descricao}
          </p>
        </div>

        <!-- Rodapé do Card: Preço e Ação -->
        <div class="pt-3 border-t-[1.5px] border-[#EAC8A0] flex items-center justify-between gap-2 mt-auto">
          <div>
            <span class="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Preço</span>
            <span class="font-headline-sm text-base sm:text-lg font-black text-[#4A1304]">
              ${this.formatCurrency(dish.preco)}
            </span>
          </div>
          <div>
            ${btnHtml}
          </div>
        </div>
      </article>
    `;
  }
};
