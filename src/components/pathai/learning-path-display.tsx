
"use client";

import type { LearningStep } from "@/ai/flows/generate-learning-path-flow";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, Lightbulb, MapIcon, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LearningPathDisplayProps {
  path: LearningStep[] | null;
  isLoading: boolean;
  error: string | null;
  onQuizRequest: (topic: string) => void;
}

function SkeletonStep() {
  return (
    <li className="relative animate-pulse">
      <div className="absolute -left-[1.2rem] top-1.5 h-3 w-3 rounded-full bg-muted ring-4 ring-card"></div>
      <div className="pl-6 space-y-3">
        <div className="h-5 w-3/4 bg-muted rounded"></div>
        <div className="h-4 w-full bg-muted rounded"></div>
        <div className="h-4 w-5/6 bg-muted rounded"></div>
      </div>
    </li>
  );
}


export function LearningPathDisplay({ path, isLoading, error, onQuizRequest }: LearningPathDisplayProps) {
  const CardWrapper = ({ children }: { children: React.ReactNode }) => (
    <Card className="w-full shadow-2xl h-full animate-fade-in-up border border-primary/20 bg-card backdrop-blur-sm">
      {children}
    </Card>
  );

  if (isLoading) {
    return (
      <CardWrapper>
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Loader2 className="mr-3 h-6 w-6 animate-spin" />
            Crafting Your Roadmap...
          </CardTitle>
          <CardDescription>Our AI is forging a personalized path to success for you.</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="relative pl-6">
              <div className="absolute left-[0.3rem] top-0 h-full w-px bg-border"></div>
              <ul className="space-y-8">
                <SkeletonStep />
                <SkeletonStep />
                <SkeletonStep />
              </ul>
            </div>
        </CardContent>
      </CardWrapper>
    );
  }

  if (error) {
    return (
      <Card className="w-full shadow-lg border-destructive animate-fade-in-up bg-destructive/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-destructive-foreground">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Error Generating Path
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive-foreground">{error}</p>
          <p className="mt-2 text-sm text-destructive-foreground/80">Please try adjusting your inputs or try again later.</p>
        </CardContent>
      </Card>
    );
  }

  if (!path || path.length === 0) {
    return (
      <CardWrapper>
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
             <Lightbulb className="mr-3 h-6 w-6 text-primary" />
            Your Learning Path
          </CardTitle>
          <CardDescription>Submit the form to generate your personalized learning journey.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mt-4 text-center">Your path to mastery will appear here.</p>
        </CardContent>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper>
      <CardHeader>
        <CardTitle className="flex items-center text-3xl">
          <MapIcon className="mr-3 h-8 w-8 text-primary" />
          Your Personalized Path
        </CardTitle>
        <CardDescription>Follow these steps to achieve your goals. Each step includes key topics to focus on.</CardDescription>
      </CardHeader>
      <CardContent>
         <div className="relative pl-6">
            <div className="absolute left-[0.3rem] top-2 h-full w-px bg-gradient-to-b from-primary to-purple-500"></div>

            <ul className="space-y-4">
              {path.map((step, index) => (
                <li key={index} className="relative animate-fade-in-up" style={{ animationDelay: `${index * 0.15}s` }}>
                  <div className="absolute -left-[1.2rem] top-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-card"></div>

                  <div className="pl-6">
                    <Accordion type="single" collapsible defaultValue="item-0">
                      <AccordionItem value={`item-${index}`} className="border-b-0">
                        <AccordionTrigger className="text-xl font-semibold hover:no-underline p-0 text-left">
                          Step {index + 1}: {step.title}
                        </AccordionTrigger>
                        <AccordionContent className="pt-2">
                           <p className="text-muted-foreground mb-4">{step.description}</p>
                           {step.keyTopics && step.keyTopics.length > 0 && (
                            <div className="mb-4">
                              <h4 className="font-semibold mb-2 text-base text-primary">Key Topics:</h4>
                              <div className="flex flex-wrap gap-2">
                                {step.keyTopics.map((topic, topicIndex) => (
                                  <Badge key={topicIndex} variant="secondary" className="text-sm">{topic}</Badge>
                                ))}
                              </div>
                            </div>
                           )}
                          
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </li>
              ))}
            </ul>
          </div>
      </CardContent>
    </CardWrapper>
  );
}
