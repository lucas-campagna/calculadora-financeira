<script lang="ts">
  import { base } from "$app/paths";
  import { marked } from "marked";
  import AuthorByline from "$lib/components/ui/author-byline.svelte";

  const content = `
## PRICE vs SAC: Qual escolher?

A escolha entre os sistemas PRICE e SAC é uma das decisões mais importantes ao contratar um financiamento imobiliário. Ambos têm vantagens e desvantagens, e a melhor escolha depende do seu perfil financeiro, da sua capacidade de pagamento e dos seus objetivos de longo prazo.

### Resumo das diferenças

| Aspecto | PRICE | SAC |
|---------|-------|-----|
| Parcelas | Fixas durante todo o contrato | Decrecentes ao longo do tempo |
| Primeira parcela | Menor (R$ 2.610)* | Maior (R$ 3.125)* |
| Última parcela | Igual à primeira | Muito menor (R$ 837)* |
| Total de juros | R$ 639.600* | R$ 452.500* |
| Custo total | R$ 939.600* | R$ 752.500* |
| Amortização inicial | Lenta | Rápida |
| Economia com SAC | — | R$ 187.100* |

*Valores baseados em financiamento de R$ 300.000 a 10% ao ano em 360 meses.

### Quando escolher o PRICE?

O sistema PRICE é mais adequado para quem:

1. **Precisa de parcelas menores para ser aprovado**: Se sua renda permite apenas parcelas de R$ 2.600, o PRICE permite financiar um valor maior.

2. **Tem renda fixa e quer previsibilidade**: Se você precisa saber exatamente quanto pagará nos próximos anos, o PRICE oferece essa estabilidade.

3. **Prefere não arriscar inadimplência**: Parcelas mais baixas no início significam menos risco de default nos primeiros anos.

4. **Não pretende ficar muito tempo no imóvel**: Se você pode vender em 5-10 anos, a diferença de custo total pode não ser tão relevante.

### Quando escolher o SAC?

O sistema SAC é mais adequado para quem:

1. **Pode arcar com parcelas iniciais mais altas**: Se sua renda permite pagar R$ 3.125 no início, o SAC é mais econômico.

2. **Espera aumento de renda**: Se você espera progressão na carreira ou promoção, as parcelas decrescentes ficarão mais fáceis de arcar.

3. **Quer minimizar o custo total**: Se o objetivo é pagar menos juros possível, o SAC é a melhor escolha.

4. **Tem reserva de emergência**: Para garantir que pode pagar as parcelas mais altas no início.

### Análise de perfil

Para ajudar na decisão, responda às seguintes perguntas:

**1. Qual é sua renda atual e qual sua perspectiva de crescimento?**
- Renda fixa sem perspectiva de aumento → PRICE
- Renda com expectativa de crescimento → SAC

**2. Você tem reserva financeira para emergências?**
- Não → PRICE (parcelas mais baixas)
- Sim → SAC

**3. Quanto tempo pretende ficar no imóvel?**
- Menos de 10 anos → PRICE (diferença menor)
- Mais de 15 anos → SAC (economia significativa)

**4. Qual é sua tolerance a risco financeiro?**
- Baixa → PRICE
- Média a alta → SAC

### Simulação personalizada

A melhor forma de decidir é fazer uma simulação com os dados reais do seu financiamento. Use nossa calculadora para comparar ambos os sistemas com:

- O valor exato que você pretende financiar
- A taxa de juros oferecida pelo banco
- O prazo que você está considerando

### Exemplo de decisão por cenário

**Cenário 1: Casal jovem, renda R$ 8.000, primeiro imóvel**
- Capacidade máxima de parcela: R$ 2.500 (31% da renda)
- Recomendação: PRICE, pois as parcelas iniciais do SAC (R$ 3.125) comprometeriam mais de 38% da renda

**Cenário 2: Profissional consolidado, renda R$ 15.000, segundo imóvel**
- Capacidade de parcela: até R$ 5.000
- Recomendação: SAC, pois pode arcar com as parcelas iniciais e economizaria R$ 187 mil em 30 anos

**Cenário 3: Aposentado com renda estável**
- Preferência: Parcelas fixas para planejamento
- Recomendação: PRICE, pois a previsibilidade é mais importante que a economia

### Considerações sobre approval de crédito

É importante notar que os bancos avaliam sua capacidade de pagamento com base na primeira parcela. Isso significa que:

- Com o PRICE, você pode ser aprovado para um valor maior
- Com o SAC, você pode ser aprovado para um valor menor, mas pagará menos no total

Se você está em dúvida entre dois valores de financiamento, o PRICE pode permitir que você compre um imóvel melhor localizado ou maior.

### Conclusão

Não existe um sistema universally melhor. A escolha depende de:

- Sua situação financeira atual
- Suas expectativas de renda futura
- Seus objetivos de longo prazo
- Sua tolerance a risco

O mais importante é entender ambas as opções e tomar uma decisão informada. Use nossa calculadora para simular seu cenário específico e, se possível, consulte um asesor financeiro antes de assinar o contrato.
  `;

  const renderedContent = marked(content);
</script>

<svelte:head>
  <title>PRICE vs SAC — Qual escolher? — Calculadora de Financiamento</title>
  <meta name="description" content="Compare os sistemas PRICE e SAC: quando escolher cada um, simulação de custos e guia de decisão baseado no seu perfil financeiro." />
  <meta property="og:title" content="PRICE vs SAC — Calculadora de Financiamento" />
  <meta property="og:description" content="Guia completo para escolher entre PRICE e SAC: comparativa, cenários e decisão baseada no seu perfil." />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://calculadora-financiamento.com/guias/price-vs-sac" />
  <link rel="canonical" href="https://calculadora-financiamento.com/guias/price-vs-sac" />
</svelte:head>

<div class="max-w-3xl mx-auto px-4 py-8">
  <nav class="text-sm text-muted-foreground mb-4">
    <a href="{base}/" class="hover:underline">Calculadora</a> >
    <a href="{base}/guias" class="hover:underline">Guias</a> >
    <span class="text-foreground">PRICE vs SAC</span>
  </nav>

  <h1 class="text-3xl font-bold mb-2">PRICE vs SAC: Qual escolher?</h1>
  <p class="text-lg text-muted-foreground mb-6">
    Guia completo para escolher o melhor sistema de amortização para o seu perfil financeiro.
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
    <h2 class="text-xl font-semibold mb-3">Simule seu cenário específico</h2>
    <p class="text-muted-foreground mb-4">
      Use nossa calculadora para comparar PRICE e SAC com os dados reais do seu financiamento.
    </p>
    <a href="{base}/" class="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
      Abrir calculadora
    </a>
  </section>
</div>
