/**
 * Raízes do Nordeste - Frente de Caixa Multicanal
 * Controller do Simulador Multicanal (js/controllers/channelController.js)
 * Conforme especificado em docs/FSD.md e AGENTS.md
 */

import { channelView } from '../views/channelView.js';

// Lista estrita de canais válidos para prevenção de injeção de classes arbitrárias
const ALLOWED_CHANNELS = Object.freeze(['app', 'totem', 'web']);

export class ChannelController {
  constructor(view = channelView) {
    this.view = view;
    this.currentChannel = 'web';
  }

  /**
   * Inicializa os escutadores de eventos e define o canal inicial
   * @param {'app' | 'totem' | 'web'} initialChannel
   */
  init(initialChannel = 'web') {
    this._bindEvents();
    this.setChannel(initialChannel);
  }

  /**
   * Vincula cliques nos botões de alternância de canal
   * @private
   */
  _bindEvents() {
    const channelButtons = document.querySelectorAll('[data-channel]');
    channelButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const targetChannel = button.getAttribute('data-channel');
        this.setChannel(targetChannel);
      });
    });
  }

  /**
   * Sanitiza e altera o canal ativo
   * @param {string} channel
   * @returns {boolean} Sucesso da alteração
   */
  setChannel(channel) {
    // Sanitização e validação estrita contra a whitelist
    if (!channel || typeof channel !== 'string' || !ALLOWED_CHANNELS.includes(channel)) {
      console.warn(`[Canal] Tentativa de ativação de canal inválido ou não autorizado: "${channel}". Canais permitidos:`, ALLOWED_CHANNELS);
      return false;
    }

    this.currentChannel = channel;

    // Atualiza a View
    this.view.renderChannel(channel);

    // Auditoria e log de eventos monitorados conforme FSD
    console.info(`[Raízes do Nordeste] Simulador Multicanal: canal alterado para "${channel}".`);

    // Notificação global por evento customizado
    document.dispatchEvent(new CustomEvent('rn:channel-changed', {
      detail: { channel }
    }));

    return true;
  }

  /**
   * Retorna o canal atualmente selecionado
   * @returns {string}
   */
  getChannel() {
    return this.currentChannel;
  }
}

export const channelController = new ChannelController();
