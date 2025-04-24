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

export const useSelectedSegmentStore = stateFactory('selectedSegment');
export const useSelectedSegmentStore2 = stateFactory('selectedSegment2');
export const useStageStore = stateFactory('stage');

export const useApprovalRefreshStore = stateFactory('approvalRefresh');

/** const [stage, setStage] = useState('');
  const [description, setDescription] = useState('');
  const [percentage, setPercentage] = useState(0);
  const [messages, setMessages] = useState([]); */

// import { create } from 'zustand';

export const usePayrollProgressStore = create((set) => ({
  stage: '',
  description: '',
  percentage: 0,
  messages: [],
  notifications: [], // Store notifications
  unreadNotifications: [], // Track unread notifications
  setStage: (stage) => set({ stage }),
  setDescription: (description) => set({ description }),
  setPercentage: (percentage) => set({ percentage }),
  setMessages: (messages) => set({ messages }),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, notification],
      unreadNotifications: [...state.unreadNotifications, notification],
    })),
  markAsRead: (notification) =>
    set((state) => ({
      unreadNotifications: state.unreadNotifications.filter(
        (n) => n !== notification
      ),
    })),
}));
