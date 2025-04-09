import { create } from 'zustand';

const stateFactory = (key) =>
  create((set) => ({
    [key]: null,
    [`set${key.charAt(0).toUpperCase() + key.slice(1)}`]: (value) =>
      set({ [key]: value }),
  }));

export const useIgcIdStore = stateFactory('igcId');
export const useClickedItemStore = stateFactory('clickedItem');
export const usePostAndNatureStore = stateFactory('postAndNature');
export const usePeriodsOfAbsenceStore = stateFactory('periodsOfAbsence');
export const usePensionableSalaryStore = stateFactory('pensionableSalary');
export const usePensionableSalaryStore2 = stateFactory('pensionableSalary2');
export const useIgEditedStore = stateFactory('igcEdited');
export const useRevisionPayloadFetchedStore = stateFactory(
  'revisionPayloadFetched'
);
export const useRefreshDataStore = stateFactory('refreshData');
export const useFilteredDataStore = stateFactory('filteredData');

export const useRowDataSore = stateFactory('rowData');

export const useCapNameStore = stateFactory('capName');

export const useLoadedRetireeDetailsStore = stateFactory(
  'loadedRetireeDetails'
);

export const useAutopopulateNameStore = stateFactory('autopopulateName');

export const useStatusStore = stateFactory('status');

export const useHideBaseTableHeader = stateFactory('hideBaseTableHeader');

export const useSelectedIgcsStore = stateFactory('selectedIgcs');

export const useClickedIgcStore = stateFactory('clickedIgc');
