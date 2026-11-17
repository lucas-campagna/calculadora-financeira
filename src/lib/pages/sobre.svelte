<script lang="ts">
  import { marked } from "marked";
  import { aboutContent } from "$lib/content/about";
  import { getLocale, href, seoUrl, t } from "$lib/i18n";

  const renderedContent = $derived(
    marked(
      aboutContent[getLocale()].replace(
        /\]\(autor\)/g,
        `](${href("/autor")})`,
      ),
    ),
  );
</script>

<svelte:head>
  <title>{t("meta.about.title")}</title>
  <meta name="description" content={t("meta.about.description")} />
  <meta property="og:title" content={t("meta.about.title")} />
  <meta property="og:description" content={t("meta.about.description")} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={seoUrl("/sobre")} />
  <link rel="canonical" href={seoUrl("/sobre")} />
</svelte:head>

<div class="max-w-3xl mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-6">{t("about.title")}</h1>
  <div class="prose prose-slate dark:prose-invert max-w-none text-base leading-relaxed space-y-6">
    {@html renderedContent}
  </div>
</div>
