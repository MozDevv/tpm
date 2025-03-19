import { create } from 'zustand';

const stateFactory = (key) =>
  create((set) => ({
    [key]: null,
    [`set${key.charAt(0).toUpperCase() + key.slice(1)}`]: (value) =>
      set({ [key]: value }),
  }));

export const useIgcIdStore = stateFactory('igcId');
export const useClickedItemStore = stateFactory('clickedItem');
