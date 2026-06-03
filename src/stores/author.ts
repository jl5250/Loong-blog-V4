import { create } from "zustand";
import type { UserInfo } from "@/types/user";

interface AuthorState {
  author: UserInfo;
  setAuthor: (data: UserInfo) => void;
}

export const useAuthorStore = create<AuthorState>()((set) => ({
  author: {} as UserInfo,
  setAuthor: (data) => set({ author: data }),
}));
