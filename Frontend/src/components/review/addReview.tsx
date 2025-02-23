"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { useSession } from "@/app/context/authContext";
import { Card, CardTitle } from "../ui/card";
import { useState } from "react";
import { StarRating } from "../renderStars/starRating";

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
    }
  }

  return (
    <Card className="py-4 w-3/4 md:w-1/3 xl:w-1/4 h-2/6 md:h-auto flex flex-col items-center gap-3 rounded-xl">
      <CardTitle className="text-base md:text-xl font-semibold">
        Review the Book
      </CardTitle>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-4 px-4"
        >
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base md:text-xl font-semibold">
                  Rating
                </FormLabel>
                <FormControl>
                  <StarRating
                    {...field}
                    rating={selectedRating}
                    onRatingChange={(star: number) => {
                      setSelectedRating(star); 
                      setValue("rating", star); 
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="review_text"
            render={({ field }) => (
              <FormItem className="w-full flex flex-col">
                <FormLabel className="text-base md:text-xl font-semibold">
                  Review
                </FormLabel>
                <FormControl>
                  <textarea {...field} placeholder="Optional review" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={selectedRating === null}>
            Submit
          </Button>
        </form>
      </Form>
    </Card>
  );
};
