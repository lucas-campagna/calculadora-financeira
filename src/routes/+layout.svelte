<script lang="ts">
  import "../app.css";
  import AdsenseScript from "$lib/components/ads/adsense-script.svelte";
  import PwaInstallBanner from "$lib/components/ui/pwa-install-banner.svelte";
  import {
    alternateSeoUrl,
    getLocale,
    href,
    LANGUAGE_LABELS,
    LOCALES,
    switchLocaleHref,
    t,
  } from "$lib/i18n";

  let { children } = $props();

  $effect(() => {
    document.documentElement.lang = getLocale() === "en" ? "en" : "pt-BR";
  });
</script>

<svelte:head>
  {#each LOCALES as locale}
    <link
      rel="alternate"
      hreflang={locale === "en" ? "en" : "pt-BR"}
      href={alternateSeoUrl(locale)}
    />
  {/each}
  <link rel="alternate" hreflang="x-default" href={alternateSeoUrl("pt")} />
</svelte:head>

<AdsenseScript />

<div class="min-h-dscreen flex flex-col">
  <header
    class="border-b bg-background sticky top-0 z-40 flex items-center justify-center"
  >
    <div class="container mx-auto px-4 flex items-center justify-between h-10">
      <!-- {#if !isDev && $headerAdsVisible} -->
      <!--   <AdUnit slot="" format="auto" /> -->
      <!-- {:else if !isDev} -->
      <!--   <div class="h-[90px] flex items-center justify-center"> -->
      <!--     <p class="text-xs text-muted-foreground">Anúncio</p> -->
      <!--   </div> -->
      <!-- {:else} -->
      <!--   <div -->
      <!--     class="h-[90px] flex items-center justify-center bg-muted/30 rounded-md text-xs text-muted-foreground" -->
      <!--   > -->
      <!--     AdSense (dev mode) -->
      <!--   </div> -->
      <!-- {/if} -->
      <span class="text-xs font-semibold tracking-tight">CalcFin</span>
      <nav class="flex items-center gap-1" aria-label={t("language.label")}>
        {#each LOCALES as locale}
          <a
            href={switchLocaleHref(locale)}
            class="px-2 py-1 rounded text-xs transition-colors {getLocale() ===
            locale
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted'}"
            aria-current={getLocale() === locale ? "page" : undefined}
          >
            {LANGUAGE_LABELS[locale]}
          </a>
        {/each}
      </nav>
    </div>
  </header>

  <main class="flex-1 sm:container sm:mx-auto sm:px-4 sm:py-6">
    {@render children()}
  </main>

  <footer class="border-t bg-muted/50 py-6 hidden sm:block">
    <div class="container mx-auto px-4 text-center text-base text-muted-foreground">
      <p>{t("footer.disclaimer")}</p>
      <nav class="mt-3 flex justify-center gap-4 text-sm flex-wrap">
        <a href={href("/")} class="hover:underline">{t("nav.calculator")}</a>
        <a href={href("/comparar")} class="hover:underline">{t("nav.compare")}</a>
        <a href={href("/guias")} class="hover:underline">{t("nav.guides")}</a>
        <a href={href("/faq")} class="hover:underline">{t("nav.faq")}</a>
        <a href={href("/sobre")} class="hover:underline">{t("nav.about")}</a>
        <a href={href("/autor")} class="hover:underline">{t("nav.author")}</a>
      </nav>
    </div>
  </footer>
</div>

<PwaInstallBanner />
