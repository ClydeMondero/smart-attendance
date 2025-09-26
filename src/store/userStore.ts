import { setApiAuthToken } from "@/lib/api";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: number;
  name: string;
  email: string;
  role: "teacher" | "admin"; // adjust roles here
  status: "active" | "disabled";
}

interface UserState {
  isLoggedIn: boolean;
  role: User["role"] | null;
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      role: null,
      user: null,
      token: null,

      login: (user, token) => {
        setApiAuthToken(token);
        set({ isLoggedIn: true, role: user.role, user, token });
      },

      logout: () => {
        setApiAuthToken(null);
        set({ isLoggedIn: false, role: null, user: null, token: null });
      },
    }),
    {
      name: "user-store",
      onRehydrateStorage: () => (state) => {
        const token = state?.token ?? null;
        setApiAuthToken(token);
      },
    }
  )
);

export default useUserStore;
