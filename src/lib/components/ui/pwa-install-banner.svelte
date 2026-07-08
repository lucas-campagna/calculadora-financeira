<script lang="ts">
  import { cn } from "$lib/utils";
  import Button from "./button.svelte";
  import { X, Download } from "lucide-svelte";

  type BeforeInstallPromptEvent = {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
    preventDefault: () => void;
  };

  let deferredPrompt = $state<BeforeInstallPromptEvent | null>(null);
  let visible = $state(false);

  export function canInstall() {
    return deferredPrompt !== null;
  }

  export function triggerInstall() {
    if (deferredPrompt) {
      handleInstall();
    }
  }

  function handleBeforeInstallPrompt(e: Event) {
    e.preventDefault();
    deferredPrompt = e as unknown as BeforeInstallPromptEvent;
    visible = true;
  }

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    visible = false;
  }

  function dismiss() {
    visible = false;
  }

  $effect(() => {
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  });
</script>

{#if visible}
  <div
    class={cn(
      "fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-4 border-t bg-background px-4 py-3 shadow-lg sm:bottom-4 sm:left-auto sm:right-4 sm:top-auto sm:max-w-sm sm:rounded-lg sm:shadow-xl",
    )}
  >
    <div class="flex items-center gap-3">
      <Download class="h-5 w-5 text-primary shrink-0" />
      <p class="text-sm">Instale o app para acesso rápido offline</p>
    </div>
    <div class="flex items-center gap-2">
      <Button size="sm" onclick={handleInstall}>Instalar</Button>
      <Button size="icon" variant="ghost" onclick={dismiss}>
        <X class="h-4 w-4" />
      </Button>
    </div>
  </div>
{/if}

<style>
  p {
    margin: 0;
  }
</style>
