# DOCUMENTO DE ESPECIFICAÇÃO FUNCIONAL (FSD)

---

## 1. Visão Geral

### 1.1. Nome do Sistema
**Raízes do Nordeste - Frente de Caixa Multicanal** (Versão 1.0.0).

### 1.2. Objetivo Principal
Prover um simulador interativo de ponto de venda (PDV / Frente de Caixa) e autoatendimento multicanal para a rede gastronômica sertaneja "Raízes do Nordeste", centrado na jornada autônoma do cliente final. A aplicação viabiliza a localização de filiais, a consulta dinâmica de cardápio com validação de estoque em tempo real por unidade, a seleção de pratos com adicionais, a retenção de itens em sacola de compras, a aplicação de descontos por programa de fidelidade ("Nordeste Pontos"), o consentimento estrito e regulatório da Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018), a simulação de transações de pagamento via gateway mockado com múltiplos cenários de retorno (sucesso e falha) e o rastreamento do pedido através de uma linha do tempo de produção (stepper).

### 1.3. Resumo do Funcionamento
O sistema opera integralmente no navegador como uma Single Page Application (SPA) pura ("Zero-Build"), executada do lado do cliente (client-side) sem dependência de processamento de servidor de retaguarda. 

A experiência do usuário se desenvolve pelas seguintes etapas encadeadas:
1. **Configuração de Contexto e Multicanalidade:** O usuário acessa a aplicação e pode alternar, a qualquer momento na barra de controle superior, entre as visualizações de **App Mobile** (container restrito com foco em rolagem vertical e alvos de toque ergonômicos), **Totem de Autoatendimento** (container esticado simulando tela vertical 1080x1920 com botões ampliados para áreas de toque de no mínimo 48px) e **Web Desktop** (layout expandido com grid de produtos e barra lateral fixa para o carrinho).
2. **Auditoria e Modo Wireframe:** Para fins de verificação técnica e extração de evidências acadêmicas, a aplicação disponibiliza um interruptor global que converte o design visual da interface para uma representação monocromática estrutural em escala de cinza e alto contraste, com bordas tracejadas e mascaramento de fotografias.
3. **Seleção de Unidade da Rede:** O cliente escolhe a filial em que deseja efetuar o pedido (ex.: *Recife Antigo - Matriz*, *Boa Viagem*, *Olinda Histórica*). A escolha da filial recalcula instantaneamente a disponibilidade física de cada prato regional.
4. **Exploração do Cardápio Sertanejo:** O cliente navega por categorias gastronômicas (Cuscuz Tradicional e Recheado, Tapiocas da Terra, Pratos Típicos Sertanejos, Bebidas Regionais e Sobremesas). Pratos disponíveis exibem imagem (com fallback visual seguro), descrição de ingredientes, selos de destaque (`★`) e botão ativo de inserção. Pratos sem estoque na filial selecionada recebem tratamento visual esmaecido (grayscale/opacidade) e bloqueio definitivo no botão de adição.
5. **Sacola de Compras e Programa de Fidelidade:** O usuário gerencia quantidades de itens na sacola, consulta o subtotal e pode acionar o resgate de saldo simulado do programa "Nordeste Pontos", abatendo valores diretamente do montante a pagar.
6. **Conformidade LGPD e Identificação:** O sistema apresenta um banner informativo de cookies na base da tela e exige o preenchimento de nome e telefone celular para identificação do pedido. A finalização do pedido é condicionada à marcação obrigatória do checkbox de consentimento da Política de Privacidade.
7. **Simulação de Gateway de Pagamento:** Ao acionar o checkout, um modal suspenso permite escolher a forma de pagamento e disponibiliza comandos explícitos de teste para forçar o desfecho da transação externa:
   - *Aprovar Pagamento:* Altera o estado do modal para confirmação visual em Verde Macaxeira (`#25D366`) com ícone de sucesso em checkmark, grava o pedido no histórico local e direciona para a linha do tempo.
   - *Recusar Pagamento:* Altera o estado do modal para alerta visual em Vermelho Erro (`#BA1A1A`) com ícone de erro em cruz e mensagem explicativa, permitindo nova tentativa sem perda dos itens do carrinho.
8. **Linha do Tempo de Produção:** O pedido aprovado é apresentado em um componente de acompanhamento visual (stepper) com três estados operacionais: *Pedido Recebido*, *Em Preparo* e *Pronto para Retirada*, contando com transição automática temporizada e controles manuais de demonstração.

### 1.4. Público Usuário
- **Clientes da Rede Raízes do Nordeste:** Consumidores finais que utilizam a interface em seus próprios celulares, em quiosques interativos de autoatendimento (totens físicos em salão) ou em computadores de mesa.
- **Avaliadores e Auditores Técnicos:** Professores, analistas e examinadores acadêmicos que auditam o cumprimento das diretrizes de usabilidade, padrões visuais, semântica web, acessibilidade digital e conformidade com a LGPD.

### 1.5. Contexto de Uso
A aplicação opera em ambientes de atendimento rápido no segmento de alimentação (fast-casual e lanchonetes regionais). Em salões físicos, os totens demandam interfaces de alta legibilidade, alto contraste e ausência de teclado físico (touch-first). Em dispositivos móveis, a interface prioriza a operação com uma mão e tempos de resposta instantâneos.

### 1.6. Observações Relevantes para Implementação
- A aplicação é 100% estática e não consome endpoints REST dinâmicos nem requer servidores de execução como Node.js, PHP, Python ou bancos de dados relacionais instalados.
- Toda a carga inicial de dados (filiais, categorias, cardápio e saldo de fidelidade) provém de um arquivo estático de dados simulados (`mockData.js`).
- O estado transitório e a persistência entre recarregamentos de página utilizam estritamente a Web Storage API (`localStorage`), com camada de proteção de contingência em memória.
- Não devem ser adicionados passos de compilação ou empacotamento local (*build tools* como Vite, Webpack ou Parcel). A execução deve ocorrer diretamente ao abrir o arquivo `index.html`.

---

## 2. Documentos do Projeto para Implementação

Para a construção e entrega integral do sistema, a IA codificadora e os desenvolvedores envolvidos deverão utilizar exclusivamente os seguintes documentos normativos:

1. **`docs/FSD.md`** (o presente documento de especificação funcional, consolidando todas as regras técnicas, operacionais, fluxos, estruturas de dados simulados e critérios de aceitação).
2. **`docs/DESIGN.md`** (especificação visual detalhada e soberana, incluindo a paleta de cores "Warm Tactile Neo-Brutalism", tokens tipográficos, regras de elevação física 3D, espaçamentos e componentes de interface).

> [!NOTE]
> **Papel do Arquivo `docs/code.html`:**  
> O arquivo `code.html` presente na pasta de documentação contém um protótipo com classes utilitárias do Tailwind CSS e fontes do projeto aplicadas a um painel gerencial da rede. Ele serve **exclusivamente como referência visual de código, paleta e estilização de componentes** no design system "Warm Tactile Neo-Brutalism". A sua tela funcional (painel de retaguarda/gestão operacional) está fora de escopo para a v1.0, cujo foco exclusivo é a Frente de Caixa e Autoatendimento do Cliente Final.

> [!IMPORTANT]
> **Precedência e Sanidade Documental:**  
> O arquivo `PRD.md` originalmente presente no repositório continha anotações preliminares de interface intituladas como rascunho de design, com paleta de cores e tipografia antigas que foram formalmente superadas pelo `docs/DESIGN.md`. Todas as regras de negócio, jornadas de usuário e requisitos funcionais foram consolidados integralmente neste `docs/FSD.md`.  
> A IA codificadora e os desenvolvedores **não devem** consultar o arquivo `PRD.md` nem extrair classes de estilo dele; a autoridade visual vinculante pertence única e exclusivamente ao `docs/DESIGN.md`.

---

## 3. Stack Definida

