
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BrainCircuit,
  Zap,
  TestTubeDiagonal,
  FileDown,
  Wand2,
  Cpu,
  Palette,
  Rocket,
  ArrowLeft,
  ShieldAlert,
  Heart,
  Sparkles,
  Puzzle,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { ThemeToggleButton } from '@/components/theme-toggle-button';

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

const TechCard = ({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) => (
  <div className="flex flex-col items-center gap-2 p-4 border rounded-lg bg-card/80 backdrop-blur-sm">
    {icon}
    <p className="font-semibold text-center">{title}</p>
  </div>
);

export default function PresentationPage() {
  return (
    <>
      <ThemeToggleButton />
      <div className="flex flex-col items-center min-h-screen p-4 md:p-8 animate-fade-in bg-background text-foreground">
        <div className="w-full max-w-5xl mx-auto">
          <header className="mb-12 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full border border-primary/20 shadow-inner">
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-br from-primary via-purple-500 to-indigo-600 text-transparent bg-clip-text">
              AIPath
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Your personal AI guide to mastering new skills.
            </p>
          </header>

          <main className="space-y-16">
            <section id="vision">
              <h2 className="text-3xl font-bold text-center mb-8">The Vision</h2>
              <Card className="bg-card/80 backdrop-blur-sm border-primary/20 shadow-xl">
                <CardContent className="p-8 text-center text-lg text-foreground/80">
                  <p>
                    AIPath was built to solve a common problem: knowing you want
                    to learn something new, but not knowing where to start. We
                    leverage the power of generative AI to transform your
                    ambitions into actionable, personalized, and encouraging
                    learning roadmaps. Our goal is to make learning accessible,
                    motivating, and tailored to each individual's unique journey.
                  </p>
                </CardContent>
              </Card>
            </section>

            <section id="features">
              <h2 className="text-3xl font-bold text-center mb-8">
                Core Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FeatureCard
                  icon={<Zap className="h-6 w-6 text-primary" />}
                  title="Personalized Path Generation"
                  description="Receive a custom, step-by-step learning path based on your interests, knowledge, and goals."
                />
                <FeatureCard
                  icon={<Wand2 className="h-6 w-6 text-primary" />}
                  title="AI-Powered Refinement"
                  description="Adapt your plan on the fly. Ask the AI to make it shorter, add resources, or focus on specific areas."
                />
                <FeatureCard
                  icon={<TestTubeDiagonal className="h-6 w-6 text-primary" />}
                  title="Interactive Quizzes"
                  description="Test your knowledge with AI-generated quizzes based on your specific learning path to reinforce concepts."
                />
                <FeatureCard
                  icon={<FileDown className="h-6 w-6 text-primary" />}
                  title="PDF Downloads"
                  description="Save your learning path as a professional, human-readable PDF with clickable links to all resources."
                />
                <FeatureCard
                  icon={<Palette className="h-6 w-6 text-primary" />}
                  title="Curated Resources"
                  description="Get recommendations for high-quality articles, videos, and courses relevant to each step of your path."
                />
                <FeatureCard
                  icon={<Rocket className="h-6 w-6 text-primary" />}
                  title="Fast & Modern UI"
                  description="Built with Next.js and Tailwind CSS for a responsive, fast, and enjoyable user experience."
                />
              </div>
            </section>

            <section id="approach">
                <h2 className="text-3xl font-bold text-center mb-8">Our Approach</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     <FeatureCard
                        icon={<Users className="h-6 w-6 text-primary" />}
                        title="User-Centric Design"
                        description="Start with a real user problem and design the simplest possible solution. The UI is clean, intuitive, and focused on the core task of generating a learning path."
                    />
                     <FeatureCard
                        icon={<Sparkles className="h-6 w-6 text-primary" />}
                        title="AI as an Enabler"
                        description="Use generative AI not as a novelty, but as a core utility to provide personalized, high-value output that would be impossible to scale manually."
                    />
                    <FeatureCard
                        icon={<Cpu className="h-6 w-6 text-primary" />}
                        title="Structured AI"
                        description="Leverage Genkit with Zod schemas to enforce a reliable and predictable structure for all AI inputs and outputs, ensuring data consistency and preventing errors."
                    />
                    <FeatureCard
                        icon={<Rocket className="h-6 w-6 text-primary" />}
                        title="Modern Frontend"
                        description="Build on a high-performance stack (Next.js, React, Tailwind) to create a fast, server-rendered, and maintainable user experience that feels modern."
                    />
                    <FeatureCard
                        icon={<Puzzle className="h-6 w-6 text-primary" />}
                        title="Component-Based"
                        description="Use Shadcn/UI to create a consistent, reusable, and easily customizable component library that we own and can adapt to any future needs."
                    />
                     <FeatureCard
                        icon={<Heart className="h-6 w-6 text-primary" />}
                        title="Encouraging Tone"
                        description="Ensure all AI-generated content is positive, motivating, and encouraging to support users on their learning journey, no matter their starting point."
                    />
                </div>
            </section>


            <section id="tech-stack">
              <h2 className="text-3xl font-bold text-center mb-8">
                Technology Stack
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <TechCard
                  icon={<Cpu className="h-10 w-10 text-primary" />}
                  title="Next.js & React"
                />
                <TechCard
                  icon={<Zap className="h-10 w-10 text-primary" />}
                  title="Genkit (Gemini)"
                />
                <TechCard
                  icon={<Palette className="h-10 w-10 text-primary" />}
                  title="Tailwind CSS"
                />
                <TechCard
                  icon={<Cpu className="h-10 w-10 text-primary" />}
                  title="Shadcn/UI"
                />
              </div>
            </section>
            
            <section id="limitations">
                <h2 className="text-3xl font-bold text-center mb-8">
                    Current Limitations
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FeatureCard
                        icon={<ShieldAlert className="h-6 w-6 text-primary" />}
                        title="No User Accounts"
                        description="Learning paths are generated per session. There is currently no system for creating user accounts to save, track, or manage multiple paths over time."
                    />
                    <FeatureCard
                        icon={<ShieldAlert className="h-6 w-6 text-primary" />}
                        title="AI Knowledge Scope"
                        description="The AI's knowledge is based on its training data and is not real-time. It may not be aware of the absolute latest technologies or trends."
                    />
                    <FeatureCard
                        icon={<ShieldAlert className="h-6 w-6 text-primary" />}
                        title="Resource Validity"
                        description="While the AI recommends high-quality resources, it cannot guarantee that links will always be active or that the content behind them is of a certain quality."
                    />
                    <FeatureCard
                        icon={<ShieldAlert className="h-6 w-6 text-primary" />}
                        title="Subjective Learning Path"
                        description="The generated path is a well-structured suggestion, not the only 'correct' way to learn a topic. Individual learning styles and preferences may vary."
                    />
                </div>
            </section>

            <section id="cta" className="text-center py-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
              <p className="text-muted-foreground mb-8">
                Generate your own personalized learning path now.
              </p>
              <Button asChild size="lg">
                <Link href="/path">
                  Launch AIPath
                  <Rocket className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </section>
          </main>
          
          <footer className="mt-12 text-center">
             <Button asChild variant="outline">
                <Link href="/path">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to App
                </Link>
            </Button>
          </footer>
        </div>
      </div>
    </>
  );
}
