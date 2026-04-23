<script lang="ts" setup>
import { ExternalLink, Info, Star } from 'lucide-vue-next';
import useI18n from '@/composibles/useI18n';

const { t } = useI18n();
const version = '0.1.1';
const storeUrl = 'https://chromewebstore.google.com/detail/zen-history/flmobmbagdcdhajcehjocokfcjbenecg';
</script>

<template>
  <div class="space-y-12">
    <!-- Version Section -->
    <section class="space-y-6">
      <div class="flex items-center gap-x-2 pb-2 border-b">
        <Info class="size-5 text-primary" />
        <h3 class="text-lg font-bold">{{ t('About') }}</h3>
      </div>

      <div class="flex items-center justify-between py-2">
        <div class="space-y-1">
          <Label class="text-base font-semibold">{{ t('Version') }}</Label>
          <p class="text-sm text-muted-foreground">
            {{ t('Currently installed version of Zen History.') }}
          </p>
        </div>
        <span class="px-4 py-1.5 bg-muted rounded-full text-sm font-bold tracking-wider">
          v{{ version }}
        </span>
      </div>
    </section>

    <!-- Feedback Section -->
    <section class="space-y-6">
      <div class="flex items-center gap-x-2 pb-2 border-b">
        <Star class="size-5 text-primary" />
        <h3 class="text-lg font-bold">{{ t('Feedback & Support') }}</h3>
      </div>

      <div class="flex items-center justify-between py-2">
        <div class="space-y-1">
          <Label class="text-base font-semibold">{{ t('Rate on Web Store') }}</Label>
          <p class="text-sm text-muted-foreground">
            {{ t('Love Zen History? Support us by leaving a review on the Chrome Web Store.') }}
          </p>
        </div>
        <a 
          :href="storeUrl" 
          target="_blank" 
          class="flex items-center gap-x-2 px-6 h-11 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
        >
          {{ t('Give a Rating') }}
          <ExternalLink class="size-4" />
        </a>
      </div>
    </section>
  </div>
</template>
