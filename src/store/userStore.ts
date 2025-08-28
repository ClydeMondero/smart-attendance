import { create } from "zustand";

interface UserState {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

// Temporary store until we have a real auth system
const useUserStore = create<UserState>((set, get) => ({
  isLoggedIn: false,
  login: () => {
    set({ isLoggedIn: true });
    console.log("Logged in:", get().isLoggedIn);
  },
  logout: () => {
    set({ isLoggedIn: false });
    console.log("Logged out:", get().isLoggedIn);
  },
}));

export default useUserStore;
