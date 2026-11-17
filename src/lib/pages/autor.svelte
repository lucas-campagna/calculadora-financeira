<script lang="ts">
  import { marked } from "marked";
  import AuthorByline from "$lib/components/ui/author-byline.svelte";
  import { authorsContent } from "$lib/content/authors";
  import { getLocale, seoUrl, t } from "$lib/i18n";

  const renderedContent = $derived(marked(authorsContent[getLocale()]));
</script>

<svelte:head>
  <title>{t("meta.authors.title")}</title>
  <meta name="description" content={t("meta.authors.description")} />
  <meta property="og:title" content={t("meta.authors.title")} />
  <meta property="og:description" content={t("authors.subtitle")} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={seoUrl("/autor")} />
  <link rel="canonical" href={seoUrl("/autor")} />
</svelte:head>

<div class="max-w-3xl mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-2">{t("authors.title")}</h1>
  <p class="text-lg text-muted-foreground mb-6">
    {t("authors.subtitle")}
  </p>

  <div class="prose prose-slate dark:prose-invert max-w-none text-base leading-relaxed space-y-6">
    {@html renderedContent}
  </div>

  <AuthorByline
    name={t("authors.bylineName")}
    role={t("authors.bylineRole")}
    lastUpdated={t("byline.lastUpdated")}
  />
</div>
