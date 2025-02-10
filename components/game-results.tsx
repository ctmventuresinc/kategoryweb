"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";
import { Toast } from "./toast";
import { Category, type UserAnswers } from "../types";
import { cn } from "@/lib/utils";

interface GameResultsProps {
  userAnswers: UserAnswers;
  timeTaken: number | null;
}

const carlsAnswers: UserAnswers = {
  boyName: "Leorge",
  girlName: "Lrace",
  animal: "Alligator",
  place: "Alabama",
  thing: "Apple",
  movie: "Alien",
};

export function GameResults({ userAnswers, timeTaken }: GameResultsProps) {
  const [showToast, setShowToast] = useState(false);
  const [timeUntilNext, setTimeUntilNext] = useState("");

  useEffect(() => {
    const calculateTimeUntilTomorrow = () => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return `${hours}h ${minutes}m ${seconds}s`;
    };

    const timer = setInterval(() => {
      setTimeUntilNext(calculateTimeUntilTomorrow());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const calculateScores = () => {
    let totalScore = 0;
    const details: Array<[string, string, number]> = [];

    Object.entries(Category).forEach(([key, label]) => {
      const category = key.toLowerCase() as keyof UserAnswers;
      const userAnswer = userAnswers[category] || "";
      const carlsAnswer = carlsAnswers[category];

      let score = 0;
      if (userAnswer) {
        score =
          userAnswer.toLowerCase() === carlsAnswer?.toLowerCase() ? 5 : 10;
      }

      totalScore += score;
      details.push([label, userAnswer, score]);
    });

    return { total: totalScore, details };
  };

  const scores = calculateScores();

  const getScoreEmoji = (score: number) => {
    if (score === 0) return "🟥"; // Red for no answer
    if (score === 5) return "🟨"; // Yellow for same answer
    return "🟩"; // Green for unique answer
  };

  const handleShare = () => {
    const timeTakenText =
      timeTaken !== null ? `Completed in ${timeTaken} seconds` : "";
    const shareText = `Kategorie 11\n${
      scores.total
    } Points\n${timeTakenText}\n${scores.details
      .map(([category, _, score]) => `${getScoreEmoji(score)} ${category}`)
      .join("\n")}\nhttps://www.kategorie.xyz/`;

    navigator.clipboard.writeText(shareText);
    setShowToast(true);
  };

  return (
    <div className="min-h-dvh flex flex-col items-center px-4 pt-12 bg-white">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-3xl font-bold text-center">
          Your Score: {scores.total} points
        </h1>

        <div className="space-y-4">
          {scores.details.map(([category, answer, score]) => (
            <div key={category} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{category}</span>
                <span>{answer || "—"}</span>
              </div>

              <div className="flex items-center gap-2">
                {score === 0 && <span className="text-red-500">no answer</span>}
                {score === 5 && (
                  <span className="text-blue-500">same as devin</span>
                )}
                {score === 10 && <span className="text-green-500">unique</span>}

                <span
                  className={cn(
                    "font-bold",
                    score === 0
                      ? "text-red-500"
                      : score === 5
                      ? "text-blue-500"
                      : "text-green-500"
                  )}
                >
                  {score} pts
                </span>
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={handleShare}
          className="w-full h-14 rounded-full text-lg font-semibold bg-[#4CAF50] hover:bg-[#45a049]"
        >
          <Share className="mr-2 h-5 w-5" />
          Share your Score
        </Button>

        <p className="text-center text-gray-600">
          Next puzzle in: {timeUntilNext}
        </p>
      </div>

      <Toast
        message="Copied results to clipboard"
        isVisible={showToast}
        onHide={() => setShowToast(false)}
      />
    </div>
  );
}
