/**
 * Raízes do Nordeste - Frente de Caixa Multicanal
 * Controller: Sacola de Compras e Resumo Financeiro (js/controllers/cartController.js)
 * Conforme especificado em docs/FSD.md e docs/DESIGN.md
 */

import { CONFIG } from '../../config/config.js';
import { MOCK_DATA } from '../models/mockData.js';
import { storageService } from '../models/storage.js';
import { cartView } from '../views/cartView.js';

class CartController {
  constructor() {
    this.cart = null;
    this.container = null;
    this.mobileBarContainer = null;
    this.activeBranch = null;
    this.client = null;
    this.currentChannel = 'web';
    this.initialized = false;
  }

  /**
   * Inicializa o controlador da sacola de compras e vincula ouvintes de eventos
   * @param {string} [containerId='cart-container'] 
   * @param {string} [mobileBarId='mobile-cart-bar'] 
   */
  init(containerId = 'cart-container', mobileBarId = 'mobile-cart-bar') {
    this.container = document.getElementById(containerId);
    this.mobileBarContainer = document.getElementById(mobileBarId);

    // Carrega ou inicializa dados do cliente fidelizado
    this.client = storageService.getClient() || { ...MOCK_DATA.cliente_padrao };

    // Carrega ou inicializa o carrinho a partir do storage
    this.cart = this._loadCart();

    // Identifica a filial ativa correspondente
    this._updateActiveBranch(this.cart.filial_id);

    // Registra ouvinte para itens adicionados a partir do cardápio (Fase 5)
    window.addEventListener('rn:item-added', (event) => {
      if (event && event.detail) {
        if (event.detail.cart) {
          // O item já foi gravado pelo menuController; sincroniza estado local e renderiza
          this.cart = this._loadCart();
          this._persistAndNotify();
          this.render();
        } else if (event.detail.dish) {
          this.addItem(event.detail.dish);
        }
      }
    });

    // Registra ouvinte para alteração de filial (Fase 4)
    window.addEventListener('rn:branch-changed', (event) => {
      if (event && event.detail && event.detail.branchId) {
        this.handleBranchChange(event.detail.branchId, event.detail.unavailableDishes || []);
      }
    });

    // Registra ouvinte para alternância de canais (Fase 3)
    window.addEventListener('rn:channel-changed', (event) => {
      if (event && event.detail && event.detail.channel) {
        this.currentChannel = event.detail.channel;
        this.render();
      }
    });

    // Vincula clique do botão do cabeçalho para navegar ou abrir a sacola
    const headerCartBtn = document.getElementById('cart-header-btn');
    if (headerCartBtn) {
      headerCartBtn.addEventListener('click', () => this.scrollToCart());
    }

    this.render();
    this.initialized = true;

    console.info(`[Raízes do Nordeste] CartController inicializado. Filial do carrinho: ${this.cart.filial_id}, Total de itens: ${this.getItemCount()}`);
  }

  /**
   * Carrega o carrinho da persistência resiliente ou cria estrutura padrão
   * @private
   * @returns {Object}
   */
  _loadCart() {
    const rawCart = storageService.getCart();
    const fallbackBranchId = (MOCK_DATA.filiais && MOCK_DATA.filiais[0]) ? MOCK_DATA.filiais[0].id : 'recife-antigo';

    const cleanCart = {
      filial_id: (rawCart && rawCart.filial_id) ? rawCart.filial_id : fallbackBranchId,
      itens: (rawCart && Array.isArray(rawCart.itens)) ? rawCart.itens : [],
      subtotal: Number(rawCart && rawCart.subtotal) || 0,
      pontos_usados: Number(rawCart && rawCart.pontos_usados) || 0,
      valor_desconto: Number(rawCart && rawCart.valor_desconto) || 0,
      total: Number(rawCart && rawCart.total) || 0,
      consentimento_lgpd: Boolean(rawCart && rawCart.consentimento_lgpd)
    };

    return this._recalculateTotals(cleanCart);
  }

  /**
   * Atualiza a referência da filial ativa em memória
   * @private
   * @param {string} branchId 
   */
  _updateActiveBranch(branchId) {
    if (!branchId || !MOCK_DATA.filiais) return;
    this.activeBranch = MOCK_DATA.filiais.find(b => b.id === branchId) || MOCK_DATA.filiais[0];
  }

