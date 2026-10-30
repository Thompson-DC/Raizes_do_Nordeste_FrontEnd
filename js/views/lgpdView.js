/**
 * Raízes do Nordeste - Frente de Caixa Multicanal
 * View: Conformidade LGPD e Termos de Privacidade (js/views/lgpdView.js)
 * Conforme especificado em docs/FSD.md (Seções 6.6, 12.9, 14.4 e 20.2) e docs/DESIGN.md
 */

import { CONFIG } from '../../config/config.js';

export const lgpdView = {
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
   * Renderiza o banner inferior de cookies e conformidade inicial com a LGPD
   * @param {HTMLElement} container Container fixo inferior (#lgpd-banner-container)
   * @param {Object} handlers Callbacks de interação ({ onAccept, onOpenTerms })
   */
  renderBanner(container, handlers = {}) {
    if (!container) return;

    const cookieText = (CONFIG.lgpd && CONFIG.lgpd.texto_cookies) 
      ? CONFIG.lgpd.texto_cookies 
      : 'Utilizamos cookies e armazenamento local para viabilizar seus pedidos e personalizar benefícios de acordo com a LGPD.';

    container.innerHTML = `
      <aside 
        id="lgpd-banner" 
        class="w-full bg-[#faecd8] border-t-[2.5px] border-[#4A1304] shadow-tactile-lg p-3 sm:p-4 transition-all duration-300 transform translate-y-0"
        role="region"
        aria-label="Aviso de Privacidade e Cookies"
      >
        <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">
          <!-- Ícone e Mensagem Regulatória -->
          <div class="flex items-start sm:items-center gap-3 min-w-0">
            <div class="w-9 h-9 rounded-full bg-[#C9962E] border-[2px] border-[#4A1304] flex items-center justify-center text-[#4A1304] shrink-0 shadow-tactile-xs mt-0.5 sm:mt-0">
              <i data-lucide="shield-check" class="w-5 h-5"></i>
            </div>
            <div class="text-xs text-[#4A1304] leading-relaxed">
              <p class="font-bold">
                ${this.escapeHtml(cookieText)}
                <button 
                  type="button" 
                  id="btn-lgpd-terms-link" 
                  class="text-secondary font-black underline hover:text-primary transition-colors ml-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-secondary rounded"
                  title="Ler a Política de Privacidade e Termos de Uso"
                >
                  Saiba mais sobre seus direitos
                </button>
              </p>
            </div>
          </div>

          <!-- Ação de Consentimento / Botão de Aceite -->
          <div class="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
            <button 
              type="button" 
              id="btn-accept-lgpd" 
              class="w-full sm:w-auto bg-primary-container text-[#4A1304] font-headline-sm text-xs sm:text-sm font-black px-5 py-2.5 rounded-full border-[2px] border-[#4A1304] shadow-tactile-sm pressable hover:bg-[#EEB382] transition-all flex items-center justify-center gap-2 cursor-pointer"
              title="Aceitar armazenamento e fechar aviso"
            >
              <i data-lucide="check" class="w-4 h-4"></i>
              <span>Aceitar e Fechar</span>
            </button>
          </div>
        </div>
      </aside>
    `;

    // Vincula eventos do banner
    const acceptBtn = container.querySelector('#btn-accept-lgpd');
    if (acceptBtn && typeof handlers.onAccept === 'function') {
      acceptBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handlers.onAccept();
      });
    }

    const termsLink = container.querySelector('#btn-lgpd-terms-link');
    if (termsLink && typeof handlers.onOpenTerms === 'function') {
      termsLink.addEventListener('click', (e) => {
        e.preventDefault();
        handlers.onOpenTerms();
      });
    }

    // Inicializa ícones Lucide com segurança
    if (typeof window !== 'undefined' && window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  },

  /**
   * Oculta o banner inferior com transição fluida
   * @param {HTMLElement} container 
   */
  hideBanner(container) {
    if (!container) return;
    const banner = container.querySelector('#lgpd-banner');
    if (banner) {
      banner.classList.add('translate-y-full', 'opacity-0');
      setTimeout(() => {
        container.innerHTML = '';
      }, 300);
    } else {
      container.innerHTML = '';
    }
  },

  /**
   * Renderiza o modal completo dos Termos de Privacidade e Proteção de Dados (LGPD)
   * @param {HTMLElement} modalContainer Container alvo (#modal-container)
   * @param {Function} onClose Callback ao fechar o modal
   */
  renderTermsModal(modalContainer, onClose) {
    if (!modalContainer) return;

    const modalId = 'lgpd-terms-modal';
    const version = (CONFIG.lgpd && CONFIG.lgpd.versao_termos) || '1.0';

    modalContainer.innerHTML = `
      <div 
        id="${modalId}" 
        class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lgpd-modal-title"
      >
        <div class="w-full max-w-xl max-h-[90vh] bg-surface-container-lowest border-[2.5px] border-[#4A1304] rounded-3xl shadow-tactile-lg flex flex-col overflow-hidden animate-scale-up">
          
          <!-- Cabeçalho do Modal -->
          <div class="p-4 sm:p-5 bg-surface-container border-b-[2px] border-[#4A1304] flex items-center justify-between gap-3">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-full bg-[#C9962E] border-[2px] border-[#4A1304] flex items-center justify-center text-[#4A1304] shadow-tactile-xs shrink-0">
                <i data-lucide="shield" class="w-5 h-5"></i>
              </div>
              <div>
                <h3 id="lgpd-modal-title" class="font-headline-sm text-base sm:text-lg font-black text-[#4A1304] leading-tight">
                  Política de Privacidade & LGPD
                </h3>
                <p class="text-[11px] font-bold text-on-surface-variant">
                  Versão ${this.escapeHtml(version)} • Em conformidade com a Lei nº 13.709/2018
                </p>
              </div>
            </div>

            <button 
              type="button" 
              id="btn-close-lgpd-modal" 
              class="w-8 h-8 rounded-full border-[2px] border-[#4A1304] bg-surface text-[#4A1304] hover:bg-[#EEB382] transition-colors flex items-center justify-center pressable shadow-tactile-xs"
              title="Fechar janela de termos"
              aria-label="Fechar termos"
            >
              <i data-lucide="x" class="w-4 h-4"></i>
            </button>
          </div>

          <!-- Corpo dos Termos de Uso e Privacidade -->
          <div class="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-on-surface leading-relaxed font-body-md pr-3">
            
            <section class="bg-surface-container-low p-3.5 rounded-2xl border border-[#4A1304]/20 space-y-1.5">
              <h4 class="font-headline-sm text-xs sm:text-sm font-black text-[#4A1304] flex items-center gap-1.5">
                <i data-lucide="info" class="w-4 h-4 text-primary"></i>
                <span>1. Quem Somos e Nosso Compromisso</span>
              </h4>
              <p class="text-on-surface-variant">
                A rede gastronômica <strong>Raízes do Nordeste</strong> valoriza a sua privacidade e a transparência no relacionamento com nossos clientes. Este documento esclarece como seus dados pessoais são coletados, tratados e protegidos durante sua experiência de autoatendimento.
              </p>
            </section>

            <section class="space-y-1.5">
              <h4 class="font-headline-sm text-xs sm:text-sm font-black text-[#4A1304]">
                2. Quais Dados Coletamos
              </h4>
              <p class="text-on-surface-variant">
                Para a execução do seu pedido e entrega no balcão, solicitamos estritamente os seguintes dados:
              </p>
              <ul class="list-disc list-inside space-y-1 pl-1 text-on-surface-variant font-medium">
                <li><strong>Nome Completo:</strong> utilizado para chamada no balcão e identificação da comanda;</li>
                <li><strong>Telefone Celular / WhatsApp:</strong> utilizado para envio de avisos sobre o status do pedido e vinculação ao programa de fidelidade <em>Nordeste Pontos</em>.</li>
              </ul>
            </section>

            <section class="space-y-1.5">
              <h4 class="font-headline-sm text-xs sm:text-sm font-black text-[#4A1304]">
                3. Finalidade e Base Legal do Tratamento
              </h4>
              <p class="text-on-surface-variant">
                O tratamento de seus dados apoia-se no <strong>Art. 7º, Inciso V (Execução de Contrato)</strong> e no <strong>Inciso I (Consentimento do Titular)</strong> da LGPD (Lei nº 13.709/2018), com as finalidades exclusivas de:
              </p>
              <ul class="list-disc list-inside space-y-1 pl-1 text-on-surface-variant">
                <li>Processar o pedido e direcioná-lo à cozinha da filial selecionada;</li>
                <li>Atribuir e resgatar descontos do programa de fidelidade <em>Nordeste Pontos</em>;</li>
                <li>Garantir a segurança operacional e prevenção a fraudes no ponto de venda.</li>
              </ul>
            </section>

            <section class="bg-surface-container-high/40 p-3.5 rounded-2xl border border-[#4A1304]/20 space-y-1.5">
              <h4 class="font-headline-sm text-xs sm:text-sm font-black text-[#4A1304] flex items-center gap-1.5">
                <i data-lucide="lock" class="w-4 h-4 text-secondary"></i>
                <span>4. Armazenamento Local e Ausência de Compartilhamento</span>
              </h4>
              <p class="text-on-surface-variant">
                Esta aplicação opera como simulador interativo client-side ("Zero-Build"). Seus dados permanecem armazenados estritamente na memória local do seu navegador (<em>Web Storage / LocalStorage</em>), <strong>sem compartilhamento com terceiros, corretores de dados ou servidores externos</strong>.
              </p>
            </section>

            <section class="space-y-1.5">
              <h4 class="font-headline-sm text-xs sm:text-sm font-black text-[#4A1304]">
                5. Seus Direitos como Titular (Art. 18 da LGPD)
              </h4>
              <p class="text-on-surface-variant">
                Você possui total controle sobre seus dados e pode, a qualquer momento:
              </p>
              <ul class="list-disc list-inside space-y-1 pl-1 text-on-surface-variant">
                <li>Confirmar a existência de tratamento e consultar os dados informados;</li>
                <li>Alterar ou retificar seu nome e telefone diretamente na interface de checkout;</li>
                <li>Revogar seu consentimento e solicitar a limpeza total dos dados locais através da opção de reset ou limpeza do navegador.</li>
              </ul>
            </section>

          </div>

          <!-- Rodapé do Modal -->
          <div class="p-4 bg-surface-container border-t-[2px] border-[#4A1304] flex items-center justify-end">
            <button 
              type="button" 
              id="btn-confirm-lgpd-modal" 
              class="w-full sm:w-auto bg-primary text-white font-headline-sm text-xs sm:text-sm font-black px-6 py-2.5 rounded-full border-[2px] border-[#4A1304] shadow-tactile-sm pressable hover:bg-[#6c3a09] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Entendi e Concordo</span>
              <i data-lucide="check-circle" class="w-4 h-4"></i>
            </button>
          </div>

        </div>
      </div>
    `;

    const closeHandler = () => {
      modalContainer.innerHTML = '';
      if (typeof onClose === 'function') onClose();
    };

    const closeBtn = modalContainer.querySelector('#btn-close-lgpd-modal');
    if (closeBtn) closeBtn.addEventListener('click', closeHandler);

    const confirmBtn = modalContainer.querySelector('#btn-confirm-lgpd-modal');
    if (confirmBtn) confirmBtn.addEventListener('click', closeHandler);

    const overlay = modalContainer.querySelector(`#${modalId}`);
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeHandler();
      });
    }

    if (typeof window !== 'undefined' && window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }
};

export default lgpdView;
