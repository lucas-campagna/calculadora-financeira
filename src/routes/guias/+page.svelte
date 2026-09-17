<script lang="ts">
  import { base } from "$app/paths";
  import Card from "$lib/components/ui/card.svelte";
  import CardHeader from "$lib/components/ui/card-header.svelte";
  import CardTitle from "$lib/components/ui/card-title.svelte";
  import CardDescription from "$lib/components/ui/card-description.svelte";
  import CardContent from "$lib/components/ui/card-content.svelte";
  import CardFooter from "$lib/components/ui/card-footer.svelte";
  import Button from "$lib/components/ui/button.svelte";

  const guides = [
    {
      href: `${base}/guias/tabela-price`,
      title: "Tabela PRICE",
      description: "Entenda como funciona o sistema de parcelas fixas mais utilizado no Brasil para financiamentos imobiliários.",
      system: "price",
    },
    {
      href: `${base}/guias/tabela-sac`,
      title: "Tabela SAC",
      description: "Conheça o sistema de amortização constante e descubra por que ele costuma ser mais econômico a longo prazo.",
      system: "sac",
    },
    {
      href: `${base}/guias/price-vs-sac`,
      title: "PRICE vs SAC",
      description: "Compare os dois sistemas mais populares e descubra qual é o melhor para o seu perfil financeiro.",
      system: "comparacao",
    },
  ];
</script>

<svelte:head>
  <title>Guias — Calculadora de Financiamento</title>
  <meta name="description" content="Guias detalhados sobre os sistemas de amortização PRICE, SAC, SAM e Americano. Aprenda a escolher o melhor sistema para o seu financiamento." />
  <meta property="og:title" content="Guias — Calculadora de Financiamento" />
  <meta property="og:description" content="Guias detalhados sobre os sistemas de amortização PRICE, SAC, SAM e Americano." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://calculadora-financiamento.com/guias" />
  <link rel="canonical" href="https://calculadora-financiamento.com/guias" />
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-4">Guias sobre Financiamento</h1>
  <p class="text-lg text-muted-foreground mb-8">
    Aprenda tudo sobre os diferentes sistemas de amortização utilizados no Brasil.
    Escolha o guia abaixo que mais interessa a você.
  </p>

  <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {#each guides as guide}
      <Card>
        <CardHeader>
          <CardTitle>{guide.title}</CardTitle>
          <CardDescription>{guide.system}</CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground">{guide.description}</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" class="w-full" href={guide.href}>
            Ler guia
          </Button>
        </CardFooter>
      </Card>
    {/each}
  </div>

  <section class="mt-12 p-6 bg-muted/50 rounded-lg">
    <h2 class="text-xl font-semibold mb-3">Precisa de ajuda para escolher?</h2>
    <p class="text-muted-foreground mb-4">
      Use nossa calculadora interativa para simular diferentes cenários e comparar o custo total
      de cada sistema de amortização com os seus dados específicos de financiamento.
    </p>
    <Button href={base}>Abrir calculadora</Button>
  </section>
</div>
