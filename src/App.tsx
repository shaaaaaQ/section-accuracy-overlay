import { useAtomValue } from "jotai";
import { gameStateAtom, modeAtom, scoresAtom } from "./atoms";
import type { Score } from "./types";
import { calculateAccuracy } from "./utils";
import { clsx } from "clsx";
import AnimatedNumber from "./AnimatedNumber";

export default function App() {
  const scores = useAtomValue(scoresAtom);
  const gameState = useAtomValue(gameStateAtom)

  return (
    <div className={clsx(
      "w-[493px] bg-black/50 rounded text-zinc-200 transition-opacity",
      gameState === "play" ? "opacity-100 duration-750" : "opacity-0"
    )}>
      {scores.map((score, index) => (
        <ScoreDisplay key={index} score={score} />
      ))}
    </div>
  )
}


function ScoreDisplay({ score }: { score: Score }) {
  const mode = useAtomValue(modeAtom)

  return (
    <>
      {mode === "mania_v1" && <ManiaScoreDisplay score={score} isV2={false} />}
      {mode === "mania_v2" && <ManiaScoreDisplay score={score} isV2={true} />}
    </>
  )
}

function ManiaScoreDisplay({ score, isV2 }: { score: Score, isV2: boolean }) {
  const acc = calculateAccuracy(isV2 ? "mania_v2" : "mania_v1", score)

  const hitCounts = [
    { value: score.geki ?? 0, color: "bg-yellow-200" },
    { value: score["300"], color: "bg-amber-400" },
    { value: score.katu ?? 0, color: "bg-green-300" },
    { value: score["100"], color: "bg-blue-400" },
    { value: score["50"], color: "bg-purple-400" },
    { value: score["0"], color: "bg-red-400" },
  ]

  return (
    <div className="flex justify-end items-center p-4 w-full">
      <div className="text-6xl font-bold leading-none">
        <AnimatedNumber value={acc} decimalPlaces={2} />%
      </div>

      <div className="grid grid-cols-3 gap-1 ml-4">
        {hitCounts.map(({ value, color }, index) => (
          <div key={index} className="flex items-center text-lg">
            <div className={clsx(
              "w-2 h-6 rounded-sm shrink-0",
              color
            )} />
            <span className="ml-2 w-10 mr-2"><AnimatedNumber value={value} /></span>
          </div>
        ))}
      </div>
    </div>
  )
}