"use client";

import type { LearningStep } from "@/ai/flows/generate-learning-path-flow";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, Loader2, AlertTriangle, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LearningPathDisplayProps {
  path: LearningStep[] | null;
  isLoading: boolean;
  error: string | null;
}

export function LearningPathDisplay({ path, isLoading, error }: LearningPathDisplayProps) {
  if (isLoading) {
    return (
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Generating Your Learning Path...
          </CardTitle>
          <CardDescription>Our AI is crafting a personalized roadmap for you. This might take a moment.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border rounded-md animate-pulse bg-muted/50">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-full mb-1"></div>
              <div className="h-3 bg-muted rounded w-5/6"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full shadow-lg border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center text-destructive">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Error Generating Path
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive-foreground bg-destructive p-3 rounded-md">{error}</p>
          <p className="mt-2 text-sm text-muted-foreground">Please try adjusting your inputs or try again later.</p>
        </CardContent>
      </Card>
    );
  }

  if (!path || path.length === 0) {
    return (
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
             <Lightbulb className="mr-2 h-5 w-5 text-primary" />
            Your Learning Path
          </CardTitle>
          <CardDescription>Submit the form to generate your personalized learning path.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Your generated learning path will appear here once you provide your details.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CheckCircle2 className="mr-2 h-6 w-6 text-green-500" />
          Your Personalized Learning Path
        </CardTitle>
        <CardDescription>Follow these steps to achieve your goals. Each step includes key topics to focus on.</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {path.map((step, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="text-lg font-medium hover:no-underline">
                Step {index + 1}: {step.title}
              </AccordionTrigger>
              <AccordionContent className="space-y-2 text-base">
                <p className="text-muted-foreground">{step.description}</p>
                {step.keyTopics && step.keyTopics.length > 0 && (
                  <div>
                    <h4 className="font-semibold mt-2 mb-1">Key Topics:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {step.keyTopics.map((topic, topicIndex) => (
                        <li key={topicIndex}>{topic}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
