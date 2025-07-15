
"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Wand2 } from "lucide-react";

export const refineFormSchema = z.object({
  refinementRequest: z.string().min(5, "Please describe your refinement request in at least 5 characters."),
});

export type RefineFormValues = z.infer<typeof refineFormSchema>;

interface RefinePathFormProps {
  onSubmit: (values: RefineFormValues) => void;
  isLoading: boolean; 
}

export function RefinePathForm({ onSubmit, isLoading }: RefinePathFormProps) {
  const form = useForm<RefineFormValues>({
    resolver: zodResolver(refineFormSchema),
    defaultValues: {
      refinementRequest: "",
    },
  });

  const handleSubmit = (values: RefineFormValues) => {
    onSubmit(values);
    // Do not reset the form, user might want to refine again
    // form.reset();
  };

  return (
    <Card className="w-full max-w-3xl shadow-2xl transition-shadow duration-300 mx-auto border border-primary/20 bg-card backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center text-3xl">
          <Wand2 className="mr-3 text-primary" />
          Refine Your Path
        </CardTitle>
        <CardDescription>Want to make changes? Let the AI know how to adjust your path.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="refinementRequest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Your Refinement Request</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'Make the path shorter', 'Focus more on backend development', 'Add more video resources for React'"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} size="lg" className="w-full text-xl font-semibold bg-gradient-to-br from-primary via-purple-500 to-indigo-600 text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/50 disabled:hover:scale-100">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  Refining Path...
                </>
              ) : (
                "Refine My Path"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
