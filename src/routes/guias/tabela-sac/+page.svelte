<script lang="ts">
  import { base } from "$app/paths";
  import { marked } from "marked";
  import AuthorByline from "$lib/components/ui/author-byline.svelte";

  const content = `
## O que é o Sistema SAC?

O SAC (Sistema de Amortização Constante) é o segundo método mais utilizado no Brasil para financiamentos, especialmente em operações com recursos do SFH (Sistema Financeiro de Habitação). Diferente do PRICE, onde as parcelas são fixas, no SAC as parcelas são decrescentes ao longo do tempo.

A característica principal do SAC é que o valor da **amortização é constante** em todas as parcelas. Isso significa que, independentemente dos juros, você paga sempre o mesmo valor para reduzir o saldo devedor. Como os juros são calculados sobre o saldo remanescente, o valor total da parcela diminui progressivamente.

### Como funciona o cálculo?

No SAC, a amortização mensal é calculada dividindo-se o valor principal pelo número de parcelas:

**Amortização mensal = Principal / Número de parcelas**

Os juros de cada mês são calculados sobre o saldo devedor do mês anterior:

**Juros do mês = Saldo devedor anterior × Taxa de juros mensal**

A parcela de cada mês é a soma da amortização constante com os juros daquele mês.

### Exemplo prático: Financiamento de R$ 300.000 a 10% ao ano

Vamos simular o mesmo financiamento pelo sistema SAC:
- Valor financiado: R$ 300.000
- Taxa de juros: 10% ao ano (0,83% ao mês)
- Prazo: 360 meses (30 anos)

**Amortização mensal: R$ 833,33** (R$ 300.000 / 360)

**Primeira parcela: R$ 3.125,00**
- Amortização: R$ 833,33
- Juros: R$ 2.500,00

**Última parcela (360ª): R$ 837,50**
- Amortização: R$ 833,33
- Juros: R$ 4,17

A parcela diminuiu de R$ 3.125 para R$ 837 ao longo do financiamento — uma redução de 73%.

### Comparação PRICE vs SAC para o mesmo financiamento

| Aspecto | PRICE | SAC |
|---------|-------|-----|
| Primeira parcela | R$ 2.610 | R$ 3.125 |
| Última parcela | R$ 2.610 | R$ 837 |
| Total de juros | R$ 639.600 | R$ 452.500 |
| Custo total | R$ 939.600 | R$ 752.500 |
| Economia no custo | — | R$ 187.100 |

O SAC resulta em uma economia de R$ 187.100 ao longo de 30 anos!

### Vantagens do Sistema SAC

1. **Menor custo total**: Você paga menos juros porque o saldo devedor diminui mais rapidamente.

2. **Parcelas decrescentes**: Com o tempo, você paga menos, o que pode aliviar o orçamento familiar.

3. **Quitação mais rápida do sonho**: A cada parcela, você está amortizando mais do que no PRICE inicial.

4. **Melhor para longo prazo**: Se você não pretende vender o imóvel, o SAC é mais vantajoso financeiramente.

### Desvantagens do Sistema SAC

1. **Parcelas iniciais mais altas**: A primeira parcela é 20% maior que no PRICE.

2. **Planejamento harder**: A variação das parcelas dificulta o planejamento de longo prazo.

3. **Menor poder de compra**: Com parcelas iniciais mais altas, você pode ser aprovado para um valor menor.

4. **Impacto emocional**: Ver parcelas altas no início pode gerar ansiedade.

### Quando escolher o SAC?

O sistema SAC é recomendado para quem:

- Tem renda mais alta e pode arcar com parcelas iniciais maiores
- Espera que sua renda aumente ao longo dos anos
- Pretende quitar o financiamento mais rapidamente
- Quer pagar menos juros no total
- Está financeiramente preparado para variações no orçamento

### Evolução das parcelas no SAC

Para ilustrar a evolução, vejamos os primeiros 6 meses:

| Mês | Parcela | Juros | Amortização | Saldo |
|-----|---------|-------|-------------|-------|
| 1 | R$ 3.125 | R$ 2.500 | R$ 833 | R$ 299.167 |
| 2 | R$ 3.097 | R$ 2.493 | R$ 833 | R$ 298.333 |
| 3 | R$ 3.070 | R$ 2.486 | R$ 833 | R$ 297.500 |
| 4 | R$ 3.042 | R$ 2.479 | R$ 833 | R$ 296.667 |
| 5 | R$ 3.015 | R$ 2.472 | R$ 833 | R$ 295.833 |
| 6 | R$ 2.987 | R$ 2.465 | R$ 833 | R$ 295.000 |

Note que a amortização permanece constante em R$ 833, enquanto os juros diminuem a cada mês.

### SAC no contexto brasileiro

O sistema SAC é muito utilizado em financiamentos da Caixa Econômica Federal e do Banco do Brasil, especialmente para produtos do Minha Casa Minha Vida. Muitos consultores financeiros recomendam o SAC para clientes com perfil mais arrojado ou que têm expectativa de aumento de renda.

É importante ressaltar que, apesar de o SAC ter um custo total menor, o PRICE pode ser a melhor escolha para quem precisa de parcelas iniciais menores para ser aprovado no financiamento. A decisão deve considerar não apenas o custo total, mas também a capacidade de pagamento em cada fase do financiamento.

### Conclusão

O Sistema SAC é uma excelente opção para quem pode arcar com parcelas iniciais mais altas e deseja minimizar o custo total do financiamento. A economia de quase R$ 200 mil em 30 anos é significativa e pode representar a diferença entre um financiamento confortável e um que consome toda a renda familiar.

Antes de decidir, analise sua capacidade financeira atual e futura, e considere usar nossa calculadora para comparar os dois sistemas com os dados específicos do seu financiamento.
  `;

  const renderedContent = marked(content);
