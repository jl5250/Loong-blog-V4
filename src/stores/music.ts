import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { MusicListItem } from "@/types/music";

const initialCurrentMusic = { initFlag: true } as MusicListItem & { initFlag?: boolean };

interface MusicState {
  dailyMusicList: MusicListItem[];
  changeDailyMusicList: (list: MusicListItem[]) => void;

  surgeMusicList: MusicListItem[];
  changeSurgeMusicList: (list: MusicListItem[]) => void;

  newMusicList: MusicListItem[];
  changeNewMusicList: (list: MusicListItem[]) => void;

  originalMusicList: MusicListItem[];
  changeOriginalMusicList: (list: MusicListItem[]) => void;

  hotMusicList: MusicListItem[];
  changeHotMusicList: (list: MusicListItem[]) => void;

  currentMusic: MusicListItem;
  changeCurrentMusic: (music: MusicListItem) => void;

  currentLyric: string;
  changeCurrentLyric: (lyric: string) => void;

  currentMusicType: string;
  changeCurrentMusicType: (type: string) => void;

  disabledKeys: string[];
  changeDisabledKeys: (keys: string[]) => void;

  duration: number;
  changeDuration: (d: number) => void;

  currentTime: number;
  changeCurrentTime: (t: number) => void;

  currentLyricIndex: number;
  changeCurrentLyricIndex: (idx: number) => void;
}

const initialState = {
  dailyMusicList: [] as MusicListItem[],
  surgeMusicList: [] as MusicListItem[],
  newMusicList: [] as MusicListItem[],
  originalMusicList: [] as MusicListItem[],
  hotMusicList: [] as MusicListItem[],
  currentMusic: initialCurrentMusic as MusicListItem,
  currentLyric: "",
  currentMusicType: "like",
  disabledKeys: [] as string[],
  duration: 0,
  currentTime: 0,
  currentLyricIndex: 0,
};

export const useMusicStore = create<MusicState>()(
  persist(
    (set) => ({
      ...initialState,

      changeDailyMusicList: (list) => set({ dailyMusicList: list }),
      changeSurgeMusicList: (list) => set({ surgeMusicList: list }),
      changeNewMusicList: (list) => set({ newMusicList: list }),
      changeOriginalMusicList: (list) => set({ originalMusicList: list }),
      changeHotMusicList: (list) => set({ hotMusicList: list }),
      changeCurrentMusic: (music) => set({ currentMusic: music }),
      changeCurrentLyric: (lyric) => set({ currentLyric: lyric }),
      changeCurrentMusicType: (type) => set({ currentMusicType: type }),
      changeDisabledKeys: (keys) => set({ disabledKeys: keys }),
      changeDuration: (d) => set({ duration: d }),
      changeCurrentTime: (t) => set({ currentTime: t }),
      changeCurrentLyricIndex: (idx) => set({ currentLyricIndex: idx }),
    }),
    {
      name: "music_storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
