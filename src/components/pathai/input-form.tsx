"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export const formSchema = z.object({
  interests: z.string().min(10, "Please describe your interests in at least 10 characters."),
  currentKnowledge: z.string().min(10, "Please describe your current knowledge in at least 10 characters."),
  careerGoals: z.string().min(10, "Please describe your career goals in at least 10 characters."),
});

export type InputFormValues = z.infer<typeof formSchema>;

interface InputFormProps {
  onSubmit: (values: InputFormValues) => void;
  isLoading: boolean;
}

export function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const form = useForm<InputFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interests: "",
      currentKnowledge: "",
      careerGoals: "",
    },
  });

  return (
    <Card className="w-full max-w-2xl shadow-lg">
      <CardHeader>
        <CardTitle>Create Your Learning Path</CardTitle>
        <CardDescription>Tell us about yourself, and we'll generate a personalized roadmap.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="interests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Interests</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Web development, machine learning, data science, cybersecurity..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    What topics or technologies are you passionate about?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentKnowledge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Knowledge Level</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Beginner in Python, some experience with HTML/CSS, familiar with basic programming concepts..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    What do you already know related to your interests?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="careerGoals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Career Goals</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Become a full-stack developer, work as a data analyst, start my own tech company..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    What do you hope to achieve with your new skills?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Path...
                </>
              ) : (
                "Generate My Path"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