### 3.1. Tecnologias Centrais
- **Marcação e Estrutura:** HTML5 Semântico (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<dialog>`), priorizando acessibilidade para leitores de tela e conformidade com os padrões da W3C.
- **Estilização e Design System:** Tailwind CSS versão 3.x carregado via CDN oficial (`https://cdn.tailwindcss.com`), com injeção de configurações de tema customizadas no próprio cabeçalho da página para refletir as cores e espaçamentos do design system "Warm Tactile Neo-Brutalism" e classes complementares para o efeito `.stitch` e `.wireframe-mode`.
- **Lógica e Interatividade:** JavaScript puro (Vanilla ECMAScript 6+ / ES2022+), operando com módulos nativos (`type="module"`), manipulação declarativa do DOM e recursos assíncronos nativos (`async/await`, `Promise`, `CustomEvent`).
- **Iconografia:** Biblioteca de ícones vetoriais Lucide Icons (ou FontAwesome) carregada via CDN oficial para renderização leve de pictogramas de interface (sacola, estrelas, setas, status de pagamento e canais).
- **Tipografia:** Google Fonts carregado via CDN com os conjuntos tipográficos oficiais do `DESIGN.md`:
  - *Títulos de Impacto e Identidade:* Epilogue (pesos 800 e 900) e Bowlby One / Fraunces (destaques editoriais).
  - *Textos de Interface e Leitura:* Nunito Sans (pesos 500, 600, 700 e 800).
- **Persistência de Dados e Estado:** Web Storage API (`localStorage`), nativa de navegadores modernos, para gravação do estado do carrinho, consentimento de cookies, identificação do cliente e histórico de pedidos.

### 3.2. Padrão Arquitetural
A aplicação segue uma estrutura inspirada no padrão **MVC (Model-View-Controller)** adaptada para aplicações puramente front-end em Vanilla JS:
- **Model:** Representado pelo arquivo `mockData.js` (dados de domínio imutáveis) e pela camada de abstração de armazenamento `storage.js` (gerenciamento das chaves do `localStorage` com contingência de memória).
- **View:** Constituída pela marcação base contida em `index.html` e por funções geradoras de templates JavaScript que constroem dinamicamente os componentes da interface utilizando as classes utilitárias do Tailwind CSS.
- **Controller:** Composto por módulos de controle funcional (`app.js`, `channelController.js`, `branchController.js`, `cartController.js`, `checkoutController.js`), encarregados de escutar eventos do DOM, invocar as validações de regras de negócio, atualizar o estado persistido e solicitar a re-renderização das Views correspondentes.

### 3.3. Restrições Técnicas Rígidas
- **Zero-Build:** Fica terminantemente proibido o uso de gerenciadores de pacotes (`npm`, `yarn`, `pnpm`), ferramentas de bundling (`Webpack`, `Vite`, `Rollup`) ou frameworks reativos compilados (`React`, `Vue`, `Angular`, `Svelte`).
- **Ausência de Back-End:** Não deve ser implementado nenhum servidor de aplicação (Node.js/Express, PHP, Python, Java) nem banco de dados de retaguarda (MySQL, PostgreSQL, MongoDB, SQLite).
- **Independência de Ambiente:** Todos os recursos (CSS, imagens, scripts e fontes) devem ser resolvidos via URLs públicas de CDN confiável ou caminhos relativos ao arquivo `index.html`.

---

## 4. Ambientes do Projeto

### 4.1. Ambiente de Desenvolvimento Local
- **Execução:** O projeto é aberto diretamente no navegador a partir do sistema de arquivos ou servido por um servidor estático local leve, tais como:
  - Extensão *Live Server* do Visual Studio Code;
  - Servidor Apache integrado do XAMPP (alocado na pasta `htdocs/[nome-do-projeto]/`);
  - Servidor embutido do Python (`python -m http.server 8000`).
- **Sem Pré-requisitos de Instalação:** Não é necessária a instalação de dependências de terminal ou compilação de código antes da visualização das alterações.

### 4.2. Ambiente de Testes e Homologação
- **Validação de Responsividade:** Realizada diretamente no navegador através da alternância entre os canais na barra superior (App, Totem e Web) e confirmada por meio das ferramentas de desenvolvedor (DevTools) simulando resoluções de iPhone 14/15 (390x844px), Totem Vertical (1080x1920px) e Desktop Full HD (1920x1080px).
- **Validação de Acessibilidade e Contraste:** Auditoria com o Modo Wireframe ativado e verificação de critérios WCAG 2.1 nível AA para alvos de toque (mínimo de 48px no Totem) e contraste cromático.
- **Depuração de Estado:** Limpeza, edição e monitoramento dos dados de teste via painel *Application > Local Storage* do navegador.

### 4.3. Ambiente de Produção (Deploy)
- **Hospedagem:** O repositório do projeto no GitHub é configurado para publicação automática no **GitHub Pages** a partir do branch principal (`main` ou `gh-pages`).
- **Requisitos de Deploy:** Todos os links, importações de scripts e caminhos de imagens devem utilizar caminhos relativos (`./assets/...` ou `assets/...`), garantindo que o sistema funcione com exatidão tanto na raiz de um domínio quanto em subdiretórios públicos (ex.: `https://usuario.github.io/raizes-do-nordeste-pdv/`).

---

## 5. Arquitetura do Sistema

### 5.1. Estratégia de Diretórios e Acesso
A referência de caminhos de toda a aplicação é a **raiz do repositório (`./`)**. O ponto de entrada público é o arquivo `index.html`. Pastas internas organizam os recursos conforme suas responsabilidades lógicas:

```
./
├── index.html                     # Ponto de entrada único e casca semântica da SPA
├── config/
│   └── config.js                 # Objeto de configuração estática da aplicação em JavaScript
├── assets/
│   ├── css/
│   │   └── custom.css            # Estilos complementares (modo wireframe, costura .stitch e animações)
│   ├── img/
│   │   ├── logo.png              # Logotipo oficial da marca (versão colorida para fundos claros)
│   │   ├── logo_branca.png       # Logotipo oficial da marca (versão branca para fundos escuros e contrastantes)
│   │   ├── cuscuz-carne-sol.webp # Imagens dos pratos (ou ilustrações temáticas em SVG como fallback nativo)
│   │   ├── tapioca-rendada.webp
│   │   ├── baiao-dois.webp
│   │   ├── bolo-rolo.webp
│   │   └── suco-caja.webp
│   └── icons/                    # Ícones locais ou fallbacks SVG
├── js/
│   ├── app.js                    # Orquestrador central e inicialização do ciclo de vida da SPA
│   ├── models/
│   │   ├── mockData.js           # Dados estáticos: filiais, categorias, cardápio por unidade, regras de fidelidade
│   │   └── storage.js            # Camada de abstração e sanitização do Web Storage (com memoryStore fallback)
│   ├── controllers/
│   │   ├── channelController.js  # Gerenciador da alternância de layout (App, Totem, Web)
│   │   ├── wireframeController.js# Gerenciador do interruptor do Modo Wireframe
│   │   ├── branchController.js   # Gerenciador da seleção de filial e recálculo de estoque
│   │   ├── menuController.js     # Gerenciador da listagem de produtos e filtros de categoria
│   │   ├── cartController.js     # Gerenciador de itens, quantidades, fidelidade e totais da sacola
│   │   ├── checkoutController.js # Gerenciador de validação de dados, LGPD, modal gateway e timeline
│   │   └── lgpdController.js     # Gerenciador da exibição e consentimento de cookies
│   └── views/
│       ├── channelView.js        # Ajustes de classes CSS do container raiz
│       ├── branchView.js         # Renderização dos cards de filiais com efeito .stitch
│       ├── menuView.js           # Renderização do grid de pratos, fallbacks de imagem e badges
│       ├── cartView.js           # Renderização da sacola lateral/drawer e painel de fidelidade
│       ├── checkoutView.js       # Renderização do modal de pagamento simulado e mensagens de status
│       ├── timelineView.js       # Renderização da linha do tempo (stepper) com 3 estados
│       └── lgpdView.js           # Renderização do banner inferior de cookies e modal de termos
├── docs/
│   ├── FSD.md                    # Especificação funcional consolidada (este documento)
│   └── DESIGN.md                 # Especificação de design system e tokens visuais
└── README.md                     # Documentação de introdução, instruções de uso e link de deploy
```

### 5.2. Fluxo Arquitetural Unidirecional de Dados
1. **Ação do Usuário:** O usuário interage com a interface (clique em botão, digitação em input, seleção de filial, alternância de canal).
2. **Disparo do Controller:** O Controller associado intercepta o evento, previne ações padrão do navegador quando aplicável, e executa a validação das regras de negócio.
3. **Consulta ou Mutação do Model:** O Controller lê os dados imutáveis de `mockData.js` ou lê/grava dados dinâmicos através de `storage.js` no `localStorage`.
4. **Atualização da View:** Uma vez atualizado o estado, o Controller aciona a função de renderização da View correspondente, que atualiza pontualmente o DOM via manipulação de classes Tailwind e injeção de fragmentos HTML sanitizados.

---

## 6. Escopo Funcional da Primeira Versão

### 6.1. Módulo 1: Simulador Multicanal e Auditoria Visual
- **Alternador de Viewports (Canais):**
  - Permite ao usuário comutar entre três modos de visualização em tempo de execução:
    - *Canal App Mobile:* Container restrito a `max-w-sm` (aproximadamente 390px a 420px de largura), centralizado na tela, com navegação fluida em coluna única.
    - *Canal Totem de Autoatendimento:* Container vertical de proporção esticada (simulando 1080x1920px), com fontes ampliadas e altura mínima garantida de 48px para todos os alvos de clique/toque.
    - *Canal Web Desktop:* Container ampliado (`max-w-6xl` a `max-w-7xl`), estruturado em duas colunas: área principal para catálogo de produtos e coluna lateral fixa (*aside*) para a sacola de compras.
- **Alternador de Modo Wireframe:**
  - Botão na barra de controle superior que ativa ou desativa a classe `.wireframe-mode` na tag `<body>`.
  - Transforma instantaneamente toda a paleta visual em escala de cinza e alto contraste, substitui fotos de pratos por caixas com ícones genéricos e converte bordas sólidas em tracejadas (`border-dashed`), viabilizando a captura de telas para relatórios acadêmicos.

### 6.2. Módulo 2: Localização e Seleção de Filiais
- **Catálogo de Unidades:**
  - Apresentação de três filiais pré-cadastradas: *Recife Antigo - Matriz*, *Boa Viagem* e *Olinda Histórica*.
  - Cada filial exibe nome, endereço simplificado, horário de funcionamento e tempo médio estimado de preparo.
- **Seleção Ativa:**
  - O cliente clica no card da filial desejada para defini-la como ativa.
  - A seleção altera o indicador visual da loja ativa (borda caramelo com selo dourado `★ LOJA SELECIONADA`) e atualiza imediatamente o catálogo de pratos, refletindo o estoque específico da unidade escolhida.

### 6.3. Módulo 3: Cardápio Regional e Gestão Local de Estoque
- **Exibição por Categorias:**
  - Filtros rápidos tipo pílula (*chips*) para segmentação por categorias sertanejas: *Todos os Pratos*, *Cuscuz da Casa*, *Tapiocas & Queijo*, *Pratos Sertanejos*, *Bebidas Regionais* e *Sobremesas*.
- **Cards de Pratos Sertanejos:**
  - Apresentam imagem do prato em proporção acolhedora com cantos arredondados (com proteção via manipulador `onerror` para fallback de SVG temático), título em tipografia expressiva, descrição sucinta dos ingredientes e preço em Reais (`R$ XX,XX`).
  - Pratos selecionados exibem selos de destaque (`★ TRADIÇÃO DA CASA`, `★ MAIS PEDIDO`, `★ COMBINADO REGIONAL`).
- **Validação Dinâmica de Estoque:**
  - Cada prato possui uma matriz de disponibilidade associada a cada filial no arquivo `mockData.js`.
  - Caso o prato esteja *Disponível* na filial ativa: exibe botão primário "+ Adicionar" interativo e funcional.
  - Caso o prato esteja *Esgotado* na filial ativa: o card recebe opacidade de 50% ou filtro grayscale, badge `INDISPONÍVEL NESTA FILIAL`, e o botão de inserção é desabilitado com os atributos `disabled` e classe `cursor-not-allowed`.

### 6.4. Módulo 4: Sacola de Compras (Carrinho)
- **Gerenciamento de Itens:**
  - Adição de novos pratos com quantidade inicial 1.
  - Se um prato já adicionado for inserido novamente, incrementa sua quantidade.
  - Botões dedicados de incremento (`+`) e decremento (`-`) para cada item da sacola. Ao atingir quantidade zero, o item é removido da lista.
  - Botão de exclusão rápida (ícone de lixeira) por item.
- **Resumo Financeiro em Tempo Real:**
  - Cálculo automático de:
    - *Subtotal dos Itens;*
    - *Desconto do Programa de Fidelidade;*
    - *Total Geral da Compra.*

### 6.5. Módulo 5: Programa de Fidelidade "Nordeste Pontos"
- **Saldo Simulado:**
  - O sistema exibe um painel de fidelidade com moldura estilizada informando o saldo acumulado pelo cliente simulado (ex.: *Saldo: 150 pontos*).
- **Resgate de Pontos para Abatimento Financeiro:**
  - Componente de alternância (*toggle* ou *checkbox*) permitindo aplicar os pontos disponíveis: *"Usar 150 pontos para obter R$ 15,00 de desconto"*.
  - A ativação do benefício desconta o valor do subtotal e recalcula o total final imediatamente. Se o valor do carrinho for inferior ao desconto, o total é travado no piso de `R$ 0,00`.

### 6.6. Módulo 6: Conformidade com a LGPD
- **Banner de Cookies:**
  - Notificação não-bloqueante fixada na parte inferior da tela informando a coleta de dados de navegação para propósitos operacionais e de personalização.
  - Botão "Aceitar e Fechar" que grava o consentimento no `localStorage` e encerra a exibição do banner.
- **Consentimento Explícito no Fechamento do Pedido:**
  - Checkbox obrigatório localizado na etapa de finalização: *"Li e concordo com os Termos de Privacidade e autorizo o tratamento dos meus dados para emissão do pedido e acúmulo de pontos de fidelidade."*
  - Bloqueio estrito: o botão de confirmação e avanço para o pagamento permanece desabilitado ou exibe bloqueio com alerta visual caso o checkbox não esteja marcado.

### 6.7. Módulo 7: Identificação do Cliente
- **Formulário de Contato:**
  - Campo *Nome Completo* (mínimo de 3 caracteres).
  - Campo *Telefone Celular / WhatsApp* (formato `(XX) XXXXX-XXXX`, com formatação nativa via Vanilla JS).
- **Validação Visual Acessível:**
  - Tentativas de avançar com campos vazios ou formatos inválidos aplicam borda vermelha (`border-[#BA1A1A]`) e exibem mensagens de erro textuais logo abaixo dos campos em texto de apoio legível.

### 6.8. Módulo 8: Gateway de Pagamento Mockado
- **Seleção da Forma de Pagamento:**
  - Opções selecionáveis: *PIX*, *Cartão de Crédito*, *Cartão de Débito* e *Dinheiro / Balcão*.
- **Controle de Simulação de Gateway:**
  - Modal suspenso de pagamento com duas ações de teste explícitas:
    - **Botão "Forçar Aprovação":** Simula retorno imediato da adquirente externa com sucesso. Altera o fundo do modal para Verde Macaxeira (`#25D366`), exibe ícone de checkmark, grava o pedido no `localStorage` e transiciona o usuário para a Linha do Tempo.
    - **Botão "Forçar Recusa":** Simula falha externa na transação. Altera o modal para Vermelho Erro (`#BA1A1A`), exibe ícone de erro em cruz e botão de "Tentar Novamente", preservando integralmente o carrinho.

### 6.9. Módulo 9: Linha do Tempo do Pedido (Stepper)
- **Indicadores Visuais de Etapa:**
  - O pedido aprovado gera um número de controle sequencial (ex.: `#RN-1042`) e apresenta uma linha do tempo estruturada em três fases:
    1. *Pedido Recebido* (Confirmado no sistema e enviado à cozinha);
    2. *Em Preparo* (Cozinheiros preparando os pratos sertanejos);
    3. *Pronto para Retirada* (Pronto no balcão da filial selecionada).
- **Mecanismo de Transição Híbrido:**
  - Transição automática temporizada de 4 segundos por fase, acompanhada de botões manuais de navegação (*Avançar Etapa* / *Voltar Etapa*) para permitir ao avaliador acadêmico demonstrar cada estado.

---

## 7. Fora de Escopo

Para garantir a viabilidade, a autonomia estrita do front-end e o foco na excelência de interface da primeira versão, os seguintes recursos e tecnologias estão expressamente fora de escopo:

1. **Bancos de Dados Relacionais ou NoSQL:** Fica terminantemente proibido o uso de bancos de dados em produção ou desenvolvimento (MySQL, PostgreSQL, Oracle, MongoDB, Firebase Firestore). Toda a persistência é limitada à Web Storage API local.
2. **Servidores de Aplicação e Rotas de Back-End:** Não serão desenvolvidos endpoints ou serviços em Node.js, PHP, Python, Java, C# ou Go.
3. **APIs Financeiras Reais:** Ficam excluídas integrações com gateways bancários em produção (Mercado Pago, Stripe, Pagar.me, Cielo, Stone ou API Pix de instituições financeiras). As transações são exclusivamente simuladas via modal mock.
4. **Autenticação Criptográfica com Back-End:** Não haverá login real com senhas criptografadas, tokens JWT, OAuth2, sessões de servidor ou recuperação de senha por e-mail.
5. **Painéis Administrativos de Retaguarda (Back-Office / B2B):** Não fazem parte do escopo módulos de contas a pagar/receber, cadastro dinâmico de pratos por painel administrativo, relatórios fiscais, emissão de NFC-e ou controle contábil.
6. **Upload de Arquivos:** O sistema não contempla envio de comprovantes, fotos ou arquivos pelo usuário. Imagens de pratos são ativos estáticos pré-existentes.
7. **Disparo Real de Mensagens Externas:** Não haverá envio real de mensagens por SMS, WhatsApp Business API ou serviços de e-mail transacional (SMTP/SendGrid).
8. **Exportação de Relatórios em Arquivo e Telas de Histórico:** Não haverá geração de arquivos CSV, PDF ou Excel, nem telas de consulta a múltiplos pedidos anteriores.

---

## 8. Perfis de Usuário e Permissões

A aplicação opera sob um modelo centrado na experiência de autoatendimento, possuindo dois perfis operacionais previstos para a interação com a interface:

### 8.1. Perfil 1: Cliente / Consumidor Final
- **Descrição:** Usuário comum que utiliza o autoatendimento no salão físico ou acessa o cardápio via celular ou computador para montar seu pedido.
- **Ações Permitidas:**
  - Selecionar e alterar a filial de atendimento;
  - Navegar pelo cardápio e filtrar por categorias;
  - Adicionar, alterar quantidades e remover itens da sacola;
  - Aplicar ou remover desconto do programa de fidelidade;
  - Visualizar e aceitar os termos de cookies e de privacidade (LGPD);
  - Informar nome e telefone celular para identificação;
  - Selecionar a forma de pagamento e disparar a simulação do checkout;
  - Consultar a linha do tempo do pedido recém-criado.
- **Ações Bloqueadas:**
  - Adicionar pratos que estejam esgotados na filial ativa;
  - Finalizar a compra com o carrinho vazio;
  - Finalizar a compra sem preencher os campos de identificação obrigatórios;
  - Finalizar a compra sem marcar o checkbox de consentimento da LGPD.

### 8.2. Perfil 2: Avaliador / Auditor Técnico
- **Descrição:** Professor, examinador ou desenvolvedor responsável por validar o comportamento do sistema, a responsividade e a aderência aos padrões de projeto.
- **Ações Permitidas:**
  - Todas as ações do Perfil Cliente;
  - Alternar entre os modos de visualização (App Mobile, Totem e Web Desktop) através do seletor superior;
  - Ativar e desativar o interruptor do Modo Wireframe para inspeção de contraste e layout neutro;
  - Utilizar os controles explícitos do modal de pagamento para forçar cenários de aprovação ou recusa do gateway;
  - Utilizar os botões manuais de avanço e retorno da Linha do Tempo;
  - Inspecionar a integridade das chaves de persistência no `localStorage`.

### 8.3. Matriz de Permissões

| Recurso / Funcionalidade | Cliente Final | Avaliador / Auditor Técnico |
| :--- | :---: | :---: |
| Navegação no Cardápio por Categoria | Permitido | Permitido |
| Seleção de Filial e Validação de Estoque | Permitido | Permitido |
| Gestão do Carrinho e Resgate de Fidelidade | Permitido | Permitido |
| Consentimento LGPD e Identificação | Permitido | Permitido |
| Disparo do Modal de Checkout Mock | Permitido | Permitido |
| Acompanhamento da Linha do Tempo | Permitido | Permitido |
| Uso do Seletor Multicanal (App/Totem/Web) | Disponível na Interface | Permitido |
| Acionamento do Modo Wireframe | Disponível na Interface | Permitido |
| Forçar Aprovação / Recusa no Gateway Mock | Permitido no Simulador | Permitido no Simulador |
| Controle Manual de Etapas do Stepper | Opcional | Permitido |

---

## 9. Recursos Estruturais do Sistema

### 9.1. Persistência Local Desacoplada e Fallback em Memória
- **Objetivo:** Garantir a retenção de dados durante a sessão de compra sem necessidade de banco de dados centralizado.
- **Comportamento e Contingência:** A camada de armazenamento `storage.js` isola o acesso a `window.localStorage`, aplicando serialização (`JSON.stringify`) e desserialização (`JSON.parse`) com blocos defensivos `try/catch`. Caso o armazenamento local esteja bloqueado por políticas de privacidade estrita do navegador ou ocorra `QuotaExceededError`, o módulo `storage.js` ativa automaticamente um armazenamento volátil transparente em memória (`memoryStore = {}`), preservando as operações de `getItem`, `setItem` e `removeItem` sem interromper a navegação do usuário.

### 9.2. Mecanismo de Dados Simulados (Mock Data Engine)
- **Objetivo:** Fornecer dados consistentes e realistas sobre a rede gastronômica "Raízes do Nordeste".
- **Comportamento:** O arquivo `mockData.js` exporta estruturas imutáveis contendo filiais, categorias, pratos regionais com matriz de disponibilidade por unidade, regras de conversão de fidelidade e dados do cliente pré-carregado.

### 9.3. Responsividade Dinâmica por Manipulação de Viewport
- **Objetivo:** Comprovar a adaptabilidade multicanal do front-end sem recarregar a página ou exigir múltiplos arquivos HTML.
- **Comportamento:** O módulo `channelController.js` aplica e remove classes utilitárias no elemento container principal (`#app-container`), alternando restrições de largura, tamanhos de fonte e dimensões mínimas de botões para demonstrar o comportamento em App, Totem e Web.

### 9.4. Modo Wireframe Estrutural
- **Objetivo:** Possibilitar a extração imediata de telas em baixa fidelidade para auditoria de usabilidade e documentação acadêmica.
- **Comportamento:** O módulo `wireframeController.js` alterna a classe `.wireframe-mode` no `<body>`, ativando regras CSS que forçam escala de cinza, desabilitam cores de fundo vivas, mascaram fotos e inserem contornos tracejados.

### 9.5. Validação Declarativa e Acessível de Formulários
- **Objetivo:** Prevenir envios incorretos e assegurar conformidade com critérios de acessibilidade (WCAG AA).
- **Comportamento:** A validação ocorre em tempo real nos eventos de digitação (`input`) e perda de foco (`blur`), além do clique de submissão. Erros não utilizam apenas variações de cor: são obrigatoriamente associados a textos explicativos posicionados abaixo de cada campo.

---

## 10. Entidades do Sistema

### 10.1. Filial (Unidade da Franquia)
- **Finalidade:** Representa um ponto físico de venda da rede onde o cliente retirará o pedido.
- **Atributos:**
  - `id` (String): Identificador único (ex.: `"recife-antigo"`, `"boa-viagem"`, `"olinda"`).
  - `nome` (String): Nome fantasia da unidade (ex.: `"Recife Antigo - Matriz"`).
  - `endereco` (String): Localização física resumida.
  - `horario` (String): Faixa de funcionamento diário.
  - `tempo_estimado` (String): Tempo médio de espera no balcão (ex.: `"15-20 min"`).
  - `status` (String): Situação operacional (`"aberta"` ou `"fechada"`).

### 10.2. Categoria Gastronômica
- **Finalidade:** Agrupa os pratos do cardápio em segmentos culinários regionais para navegação e filtragem rápida.
- **Atributos:**
  - `id` (String): Identificador da categoria (ex.: `"todos"`, `"cuscuz"`, `"tapioca"`, `"tradicional"`, `"bebida"`, `"sobremesa"`).
  - `nome` (String): Título legível da categoria (ex.: `"Cuscuz da Casa"`).
  - `ordem` (Number): Prioridade de ordenação na barra de filtros.

### 10.3. Produto (Prato Típico Regional)
- **Finalidade:** Representa os itens comercializados no cardápio gastronômico.
- **Atributos:**
  - `id` (String): Identificador único do prato (ex.: `"cuscuz-completo"`).
  - `nome` (String): Denominação sertaneja do prato.
  - `categoria_id` (String): Referência à entidade Categoria.
  - `descricao` (String): Lista de ingredientes e características sensoriais.
  - `preco` (Number): Valor unitário de venda em moeda corrente (BRL).
  - `imagem` (String): Caminho relativo da imagem ilustrativa.
  - `badge_destaque` (String|null): Texto de realce promocional (ex.: `"★ TRADIÇÃO DA CASA"`).
  - `disponibilidade` (Objeto): Mapeamento chave-valor contendo o `id` da filial como chave e um booleano (`true`/`false`) indicando estoque físico.

### 10.4. Item do Carrinho
- **Finalidade:** Representa a instância de um produto selecionado pelo usuário na sacola de compras.
- **Atributos:**
  - `produto_id` (String): Identificador do prato referenciado.
  - `nome` (String): Nome do prato copiado para integridade visual.
  - `preco_unitario` (Number): Preço unitário no momento da inclusão.
  - `quantidade` (Number): Número de unidades selecionadas (mínimo 1, máximo 99).
  - `subtotal` (Number): Resultado de `preco_unitario * quantidade`.

### 10.5. Carrinho de Compras
- **Finalidade:** Agrega os itens selecionados, a unidade de retirada e os parâmetros de desconto antes do checkout.
- **Atributos:**
  - `filial_id` (String): ID da filial selecionada para retirada.
  - `itens` (Array de Itens do Carrinho): Lista de produtos adicionados.
  - `subtotal` (Number): Soma dos subtotais de todos os itens.
  - `pontos_resgatados` (Number): Quantidade de pontos de fidelidade aplicados.
  - `valor_desconto` (Number): Valor monetário deduzido pelo resgate de fidelidade.
  - `total` (Number): Valor final a ser pago (`subtotal - valor_desconto`).
  - `consentimento_lgpd` (Boolean): Situação do aceite dos termos de privacidade.

### 10.6. Cliente Simulado (Sessão Local)
- **Finalidade:** Simula os dados cadastrais do cliente fidelizado para teste de resgate de pontos e preenchimento de contato.
- **Atributos:**
  - `id` (String): Identificador único do cliente.
  - `nome` (String): Nome padrão inicial (ex.: `"Severino da Silva"`).
  - `telefone` (String): Celular formatado (ex.: `"(81) 98765-4321"`).
  - `saldo_pontos` (Number): Saldo acumulado no programa (ex.: `150`).

### 10.7. Pedido (Ordem de Produção)
- **Finalidade:** Registra o pedido concluído após a aprovação no gateway mockado.
- **Atributos:**
  - `id` (String): Código único do pedido (ex.: `"RN-20261029-01"`).
  - `numero_sequencial` (String): Número simplificado para chamada no balcão (ex.: `"#1042"`).
  - `data_hora` (String): Timestamp em formato ISO 8601.
  - `filial` (Objeto): Dados da filial selecionada (`id` e `nome`).
  - `cliente` (Objeto): Nome e telefone do cliente.
  - `itens` (Array): Cópia dos itens adquiridos.
  - `subtotal` (Number): Valor total dos produtos sem desconto.
  - `desconto_fidelidade` (Number): Valor deduzido via pontos.
  - `total_pago` (Number): Valor final liquidado.
  - `forma_pagamento` (String): Método selecionado (`"PIX"`, `"Cartão"`, etc.).
  - `status_transacao` (String): `"Aprovado"` ou `"Recusado"`.
  - `status_preparo` (String): `"Recebido"`, `"Em Preparo"` ou `"Pronto"`.

---

## 11. Modelo de Dados Proposto

### 11.1. Estruturas JSON Estáticas (`mockData.js`)

O arquivo `mockData.js` contém a base imutável de dados da aplicação:

```javascript
export const MOCK_DATA = {
  filiais: [
    {
      id: "recife-antigo",
      nome: "Recife Antigo - Matriz",
      endereco: "Rua do Bom Jesus, 120, Recife - PE",
      horario: "11:00 às 22:00",
      tempo_estimado: "15-20 min",
      status: "aberta"
    },
    {
      id: "boa-viagem",
      nome: "Boa Viagem - Orla",
      endereco: "Av. Boa Viagem, 3400, Recife - PE",
      horario: "12:00 às 23:00",
      tempo_estimado: "20-25 min",
      status: "aberta"
    },
    {
      id: "olinda",
      nome: "Olinda - Sítio Histórico",
      endereco: "Rua do Amparo, 45, Olinda - PE",
      horario: "11:30 às 21:00",
      tempo_estimado: "15-20 min",
      status: "aberta"
    }
  ],

  categorias: [
    { id: "todos", nome: "Todos os Pratos", ordem: 1 },
    { id: "cuscuz", nome: "Cuscuz da Casa", ordem: 2 },
    { id: "tapioca", nome: "Tapiocas & Queijo", ordem: 3 },
    { id: "tradicional", nome: "Pratos Sertanejos", ordem: 4 },
    { id: "bebida", nome: "Bebidas Regionais", ordem: 5 },
    { id: "sobremesa", nome: "Sobremesas", ordem: 6 }
  ],

  cardapio: [
    {
      id: "cuscuz-completo",
      nome: "Cuscuz Brasa com Carne de Sol",
      categoria: "cuscuz",
      descricao: "Massa de milho flocada no vapor, recheada com carne de sol desfiada e queijo coalho tostado.",
      preco: 24.90,
      imagem: "assets/img/cuscuz-carne-sol.webp",
      badge_destaque: "★ TRADIÇÃO DA CASA",
      disponibilidade: {
        "recife-antigo": true,
        "boa-viagem": true,
        "olinda": false // Esgotado em Olinda para validação do requisito
      }
    },
    {
      id: "tapioca-rendada",
      nome: "Tapioca Rendada Sertaneja",
      categoria: "tapioca",
      descricao: "Massa fininha e crocante com crosta externa de queijo coalho e manteiga de garrafa.",
      preco: 18.50,
      imagem: "assets/img/tapioca-rendada.webp",
      badge_destaque: "★ MAIS PEDIDO",
      disponibilidade: {
        "recife-antigo": true,
        "boa-viagem": true,
        "olinda": true
      }
    },
    {
      id: "baiao-dois",
      nome: "Baião de Dois Raízes",
      categoria: "tradicional",
      descricao: "Arroz da terra, feijão fradinho, toucinho crocante, queijo coalho em cubos e coentro fresco.",
      preco: 36.00,
      imagem: "assets/img/baiao-dois.webp",
      badge_destaque: "★ COMBINADO REGIONAL",
      disponibilidade: {
        "recife-antigo": true,
        "boa-viagem": false, // Esgotado em Boa Viagem para validação
        "olinda": true
      }
    },
    {
      id: "suco-caja",
      nome: "Suco Natural de Cajá (500ml)",
      categoria: "bebida",
      descricao: "Polpa fresca de cajá do sertão, bem gelada e adoçada suavemente.",
      preco: 9.00,
      imagem: "assets/img/suco-caja.webp",
      badge_destaque: null,
      disponibilidade: {
        "recife-antigo": true,
        "boa-viagem": true,
        "olinda": true
      }
    },
    {
      id: "bolo-rolo",
      nome: "Bolo de Rolo Tradicional com Sorvete",
      categoria: "sobremesa",
      descricao: "Camadas ultrafinas com doce de goiabada cremosa, servido com sorvete de queijo.",
      preco: 16.00,
      imagem: "assets/img/bolo-rolo.webp",
      badge_destaque: "★ DOÇURA DA SERRA",
      disponibilidade: {
        "recife-antigo": true,
        "boa-viagem": true,
        "olinda": true
      }
    }
  ],

  fidelidade_padrao: {
    pontos_por_real_desconto: 10,
    saldo_inicial_cliente: 150
  }
};
```

### 11.2. Mapeamento e Esquemas no Web Storage (`localStorage`)

Para garantir conformidade com as diretrizes do `DECISOES_TECNICAS.md` e, simultaneamente, aplicar boas práticas de engenharia web (evitando colisões de chaves no `localStorage` em ambientes compartilhados como `localhost` e GitHub Pages), as quatro chaves contratuais são encapsuladas com o prefixo institucional `rn_` através do módulo de configuração `config/config.js`:

| Chave no `DECISOES_TECNICAS.md` | Chave Padronizada no FSD (`config.js`) | Finalidade Operacional |
| :--- | :--- | :--- |
| `lgpd_consentimento` | `rn_lgpd_consentimento` | Armazena data/hora e aceite booleano de cookies e privacidade. |
| `carrinho_atual` | `rn_carrinho_atual` | Retém filial, itens selecionados, pontos e totais calculados. |
| `cliente_sessao` | `rn_cliente_sessao` | Retém identificação ativa do cliente e saldo de fidelidade. |
| `historico_pedidos` | `rn_historico_pedidos` | Registra a lista de pedidos aprovados para exibição na linha do tempo. |

#### Esquemas Estruturais em JSON:

1. **`rn_lgpd_consentimento`:**
   ```json
   {
     "data_hora": "2026-10-29T10:00:00.000Z",
     "versao": "1.0",
     "cookies_aceitos": true
   }
   ```

2. **`rn_carrinho_atual`:**
   ```json
   {
     "filial_id": "recife-antigo",
     "itens": [
       {
         "produto_id": "cuscuz-completo",
         "nome": "Cuscuz Brasa com Carne de Sol",
         "preco_unitario": 24.90,
         "quantidade": 1,
         "subtotal": 24.90
       }
     ],
     "subtotal": 24.90,
     "pontos_usados": 150,
     "valor_desconto": 15.00,
     "total": 9.90,
     "consentimento_lgpd": true
   }
   ```

3. **`rn_cliente_sessao`:**
   ```json
   {
     "id": "cli-01",
     "nome": "Severino da Silva",
     "telefone": "(81) 98765-4321",
     "saldo_pontos": 150
   }
   ```

4. **`rn_historico_pedidos`:**
   ```json
   [
     {
       "id": "RN-20261029-01",
       "numero_sequencial": "#1042",
       "data_hora": "2026-10-29T10:15:30.000Z",
       "filial": {
         "id": "recife-antigo",
         "nome": "Recife Antigo - Matriz"
       },
       "cliente": {
         "nome": "Severino da Silva",
         "telefone": "(81) 98765-4321"
       },
       "itens": [
         {
           "produto_id": "cuscuz-completo",
           "nome": "Cuscuz Brasa com Carne de Sol",
           "preco_unitario": 24.90,
           "quantidade": 1,
           "subtotal": 24.90
         }
       ],
       "subtotal": 24.90,
       "desconto_fidelidade": 15.00,
       "total_pago": 9.90,
       "forma_pagamento": "PIX",
       "status_transacao": "Aprovado",
       "status_preparo": "Recebido"
     }
   ]
   ```

### 11.3. Modelagem de Dados no Front-End e Integridade Local

Em conformidade estrita com o escopo front-end Zero-Build, o gerenciamento de integridade e relacionamentos é operado pelo JavaScript no cliente:

1. **Relacionamentos em Memória:**
   - A relação `Categoria (1:N) Produto` é resolvida via atributo `categoria` do prato comparado ao `id` da categoria em `mockData.js`.
   - A relação `Filial (N:M) Produto` (estoque) é resolvida consultando o objeto booleano `disponibilidade[filialId]` em tempo real.
   - A relação `Pedido (1:N) Itens` é serializada como um array de subobjetos autocontidos dentro de cada registro no histórico, preservando os preços e descrições históricos no momento da compra.
2. **Auditoria e Rastreabilidade no Navegador:**
   - Cada pedido aprovado inclui carimbo de data/hora (`ISO 8601`), identificador único gerado pelo front-end e identificação do cliente.
   - O consentimento da LGPD possui timestamp próprio gravado no momento da interação.
3. **Mecanismo de Desabilitação Suave ("Soft Disable"):**
   - Produtos indisponíveis na filial ativa não são expurgados do array de dados nem ocultados do DOM; a View aplica o padrão visual de desabilitação suave (opacidade e bloqueio de botão), garantindo previsibilidade visual ao usuário.

### 11.4. Estratégia de Migrations e Inicialização Idempotente

1. **Controle de Versão de Schema:** É gravada a chave `rn_schema_version: "1.0.0"` no `localStorage`.
2. **Inicialização Idempotente (Seed):** Ao carregar a página, a rotina `initStorage()` em `storage.js` verifica se a versão do schema já foi aplicada. Caso positivo, não sobrescreve os dados existentes do usuário; caso contrário, semeia as chaves básicas a partir de `mockData.js`.
3. **Mecanismo Anti-Duplicação:** A execução da carga inicial ocorre uma única vez, prevenindo perdas de carrinho ou de histórico em recarregamentos de página (*F5*).
4. **Proteção:** As migrations no front-end são puramente operadas em código interno (`storage.js`), sem exposição de URLs ou scripts abertos.

---

## 12. Módulos e Telas

### 12.1. Barra de Controles Superiores (Simulador & Auditoria)
- **Objetivo:** Permitir ao usuário ou auditor alternar entre resoluções multicanal e acionar o Modo Wireframe.
- **Componentes:**
  - Grupo de botões segmentados com ícones: *App Mobile* (smartphone), *Totem Autoatendimento* (terminal vertical) e *Web Desktop* (monitor).
  - Botão de alternância *Modo Wireframe* (ícone de grade/esboço) com estado ativo destacado.
- **Estados:** Botão do canal ativo recebe fundo e cor de destaque.

### 12.2. Cabeçalho Institucional e Ticker Marquee
- **Objetivo:** Identificar a marca "Raízes do Nordeste", exibir a filial selecionada e prover acesso rápido à sacola.
- **Componentes:**
  - Logotipo institucional e título com tipografia rústica neo-brutalista.
  - Seletor suspenso da filial ativa exibindo o nome da loja atual.
  - Botão de Sacola com badge numérico em relevo 3D indicando a contagem total de itens.
  - **Ticker Marquee (Elemento Cosmético Opcional):** Faixa contínua animada com fundo Marrom Café Profundo (`#3A0E03`) e texto Ouro Sertanejo (`#C9962E`) com divisores `★`:  
    `★ CUSCUZ RECHEADO ★ TAPIOCA COM CARNE DE SOL ★ BAIÃO DE DOIS ★ BOLO DE ROLO ★ SUCO DE CAJÁ ★ QUEIJO COALHO TOSTADO ★`. Trata-se de um aprimoramento visual temático sem dependência lógica de negócio.

### 12.3. Seção de Seleção de Filiais
- **Objetivo:** Apresentar as unidades disponíveis da rede e permitir a escolha da loja de retirada.
- **Componentes:**
  - Três cards estruturados com o efeito de costura artesanal em borda tracejada (`.stitch`).
  - Cada card exibe: Nome da filial, endereço físico, horário e tempo médio estimado de preparo.
  - Selo visual `★ LOJA SELECIONADA` no card da unidade ativa.

### 12.4. Seção de Cardápio e Filtro por Categorias
- **Objetivo:** Exibir os pratos sertanejos e refletir a disponibilidade de estoque da filial ativa.
- **Componentes e Proteção Visual:**
  - Barra de filtros horizontais tipo pílula (*chips*) para alternar categorias gastronômicas.
  - Grid de produtos adaptativo (1 coluna no mobile, 2 no totem, 3 no desktop).
  - Cards de pratos contendo: Imagem recortada (com fallback em SVG temático inline caso a imagem `.webp` não carregue), badge de destaque (`★`), título, descrição e preço.
  - **Estado Disponível:** Botão primário "+ Adicionar" habilitado com elevação física 3D (`box-shadow: 0 4px 0 #3A0E03`).
  - **Estado Esgotado:** Card com filtro visual opaco/cinza, badge vermelho/cinza `INDISPONÍVEL NESTA FILIAL`, botão "+ Adicionar" com atributo `disabled` e cursor bloqueado.

### 12.5. Sacola de Compras (Drawer / Painel Lateral)
- **Objetivo:** Exibir os itens selecionados, gerenciar quantidades e aplicar o programa de fidelidade.
- **Componentes:**
  - Lista de itens com foto miniatura, título, preço unitário, botões de incremento/decremento (`-` e `+`) e botão de exclusão.
  - **Painel "Nordeste Pontos":** Card estilizado informando o saldo do cliente simulado (ex.: 150 pontos) e um controle de seleção para abater R$ 15,00 do total.
  - Resumo de valores discriminando: Subtotal, Desconto de Fidelidade e Total Geral.
  - Botão primário destacado: "Avançar para Identificação e Pagamento".

### 12.6. Formulário de Identificação e Consentimento LGPD
- **Objetivo:** Coletar os dados de contato do cliente com validação visual e garantir o consentimento legal.
- **Componentes:**
  - Campo *Nome Completo* com texto de ajuda para validação.
  - Campo *Telefone Celular / WhatsApp* com formatação dinâmica nativa.
  - Checkbox obrigatório de consentimento com texto explícito de conformidade com a LGPD.
  - Botão de avanço que permanece bloqueado até o preenchimento válido e aceite dos termos.

### 12.7. Modal Mock de Gateway de Pagamento
- **Objetivo:** Simular a transação externa de pagamento com validação de cenários de sucesso e erro.
- **Componentes:**
  - Seleção de método (PIX, Crédito, Débito, Balcão).
  - Bloco de comandos de teste do gateway:
    - Botão "Forçar Aprovação" (Sucesso): aciona feedback em Verde Macaxeira (`#25D366`), gera o número do pedido e encaminha à Linha do Tempo.
    - Botão "Forçar Recusa" (Erro): aciona feedback em Vermelho Erro (`#BA1A1A`), exibe alerta de transação negada e disponibiliza botão de "Tentar Novamente".

### 12.8. Linha do Tempo do Pedido (Stepper)
- **Objetivo:** Rastrear a evolução do pedido na cozinha da filial.
- **Componentes:**
  - Cabeçalho com número do pedido (`#RN-1042`), filial de retirada e horário estimado.
  - Stepper visual com 3 etapas:
    1. *Pedido Recebido* (ícone de prancheta/pedido);
    2. *Em Preparo* (ícone de forno/panela);
    3. *Pronto para Retirada* (ícone de sacola pronta / balcão).
  - **Controles de Etapa:** Botões de demonstração (*Avançar Etapa* e *Voltar Etapa*) acompanhados de avanço automático temporizado de 4 segundos.
  - Botão para iniciar novo pedido (reset seguro do carrinho).

### 12.9. Banner Inferior de Cookies
- **Objetivo:** Notificar o uso de armazenamento local para conformidade inicial com a LGPD.
- **Componentes:**
  - Faixa inferior flutuante com texto explicativo e botão "Aceitar e Fechar".

---

## 13. Fluxos Funcionais

### 13.1. Fluxo 1: Alternância de Canais e Modo Wireframe
- **Perfil:** Cliente ou Avaliador Técnico.
- **Pré-condições:** Aplicação carregada no navegador.
- **Passo a Passo:**
  1. O usuário clica no botão "Totem Autoatendimento" na barra de controle superior.
  2. O módulo `channelController.js` substitui as classes do container `#app-container`, aplicando proporção vertical 1080x1920 e garantindo alvos de toque com altura mínima de 48px.
  3. O usuário clica no botão "Modo Wireframe".
  4. O módulo `wireframeController.js` injeta a classe `.wireframe-mode` no `<body>`.
- **Resultado Esperado:** A interface assume layout de totem e estética monocromática em escala de cinza com bordas tracejadas.

### 13.2. Fluxo 2: Seleção de Filial e Atualização de Estoque
- **Perfil:** Cliente.
- **Pré-condições:** Aplicação aberta.
- **Passo a Passo:**
  1. O usuário localiza a seção de filiais e clica em "Olinda - Sítio Histórico".
  2. O módulo `branchController.js` atualiza a filial ativa na memória e no `localStorage`.
  3. O módulo `menuController.js` reprocessa o cardápio comparando a matriz de estoque da filial escolhida.
- **Resultado Esperado:** O prato "Cuscuz Brasa com Carne de Sol", que está esgotado em Olinda, recebe badge visual de indisponível e seu botão "+ Adicionar" é desabilitado instantaneamente.

### 13.3. Fluxo 3: Montagem da Sacola de Compras
- **Perfil:** Cliente.
- **Pré-condições:** Filial selecionada e prato com status disponível.
- **Passo a Passo:**
  1. O usuário clica em "+ Adicionar" no prato "Tapioca Rendada Sertaneja" (R$ 18,50).
  2. O módulo `cartController.js` verifica que o item não existia na sacola e o insere com quantidade 1.
  3. O contador da sacola no topo da página é incrementado para "1".
  4. O usuário clica novamente em "+ Adicionar" no mesmo prato.
  5. A quantidade é atualizada para 2 e o subtotal do item passa para R$ 37,00.
- **Resultado Esperado:** A sacola reflete com precisão os itens, quantidades e subtotais.

### 13.4. Fluxo 4: Resgate de Pontos de Fidelidade
- **Perfil:** Cliente.
- **Pré-condições:** Sacola contendo itens e saldo de fidelidade disponível.
- **Passo a Passo:**
  1. O usuário abre a sacola de compras e visualiza o painel "Nordeste Pontos" com saldo de 150 pontos.
  2. O usuário marca a opção "Usar 150 pontos para obter R$ 15,00 de desconto".
  3. O módulo `cartController.js` valida o saldo, calcula o abatimento e subtrai R$ 15,00 do valor total da compra.
- **Resultado Esperado:** O resumo financeiro exibe a linha destacada "- R$ 15,00 (Fidelidade)" e o total geral é recalculado.

### 13.5. Fluxo 5: Identificação e Consentimento LGPD
- **Perfil:** Cliente.
- **Pré-condições:** Sacola com ao menos 1 item e valor total calculado.
- **Passo a Passo:**
  1. O usuário clica em "Avançar para Pagamento".
  2. O sistema exibe o formulário de identificação e o checkbox de privacidade.
  3. O usuário digita "Maria Bonita" no campo Nome e "(81) 99888-7766" no Telefone.
  4. O usuário tenta prosseguir sem marcar o checkbox da LGPD.
  5. O sistema bloqueia a ação, aplica contorno vermelho (`border-[#BA1A1A]`) no checkbox e exibe mensagem: *"É obrigatório aceitar os termos de privacidade para gerar o pedido."*
  6. O usuário marca o checkbox.
- **Resultado Esperado:** A validação é satisfeita, o timestamp de aceite é gravado e o botão de pagamento é liberado.

### 13.6. Fluxo 6: Simulação de Pagamento com Aprovação (Sucesso)
- **Perfil:** Cliente ou Avaliador Técnico.
- **Pré-condições:** Dados de identificação válidos e LGPD aceita.
- **Passo a Passo:**
  1. O usuário seleciona o método "PIX" e clica em "Pagar Agora".
  2. O modal de simulação do gateway se abre, exibindo QR Code mockado e botões de comando do teste.
  3. O usuário clica no botão "Forçar Aprovação".
  4. O modal transiciona para a cor Verde Macaxeira (`#25D366`), exibe ícone de checkmark e a mensagem *"Pagamento Aprovado com Sucesso!"*.
  5. O pedido é gerado sob o código `#RN-1042`, gravado no `localStorage` em `rn_historico_pedidos`, e a sacola ativa é limpa.
  6. Após 1,5 segundo, a tela transiciona automaticamente para a Linha do Tempo.
- **Resultado Esperado:** Pedido liquidado com sucesso e exibição da linha do tempo na etapa *Pedido Recebido*.

### 13.7. Fluxo 7: Simulação de Pagamento com Recusa (Erro e Retentativa)
- **Perfil:** Cliente ou Avaliador Técnico.
- **Pré-condições:** Modal de pagamento aberto.
- **Passo a Passo:**
  1. O usuário clica no botão de teste "Forçar Recusa".
  2. O modal transiciona para a cor Vermelho Erro (`#BA1A1A`), exibe ícone de cruz e a mensagem *"Transação Não Autorizada pela Operadora"*.
  3. O sistema exibe o botão "Tentar Novamente".
  4. O usuário clica em "Tentar Novamente".
- **Resultado Esperado:** O modal retorna ao estado de seleção de forma de pagamento, mantendo intactos todos os itens e descontos da sacola.

---

## 14. Validações e Regras de Negócio

### 14.1. Regras de Estoque e Disponibilidade
- **Bloqueio por Unidade:** A disponibilidade de um produto é rigidamente atrelada à filial ativa. Se o valor na matriz de disponibilidade for `false`, o card do prato deve obrigatoriamente desabilitar o botão "+ Adicionar" (`disabled`, `cursor-not-allowed`) e receber opacidade reduzida a 50%.
- **Troca de Filial com Carrinho Ativo:** Se o cliente possuir itens na sacola e trocar para uma filial onde algum desses itens esteja esgotado, o sistema alerta o usuário através de um modal ou toast de aviso, remove o item indisponível da sacola e recalcula os totais imediatamente.

### 14.2. Regras de Sacola e Quantidades
- **Quantidade Mínima:** A quantidade de qualquer item inserido é no mínimo 1. Ao clicar no botão `-` em um item com quantidade 1, o sistema remove o produto da sacola.
- **Quantidade Máxima por Item:** Limitada defensivamente a 99 unidades por produto para evitar inconsistências visuais na interface.
- **Bloqueio de Carrinho Vazio:** O botão de checkout permanece bloqueado enquanto a sacola contiver zero itens.

### 14.3. Regras do Programa de Fidelidade
- **Taxa de Conversão:** 10 pontos de fidelidade equivalem a R$ 1,00 de desconto no valor total da compra.
- **Saldo Máximo Resgatável:** O desconto de pontos não pode ultrapassar o saldo atual do cliente nem gerar um total final negativo. Caso o subtotal seja menor que o desconto, o valor total é limitado a `R$ 0,00`.

### 14.4. Regras de Identificação e LGPD
- **Validação de Nome:** Obrigatório, com no mínimo 3 caracteres alfabéticos.
- **Validação de Telefone:** Obrigatório, exigindo preenchimento de DDD (2 dígitos) e número de celular (8 ou 9 dígitos), com máscara dinâmica formatada em Vanilla JS.
- **Consentimento Estrito:** A marcação do checkbox de conformidade da LGPD é pré-requisito indispensável para a conclusão da compra. Não é permitido criar pedidos sem o aceite explícito.

### 14.5. Regras de Transição de Status do Pedido
- **Mecanismo Temporizado:** A linha do tempo avança automaticamente do status *Pedido Recebido* para *Em Preparo* em 4 segundos e para *Pronto para Retirada* após mais 4 segundos.
- **Controle Manual de Demonstração:** Para permitir ao avaliador acadêmico testar e fotografar cada etapa no seu próprio tempo, o componente de stepper disponibiliza botões discretos de controle (*Avançar Etapa* e *Voltar Etapa*), permitindo pausar e navegar livremente entre os três estados.

---

## 15. Autenticação e Sessão

### 15.1. Natureza da Autenticação
Por se tratar de um simulador de frente de caixa e autoatendimento voltado exclusivamente ao fluxo do consumidor final (e em concordância estrita com a ausência de infraestrutura de back-end), o sistema **não adota autenticação tradicional baseada em senhas, criptografia assimétrica, OAuth2 ou tokens JWT**.

### 15.2. Gerenciamento de Sessão Simulada no Front-End
A sessão do usuário é gerenciada localmente via Web Storage API através da chave `rn_cliente_sessao`:
- Ao iniciar a aplicação, caso não haja cliente gravado, o sistema instancia um cliente padrão simulado (*"Severino da Silva"*, com saldo de 150 pontos).
- Os dados digitados no formulário de identificação (*Nome* e *Telefone*) atualizam essa sessão local em tempo real, permitindo que a personalização do cliente persista durante a navegação.
- Não há expiração abrupta de sessão por tempo, preservando a comodidade de testes do avaliador acadêmico.

---

## 16. Controle de Acesso

### 16.1. Acesso Unificado no Client-Side
O sistema não possui telas administrativas secretas de retaguarda. Todos os recursos estão disponíveis de forma transparente na interface unificada, respeitando o princípio de um simulador autônomo.

### 16.2. Proteção de Ações e Estados por Regras de Interface
- **Bloqueio de Checkout sem Itens:** O avanço de tela é protegido contra cliques acidentais caso a sacola esteja vazia.
- **Bloqueio de Pagamento sem Identificação:** A chamada do modal de pagamento é interceptada e bloqueada pelo `checkoutController.js` se os campos de identificação ou o checkbox de LGPD não estiverem validados.
- **Proteção do DOM contra Entradas Nulas:** Todos os elementos interativos possuem validações defensivas no JavaScript para evitar erros do tipo `null reference` caso o usuário force ações no console do navegador.

---

## 17. Auditoria e Histórico

### 17.1. Histórico de Pedidos Realizados
Todas as transações concluídas com sucesso no gateway mockado são auditadas e persistidas na chave `rn_historico_pedidos` do `localStorage`. Cada registro armazena:
- Identificador único e número do pedido;
- Timestamp de criação em formato ISO 8601;
- Filial de retirada selecionada;
- Nome e telefone informados pelo cliente;
- Relação completa de itens adquiridos (nome, quantidade e preço unitário);
- Discriminativo financeiro: subtotal, pontos de fidelidade resgatados, desconto e total pago;
- Forma de pagamento e status da transação.

### 17.2. Auditoria do Consentimento LGPD
O registro de consentimento dos termos de privacidade e cookies armazena:
- Data e hora exatas da concordância;
- Versão dos termos aceitos (`"1.0"`);
- Confirmação booleana do aceite.

Esses registros garantem que o sistema comprove, perante auditorias de conformidade legal, que o usuário expressou concordância antes da gravação de seus dados de contato.

---

## 18. Soft Delete e Exclusões

### 18.1. Remoção de Itens da Sacola
- A exclusão de um item da sacola ativa ocorre por remoção física imediata da lista em memória, seguida de regravação no `localStorage` e recálculo instantâneo dos totais.

### 18.2. Reset de Sessão e Pedido Concluído
- Após a aprovação do pagamento, o carrinho ativo é zerado para permitir uma nova jornada de compra.
- Os pedidos gravados no histórico (`rn_historico_pedidos`) são mantidos e não sofrem exclusão automática, assegurando que o pedido recém-concluído continue acessível na Linha do Tempo mesmo após atualizações de página.

### 18.3. Tratamento de Produtos Esgotados ("Soft Disable")
- Produtos com estoque zerado na filial selecionada não são excluídos ou ocultados da interface. Eles permanecem visíveis, porém em estado inativo ("soft disable"), com redução de opacidade e bloqueio no botão de compra. Essa prática de UX garante previsibilidade ao cliente, que compreende a existência do prato na rede mesmo que temporariamente indisponível na unidade ativa.

---

## 19. Logs

### 19.1. Log de Erros e Contingência de Armazenamento
- **Captura no Front-End:** Todos os métodos assíncronos e operações de acesso ao `localStorage` são envolvidos em estruturas defensivas `try/catch`.
- **Tratamento de Exceções e MemoryStore:** Caso ocorra uma falha de armazenamento (ex.: `QuotaExceededError` no navegador ou navegação anônima com restrição), o erro é registrado no console com `console.error` estruturado e a camada `storage.js` chaveia a operação para um dicionário volátil em memória (`memoryStore = {}`). O usuário recebe um toast informativo na tela e continua navegando perfeitamente durante a sessão.
- **Mensagens Seguras ao Usuário:** Usuários nunca são expostos a detalhes técnicos de pilhas de erro (*stack traces*) na interface.

### 19.2. Log de Segurança e Validação
- **Eventos Monitorados:** O sistema registra no console de desenvolvedor eventos significativos de validação:
  - Tentativas de avanço de checkout com formulário incompleto;
  - Tentativas de acréscimo de pratos esgotados;
  - Acionamento das ações de forçar aprovação ou recusa do gateway mockado;
  - Disparo de alternância de canais e do Modo Wireframe.

---

## 20. Configurações Globais

### 20.1. Estratégia de Configuração em Código JavaScript
O projeto não utiliza arquivos `.env` para armazenamento de parâmetros ou configurações.

Por se tratar de uma aplicação front-end estrita executada no navegador, a presença de arquivos `.env` representaria um risco de segurança e má prática arquitetural, pois servidores web mal configurados podem expor esses arquivos como texto simples via URL pública.

A parametrização do sistema é concentrada no arquivo de código JavaScript:  
`config/config.js`

### 20.2. Parâmetros Definidos no `config.js`
```javascript
export const CONFIG = {
  app_nome: "Raízes do Nordeste",
  versao: "1.0.0",
  ambiente: "producao_local",
  
  // Chaves padronizadas de armazenamento no LocalStorage (com namespacing institucional rn_)
  storage_keys: {
    lgpd_consentimento: "rn_lgpd_consentimento",
    carrinho_atual: "rn_carrinho_atual",
    cliente_sessao: "rn_cliente_sessao",
    historico_pedidos: "rn_historico_pedidos",
    schema_version: "rn_schema_version"
  },
  
  // Parâmetros do Programa de Fidelidade
  fidelidade: {
    pontos_por_real: 10,
    saldo_padrao: 150
  },
  
  // Parâmetros de Usabilidade do Totem
  totem: {
    min_touch_target_px: 48,
    resolucao_proporcao: "9/16"
  },
  
  // Textos Regulatórios da LGPD
  lgpd: {
    versao_termos: "1.0",
    texto_cookies: "Utilizamos cookies e armazenamento local para viabilizar seus pedidos e personalizar benefícios de acordo com a LGPD.",
    texto_consentimento: "Li e concordo com os Termos de Privacidade e autorizo o tratamento dos meus dados para emissão do pedido e acúmulo de pontos de fidelidade."
  }
};
```

---

## 21. Uploads, Anexos e Arquivos

### 21.1. Delimitação Funcional
O recurso de upload ou envio de arquivos por parte dos usuários **não faz parte do escopo da primeira versão do sistema**.

### 21.2. Justificativa Técnica e de Segurança
O autoatendimento e frente de caixa fast-casual tem como premissa a simplicidade e a agilidade da compra. A inclusão de uploads aumentaria a superfície de vulnerabilidades (injeção de arquivos maliciosos) e demandaria infraestrutura de back-end com armazenamento em nuvem, o que viola o escopo arquitetural estabelecido para a SPA.

As imagens institucionais da marca (`logo.png` e `logo_branca.png`) são ativos visuais alocados na pasta `assets/img/`. Para os pratos do cardápio gastronômico, o sistema suporta arquivos de imagem estáticos (`.webp`) ou, caso não estejam fisicamente presentes no repositório, gera automaticamente ilustrações vetoriais/placeholders temáticos em SVG inline aderentes à paleta do *Warm Tactile Neo-Brutalism*, assegurando proteção contra falhas visuais via manipulador de erro `onerror`.

---

## 22. Relatórios, Consultas e Exportações

### 22.1. Delimitação Funcional
A primeira versão da aplicação **não contempla geração de relatórios gerenciais, relatórios fiscais ou exportações de arquivos em formatos CSV, PDF ou Excel**.

### 22.2. Consulta do Cliente
A consulta de pedidos é voltada unicamente à jornada do cliente e ao acompanhamento do pedido ativo na Linha do Tempo (stepper). O histórico gravado na chave `rn_historico_pedidos` do `localStorage` destina-se à auditoria de dados e à garantia de que o pedido ativo permaneça visível na Linha do Tempo mesmo caso o usuário recarregue a página (*F5*). A primeira versão não disponibiliza tela ou aba de consulta a múltiplos pedidos anteriores.

---

## 23. APIs e Integrações Externas

### 23.1. Delimitação Funcional
O sistema **não realiza integração com APIs REST externas, webhooks ou gateways de terceiros**.

### 23.2. Consumo Estritamente Mockado
O processamento de pagamentos bancários (PIX e cartões) é executado internamente por uma rotina mockada no arquivo `checkoutController.js`, permitindo ao avaliador acadêmico testar a transação com independência total de conexão de rede ou chaves de API pagas.

O único tráfego de rede gerado pela aplicação destina-se ao carregamento inicial das bibliotecas estáticas (Tailwind CSS, Lucide Icons e Google Fonts) através de CDNs públicas seguras e de alta disponibilidade.

---

## 24. Segurança Funcional

### 24.1. Prevenção contra Cross-Site Scripting (XSS)
Ao renderizar no DOM o nome e os dados informados pelo cliente, o sistema utiliza manipulação via `textContent` ou rotinas de escape de strings, prevenindo que entradas maliciosas contenham tags HTML ou scripts injetados.

### 24.2. Ausência de Credenciais Financeiras
O simulador de pagamento mockado não coleta nem armazena números reais de cartão de crédito, códigos de segurança (CVV) ou senhas bancárias. O usuário apenas seleciona o método desejado e aciona o teste de aprovação ou recusa.

### 24.3. Limitação de Entradas e Sanitização
- Entradas numéricas de quantidade são sanitizadas para números inteiros positivos (`Math.max(1, parseInt(qtd))`).
- Entradas de texto recebem tratamento com `.trim()` para eliminação de espaços ociosos.
- Parâmetros do seletor multicanal são validados contra uma lista de canais válidos (`['app', 'totem', 'web']`), prevenindo injeções de classes arbitrárias no container raiz.

---

## 25. Organização Sugerida da Implementação

Para orientar a IA codificadora e os desenvolvedores de forma segura, progressiva e testável, a implementação do projeto é organizada nas seguintes 24 etapas sequenciais:

1. **Preparação da Raiz do Repositório (`./`):** Organização física com as pastas estruturais (`config/`, `assets/`, `js/`, `docs/`).
2. **Criação do Arquivo de Configuração:** Implementação do arquivo de configuração estática `config/config.js` sem uso de `.env`.
3. **Estrutura Base HTML5:** Criação do arquivo `index.html` com marcação semântica, meta tags de viewport e importação dos CDNs (Tailwind CSS, Lucide Icons, Google Fonts).
4. **Configuração de Estilos e Tema:** Configuração inline do Tailwind no `index.html` com a paleta "Warm Tactile Neo-Brutalism" e criação do `assets/css/custom.css` com estilos do Modo Wireframe e efeito `.stitch`.
5. **Implementação dos Dados Simulados:** Criação de `js/models/mockData.js` contendo filiais, categorias, cardápio com matriz de disponibilidade por unidade e parâmetros de fidelidade.
6. **Implementação da Camada de Armazenamento:** Criação de `js/models/storage.js` com rotinas de leitura, escrita, controle de versão de schema do `localStorage` e contingência em memória `memoryStore`.
7. **Simulador Multicanal (View e Controller):** Implementação de `channelView.js` e `channelController.js` para manipulação do container principal (App, Totem e Web).
8. **Modo Wireframe:** Implementação de `wireframeController.js` para alternância da classe `.wireframe-mode` no `<body>`.
9. **Cabeçalho e Ticker Marquee:** Montagem da barra de controle superior, logotipo, seletor de filial e faixa animada de pratos (Ticker Marquee opcional).
10. **Seção de Filiais:** Construção da View e do Controller de seleção de filiais com destaque visual para a unidade ativa e efeito `.stitch`.
11. **Catálogo de Cardápio:** Renderização do grid de pratos agrupados por categorias gastronômicas, implementando fallback visual em SVG/placeholder caso imagens `.webp` estejam ausentes.
12. **Mecanismo de Estoque por Filial:** Implementação da lógica que desabilita botões e esmaece cards de pratos esgotados na unidade ativa.
13. **Painel da Sacola de Compras:** Criação do drawer/aside lateral exibindo lista de itens, botões `+`/`-` e remoção.
14. **Cálculo de Totais da Sacola:** Implementação do cálculo em tempo real de subtotais e valor total da compra.
15. **Programa "Nordeste Pontos":** Construção do card de fidelidade e da lógica de abatimento financeiro de R$ 15,00 no carrinho.
16. **Banner de Cookies LGPD:** Implementação da notificação inferior com persistência do aceite no `localStorage`.
17. **Formulário de Identificação:** Construção dos campos de Nome e Telefone com validações de obrigatoriedade e formatação dinâmica em Vanilla JS.
18. **Checkbox de Privacidade LGPD:** Implementação do checkbox de consentimento obrigatório vinculado à liberação do checkout.
19. **Modal Mock de Gateway:** Construção do componente modal com opções de pagamento e botões de comando de teste ("Forçar Aprovação" e "Forçar Recusa").
20. **Feedbacks Visuais do Gateway:** Implementação das transições com Verde Macaxeira (`#25D366`) para aprovação e Vermelho Erro (`#BA1A1A`) para recusa.
21. **Linha do Tempo do Pedido (Stepper):** Construção do componente de rastreamento com 3 etapas visuais (*Pedido Recebido*, *Em Preparo*, *Pronto para Retirada*), temporizador automático de 4s e botões manuais de passo.
22. **Auditoria e Persistência do Pedido:** Gravação da transação aprovada na chave `rn_historico_pedidos` e limpeza segura do carrinho ativo.
23. **Testes e Ajustes de Acessibilidade:** Validação de áreas de clique de 48px no modo Totem e contraste WCAG AA.
24. **Homologação Final e Preparação do Deploy:** Testes integrados no navegador e verificação de compatibilidade para publicação estática no GitHub Pages.

---

## 26. Critérios de Aceitação Técnica e Funcional

Para que o sistema seja considerado aprovado e finalizado pela equipe e pela banca examinadora, ele deve atender rigorosamente aos seguintes critérios:

- [ ] **Arquitetura Zero-Build:** A aplicação roda diretamente ao abrir `index.html` em qualquer navegador moderno, sem necessitar de comandos de compilação ou instalação prévia via terminal.
- [ ] **Organização do Repositório:** A estrutura do projeto é articulada a partir da raiz do repositório (`./`), sem depender de caminhos fixos de servidor como `public_html` ou `htdocs`.
- [ ] **Ausência de `.env` e de Banco de Dados:** Não existem arquivos `.env` nem scripts/arquivos SQL no código executável da versão 1.0; toda a configuração é realizada via arquivo JavaScript seguro em `config/config.js`.
- [ ] **Simulador Multicanal Funcional:** O seletor superior permite comutar visualmente entre App Mobile (largura restrita), Totem de Autoatendimento (layout esticado) e Web Desktop (layout ampliado).
- [ ] **Ergonomia do Totem:** No modo Totem, todos os botões e controles interativos possuem área de toque com altura igual ou superior a 48px.
- [ ] **Modo Wireframe Operacional:** O botão de wireframe converte instantaneamente a interface para escala de cinza, alto contraste e bordas tracejadas, ocultando fotos de pratos.
- [ ] **Seleção de Filial e Estoque Dinâmico:** A alternância de filial recalcula a disponibilidade dos itens no cardápio; pratos sem estoque na loja ativa recebem badge visual de esgotado e botão "+ Adicionar" desabilitado (`disabled`).
- [ ] **Sacola de Compras Reativa:** A inclusão, incremento, decremento e exclusão de pratos atualiza os valores e o contador de itens em tempo real.
- [ ] **Desconto de Fidelidade:** O resgate dos pontos simulados aplica o abatimento financeiro correto no subtotal sem gerar saldos negativos.
- [ ] **Conformidade Estrita com a LGPD:** O banner de cookies grava o aceite no `localStorage` e o checkbox de consentimento bloqueia de forma absoluta o avanço para o pagamento quando desmarcado.
- [ ] **Validação Visual de Formulário:** Campos de identificação vazios ou incorretos exibem bordas vermelhas e textos explicativos logo abaixo de cada campo.
- [ ] **Simulação de Gateway com Cenários:** O modal mock de pagamento permite disparar tanto a aprovação (Verde Macaxeira `#25D366`) quanto a recusa (Vermelho Erro `#BA1A1A` com opção de tentar novamente).
- [ ] **Linha do Tempo Visual:** O pedido aprovado gera um número sequencial e exibe o stepper com as etapas *Pedido Recebido*, *Em Preparo* e *Pronto para Retirada*, com avanço automático de 4s e botões manuais de controle de etapa.
- [ ] **Persistência no Web Storage e Contingência:** As chaves de consentimento LGPD, carrinho, sessão e histórico de pedidos são lidas e gravadas corretamente no `localStorage`, com suporte a fallback volátil em memória.
- [ ] **Deploy em GitHub Pages:** O projeto funciona plenamente publicado no GitHub Pages com todas as imagens, fontes e scripts carregados por caminhos relativos e URLs HTTPS seguras.

---

## 27. Pontos Pendentes e Decisões Futuras

Não foram identificadas pendências bloqueantes para iniciar a codificação com base neste FSD. Todas as decisões funcionais, de interface, de conformidade com a LGPD, de arquitetura de dados simulados e de escopo técnico foram completamente consolidadas e estão prontas para execução imediata.

### Evoluções Planejadas para Versões Futuras (v2.0)
- Integração com back-end em PHP/Node.js e banco de dados relacional (MySQL) para centralização multiusuário;
- Integração com adquirente financeira real para processamento bancário de PIX com confirmação via WebSocket/Webhook;
- Módulo de painel gerencial da cozinha (Kitchen Display System - KDS) em tempo real;
- Integração fiscal para emissão automática de Nota Fiscal de Consumidor Eletrônica (NFC-e).

---

### Anexo Conceitual para v2.0: Modelo Relacional de Referência (Futuro Back-End)

> [!WARNING]
> **Aviso Rigoroso para a IA Codificadora:**  
> O esquema SQL abaixo é apresentado **exclusivamente como referência conceitual e teórica para uma futura versão 2.0 com back-end**.  
> **Não crie arquivos SQL, scripts de migração, conexões PDO/MySQL ou qualquer infraestrutura de banco de dados para a versão 1.0.**  
> A versão 1.0 é uma Single Page Application puramente client-side, que utiliza dados estáticos em `mockData.js` e persistência local via `localStorage`.

```sql
-- ESQUEMA CONCEITUAL INFORMATIVO PARA FUTURA VERSÃO 2.0 (NÃO IMPLEMENTAR NA V1.0)

CREATE TABLE filiais (
    id VARCHAR(50) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    horario VARCHAR(100) NOT NULL,
    tempo_estimado VARCHAR(50) NOT NULL,
    status ENUM('aberta', 'fechada') DEFAULT 'aberta',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE TABLE categorias (
    id VARCHAR(50) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    ordem INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE TABLE produtos (
    id VARCHAR(50) PRIMARY KEY,
    categoria_id VARCHAR(50) NOT NULL,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    imagem VARCHAR(255),
    badge_destaque VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    CONSTRAINT fk_produtos_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id),
    INDEX idx_produtos_categoria (categoria_id),
    INDEX idx_produtos_preco (preco)
);

CREATE TABLE produto_disponibilidade_filial (
    produto_id VARCHAR(50) NOT NULL,
    filial_id VARCHAR(50) NOT NULL,
    disponivel BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (produto_id, filial_id),
    CONSTRAINT fk_disp_produto FOREIGN KEY (produto_id) REFERENCES produtos(id),
    CONSTRAINT fk_disp_filial FOREIGN KEY (filial_id) REFERENCES filiais(id),
    INDEX idx_disp_filial_status (filial_id, disponivel)
);

CREATE TABLE clientes (
    id VARCHAR(50) PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    saldo_pontos INT NOT NULL DEFAULT 0,
    consentimento_lgpd_em TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE TABLE pedidos (
    id VARCHAR(50) PRIMARY KEY,
    numero_sequencial VARCHAR(20) NOT NULL,
    filial_id VARCHAR(50) NOT NULL,
    cliente_id VARCHAR(50) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    desconto_fidelidade DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_pago DECIMAL(10,2) NOT NULL,
    forma_pagamento VARCHAR(50) NOT NULL,
    status_transacao ENUM('Aprovado', 'Recusado') NOT NULL,
    status_preparo ENUM('Recebido', 'Em Preparo', 'Pronto') NOT NULL,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    CONSTRAINT fk_pedidos_filial FOREIGN KEY (filial_id) REFERENCES filiais(id),
    CONSTRAINT fk_pedidos_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    INDEX idx_pedidos_data (data_hora),
    INDEX idx_pedidos_filial (filial_id),
    INDEX idx_pedidos_status (status_transacao, status_preparo)
);

CREATE TABLE pedido_itens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id VARCHAR(50) NOT NULL,
    produto_id VARCHAR(50) NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    quantidade INT NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_itens_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    CONSTRAINT fk_itens_produto FOREIGN KEY (produto_id) REFERENCES produtos(id),
    INDEX idx_itens_pedido (pedido_id)
);
```

---

## 28. Conclusão

Este Documento de Especificação Funcional (FSD) consolida de forma exaustiva e autossuficiente todas as regras de negócio, comportamentos de interface, fluxos operacionais, estruturas de dados e decisões técnicas necessárias para a implementação do sistema **"Raízes do Nordeste - Frente de Caixa Multicanal"**.

O documento está pronto para orientar com precisão e segurança uma IA codificadora ou uma equipe de desenvolvimento front-end.

Para a execução da codificação, devem ser fornecidos exclusivamente os seguintes documentos:
1. **`docs/FSD.md`** (o presente documento normativo);
2. **`docs/DESIGN.md`** (as diretrizes estéticas e tokens visuais soberanos do design system "Warm Tactile Neo-Brutalism").

Não é necessária a consulta a nenhum documento prévio, rascunho desatualizado ou histórico de conversas para a implementação integral do projeto.
