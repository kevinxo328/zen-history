import type { PiniaPluginContext, StateTree } from 'pinia';

type StoragePluginOptions = {
  prefix?: 'local' | 'session' | 'managed' | 'sync';
};

export function CreateWxtPersistPiniaPlugin(options: StoragePluginOptions = {}) {
  const { prefix = 'local' } = options;

  return ({ store }: PiniaPluginContext) => {
    const key = `${prefix}:${store.$id}` as const;
    let isRestoring = false;

    const restoreFromStorage = async (): Promise<void> => {
      try {
        isRestoring = true;
        const savedState = await storage.getItem<StateTree>(key);
        if (savedState && typeof savedState === 'object') {
          store.$patch(savedState);
        }
      } catch (error) {
        console.error(`Failed to restore store ${store.$id} from storage:`, error);
      } finally {
        isRestoring = false;
      }
    };

    const saveToStorage = async (state: StateTree): Promise<void> => {
      if (isRestoring) return;
      try {
        const plainState = JSON.parse(JSON.stringify(state));
        await storage.setItem(key, plainState);
      } catch (error) {
        console.error(`Failed to save store ${store.$id} to storage:`, error);
      }
    };

    // Watch for changes from other pages (unwatch intentionally discarded - no teardown hook available)
    void storage.watch<StateTree>(key, (newState) => {
      if (newState) {
        isRestoring = true;
        try {
          store.$patch(newState);
        } finally {
          isRestoring = false;
        }
      }
    });

    store.$subscribe(
      (_, state) => {
        saveToStorage(state);
      },
      {
        detached: true // Ensure the subscription is detached to avoid memory leaks
      }
    );

    // Attach the restoreFromStorage method to the store instance
    store.$restoreFromStorage = restoreFromStorage;
  };
}
