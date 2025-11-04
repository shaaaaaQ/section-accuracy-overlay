import type { OsuMode, Score } from "./types";

export function getNotesCount(score: Score): number {
    return Object.values(score).reduce((sum, val) => sum + val, 0);
}

export function getTotalNotesCount(scores: Score[]): number {
    return scores
        .map(getNotesCount)
        .reduce((sum, val) => sum + val, 0);
}

export function calculateAccuracy(mode: OsuMode, score: Score): number {
    switch (mode) {
        case "mania_v1": return calcManiaAccuracyV1(score);
        case "mania_v2": return calcManiaAccuracyV2(score);
        default: return 0;
    }
}

export function calcManiaAccuracyV1(score: Score): number {
    const { "0": n0, "50": n50, "100": n100, "300": n300, "geki": nGeki, "katu": nKatu } = score;

    const total = n0 + n50 + n100 + n300 + nGeki + nKatu;
    if (total === 0) return 0;

    const acc =
        (50 * n50 + 100 * n100 + 200 * nKatu + 300 * (n300 + nGeki)) /
        (300 * total);

    return acc * 100; // %
}
export function calcManiaAccuracyV2(score: Score): number {
    const { "0": n0, "50": n50, "100": n100, "300": n300, "geki": nGeki, "katu": nKatu } = score;

    const total = n0 + n50 + n100 + n300 + nGeki + nKatu;
    if (total === 0) return 0;

    const acc =
        (305 * nGeki + 300 * n300 + 200 * nKatu + 100 * n100 + 50 * n50) /
        (305 * total);

    return acc * 100; // %
}