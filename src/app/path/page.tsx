
"use client";

import { useState, useEffect } from "react";
import type { InputFormValues } from "@/components/pathai/input-form";
import { InputForm } from "@/components/pathai/input-form";
import { LearningPathDisplay } from "@/components/pathai/learning-path-display";
import { ResourceRecommendationsDisplay } from "@/components/pathai/resource-recommendations-display";
import type { GenerateLearningPathOutput } from "@/ai/flows/generate-learning-path-flow";
import { generateLearningPath } from "@/ai/flows/generate-learning-path-flow";
import { refineLearningPath } from "@/ai/flows/refine-learning-path-flow";
import type { RefineLearningPathInput } from "@/ai/flows/refine-learning-path-flow";
import type { RefineFormValues } from "@/components/pathai/refine-path-form";
import { RefinePathForm } from "@/components/pathai/refine-path-form";
import { useToast } from "@/hooks/use-toast";
import { BrainCircuit, Loader2, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


import { generateQuiz } from "@/ai/flows/generate-quiz-flow";
import type { GenerateQuizOutput } from "@/ai/schemas/quiz-schemas";
import { QuizModal } from "@/components/pathai/quiz-modal";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type AppState = "input" | "result";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("input");
  const [isLoading, setIsLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [rawLearningPathOutput, setRawLearningPathOutput] = useState<GenerateLearningPathOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [quizData, setQuizData] = useState<GenerateQuizOutput | null>(null);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

  useEffect(() => {
    // On initial load, check local storage for a saved path.
    try {
      const savedPath = localStorage.getItem('savedLearningPath');
      if (savedPath) {
        const parsedPath = JSON.parse(savedPath);
        setRawLearningPathOutput(parsedPath);
        setAppState("result");
         toast({
          title: "Welcome Back!",
          description: "We've loaded your previously saved learning path.",
        });
      }
    } catch (e) {
      console.error("Failed to load or parse saved path from localStorage", e);
      // If parsing fails, remove the invalid item.
      localStorage.removeItem('savedLearningPath');
    }
  }, [toast]);


  const handleInitialSubmit = async (values: InputFormValues) => {
    setIsLoading(true);
    setError(null);
    setRawLearningPathOutput(null);

    try {
      const result = await generateLearningPath(values);
      if (result.learningPath && result.recommendedResources) {
        setRawLearningPathOutput(result);
        setAppState("result");
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
      setAppState("input");
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
        description: "A learning path must be generated before creating a quiz.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingQuiz(true);
    setQuizData(null);

    try {
      const result = await generateQuiz({ learningPath: rawLearningPathOutput.learningPath });
      setQuizData(result);
      setIsQuizModalOpen(true);
    } catch (e: any) {
      console.error("Error generating quiz:", e);
      const errorMessage = e.message || "Failed to generate the quiz. Please try again.";
      toast({
        title: "Quiz Generation Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleDownloadPath = () => {
    if (rawLearningPathOutput) {
      try {
        const doc = new jsPDF();
        const { learningPath, recommendedResources } = rawLearningPathOutput;

        // Title
        doc.setFontSize(22);
        doc.text("Your Personalized Learning Path", 105, 20, { align: "center" });

        // Learning Path Steps
        doc.setFontSize(16);
        doc.text("Learning Steps", 14, 35);
        let yPos = 45;
        learningPath.forEach((step, index) => {
          if (yPos > 270) { // Check for page break
            doc.addPage();
            yPos = 20;
          }
          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          doc.text(`Step ${index + 1}: ${step.title}`, 14, yPos);
          yPos += 7;
          
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          const descriptionLines = doc.splitTextToSize(step.description, 180);
          doc.text(descriptionLines, 14, yPos);
          yPos += descriptionLines.length * 5 + 5;

          doc.setFont("helvetica", "bold");
          doc.text("Key Topics:", 14, yPos);
          yPos += 5;
          doc.setFont("helvetica", "normal");
          step.keyTopics.forEach(topic => {
            if (yPos > 280) { // Check for page break
              doc.addPage();
              yPos = 20;
            }
            doc.text(`- ${topic}`, 16, yPos);
            yPos += 5;
          });
          yPos += 5;
        });

        // Recommended Resources Table
        if (yPos > 250) { // Check for page break before table
          doc.addPage();
          yPos = 20;
        } else {
            yPos += 10;
        }

        doc.setFontSize(16);
        doc.text("Recommended Resources", 14, yPos);
        
        const tableBody = recommendedResources.map(r => [
            r.title,
            r.type.replace(/_/g, ' '),
            r.briefExplanation,
            r.url // Hidden column for the URL
        ]);

        autoTable(doc, {
          startY: yPos + 10,
          head: [['Title', 'Type', 'Explanation']],
          body: tableBody,
          // Exclude the last column (URL) from being rendered
          columns: [
            { header: 'Title', dataKey: 0 },
            { header: 'Type', dataKey: 1 },
            { header: 'Explanation', dataKey: 2 },
          ],
          theme: 'striped',
          headStyles: { fillColor: [37, 24, 79] }, // Using a purple color for header
          didDrawCell: (data) => {
            // Check if it's the 'Title' column (index 0) and not in the header
            if (data.column.index === 0 && data.cell.section === 'body') {
              // The URL is in the hidden 4th column of our original body data
              const url = tableBody[data.row.index][3];
              if (url) {
                // Add a link annotation
                doc.link(data.cell.x, data.cell.y, data.cell.width, data.cell.height, { url });
                // Style the text to look like a link
                doc.setTextColor("#0000EE"); // Blue color
                doc.setFont("helvetica", "normal", "underline");
              }
            }
          },
          willDrawCell: (data) => {
            // Reset text color and style for all other cells
            doc.setTextColor("#000000"); // Black color
            doc.setFont("helvetica", "normal");
          }
        });
        
        doc.save('aipath-learning-path.pdf');

        toast({
          title: "Download Started",
          description: "Your learning path PDF is being generated.",
        });
      } catch (e) {
        console.error("Failed to generate or download PDF", e);
        toast({
          title: "Download Error",
          description: "Could not prepare the learning path PDF for download.",
          variant: "destructive",
        });
      }
    }
  };


  const restart = () => {
    localStorage.removeItem('savedLearningPath');
    setAppState("input");
    setRawLearningPathOutput(null);
    setError(null);
    toast({
        title: "Started Over",
        description: "Previous path has been cleared. You can now generate a new one.",
    });
  }
  
  const handleSavePath = () => {
    if (rawLearningPathOutput) {
      try {
        localStorage.setItem('savedLearningPath', JSON.stringify(rawLearningPathOutput));
        toast({
          title: "Path Saved!",
          description: "Your learning path has been saved to your browser. It will be reloaded when you revisit.",
        });
      } catch (e) {
        console.error("Failed to save path to localStorage", e);
        toast({
          title: "Save Error",
          description: "Could not save the learning path.",
          variant: "destructive",
        });
      }
    }
  };

  const overallIsLoading = isLoading || isRefining;
  const learningPathData = rawLearningPathOutput?.learningPath ?? null;
  const resourcesData = rawLearningPathOutput?.recommendedResources ?? null;

  return (
    <>
      <div className="flex flex-col items-center justify-start min-h-screen p-4 md:p-8 animate-fade-in">
        <header className="mb-12 text-center w-full max-w-4xl">
          <div className="flex items-center justify-center mb-4">
            
          </div>
          <h1 className="text-5xl md:text-7xl font-bold ">
            AIPath
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Your personal AI guide to mastering new skills. Chart your course to a brighter future.
          </p>
        </header>

        <main className="w-full max-w-7xl flex flex-col items-center">
          {appState === 'input' && <InputForm onSubmit={handleInitialSubmit} isLoading={isLoading} />}
          
          {isLoading && appState !== 'result' && (
             <div className="flex flex-col items-center justify-center text-center p-8">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <h2 className="text-2xl font-semibold">Generating Your Custom Path...</h2>
                <p className="text-muted-foreground">This may take a moment.</p>
             </div>
          )}

          {appState === 'result' && (
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

          {appState === 'result' && rawLearningPathOutput && !overallIsLoading && !error && (
            <div className="w-full mt-12 animate-fade-in-up space-y-4 text-center" style={{ animationDelay: '0.4s' }}>
                <div className="flex flex-wrap items-center justify-center gap-4">
                     
                     <Button onClick={handleDownloadPath} variant="outline">
                      <Download className="mr-2 h-5 w-5" />
                      Download Path (PDF)
                    </Button>
                    <Button onClick={handleGenerateQuiz} disabled={isGeneratingQuiz} size="lg">
                        {isGeneratingQuiz ? (
                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating Quiz...</>
                        ) : "Test Your Knowledge"}
                    </Button>
                    <button onClick={restart} className="text-primary hover:underline">Start Over</button>
                </div>
              <RefinePathForm onSubmit={handleRefineSubmit} isLoading={isRefining} />
            </div>
          )}
        </main>

        <footer className="mt-24 text-center text-sm text-muted-foreground space-y-2">
            <div>
                 
            </div>
          <p>&copy; {new Date().getFullYear()} AIPath. All rights reserved.</p>
        </footer>
      </div>

       {quizData && (
        <QuizModal
          isOpen={isQuizModalOpen}
          onClose={() => setIsQuizModalOpen(false)}
          quiz={quizData}
        />
      )}
    </>
  );
}
