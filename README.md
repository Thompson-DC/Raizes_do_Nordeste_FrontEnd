# Raízes do Nordeste — Frente de Caixa Multicanal & Autoatendimento

Aplicação web estática (*Single Page Application* — **Zero-Build**) de ponto de venda (PDV) e autoatendimento para a rede gastronômica sertaneja **Raízes do Nordeste**, desenvolvida como projeto prático multidisciplinar na trilha de Front-End da **UNINTER**.

---

## 🌐 Publicação Online (GitHub Pages)

A aplicação está homologada para hospedagem estática direta através do **GitHub Pages**:

- **Link de Acesso Público:** `https://thompson-dc.github.io/Raizes_do_Nordeste_FrontEnd/`

> **Compatibilidade Estática Total:** Todos os recursos visuais, fontes, ícones e scripts utilizam caminhos estritamente relativos (`./assets/...`, `./config/...`, `./js/...`), assegurando execução impecável tanto na raiz quanto em qualquer subdiretório público sem necessidade de reconfiguração de base.

---

## 📖 Visão do Produto e Domínio

A rede gastronômica **Raízes do Nordeste** une a riqueza das tradições sertanejas (cuscuz flocado no vapor, carne de sol, queijo coalho tostado, tapiocas artesanais e bebidas regionais) com uma experiência contemporânea de autoatendimento ágil e multicanal.

O sistema atende simultaneamente aos clientes em seus próprios smartphones (**App Mobile**), no salão físico através de quiosques digitais verticais (**Totem de Autoatendimento**) e via navegadores de mesa (**Web Desktop**), integrando controle de estoque por filial, programa de fidelidade ("Nordeste Pontos"), conformidade regulatória estrita com a LGPD e rastreamento de produção em tempo real (stepper).

---

## 🚀 Funcionalidades Principais

### 1. Multicanalidade Real em Tempo de Execução
Na barra de controle superior da interface, o avaliador ou usuário pode alternar instantaneamente entre três modos de atendimento:
- **App Mobile:** Container restrito e compacto (`max-w-sm` ~390px a 420px), otimizado para navegação fluida em coluna única com operação com uma mão.
- **Totem de Autoatendimento:** Simulação de terminal vertical (proporção 9:16), com fontes de alto impacto visual e alvos de clique ergonômicos com altura mínima garantida de **48px** (conforme padrões de acessibilidade WCAG AA).
- **Web Desktop:** Experiência expandida (`max-w-7xl`) com grid dinâmico de pratos e coluna lateral fixa para acompanhamento da sacola de compras.

### 2. Modo Wireframe Estrutural (Auditoria Técnica & Acadêmica)
Um interruptor global converte imediatamente o design visual da interface para uma representação monocromática em escala de cinza e alto contraste, com bordas tracejadas e mascaramento de fotografias, viabilizando a extração de evidências e prints neutros para documentação acadêmica e análise estrutural de usabilidade.

### 3. Catálogo Regional e Gestão de Estoque por Filial
- Apresentação de três unidades físicas da rede: *Recife Antigo - Matriz*, *Boa Viagem - Orla* e *Olinda - Sítio Histórico*.
- Seleção dinâmica da filial com recálculo instantâneo de disponibilidade física: pratos esgotados na unidade ativa são bloqueados para compra, identificados com aviso visual de indisponibilidade (`INDISPONÍVEL NESTA FILIAL`) e tratados com filtro de opacidade e grayscale.
- Interceptação protetiva com modal de aviso caso o usuário troque de filial possuindo pratos no carrinho que estejam esgotados na nova unidade.
- Filtro rápido por categorias gastronômicas (*Todos os Pratos*, *Cuscuz da Casa*, *Tapiocas & Queijo*, *Pratos Sertanejos*, *Bebidas Regionais* e *Sobremesas*).

