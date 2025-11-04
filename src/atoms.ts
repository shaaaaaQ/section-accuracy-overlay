import { atomWithImmer } from "jotai-immer";
import type { OsuMode, Score } from "./types";
import { atom } from "jotai";

export const scoresAtom = atomWithImmer<Score[]>([])
export const modeAtom = atom<OsuMode>("mania_v1")
export const gameStateAtom = atom<string>("menu")