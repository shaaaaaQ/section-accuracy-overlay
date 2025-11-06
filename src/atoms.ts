import { atomWithImmer } from "jotai-immer";
import type { OsuMode, Score } from "./types";
import { atom } from "jotai";

export const scoresAtom = atomWithImmer<Score[]>([])
export const gameStateAtom = atom<string>("menu")
export const gameModeAtom = atom<OsuMode | null>(null)