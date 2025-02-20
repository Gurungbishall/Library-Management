"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    <main className="flex  flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full md:max-w-3xl">
        <div className="flex flex-col gap-6 shadow-lg">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="p-6 md:p-8 flex flex-col gap-2 md:gap-6"
            >
              <p className="text-balance text-center text-muted-foreground">
                Add a New Book to the Library
              </p>
              <div className="grid md:grid-cols-2 gap-1 md:gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Book Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="The Great Gatsby"
                          {...field}
                          disabled={loading}
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
                      <FormLabel>Author</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="F. Scott Fitzgerald"
                          {...field}
                          disabled={loading}
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
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Fiction"
                          {...field}
                          disabled={loading}
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
                      <FormLabel>ISBN</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="9780743273565"
                          {...field}
                          disabled={loading}
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
                      <FormLabel>Publication Year</FormLabel>
                      <Select
                        onValueChange={(year) => {
                          field.onChange(year);
                        }}
                        disabled={loading}
                      >
                        <SelectTrigger>
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
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input placeholder="10" {...field} disabled={loading} />
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
                      <FormLabel>Available</FormLabel>
                      <FormControl>
                        <Input placeholder="8" {...field} disabled={loading} />
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
                      <FormLabel>Average Rating</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="4.5"
                          {...field}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="A classic novel set in the 1920s..."
                          {...field}
                          disabled={loading}
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
                      <FormLabel>Upload Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          ref={field.ref}
                          onChange={(e) => field.onChange(e.target.files)}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Loading" : "Add Book"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
}
