import { create } from "zustand";

interface UserState {
  isLoggedIn: boolean;
  login: (role: "teacher" | "admin") => void;
  logout: () => void;
  role: "teacher" | "admin" | null;
}

// Temporary store until we have a real auth system
const useUserStore = create<UserState>((set) => ({
  isLoggedIn: false,
  role: null,
  login: (role) => {
    set({ isLoggedIn: true, role });
    // console.log("Logged in:", get().isLoggedIn, "as", get().role);
  },
  logout: () => {
    set({ isLoggedIn: false, role: null });
    // console.log("Logged out:", get().isLoggedIn);
  },
}));

export default useUserStore;
