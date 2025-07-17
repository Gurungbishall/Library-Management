"use client";
import { useSession } from "@/app/context/authContext";
import { toast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { MessageCircle, Star } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { StarRating } from "../renderStars/starRating";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const FormSchema = z.object({
  rating: z
    .number()
    .min(1, { message: "Rating is required" })
    .max(5, { message: "Rating must be between 1 and 5" }),
  review_text: z.string().optional(),
});

export const AddReview = ({
  book_id,
  setDefault,
}: {
  book_id: number;
  setDefault: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { user_Id } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const { setValue } = form;
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const Url = process.env.NEXT_PUBLIC_API;

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (selectedRating === null) {
      toast({
        title: "Rating is required",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const { review_text } = data;

    try {
      const response = await fetch(`${Url}/review/reviewItem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user_Id,
          content_type: "book",
          content_id: book_id,
          rating: selectedRating,
          review_text: review_text,
        }),
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        toast({
          title: "Failed to Submit Review",
          description: result.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Successfully submitted!",
          description: result.message,
          variant: "default",
        });
        setDefault("default");
      }
    } catch {
      toast({
        title: "Submission failed!",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="border-0 shadow-2xl bg-white dark:bg-slate-800 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold">
            <Star className="w-5 h-5" />
            Write a Review
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold text-gray-900 dark:text-white">
                      Your Rating
                    </FormLabel>
                    <FormControl>
                      <div className="flex justify-center py-2">
                        <StarRating
                          {...field}
                          rating={selectedRating}
                          onRatingChange={(star: number) => {
                            setSelectedRating(star);
                            setValue("rating", star);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="review_text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Your Review (Optional)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Share your thoughts about this book..."
                        className="min-h-[100px] resize-none border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDefault("default")}
                  className="flex-1 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={selectedRating === null || isSubmitting}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
};
