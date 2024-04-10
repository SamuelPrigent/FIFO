import { create } from "zustand";
import { persist } from "zustand/middleware";

interface QueueState {
  queueStore: string[];
  addInQueueLS: (actionType: string) => void;
  resetQueueLS: () => void;
  removeActionFromQueueLS: (index: number) => void;
  setQueueLS: (newQueue: string[]) => void; // Ajout de la nouvelle méthode
}

const useQueueStore = create(
  persist<QueueState>(
    (set) => ({
      queueStore: [],
      addInQueueLS: (actionType: string) =>
        set((state) => ({ queueStore: [...state.queueStore, actionType] })),
      resetQueueLS: () => set({ queueStore: [] }),
      removeActionFromQueueLS: (index: number) =>
        set((state) => ({
          queueStore: [
            ...state.queueStore.slice(0, index),
            ...state.queueStore.slice(index + 1),
          ],
        })),
      setQueueLS: (newQueue: string[]) => set({ queueStore: newQueue }),
    }),
    {
      name: "queue-storage", // clé utilisée pour le localStorage
    }
  )
);

export default useQueueStore;
