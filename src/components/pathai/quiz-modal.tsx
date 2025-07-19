
"use client";

import { useState, useMemo } from 'react';
import type { QuizQuestion } from '@/ai/flows/generate-quiz-flow';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, Award, Brain, Lightbulb } from 'lucide-react';

interface QuizModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  questions: QuizQuestion[];
}

export function QuizModal({ isOpen, onOpenChange, questions }: QuizModalProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>(
    Array(questions.length).fill(null)
  );
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isQuizFinished = currentQuestionIndex >= questions.length;

  const score = useMemo(() => {
    return selectedAnswers.reduce((acc, answer, index) => {
      if (answer === questions[index].correctAnswer) {
        return acc + 1;
      }
      return acc;
    }, 0);
  }, [selectedAnswers, questions]);

  const handleAnswerSelect = (option: string) => {
    if (isAnswered) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = option;
    setSelectedAnswers(newAnswers);
    setIsAnswered(true);
  };

  const handleNext = () => {
    setIsAnswered(false);
    setCurrentQuestionIndex(prev => prev + 1);
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers(Array(questions.length).fill(null));
    setIsAnswered(false);
  };

  const handleClose = () => {
    handleRestart();
    onOpenChange(false);
  };

  const progressValue = isQuizFinished ? 100 : ((currentQuestionIndex) / questions.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl">
            <Brain className="mr-2 h-6 w-6 text-primary" />
            Test Your Mind Quiz
          </DialogTitle>
          <DialogDescription>
            Let's see how much you've learned. Good luck!
          </DialogDescription>
        </DialogHeader>
        
        <Progress value={progressValue} className="w-full my-4" />

        {!isQuizFinished ? (
          <div className="mt-4">
            <Card>
              <CardContent className="p-6">
                <p className="text-lg font-semibold mb-6">
                  {`Question ${currentQuestionIndex + 1}: ${currentQuestion.question}`}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQuestion.options.map((option) => {
                    const isSelected = selectedAnswers[currentQuestionIndex] === option;
                    const isCorrect = currentQuestion.correctAnswer === option;
                    
                    return (
                      <Button
                        key={option}
                        variant="outline"
                        className={cn(
                          "h-auto justify-start text-left whitespace-normal py-3",
                          isAnswered && isCorrect && "border-green-500 bg-green-500/10 text-green-700",
                          isAnswered && isSelected && !isCorrect && "border-red-500 bg-red-500/10 text-red-700"
                        )}
                        onClick={() => handleAnswerSelect(option)}
                        disabled={isAnswered}
                      >
                         {isAnswered && isCorrect && <CheckCircle2 className="mr-2 h-5 w-5 shrink-0" />}
                         {isAnswered && isSelected && !isCorrect && <XCircle className="mr-2 h-5 w-5 shrink-0" />}
                        {option}
                      </Button>
                    )
                  })}
                </div>
                {isAnswered && (
                   <Card className="mt-6 bg-accent/50 animate-fade-in">
                     <CardContent className="p-4">
                       <h4 className="font-semibold flex items-center mb-2">
                        <Lightbulb className="mr-2 h-5 w-5 text-primary" />
                         Explanation
                       </h4>
                       <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
                     </CardContent>
                   </Card>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center p-8 animate-fade-in">
             <Award className="h-24 w-24 text-yellow-500 mx-auto mb-4" />
             <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
             <p className="text-xl text-muted-foreground mb-6">
              You scored
              <span className="font-bold text-primary text-2xl mx-2">{score}</span>
              out of
              <span className="font-bold text-primary text-2xl mx-2">{questions.length}</span>
             </p>
          </div>
        )}

        <DialogFooter>
          {!isQuizFinished ? (
             <Button onClick={handleNext} disabled={!isAnswered}>
              Next Question
            </Button>
          ) : (
            <div className='flex justify-between w-full'>
              <Button variant="outline" onClick={handleClose}>Close</Button>
              <Button onClick={handleRestart}>Try Again</Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
