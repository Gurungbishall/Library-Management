"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { toast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { addMonths } from "date-fns";
import { Card, CardTitle } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React from "react";

const FormSchema = z.object({
  due_date: z.date({
    required_error: "A due date is required.",
  }),
});

const today = new Date();
const threeMonthsFromToday = addMonths(new Date(), 3);

export const AddBookinLoanList = ({
  book_id,
  setBoolean,
}: {
  book_id: number;
  setBoolean: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const Url = process.env.NEXT_PUBLIC_API;
  const user_id = sessionStorage.getItem("user_id");

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const response = await fetch(`${Url}/loan/loanBook`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user_id,
          book_id: book_id,
          due_date: data.due_date.toISOString(),
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        toast({
          title: "Already Borrow",
          description: result.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Successfully submitted!",
          description: result.message,
          variant: "default",
        });
        setBoolean(false);
      }
    } catch {
      toast({
        title: "Submission failed!",
        description: `message}`,
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="w-3/4 md:w-1/3 xl:w-1/4 h-1/4 flex flex-col items-center justify-center gap-3 rounded-xl">
      <CardTitle className="text-base md:text-xl font-semibold">
        This is the book you want to loan?
      </CardTitle>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="due_date"
            render={({ field }) => (
              <FormItem className="w-full flex flex-col">
                <FormLabel className="md:text-base font-bold">
                  Due Date
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => {
                        return date < today || date > threeMonthsFromToday;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </Card>
  );
};
