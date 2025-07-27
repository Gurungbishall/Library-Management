"use client";

import { toast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Eye,
  EyeOff,
  GraduationCap,
  ImageIcon,
  Upload,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
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

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];

      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      form.setValue("userimage", files);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    form.setValue("userimage", undefined);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
    <main className="flex min-h-svh flex-col items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6 md:p-10 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-10 -left-10 w-40 h-40 bg-green-200 rounded-full opacity-20"
          animate={{
            x: [0, 60, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/4 -right-10 w-32 h-32 bg-teal-200 rounded-full opacity-20"
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -left-5 w-24 h-24 bg-emerald-200 rounded-full opacity-20"
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 w-20 h-20 bg-green-300 rounded-full opacity-15"
          animate={{
            x: [0, -25, 0],
            y: [0, -35, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      <motion.div
        className="w-full max-w-sm md:max-w-6xl relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="flex flex-col gap-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="overflow-hidden shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="grid p-0 lg:grid-cols-5">
              <motion.div
                className="relative hidden lg:block lg:col-span-2 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="absolute inset-0 bg-black/10" />
                <div className="relative h-full w-full flex flex-col gap-6 items-center justify-center text-white p-8">
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  >
                    <motion.div
                      className="mb-8"
                      animate={{ rotate: [0, -5, 5, 0] }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <UserPlus className="w-16 h-16 mx-auto mb-4" />
                    </motion.div>
                    <h1 className="text-4xl font-bold mb-2">Join Our</h1>
                    <h2 className="text-3xl font-semibold mb-2">Library</h2>
                    <h3 className="text-4xl font-bold bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                      Community
                    </h3>
                  </motion.div>

                  <motion.div
                    className="grid grid-cols-1 gap-4 mt-8 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  >
                    <motion.div
                      className="flex items-center gap-3 text-green-100"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <GraduationCap className="w-5 h-5" />
                      <span>Student Access</span>
                    </motion.div>
                    <motion.div
                      className="flex items-center gap-3 text-green-100"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <BookOpen className="w-5 h-5" />
                      <span>Unlimited Books</span>
                    </motion.div>
                    <motion.div
                      className="flex items-center gap-3 text-green-100"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Users className="w-5 h-5" />
                      <span>Study Groups</span>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Right side - Form section */}
              <motion.div
                className="lg:col-span-3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Form {...form}>
                  <motion.form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="p-6 md:p-8 flex flex-col gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <motion.div
                      className="text-center lg:text-left mb-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                    >
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Create Account
                      </h3>
                      <p className="text-balance text-muted-foreground">
                        Register to Big Library and start your learning journey
                      </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                      >
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-medium">
                                Student Name
                              </FormLabel>
                              <FormControl>
                                <motion.div
                                  whileFocus={{ scale: 1.02 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 300,
                                  }}
                                >
                                  <Input
                                    placeholder="Ram"
                                    {...field}
                                    disabled={loading}
                                    className="h-11 border-gray-200 focus:border-green-500 transition-colors"
                                  />
                                </motion.div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.85 }}
                      >
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-medium">
                                Email
                              </FormLabel>
                              <FormControl>
                                <motion.div
                                  whileFocus={{ scale: 1.02 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 300,
                                  }}
                                >
                                  <Input
                                    placeholder="aa@email.com"
                                    {...field}
                                    disabled={loading}
                                    className="h-11 border-gray-200 focus:border-green-500 transition-colors"
                                  />
                                </motion.div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.9 }}
                      >
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-medium">
                                Password
                              </FormLabel>
                              <FormControl className="relative">
                                <motion.div
                                  whileFocus={{ scale: 1.02 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 300,
                                  }}
                                >
                                  <Input
                                    placeholder="Enter password"
                                    type={showPassword ? "text" : "password"}
                                    {...field}
                                    disabled={loading}
                                    className="h-11 border-gray-200 focus:border-green-500 transition-colors pr-12"
                                  />
                                  <motion.button
                                    type="button"
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-3"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <AnimatePresence mode="wait">
                                      {showPassword ? (
                                        <motion.div
                                          key="eye"
                                          initial={{ opacity: 0, rotate: -90 }}
                                          animate={{ opacity: 1, rotate: 0 }}
                                          exit={{ opacity: 0, rotate: 90 }}
                                          transition={{ duration: 0.2 }}
                                        >
                                          <Eye className="h-5 w-5 text-gray-400" />
                                        </motion.div>
                                      ) : (
                                        <motion.div
                                          key="eye-off"
                                          initial={{ opacity: 0, rotate: -90 }}
                                          animate={{ opacity: 1, rotate: 0 }}
                                          exit={{ opacity: 0, rotate: 90 }}
                                          transition={{ duration: 0.2 }}
                                        >
                                          <EyeOff className="h-5 w-5 text-gray-400" />
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </motion.button>
                                </motion.div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.95 }}
                      >
                        <FormField
                          control={form.control}
                          name="phone_number"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-medium">
                                Phone Number
                              </FormLabel>
                              <FormControl>
                                <motion.div
                                  whileFocus={{ scale: 1.02 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 300,
                                  }}
                                >
                                  <Input
                                    placeholder="9878******"
                                    {...field}
                                    disabled={loading}
                                    className="h-11 border-gray-200 focus:border-green-500 transition-colors"
                                  />
                                </motion.div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.0 }}
                      >
                        <FormField
                          control={form.control}
                          name="age"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-medium">
                                Age
                              </FormLabel>
                              <FormControl>
                                <motion.div
                                  whileFocus={{ scale: 1.02 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 300,
                                  }}
                                >
                                  <Input
                                    placeholder="18"
                                    type="number"
                                    {...field}
                                    disabled={loading}
                                    className="h-11 border-gray-200 focus:border-green-500 transition-colors"
                                  />
                                </motion.div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.05 }}
                      >
                        <FormField
                          control={form.control}
                          name="sex"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-medium">
                                Sex
                              </FormLabel>
                              <motion.div
                                whileFocus={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <Select
                                  value={field.value}
                                  onValueChange={(e) => {
                                    field.onChange(e);
                                  }}
                                  disabled={loading}
                                >
                                  <SelectTrigger className="h-11 border-gray-200 focus:border-green-500 transition-colors">
                                    <SelectValue placeholder="Select Sex" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">
                                      Female
                                    </SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                              </motion.div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.1 }}
                      >
                        <FormField
                          control={form.control}
                          name="course"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-medium">
                                Course
                              </FormLabel>
                              <motion.div
                                whileFocus={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <Select
                                  value={field.value}
                                  onValueChange={(e) => {
                                    field.onChange(e);
                                  }}
                                  disabled={loading}
                                >
                                  <SelectTrigger className="h-11 border-gray-200 focus:border-green-500 transition-colors">
                                    <SelectValue placeholder="Select Course" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="bsc.csit">
                                      Bsc.CSIT
                                    </SelectItem>
                                    <SelectItem value="bca">BCA</SelectItem>
                                    <SelectItem value="b.tech">
                                      B.Tech
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </motion.div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div
                        className="md:col-span-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.15 }}
                      >
                        <FormField
                          control={form.control}
                          name="userimage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-medium">
                                Upload Profile Image
                              </FormLabel>
                              <FormControl>
                                <motion.div
                                  className="space-y-4"
                                  whileFocus={{ scale: 1.01 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 300,
                                  }}
                                >
                                  <AnimatePresence>
                                    {imagePreview && (
                                      <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="relative w-32 h-32 mx-auto"
                                      >
                                        <img
                                          src={imagePreview}
                                          alt="Preview"
                                          className="w-full h-full object-cover rounded-full border-4 border-green-200 shadow-lg"
                                        />
                                        <motion.button
                                          type="button"
                                          onClick={removeImage}
                                          className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.9 }}
                                        >
                                          <X className="w-4 h-4" />
                                        </motion.button>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>

                                  <motion.div
                                    className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 ${
                                      dragActive
                                        ? "border-green-500 bg-green-50"
                                        : imagePreview
                                        ? "border-green-300 bg-green-25"
                                        : "border-gray-300 hover:border-green-400 hover:bg-green-25"
                                    }`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    whileHover={{ scale: 1.02 }}
                                    transition={{
                                      type: "spring",
                                      stiffness: 300,
                                    }}
                                  >
                                    <input
                                      type="file"
                                      accept="image/*"
                                      ref={(el) => {
                                        field.ref(el);
                                        fileInputRef.current = el;
                                      }}
                                      onChange={(e) =>
                                        handleFileChange(e.target.files)
                                      }
                                      disabled={loading}
                                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                    />

                                    <motion.div
                                      className="flex flex-col items-center space-y-3"
                                      animate={
                                        dragActive
                                          ? { scale: 1.05 }
                                          : { scale: 1 }
                                      }
                                    >
                                      <motion.div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                          dragActive || imagePreview
                                            ? "bg-green-100"
                                            : "bg-gray-100"
                                        }`}
                                        animate={
                                          dragActive
                                            ? { rotate: [0, 5, -5, 0] }
                                            : { rotate: 0 }
                                        }
                                        transition={{ duration: 0.5 }}
                                      >
                                        {imagePreview ? (
                                          <ImageIcon
                                            className={`w-6 h-6 ${
                                              dragActive
                                                ? "text-green-600"
                                                : "text-green-500"
                                            }`}
                                          />
                                        ) : (
                                          <Upload
                                            className={`w-6 h-6 ${
                                              dragActive
                                                ? "text-green-600"
                                                : "text-gray-500"
                                            }`}
                                          />
                                        )}
                                      </motion.div>

                                      <div className="space-y-1">
                                        {imagePreview ? (
                                          <>
                                            <p className="text-sm font-medium text-green-700">
                                              Image uploaded successfully!
                                            </p>
                                            <p className="text-xs text-green-600">
                                              Click to change or drag a new
                                              image
                                            </p>
                                          </>
                                        ) : dragActive ? (
                                          <>
                                            <p className="text-sm font-medium text-green-700">
                                              Drop your image here
                                            </p>
                                            <p className="text-xs text-green-600">
                                              Release to upload
                                            </p>
                                          </>
                                        ) : (
                                          <>
                                            <p className="text-sm font-medium text-gray-700">
                                              Click to upload or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500">
                                              PNG, JPG, JPEG up to 5MB
                                            </p>
                                          </>
                                        )}
                                      </div>

                                      {!imagePreview && !dragActive && (
                                        <motion.div
                                          className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg font-medium hover:bg-green-700 transition-colors"
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                        >
                                          Choose File
                                        </motion.div>
                                      )}
                                    </motion.div>
                                  </motion.div>
                                </motion.div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    </div>

                    <motion.div
                      className="mt-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 1.2 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          <AnimatePresence mode="wait">
                            {loading ? (
                              <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2"
                              >
                                <motion.div
                                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                  animate={{ rotate: 360 }}
                                  transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: "linear",
                                  }}
                                />
                                Creating Account...
                              </motion.div>
                            ) : (
                              <motion.span
                                key="register"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                              >
                                Create Account
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </Button>
                      </motion.div>
                    </motion.div>

                    <motion.div
                      className="flex gap-2 justify-center mt-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 1.25 }}
                    >
                      <span className="text-balance text-muted-foreground">
                        Already have an account?
                      </span>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          href="/auth/login"
                          className="text-green-600 hover:text-green-700 underline font-medium transition-colors"
                        >
                          Login here
                        </Link>
                      </motion.div>
                    </motion.div>
                  </motion.form>
                </Form>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </main>
  );
}