  /**
   * Recalcula subtotais e totais garantindo integridade matemática
   * Conforme especificado em docs/FSD.md (Seções 6.5 e 14.3)
   * @private
   * @param {Object} cart 
   * @returns {Object}
   */
  _recalculateTotals(cart) {
    if (!Array.isArray(cart.itens)) {
      cart.itens = [];
    }

    // Se a sacola estiver vazia, zera todos os montantes e desativa fidelidade
    if (cart.itens.length === 0) {
      cart.subtotal = 0;
      cart.pontos_usados = 0;
      cart.valor_desconto = 0;
      cart.total = 0;
      return cart;
    }

    // Recalcula o subtotal de cada item
    let subtotal = 0;
    cart.itens.forEach(item => {
      const qty = Math.max(1, Math.min(99, parseInt(item.quantidade, 10) || 1));
      const unit = Number(item.preco_unitario) || 0;
      item.quantidade = qty;
      item.subtotal = Number((qty * unit).toFixed(2));
      subtotal += item.subtotal;
    });

    cart.subtotal = Number(subtotal.toFixed(2));

    // Se houver pontos resgatados, recalcula desconto com base na regra de conversão (FSD 14.3)
    if (Number(cart.pontos_usados) > 0) {
      const rate = (CONFIG.fidelidade && CONFIG.fidelidade.pontos_por_real) || 10;
      cart.valor_desconto = Number((Number(cart.pontos_usados) / rate).toFixed(2));
    } else {
      cart.valor_desconto = 0;
    }

    const discount = Number(cart.valor_desconto) || 0;

    // Total travado no piso de R$ 0,00 conforme regra estrita de negócio (FSD 14.3)
    cart.total = Number(Math.max(0, cart.subtotal - discount).toFixed(2));

    return cart;
  }

  /**
   * Salva o estado do carrinho no storage e emite evento reativo global
   * @private
   */
  _persistAndNotify() {
    this._recalculateTotals(this.cart);
    storageService.saveCart(this.cart);

    // Emite evento reativo para que outros controladores reajam
    const event = new CustomEvent('rn:cart-updated', {
      detail: {
        cart: this.cart,
        totalItems: this.getItemCount(),
        total: this.cart.total
      }
    });
    window.dispatchEvent(event);
  }

  /**
   * Trata alteração de filial disparada externamente
   * Valida estoque de todos os itens e remove pratos esgotados na nova unidade (Regra FSD 14.1)
   * @param {string} branchId 
   * @param {Array<string>} [knownUnavailable=[]]
   */
  handleBranchChange(branchId, knownUnavailable = []) {
    this.cart.filial_id = branchId;
    this._updateActiveBranch(branchId);

    // Validação estrita de disponibilidade dos itens da sacola na nova filial (FSD 14.1)
    const removedDishes = [];
    if (Array.isArray(this.cart.itens) && this.cart.itens.length > 0) {
      this.cart.itens = this.cart.itens.filter(item => {
        const dish = MOCK_DATA.cardapio.find(d => d.id === item.produto_id);
        const isAvailable = dish && dish.disponibilidade ? (dish.disponibilidade[branchId] !== false) : true;
        if (!isAvailable) {
          removedDishes.push(item.nome);
        }
        return isAvailable;
      });
    }

    this._persistAndNotify();
    this.render();

    // Se houve remoção de pratos esgotados na nova filial, notifica com toast de alerta
    if (removedDishes.length > 0) {
      const branchName = this.activeBranch ? this.activeBranch.nome : branchId;
      cartView.showToast(
        `O prato "${removedDishes.join(', ')}" está esgotado na filial ${branchName} e foi removido da sua sacola.`,
        'warning'
      );
    }

    console.info(`[CartController] Filial do carrinho atualizada para: ${branchId}. Pratos indisponíveis removidos: ${removedDishes.length}`);
  }

  /**
   * Retorna a quantidade total de itens (soma das quantidades)
   * @returns {number}
   */
  getItemCount() {
    if (!this.cart || !Array.isArray(this.cart.itens)) return 0;
    return this.cart.itens.reduce((sum, item) => sum + (parseInt(item.quantidade, 10) || 0), 0);
  }

  /**
   * Retorna o carrinho atual
   * @returns {Object}
   */
  getCart() {
    return { ...this.cart };
  }

