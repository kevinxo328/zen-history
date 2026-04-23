import vueI18n from '@intlify/unplugin-vue-i18n/vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import version from 'vite-plugin-package-version';
import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  outDir: 'dist',
  srcDir: 'src',
  vite: () => ({
    plugins: [
      tailwindcss(),
      version(),
      vueI18n({
        include: [path.resolve(__dirname, 'src/assets/locales/**')]
      })
    ]
  }),
  manifest: {
    permissions: ['history', 'storage', 'alarms', 'browsingData'],
    name: '__MSG_extName__',
    description: '__MSG_extDescription__',
    default_locale: 'en',
    options_page: 'settings.html'
  },
  // @ts-expect-error - submit is a valid wxt config key but missing from UserConfig types
  submit: {
    chrome: {
      clientId: process.env.CHROME_CLIENT_ID!,
      clientSecret: process.env.CHROME_CLIENT_SECRET!,
      refreshToken: process.env.CHROME_REFRESH_TOKEN!,
      extensionId: process.env.CHROME_EXTENSION_ID!
    }
  }
});
