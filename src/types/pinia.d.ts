import "pinia";

declare module "pinia" {
  export interface PiniaCustomProperties {
    $restoreFromStorage: () => Promise<void>;
  }

  export interface PiniaPluginContext {
    store: {
      $restoreFromStorage: () => Promise<void>;
    };
  }
}
