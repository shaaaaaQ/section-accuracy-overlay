import type { MapTiming } from "./types";

export const port = 24050;
export const mapTimings: MapTiming[] = await (await fetch("./data.json")).json()