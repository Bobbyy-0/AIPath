"use client";

import { useState } from "react";
import type { InputFormValues } from "@/components/pathai/input-form";
import { InputForm } from "@/components/pathai/input-form";
import { LearningPathDisplay } from "@/components/pathai/learning-path-display";
import { ResourceRecommendationsDisplay } from "@/components/pathai/resource-recommendations-display";
import type { GenerateLearningPathOutput, LearningStep, LearningResource } from "@/ai/flows/generate-learning-path-flow";
import { generateLearningPath } from "@/ai/flows/generate-learning-path-flow";
// ...other imports
import { refineLearningPath } from "@/ai/flows/refine-learning-path-flow";
// RefineLearningPathInput type is defined and exported from refine-learning-path-flow.ts
import type { RefineLearningPathInput } from "@/ai/flows/refine-learning-path-flow";
import type { RefineFormValues } from "@/components/pathai/refine-path-form";
import { RefinePathForm } from "@/components/pathai/refine-path-form";
// ...other imports
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { BrainCircuit } from "lucide-react";
// import { ChatMentor, type ChatMessage } from "@/components/pathai/chat-mentor";
import { chatWithMentor } from "@/ai/flows/chat-with-mentor-flow";
import type { ChatWithMentorInput } from "@/ai/flows/chat-with-mentor-flow";
import { ChatMessage } from "@/ai/schemas/chat-schemas";




export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [learningPathData, setLearningPathData] = useState<LearningStep[] | null>(null);
  const [resourcesData, setResourcesData] = useState<LearningResource[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatting, setIsChatting] = useState(false);
  // Located in: src/app/page.tsx
  // ...other state variables
const [isRefining, setIsRefining] = useState(false);
// ...other state variables

const [rawLearningPathOutput, setRawLearningPathOutput] = useState<GenerateLearningPathOutput | null>(null);


  const handleFormSubmit = async (values: InputFormValues) => {
    setIsLoading(true);
    setError(null);
    setLearningPathData(null);
    setResourcesData(null);
    setChatHistory([]); // Reset chat on new path generation

    try {
      const result: GenerateLearningPathOutput = await generateLearningPath(values);
      if (result.learningPath && result.recommendedResources) {
        setLearningPathData(result.learningPath);
        setResourcesData(result.recommendedResources);
        setChatHistory([
          { role: 'model', content: "Hello! I'm your AI mentor. Feel free to ask me any questions about your new learning path." }
        ]);
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
        setChatHistory([
          { role: 'model', content: "Your path has been updated! How can I help you with this new plan?" }
        ]);
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
const handleChatSubmit = async (message: string) => {
    if (!rawLearningPathOutput) return;

    const newUserMessage: ChatMessage = { role: 'user', content: message };
    const updatedHistory = [...chatHistory, newUserMessage];
    setChatHistory(updatedHistory);
    setIsChatting(true);

    try {
      const chatInput: ChatWithMentorInput = {
        learningPath: rawLearningPathOutput,
        chatHistory: updatedHistory,
      };

      const result = await chatWithMentor(chatInput);
      
      const newModelMessage: ChatMessage = { role: 'model', content: result.response };
      setChatHistory([...updatedHistory, newModelMessage]);

    } catch (e: any) {
      console.error("Error in chat:", e);
      const errorMessage = e.message || "An error occurred in the chat.";
      const errorResponse: ChatMessage = { role: 'model', content: `Sorry, something went wrong: ${errorMessage}` };
      setChatHistory([...updatedHistory, errorResponse]);
      toast({
        title: "Chat Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsChatting(false);
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
            <LearningPathDisplay path={learningPathData} isLoading={isLoading} error={error} onQuizRequest={function (topic: string): void {
              throw new Error("Function not implemented.");
            } } />
            <Separator />
            <ResourceRecommendationsDisplay resources={resourcesData} isLoading={isLoading} error={error} />
           </div>
        )}
{rawLearningPathOutput && !isLoading && !error && (
  <div className="w-full mt-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
    <RefinePathForm onSubmit={handleRefineSubmit} isLoading={isRefining} />
  </div>
)}
      </main>
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} AIPath. All rights reserved.</p>
      </footer>
    </div>
  );
}
