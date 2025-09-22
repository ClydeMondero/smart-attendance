import { create } from "zustand";

interface SettingState {
  allowGrades: boolean;
  setAllowGrades: (allowGrades: boolean) => void;
}

const useSettingStore = create<SettingState>((set) => ({
  allowGrades: false,
  setAllowGrades: (allowGrades) => set({ allowGrades }),
}));

export default useSettingStore;
