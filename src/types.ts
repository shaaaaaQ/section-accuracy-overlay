export type OsuMode = "osu" | "taiko" | "catch" | "mania_v1" | "mania_v2";

export type MapTiming = {
    mode: OsuMode
    hash: string
    offsets: number[]
}

export type Score = {
    "0": number
    "50": number
    "100": number
    "300": number
    "geki": number
    "katu": number
}

export type Tosu = {
    state: {
        number: number
        name: string
    }
    beatmap: {
        time: {
            live: number;
            firstObject: number;
            lastObject: number;
        }
        id: number;
        set: number;
        artist: string;
        artistUnicode: string;
        title: string;
        titleUnicode: string;
        mapper: string;
        version: string;
        checksum: string;
        stats: {
            stars: {
                live: number;
                total: number;
            }
            od: {
                original: number;
                converted: number;
            };
            hp: {
                original: number;
                converted: number;
            }
            bpm: TosuBPM
        }
    }
    play: {
        playerName: string
        hits: Score
    }
    resultsScreen: {
        playerName: string
    }
}

export type TosuBPM = {
    realtime: number;
    common: number;
    min: number;
    max: number;
}