import { create } from "zustand";

interface SettingState {
  allowGrades: boolean;
  schoolInTemplate: string;
  schoolOutTemplate: string;
  classAttendanceTemplate: string;
  classAbsenceTemplate: string;
  subjectAttendanceTemplate: string;
  subjectAbsenceTemplate: string;
  setAllowGrades: (allowGrades: boolean) => void;
  setSchoolInTemplate: (schoolInTemplate: string) => void;
  setSchoolOutTemplate: (schoolOutTemplate: string) => void;
  setClassAttendanceTemplate: (classAttendanceTemplate: string) => void;
  setClassAbsenceTemplate: (classAbsenceTemplate: string) => void;
  setSubjectAttendanceTemplate: (subjectAttendanceTemplate: string) => void;
  setSubjectAbsenceTemplate: (subjectAbsenceTemplate: string) => void;
}

const useSettingStore = create<SettingState>((set) => ({
  allowGrades: false,
  schoolInTemplate: "",
  schoolOutTemplate: "",
  classAttendanceTemplate: "",
  classAbsenceTemplate: "",
  subjectAttendanceTemplate: "",
  subjectAbsenceTemplate: "",
  setAllowGrades: (allowGrades) => set({ allowGrades }),
  setSchoolInTemplate: (schoolInTemplate) => set({ schoolInTemplate }),
  setSchoolOutTemplate: (schoolOutTemplate) => set({ schoolOutTemplate }),
  setClassAttendanceTemplate: (classAttendanceTemplate) =>
    set({ classAttendanceTemplate }),
  setClassAbsenceTemplate: (classAbsenceTemplate) =>
    set({ classAbsenceTemplate }),
  setSubjectAttendanceTemplate(subjectAttendanceTemplate) {
    set({ subjectAttendanceTemplate });
  },
  setSubjectAbsenceTemplate(subjectAbsenceTemplate) {
    set({ subjectAbsenceTemplate });
  },
}));

export default useSettingStore;
