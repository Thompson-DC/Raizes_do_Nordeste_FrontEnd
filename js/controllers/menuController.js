/**
 * Raízes do Nordeste - Frente de Caixa Multicanal
 * Controller: Catálogo de Cardápio e Validação de Estoque (js/controllers/menuController.js)
 * Conforme especificado em docs/FSD.md
 */

import { MOCK_DATA } from '../models/mockData.js';
import { storageService } from '../models/storage.js';
import { menuView } from '../views/menuView.js';

class MenuController {
  constructor() {
    this.categories = MOCK_DATA.categorias;
    this.dishes = MOCK_DATA.cardapio;
    this.activeCategoryId = 'todos';
    this.activeBranchId = null;
    this.categoriesContainer = null;
    this.menuGridContainer = null;
    this.initialized = false;
  }

  /**
   * Inicializa o controlador do cardápio e vincula eventos reativos
   * @param {string} [categoriesContainerId='categories-container'] 
   * @param {string} [menuGridContainerId='menu-grid-container'] 
   */
  init(categoriesContainerId = 'categories-container', menuGridContainerId = 'menu-grid-container') {
    this.categoriesContainer = document.getElementById(categoriesContainerId);
    this.menuGridContainer = document.getElementById(menuGridContainerId);

    // Recupera a filial ativa inicial do carrinho ou do primeiro registro de filiais
    const cart = storageService.getCart();
    if (cart && cart.filial_id) {
      this.activeBranchId = cart.filial_id;
    } else if (MOCK_DATA.filiais.length > 0) {
      this.activeBranchId = MOCK_DATA.filiais[0].id;
    }

    // Escuta evento global de alteração de filial para recalcular estoque dinamicamente
    window.addEventListener('rn:branch-changed', (event) => {
      if (event && event.detail && event.detail.branchId) {
        this.setBranch(event.detail.branchId);
      }
    });

    this.render();
    this.initialized = true;

    console.info(`[Raízes do Nordeste] MenuController inicializado. Filial ativa: ${this.activeBranchId}, Categoria ativa: ${this.activeCategoryId}`);
  }

  /**
   * Atualiza a filial ativa e re-renderiza o catálogo
   * @param {string} branchId 
   */
  setBranch(branchId) {
    if (this.activeBranchId === branchId) return;

    this.activeBranchId = branchId;
    this.renderMenuGrid();

    console.info(`[MenuController] Estoque recalculado para a filial: ${branchId}`);
  }

  /**
   * Seleciona uma categoria de pratos para filtragem
   * @param {string} categoryId 
   */
  selectCategory(categoryId) {
    const exists = this.categories.some(c => c.id === categoryId);
    if (!exists) {
      console.warn(`[MenuController] Categoria inexistente: ${categoryId}`);
      return;
    }

    this.activeCategoryId = categoryId;
    this.render();
    console.info(`[MenuController] Categoria selecionada: ${categoryId}`);
  }

  /**
   * Retorna os pratos filtrados pela categoria ativa
   * @returns {Array}
   */
  getFilteredDishes() {
    if (this.activeCategoryId === 'todos') {
      return [...this.dishes];
    }
    return this.dishes.filter(dish => dish.categoria === this.activeCategoryId);
  }

  /**
   * Verifica se determinado prato está disponível na filial ativa
   * @param {Object} dish 
   * @returns {boolean}
   */
  isDishAvailable(dish) {
    if (!dish || !dish.disponibilidade) return false;
    return Boolean(dish.disponibilidade[this.activeBranchId] !== false);
  }

  /**
   * Manipula a ação de adicionar um prato à sacola
   * @param {Object} dish 
   */
  addToCart(dish) {
    if (!dish) return;

    // Verificação defensiva de estoque
    if (!this.isDishAvailable(dish)) {
      console.warn(`[MenuController] Bloqueio de inserção: ${dish.nome} está esgotado na filial ${this.activeBranchId}.`);
      return;
    }

    // Persiste a adição na sacola local
    const cart = storageService.getCart() || {
      filial_id: this.activeBranchId,
      itens: [],
      subtotal: 0,
      pontos_resgatados: 0,
      valor_desconto: 0,
      total: 0,
      consentimento_lgpd: false
    };

    // Garante que a filial do carrinho esteja atualizada
    cart.filial_id = this.activeBranchId;
    if (!Array.isArray(cart.itens)) {
      cart.itens = [];
    }

    // Procura se o item já existe na sacola
    const existingIndex = cart.itens.findIndex(item => item.produto_id === dish.id);
    if (existingIndex >= 0) {
      const currentQty = Math.max(1, parseInt(cart.itens[existingIndex].quantidade, 10) || 1);
      cart.itens[existingIndex].quantidade = currentQty + 1;
      cart.itens[existingIndex].subtotal = Number((cart.itens[existingIndex].quantidade * cart.itens[existingIndex].preco_unitario).toFixed(2));
    } else {
      cart.itens.push({
        produto_id: dish.id,
        nome: dish.nome,
        preco_unitario: Number(dish.preco),
        quantidade: 1,
        subtotal: Number(dish.preco)
      });
    }

    // Recalcula o subtotal
    cart.subtotal = Number(cart.itens.reduce((sum, item) => sum + (item.subtotal || 0), 0).toFixed(2));
    cart.total = Number(Math.max(0, cart.subtotal - (cart.valor_desconto || 0)).toFixed(2));

    // Salva na persistência resiliente
    storageService.saveCart(cart);

    // Dispara evento reativo para a sacola de compras (Fase 6)
    const event = new CustomEvent('rn:item-added', {
      detail: {
        dish,
        cart
      }
    });
    window.dispatchEvent(event);

    console.info(`[MenuController] Prato "${dish.nome}" adicionado com sucesso. Total de itens no carrinho: ${cart.itens.length}`);

    // Feedback visual momentâneo no botão
    const btn = document.querySelector(`[data-add-to-cart="${dish.id}"]`);
    if (btn) {
      const originalText = btn.innerHTML;
      btn.innerHTML = `<i data-lucide="check" class="w-4 h-4 text-[#25D366]"></i><span>Adicionado!</span>`;
      btn.classList.add('bg-[#FFF2DF]');
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove('bg-[#FFF2DF]');
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
          window.lucide.createIcons();
        }
      }, 900);
    }
  }

  /**
   * Renderiza a barra de categorias
   */
  renderCategories() {
    if (!this.categoriesContainer) return;

    menuView.renderCategories(
      this.categoriesContainer,
      this.categories,
      this.activeCategoryId,
      (categoryId) => this.selectCategory(categoryId)
    );
  }

  /**
   * Renderiza a grade de pratos do cardápio
   */
  renderMenuGrid() {
    if (!this.menuGridContainer) return;

    const filtered = this.getFilteredDishes();

    menuView.renderMenuGrid(
      this.menuGridContainer,
      filtered,
      this.activeBranchId,
      (dish) => this.addToCart(dish)
    );

    // Atualiza ícones Lucide recém-injetados
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  /**
   * Renderiza todos os componentes do cardápio
   */
  render() {
    this.renderCategories();
    this.renderMenuGrid();
  }
}

export const menuController = new MenuController();
