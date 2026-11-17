<script lang="ts">
  import Card from "$lib/components/ui/card.svelte";
  import CardHeader from "$lib/components/ui/card-header.svelte";
  import CardTitle from "$lib/components/ui/card-title.svelte";
  import CardDescription from "$lib/components/ui/card-description.svelte";
  import CardContent from "$lib/components/ui/card-content.svelte";
  import CardFooter from "$lib/components/ui/card-footer.svelte";
  import Button from "$lib/components/ui/button.svelte";
  import { guideLinks } from "$lib/content/guides";
  import {
    getLocale,
    href,
    seoUrl,
    t,
    type TranslationKey,
  } from "$lib/i18n";

  const systemKeys: Record<string, TranslationKey> = {
    price: "guides.system.price",
    sac: "guides.system.sac",
    comparacao: "guides.system.comparacao",
  };

  const guides = $derived(guideLinks[getLocale()]);
</script>

<svelte:head>
  <title>{t("meta.guides.title")}</title>
  <meta name="description" content={t("meta.guides.description")} />
  <meta property="og:title" content={t("meta.guides.title")} />
  <meta property="og:description" content={t("meta.guides.description")} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={seoUrl("/guias")} />
  <link rel="canonical" href={seoUrl("/guias")} />
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-4">{t("guides.title")}</h1>
  <p class="text-lg text-muted-foreground mb-8">
    {t("guides.subtitle")}
  </p>

  <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {#each guides as guide}
      <Card>
        <CardHeader>
          <CardTitle>{guide.title}</CardTitle>
          <CardDescription
            >{t(systemKeys[guide.system] ?? "guides.system.price")}</CardDescription
          >
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground">{guide.description}</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" class="w-full" href={href(guide.path)}>
            {t("guides.read")}
          </Button>
        </CardFooter>
      </Card>
    {/each}
  </div>

  <section class="mt-12 p-6 bg-muted/50 rounded-lg">
    <h2 class="text-xl font-semibold mb-3">{t("guides.helpTitle")}</h2>
    <p class="text-muted-foreground mb-4">
      {t("guides.helpBody")}
    </p>
    <Button href={href("/")}>{t("common.openCalculator")}</Button>
  </section>
</div>
