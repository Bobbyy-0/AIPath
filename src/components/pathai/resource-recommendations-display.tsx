
"use client";

import { useState } from "react";
import type { LearningResource } from "@/ai/flows/generate-learning-path-flow";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Book, BookOpen, ExternalLink, Loader2, AlertTriangle, Gift, GraduationCap, Video, FileText, Wrench, MousePointerClick } from "lucide-react";
import Link from "next/link";
import React from "react";

interface ResourceRecommendationsDisplayProps {
  resources: LearningResource[] | null;
  isLoading: boolean;
  error: string | null; 
}

const resourceIcons: Record<LearningResource['type'], React.ReactElement> = {
  article: <FileText className="h-5 w-5" />,
  video: <Video className="h-5 w-5" />,
  course: <GraduationCap className="h-5 w-5" />,
  documentation: <BookOpen className="h-5 w-5" />,
  interactive_tutorial: <MousePointerClick className="h-5 w-5" />,
  book: <Book className="h-5 w-5" />,
  tool: <Wrench className="h-5 w-5" />,
};

export function ResourceRecommendationsDisplay({ resources, isLoading, error }: ResourceRecommendationsDisplayProps) {
  const [selectedFilter, setSelectedFilter] = useState<LearningResource['type'] | 'all'>('all');

  const CardWrapper = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <Card className={`w-full shadow-2xl h-full animate-fade-in-up border border-primary/20 bg-card backdrop-blur-sm ${className}`} style={{ animationDelay: '0.2s' }}>
      {children}
    </Card>
  );
  
  if (isLoading) {
     return (
      <CardWrapper>
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Loader2 className="mr-3 h-6 w-6 animate-spin" />
            Finding Resources...
          </CardTitle>
          <CardDescription>We're curating the best learning materials for you.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border rounded-lg animate-pulse bg-muted/50">
              <div className="h-5 bg-muted rounded w-1/2 mb-3"></div>
              <div className="h-4 bg-muted rounded w-full mb-2"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          ))}
        </CardContent>
      </CardWrapper>
    );
  }
  
  if (error) {
    return (
       <Card className="w-full shadow-lg border-destructive animate-fade-in-up bg-destructive/20 backdrop-blur-sm" style={{ animationDelay: '0.2s' }}>
        <CardHeader>
          <CardTitle className="flex items-center text-destructive-foreground">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Resources Unavailable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive-foreground">Resources could not be loaded due to an error in path generation.</p>
        </CardContent>
      </Card>
    );
  }


  if (!resources || resources.length === 0) {
    return (
      <CardWrapper>
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Gift className="mr-3 h-6 w-6 text-primary" />
            Recommended Resources
          </CardTitle>
          <CardDescription>Helpful learning materials tailored to your path.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mt-4 text-center">Resources will appear here once your path is generated.</p>
        </CardContent>
      </CardWrapper>
    );
  }
  
  const resourceTypes = [...new Set(resources.map(r => r.type))];
  const filteredResources = resources.filter(resource => 
    selectedFilter === 'all' || resource.type === selectedFilter
  );

  return (
    <CardWrapper>
      <CardHeader>
        <CardTitle className="flex items-center text-3xl">
          <BookOpen className="mr-3 h-8 w-8 text-primary" />
          Top Resources
        </CardTitle>
        <CardDescription>Curated materials to help you on your journey. Filter by type below.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 pb-2 border-b">
            <Button
              variant={selectedFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter('all')}
              className="rounded-full"
            >
              All
            </Button>
            {resourceTypes.map(type => (
              <Button
                key={type}
                variant={selectedFilter === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter(type)}
                className="capitalize rounded-full"
              >
                {type.replace(/_/g, ' ')}
              </Button>
            ))}
        </div>

        {filteredResources.length > 0 ? filteredResources.map((resource, index) => (
          <Card key={index} className="bg-background/5 transition-all duration-300 hover:bg-background/10 hover:border-primary/50 border animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
             <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-start justify-between">
                <span className="font-semibold">{resource.title}</span>
                <Badge variant="secondary" className="flex items-center gap-2 w-fit shrink-0 capitalize">
                  {resourceIcons[resource.type]}
                  <span>{resource.type.replace(/_/g, ' ')}</span>
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-sm text-muted-foreground">{resource.briefExplanation}</p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" size="sm" className="bg-primary/10 border-primary/20 hover:bg-primary/20 hover:border-primary/50 text-primary-dark font-semibold">
                <Link href={resource.url} target="_blank" rel="noopener noreferrer">
                  View Resource <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        )) : (
            <p className="text-muted-foreground text-center py-4">No resources found for this filter.</p>
        )}
      </CardContent>
    </CardWrapper>
  );
}
