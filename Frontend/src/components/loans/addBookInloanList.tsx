"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useSession } from "@/app/context/authContext";
import { toast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { addMonths } from "date-fns";
import React, { useState } from "react";
import { Card, CardTitle } from "../ui/card";
const FormSchema = z.object({
  due_date: z
    .date({
      required_error: "A due date is required.",
    })
    .refine(
      (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const maxDate = addMonths(today, 3);
        return date >= today && date <= maxDate;
      },
      {
        message: "Due date must be between today and 3 months from now.",
      }
    ),
});

export const AddBookinLoanList = ({
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
    defaultValues: {
      due_date: addMonths(new Date(), 1), // Default to 1 month from today
    },
  });
  const Url = process.env.NEXT_PUBLIC_API;

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${Url}/loan/loanBook`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user_Id,
          book_id: book_id,
          due_date: data.due_date.toISOString(),
        }),
        credentials: "include",
      });

      const result = await response.json();
      if (!response.ok) {
        toast({
          title: "Already Borrowed",
          description:
            result.message || "This book is already borrowed by you.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Successfully Borrowed!",
          description:
            result.message || "You have successfully borrowed this book.",
          variant: "default",
        });
        setDefault("default");
      }
    } catch {
      toast({
        title: "Submission failed!",
        description:
          "An error occurred while submitting your request. Please try again.",
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
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="w-[90vw] md:w-[400px] xl:w-[450px] bg-white dark:bg-slate-800 border-0 shadow-2xl rounded-2xl p-6 dark:border dark:border-slate-700">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <CardTitle className="text-lg md:text-xl font-bold text-center mb-6 text-gray-900 dark:text-white">
            📚 Borrow This Book?
          </CardTitle>
        </motion.div>

        <Form {...form}>
          <motion.form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <FormField
              control={form.control}
              name="due_date"
              render={({ field }) => (
                <FormItem className="w-full flex flex-col">
                  <FormLabel className="text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300">
                    📅 Due Date
                  </FormLabel>
                  <FormControl>
                    <DatePicker
                      date={field.value}
                      onDateChange={(date) => {
                        console.log("Date selected:", date);
                        if (date) {
                          field.onChange(date);
                          console.log("Date set in form:", date);
                        }
                      }}
                      placeholder="Pick a due date"
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const maxDate = addMonths(today, 3);
                        const isDisabled = date < today || date > maxDate;
                        return isDisabled;
                      }}
                    />
                  </FormControl>
                  <FormMessage className="dark:text-red-400" />
                </FormItem>
              )}
            />

            <div className="flex gap-3 mt-4">
              <motion.div
                className="flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 font-semibold border-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                  onClick={() => setDefault("default")}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </motion.div>

              <motion.div
                className="flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full h-12 font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-lg disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <motion.div
                      className="flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Borrowing...
                    </motion.div>
                  ) : (
                    "📖 Borrow Book"
                  )}
                </Button>
              </motion.div>
            </div>
          </motion.form>
        </Form>
      </Card>
    </motion.div>
  );
};
