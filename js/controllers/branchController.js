/**
 * Raízes do Nordeste - Frente de Caixa Multicanal
 * Controller: Localização e Seleção de Filiais (js/controllers/branchController.js)
 * Conforme especificado em docs/FSD.md
 */

import { MOCK_DATA } from '../models/mockData.js';
import { storageService } from '../models/storage.js';
import { branchView } from '../views/branchView.js';

class BranchController {
  constructor() {
    this.branches = MOCK_DATA.filiais;
    this.activeBranchId = null;
    this.container = null;
    this.badgeElement = null;
    this.initialized = false;
  }

  /**
   * Inicializa o controlador de filiais
   * @param {string} [containerId='branches-container'] - ID do container dos cards
   * @param {string} [badgeId='active-branch-badge'] - ID do badge no cabeçalho
   */
  init(containerId = 'branches-container', badgeId = 'active-branch-badge') {
    this.container = document.getElementById(containerId);
    this.badgeElement = document.getElementById(badgeId);

    // Recupera filial salva no carrinho ou define a primeira como padrão
    const savedCart = storageService.getCart();
    let initialBranchId = savedCart && savedCart.filial_id ? savedCart.filial_id : null;

    // Se não houver filial ou ela for inválida, define a Matriz como inicial
    if (!initialBranchId || !this.isValidBranchId(initialBranchId)) {
      initialBranchId = this.branches.length > 0 ? this.branches[0].id : null;
      if (initialBranchId && savedCart) {
        savedCart.filial_id = initialBranchId;
        storageService.saveCart(savedCart);
      }
    }

    this.activeBranchId = initialBranchId;
    this.render();
    this.initialized = true;

    console.info(`[Raízes do Nordeste] BranchController inicializado. Filial ativa: ${this.activeBranchId}`);
  }

  /**
   * Valida se um ID pertence à lista autorizada de filiais
   * @param {string} branchId - ID a ser validado
   * @returns {boolean}
   */
  isValidBranchId(branchId) {
    return this.branches.some(b => b.id === branchId);
  }

  /**
   * Seleciona uma filial e persiste no estado local
   * Se houver itens no carrinho, solicita confirmação e valida itens esgotados (FSD 14.1)
   * @param {string} branchId - ID da filial escolhida
   * @returns {boolean} Retorna true se a seleção foi concluída imediatamente
   */
  selectBranch(branchId) {
    if (!this.isValidBranchId(branchId)) {
      console.warn(`[BranchController] Tentativa de selecionar filial inválida: ${branchId}`);
      return false;
    }

    if (this.activeBranchId === branchId) {
      return true; // Já está selecionada
    }

    const currentBranch = this.getActiveBranch();
    const newBranch = this.branches.find(b => b.id === branchId);
    const cart = storageService.getCart();

    const hasItems = cart && Array.isArray(cart.itens) && cart.itens.length > 0;

    // Se o cliente possuir itens na sacola, abre modal de confirmação (Regra FSD 14.1)
    if (hasItems) {
      const unavailableDishes = [];
      cart.itens.forEach(item => {
        const dish = MOCK_DATA.cardapio.find(d => d.id === item.produto_id);
        if (dish && dish.disponibilidade && dish.disponibilidade[branchId] === false) {
          unavailableDishes.push(dish.nome);
        }
      });

      const modalContainer = document.getElementById('modal-container');
      if (modalContainer && typeof branchView.renderBranchChangeModal === 'function') {
        branchView.renderBranchChangeModal(
          modalContainer,
          currentBranch,
          newBranch,
          unavailableDishes,
          () => {
            // Confirmou: aplica a alteração de filial
            this._applyBranchChange(branchId, unavailableDishes);
          },
          () => {
            // Cancelou: re-renderiza para manter a loja atual selecionada
            this.render();
          }
        );
        return false;
      }
    }

    // Sem itens na sacola: aplica a alteração diretamente
    return this._applyBranchChange(branchId, []);
  }

  /**
   * Executa a mutação de filial, persiste no carrinho e notifica o ecossistema
   * @private
   * @param {string} branchId 
   * @param {Array<string>} unavailableDishes 
   * @returns {boolean}
   */
  _applyBranchChange(branchId, unavailableDishes = []) {
    this.activeBranchId = branchId;

    // Persistência no carrinho ativo
    const cart = storageService.getCart() || { itens: [], subtotal: 0, total: 0 };
    cart.filial_id = branchId;
    storageService.saveCart(cart);

    // Re-renderização e atualização de componentes visuais
    this.render();

    const selectedBranch = this.getActiveBranch();

    // Notificação global por evento CustomEvent para desacoplamento reativo
    const event = new CustomEvent('rn:branch-changed', {
      detail: {
        branchId: this.activeBranchId,
        branch: selectedBranch,
        unavailableDishes
      }
    });
    window.dispatchEvent(event);

    console.info(`[BranchController] Filial alterada para: ${selectedBranch ? selectedBranch.nome : branchId}`);
    return true;
  }

  /**
   * Retorna os dados da filial atualmente ativa
   * @returns {Object|null}
   */
  getActiveBranch() {
    return this.branches.find(b => b.id === this.activeBranchId) || null;
  }

  /**
   * Retorna o ID da filial ativa
   * @returns {string|null}
   */
  getActiveBranchId() {
    return this.activeBranchId;
  }

  /**
   * Retorna todas as filiais cadastradas
   * @returns {Array}
   */
  getAllBranches() {
    return this.branches;
  }

  /**
   * Atualiza a renderização dos cards e do badge de cabeçalho
   */
  render() {
    if (this.container) {
      branchView.renderBranches(
        this.container,
        this.branches,
        this.activeBranchId,
        (branchId) => this.selectBranch(branchId)
      );
    }

    if (this.badgeElement) {
      branchView.updateActiveBranchBadge(this.badgeElement, this.getActiveBranch());
    }

    // Atualiza ícones Lucide recém-injetados
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }
}

export const branchController = new BranchController();
export default branchController;