  /**
   * Adiciona um prato à sacola ou incrementa sua quantidade
   * @param {Object} dish 
   */
  addItem(dish) {
    if (!dish || !dish.id) return;

    const existingIndex = this.cart.itens.findIndex(item => item.produto_id === dish.id);

    if (existingIndex >= 0) {
      const currentQty = this.cart.itens[existingIndex].quantidade;
      if (currentQty < 99) {
        this.cart.itens[existingIndex].quantidade = currentQty + 1;
      }
    } else {
      this.cart.itens.push({
        produto_id: dish.id,
        nome: dish.nome,
        preco_unitario: Number(dish.preco) || 0,
        quantidade: 1,
        subtotal: Number(dish.preco) || 0
      });
    }

    this._persistAndNotify();
    this.render();

    console.info(`[CartController] Item adicionado: ${dish.nome}. Total itens: ${this.getItemCount()}`);
  }

  /**
   * Incrementa a quantidade de um item na sacola
   * @param {string} productId 
   */
  increaseQuantity(productId) {
    const item = this.cart.itens.find(i => i.produto_id === productId);
    if (!item) return;

    if (item.quantidade < 99) {
      item.quantidade += 1;
      this._persistAndNotify();
      this.render();
    }
  }

  /**
   * Decrementa a quantidade de um item na sacola (remove se for a 0)
   * @param {string} productId 
   */
  decreaseQuantity(productId) {
    const index = this.cart.itens.findIndex(i => i.produto_id === productId);
    if (index < 0) return;

    if (this.cart.itens[index].quantidade > 1) {
      this.cart.itens[index].quantidade -= 1;
    } else {
      // Remove o item se a quantidade atingir 0
      this.cart.itens.splice(index, 1);
    }

    this._persistAndNotify();
    this.render();
  }

  /**
   * Remove imediatamente um item da sacola
   * @param {string} productId 
   */
  removeItem(productId) {
    const index = this.cart.itens.findIndex(i => i.produto_id === productId);
    if (index < 0) return;

    const removedItem = this.cart.itens[index];
    this.cart.itens.splice(index, 1);

    this._persistAndNotify();
    this.render();

    console.info(`[CartController] Item removido da sacola: ${removedItem.nome}`);
  }

  /**
   * Esvazia completamente a sacola de compras
   */
  clearCart() {
    this.cart.itens = [];
    this.cart.subtotal = 0;
    this.cart.valor_desconto = 0;
    this.cart.pontos_usados = 0;
    this.cart.total = 0;

    this._persistAndNotify();
    this.render();

    console.info('[CartController] Sacola de compras esvaziada com sucesso.');
  }

  // ==========================================
  // Métodos do Programa de Fidelidade (Fase 7)
  // Conforme especificado em docs/FSD.md (Seção 6.5 e 14.3)
  // ==========================================

  /**
   * Verifica se o desconto de fidelidade está ativo no carrinho
   * @returns {boolean}
   */
  isLoyaltyApplied() {
    return Boolean(this.cart && (Number(this.cart.pontos_usados) > 0 || Number(this.cart.valor_desconto) > 0));
  }

  /**
   * Retorna o saldo de pontos disponível para o cliente
   * @returns {number}
   */
  getLoyaltyBalance() {
    if (this.client && this.client.saldo_pontos !== undefined) {
      return Number(this.client.saldo_pontos);
    }
    const storedClient = storageService.getClient();
    if (storedClient && storedClient.saldo_pontos !== undefined) {
      this.client = storedClient;
      return Number(storedClient.saldo_pontos);
    }
    return (CONFIG.fidelidade && CONFIG.fidelidade.saldo_padrao) || 150;
  }

  /**
   * Alterna a aplicação dos pontos de fidelidade "Nordeste Pontos"
   * @param {boolean} [apply] Se omitido, inverte o estado atual
   */
  toggleLoyalty(apply) {
    const shouldApply = (apply !== undefined) ? Boolean(apply) : !this.isLoyaltyApplied();

    if (shouldApply) {
      if (this.getItemCount() <= 0) {
        cartView.showToast('Adicione ao menos um prato antes de aplicar seus pontos de fidelidade.', 'warning');
        return;
      }

      const availablePoints = this.getLoyaltyBalance();
      const pointsPerReal = (CONFIG.fidelidade && CONFIG.fidelidade.pontos_por_real) || 10;
      const discount = Number((availablePoints / pointsPerReal).toFixed(2));

      this.cart.pontos_usados = availablePoints;
      this.cart.valor_desconto = discount;

      this._persistAndNotify();
      this.render();

      // Emite evento reativo de fidelidade
      window.dispatchEvent(new CustomEvent('rn:loyalty-toggled', {
        detail: {
          applied: true,
          points: availablePoints,
          discount,
          total: this.cart.total
        }
      }));

      cartView.showToast(`Benefício Nordeste Pontos ativado! Desconto de ${cartView.formatCurrency(discount)} aplicado.`, 'success');
      console.info(`[CartController] Fidelidade ativada: ${availablePoints} pontos (Desconto: R$ ${discount.toFixed(2)}). Novo total: R$ ${this.cart.total}`);
    } else {
      this.cart.pontos_usados = 0;
      this.cart.valor_desconto = 0;

      this._persistAndNotify();
      this.render();

      // Emite evento reativo de fidelidade
      window.dispatchEvent(new CustomEvent('rn:loyalty-toggled', {
        detail: {
          applied: false,
          points: 0,
          discount: 0,
          total: this.cart.total
        }
      }));

      cartView.showToast('Desconto de fidelidade removido.', 'info');
      console.info(`[CartController] Fidelidade desativada. Novo total: R$ ${this.cart.total}`);
    }
  }

