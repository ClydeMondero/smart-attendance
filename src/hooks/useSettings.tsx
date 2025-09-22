// hooks/useSettings.ts
import api from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const res = await api.get("/settings");
      return res.data; // { allow_grades: boolean }
    },
  });
}

export function useToggleSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newValue: boolean) => {
      const res = await api.post("/settings", { allow_grades: newValue });
      return res.data;
    },
    onSuccess: () => {
      // refetch settings after update
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}
