import { useSettings } from "@/hooks/useSettings";
import useSettingStore from "@/store/useSettingStore";
import { useEffect } from "react";

export function useSyncSettings() {
  const { data } = useSettings();
  const {
    setAllowGrades,
    setSchoolInTemplate,
    setSchoolOutTemplate,
    setClassAttendanceTemplate,
    setClassAbsenceTemplate,
    setSubjectAttendanceTemplate,
    setSubjectAbsenceTemplate,
  } = useSettingStore();

  useEffect(() => {
    if (data) {
      setAllowGrades(!!data.allow_grades);
      setSchoolInTemplate(data.school_in_template);
      setSchoolOutTemplate(data.school_out_template);
      setClassAttendanceTemplate(data.class_in_template);
      setClassAbsenceTemplate(data.class_absent_template);
      setSubjectAttendanceTemplate(data.subject_in_template);
      setSubjectAbsenceTemplate(data.subject_absent_template);
    }
  }, [
    data,
    setAllowGrades,
    setSchoolInTemplate,
    setSchoolOutTemplate,
    setClassAttendanceTemplate,
    setClassAbsenceTemplate,
    setSubjectAttendanceTemplate,
    setSubjectAbsenceTemplate,
  ]);
}
