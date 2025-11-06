import { useEffect, useRef } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";
import { mapTimings, port } from "./consts";
import type { MapTiming, Score, Tosu } from "./types";
import { useAtom } from "jotai";
import { gameModeAtom, gameStateAtom, scoresAtom } from "./atoms";
import { getNotesCount, getTotalNotesCount } from "./utils";

function getGameMode(mode: number, mods: string[]) {
    switch (mode) {
        case 0: return "std"
        case 1: return "taiko"
        case 2: return "ctb"
        case 3:
            if (mods.includes("V2")) {
                return "mania_v2"
            } else {
                return "mania_v1"
            }
        default: return null
    }
}

export function WebSocket() {
    const [scores, setScores] = useAtom(scoresAtom)
    const [gameState, setGameState] = useAtom(gameStateAtom)
    const [gameMode, setGameMode] = useAtom(gameModeAtom)
    const beatmapHashRef = useRef("")
    const mapTimingRef = useRef<MapTiming | null>(null);
    const gameStateRef = useRef(gameState);
    const gameModeRef = useRef(gameMode)
    const scoresRef = useRef(scores);

    const resetScores = () => {
        const s: Score[] = []

        if (mapTimingRef.current) {
            for (let i = 0; i <= mapTimingRef.current.offsets.length; i++) {
                s.push({
                    "0": 0,
                    "50": 0,
                    "100": 0,
                    "300": 0,
                    "geki": 0,
                    "katu": 0,
                })
            }
        } else {
            s.push({
                "0": 0,
                "50": 0,
                "100": 0,
                "300": 0,
                "geki": 0,
                "katu": 0,
            })
        }

        setScores(s)
    }

    useEffect(() => {
        gameStateRef.current = gameState;
    }, [gameState]);

    useEffect(() => {
        scoresRef.current = scores;
    }, [scores]);

    useEffect(() => {
        gameModeRef.current = gameMode;
    }, [gameMode]);

    useEffect(() => {
        const socket = new ReconnectingWebSocket(`ws://127.0.0.1:${port}/websocket/v2`);

        socket.addEventListener("open", () => {
            console.log("WebSocket connected");
        });

        socket.addEventListener("message", (event) => {
            const data: Tosu = JSON.parse(event.data);

            if (data.state.name !== gameStateRef.current) {
                setGameState(data.state.name);
                console.log("Game state changed to:", data.state.name);
            }

            const currentGameMode = getGameMode(data.play.mode.number, data.play.mods.array.map(m => m.acronym));

            if (currentGameMode !== gameModeRef.current) {
                setGameMode(currentGameMode);
                console.log("Game mode changed to:", currentGameMode);
            }

            if (data.beatmap.checksum !== beatmapHashRef.current) {
                beatmapHashRef.current = data.beatmap.checksum;
                console.log("New beatmap detected:", data.beatmap.title, data.beatmap.version, data.beatmap.mapper);
                console.log("Beatmap hash:", beatmapHashRef.current);

                const mapData = mapTimings.find(m => m.hash === beatmapHashRef.current) || null;

                if (mapData) {
                    mapTimingRef.current = {
                        mode: mapData.mode,
                        hash: mapData.hash,
                        offsets: mapData.offsets.sort((a, b) => a - b)
                    }
                } else {
                    mapTimingRef.current = null;
                }

                console.log(mapTimingRef.current)

                resetScores()
            }

            const time = data.beatmap.time.live;
            let sectionIndex = 0;

            if (mapTimingRef.current && mapTimingRef.current.offsets.length > 0) {
                const { offsets } = mapTimingRef.current;
                for (let i = 0; i < offsets.length; i++) {
                    if (time >= offsets[i]) sectionIndex = i + 1;
                    else break;
                }
            }

            const totalCurrent = getTotalNotesCount(scoresRef.current);
            const totalIncoming = getNotesCount(data.play.hits);

            if (totalIncoming < totalCurrent) {
                console.log("Score reset detected");
                resetScores();
                return;
            }

            setScores((draft) => {
                const s = draft[sectionIndex];
                if (!s) return;

                // 各判定ごとに前セクションまでの合計を引く
                (Object.keys(s) as (keyof Score)[]).forEach((k) => {
                    const prevTotal = draft
                        .slice(0, sectionIndex)
                        .reduce((sum, sc) => sum + sc[k], 0);
                    s[k] = data.play.hits[k] - prevTotal;
                });
            });
        })

        socket.addEventListener("close", () => {
            console.log("WebSocket closed");
        });

        return () => {
            console.log("Cleaning up WebSocket");
            socket.close();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return null
}