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
import { Eye, EyeOff } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Please enter the Username" })
    .max(50, { message: "Username must not exceed 50 characters" }),

  email: z.string().email({ message: "Please enter a valid email address" }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(25, { message: "Password must not exceed 25 characters" }),

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

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();
  const Url = process.env.NEXT_PUBLIC_API;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone_number: "",
      age: "",
      sex: "",
      course: "",
      userimage: undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);

    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("phone_number", data.phone_number);
    formData.append("age", String(data.age));
    formData.append("sex", data.sex);
    formData.append("course", data.course);

    if (data.userimage && data.userimage[0]) {
      formData.append("userimage", data.userimage[0]);
    }

    try {
      const response = await fetch(`${Url}/auth/register`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const result = await response.json();
      if (!response.ok) {
        toast({
          title: "Registration failed",
          description: result.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration successful",
          description: result.message,
          variant: "default",
        });
        router.push("/auth/login");
      }
    } catch {
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className=" shadow-lg">
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl className="relative">
                        <div>
                          <Input
                            placeholder="Enter password"
                            type={showPassword ? "text" : "password"}
                            {...field}
                            disabled={loading}
                          />
                          <div className="absolute right-3 top-2">
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <Eye className="h-5 w-5 text-gray-400" />
                              ) : (
                                <EyeOff className="h-5 w-5 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>
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
                {loading ? "Loading" : "Register"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
}
