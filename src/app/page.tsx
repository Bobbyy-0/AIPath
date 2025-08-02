
import { Button } from '@/components/ui/button';
import { ArrowRight, } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-screen p-4 md:p-8 animate-fade-in">
      <header className="mb-12 w-full max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-bold ">
          Welcome to AIPath
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Your personal AI guide to mastering new skills. Transform your ambitions into an actionable, step-by-step learning roadmap tailored just for you.
        </p>
      </header>

      <main>
        <div className="flex flex-col items-center space-y-6">
          <p className="text-lg text-foreground">Ready to start your journey?</p>
          <Button asChild size="lg" className="text-xl font-semibold bg-gradient-to-b from-primary via-blue-500 to-cyan-600   hover:scale-105 hover:shadow-lg hover:shadow-primary/50">
            <Link href="/path">
              Get Started
              <ArrowRight className="ml-2 h-6 w-6" />
            </Link>
          </Button>
        </div>
      </main>

      <footer className="absolute bottom-8 text-center text-sm text-muted-foreground space-y-2">
          <p>&copy; {new Date().getFullYear()} AIPath. All rights reserved.</p>
      </footer>
    </div>
  );
}
