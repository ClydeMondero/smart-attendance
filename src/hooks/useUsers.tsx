import api from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type UserItem = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "teacher" | "operator";
  status: "active" | "disabled";
};

// --- Fetch all users ---
export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await api.get("/users");
      return data as UserItem[];
    },
  });
}

// --- Mutations ---
export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      payload: Omit<UserItem, "id"> & { password: string }
    ) => {
      const { data } = await api.post("/users", payload);
      return data as UserItem;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<UserItem> & { id: string }) => {
      const { id, ...rest } = payload;
      const { data } = await api.put(`/users/${id}`, rest);
      return data as UserItem;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/users/${id}`);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useToggleStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: "active" | "disabled";
    }) => {
      const { data } = await api.put(`/users/${id}`, { status });
      return data as UserItem;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useResetPassword() {
  // depends on whether you create a dedicated endpoint in Laravel
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      // Example: POST /users/{id}/reset-password
      const { data } = await api.post(`/users/${id}/reset-password`);
      return data;
    },
  });
}
