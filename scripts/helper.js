import ReconnectingWebSocket from "reconnecting-websocket";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import readline from "readline";

const PORT = 24050;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const savePath = path.resolve(__dirname, "../public/data.json");

const maps = JSON.parse(fs.readFileSync(savePath, "utf8"));

let currentData = null;
let currentMode = "mania_v1";

const socket = new ReconnectingWebSocket(`ws://127.0.0.1:${PORT}/websocket/v2`);

socket.addEventListener("open", () => {
    console.log("WebSocket connected");
});

socket.addEventListener("message", (event) => {
    try {
        const data = JSON.parse(event.data);
        currentData = data;
    } catch (err) {
        console.error("Error parsing data:", err);
    }
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

console.log("Type commands: `mode {name}`, `a` to add offset, Ctrl+C to exit");

rl.on("line", (input) => {
    const args = input.trim().split(" ");

    // mode切り替え
    if (args[0] === "mode" && args[1]) {
        currentMode = args[1];
        console.log(`Mode set to ${currentMode}`);
        return;
    }

    // offset追加
    if (args[0] === "a") {
        if (!currentData || !currentData.beatmap || !currentData.beatmap.checksum) {
            console.log("No beatmap data yet.");
            return;
        }

        const { title, version, mapper, checksum } = currentData.beatmap;
        const name = `${title} [${version}] ${mapper}`;
        const time = currentData.beatmap.time.live;

        let map = maps.find((m) => m.hash === checksum);
        if (!map) {
            map = { name, hash: checksum, mode: currentMode, offsets: [] };
            maps.push(map);
            console.log(`New map added: ${name}`);
        }

        map.mode = currentMode;
        map.offsets.push(time);
        map.offsets.sort((a, b) => a - b);

        console.log(`Added offset ${time} to ${map.name}`);
    }
});

process.on("SIGINT", () => {
    console.log("\nSaving data...");
    fs.writeFileSync(savePath, JSON.stringify(maps, null, 4), "utf8");
    console.log("Data saved to", savePath);
    process.exit(0);
});