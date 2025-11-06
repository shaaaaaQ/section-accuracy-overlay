import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.resolve(__dirname, "../public/data.json");
const outputPath = path.resolve(__dirname, "../DanList.txt");

const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

const allNames = data
    .map((item) => item.name)
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true, sensitivity: "base" }));

fs.writeFileSync(outputPath, allNames.join("\n") + "\n", "utf-8");

console.log(`DanList.txt generated (${allNames.length} entries)`);