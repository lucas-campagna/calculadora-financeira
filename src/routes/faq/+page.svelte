<script lang="ts">
  import { base } from "$app/paths";
  import { marked } from "marked";
  import AuthorByline from "$lib/components/ui/author-byline.svelte";

  const content = `
## Perguntas Frequentes sobre Financiamento

Encontre respostas para as dúvidas mais comuns sobre financiamentos e sistemas de amortização no Brasil.

### Qual é o melhor sistema de amortização: PRICE ou SAC?

Não existe uma resposta universally válida. O PRICE oferece parcelas fixas e previsíveis, além de permitir Financing um valor maior. O SAC tem parcelas decrescentes e um custo total menor, mas exige mais capacidade de pagamento no início. A escolha depende do seu perfil financeiro, capacidade de pagamento inicial e objetivos de longo prazo. Use nossa calculadora para comparar os dois sistemas com os dados do seu financiamento específico.

### Posso trocar de sistema de amortização durante o financiamento?

Sim, é possível, mas depende das condições do seu contrato e da instituição financeira. Alguns bancos permitem a troca mediante negociação, geralmente sem custos adicionais. others may charge a fee or require a minimum period to have elapsed. Contact your bank to understand the options available for your specific contract.

### Como funcionam as parcelas extras (abater do prazo vs. abater da parcela)?

Quando você faz um pagamento extra, pode escolher entre duas opções: reduzir o prazo do financiamento ou reduzir o valor da parcela. A primeira opção é mais vantajosa financeiramente, pois você paga menos juros no total. A segunda oferece alívio no orçamento mensal. Nossa calculadora permite simular o impacto de parcelas extras em ambas as modalidades.

### O que é CET (Custo Efetivo Total)?

O CET é um指标 que representa o custo total do financiamento, incluindo taxa de juros, tarifas, seguros obrigatórios e outros encargos. É a forma mais precisa de comparar diferentes ofertas de financiamento, pois considera todos os custos, não apenas a taxa de juros nominal. Sempre compare o CET ao evaluar diferentes propostas.

### Qual sistema é melhor para o programa Minha Casa Minha Vida?

O programa Minha Casa Minha Vida (MCMV) geralmente utiliza o sistema SAC para as faixas de renda mais baixas (faixas 1 a 3). Para as faixas 4 e 5, que utilizam o SFH regular, tanto PRICE quanto SAC são oferecidos. A escolha deve considerar o perfil do mutuário e as condições específicas de cada operação.

### Como negociar melhores taxas de juros?

 Algumas estratégias para obter melhores taxas incluem: ter um bom histórico de crédito, manter relacionamento com o banco (conta corrente ativa, investimentos), apresentar propostas concorrentes de outros bancos, negociar pontualmente (especialmente na renovação), e considerar portabilidade de crédito se encontrar melhores condições em outro banco.

### Quais seguros são obrigatórios em um financiamento imobiliário?

Os principais seguros obrigatórios são o Seguro de Morte e Invalidez (MIP) e o Seguro de Danos Físicos ao Imóvel (DFI). Estes seguros protegem o banco contra riscos e podem representar uma parcela significativa do custo total. Alguns bancos permitem escolher entre diferentes coberturas e的玩家, o que pode afetar o valor do seguro.

### Posso quitar meu financiamento antecipadamente?

Sim, você tem o direito de quitar ou fazer amortizações antecipadas. A maioria dos contratos permite isso sem cobrança de penalties após um período inicial. Para financiamentos pelo SFH, a taxa de committees para quitação antecipada é limitada pela regulamentação do Banco Central. Quanto mais cedo você quitar, menos juros pagará.

### Qual a diferença entre taxa de juros e CET?

A taxa de juros é apenas uma parte do custo do financiamento. O CET (Custo Efetivo Total) inclui todos os custos: taxa de juros, tarifas de abertura de crédito, avaliação do imóvel, seguros obrigatórios, registro do contrato e eventuais seguros de vida. Por isso, o CET é sempre maior que a taxa de juros nominal e é o mejor indicador para comparação.

### Financiamento com taxa variável é uma boa opção?

Financiamentos com taxa pós-fixada (como TR + juros) podem ser mais econômicos em períodos de queda de juros, mas também podem ficar mais caros se as taxas subirem. A opção por taxa fixa ou variável depende da sua tolerance ao risco e das suas expectativas sobre a trajetória da taxa básica de juros (Selic). No Brasil, a maioria dos financiamentos ainda utiliza taxas prefixadas ou híbridas.

### Como simular um financiamento antes de tomar decisão?

Use nossa calculadora gratuita para inserir o valor do financiamento, taxa de juros, prazo e sistema de amortização. Você poderá ver o valor das parcelas, total de juros, custo total e a tabela de amortização completa. Você também pode simular parcelas extras e comparar diferentes cenários lado a lado.

### O que acontece se eu atrasar o pagamento da parcela?

O atraso no pagamento pode resultar em juros de mora (multa), atualização monetária pelo indexador do financiamento, inscrição em birôs de crédito (Serasa, SPC) e, em casos extremos, ação de cobrança judicial. É importante entrar em contato com o banco imediatamente se você tiver dificuldade de pagamento para explorar opções como renegociação ou pausa no pagamento.
  `;

  const renderedContent = marked(content);
</script>

<svelte:head>
  <title>Perguntas Frequentes — FAQ — Calculadora de Financiamento</title>
  <meta name="description" content="Respostas para as dúvidas mais comuns sobre financiamentos: PRICE, SAC, parcelas extras, CET, seguros e muito mais." />
  <meta property="og:title" content="FAQ — Calculadora de Financiamento" />
  <meta property="og:description" content="Perguntas frequentes sobre financiamentos e sistemas de amortização no Brasil." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://calculadora-financiamento.com/faq" />
  <link rel="canonical" href="https://calculadora-financiamento.com/faq" />
</svelte:head>

<div class="max-w-3xl mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-2">Perguntas Frequentes</h1>
  <p class="text-lg text-muted-foreground mb-6">
    Respostas para as dúvidas mais comuns sobre financiamentos e sistemas de amortização.
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
    <h2 class="text-xl font-semibold mb-3">Não encontrou a resposta?</h2>
    <p class="text-muted-foreground mb-4">
      Entre em contato através do repositório do projeto no GitHub.
    </p>
    <a href="https://github.com" class="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
      GitHub
    </a>
  </section>
</div>
