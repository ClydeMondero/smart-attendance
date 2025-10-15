import { create } from "zustand";

interface SettingState {
  allowGrades: boolean;
  schoolInTemplate: string;
  schoolOutTemplate: string;
  classAttendanceTemplate: string;
  classAbsenceTemplate: string;
  setAllowGrades: (allowGrades: boolean) => void;
  setSchoolInTemplate: (schoolInTemplate: string) => void;
  setSchoolOutTemplate: (schoolOutTemplate: string) => void;
  setClassAttendanceTemplate: (classAttendanceTemplate: string) => void;
  setClassAbsenceTemplate: (classAbsenceTemplate: string) => void;
}

const useSettingStore = create<SettingState>((set) => ({
  allowGrades: false,
  schoolInTemplate: "",
  schoolOutTemplate: "",
  classAttendanceTemplate: "",
  classAbsenceTemplate: "",
  setAllowGrades: (allowGrades) => set({ allowGrades }),
  setSchoolInTemplate: (schoolInTemplate) => set({ schoolInTemplate }),
  setSchoolOutTemplate: (schoolOutTemplate) => set({ schoolOutTemplate }),
  setClassAttendanceTemplate: (classAttendanceTemplate) =>
    set({ classAttendanceTemplate }),
  setClassAbsenceTemplate: (classAbsenceTemplate) =>
    set({ classAbsenceTemplate }),
}));

export default useSettingStore;
