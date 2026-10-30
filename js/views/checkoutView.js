/**
 * Raízes do Nordeste - Frente de Caixa Multicanal
 * View do Modal Mock de Gateway de Pagamento (js/views/checkoutView.js)
 * Design System: Warm Tactile Neo-Brutalism & Acessibilidade WCAG AA
 * Conforme especificado em docs/FSD.md (Módulo 8) e docs/DESIGN.md
 */

export class CheckoutView {
  constructor() {
    this.modalId = 'checkout-modal-overlay';
  }

  /**
   * Formata valor numérico para a moeda corrente brasileira (Real - BRL)
   * @param {number} value 
   * @returns {string} Ex: "R$ 24,90"
   */
  formatCurrency(value) {
    const num = Number(value) || 0;
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  /**
   * Sanitiza strings para prevenção de Cross-Site Scripting (XSS)
   * @param {string} str 
   * @returns {string}
   */
  escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Gera um QR Code estático decorativo em SVG inline de alta fidelidade
   * Totalmente aderente ao tema neo-brutalista, sem dependências externas
   * @returns {string}
   */
  generateMockQRCodeSVG() {
    return `
      <svg class="w-40 h-40 sm:w-44 sm:h-44 mx-auto p-2 bg-white border-[2.5px] border-[#4A1304] rounded-2xl shadow-tactile-sm" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="QR Code PIX para pagamento simulado">
        <!-- Padrões de Alinhamento dos Cantos (Position Detection Patterns) -->
        <!-- Superior Esquerdo -->
        <rect x="6" y="6" width="26" height="26" rx="3" fill="#4A1304"/>
        <rect x="10" y="10" width="18" height="18" rx="2" fill="#FFFFFF"/>
        <rect x="14" y="14" width="10" height="10" rx="1" fill="#4A1304"/>

        <!-- Superior Direito -->
        <rect x="68" y="6" width="26" height="26" rx="3" fill="#4A1304"/>
        <rect x="72" y="10" width="18" height="18" rx="2" fill="#FFFFFF"/>
        <rect x="76" y="14" width="10" height="10" rx="1" fill="#4A1304"/>

        <!-- Inferior Esquerdo -->
        <rect x="6" y="68" width="26" height="26" rx="3" fill="#4A1304"/>
        <rect x="10" y="72" width="18" height="18" rx="2" fill="#FFFFFF"/>
        <rect x="14" y="76" width="10" height="10" rx="1" fill="#4A1304"/>

        <!-- Linhas de Sincronismo (Timing Patterns) -->
        <rect x="36" y="17" width="4" height="4" fill="#4A1304"/>
        <rect x="44" y="17" width="4" height="4" fill="#4A1304"/>
        <rect x="52" y="17" width="4" height="4" fill="#4A1304"/>
        <rect x="60" y="17" width="4" height="4" fill="#4A1304"/>

        <rect x="17" y="36" width="4" height="4" fill="#4A1304"/>
        <rect x="17" y="44" width="4" height="4" fill="#4A1304"/>
        <rect x="17" y="52" width="4" height="4" fill="#4A1304"/>
        <rect x="17" y="60" width="4" height="4" fill="#4A1304"/>

        <!-- Dados Simulados (Matriz Decorativa Neo-Brutalista) -->
        <rect x="36" y="26" width="5" height="5" fill="#C9962E"/>
        <rect x="45" y="26" width="7" height="4" fill="#4A1304"/>
        <rect x="56" y="26" width="4" height="4" fill="#4A1304"/>
        <rect x="36" y="35" width="6" height="6" fill="#4A1304"/>
        <rect x="46" y="35" width="4" height="4" fill="#E9A36A"/>
        <rect x="54" y="35" width="6" height="6" fill="#4A1304"/>

        <rect x="26" y="44" width="5" height="5" fill="#4A1304"/>
        <rect x="35" y="45" width="5" height="5" fill="#C9962E"/>
        <rect x="44" y="44" width="12" height="12" rx="2" fill="#E9A36A" stroke="#4A1304" stroke-width="2"/>
        <!-- Ícone Estilizado Central (Marca Raízes / Cuscuz) -->
        <path d="M48 48L52 52M52 48L48 52" stroke="#4A1304" stroke-width="2" stroke-linecap="round"/>
        
        <rect x="60" y="44" width="6" height="5" fill="#4A1304"/>
        <rect x="70" y="44" width="5" height="6" fill="#4A1304"/>
        <rect x="80" y="44" width="4" height="5" fill="#C9962E"/>

        <rect x="36" y="60" width="6" height="6" fill="#4A1304"/>
        <rect x="46" y="60" width="6" height="4" fill="#4A1304"/>
        <rect x="56" y="60" width="5" height="5" fill="#C9962E"/>
        <rect x="65" y="60" width="5" height="5" fill="#4A1304"/>

        <rect x="36" y="72" width="5" height="5" fill="#4A1304"/>
        <rect x="45" y="72" width="6" height="6" fill="#E9A36A"/>
        <rect x="55" y="72" width="5" height="5" fill="#4A1304"/>
        <rect x="64" y="72" width="6" height="6" fill="#4A1304"/>
        <rect x="74" y="72" width="5" height="5" fill="#4A1304"/>
        <rect x="83" y="72" width="6" height="6" fill="#C9962E"/>

        <rect x="36" y="82" width="6" height="6" fill="#4A1304"/>
        <rect x="46" y="82" width="5" height="5" fill="#4A1304"/>
        <rect x="55" y="82" width="7" height="5" fill="#4A1304"/>
        <rect x="66" y="82" width="5" height="5" fill="#E9A36A"/>
        <rect x="75" y="82" width="6" height="6" fill="#4A1304"/>
        <rect x="85" y="82" width="5" height="5" fill="#4A1304"/>
      </svg>
    `;
  }

  /**
   * Renderiza a casca do modal no estado padrão (Seleção de Forma de Pagamento e Controles do Simulador)
   * @param {HTMLElement} container Ponto de montagem (geralmente #modal-container)
   * @param {Object} data Dados consolidados { cart, client, branch, currentMethod }
   * @param {Object} handlers Callbacks { onSelectMethod, onForceApprove, onForceReject, onClose, onCopyPix }
   */
  renderModal(container, data, handlers) {
    if (!container) return;

    const { cart, client, branch, currentMethod = 'pix' } = data;
    const branchName = branch ? branch.nome : 'Recife Antigo - Matriz';
    const clientName = client && client.nome ? this.escapeHTML(client.nome) : 'Cliente';
    const clientPhone = client && client.telefone ? this.escapeHTML(client.telefone) : '';
    const totalItems = cart && Array.isArray(cart.itens) 
      ? cart.itens.reduce((sum, item) => sum + (parseInt(item.quantidade, 10) || 0), 0) 
      : 0;

    const subtotal = cart ? Number(cart.subtotal) || 0 : 0;
    const discount = cart ? Number(cart.valor_desconto) || 0 : 0;
    const total = cart ? Number(cart.total) || 0 : 0;

    const html = `
      <div id="${this.modalId}" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#211b0f]/75 backdrop-blur-sm overflow-y-auto animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="checkout-modal-title">
        
        <!-- Cartão Principal do Modal -->
        <div id="checkout-modal-card" class="relative w-full max-w-lg bg-surface border-[2.5px] border-[#4A1304] rounded-3xl shadow-tactile-lg overflow-hidden flex flex-col my-auto max-h-[92vh] transition-all duration-300">
          
          <!-- Cabeçalho do Modal -->
          <div class="w-full bg-surface-container-high border-b-[2.5px] border-[#4A1304] px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
            <div class="flex items-center gap-2.5 min-w-0">
              <div class="w-8 h-8 rounded-full bg-primary-container border-[2px] border-[#4A1304] flex items-center justify-center shrink-0">
                <i data-lucide="shield-check" class="w-4 h-4 text-[#4A1304]"></i>
              </div>
              <div class="min-w-0">
                <h2 id="checkout-modal-title" class="font-headline-sm text-base sm:text-lg font-black text-[#4A1304] truncate">Simulador de Pagamento</h2>
                <p class="text-[11px] sm:text-xs text-on-surface-variant font-bold truncate">Retirada em: ${this.escapeHTML(branchName)}</p>
              </div>
            </div>

            <!-- Botão Fechar (X) -->
            <button id="btn-close-checkout-modal" type="button" class="w-8 h-8 rounded-full bg-surface border-[2px] border-[#4A1304] shadow-tactile-sm pressable flex items-center justify-center text-[#4A1304] hover:bg-[#EEB382] transition-colors shrink-0" aria-label="Fechar simulador de pagamento" title="Fechar">
              <i data-lucide="x" class="w-4 h-4"></i>
            </button>
          </div>

          <!-- Corpo do Modal com Scroll Interno -->
          <div id="checkout-modal-body" class="p-4 sm:p-6 overflow-y-auto flex flex-col gap-4">
            
            <!-- Resumo Financeiro Sintético do Pedido -->
            <div class="bg-surface-container border-[2px] border-[#4A1304] rounded-2xl p-3 sm:p-4 flex flex-col gap-2">
              <div class="flex items-center justify-between text-xs text-on-surface-variant font-bold pb-2 border-b border-[#4A1304]/20">
                <span>Cliente: <strong class="text-on-surface">${clientName}</strong> ${clientPhone ? `(${clientPhone})` : ''}</span>
                <span class="bg-surface px-2 py-0.5 rounded-full border border-[#4A1304] text-[10px] font-black">${totalItems} ${totalItems === 1 ? 'item' : 'itens'}</span>
              </div>

              <div class="flex items-center justify-between text-xs pt-1">
                <span class="text-on-surface-variant">Subtotal dos pratos:</span>
                <span class="font-bold text-on-surface">${this.formatCurrency(subtotal)}</span>
              </div>

              ${discount > 0 ? `
              <div class="flex items-center justify-between text-xs text-[#25D366] font-bold">
                <span class="flex items-center gap-1">
                  <i data-lucide="award" class="w-3.5 h-3.5"></i>
                  Desconto Nordeste Pontos:
                </span>
                <span>- ${this.formatCurrency(discount)}</span>
              </div>
              ` : ''}

              <div class="flex items-center justify-between pt-2 border-t border-[#4A1304]/20 text-sm sm:text-base">
                <span class="font-headline-sm font-black text-[#4A1304]">Total a Pagar:</span>
                <span class="font-headline-sm font-black text-primary text-lg sm:text-xl">${this.formatCurrency(total)}</span>
              </div>
            </div>

            <!-- Seleção da Forma de Pagamento (4 Opções FSD 6.8) -->
            <div class="flex flex-col gap-2">
              <label class="text-xs font-black text-[#4A1304] uppercase tracking-wider flex items-center gap-1.5">
                <i data-lucide="credit-card" class="w-3.5 h-3.5 text-primary"></i>
                <span>Escolha a Forma de Pagamento:</span>
              </label>

              <div class="grid grid-cols-2 gap-2 sm:gap-2.5">
                <!-- PIX -->
                <button type="button" data-method="pix" class="btn-payment-method p-2.5 sm:p-3 rounded-2xl border-[2px] text-left transition-all pressable flex flex-col gap-1.5 ${currentMethod === 'pix' ? 'bg-primary-container border-[#4A1304] shadow-tactile-sm' : 'bg-surface border-[#847469]/50 hover:bg-surface-container'}" aria-pressed="${currentMethod === 'pix'}">
                  <div class="flex items-center justify-between w-full">
                    <i data-lucide="qr-code" class="w-4 h-4 text-[#4A1304]"></i>
                    <span class="text-[10px] font-black uppercase px-1.5 py-0.2 rounded-full ${currentMethod === 'pix' ? 'bg-[#4A1304] text-white' : 'bg-surface-container-high text-on-surface-variant'}">Instantâneo</span>
                  </div>
                  <div>
                    <div class="font-black text-xs sm:text-sm text-[#4A1304]">PIX</div>
                    <div class="text-[10px] text-on-surface-variant font-medium">Aprovação imediata</div>
                  </div>
                </button>

                <!-- Cartão de Crédito -->
                <button type="button" data-method="credit" class="btn-payment-method p-2.5 sm:p-3 rounded-2xl border-[2px] text-left transition-all pressable flex flex-col gap-1.5 ${currentMethod === 'credit' ? 'bg-primary-container border-[#4A1304] shadow-tactile-sm' : 'bg-surface border-[#847469]/50 hover:bg-surface-container'}" aria-pressed="${currentMethod === 'credit'}">
                  <div class="flex items-center justify-between w-full">
                    <i data-lucide="credit-card" class="w-4 h-4 text-[#4A1304]"></i>
                    <span class="text-[10px] font-black uppercase px-1.5 py-0.2 rounded-full ${currentMethod === 'credit' ? 'bg-[#4A1304] text-white' : 'bg-surface-container-high text-on-surface-variant'}">Crédito</span>
                  </div>
                  <div>
                    <div class="font-black text-xs sm:text-sm text-[#4A1304]">Cartão Crédito</div>
                    <div class="text-[10px] text-on-surface-variant font-medium">À vista ou até 3x</div>
                  </div>
                </button>

                <!-- Cartão de Débito -->
                <button type="button" data-method="debit" class="btn-payment-method p-2.5 sm:p-3 rounded-2xl border-[2px] text-left transition-all pressable flex flex-col gap-1.5 ${currentMethod === 'debit' ? 'bg-primary-container border-[#4A1304] shadow-tactile-sm' : 'bg-surface border-[#847469]/50 hover:bg-surface-container'}" aria-pressed="${currentMethod === 'debit'}">
                  <div class="flex items-center justify-between w-full">
                    <i data-lucide="wallet" class="w-4 h-4 text-[#4A1304]"></i>
                    <span class="text-[10px] font-black uppercase px-1.5 py-0.2 rounded-full ${currentMethod === 'debit' ? 'bg-[#4A1304] text-white' : 'bg-surface-container-high text-on-surface-variant'}">Débito</span>
                  </div>
                  <div>
                    <div class="font-black text-xs sm:text-sm text-[#4A1304]">Cartão Débito</div>
                    <div class="text-[10px] text-on-surface-variant font-medium">Débito em conta</div>
                  </div>
                </button>

                <!-- Dinheiro / Balcão -->
                <button type="button" data-method="cash" class="btn-payment-method p-2.5 sm:p-3 rounded-2xl border-[2px] text-left transition-all pressable flex flex-col gap-1.5 ${currentMethod === 'cash' ? 'bg-primary-container border-[#4A1304] shadow-tactile-sm' : 'bg-surface border-[#847469]/50 hover:bg-surface-container'}" aria-pressed="${currentMethod === 'cash'}">
                  <div class="flex items-center justify-between w-full">
                    <i data-lucide="banknote" class="w-4 h-4 text-[#4A1304]"></i>
                    <span class="text-[10px] font-black uppercase px-1.5 py-0.2 rounded-full ${currentMethod === 'cash' ? 'bg-[#4A1304] text-white' : 'bg-surface-container-high text-on-surface-variant'}">No Balcão</span>
                  </div>
                  <div>
                    <div class="font-black text-xs sm:text-sm text-[#4A1304]">Dinheiro</div>
                    <div class="text-[10px] text-on-surface-variant font-medium">Pague na retirada</div>
                  </div>
                </button>
              </div>
            </div>

            <!-- Área Dinâmica de Instruções Conforme o Método -->
            <div id="payment-method-details" class="bg-surface-container-low border-[2px] border-[#4A1304] rounded-2xl p-3 sm:p-4 text-center">
              ${this._renderMethodDetailsHTML(currentMethod, total)}
            </div>

            <!-- Painel de Teste do Gateway (Simulação para Auditoria Acadêmica - FSD 6.8 & 12.7) -->
            <div class="stitch bg-surface-container-high/70 p-3.5 sm:p-4 rounded-2xl flex flex-col gap-3">
              <div class="flex items-center gap-2 text-xs font-black text-[#4A1304] uppercase tracking-wider">
                <i data-lucide="flask-conical" class="w-4 h-4 text-secondary"></i>
                <span>Controles de Teste do Gateway (Simulador):</span>
              </div>
              <p class="text-[11px] text-on-surface-variant leading-tight">
                Utilize os botões abaixo para simular o retorno da adquirente de pagamento e auditar os cenários previstos no FSD.
              </p>

              <!-- Botões de Ação de Teste do Gateway -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <!-- Forçar Aprovação -->
                <button id="btn-force-approve" type="button" class="w-full bg-[#25D366] hover:bg-[#20ba5a] text-[#113a1a] border-[2.5px] border-[#4A1304] py-3 px-3 rounded-full font-black text-xs sm:text-sm shadow-tactile-sm pressable flex items-center justify-center gap-1.5 transition-all cursor-pointer" title="Simular aprovação imediata da adquirente">
                  <i data-lucide="check-circle-2" class="w-4 h-4 shrink-0 text-[#113a1a]"></i>
                  <span>Forçar Aprovação</span>
                </button>

                <!-- Forçar Recusa -->
                <button id="btn-force-reject" type="button" class="w-full bg-[#BA1A1A] hover:bg-[#a01616] text-white border-[2.5px] border-[#4A1304] py-3 px-3 rounded-full font-black text-xs sm:text-sm shadow-tactile-sm pressable flex items-center justify-center gap-1.5 transition-all cursor-pointer" title="Simular recusa de transação com retentativa">
                  <i data-lucide="x-circle" class="w-4 h-4 shrink-0 text-white"></i>
                  <span>Forçar Recusa</span>
                </button>
              </div>
            </div>

          </div>

          <!-- Rodapé de Apoio Informativo -->
          <div class="bg-surface-container border-t-[2px] border-[#4A1304] px-4 py-2.5 text-center text-[11px] text-on-surface-variant font-medium">
            Ambiente de Simulação Segura • Nenhuma cobrança financeira real será emitida
          </div>

        </div>
      </div>
    `;

    container.innerHTML = html;

    // Vincula manipuladores de eventos
    this._attachModalEvents(container, handlers);

    // Inicializa ícones Lucide
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  /**
   * Renderiza os detalhes de instrução para o método de pagamento selecionado
   * @private
   */
  _renderMethodDetailsHTML(method, total) {
    switch (method) {
      case 'pix':
        return `
          <div class="flex flex-col items-center gap-2.5">
            <div class="text-xs font-bold text-[#4A1304]">Escaneie o QR Code no app do seu banco:</div>
            ${this.generateMockQRCodeSVG()}
            <div class="w-full max-w-xs flex items-center gap-1.5 bg-white border-[2px] border-[#4A1304] rounded-xl px-2.5 py-1.5 text-[11px]">
              <span class="truncate text-on-surface-variant select-all font-mono" id="pix-mock-code">00020126580014br.gov.bcb.pix0136rn-pdv-recife@raizesdonordeste.com.br5204000053039865405${Number(total).toFixed(2)}5802BR5918RAIZES DO NORDESTE6006RECIFE62070503***6304</span>
              <button id="btn-copy-pix" type="button" class="shrink-0 font-black text-primary hover:text-secondary underline flex items-center gap-1 text-[11px]" title="Copiar código PIX">
                <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                <span id="copy-pix-label">Copiar</span>
              </button>
            </div>
            <div class="text-[10px] text-on-surface-variant">Vencimento em 10 minutos • Identificação automática</div>
          </div>
        `;
      case 'credit':
        return `
          <div class="flex flex-col items-center gap-2 py-2">
            <div class="w-12 h-12 rounded-2xl bg-white border-[2px] border-[#4A1304] shadow-tactile-sm flex items-center justify-center">
              <i data-lucide="credit-card" class="w-6 h-6 text-primary"></i>
            </div>
            <div class="font-black text-xs sm:text-sm text-[#4A1304]">Aproxime ou insira seu cartão de crédito</div>
            <p class="text-[11px] text-on-surface-variant max-w-xs leading-tight">
              No totem físico ou balcão, utilize a maquininha para concluir o pagamento em até 3x sem juros.
            </p>
          </div>
        `;
      case 'debit':
        return `
          <div class="flex flex-col items-center gap-2 py-2">
            <div class="w-12 h-12 rounded-2xl bg-white border-[2px] border-[#4A1304] shadow-tactile-sm flex items-center justify-center">
              <i data-lucide="wallet" class="w-6 h-6 text-secondary"></i>
            </div>
            <div class="font-black text-xs sm:text-sm text-[#4A1304]">Insira seu cartão de débito</div>
            <p class="text-[11px] text-on-surface-variant max-w-xs leading-tight">
              Débito imediato em conta corrente com confirmação por senha no leitor seguro.
            </p>
          </div>
        `;
      case 'cash':
        return `
          <div class="flex flex-col items-center gap-2 py-2">
            <div class="w-12 h-12 rounded-2xl bg-white border-[2px] border-[#4A1304] shadow-tactile-sm flex items-center justify-center">
              <i data-lucide="banknote" class="w-6 h-6 text-tertiary"></i>
            </div>
            <div class="font-black text-xs sm:text-sm text-[#4A1304]">Pagamento no Balcão de Retirada</div>
            <p class="text-[11px] text-on-surface-variant max-w-xs leading-tight">
              Apresente o código do pedido diretamente ao caixa ao retirar seus pratos na filial.
            </p>
          </div>
        `;
      default:
        return '';
    }
  }

  /**
   * Conecta eventos da casca do modal
   * @private
   */
  _attachModalEvents(container, handlers) {
    const { onSelectMethod, onForceApprove, onForceReject, onClose, onCopyPix } = handlers;

    // Botão de Fechar
    const closeBtn = container.querySelector('#btn-close-checkout-modal');
    if (closeBtn && onClose) {
      closeBtn.addEventListener('click', () => onClose());
    }

    // Fechar ao clicar no backdrop escuro
    const overlay = container.querySelector(`#${this.modalId}`);
    if (overlay && onClose) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          onClose();
        }
      });
    }

    // Seletores de forma de pagamento
    const methodBtns = container.querySelectorAll('.btn-payment-method');
    methodBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const method = btn.dataset.method;
        if (onSelectMethod && method) {
          onSelectMethod(method);
        }
      });
    });

    // Botão Copiar PIX
    const copyPixBtn = container.querySelector('#btn-copy-pix');
    if (copyPixBtn && onCopyPix) {
      copyPixBtn.addEventListener('click', () => onCopyPix());
    }

    // Botão Forçar Aprovação
    const approveBtn = container.querySelector('#btn-force-approve');
    if (approveBtn && onForceApprove) {
      approveBtn.addEventListener('click', () => onForceApprove());
    }

    // Botão Forçar Recusa
    const rejectBtn = container.querySelector('#btn-force-reject');
    if (rejectBtn && onForceReject) {
      rejectBtn.addEventListener('click', () => onForceReject());
    }
  }

  /**
   * Atualiza a seleção do método de pagamento no DOM sem reconstruir todo o modal
   * @param {HTMLElement} container 
   * @param {string} newMethod 
   * @param {number} total 
   * @param {Function} onCopyPix 
   */
  updateSelectedMethod(container, newMethod, total, onCopyPix) {
    if (!container) return;

    // Atualiza estados dos botões
    const methodBtns = container.querySelectorAll('.btn-payment-method');
    methodBtns.forEach(btn => {
      const isCurrent = btn.dataset.method === newMethod;
      btn.setAttribute('aria-pressed', isCurrent ? 'true' : 'false');
      if (isCurrent) {
        btn.classList.add('bg-primary-container', 'border-[#4A1304]', 'shadow-tactile-sm');
        btn.classList.remove('bg-surface', 'border-[#847469]/50');
      } else {
        btn.classList.remove('bg-primary-container', 'border-[#4A1304]', 'shadow-tactile-sm');
        btn.classList.add('bg-surface', 'border-[#847469]/50');
      }
    });

    // Atualiza container de detalhes
    const detailsContainer = container.querySelector('#payment-method-details');
    if (detailsContainer) {
      detailsContainer.innerHTML = this._renderMethodDetailsHTML(newMethod, total);
      
      const copyPixBtn = detailsContainer.querySelector('#btn-copy-pix');
      if (copyPixBtn && onCopyPix) {
        copyPixBtn.addEventListener('click', () => onCopyPix());
      }

      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    }
  }

  /**
   * Renderiza a transição visual de SUCESSO (Verde Macaxeira #25D366)
   * Conforme especificado na Seção 6.8, 12.7 e 13.6 do FSD
   * @param {HTMLElement} container 
   * @param {Object} order Pedido aprovado
   * @param {Function} onContinue Callback para transição imediata para a Linha do Tempo
   */
  renderApprovalState(container, order, onContinue) {
    const card = container.querySelector('#checkout-modal-card');
    if (!card) return;

    const formattedTotal = this.formatCurrency(order.total_pago || order.total || 0);
    const orderNumber = order.numero_sequencial || '#RN-1042';
    const branchName = order.filial ? (order.filial.nome || order.filial) : 'Recife Antigo';
    const clientName = order.cliente ? order.cliente.nome : 'Cliente';
    const paymentMethod = order.forma_pagamento || 'PIX Instantâneo';

    card.className = 'relative w-full max-w-lg bg-[#25D366] text-[#113a1a] border-[3px] border-[#4A1304] rounded-3xl shadow-tactile-lg overflow-hidden flex flex-col my-auto transition-all duration-300';

    card.innerHTML = `
      <div class="p-6 sm:p-8 flex flex-col items-center text-center gap-4">
        
        <!-- Ícone Pulsante de Sucesso -->
        <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white border-[3px] border-[#4A1304] shadow-tactile-md flex items-center justify-center animate-bounce">
          <i data-lucide="check-circle-2" class="w-12 h-12 sm:w-14 sm:h-14 text-[#25D366]"></i>
        </div>

        <div class="flex flex-col gap-1">
          <span class="inline-block px-3 py-1 bg-[#113a1a] text-white rounded-full text-xs font-black tracking-wider uppercase mb-1">
            Transação Aprovada pela Adquirente
          </span>
          <h2 class="font-headline-md text-2xl sm:text-3xl font-black text-[#113a1a] leading-tight">
            Pagamento Confirmado!
          </h2>
          <p class="text-xs sm:text-sm font-bold text-[#113a1a]/80">
            Seu pedido sertanejo foi aceito e encaminhado à cozinha.
          </p>
        </div>

        <!-- Recibo Sintético do Pedido Aprovado -->
        <div class="w-full bg-white/95 border-[2.5px] border-[#4A1304] rounded-2xl p-4 text-left flex flex-col gap-2 shadow-tactile-sm">
          <div class="flex items-center justify-between pb-2 border-b border-[#4A1304]/20">
            <span class="text-xs font-bold text-on-surface-variant">Número do Pedido:</span>
            <span class="font-headline-sm font-black text-[#4A1304] text-base">${this.escapeHTML(orderNumber)}</span>
          </div>

          <div class="flex items-center justify-between text-xs">
            <span class="text-on-surface-variant">Filial de Retirada:</span>
            <strong class="text-on-surface font-extrabold truncate max-w-[200px]">${this.escapeHTML(branchName)}</strong>
          </div>

          <div class="flex items-center justify-between text-xs">
            <span class="text-on-surface-variant">Cliente:</span>
            <strong class="text-on-surface font-extrabold">${this.escapeHTML(clientName)}</strong>
          </div>

          <div class="flex items-center justify-between text-xs">
            <span class="text-on-surface-variant">Forma de Pagamento:</span>
            <strong class="text-on-surface font-extrabold">${this.escapeHTML(paymentMethod)}</strong>
          </div>

          <div class="flex items-center justify-between pt-2 border-t border-[#4A1304]/20">
            <span class="font-headline-sm font-black text-[#4A1304] text-sm">Total Liquidado:</span>
            <span class="font-headline-sm font-black text-primary text-lg">${formattedTotal}</span>
          </div>
        </div>

        <!-- Barra de Progresso Temporizada (Transição Automática de 1.5s) -->
        <div class="w-full flex flex-col gap-1.5 pt-1">
          <div class="flex items-center justify-between text-[11px] font-black text-[#113a1a]">
            <span>Redirecionando para a Linha do Tempo...</span>
            <span id="approval-countdown">1.5s</span>
          </div>
          <div class="w-full bg-[#113a1a]/20 h-2 rounded-full overflow-hidden border border-[#4A1304]">
            <div id="approval-progress-bar" class="bg-[#113a1a] h-full w-0 transition-all duration-[1500ms] ease-linear"></div>
          </div>
        </div>

        <!-- Botão Avançar Imediatamente -->
        <button id="btn-continue-to-timeline" type="button" class="w-full bg-white hover:bg-surface-container-high text-[#4A1304] border-[2.5px] border-[#4A1304] py-3.5 px-6 rounded-full font-black text-sm shadow-tactile-md pressable flex items-center justify-center gap-2 cursor-pointer transition-all">
          <span>Acompanhar Pedido Agora</span>
          <i data-lucide="arrow-right" class="w-4 h-4 text-[#4A1304]"></i>
        </button>

      </div>
    `;

    // Dispara animação da barra de progresso
    requestAnimationFrame(() => {
      const progressBar = card.querySelector('#approval-progress-bar');
      if (progressBar) {
        progressBar.style.width = '100%';
      }
    });

    const continueBtn = card.querySelector('#btn-continue-to-timeline');
    if (continueBtn && onContinue) {
      continueBtn.addEventListener('click', () => onContinue());
    }

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  /**
   * Renderiza a transição visual de RECUSA / ERRO (Vermelho Erro #BA1A1A)
   * Conforme especificado na Seção 6.8, 12.7 e 13.7 do FSD
   * @param {HTMLElement} container 
   * @param {Object} handlers Callbacks { onRetry, onCancel }
   */
  renderRejectionState(container, handlers) {
    const card = container.querySelector('#checkout-modal-card');
    if (!card) return;

    const { onRetry, onCancel } = handlers;

    card.className = 'relative w-full max-w-lg bg-[#BA1A1A] text-white border-[3px] border-[#4A1304] rounded-3xl shadow-tactile-lg overflow-hidden flex flex-col my-auto transition-all duration-300';

    card.innerHTML = `
      <div class="p-6 sm:p-8 flex flex-col items-center text-center gap-4">
        
        <!-- Ícone Pulsante de Erro -->
        <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white border-[3px] border-[#4A1304] shadow-tactile-md flex items-center justify-center animate-pulse">
          <i data-lucide="x-circle" class="w-12 h-12 sm:w-14 sm:h-14 text-[#BA1A1A]"></i>
        </div>

        <div class="flex flex-col gap-1">
          <span class="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-black tracking-wider uppercase mb-1">
            Simulação de Falha na Operadora
          </span>
          <h2 class="font-headline-md text-2xl sm:text-3xl font-black text-white leading-tight">
            Transação Não Autorizada
          </h2>
          <p class="text-xs sm:text-sm font-medium text-white/90">
            A adquirente bancária simulada recusou o pagamento.
          </p>
        </div>

        <!-- Box Informativo de Diagnóstico -->
        <div class="w-full bg-white/10 border-[2px] border-white/30 rounded-2xl p-4 text-left flex flex-col gap-2">
          <div class="flex items-center gap-2 text-xs font-bold text-white">
            <i data-lucide="alert-triangle" class="w-4 h-4 text-[#ffdea8] shrink-0"></i>
            <span>Motivo: Retorno 51 - Transação negada pela instituição financeira emissora.</span>
          </div>
          <p class="text-[11px] text-white/80 leading-relaxed">
            Fique tranquilo: <strong>seus pratos selecionados e o desconto do Nordeste Pontos continuam 100% salvos</strong> na sua sacola. Você pode selecionar outra forma de pagamento ou tentar novamente.
          </p>
        </div>

        <!-- Botões de Ação para Retentativa -->
        <div class="w-full flex flex-col gap-2.5 pt-2">
          <!-- Botão Tentar Novamente -->
          <button id="btn-retry-payment" type="button" class="w-full bg-white hover:bg-surface-container-high text-[#4A1304] border-[2.5px] border-[#4A1304] py-3.5 px-6 rounded-full font-black text-sm shadow-tactile-md pressable flex items-center justify-center gap-2 cursor-pointer transition-all">
            <i data-lucide="refresh-cw" class="w-4 h-4 text-[#4A1304]"></i>
            <span>Tentar Novamente (Outro Método)</span>
          </button>

          <!-- Botão Voltar para a Sacola -->
          <button id="btn-cancel-checkout" type="button" class="w-full bg-transparent hover:bg-white/10 text-white border-[2px] border-white/60 py-2.5 px-6 rounded-full font-bold text-xs pressable flex items-center justify-center gap-1.5 transition-all cursor-pointer">
            <i data-lucide="shopping-bag" class="w-3.5 h-3.5 text-white"></i>
            <span>Voltar para a Sacola de Compras</span>
          </button>
        </div>

      </div>
    `;

    const retryBtn = card.querySelector('#btn-retry-payment');
    if (retryBtn && onRetry) {
      retryBtn.addEventListener('click', () => onRetry());
    }

    const cancelBtn = card.querySelector('#btn-cancel-checkout');
    if (cancelBtn && onCancel) {
      cancelBtn.addEventListener('click', () => onCancel());
    }

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  /**
   * Remove o modal da tela
   * @param {HTMLElement} container 
   */
  closeModal(container) {
    if (!container) return;
    const overlay = container.querySelector(`#${this.modalId}`);
    if (overlay) {
      overlay.classList.add('animate-fade-out');
      setTimeout(() => {
        container.innerHTML = '';
      }, 200);
    } else {
      container.innerHTML = '';
    }
  }
}

export const checkoutView = new CheckoutView();
export default checkoutView;
