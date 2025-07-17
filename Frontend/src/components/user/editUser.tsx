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
import { motion } from "framer-motion";
import { Loader2, Save, Upload, X } from "lucide-react";
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
    <motion.div
      className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.3 }}
      >
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-white/95 to-white/90 dark:from-gray-900/95 dark:to-gray-800/90 backdrop-blur-md">
          <CardHeader className="relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10"></div>

            <div className="relative flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Edit Profile
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Update your profile information
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDefault("default")}
                className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-200 font-medium">
                            Student Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your name"
                              {...field}
                              disabled={loading}
                              className="bg-white/70 dark:bg-gray-800/70 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.15 }}
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-200 font-medium">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your email"
                              {...field}
                              disabled={loading}
                              className="bg-white/70 dark:bg-gray-800/70 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <FormField
                      control={form.control}
                      name="phone_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-200 font-medium">
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your phone number"
                              {...field}
                              disabled={loading}
                              className="bg-white/70 dark:bg-gray-800/70 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.25 }}
                  >
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-200 font-medium">
                            Age
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your age"
                              type="number"
                              {...field}
                              disabled={loading}
                              className="bg-white/70 dark:bg-gray-800/70 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <FormField
                      control={form.control}
                      name="sex"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-200 font-medium">
                            Gender
                          </FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={(e) => {
                              field.onChange(e);
                            }}
                            disabled={loading}
                          >
                            <SelectTrigger className="bg-white/70 dark:bg-gray-800/70 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200">
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
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.35 }}
                  >
                    <FormField
                      control={form.control}
                      name="course"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-200 font-medium">
                            Course
                          </FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={(e) => {
                              field.onChange(e);
                            }}
                            disabled={loading}
                          >
                            <SelectTrigger className="bg-white/70 dark:bg-gray-800/70 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200">
                              <SelectValue placeholder="Select course" />
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
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="col-span-full"
                >
                  <FormField
                    control={form.control}
                    name="userimage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-200 font-medium">
                          Profile Image
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="file"
                              accept="image/*"
                              ref={field.ref}
                              onChange={(e) => field.onChange(e.target.files)}
                              disabled={loading}
                              className="bg-white/70 dark:bg-gray-800/70 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 dark:file:bg-blue-900/20 file:text-blue-700 dark:file:text-blue-400 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/40"
                            />
                            <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.45 }}
                  className="flex gap-4 pt-4"
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDefault("default")}
                    disabled={loading}
                    className="flex-1 bg-white/70 dark:bg-gray-800/70 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
