import type { Score } from "./types";

export function getNotesCount(score: Score): number {
    return Object.values(score).reduce((sum, val) => sum + val, 0);
}

export function getTotalNotesCount(scores: Score[]): number {
    return scores
        .map(getNotesCount)
        .reduce((sum, val) => sum + val, 0);
}