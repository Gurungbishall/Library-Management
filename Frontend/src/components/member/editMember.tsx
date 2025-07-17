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
import { UserType } from "@/types/types.s";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, UserCheck, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
  role: z.string().min(1, { message: "Role is required" }),

  userimage: z.any().optional(),
});

export default function EditMember({
  user_id,
  data,
  setDefault,
}: {
  user_id: number;
  data: UserType | undefined;
  setDefault: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [loading, setLoading] = useState(false);
  const Url = process.env.NEXT_PUBLIC_API;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: data?.name || "",
      email: data?.email || "",
      sex: data?.sex || "",
      age: String(data?.age) || "",
      course: data?.course || "",
      role: data?.role || "",
      phone_number: data?.phone_number || "",
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
    formData.append("role", data.role);
    formData.append("phone_number", data.phone_number);

    if (data.userimage && data.userimage[0]) {
      formData.append("userimage", data.userimage[0]);
    } else {
      formData.append("userimage", "");
    }

    try {
      const response = await fetch(`${Url}/admin/editMember/${user_id}`, {
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
    <Card className="w-full max-w-4xl mx-auto border-0 shadow-2xl bg-white dark:bg-slate-900">
      <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-full">
              <UserCheck className="w-6 h-6" />
            </div>
            <CardTitle className="text-2xl font-bold">Edit Member</CardTitle>
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Full Name *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        {...field}
                        disabled={loading}
                        className="focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
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
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email Address *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john.doe@example.com"
                        {...field}
                        disabled={loading}
                        className="focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
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
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Phone Number *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        {...field}
                        disabled={loading}
                        className="focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
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
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Age *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="18"
                        max="100"
                        placeholder="25"
                        {...field}
                        disabled={loading}
                        className="focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
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
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Gender *
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={loading}
                    >
                      <SelectTrigger className="focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400">
                        <SelectValue placeholder="Select gender" />
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
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Course *
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={loading}
                    >
                      <SelectTrigger className="focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400">
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bsc.csit">Bsc.CSIT</SelectItem>
                        <SelectItem value="bca">BCA</SelectItem>
                        <SelectItem value="b.tech">B.Tech</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Role *
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={loading}
                    >
                      <SelectTrigger className="focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="userimage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Update Profile Picture (Optional)
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <Input
                        type="file"
                        accept="image/*"
                        ref={field.ref}
                        onChange={(e) => field.onChange(e.target.files)}
                        disabled={loading}
                        className="focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
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
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4" />
                    Update Member
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
