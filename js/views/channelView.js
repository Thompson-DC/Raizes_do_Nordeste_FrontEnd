/**
 * Raízes do Nordeste - Frente de Caixa Multicanal
 * View de Canais / Viewports (js/views/channelView.js)
 * Conforme especificado em docs/FSD.md e docs/DESIGN.md
 */

export class ChannelView {
  constructor() {
    this.container = typeof document !== 'undefined' ? document.getElementById('app-container') : null;
    this.buttons = {
      app: typeof document !== 'undefined' ? document.getElementById('btn-channel-app') : null,
      totem: typeof document !== 'undefined' ? document.getElementById('btn-channel-totem') : null,
      web: typeof document !== 'undefined' ? document.getElementById('btn-channel-web') : null
    };
  }

  /**
   * Atualiza a exibição visual do container principal e dos botões para o canal informado
   * @param {'app' | 'totem' | 'web'} channel 
   */
  renderChannel(channel) {
    if (!this.container) {
      this.container = document.getElementById('app-container');
    }

    if (!this.container) return;

    // Remove classes específicas de largura e canais anteriores
    this.container.classList.remove('max-w-sm', 'max-w-7xl', 'channel-totem', 'channel-app', 'channel-web');

    // Aplica as classes específicas conforme o canal
    switch (channel) {
      case 'app':
        // Canal App Mobile: container restrito (~390px a 420px), centralizado
        this.container.classList.add('max-w-sm', 'channel-app');
        break;

      case 'totem':
        // Canal Totem: container em formato quiosque vertical com alvos de toque >= 48px
        this.container.classList.add('channel-totem');
        break;

      case 'web':
      default:
        // Canal Web Desktop: layout expandido em duas colunas com sacola lateral
        this.container.classList.add('max-w-7xl', 'channel-web');
        break;
    }

    // Atributo semântico para inspeção e testes automatizados
    this.container.setAttribute('data-channel', channel);

    // Atualiza estados visuais e de acessibilidade dos botões de controle
    this._updateButtonsState(channel);
  }

  /**
   * Atualiza as classes e atributos aria dos botões de seleção de canal
   * @private
   * @param {string} activeChannel
   */
  _updateButtonsState(activeChannel) {
    const activeClasses = ['bg-primary', 'text-white', 'shadow-sm'];
    const inactiveClasses = ['text-inverse-on-surface'];

    Object.entries(this.buttons).forEach(([key, btn]) => {
      if (!btn) {
        this.buttons[key] = document.getElementById(`btn-channel-${key}`);
      }
      const buttonEl = this.buttons[key];
      if (!buttonEl) return;

      const isActive = key === activeChannel;

      if (isActive) {
        buttonEl.classList.remove(...inactiveClasses);
        buttonEl.classList.add(...activeClasses);
        buttonEl.setAttribute('aria-pressed', 'true');
      } else {
        buttonEl.classList.remove(...activeClasses);
        buttonEl.classList.add(...inactiveClasses);
        buttonEl.setAttribute('aria-pressed', 'false');
      }
    });

    // Atualiza ícones Lucide se disponíveis
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }
}

export const channelView = new ChannelView();
