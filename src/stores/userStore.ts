import {create} from "zustand";

interface UserState {
  user: any | null;
  setUser: (user: any) => void;
  updateAvatar: (url: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updateAvatar: (url) =>
    set((state) => ({ user: state.user ? { ...state.user, avatar_url: url } : null })),
}));
