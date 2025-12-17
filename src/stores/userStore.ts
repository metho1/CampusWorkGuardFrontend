// src/stores/userStore.ts
import {create} from "zustand";
import {persist} from "zustand/middleware";

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

// export const useUserStore = create<UserState>((set) => ({
//   user: null,
//   setUser: (user) => set({user}),
//   updateUser: (partial) =>
//     set((state) => ({
//       user: state.user ? {...state.user, ...partial} : null,
//     })),
//   clearUser: () => set({user: null}),
// }));

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({user}),
      updateUser: (partial) =>
        set((state) => ({
          user: state.user ? {...state.user, ...partial} : null,
        })),
      clearUser: () => set({user: null}),
    }),
    {
      name: "user-store", // localStorage key
    }
  )
);
