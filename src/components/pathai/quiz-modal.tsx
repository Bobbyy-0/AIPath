
"use client";

import { useState } from "react";
// Update the import path below to the correct relative path where quiz-schemas is located.
// For example, if it's in src/ai/schemas/quiz-schemas.ts, use:
import type { GenerateQuizOutput, QuizQuestion } from "../../ai/schemas/quiz-schemas";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  quiz: GenerateQuizOutput;
}

export function QuizModal({ isOpen, onClose, quiz }: QuizModalProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  const handleNext = () => {
    if (!showResult) {
      setShowResult(true);
      if (isCorrect) {
        setScore((prev) => prev + 1);
      }
    } else {
      setShowResult(false);
      setSelectedAnswer(null);
      if (currentQuestionIndex < quiz.questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        // Quiz finished
      }
    }
  };

  const handleFinish = () => {
    // Reset state and close
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    onClose();
  };

  const isQuizFinished = showResult && currentQuestionIndex === quiz.questions.length - 1;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Test Your Knowledge</DialogTitle>
          <DialogDescription>
            Let's see what you've learned. Answer the questions below.
          </DialogDescription>
        </DialogHeader>

        <Progress value={((currentQuestionIndex + (showResult ? 1 : 0)) / quiz.questions.length) * 100} className="w-full" />


        {currentQuestionIndex < quiz.questions.length && !isQuizFinished ? (
          <div className="my-4">
            <h3 className="text-lg font-semibold mb-4">
              ({currentQuestionIndex + 1}/{quiz.questions.length}) {currentQuestion.questionText}
            </h3>
            <RadioGroup
              value={selectedAnswer ?? undefined}
              onValueChange={setSelectedAnswer}
              disabled={showResult}
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 my-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>

            {showResult && (
              <Card className={`mt-4 ${isCorrect ? "bg-green-100 dark:bg-green-900 border-green-500" : "bg-red-100 dark:bg-red-900 border-red-500"}`}>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    {isCorrect ? <CheckCircle className="text-green-500 mr-2" /> : <XCircle className="text-red-500 mr-2" />}
                    <h4 className="font-semibold">{isCorrect ? "Correct!" : "Incorrect"}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{currentQuestion.explanation}</p>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
            <div className="text-center my-8">
                <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
                <p className="text-xl text-muted-foreground">You scored</p>
                <p className="text-6xl font-bold my-4 text-primary">{score} / {quiz.questions.length}</p>
            </div>
        )}

        <DialogFooter>
          {isQuizFinished ? (
            <Button onClick={handleFinish} className="w-full">Finish</Button>
          ) : (
            <Button onClick={handleNext} disabled={!selectedAnswer} className="w-full">
              {showResult ? "Next Question" : "Check Answer"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
