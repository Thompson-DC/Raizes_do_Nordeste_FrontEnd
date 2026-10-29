# Raízes do Nordeste — Frente de Caixa Multicanal & Autoatendimento

Aplicação web estática (Single Page Application — Zero-Build) de ponto de venda (PDV) e autoatendimento para a rede gastronômica sertaneja **Raízes do Nordeste**, desenvolvida como projeto prático multidisciplinar na trilha de Front-End da UNINTER.

---

## 🌐 Publicação Online (GitHub Pages)

A aplicação está homologada para hospedagem estática direta através do GitHub Pages:

- **Link de Acesso Público:** `https://thompson-dc.github.io/Raizes_do_Nordeste_FrontEnd/` *(substitua conforme seu usuário/repositório)*

> **Compatibilidade Total:** Todos os recursos visuais, fontes, ícones e scripts utilizam caminhos estritamente relativos (`./assets/...`, `./config/...`, `./js/...`), assegurando execução impecável tanto na raiz quanto em subdiretórios públicos.

---

## 📖 Visão do Produto

A rede gastronômica **Raízes do Nordeste** reúne a riqueza da culinária tradicional nordestina (cuscuz no vapor, carne de sol, queijo coalho tostado, tapiocas artesanais e bebidas regionais) com uma experiência moderna de atendimento ágil.

A **Frente de Caixa Multicanal** atende simultaneamente aos clientes em seus próprios smartphones, no salão físico através de quiosques digitais (totens) e via computadores de mesa, integrando estoque por unidade, programa de fidelidade, conformidade estrita com a LGPD e rastreamento visual do pedido.

---

## 🚀 Funcionalidades Principais

### 1. Multicanalidade Real em Tempo de Execução
Na barra superior da interface, o avaliador ou usuário pode alternar instantaneamente entre três modos de atendimento:
- **App Mobile:** Layout centralizado e compacto (`max-w-sm`), ideal para telas de 390px a 420px, priorizando rolagem fluida com uma mão.
- **Totem de Autoatendimento:** Simulação vertical esticada (proporção 9:16), com fontes de alto contraste e alvos de clique ergonômicos com altura mínima garantida de **48px** (conforme padrões WCAG).
- **Web Desktop:** Experiência ampla com grid dinâmico de pratos e coluna lateral fixa para acompanhamento da sacola de compras.

### 2. Modo Wireframe Estrutural (Auditoria Técnica e Relatórios)
Um interruptor global converte imediatamente o design visual da interface para uma representação monocromática em escala de cinza, com contornos tracejados e mascaramento de fotografias, permitindo a extração de evidências e prints neutros para documentação acadêmica e análise de usabilidade.

### 3. Catálogo Regional e Gestão de Estoque por Filial
- Apresentação de três unidades físicas da rede: *Recife Antigo (Matriz)*, *Boa Viagem* e *Olinda Histórica*.
- Seleção dinâmica da filial com recálculo instantâneo de disponibilidade física: pratos esgotados na unidade ativa são bloqueados para compra, identificados com aviso visual de indisponibilidade e tratados com filtro de opacidade.
- Filtro rápido por categorias culinárias (Cuscuz, Tapiocas, Pratos Sertanejos, Bebidas e Sobremesas).

### 4. Sacola de Compras e Resumo em Tempo Real
- Controle de quantidades com botões de incremento (`+`), decremento (`-`) e exclusão rápida.
- Atualização reativa de subtotal, descontos aplicados e total final a pagar.

### 5. Programa de Fidelidade "Nordeste Pontos"
- Resgate de pontos acumulados com conversão parametrizada (10 pontos = R$ 1,00 de desconto).
- Regra matemática estrita com piso de segurança em `R$ 0,00`, impedindo totais negativos caso o valor do desconto supere o subtotal da compra.

### 6. Conformidade com a LGPD (Lei nº 13.709/2018)
- Notificação não-bloqueante na base da tela com banner informativo de cookies e botão de aceite expresso.
- Checkbox de consentimento obrigatório dos Termos de Privacidade na etapa de identificação do cliente (Nome e Celular formatado), bloqueando o avanço do pedido caso desmarcado.