</script>

<svelte:head>
  <title>Tabela SAC — Como Funciona — Calculadora de Financiamento</title>
  <meta name="description" content="Entenda como funciona a Tabela SAC (Sistema de Amortização Constante): parcelas decrescentes, cálculo de juros, vantagens e economia total." />
  <meta property="og:title" content="Tabela SAC — Calculadora de Financiamento" />
  <meta property="og:description" content="Guia completo sobre a Tabela SAC: como funcionam as parcelas decrescentes e a economia em relação ao PRICE." />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://calculadora-financiamento.com/guias/tabela-sac" />
  <link rel="canonical" href="https://calculadora-financiamento.com/guias/tabela-sac" />
</svelte:head>

<div class="max-w-3xl mx-auto px-4 py-8">
  <nav class="text-sm text-muted-foreground mb-4">
    <a href="{base}/" class="hover:underline">Calculadora</a> >
    <a href="{base}/guias" class="hover:underline">Guias</a> >
    <span class="text-foreground">Tabela SAC</span>
  </nav>

  <h1 class="text-3xl font-bold mb-2">Tabela SAC (Sistema de Amortização Constante)</h1>
  <p class="text-lg text-muted-foreground mb-6">
    Entenda como funcionam as parcelas decrescentes e a economia total do SAC em relação ao PRICE.
  </p>

  <div class="prose prose-slate dark:prose-invert max-w-none text-base leading-relaxed space-y-6">
    {@html renderedContent}
  </div>

  <AuthorByline
    name="Lucas Prett Campagna"
    role="Desenvolvedor de Software na HP"
    lastUpdated="Setembro 2026"
  />

  <section class="mt-8 p-6 bg-muted/50 rounded-lg">
    <h2 class="text-xl font-semibold mb-3">Quer comparar com PRICE?</h2>
    <p class="text-muted-foreground mb-4">
      Use nossa calculadora para simular o mesmo financiamento nos dois sistemas e ver qual é o melhor para o seu perfil.
    </p>
    <a href="{base}/" class="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
      Abrir calculadora
    </a>
  </section>
</div>
