
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Sparkles, Wand } from "lucide-react";
import { Textarea } from "../ui/textarea";


export const formSchema = z.object({
  interests: z.string().min(10, "Please describe your interests in at least 10 characters."),
  currentKnowledge: z.string().min(10, "Please describe your knowledge in at least 10 characters."),
  careerGoals: z.string().min(10, "Please describe your goals in at least 10 characters."),
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
      interests: "web development and generative AI",
      currentKnowledge: "I know some HTML, CSS, and basic JavaScript.",
      careerGoals: "I want to become a full-stack developer and build my own applications.",
    },
  });

  

  return (
    <Card className="w-full max-w-3xl shadow-2xl transition-shadow duration-300 border border-primary/20 bg-card backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">Create Your Learning Path</CardTitle>
        <CardDescription>Tell us about yourself, and we'll generate a personalized roadmap.</CardDescription>
      </CardHeader>
      <CardContent>
         <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="interests"
              render={({ field }: { field: import("react-hook-form").ControllerRenderProps<InputFormValues, "interests"> }) => (
                <FormItem>
                  <FormLabel className="text-lg">What are your interests?</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Web development, machine learning, data science..."
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
              render={({ field }: { field: import("react-hook-form").ControllerRenderProps<InputFormValues, "currentKnowledge"> }) => (
                <FormItem>
                  <FormLabel className="text-lg">Current Knowledge Level?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'Beginner in Python', 'I've built a few React apps'..."
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
              render={({ field }: { field: import("react-hook-form").ControllerRenderProps<InputFormValues, "careerGoals"> }) => (
                <FormItem>
                  <FormLabel className="text-lg">Career Goals?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'Become a data scientist', 'Get a job as a frontend developer', 'Build my own startup'"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    What do you hope to achieve with your new skill?                 
                     </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} size="lg" className="w-full text-xl font-semibold ">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  Generating Your Path...
                </>
              ) : (
                <>
                  Generate My Path
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
