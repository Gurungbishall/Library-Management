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
import { UserType } from "@/types/types.s";

const FormSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Please enter the Username" })
    .max(50, { message: "Username must not exceed 50 characters" }),

  email: z.string().email({ message: "Please enter a valid email address" }),

  phone_number: z.string().regex(/^\+?\d{1,4}?[\d\s\-\(\)]{7,15}$/, {
    message: "Phone number must be valid and can include country code",
  }),

  age: z
    .string()
    .min(2, { message: "Age must be at least 18" })
    .max(3, { message: "Age must not exceed 100" }),

  sex: z.string().min(1, { message: "Sex is required" }),
  course: z.string().min(1, { message: "Course is required" }),

  userimage: z.any().optional(),
});

export default function EditUser({
  user_id,
  data,
  setDefault,
}: {
  user_id: number | null;
  data: UserType | null;
  setDefault: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [loading, setLoading] = useState(false);
  const Url = process.env.NEXT_PUBLIC_API;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: data?.name,
      email: data?.email,
      sex: data?.sex,
      age: String(data?.age),
      course: data?.course,
      phone_number: data?.phone_number,
      userimage: undefined,
    },
  });

  if (user_id === undefined || user_id === 0) {
    toast({
      title: "No user_id",
      description: "Please Select a user_id",
      variant: "destructive",
    });
  }

  if (!data) {
    toast({
      title: "No user data",
      description: "Please select a user to edit.",
      variant: "destructive",
    });
    return null;
  }

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("sex", data.sex);
    formData.append("age", String(data.age));
    formData.append("course", data.course);
    formData.append("phone_number", data.phone_number);

    if (data.userimage && data.userimage[0]) {
      formData.append("userimage", data.userimage[0]);
    } else {
      formData.append("userimage", "");
    }

    try {
      const response = await fetch(`${Url}/auth/editDetails/${user_id}`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const result = await response.json();
      if (!response.ok) {
        toast({
          title: "User edit failed",
          description: result.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "User updated successfully",
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
    <main className="flex flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full md:max-w-3xl">
        <div className="flex flex-col gap-6 shadow-lg">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="p-6 md:p-8 flex flex-col gap-2 md:gap-4 xl:gap-6 "
            >
              <p className="font-bold text-balance text-center text-muted-foreground ">
                Register to Big Library
              </p>
              <div className="grid md:grid-cols-2 gap-2 md:gap-4 xl:gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ram"
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="aa@email.com"
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
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="9878******"
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
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="18"
                          type="number"
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
                  name="sex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sex</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(e) => {
                          field.onChange(e);
                        }}
                        disabled={loading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Sex" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="course"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(e) => {
                          field.onChange(e);
                        }}
                        disabled={loading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Course" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bsc.csit">Bsc.CSIT</SelectItem>
                          <SelectItem value="bca">BCA</SelectItem>
                          <SelectItem value="b.tech">B.Tech</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="userimage"
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
                {loading ? "Loading" : "Edit"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
}