### 4. Sacola de Compras e Resumo Financeiro em Tempo Real
- Controle de quantidades com botões de incremento (`+`), decremento (`-`) e exclusão rápida.
- Atualização reativa de subtotal, descontos aplicados e total final a pagar.
- Persistência contínua na chave `rn_carrinho_atual` do `localStorage` com contingência transparente.

### 5. Programa de Fidelidade "Nordeste Pontos"
- Resgate de pontos acumulados com conversão parametrizada (10 pontos = R$ 1,00 de desconto).
- Interruptor tipo switch toggle neo-brutalista (`role="switch"`, `aria-checked`).
- Regra matemática estrita com piso de segurança em `R$ 0,00`, impedindo totais negativos caso o valor do desconto supere o subtotal da compra.

### 6. Conformidade com a LGPD (Lei nº 13.709/2018)
- Notificação não-bloqueante na base da tela com banner informativo de cookies e botão de aceite expresso gravado em `rn_lgpd_consentimento`.
- Modal acessível com a íntegra da Política de Privacidade e Direitos do Titular (Art. 18 da LGPD).
- Checkbox de consentimento obrigatório na etapa de identificação do cliente (Nome Completo e Telefone com máscara dinâmica `(XX) XXXXX-XXXX`), bloqueando estritamente o avanço para o pagamento caso desmarcado.

### 7. Gateway de Pagamento Mockado
- Modal simulador de transação financeira suportando PIX (com QR Code temático em SVG e código copia-e-cola), Cartão de Crédito, Cartão de Débito e Dinheiro no Balcão.
- Controles de auditoria para forçar desfechos de teste perante a banca examinadora:
  - **Forçar Aprovação:** Transição visual para Verde Macaxeira (`#25D366`), gravação do pedido com número sequencial no histórico local e encaminhamento para a Linha do Tempo.
  - **Forçar Recusa:** Alerta visual em Vermelho Erro (`#BA1A1A`) com mensagem explicativa e botão de nova tentativa, preservando integralmente os itens e descontos da sacola.

### 8. Linha do Tempo de Produção (Stepper)
- Rastreamento dinâmico em 3 estados operacionais: *Pedido Recebido*, *Em Preparo* e *Pronto para Retirada*.
- Transição automática temporizada de 4 segundos por fase acompanhada de contagem regressiva em tempo real.
- Botões manuais de navegação (*Avançar Etapa*, *Voltar Etapa*, *Pausar/Retomar*) para demonstração perante banca examinadora.
- Resumo expansível de itens e dados de contato, persistência do status no `localStorage` e fluxo seguro de "Fazer Novo Pedido".

---

## 📋 Matriz de Auditoria e Critérios de Aceitação (FSD Seção 26)