  /**
   * Aplica explicitamente o desconto de fidelidade
   */
  applyLoyaltyDiscount() {
    this.toggleLoyalty(true);
  }

  /**
   * Remove explicitamente o desconto de fidelidade
   */
  removeLoyaltyDiscount() {
    this.toggleLoyalty(false);
  }

  // ==========================================
  // Métodos de Identificação e LGPD (Fase 8)
  // Conforme especificado em docs/FSD.md (Seções 6.6, 6.7, 12.6, 14.4)
  // ==========================================

  /**
   * Trata a digitação no campo de Nome
   * @param {string} val 
   */
  handleNameInput(val) {
    if (!this.client) {
      this.client = storageService.getClient() || { ...MOCK_DATA.cliente_padrao };
    }
    this.client.nome = val;
  }

  /**
   * Trata a digitação no campo de Telefone
   * @param {string} val 
   */
  handlePhoneInput(val) {
    if (!this.client) {
      this.client = storageService.getClient() || { ...MOCK_DATA.cliente_padrao };
    }
    this.client.telefone = val;
  }

  /**
   * Trata a alteração do checkbox de consentimento da LGPD
   * @param {boolean} checked 
   */
  handleLGPDChange(checked) {
    this.cart.consentimento_lgpd = Boolean(checked);
    storageService.saveCart(this.cart);
  }

  /**
   * Valida os campos de identificação do cliente e consentimento da LGPD
   * Retorna true se válido ou exibe erros e retorna false
   * @returns {boolean}
   */
  validateIdentificationForm() {
    // 1. Obtém os valores mais recentes dos inputs ou da memória
    const nameEl = document.getElementById('customer-name');
    const phoneEl = document.getElementById('customer-phone');
    const lgpdEl = document.getElementById('checkbox-lgpd-consent');

    const currentName = nameEl ? nameEl.value : (this.client ? this.client.nome : '');
    const currentPhone = phoneEl ? phoneEl.value : (this.client ? this.client.telefone : '');
    const currentLGPD = lgpdEl ? lgpdEl.checked : Boolean(this.cart && this.cart.consentimento_lgpd);

    const cleanName = String(currentName || '').trim();
    const cleanPhoneDigits = String(currentPhone || '').replace(/\D/g, '');

    let isValid = true;
    let firstInvalidField = null;

    // 2. Validação do Nome (mínimo de 3 caracteres)
    if (cleanName.length < 3) {
      isValid = false;
      cartView.showFieldError('name', 'Informe seu nome completo (mínimo de 3 letras).');
      if (!firstInvalidField) firstInvalidField = nameEl;
    } else {
      cartView.clearFieldError('name');
    }

    // 3. Validação do Telefone (DDD + 8 ou 9 dígitos = 10 ou 11 dígitos)
    if (cleanPhoneDigits.length < 10 || cleanPhoneDigits.length > 11) {
      isValid = false;
      cartView.showFieldError('phone', 'Informe um telefone válido com DDD (Ex: (81) 98765-4321).');
      if (!firstInvalidField) firstInvalidField = phoneEl;
    } else {
      cartView.clearFieldError('phone');
    }

    // 4. Validação do Consentimento LGPD (checkbox obrigatório)
    if (!currentLGPD) {
      isValid = false;
      cartView.showFieldError('lgpd', 'É obrigatório aceitar os termos de privacidade para gerar o pedido.');
      if (!firstInvalidField) firstInvalidField = lgpdEl;
    } else {
      cartView.clearFieldError('lgpd');
    }

    // 5. Se houver erro, focaliza o primeiro campo inválido e emite notificação
    if (!isValid) {
      if (firstInvalidField && typeof firstInvalidField.focus === 'function') {
        firstInvalidField.focus();
      }
      cartView.showToast('Por favor, preencha os dados de identificação e aceite os termos da LGPD.', 'warning');
      console.warn('[CartController] Validação de identificação/LGPD reprovada:', {
        nomeValido: cleanName.length >= 3,
        telefoneValido: cleanPhoneDigits.length >= 10 && cleanPhoneDigits.length <= 11,
        lgpdAceito: currentLGPD
      });
      return false;
    }

    // 6. Atualiza e persiste o cliente e o consentimento no carrinho
    this.client.nome = cleanName;
    this.client.telefone = cartView.formatPhoneMask(cleanPhoneDigits);
    storageService.saveClient(this.client);

    this.cart.consentimento_lgpd = true;
    storageService.saveCart(this.cart);

    return true;
  }

