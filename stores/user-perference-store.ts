import {defineStore} from "pinia";
import {Theme} from "@/types/user-perference";

function getDefaultTheme(): Theme {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? Theme.DARK
      : Theme.LIGHT;
  }
  return Theme.LIGHT;
}

export const useUserPreferenceStore = defineStore("userPreference", {
  state: () => ({
    theme: getDefaultTheme(),
  }),
  getters: {
    isDarkTheme: (state) => state.theme === Theme.DARK,
  },
  actions: {
    toggleTheme() {
      this.theme = this.theme === Theme.DARK ? Theme.LIGHT : Theme.DARK;
    },
  },
});
