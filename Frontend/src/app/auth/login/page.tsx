"use client";
import { useSession } from "@/app/context/authContext";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Calendar, Eye, EyeOff, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(1, { message: "Please enter the password" })
    .max(25, { message: "Password must not excced 25 characters" }),
});

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { setUser_Id, setIsAdmin, setIsAuthenticated } = useSession();

  const router = useRouter();

  const Url = process.env.NEXT_PUBLIC_API;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);
    try {
      const response = await fetch(`${Url}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) {
        setIsAuthenticated(false);
        setIsAdmin(false);
        toast({
          title: "Login failed",
          description: result.message,
          variant: "destructive",
        });
      } else {
        setIsAuthenticated(true);
        const userId = result.user_id;
        sessionStorage.setItem("user_id", userId);
        setUser_Id(userId);
        if (result.role == "admin") {
          setIsAdmin(true);
          toast({
            title: "Login successful Sir",
            description: result.message,
            variant: "default",
          });
          router.push("/dashboard/admin");
        } else {
          toast({
            title: "Login successful",
            description: result.message,
            variant: "default",
          });
          router.push("/dashboard/user");
        }
      }
    } catch (err) {
      console.log(err);
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
    <main className="flex min-h-svh flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 md:p-10 relative overflow-hidden">
      {/* Background animated elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-10 -left-10 w-40 h-40 bg-blue-200 rounded-full opacity-20"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/4 -right-10 w-32 h-32 bg-purple-200 rounded-full opacity-20"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -left-5 w-24 h-24 bg-indigo-200 rounded-full opacity-20"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />
      </div>

      <motion.div
        className="w-full max-w-sm md:max-w-4xl relative z-10"
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
            <CardContent className="grid p-0 md:grid-cols-2">
              {/* Left side - Welcome section */}
              <motion.div
                className="relative hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 md:block"
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
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <BookOpen className="w-16 h-16 mx-auto mb-4" />
                    </motion.div>
                    <h1 className="text-4xl font-bold mb-2">Welcome</h1>
                    <h2 className="text-3xl font-semibold mb-2">To</h2>
                    <h3 className="text-4xl font-bold bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                      Big Library
                    </h3>
                  </motion.div>

                  <motion.div
                    className="grid grid-cols-1 gap-4 mt-8 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  >
                    <motion.div
                      className="flex items-center gap-3 text-blue-100"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Users className="w-5 h-5" />
                      <span>Manage Members</span>
                    </motion.div>
                    <motion.div
                      className="flex items-center gap-3 text-blue-100"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <BookOpen className="w-5 h-5" />
                      <span>Track Books</span>
                    </motion.div>
                    <motion.div
                      className="flex items-center gap-3 text-blue-100"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Calendar className="w-5 h-5" />
                      <span>Manage Loans</span>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Right side - Form section */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Form {...form}>
                  <motion.form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="p-6 md:p-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <div className="flex flex-col gap-6">
                      <motion.div
                        className="text-center md:text-left"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                      >
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          Welcome Back!
                        </h3>
                        <p className="text-balance text-muted-foreground">
                          Login to your Big Library account
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
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
                                    className="h-12 border-gray-200 focus:border-blue-500 transition-colors"
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
                                    className="h-12 border-gray-200 focus:border-blue-500 transition-colors pr-12"
                                  />
                                  <motion.button
                                    type="button"
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-2.5"
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
                        transition={{ duration: 0.5, delay: 1.0 }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
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
                                  Loading...
                                </motion.div>
                              ) : (
                                <motion.span
                                  key="login"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                >
                                  Log in
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </Button>
                        </motion.div>
                      </motion.div>

                      <motion.div
                        className="flex gap-2 justify-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.1 }}
                      >
                        <span className="text-balance text-muted-foreground">
                          No account?
                        </span>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Link
                            href="auth/signup"
                            className="text-blue-600 hover:text-blue-700 underline font-medium transition-colors"
                          >
                            Register Now
                          </Link>
                        </motion.div>
                      </motion.div>
                    </div>
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
