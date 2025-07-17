"use client";

import { toast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, Plus, Upload, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),

  author: z.string().min(1, { message: "Author is required" }),

  category: z.string().min(1, { message: "Category is required" }),

  isbn: z.string().min(1, { message: "ISBN is required" }),

  publication_year: z
    .string()
    .min(1, { message: "Publication year is required" })
    .transform((val) => Number(val)),

  quantity: z
    .string()
    .min(1, { message: "Quantity must be at least 1" })
    .transform((val) => Number(val)),

  available: z
    .string()
    .min(0, { message: "Available quantity must be at least 0" })
    .transform((val) => Number(val)),

  average_rating: z
    .string()
    .regex(/^(?:[0-5](?:\.\d{1})?)$/, {
      message:
        "Rating must be a number between 0 and 5, with at most 1 decimal place",
    })
    .transform((val) => parseFloat(val)),

  description: z.string().min(1, { message: "Description is required" }),
  bookimage: z.any().optional(),
});

export default function AddBook({
  setDefault,
}: {
  setDefault: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [loading, setLoading] = useState(false);
  const Url = process.env.NEXT_PUBLIC_API;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      author: "",
      category: "",
      isbn: "",
      publication_year: 0,
      quantity: 1,
      available: 1,
      average_rating: 0,
      description: "",
      bookimage: undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("author", data.author);
    formData.append("category", data.category);
    formData.append("isbn", data.isbn);
    formData.append("publication", String(data.publication_year));
    formData.append("quantity", String(data.quantity));
    formData.append("available", String(data.available));
    formData.append("average_rating", String(data.average_rating));
    formData.append("description", data.description);

    if (data.bookimage && data.bookimage[0]) {
      formData.append("bookimage", data.bookimage[0]);
    } else {
      toast({
        title: "No file",
        description: "Please Selected Photo",
        variant: "destructive",
      });
    }

    try {
      const response = await fetch(`${Url}/book/addBook`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const result = await response.json();
      if (!response.ok) {
        toast({
          title: "Book addition failed",
          description: result.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Book added successfully",
          description: result.message,
          variant: "default",
        });
      }
    } catch {
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setDefault("default");
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto border-0 shadow-2xl bg-white dark:bg-slate-900">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-full">
              <BookOpen className="w-6 h-6" />
            </div>
            <CardTitle className="text-2xl font-bold">Add New Book</CardTitle>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setDefault("default")}
            className="text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Book Title *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="The Great Gatsby"
                        {...field}
                        disabled={loading}
                        className="focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Author *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="F. Scott Fitzgerald"
                        {...field}
                        disabled={loading}
                        className="focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Category *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Fiction"
                        {...field}
                        disabled={loading}
                        className="focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isbn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      ISBN *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="9780743273565"
                        {...field}
                        disabled={loading}
                        className="focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="publication_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Publication Year *
                    </FormLabel>
                    <Select
                      onValueChange={(year) => {
                        field.onChange(year);
                      }}
                      disabled={loading}
                    >
                      <SelectTrigger className="focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 100 }, (_, index) => {
                          const year = new Date().getFullYear() - index;
                          return (
                            <SelectItem key={year} value={String(year)}>
                              {year}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Quantity *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder="10"
                        {...field}
                        disabled={loading}
                        className="focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="available"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Available *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="8"
                        {...field}
                        disabled={loading}
                        className="focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="average_rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Average Rating *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        placeholder="4.5"
                        {...field}
                        disabled={loading}
                        className="focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description *
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A classic novel set in the 1920s..."
                      {...field}
                      disabled={loading}
                      rows={4}
                      className="focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bookimage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Book Cover Image *
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <Input
                        type="file"
                        accept="image/*"
                        ref={field.ref}
                        onChange={(e) => field.onChange(e.target.files)}
                        disabled={loading}
                        className="focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      />
                      <Upload className="w-5 h-5 text-gray-400" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDefault("default")}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Adding...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Book
                  </div>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
