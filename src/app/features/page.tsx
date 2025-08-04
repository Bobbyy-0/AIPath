
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowRight,
  BookOpen,
  Baby,
  Briefcase,
  GraduationCap,
  Lightbulb,
  ListChecks,
  Rocket,
  Target,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <Card className="bg-card/80 backdrop-blur-sm border-primary/20 transition-all hover:shadow-primary/20 hover:shadow-lg hover:-translate-y-1 h-full">
    <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
      <div className="p-2 bg-primary/10 rounded-full">{icon}</div>
      <CardTitle className="text-xl">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export default function FeaturesPage() {
  return (
    <div className="flex flex-col items-center min-h-screen p-4 md:p-8 animate-fade-in bg-background text-foreground">
      <div className="w-full max-w-5xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-br from-primary via-purple-500 to-indigo-600 text-transparent bg-clip-text">
            How AIPath Works
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your learning ambitions into reality in just a few clicks.
          </p>
        </header>

        <main className="space-y-16">
          <section>
            <h2 className="text-3xl font-bold mb-8 text-center">In 3 Simple Steps</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard
                icon={<Lightbulb className="h-8 w-8 text-primary" />}
                title="1. Tell Us Your Interests"
                description="Describe what you want to learn, your current knowledge, and your ultimate career goals."
              />
              <FeatureCard
                icon={<ListChecks className="h-8 w-8 text-primary" />}
                title="2. Get a Learning Path"
                description="Our AI generates a structured, step-by-step learning path tailored specifically to you."
              />
              <FeatureCard
                icon={<Rocket className="h-8 w-8 text-primary" />}
                title="3. Start Learning"
                description="Begin your journey with curated, high-quality resources for every step of your new path."
              />
            </div>
          </section>
          
          <section>
            <h2 className="text-3xl font-bold mb-8 text-center">Why Use AIPath?</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard
                icon={<Target className="h-8 w-8 text-primary" />}
                title="Personalized Guidance"
                description="Stop generic tutorials. Get a plan that understands your specific goals and starting point."
              />
              <FeatureCard
                icon={<Clock className="h-8 w-8 text-primary" />}
                title="Save Time & Avoid Confusion"
                description="No more guesswork or 'analysis paralysis.' We provide a clear, actionable roadmap from the start."
              />
              <FeatureCard
                icon={<BookOpen className="h-8 w-8 text-primary" />}
                title="Curated Resources"
                description="Access beginner-friendly, high-quality resources without having to search through endless options."
              />
            </div>
          </section>
          
          <section>
            <h2 className="text-3xl font-bold mb-8 text-center">Who Is This For?</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <FeatureCard
                icon={<Baby className="h-8 w-8 text-primary" />}
                title="Aspiring Beginners"
                description="Perfect for those new to a field who need a clear starting point and foundational knowledge."
              />
               <FeatureCard
                icon={<Briefcase className="h-8 w-8 text-primary" />}
                title="Career Switchers"
                description="For professionals looking to pivot into a new industry by learning a new set of skills efficiently."
              />
               <FeatureCard
                icon={<GraduationCap className="h-8 w-8 text-primary" />}
                title="Students & Explorers"
                description="An excellent tool for students or the curious-minded who want to explore new subjects."
              />
            </div>
          </section>
        </main>
        
        <footer className="mt-16 text-center">
           <Button asChild size="lg">
              <Link href="/path">
                  Continue
                  <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
          </Button>
        </footer>
      </div>
    </div>
  );
}
