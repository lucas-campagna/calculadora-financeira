<script lang="ts">
  import { base } from "$app/paths";
  import { marked } from "marked";
  import AuthorByline from "$lib/components/ui/author-byline.svelte";

  const content = `
## O que é a Tabela PRICE?

A Tabela PRICE, também conhecida como Sistema Francês de Amortização, é o método de cálculo de parcelas mais utilizado no Brasil para financiamentos imobiliários. O nome "Price" vem do matemático inglês Richard Price, que no século XVIII adaptou as fórmulas de juros compostos para o cálculo de aposentadorias e pensões.

Neste sistema, as parcelas são **fixas durante toda a duração do financiamento**. Isso significa que o valor que você paga a cada mês permanece o mesmo, independentemente da inflação ou de mudanças na taxa de juros do mercado. Essa previsibilidade é um dos principais atrativos do sistema PRICE para quem busca planejamento financeiro de longo prazo.

### Como funciona o cálculo?

A parcela fixa do PRICE é calculada usando a seguinte fórmula:

**Parcela = Principal × [i × (1 + i)^n] / [(1 + i)^n – 1]**

Onde:
- **Principal**: Valor total do financiamento
- **i**: Taxa de juros mensal
- **n**: Número de parcelas

A mágica do sistema está na composição interna da parcela. Nos primeiros meses, a maior parte do pagamento é destinada aos juros bancários, enquanto a amortização do saldo devedor é relativamente pequena. Com o passar do tempo, essa proporção se inverte: você paga menos juros e mais principal a cada parcela.

### Exemplo prático: Financiamento de R$ 300.000 a 10% ao ano

Vamos simular um financiamento imobiliário com os seguintes parâmetros:
- Valor financiado: R$ 300.000
- Taxa de juros: 10% ao ano (0,83% ao mês)
- Prazo: 360 meses (30 anos)

**Parcela mensal: R$ 2.610,43**

Nos primeiros meses, a composição da parcela é aproximadamente:
- Juros: R$ 2.500 (95,8%)
- Amortização: R$ 110,43 (4,2%)

Após 180 meses (15 anos), a composição já mudou significativamente:
- Juros: R$ 1.850 (70,9%)
- Amortização: R$ 760,43 (29,1%)

No final do financiamento, a composição é invertida, com a maior parte indo para amortização.

### Vantagens do Sistema PRICE

1. **Parcelas fixas e previsíveis**: O valor da parcela não muda ao longo do contrato, facilitando o planejamento orçamentário familiar.

2. **Estabilidade emocional**: Em períodos de crise econômica, você sabe exatamente quanto vai pagar nos próximos anos.

3. **Facilidade de compreensão**: O sistema é simples de entender e comparar entre diferentes ofertas.

4. **Maior poder de compra inicial**: Como as parcelas começam menores que no SAC, você pode financiar um valor maior.

### Desvantagens do Sistema PRICE

1. **Total de juros mais alto**: Por manter o saldo devedor elevado por mais tempo, você paga mais juros totais.

2. **Amortização lenta no início**: Nos primeiros anos, sua dívida praticamente não diminui.

3. **Maior risco de inadimplência longo prazo**: Se você quitar antecipadamente, ainda terá um saldo devedor significativo.

### Quando escolher o PRICE?

O sistema PRICE é recomendado para quem:

- Tem renda fixa e estável que permite planejamento de longo prazo
- Prioriza a previsibilidade das parcelas
- Deseja financiar um valor mais alto com parcelas iniciais menores
- Pretende permanecer no imóvel por um longo período
- Tem perfil conservador e prefere não arriscar parcelas altas no início

### PRICE no contexto brasileiro

No Brasil, o sistema PRICE é amplamente utilizado em financiamentos imobiliários pelo SFH (Sistema Financeiro de Habitação). A Caixa Econômica Federal e outros grandes bancos oferecem esse sistema como opção padrão para a maioria dos produtos de crédito imobiliário.

É importante notar que, legalmente, você tem o direito de escolher entre PRICE e SAC. Alguns bancos podem dificultar a opção pelo SAC, mas a legislação brasileira garante essa liberdade ao mutuário.

### Exemplo de evolução da amortização

Para ilustrar melhor, vejamos os primeiros 6 meses de um financiamento de R$ 300.000 a 10% ao ano pelo sistema PRICE:

| Mês | Parcela | Juros | Amortização | Saldo |
|-----|---------|-------|-------------|-------|
| 1 | R$ 2.610 | R$ 2.500 | R$ 110 | R$ 299.890 |
| 2 | R$ 2.610 | R$ 2.499 | R$ 111 | R$ 299.779 |
| 3 | R$ 2.610 | R$ 2.498 | R$ 112 | R$ 299.667 |
| 4 | R$ 2.610 | R$ 2.497 | R$ 113 | R$ 299.554 |
| 5 | R$ 2.610 | R$ 2.496 | R$ 114 | R$ 299.440 |
| 6 | R$ 2.610 | R$ 2.495 | R$ 115 | R$ 299.325 |

Observe como a amortização aumenta gradualmente enquanto os juros diminuem, mas a parcela total permanece constante.

### Conclusão

A Tabela PRICE é uma excelente opção para quem valoriza previsibilidade e estabilidade. Embora o custo total seja maior que o SAC, a segurança de saber exatamente quanto você pagará durante décadas tem valor significativo para muitas famílias brasileiras.

Antes de decidir, use nossa calculadora para comparar PRICE e SAC com os dados específicos do seu financiamento. O melhor sistema depende do seu perfil financeiro, da sua tolerance a risco e dos seus objetivos de longo prazo.
  `;

  const renderedContent = marked(content);
</script>

<svelte:head>
  <title>Tabela PRICE — Como Funciona — Calculadora de Financiamento</title>
  <meta name="description" content="Entenda como funciona a Tabela PRICE (Sistema Francês de Amortização): parcelas fixas, cálculo de juros, vantagens e desvantagens para financiamentos." />
  <meta property="og:title" content="Tabela PRICE — Calculadora de Financiamento" />
  <meta property="og:description" content="Guia completo sobre a Tabela PRICE: como funcionam as parcelas fixas e quando escolher este sistema." />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://calculadora-financiamento.com/guias/tabela-price" />
  <link rel="canonical" href="https://calculadora-financiamento.com/guias/tabela-price" />
</svelte:head>

<div class="max-w-3xl mx-auto px-4 py-8">
  <nav class="text-sm text-muted-foreground mb-4">
    <a href="{base}/" class="hover:underline">Calculadora</a> >
    <a href="{base}/guias" class="hover:underline">Guias</a> >
    <span class="text-foreground">Tabela PRICE</span>
  </nav>

  <h1 class="text-3xl font-bold mb-2">Tabela PRICE (Sistema Francês de Amortização)</h1>
  <p class="text-lg text-muted-foreground mb-6">
    Entenda como funcionam as parcelas fixas mais comuns nos financiamentos brasileiros.
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
    <h2 class="text-xl font-semibold mb-3">Quer comparar com SAC?</h2>
    <p class="text-muted-foreground mb-4">
      Use nossa calculadora para simular o mesmo financiamento nos dois sistemas e ver a diferença no custo total.
    </p>
    <a href="{base}/" class="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
      Abrir calculadora
    </a>
  </section>
</div>