| # | Critério de Aceitação no FSD | Status | Implementação Técnica e Evidências |
|---|---|:---:|---|
| 1 | **Arquitetura Zero-Build** | ✅ Aprovado | A aplicação executa nativamente abrindo `index.html` em qualquer navegador sem `npm`, `vite`, `webpack` ou etapas de compilação. |
| 2 | **Organização na Raiz (`./`)** | ✅ Aprovado | Estrutura limpa articulada a partir da raiz do repositório (`config/`, `assets/`, `js/`, `docs/`), sem caminhos rígidos de servidor. |
| 3 | **Ausência de `.env` e de Banco de Dados** | ✅ Aprovado | Nenhuma variável em arquivo `.env` ou scripts SQL executáveis; configuração concentrada em `config/config.js`. |
| 4 | **Simulador Multicanal Funcional** | ✅ Aprovado | Alternador na barra superior comuta instantaneamente entre App (`max-w-sm`), Totem (`channel-totem`) e Web (`max-w-7xl`). |
| 5 | **Ergonomia do Totem (≥ 48px)** | ✅ Aprovado | No canal Totem, botões, inputs, seletores e chips preservam área de toque com altura mínima de 48px (conforme WCAG AA). |
| 6 | **Modo Wireframe Operacional** | ✅ Aprovado | Botão global converte a interface em escala de cinza e alto contraste com bordas tracejadas e fotos mascaradas. |
| 7 | **Seleção de Filial e Estoque Dinâmico** | ✅ Aprovado | Alternância de filial recalcula a disponibilidade dos pratos em tempo real; pratos esgotados recebem badge e botão desabilitado. |
| 8 | **Sacola de Compras Reativa** | ✅ Aprovado | Inclusão, incremento, decremento e exclusão recalculam subtotais, contadores e valor total instantaneamente. |
| 9 | **Desconto de Fidelidade** | ✅ Aprovado | Resgate de pontos abate R$ 15,00 no subtotal com garantia estrita de piso em `R$ 0,00` para evitar saldos negativos. |
| 10 | **Conformidade Estrita com a LGPD** | ✅ Aprovado | Banner de cookies grava o aceite e checkbox de privacidade bloqueia de forma absoluta o pagamento se desmarcado. |
| 11 | **Validação Visual de Formulário** | ✅ Aprovado | Validações em tempo real com bordas vermelhas e mensagens textuais explicativas abaixo de Nome e Telefone. |
| 12 | **Simulação de Gateway com Cenários** | ✅ Aprovado | Modal mock permite forçar Aprovação (Verde Macaxeira `#25D366`) ou Recusa (Vermelho Erro `#BA1A1A` com retentativa). |
| 13 | **Linha do Tempo Visual (Stepper)** | ✅ Aprovado | Stepper estruturado em 3 fases com avanço temporizado de 4s, contagem regressiva e botões manuais de demonstração. |
| 14 | **Persistência no Web Storage & Contingência** | ✅ Aprovado | Chaves padronizadas (`rn_*`) encapsuladas em `storage.js` com fallback transparente em `memoryStore` para contingência. |
| 15 | **Deploy em GitHub Pages** | ✅ Aprovado | Caminhos 100% relativos (`./assets/...`, `./config/...`, `./js/...`), testados e homologados para GitHub Pages. |

---

## 🛠️ Arquitetura e Tecnologias

A aplicação adota o modelo **Zero-Build & Client-Side**, eliminando dependências pesadas de compilação ou servidores de retaguarda:

