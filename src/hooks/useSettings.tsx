import api from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const res = await api.get("/settings");
      return res.data;
    },
  });
}

export function useToggleSettings(id: number = 1) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newValue: boolean) => {
      const res = await api.patch(`/settings/${id}`, {
        allow_grades: newValue ? 1 : 0,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}

const Templates = {
  schoolInTemplate: "school_in_template",
  schoolOutTemplate: "school_out_template",
  classAttendanceTemplate: "class_in_template",
} as const;

export type Templates = (typeof Templates)[keyof typeof Templates];

type UpdatePayload = {
  templateSetting: Templates;
  newValue: string;
};

export function useTemplateSettings(id: number = 1) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ templateSetting, newValue }: UpdatePayload) => {
      const res = await api.patch(`/settings/${id}`, {
        [templateSetting]: newValue,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}
