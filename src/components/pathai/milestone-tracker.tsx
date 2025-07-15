
"use client";

import type { LearningStep } from "@/ai/flows/generate-learning-path-flow";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2, AlertTriangle, Lightbulb, MapIcon, Sparkles, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MilestoneTrackerProps {
  path: LearningStep[] | null;
  isLoading: boolean;
  error: string | null;
  completedSteps: Set<number>;
  onToggleStep: (stepIndex: number) => void;
  onQuizRequest: (topic: string) => void;
}

function SkeletonStep() {
  return (
    <div className="flex items-start space-x-4 animate-pulse">
      <div className="mt-1 h-6 w-6 rounded bg-muted"></div>
      <div className="space-y-2 flex-1">
        <div className="h-5 w-3/4 bg-muted rounded"></div>
        <div className="h-4 w-full bg-muted rounded"></div>
        <div className="h-4 w-5/6 bg-muted rounded"></div>
      </div>
    </div>
  );
}

export function MilestoneTracker({ path, isLoading, error, completedSteps, onToggleStep, onQuizRequest }: MilestoneTrackerProps) {
  const CardWrapper = ({ children }: { children: React.ReactNode }) => (
    <Card className="w-full shadow-2xl h-full animate-fade-in-up border border-primary/20 bg-card backdrop-blur-sm">
      {children}
    </Card>
  );
  
  const progressPercentage = path && path.length > 0 ? (completedSteps.size / path.length) * 100 : 0;

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
        <CardContent className="space-y-6">
          <div className="h-4 w-full bg-muted rounded-full animate-pulse"></div>
          <SkeletonStep />
          <SkeletonStep />
          <SkeletonStep />
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
            Your Learning Milestones
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
        <CardDescription>Check off each step as you complete it to track your progress.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-8 space-y-3">
            <div className="flex justify-between items-center text-muted-foreground font-medium">
                <p>Overall Progress</p>
                <p>{completedSteps.size} / {path.length} Completed</p>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            {progressPercentage === 100 && (
                <div className="flex items-center justify-center gap-2 pt-3 text-lg font-semibold text-green-600 dark:text-green-400 animate-fade-in">
                    <Trophy className="h-6 w-6"/>
                    <span>Congratulations! You've completed your path!</span>
                </div>
            )}
        </div>

        <div className="space-y-6">
          {path.map((step, index) => (
            <div key={index} className="flex items-start space-x-4 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <Checkbox
                id={`step-${index}`}
                checked={completedSteps.has(index)}
                onCheckedChange={() => onToggleStep(index)}
                className="h-6 w-6 mt-1"
                aria-label={`Mark step ${index + 1} as complete`}
              />
              <div className="flex-1 space-y-2">
                <Label htmlFor={`step-${index}`} className="text-xl font-semibold leading-none cursor-pointer">
                  {`Step ${index + 1}: ${step.title}`}
                </Label>
                <p className="text-muted-foreground">{step.description}</p>
                {step.keyTopics && step.keyTopics.length > 0 && (
                    <div className="pt-2">
                        <h4 className="font-semibold mb-2 text-base text-primary">Key Topics:</h4>
                        <div className="flex flex-wrap gap-2">
                            {step.keyTopics.map((topic, topicIndex) => (
                            <Badge key={topicIndex} variant="secondary" className="text-sm">{topic}</Badge>
                            ))}
                        </div>
                    </div>
                )}
                <Button 
                    size="sm" 
                    variant="outline"
                    className="mt-3"
                    onClick={() => onQuizRequest(step.keyTopics?.join(', ') || step.title)}
                >
                    <Sparkles className="mr-2 h-4 w-4"/>
                    Test Your Knowledge
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </CardWrapper>
  );
}
