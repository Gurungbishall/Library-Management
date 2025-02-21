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
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { useSession } from "@/app/context/authContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const { setIsAdmin, setIsAuthenticated } = useSession();

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
    <main className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className="flex flex-col gap-6 shadow-lg">
          <Card className="overflow-hidden">
            <CardContent className="grid p-0 md:grid-cols-2">
              <div className="relative hidden  bg-muted md:block">
                <div className="h-full w-full flex flex-col gap-3 items-center justify-center text-4xl font-bold">
                  <span>Welcome</span>
                  <span>To</span>
                  <span>Big Library</span>
                </div>
              </div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="p-6 md:p-8"
                >
                  <div className="flex flex-col gap-6">
                    <p className="text-balance text-muted-foreground">
                      Login to your Big Library account
                    </p>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="aa@email.com" {...field} />
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
                    <Button type="submit" disabled={loading}>
                      {loading ? "Loading" : "Log in"}
                    </Button>
                    <div className="flex gap-2 justify-center ">
                      <span className="text-balance text-muted-foreground">
                        No account?
                      </span>
                      <Link href="auth/signup" className="underline">
                        Register Now
                      </Link>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