- **Estrutura Semântica:** HTML5 estruturado com foco em acessibilidade (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<dialog>`).
- **Design System:** Tailwind CSS v3 via CDN com injeção do tema *"Warm Tactile Neo-Brutalism"* (paleta em tons terrosos sertanejos, sombras sólidas projetadas `#3A0E03` e efeito de costura artesanal em couro `.stitch`).
- **Lógica e Interatividade:** JavaScript Vanilla moderno (ECMAScript 2022+) estruturado em módulos nativos (`type="module"`), sem frameworks compilados.
- **Acessibilidade Digital (WCAG 2.1 AA):** Skip link no topo do DOM, indicadores de foco com contorno de alto contraste (:focus-visible), atributos ARIA (`aria-pressed`, `aria-checked`, `aria-expanded`, `aria-live`), rótulos semânticos e contrastes superiores a 4.5:1.
- **Iconografia e Tipografia:** Lucide Icons via CDN e Google Fonts (Epilogue, Fraunces e Nunito Sans).
- **Persistência de Dados:** Web Storage API (`localStorage`) com isolamento de chaves (`rn_*`) e camada transparente de contingência em memória (`memoryStore`) para operação em ambientes com cookies restritos.

---

## 📁 Estrutura de Diretórios

```text
./
├── index.html                     # Casca semântica única da SPA Zero-Build
├── config/
│   └── config.js                 # Objeto de configurações estáticas e chaves do storage
├── assets/
│   ├── css/
│   │   └── custom.css            # Estilos complementares (wireframe, .stitch, foco acessível, elevações)
│   └── img/
│       ├── logo.png              # Logotipo oficial (fundos claros)
│       ├── logo_branca.png       # Logotipo oficial (fundos escuros / wireframe)
│       ├── cuscuz-carne-sol.webp # Imagens dos pratos regionais
│       ├── tapioca-rendada.webp
│       ├── baiao-dois.webp
│       ├── suco-caja.webp
│       └── bolo-rolo.webp
├── js/
│   ├── app.js                    # Ponto de entrada e orquestrador central da aplicação
│   ├── models/
│   │   ├── mockData.js           # Catálogo de dados imutáveis (filiais, pratos, estoque)
│   │   └── storage.js            # Abstração de persistência com fallback em memoryStore
│   ├── controllers/
│   │   ├── channelController.js  # Gerenciador da alternância de layout (App, Totem, Web)
│   │   ├── wireframeController.js# Gerenciador do interruptor do Modo Wireframe
│   │   ├── branchController.js   # Gerenciador da seleção de filial e recálculo de estoque
│   │   ├── menuController.js     # Gerenciador da listagem de produtos e filtros
│   │   ├── cartController.js     # Gerenciador de itens, fidelidade e totais da sacola
│   │   ├── lgpdController.js     # Gerenciador de cookies e termos de privacidade
│   │   ├── checkoutController.js # Gerenciador do modal simulador de pagamento
│   │   └── timelineController.js # Gerenciador do stepper da linha do tempo
│   └── views/
│       ├── channelView.js        # Ajustes de classes do container de viewports
│       ├── branchView.js         # Cards de filiais com efeito .stitch e modal de troca
│       ├── menuView.js           # Grid de pratos e fallbacks temáticos SVG
│       ├── cartView.js           # Sacola de compras, fidelidade e formulário
│       ├── lgpdView.js           # Banner inferior de cookies e modal de termos
│       ├── checkoutView.js       # Modal do gateway mockado e transições visuais
│       └── timelineView.js       # Linha do tempo visual em 3 fases com controles
├── docs/
│   ├── FSD.md                    # Documento de Especificação Funcional completo
│   ├── DESIGN.md                 # Especificação do Design System e tokens visuais
│   ├── INSUMOS.md                # Inventário de insumos do projeto
│   ├── PLANO.md                  # Plano de construção incremental (11 fases)
│   ├── STATUS.md                 # Registro vivo de status e checklists de conformidade
│   └── ERROS.md                  # Memória técnica de incidentes e soluções aplicadas
├── .gitattributes                # Padronização de quebras de linha e arquivos binários
├── .gitignore                    # Regras de proteção de arquivos locais e temporários
└── README.md                     # Documentação de introdução e guia de homologação
```

---

## 💻 Instruções de Execução Local

Por se tratar de uma SPA Zero-Build, **não é necessário instalar nenhuma dependência via terminal** (`npm install` ou similares):

### Método 1: Servidor Estático Local (Recomendado para Módulos ES6)
Em decorrência das políticas de segurança de navegadores modernos (CORS/Same-Origin) relativas a módulos JavaScript (`type="module"`), recomenda-se abrir através de um servidor HTTP leve:

- **Opção A (Python 3):**
  ```bash
  python -m http.server 8000
  ```
  Acesse: `http://localhost:8000`

- **Opção B (VS Code Live Server):**
  Clique com o botão direito sobre o arquivo `index.html` e selecione *"Open with Live Server"*.

- **Opção C (Apache / XAMPP):**
  Copie a pasta para o diretório `htdocs` e acesse `http://localhost/Raizes_do_Nordeste_FrontEnd/`.

### Método 2: Abertura Direta
Dê um clique duplo em `index.html` para abrir diretamente no navegador (funciona perfeitamente em navegadores configurados para leitura local de módulos).

---

## 🎯 Roteiro de Demonstração para a Banca Examinadora

Para homologação completa da aplicação perante a banca acadêmica da UNINTER, siga este roteiro interativo:

1. **Multicanalidade e Wireframe:**
   - Na barra superior, clique em **Totem**: observe a proporção vertical e os botões com área de toque mínima de 48px.
   - Clique em **App**: observe o container restrito para dispositivos móveis com coluna única.
   - Clique em **Web**: retorne ao modo desktop com catálogo expandido e sacola lateral fixa.
   - Clique em **Modo Wireframe**: comprove a conversão instantânea de toda a interface para escala de cinza, alto contraste e contornos tracejados, ideal para relatórios de usabilidade. Clique novamente para desativar.

2. **Seleção de Filial e Validação de Estoque:**
   - Selecione a filial **"Recife Antigo - Matriz"**: repare que o prato *"Cuscuz Brasa com Carne de Sol"* está disponível para adição.
   - Alterne para a filial **"Olinda - Sítio Histórico"**: observe que o mesmo prato recebe imediatamente o badge `INDISPONÍVEL NESTA FILIAL`, fica esmaecido e seu botão é bloqueado com `disabled` e `cursor-not-allowed` (conforme matriz de estoque do FSD).

3. **Sacola de Compras e Resgate de Fidelidade:**
   - Adicione 1 prato *"Tapioca Rendada Sertaneja"* (R$ 18,50).
   - Incremente a quantidade no botão `+` para 2 unidades: o subtotal passa a R$ 37,00.
   - No card **Nordeste Pontos**, acione o interruptor switch: repare o abatimento imediato de R$ 15,00 no total geral (recalculado para R$ 22,00).

4. **Identificação e Conformidade LGPD:**
   - No banner inferior de cookies, clique em **"Saiba mais sobre seus direitos"** para inspecionar os Termos da LGPD e em seguida clique em **"Aceitar e Fechar"**.
   - No formulário da sacola, preencha seu nome e celular (note a máscara dinâmica formatando automaticamente o DDD).
   - Tente clicar em **"Avançar para Pagamento"** com o checkbox de privacidade desmarcado: note o bloqueio imediato com aviso em vermelho explicativo.
   - Marque o checkbox para liberar o avanço.

5. **Simulação do Gateway de Pagamento:**
   - No modal de pagamento, escolha a opção **PIX** (observe o QR Code temático gerado e o botão de copiar código).
   - Clique em **"Forçar Recusa"**: comprove a transação rejeitada com transição para Vermelho Erro (`#BA1A1A`) e botão para retentativa sem perda do carrinho.
   - Clique em **"Tentar Novamente"** e em seguida em **"Forçar Aprovação"**: veja a confirmação em Verde Macaxeira (`#25D366`), a emissão do número do pedido sequencial e o redirecionamento automático para a Linha do Tempo.

6. **Linha do Tempo de Produção (Stepper):**
   - Acompanhe a transição automática com temporizador de 4 segundos avançando de *Pedido Recebido* para *Em Preparo* e *Pronto para Retirada*.
   - Utilize os botões manuais **"Pausar"**, **"Voltar Etapa"** e **"Avançar Etapa"** para demonstrar cada fase no seu tempo.
   - Pressione **F5** (recarregar): note que o pedido em produção é mantido intacto no stepper.
   - Clique em **"Fazer Novo Pedido"** para encerrar o ciclo e retornar ao cardápio com sacola zerada.

---

## 📋 Normas Acadêmicas e Qualidade de Código

- **Zero Dependências Compiladas:** Nenhum instalador de pacotes ou compilador exigido.
- **Acessibilidade:** Padrões WCAG 2.1 nível AA estritamente observados (skip link, foco visível com `:focus-visible`, contraste de cor superior a 4.5:1 e touch targets ergonômicos de 48px no Totem).
- **Segurança e Privacidade:** Dados de cartão e pagamentos são exclusivamente simulados para fins didáticos, em estrita conformidade com a LGPD e sem trafegar dados sensíveis.
- **Prevenção XSS:** Todas as saídas de usuário no DOM são rigorosamente tratadas via `textContent` ou rotinas de escape explícitas (`escapeHtml`).