### 7. Gateway de Pagamento Mockado
- Modal simulador de transação financeira suportando PIX, Cartão de Crédito, Cartão de Débito e Dinheiro.
- Controles de auditoria para forçar cenários de retorno:
  - **Aprovar Pagamento:** Confirmação visual em verde (`#25D366`), gravação do pedido e encaminhamento para a Linha do Tempo.
  - **Recusar Pagamento:** Alerta visual em vermelho (`#BA1A1A`) com mensagem explicativa e botão de nova tentativa, preservando integralmente os itens da sacola.

### 8. Linha do Tempo de Produção (Stepper)
- Rastreamento dinâmico em 3 estados de atendimento: *Pedido Recebido*, *Em Preparo* e *Pronto para Retirada*.
- Transição automática temporizada com botões manuais de navegação (*Avançar Etapa* / *Voltar Etapa*) para demonstração perante banca examinadora.

---

## 🛠️ Arquitetura e Tecnologias

A aplicação adota o modelo **Zero-Build & Client-Side**, eliminando dependências pesadas de compilação ou servidores de aplicação:

- **Estrutura Semântica:** HTML5 estruturado com foco em acessibilidade (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<dialog>`).
- **Design System:** Tailwind CSS v3 via CDN com injeção do tema *"Warm Tactile Neo-Brutalism"* (paleta em tons terrosos sertanejos, sombras sólidas projetadas `#3A0E03` e efeito de costura artesanal em couro `.stitch`).
- **Lógica e Interatividade:** JavaScript Vanilla moderno (ECMAScript 2022+) estruturado em módulos nativos (`type="module"`), sem frameworks compilados.
- **Iconografia e Tipografia:** Lucide Icons via CDN e Google Fonts (Epilogue, Fraunces e Nunito Sans).
- **Persistência de Dados:** Web Storage API (`localStorage`) com isolamento de chaves (`rn_*`) e camada transparente de contingência em memória (`memoryStore`) para operação em ambientes com cookies restritos.

---

## 📁 Estrutura de Diretórios

```text
./
├── index.html                     # Casca semântica única da SPA
├── config/
│   └── config.js                 # Objeto de configurações estáticas e chaves do storage
├── assets/
│   ├── css/
│   │   └── custom.css            # Efeitos visuais complementares (wireframe, .stitch, relevos)
│   └── img/
│       ├── logo.png              # Logotipo oficial (fundos claros)
│       └── logo_branca.png       # Logotipo oficial (fundos escuros / wireframe)
├── js/
│   ├── app.js                    # Ponto de entrada e orquestrador da aplicação
│   ├── models/                   # Estruturas de dados imutáveis e persistência resiliente
│   ├── controllers/              # Gerenciadores de regras de negócio e eventos
│   └── views/                    # Funções geradoras de componentes de interface
├── docs/
│   ├── FSD.md                    # Documento de Especificação Funcional completo
│   └── DESIGN.md                 # Especificação do Design System e tokens visuais
├── .gitattributes                # Padronização de quebras de linha e arquivos binários
├── .gitignore                    # Regras de proteção de arquivos locais e temporários
└── README.md                     # Este documento de apresentação e guia técnico
```

---

## 💻 Instruções de Execução Local

Por se tratar de uma SPA Zero-Build, não há necessidade de executar comandos de instalação (`npm install` ou similares):

### Método 1: Abertura Direta
Abra o arquivo `index.html` com um clique duplo em qualquer navegador moderno (Chrome, Edge, Firefox, Safari).

### Método 2: Servidor Estático Local (Recomendado para Módulos ES6)
Em alguns navegadores, módulos ES6 requerem protocolo HTTP para importações locais. Você pode utilizar qualquer uma das opções abaixo a partir da raiz da pasta:

- **Extensão Live Server (VS Code):** Clique com o botão direito em `index.html` e selecione *"Open with Live Server"*.
- **Python 3:** Execute `python -m http.server 8000` e acesse `http://localhost:8000`.
- **Servidor Web Local (Apache / XAMPP):** Aloque a pasta no diretório `htdocs` e acesse via `http://localhost/Raizes_do_Nordeste_FrontEnd/`.

---

## 📋 Normas Acadêmicas e Qualidade de Código

- **Zero Dependências Compiladas:** Nenhum instalador de pacotes ou bundler necessário.
- **Acessibilidade:** Padrões WCAG 2.1 nível AA observados, contrastes cromáticos validados e alvos de toque de 48px respeitados no Totem.
- **Segurança e Privacidade:** Dados de cartão e pagamentos são exclusivamente simulados para fins didáticos, em estrita conformidade com a LGPD e sem trafegar dados sensíveis.
