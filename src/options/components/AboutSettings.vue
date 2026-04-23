<script lang="ts" setup>
import { Bug, ExternalLink, Info, Star } from 'lucide-vue-next';

import useI18n from '@/composibles/useI18n';

const { t } = useI18n();
const version = import.meta.env.PACKAGE_VERSION || browser.runtime.getManifest().version;
const storeUrl =
  'https://chromewebstore.google.com/detail/zen-history/flmobmbagdcdhajcehjocokfcjbenecg';
const bugReportUrl = 'https://github.com/kevinxo328/zen-history/issues/new?template=bug_report.yml';
</script>

<template>
  <div class="space-y-12">
    <!-- Version Section -->
    <section class="space-y-6">
      <div class="flex items-center gap-x-2 border-b pb-2">
        <Info class="text-primary size-5" />
        <h3 class="text-lg font-bold">{{ t('About') }}</h3>
      </div>

      <div class="flex items-center justify-between py-2">
        <div class="space-y-1">
          <Label class="text-base font-semibold">{{ t('Version') }}</Label>
          <p class="text-muted-foreground text-sm">
            {{ t('Currently installed version of Zen History.') }}
          </p>
        </div>
        <span class="bg-muted rounded-full px-4 py-1.5 text-sm font-bold tracking-wider">
          v{{ version }}
        </span>
      </div>
    </section>

    <!-- Feedback Section -->
    <section class="space-y-6">
      <div class="flex items-center gap-x-2 border-b pb-2">
        <Star class="text-primary size-5" />
        <h3 class="text-lg font-bold">{{ t('Feedback & Support') }}</h3>
      </div>

      <div class="flex items-center justify-between py-2">
        <div class="space-y-1">
          <Label class="text-base font-semibold">{{ t('Rate on Web Store') }}</Label>
          <p class="text-muted-foreground text-sm">
            {{ t('Love Zen History? Support us by leaving a review on the Chrome Web Store.') }}
          </p>
        </div>
        <a
          :href="storeUrl"
          target="_blank"
          class="bg-primary text-primary-foreground shadow-primary/20 flex h-11 items-center gap-x-2 rounded-xl px-6 font-bold shadow-lg transition-transform hover:scale-105"
        >
          {{ t('Give a Rating') }}
          <ExternalLink class="size-4" />
        </a>
      </div>

      <div class="flex items-center justify-between py-2">
        <div class="space-y-1">
          <Label class="text-base font-semibold">{{ t('Report an Issue') }}</Label>
          <p class="text-muted-foreground text-sm">
            {{ t('Encountered an issue? Help us improve by reporting bugs on GitHub.') }}
          </p>
        </div>
        <a
          :href="bugReportUrl"
          target="_blank"
          class="bg-muted text-muted-foreground hover:bg-muted/80 flex h-11 items-center gap-x-2 rounded-xl px-6 font-bold transition-colors"
        >
          {{ t('Report on GitHub') }}
          <Bug class="size-4" />
        </a>
      </div>
    </section>
  </div>
</template>
