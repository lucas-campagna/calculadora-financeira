<script lang="ts">
  import { marked } from "marked";
  import AuthorByline from "$lib/components/ui/author-byline.svelte";
  import { sacGuideContent } from "$lib/content/guides-sac";
  import { getLocale, href, seoUrl, t } from "$lib/i18n";

  const renderedContent = $derived(marked(sacGuideContent[getLocale()]));
</script>

<svelte:head>
  <title>{t("meta.guideSac.title")}</title>
  <meta name="description" content={t("meta.guideSac.description")} />
  <meta property="og:title" content={t("meta.guideSac.title")} />
  <meta property="og:description" content={t("meta.guideSac.description")} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content={seoUrl("/guias/tabela-sac")} />
  <link rel="canonical" href={seoUrl("/guias/tabela-sac")} />
</svelte:head>

<div class="max-w-3xl mx-auto px-4 py-8">
  <nav class="text-sm text-muted-foreground mb-4">
    <a href={href("/")} class="hover:underline">{t("nav.calculator")}</a> &gt;
    <a href={href("/guias")} class="hover:underline">{t("nav.guides")}</a> &gt;
    <span class="text-foreground">SAC</span>
  </nav>

  <h1 class="text-3xl font-bold mb-2">{t("guide.sac.title")}</h1>
  <p class="text-lg text-muted-foreground mb-6">
    {t("guide.sac.subtitle")}
  </p>

  <div class="prose prose-slate dark:prose-invert max-w-none text-base leading-relaxed space-y-6">
    {@html renderedContent}
  </div>

  <AuthorByline
    name="Lucas Prett Campagna"
    role={t("byline.roleDeveloper")}
    lastUpdated={t("byline.lastUpdated")}
  />

  <section class="mt-8 p-6 bg-muted/50 rounded-lg">
    <h2 class="text-xl font-semibold mb-3">{t("guide.sac.ctaTitle")}</h2>
    <p class="text-muted-foreground mb-4">
      {t("guide.sac.ctaBody")}
    </p>
    <a href={href("/")} class="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
      {t("common.openCalculator")}
    </a>
  </section>
</div>
