import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { WebInfo, ThemeConfig, OtherConfig } from "@/types/config";

interface ConfigState {
  /** @deprecated Use useTheme() from @/lib/theme instead */
  isDark: boolean;
  setIsDark: (status: boolean) => void;

  web: WebInfo;
  setWeb: (data: WebInfo) => void;

  themeConfig: ThemeConfig;
  setThemeConfig: (data: ThemeConfig) => void;

  other: OtherConfig;
  setOther: (data: OtherConfig) => void;
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      isDark: false,
      setIsDark: (status) => set({ isDark: status }),

      web: {} as WebInfo,
      setWeb: (data) => set({ web: data }),

      themeConfig: {} as ThemeConfig,
      setThemeConfig: (data) => set({ themeConfig: data }),

      other: {} as OtherConfig,
      setOther: (data) => set({ other: data }),
    }),
    {
      name: "config_storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