  /**
   * Ação de avançar para checkout / identificação
   */
  proceedToCheckout() {
    if (this.getItemCount() <= 0) {
      cartView.showToast('Sua sacola está vazia. Adicione itens antes de avançar.', 'warning');
      return;
    }

    // Executa validação estrita da identificação e LGPD (Fase 8)
    const isFormValid = this.validateIdentificationForm();
    if (!isFormValid) {
      return;
    }

    console.info(`[CartController] Identificação validada com sucesso para "${this.client.nome}". Disparando checkout...`);

    // Dispara evento de identificação concluída
    window.dispatchEvent(new CustomEvent('rn:customer-identified', {
      detail: {
        client: this.client,
        consent_lgpd: true,
        timestamp: new Date().toISOString()
      }
    }));

    // Dispara evento de checkout pronto para simulação do gateway (Fase 9)
    window.dispatchEvent(new CustomEvent('rn:cart-checkout', {
      detail: {
        cart: this.cart,
        client: this.client,
        branch: this.activeBranch
      }
    }));

    cartView.showToast(`Identificação de ${this.client.nome} confirmada! Pronto para selecionar o pagamento.`, 'success');
  }

  /**
   * Rola suavemente até o container da sacola (útil para canais móveis)
   */
  scrollToCart() {
    if (!this.container) return;

    this.container.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

    // Efeito visual sutil de destaque no card da sacola
    const card = document.getElementById('cart-card');
    if (card) {
      card.classList.add('ring-4', 'ring-primary-container');
      setTimeout(() => {
        card.classList.remove('ring-4', 'ring-primary-container');
      }, 1200);
    }
  }

  /**
   * Renderiza a sacola e todos os seus indicadores
   */
  render() {
    if (!this.container) {
      this.container = document.getElementById('cart-container');
    }
    if (!this.mobileBarContainer) {
      this.mobileBarContainer = document.getElementById('mobile-cart-bar');
    }

    if (!this.container) return;

    const totalItems = this.getItemCount();
    const totalValue = this.cart ? this.cart.total : 0;

    // 1. Renderiza o card principal da sacola
    cartView.renderCart(
      this.container,
      this.cart,
      this.activeBranch,
      this.client,
      {
        onIncrease: (id) => this.increaseQuantity(id),
        onDecrease: (id) => this.decreaseQuantity(id),
        onRemove: (id) => this.removeItem(id),
        onClear: () => this.clearCart(),
        onToggleLoyalty: () => this.toggleLoyalty(),
        onNameInput: (val) => this.handleNameInput(val),
        onPhoneInput: (val) => this.handlePhoneInput(val),
        onLGPDChange: (checked) => this.handleLGPDChange(checked),
        onOpenTerms: () => window.dispatchEvent(new CustomEvent('rn:open-privacy-terms')),
        onCheckout: () => this.proceedToCheckout()
      }
    );

    // 2. Atualiza badge do cabeçalho
    cartView.updateHeaderBadge(totalItems, totalValue);

    // 3. Renderiza barra móvel flutuante se estiver em canais móveis (App ou Totem)
    if (this.mobileBarContainer) {
      const isMobileChannel = (this.currentChannel === 'app' || this.currentChannel === 'totem');
      if (isMobileChannel && totalItems > 0) {
        cartView.renderMobileCartBar(
          this.mobileBarContainer,
          totalItems,
          totalValue,
          () => this.scrollToCart()
        );
      } else {
        this.mobileBarContainer.innerHTML = '';
        this.mobileBarContainer.classList.add('hidden');
      }
    }

    // 4. Garante que o aside esteja visível no desktop
    const aside = document.getElementById('cart-aside');
    if (aside) {
      aside.classList.remove('hidden');
      aside.classList.add('flex');
    }
  }
}

export const cartController = new CartController();
export default cartController;
