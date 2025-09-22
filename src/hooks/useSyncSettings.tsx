import { useSettings } from "@/hooks/useSettings";
import useSettingStore from "@/store/useSettingStore";
import { useEffect } from "react";

export function useSyncSettings() {
  const { data } = useSettings();
  const setAllowGrades = useSettingStore((s) => s.setAllowGrades);

  useEffect(() => {
    if (data) setAllowGrades(data.allow_grades);
  }, [data, setAllowGrades]);
}
