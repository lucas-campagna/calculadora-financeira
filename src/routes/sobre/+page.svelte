<script lang="ts">
  import { marked } from "marked";

  const content = `
## O que é a Calculadora de Financiamento?

A Calculadora de Financiamento é uma ferramenta educacional gratuita que permite simular e comparar diferentes sistemas de amortização para financiamentos no Brasil. Seja um financiamento imobiliário, de veículo ou pessoal, esta calculadora ajuda a visualizar como cada sistema afeta o valor das parcelas, os juros pagos e o custo total ao longo do tempo.

A ferramenta foi desenvolvida com foco em transparência e educação financeira, permitindo que tomadores de decisão compreendam profundamente os compromissos antes de assinar um contrato de financiamento.

## Sistemas de Amortização

### PRICE (Tabela Price)

O sistema PRICE é o mais utilizado no Brasil para financiamentos imobiliários. Nele, as parcelas são fixas durante todo o período do financiamento. Isso significa que o valor que você paga mês a mês não muda. No entanto, a composição da parcela varia: nos primeiros meses, uma maior proporção do pagamento é destinada aos juros, enquanto a amortização (redução do saldo devedor) é menor. Com o tempo, essa proporção se inverte, e a amortização passa a representar a maior parte da parcela.

**Vantagens:** Parcelas fixas facilitam o planejamento mensal do orçamento.

**Desvantagens:** O total de juros pagos é geralmente maior em comparação com o SAC, pois o saldo devedor permanece elevado por mais tempo.

### SAC (Sistema de Amortização Constante)

No SAC, a amortização é constante em cada parcela. Isso significa que a cada mês, você reduz o saldo devedor na mesma proporção. Como os juros são calculados sobre o saldo devedor, as parcelas são decrescentes: começam mais altas e vão diminuindo ao longo do tempo.

**Vantagens:** O total de juros pagos é menor, pois o saldo devedor é reduzido mais rapidamente. Além disso, a parcela decrescente pode facilitar o aumento da renda ao longo dos anos.

**Desvantagens:** As primeiras parcelas são mais altas, o que pode comprometer o orçamento inicial do mutuário.

### SAM (Sistema de Amortização Mista)

O SAM é uma combinação dos sistemas PRICE e SAC. Nele, a parcela começa com um valor intermediário entre os dois sistemas e vai se aproximando do valor do PRICE ao longo do tempo. O objetivo é equilibrar as desvantagens de cada sistema, oferecendo parcelas mais estáveis que o SAC, mas com juros totais menores que o PRICE puro.

**Vantagens:** Parcelas mais equilibradas ao longo do contrato, com compromisso entre o custo total e a previsibilidade do orçamento.

**Desvantagens:** Não é tão comum quanto o PRICE ou SAC, e alguns produtos financeiros podem não oferecer essa modalidade.

### Americano (Sistema Americano de Amortização)

No sistema americano, o mutuário paga apenas os juros durante a maior parte do contrato, e o principal (amortização) é pago de forma diluída ou em uma única parcela no final (conhecida como "ballon payment" ou parcela balão). É comum em financiamentos de curto prazo ou em operações imobiliárias onde o comprador pretende revender o imóvel antes do vencimento.

**Vantagens:** Parcelas iniciais muito baixas, pois apenas os juros são pagos mensalmente.

**Desvantagens:** Risco elevado, pois o saldo devedor permanece alto durante todo o contrato. Se o mutuário não tiver planejado a quitação, pode enfrentar dificuldades financeiras ao final do prazo.

## Como Usar a Calculadora

1. **Insira o valor financiado:** Digite o valor total que deseja financiar, descontando o valor da entrada.
2. **Informe a taxa de juros:** Consulte a taxa de juros oferecida pela instituição financeira. Essa taxa pode ser fixa ou variável.
3. **Defina o prazo:** Escolha o número de meses para quitar o financiamento.
4. **Selecione o sistema de amortização:** Escolha entre PRICE, SAC, SAM ou Americano.
5. **Visualize os resultados:** Veja o valor de cada parcela, o total de juros, o custo total e a tabela de amortização completa.
6. **Compare cenários:** Crie múltiplos estudos para comparar diferentes sistemas, valores ou prazos lado a lado.
7. **Simule parcelas extras:** Adicione parcelas extras para ver como isso impacta o prazo total e os juros pagos.

## Metodologia

A calculadora utiliza fórmulas matemáticas padrão para cada sistema de amortização:

- **PRICE:** Utiliza a fórmula de juros compostos para calcular parcelas fixas, onde cada parcela é composta por amortização + juros sobre o saldo devedor.
- **SAC:** A amortização é calculada dividindo o valor financiado pelo número de parcelas. Os juros são calculados sobre o saldo devedor remanescente a cada período.
- **SAM:** Combina as fórmulas do PRICE e SAC, ajustando progressivamente a composição da parcela.
- **Americano:** Os juros são calculados sobre o saldo devedor, com amortização definida conforme as condições do contrato.

Todos os cálculos são baseados em taxa de juros composta mensal, que é o padrão para financiamentos no Brasil.

## Aviso Legal

Esta ferramenta é estritamente educacional e não substitui o aconselhamento financeiro profissional. Os resultados apresentados são estimativas baseadas nos dados inseridos pelo usuário e podem não refletir condições reais de mercado, como taxas administrativas, seguros obrigatórios, impostos ou outras cobranças adicionais.

Antes de tomar qualquer decisão financeira, consulte um profissional qualificado, como um consultor financeiro ou um advogado especializado em direito bancário.

## Privacidade

A Calculadora de Financiamento não coleta, armazena ou transmite dados pessoais dos usuários. Todos os cálculos são realizados localmente no navegador, e nenhuma informação é enviada a servidores externos. Os dados inseridos permanecem apenas no seu dispositivo.

## Contato

Em caso de dúvidas ou sugestões, entre em contato através do repositório do projeto no GitHub.
`;

  const renderedContent = marked(content);
</script>

<svelte:head>
  <title>Sobre — Calculadora de Financiamento</title>
  <meta
    name="description"
    content="Conheça a Calculadora de Financiamento: como funciona, sistemas de amortização (PRICE, SAC, SAM, Americano), metodologia e avisos legais."
  />
  <meta property="og:title" content="Sobre — Calculadora de Financiamento" />
  <meta
    property="og:description"
    content="Conheça a Calculadora de Financiamento: como funciona, sistemas de amortização (PRICE, SAC, SAM, Americano), metodologia e avisos legais."
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://calculadora-financiamento.com/sobre" />
  <link rel="canonical" href="https://calculadora-financiamento.com/sobre" />
</svelte:head>

<div class="max-w-3xl mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-6">Sobre a Calculadora de Financiamento</h1>
  <div class="prose prose-slate dark:prose-invert max-w-none text-base leading-relaxed space-y-6">
    {@html renderedContent}
  </div>
</div>
