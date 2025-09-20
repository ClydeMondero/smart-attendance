import api from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
      toast.success("User created successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to create user");
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
      toast.success("User updated successfully");
    },
    onError: () => toast.error("Failed to update user"),
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
      toast.success("User deleted");
    },
    onError: () => toast.error("Failed to delete user"),
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
      const { data } = await api.put(`/users/${id}/status`, { status });
      return data as UserItem;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["users"] });
      toast.success(
        vars.status === "active" ? "User enabled" : "User disabled"
      );
    },
    onError: () => toast.error("Failed to toggle user status"),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async ({ id, email }: { id: string; email: string }) => {
      const { data } = await api.post(`/users/${id}/reset-password`, { email });
      return data;
    },
    onSuccess: () => toast.success("Password reset email sent successfully"),
    onError: () => toast.error("Failed to reset password"),
  });
}

export function useUser(id?: string) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const { data } = await api.get(`/users/${id}`);
      return data as UserItem;
    },
    enabled: !!id,
  });
}

export function useConfirmResetPassword() {
  return useMutation({
    mutationFn: async (payload: {
      token: string;
      email: string;
      password: string;
      password_confirmation: string;
    }) => {
      const { data } = await api.post("/reset-password", payload);
      return data;
    },
    onSuccess: () => toast.success("Password reset successful"),
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to reset password"),
  });
}
