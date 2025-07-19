
"use client";

import { useState } from "react";
import type { InputFormValues } from "@/components/pathai/input-form";
import { InputForm } from "@/components/pathai/input-form";
import { LearningPathDisplay } from "@/components/pathai/learning-path-display";
import { ResourceRecommendationsDisplay } from "@/components/pathai/resource-recommendations-display";
import type { GenerateLearningPathOutput, LearningStep, LearningResource } from "@/ai/flows/generate-learning-path-flow";
import { generateLearningPath } from "@/ai/flows/generate-learning-path-flow";
import { refineLearningPath } from "@/ai/flows/refine-learning-path-flow";
import type { RefineLearningPathInput } from "@/ai/flows/refine-learning-path-flow";
import type { RefineFormValues } from "@/components/pathai/refine-path-form";
import { RefinePathForm } from "@/components/pathai/refine-path-form";
import { useToast } from "@/hooks/use-toast";
import { BrainCircuit, Loader2, TestTube2 } from "lucide-react";
import { generateQuiz } from "@/ai/flows/generate-quiz-flow";
import type { QuizQuestion } from "@/ai/flows/generate-quiz-flow";
import { QuizModal } from "@/components/pathai/quiz-modal";
import { Button } from "@/components/ui/button";


export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [learningPathData, setLearningPathData] = useState<LearningStep[] | null>(null);
  const [resourcesData, setResourcesData] = useState<LearningResource[] | null>(null);
  const [rawLearningPathOutput, setRawLearningPathOutput] = useState<GenerateLearningPathOutput | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[] | null>(null);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFormSubmit = async (values: InputFormValues) => {
    setIsLoading(true);
    setError(null);
    setLearningPathData(null);
    setResourcesData(null);
    setRawLearningPathOutput(null);
    setQuizQuestions(null);

    try {
      const result: GenerateLearningPathOutput = await generateLearningPath(values);
      if (result.learningPath && result.recommendedResources) {
        setLearningPathData(result.learningPath);
        setResourcesData(result.recommendedResources);
        setRawLearningPathOutput(result);
      } else {
        throw new Error("AI response was incomplete. Missing path or resources.");
      }
    } catch (e: any)
    {
      console.error("Error generating learning path:", e);
      const errorMessage = e.message || "An unexpected error occurred. Please try again.";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefineSubmit = async (values: RefineFormValues) => {
    if (!rawLearningPathOutput) {
      toast({
        title: "Error",
        description: "No learning path available to refine. Please generate one first.",
        variant: "destructive",
      });
      return;
    }

    setIsRefining(true);
    setError(null); 
    setQuizQuestions(null);

    try {
      const refineInput: RefineLearningPathInput = {
        originalPath: rawLearningPathOutput,
        refinementRequest: values.refinementRequest,
      };
      const result: GenerateLearningPathOutput = await refineLearningPath(refineInput);

      if (result.learningPath && result.recommendedResources) {
        setLearningPathData(result.learningPath);
        setResourcesData(result.recommendedResources);
        setRawLearningPathOutput(result);
      } else {
        throw new Error("AI response for refinement was incomplete.");
      }
    } catch (e: any) {
      console.error("Error refining learning path:", e);
      const errorMessage = e.message || "An unexpected error occurred during refinement.";
      setError(errorMessage); 
      toast({
        title: "Refinement Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsRefining(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!rawLearningPathOutput) {
      toast({
        title: "Error",
        description: "Cannot generate a quiz without a learning path.",
        variant: "destructive"
      });
      return;
    }
    setIsGeneratingQuiz(true);
    try {
      const result = await generateQuiz({ learningPath: rawLearningPathOutput });
      if (result.quiz && result.quiz.length > 0) {
        setQuizQuestions(result.quiz);
        setIsQuizModalOpen(true);
      } else {
        throw new Error("The AI did not return any quiz questions.");
      }
    } catch (e: any) {
       console.error("Error generating quiz:", e);
      const errorMessage = e.message || "An unexpected error occurred while creating the quiz.";
      toast({
        title: "Quiz Generation Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingQuiz(false);
    }
  };
  
  const overallIsLoading = isLoading || isRefining;
  const showResults = learningPathData || overallIsLoading || error;

  return (
    <>
      <div className="flex flex-col items-center justify-start min-h-screen p-4 md:p-8 animate-fade-in">
        <header className="mb-12 text-center w-full max-w-4xl">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full border border-primary/20 shadow-inner">
              <BrainCircuit className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-br from-primary via-purple-500 to-indigo-600 text-transparent bg-clip-text">
            AIPath
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Your personal AI guide to mastering new skills. Chart your course to a brighter future.
          </p>
        </header>

        <main className="w-full max-w-7xl flex flex-col items-center">
          <InputForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          
          {showResults && (
            <div className="w-full mt-16 grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
              <div className="lg:col-span-3">
                <LearningPathDisplay 
                  path={learningPathData}
                  isLoading={overallIsLoading}
                  error={error} onQuizRequest={function (topic: string): void {
                    throw new Error("Function not implemented.");
                  } }                />
              </div>
              <div className="lg:col-span-2">
                <ResourceRecommendationsDisplay resources={resourcesData} isLoading={overallIsLoading} error={error} />
              </div>
            </div>
          )}

          {rawLearningPathOutput && !overallIsLoading && !error && (
            <div className="text-center mt-12 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <Button size="lg" onClick={handleGenerateQuiz} disabled={isGeneratingQuiz}>
                  {isGeneratingQuiz ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Building Quiz...
                    </>
                  ) : (
                    <>
                      <TestTube2 className="mr-2 h-5 w-5" />
                      Test Your Knowledge
                    </>
                  )}
                </Button>
            </div>
          )}

          {rawLearningPathOutput && !overallIsLoading && !error && (
            <div className="w-full mt-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <RefinePathForm onSubmit={handleRefineSubmit} isLoading={isRefining} />
            </div>
          )}
        </main>

        <footer className="mt-24 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AIPath. All rights reserved.</p>
          <p>Powered by Firebase and Genkit</p>
        </footer>
      </div>
      {quizQuestions && (
        <QuizModal
          isOpen={isQuizModalOpen}
          onOpenChange={setIsQuizModalOpen}
          questions={quizQuestions}
        />
      )}
    </>
  );
}
