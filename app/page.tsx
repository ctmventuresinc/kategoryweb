"use client";

import { useState, useEffect, useRef } from "react";
import { Category, type UserAnswers } from "../types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GameResults } from "../components/game-results";
import { Analytics, track } from "@vercel/analytics/react";

export default function WordGame() {
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(33);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [timeTaken, setTimeTaken] = useState<number | null>(null);
  const startingLetter = "J";
  // 2-05-2025 was J
  // 2-05-2025 was P
  // 1-31-2025 was G
  // 1-29-2025 was A
  // 1-28-2025 was L
  // 1-27-2025 was H
  // 1-26-2025 was B.
  const inputRef = useRef<HTMLInputElement>(null);

  const categories = Object.values(Category);

  useEffect(() => {
    const storedDate = localStorage.getItem("gameCompletedDate");
    const today = new Date().toISOString().split("T")[0];

    if (storedDate === today) {
      setGameCompleted(true);
    } else {
      setStartTime(new Date());
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setGameCompleted(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, []);

  useEffect(() => {
    // Keep focus on input when moving between categories
    inputRef.current?.focus();
  }, []);

  const handleContinue = () => {
    // Track the answer submission
    track("answer_submitted", {
      category: categories[currentCategoryIndex],
      hasAnswer: Boolean(currentAnswer),
      timeRemaining,
    });

    // Store the current answer
    const category = categories[currentCategoryIndex]
      .toLowerCase()
      .replace(/\//g, "")
      .replace(/\s+/g, "") as keyof UserAnswers;
    setUserAnswers((prev) => ({
      ...prev,
      [category]: currentAnswer,
    }));

    // Store the completion date as soon as the user interacts
    localStorage.setItem(
      "gameCompletedDate",
      new Date().toISOString().split("T")[0]
    );

    // Clear input and move to next category
    setCurrentAnswer("");
    if (currentCategoryIndex < categories.length - 1) {
      setCurrentCategoryIndex((prev) => prev + 1);
    } else {
      setGameCompleted(true);
      if (startTime) {
        const endTime = new Date();
        setTimeTaken(
          Math.floor((endTime.getTime() - startTime.getTime()) / 1000)
        );
      }
    }
  };

  if (gameCompleted) {
    return <GameResults userAnswers={userAnswers} timeTaken={timeTaken} />;
  }

  return (
    <>
      <div className="min-h-dvh flex flex-col items-center px-4 pt-12 bg-white">
        <div className="w-full max-w-md flex flex-col items-center gap-4">
          {/* Progress and Timer */}
          <div className="text-center space-y-4">
            <p className="text-gray-500 font-semibold text-lg">
              {currentCategoryIndex + 1}/{categories.length}
            </p>
            <p className="font-semibold text-2xl"></p>
            <p className="text-red-500 font-semibold text-4xl">
              00:{timeRemaining < 10 ? "0" : ""}
              {timeRemaining}
            </p>
          </div>

          {/* Game Content */}
          <div className="flex-1 w-full flex flex-col items-center justify-center gap-8 my-12">
            <h1 className="text-2xl md:text-3xl font-bold text-center">
              Name a {categories[currentCategoryIndex]} That Starts With{" "}
              {startingLetter}
            </h1>

            <Input
              ref={inputRef}
              type="text"
              placeholder={`Enter ${categories[currentCategoryIndex]}`}
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              className="text-xl text-center h-14 rounded-full"
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          {/* Action Button */}
          <Button
            onClick={handleContinue}
            className="w-full h-14 rounded-full text-lg font-semibold"
            variant={currentAnswer ? "default" : "secondary"}
          >
            {currentAnswer ? "Continue" : "Skip"}
          </Button>
        </div>
      </div>
      <Analytics />
    </>
  );
}
