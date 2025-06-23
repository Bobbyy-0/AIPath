"use client";

import { useState } from "react";
import type { InputFormValues } from "@/components/pathai/input-form";
import { InputForm } from "@/components/pathai/input-form";
import { LearningPathDisplay } from "@/components/pathai/learning-path-display";
import { ResourceRecommendationsDisplay } from "@/components/pathai/resource-recommendations-display";
import type { GenerateLearningPathOutput, LearningStep, LearningResource } from "@/ai/flows/generate-learning-path-flow";
import { generateLearningPath } from "@/ai/flows/generate-learning-path-flow";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { BrainCircuit } from "lucide-react";


export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [learningPathData, setLearningPathData] = useState<LearningStep[] | null>(null);
  const [resourcesData, setResourcesData] = useState<LearningResource[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFormSubmit = async (values: InputFormValues) => {
    setIsLoading(true);
    setError(null);
    setLearningPathData(null);
    setResourcesData(null);

    try {
      const result: GenerateLearningPathOutput = await generateLearningPath(values);
      if (result.learningPath && result.recommendedResources) {
        setLearningPathData(result.learningPath);
        setResourcesData(result.recommendedResources);
        toast({
          title: "Success!",
          description: "Your personalized learning path has been generated.",
          variant: "default"
        });
      } else {
        throw new Error("AI response was incomplete. Missing path or resources.");
      }
    } catch (e: any) {
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
      <header className="mb-10 text-center">        
        <div className="flex items-center justify-center mb-2">
          <h1 className="ml-3 text-5xl font-bold text-primary">AIPath</h1>
        </div>
        <p className="text-xl text-muted-foreground">
          Your personal AI guide to a brighter learning future.
        </p>
      </header>

      <main className="w-full max-w-4xl space-y-8 flex flex-col items-center">
        <InputForm onSubmit={handleFormSubmit} isLoading={isLoading} />

        {(learningPathData || isLoading || error) && (
           <div className="space-y-8">
            <LearningPathDisplay path={learningPathData} isLoading={isLoading} error={error} />
            <Separator />
            <ResourceRecommendationsDisplay resources={resourcesData} isLoading={isLoading} error={error} />
           </div>
        )}
      </main>
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} AIPath. All rights reserved.</p>
      </footer>
    </div>
  );
}
