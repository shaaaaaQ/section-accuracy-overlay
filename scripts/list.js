import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.resolve(__dirname, "../public/data.json");
const outputDir = path.resolve(__dirname, "../DanList");

const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

const modeMap = {
    mania_v1: "mania",
    mania_v2: "mania",
    taiko: "taiko",
    osu: "osu",
    catch: "catch",
};

// モード別に仕分け
const grouped = {};
for (const item of data) {
    const normalizedMode = modeMap[item.mode];
    if (!normalizedMode) continue;
    if (!grouped[normalizedMode]) grouped[normalizedMode] = [];
    grouped[normalizedMode].push(item.name);
}

// 出力フォルダを作成
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// 各モードをソートして出力
for (const [mode, names] of Object.entries(grouped)) {
    if (names.length === 0) continue;

    const sorted = names.sort((a, b) => a.localeCompare(b, "en"));
    const outputPath = path.join(outputDir, `${mode}.txt`);
    fs.writeFileSync(outputPath, sorted.join("\n"), "utf-8");

    console.log(`${mode}.txt generated (${sorted.length} entries)`);
}