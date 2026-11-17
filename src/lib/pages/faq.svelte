<script lang="ts">
  import { marked } from "marked";
  import AuthorByline from "$lib/components/ui/author-byline.svelte";
  import { faqContent } from "$lib/content/faq";
  import { getLocale, seoUrl, t } from "$lib/i18n";

  const renderedContent = $derived(marked(faqContent[getLocale()]));
</script>

<svelte:head>
  <title>{t("meta.faq.title")}</title>
  <meta name="description" content={t("meta.faq.description")} />
  <meta property="og:title" content={t("meta.faq.title")} />
  <meta property="og:description" content={t("meta.faq.description")} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={seoUrl("/faq")} />
  <link rel="canonical" href={seoUrl("/faq")} />
</svelte:head>

<div class="max-w-3xl mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-2">{t("faq.title")}</h1>
  <p class="text-lg text-muted-foreground mb-6">
    {t("faq.subtitle")}
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
    <h2 class="text-xl font-semibold mb-3">{t("faq.noAnswer")}</h2>
    <p class="text-muted-foreground mb-4">
      {t("faq.noAnswerBody")}
    </p>
    <a href="https://github.com" class="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
      {t("common.github")}
    </a>
  </section>
</div>
