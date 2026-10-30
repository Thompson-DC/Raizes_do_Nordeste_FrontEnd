/**
 * Raízes do Nordeste - Frente de Caixa Multicanal
 * Controller: Conformidade LGPD e Termos de Privacidade (js/controllers/lgpdController.js)
 * Conforme especificado em docs/FSD.md (Seções 6.6, 12.9, 14.4 e 20.2)
 */

import { storageService } from '../models/storage.js';
import { lgpdView } from '../views/lgpdView.js';
import { cartView } from '../views/cartView.js';

class LGPDController {
  constructor() {
    this.container = null;
    this.modalContainer = null;
    this.hasAcceptedCookies = false;
    this.initialized = false;
  }

  /**
   * Inicializa o controlador do banner e termos da LGPD
   * @param {string} [containerId='lgpd-banner-container'] 
   * @param {string} [modalContainerId='modal-container'] 
   */
  init(containerId = 'lgpd-banner-container', modalContainerId = 'modal-container') {
    this.container = document.getElementById(containerId);
    this.modalContainer = document.getElementById(modalContainerId);

    // 1. Verifica se o consentimento de cookies já foi registrado previamente
    const storedConsent = storageService.getLGPDConsent();
    this.hasAcceptedCookies = Boolean(storedConsent && storedConsent.cookies_aceitos);

    // 2. Registra ouvinte global para solicitação de abertura dos termos
    window.addEventListener('rn:open-privacy-terms', () => {
      this.openTermsModal();
    });

    // 3. Renderiza o banner inferior apenas caso o consentimento ainda não tenha sido emitido
    if (!this.hasAcceptedCookies) {
      this.renderBanner();
    } else {
      if (this.container) {
        this.container.innerHTML = '';
      }
    }

    this.initialized = true;
    console.info(`[LGPDController] Inicializado. Consentimento de cookies prévio: ${this.hasAcceptedCookies}`);
  }

  /**
   * Renderiza o banner de consentimento no rodapé
   */
  renderBanner() {
    if (!this.container) {
      this.container = document.getElementById('lgpd-banner-container');
    }
    if (!this.container) return;

    lgpdView.renderBanner(this.container, {
      onAccept: () => this.acceptCookies(),
      onOpenTerms: () => this.openTermsModal()
    });
  }

  /**
   * Registra o aceite de cookies no armazenamento local e encerra o banner
   */
  acceptCookies() {
    storageService.saveLGPDConsent(true);
    this.hasAcceptedCookies = true;

    lgpdView.hideBanner(this.container);

    // Emite evento reativo de consentimento
    window.dispatchEvent(new CustomEvent('rn:lgpd-consent-given', {
      detail: {
        timestamp: new Date().toISOString(),
        accepted: true
      }
    }));

    cartView.showToast('Preferências de cookies e privacidade salvas com sucesso!', 'success');
    console.info('[LGPDController] Consentimento da LGPD registrado e persistido em rn_lgpd_consentimento.');
  }

  /**
   * Abre o modal completo com a Política de Privacidade e Direitos do Titular
   */
  openTermsModal() {
    if (!this.modalContainer) {
      this.modalContainer = document.getElementById('modal-container');
    }
    if (!this.modalContainer) return;

    lgpdView.renderTermsModal(this.modalContainer, () => {
      console.info('[LGPDController] Modal de termos fechado.');
    });
  }

  /**
   * Informa se os cookies foram formalmente aceitos
   * @returns {boolean}
   */
  hasConsent() {
    return this.hasAcceptedCookies;
  }
}

export const lgpdController = new LGPDController();
export default lgpdController;
