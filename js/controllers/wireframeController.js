/**
 * Raízes do Nordeste - Frente de Caixa Multicanal
 * Controller do Modo Wireframe Estrutural (js/controllers/wireframeController.js)
 * Conforme especificado em docs/FSD.md e docs/DESIGN.md
 */

export class WireframeController {
  constructor() {
    this.button = null;
    this.isWireframe = false;
  }

  /**
   * Inicializa os eventos e atributos de acessibilidade do botão
   */
  init() {
    this.button = document.getElementById('btn-toggle-wireframe');
    if (!this.button) return;

    this.button.setAttribute('aria-pressed', 'false');
    this.button.addEventListener('click', () => {
      this.toggle();
    });
  }

  /**
   * Alterna a ativação do Modo Wireframe
   * @returns {boolean} Novo estado do wireframe
   */
  toggle() {
    this.isWireframe = !this.isWireframe;

    // Alterna a classe de alto contraste estrutural no body
    document.body.classList.toggle('wireframe-mode', this.isWireframe);

    // Atualiza o estado visual do botão no cabeçalho
    if (this.button) {
      this.button.setAttribute('aria-pressed', String(this.isWireframe));

      if (this.isWireframe) {
        this.button.classList.add('bg-[#ffdea8]', 'text-[#211b0f]', 'border-[#ffdea8]', 'shadow-sm');
        this.button.classList.remove('text-inverse-on-surface');
      } else {
        this.button.classList.remove('bg-[#ffdea8]', 'text-[#211b0f]', 'border-[#ffdea8]', 'shadow-sm');
        this.button.classList.add('text-inverse-on-surface');
      }
    }

    // Auditoria e log de segurança/validação monitorado conforme FSD
    console.info(`[Raízes do Nordeste] Auditoria: Modo Wireframe ${this.isWireframe ? 'ATIVADO' : 'DESATIVADO'}.`);

    // Disparo de evento customizado
    document.dispatchEvent(new CustomEvent('rn:wireframe-toggled', {
      detail: { isWireframe: this.isWireframe }
    }));

    return this.isWireframe;
  }

  /**
   * Retorna se o modo wireframe está ativo
   * @returns {boolean}
   */
  isActive() {
    return this.isWireframe;
  }
}

export const wireframeController = new WireframeController();
