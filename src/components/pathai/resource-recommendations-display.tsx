"use client";

import type { LearningResource } from "@/ai/flows/generate-learning-path-flow";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ExternalLink, Loader2, AlertTriangle, Gift } from "lucide-react";
import Link from "next/link";

interface ResourceRecommendationsDisplayProps {
  resources: LearningResource[] | null;
  isLoading: boolean;
  error: string | null; // To show resource-specific errors if any, or general if path failed
}

export function ResourceRecommendationsDisplay({ resources, isLoading, error }: ResourceRecommendationsDisplayProps) {
  // If path generation is loading, resources are also implicitly loading or not yet fetched.
  // No separate loading state for resources needed if they are fetched along with the path.
  if (isLoading) {
     return (
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Fetching Resources...
          </CardTitle>
          <CardDescription>We're finding the best learning materials for you.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-4 border rounded-md animate-pulse bg-muted/50">
              <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-muted rounded w-full mb-1"></div>
              <div className="h-3 bg-muted rounded w-3/4"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }
  
  // If there was an error generating the path, resources likely weren't generated either.
  if (error) {
    return (
      <Card className="w-full shadow-lg border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center text-destructive">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Resource Recommendations Unavailable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Resources could not be loaded due to an error in path generation.</p>
        </CardContent>
      </Card>
    );
  }


  if (!resources || resources.length === 0) {
    return (
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Gift className="mr-2 h-5 w-5 text-primary" />
            Recommended Resources
          </CardTitle>
          <CardDescription>Helpful learning materials tailored to your path.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Resources will appear here once your learning path is generated.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen className="mr-2 h-6 w-6 text-primary" />
          Recommended Resources
        </CardTitle>
        <CardDescription>Curated materials to help you along your learning journey.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {resources.map((resource, index) => (
          <Card key={index} className="bg-background/50">
            <CardHeader>
              <CardTitle className="text-lg">{resource.title}</CardTitle>
              <Badge variant="secondary" className="w-fit">{resource.type.replace(/_/g, ' ').toUpperCase()}</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{resource.briefExplanation}</p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" size="sm">
                <Link href={resource.url} target="_blank" rel="noopener noreferrer">
                  View Resource <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
