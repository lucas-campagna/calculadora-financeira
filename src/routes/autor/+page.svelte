<script lang="ts">
  import { base } from "$app/paths";
  import { marked } from "marked";
  import AuthorByline from "$lib/components/ui/author-byline.svelte";

  const content = `
## Sobre os autores

A Calculadora de Financiamento foi desenvolvida por três irmãos com experiências complementares no universo financeiro e tecnológico.

### Lucas Prett Campagna

Desenvolvedor de Software na HP, Lucas é responsável pela arquitetura e implementação da calculadora. Com formação em Ciência da Computação e experiência em desenvolvimento de aplicações web, ele combinou seu conhecimento técnico com o interesse pessoal em finanças pessoais para criar uma ferramenta acessível e precisa.

"MEU objetivo é democratizar o acesso à informação financeira. Muita gente não entende como funciona um financiamento e acaba assinando contratos sem compreender o real custo. Esta calculadora nasceu da vontade de mudar essa realidade."

### Daniel Prett Campagna

Analista de Dados na 7D Analytics, Daniel traz a perspectiva analítica para o projeto. Sua experiência com análise de dados financeiros e modelagem estatística contribuiu para a precisão dos cálculos e para a apresentação clara dos resultados.

"Finanças pessoais não precisam ser um bicho de sete cabeças. Quando você entende os números, tomar decisões se torna muito mais fácil. E essa calculadora ajuda exatamente nisso."

### André Prett Campagna

Gerente Bancário no Sicred, André aporta a experiência prática do mercado financeiro. Com anos de atuação em instituições de crédito, ele conhece as dúvidas mais comuns dos clientes e os pontos que frequentemente geram confusão na contratação de financiamentos.

"Vejo muitos clientes surpresos com o valor total que pagam ao final de um financiamento. Se tivessem acesso a uma ferramenta como esta antes de assinar, teriam muito mais clareza sobre o que estão contratando."

### Nossa missão

Nosso objetivo é fornecer ferramentas educacionais gratuitas que ajudem os brasileiros a tomar decisões financeiras mais informadas. Acreditamos que o acesso à informação é o primeiro passo para uma vida financeira mais saudável.

Esta calculadora não substitui o acompanhamento com profissionais especializados, mas é um ponto de partida excelente para quem deseja entender como funcionam os diferentes sistemas de amortização e comparar cenários antes de contratar um financiamento.

### Contato

Para dúvidas, sugestões ou feedbacks sobre a calculadora, entre em contato através do repositório do projeto no GitHub. Contribuições e sugestões são sempre bem-vindas!

### Aviso legal

Esta ferramenta é de caráter exclusivamente educacional. Os resultados apresentados são estimativas baseadas nos dados inseridos pelo usuário e podem não refletir as condições reais de mercado, incluindo taxas administrativas, seguros obrigatórios, impostos ou outras cobranças adicionais. Sempre consulte um profissional financeiro qualificado antes de tomar decisões de crédito.
  `;

  const renderedContent = marked(content);
</script>

<svelte:head>
  <title>Sobre os Autores — Calculadora de Financiamento</title>
  <meta name="description" content="Conheça os três irmãos criadores da Calculadora de Financiamento: desenvolvedor, analista de dados e gerente bancário." />
  <meta property="og:title" content="Sobre os Autores — Calculadora de Financiamento" />
  <meta property="og:description" content="Conheça a equipe por trás da Calculadora de Financiamento." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://calculadora-financiamento.com/autor" />
  <link rel="canonical" href="https://calculadora-financiamento.com/autor" />
</svelte:head>

<div class="max-w-3xl mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-2">Sobre os Autores</h1>
  <p class="text-lg text-muted-foreground mb-6">
    Conheça a equipe por trás da Calculadora de Financiamento.
  </p>

  <div class="prose prose-slate dark:prose-invert max-w-none text-base leading-relaxed space-y-6">
    {@html renderedContent}
  </div>

  <AuthorByline
    name="Lucas, Daniel e André Prett Campagna"
    role="Criadores da Calculadora de Financiamento"
    lastUpdated="Setembro 2026"
  />
</div>
