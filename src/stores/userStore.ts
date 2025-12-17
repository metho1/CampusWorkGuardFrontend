// src/stores/userStore.ts
import {create} from "zustand";

export interface UserInfo {
  role: "student" | "company" | "admin";
  name?: string;
  avatar_url?: string;
  verify_status?: "pending" | "verified" | "unverified";
  fail_info?: string;
}

interface UserState {
  user: UserInfo | null;
  setUser: (user: UserInfo) => void;
  updateUser: (partial: Partial<UserInfo>) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({user}),
  updateUser: (partial) =>
    set((state) => ({
      user: state.user ? {...state.user, ...partial} : null,
    })),
  clearUser: () => set({user: null}),
}));
