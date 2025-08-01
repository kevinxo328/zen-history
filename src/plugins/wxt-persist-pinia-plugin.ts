import type {PiniaPluginContext} from "pinia";

type StoragePluginOptions = {
  prefix?: "local" | "session" | "managed" | "sync";
};

export function CreateWxtPersistPiniaPlugin(
  options: StoragePluginOptions = {}
) {
  const {prefix = "local"} = options;

  return ({store}: PiniaPluginContext) => {
    const key = `${prefix}:${store.$id}` as const;

    const restoreFromStorage = async (): Promise<void> => {
      try {
        const savedState = await storage.getItem<any>(key);
        if (savedState && typeof savedState === "object") {
          store.$patch(savedState);
        }
      } catch (error) {
        console.error(
          `Failed to restore store ${store.$id} from storage:`,
          error
        );
      }
    };

    const saveToStorage = async (state: any): Promise<void> => {
      try {
        await storage.setItem(key, state);
      } catch (error) {
        console.error(`Failed to save store ${store.$id} to storage:`, error);
      }
    };

    store.$subscribe(
      (_, state) => {
        saveToStorage(state);
      },
      {
        detached: true, // Ensure the subscription is detached to avoid memory leaks
      }
    );

    // Attach the restoreFromStorage method to the store instance
    store.$restoreFromStorage = restoreFromStorage;
  };
}
