import { useAtomValue } from "jotai";
import { gameStateAtom, gameModeAtom, scoresAtom } from "./atoms";
import type { Score } from "./types";
import { calculateAccuracy } from "./acc";
import { clsx } from "clsx";
import AnimatedNumber from "./AnimatedNumber";

export default function App() {
  const scores = useAtomValue(scoresAtom);
  const gameState = useAtomValue(gameStateAtom)

  return (
    <div className={clsx(
      "w-[455px] bg-black/50 rounded text-zinc-200 transition-opacity",
      gameState === "play" ? "opacity-100 duration-750" : "opacity-0"
    )}>
      {scores.map((score, index) => (
        <ScorePanel key={index} score={score} />
      ))}
    </div>
  )
}


function ScorePanel({ score }: { score: Score }) {
  const mode = useAtomValue(gameModeAtom)

  return (
    <>
      {mode === "mania_v1" && <ManiaScoreView score={score} isV2={false} />}
      {mode === "mania_v2" && <ManiaScoreView score={score} isV2={true} />}
      {mode === "taiko" && <TaikoScoreView score={score} />}
    </>
  )
}

function ManiaScoreView({ score, isV2 }: { score: Score, isV2: boolean }) {
  const acc = calculateAccuracy(isV2 ? "mania_v2" : "mania_v1", score)

  const hitCounts = [
    { value: score.geki, color: "bg-yellow-200" },
    { value: score["300"], color: "bg-amber-400" },
    { value: score.katu, color: "bg-green-300" },
    { value: score["100"], color: "bg-blue-400" },
    { value: score["50"], color: "bg-purple-400" },
    { value: score["0"], color: "bg-red-400" },
  ]

  return (
    <ScoreView acc={acc} hitCounts={hitCounts} />
  )
}

function TaikoScoreView({ score }: { score: Score }) {
  const acc = calculateAccuracy("taiko", score)

  const hitCounts = [
    { value: score["300"] - score["geki"], color: "bg-amber-400" },
    { value: score["100"] - score["katu"], color: "bg-green-300" },
    { value: score["0"], color: "bg-red-400" },
    { value: score["geki"], color: "bg-amber-400" },
    { value: score["katu"], color: "bg-green-300" },
  ]

  return (
    <ScoreView acc={acc} hitCounts={hitCounts} />
  )
}

function ScoreView({ acc, hitCounts }: { acc: number, hitCounts: { value: number, color: string }[] }) {
  return (
    <div className="flex justify-end items-center p-4 w-full">
      <div className="text-6xl font-bold leading-none">
        <AnimatedNumber value={acc} decimalPlaces={2} />
      </div>

      <div className="grid grid-cols-3 gap-1 ml-4">
        {hitCounts.map(({ value, color }, index) => (
          <div key={index} className="flex items-center text-lg">
            <div className={clsx(
              "w-2 h-6 rounded-sm shrink-0",
              color
            )} />
            <span className="ml-2 w-13"><AnimatedNumber value={value} /></span>
          </div>
        ))}
      </div>
    </div>
  )
}