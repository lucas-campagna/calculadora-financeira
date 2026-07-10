<script lang="ts">
  const isDev = import.meta.env.DEV;

  let {
    open = false,
    onclose,
  }: {
    open?: boolean;
    onclose?: () => void;
  } = $props();

  let canClose = $state(false);
  let countdown = $state(5);
  let timer: ReturnType<typeof setTimeout>;
  let countdownTimer: ReturnType<typeof setInterval>;

  $effect(() => {
    if (open) {
      if (isDev) {
        canClose = true;
      } else {
        canClose = false;
        countdown = 5;
        timer = setTimeout(() => {
          canClose = true;
        }, 5000);
        countdownTimer = setInterval(() => {
          countdown = Math.max(0, countdown - 1);
        }, 1000);
      }
    }
    return () => {
      clearTimeout(timer);
      clearInterval(countdownTimer);
    };
  });

  function handleClose() {
    if (canClose) {
      open = false;
      onclose?.();
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (canClose && (e.key === "Escape" || e.key === "Enter")) {
      handleClose();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
    onclick={handleClose}
    onkeydown={handleKeydown}
    role="dialog"
    aria-modal="true"
    aria-label="Anúncio"
    tabindex="0"
  >
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div
      role="document"
      class="bg-background p-6 rounded-xl max-w-sm w-full mx-4"
      onclick={(e) => e.stopPropagation()}
    >
      <div class="text-center mb-4">
        <h2 class="text-xl font-semibold mb-2">
          Calculando seu financiamento...
        </h2>
        <p class="text-base text-muted-foreground">
          A publicidade nos ajuda a manter este serviço gratuito para você.
          Obrigado pela compreensão!
        </p>
      </div>
      <div
        class="min-h-[250px] flex items-center justify-center bg-muted/30 rounded-lg mb-4"
      >
        <ins
          class="adsbygoogle"
          style="display:block"
          data-ad-client="ca-pub-1972364870511142"
          data-ad-slot=""
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div>
      <div class="text-center">
        <button
          class="inline-flex items-center justify-center rounded-lg text-lg font-medium h-14 px-8 py-3 {canClose
            ? 'bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer'
            : 'bg-muted text-muted-foreground cursor-not-allowed'}"
          onclick={handleClose}
          disabled={!canClose}
        >
          {canClose ? "Fechar e ver resultado" : `Aguarde ${countdown}s`}
        </button>
      </div>
    </div>
  </div>
{/if}
