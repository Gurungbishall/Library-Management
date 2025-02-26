"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { toast } from "@/components/ui/use-toast";
import { UserType } from "@/types/types.s";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isAdmin: boolean;
  isAuthenticated: boolean;
  user: UserType | null;
  user_Id: string | null;
  book_Id: number | null;
  member_Id: number | null;
  course: string | null;
  route: string;
  logOut: () => Promise<void>;
  fetchUserDetails: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  setUser_Id: React.Dispatch<React.SetStateAction<string | null>>;
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setBook_Id: React.Dispatch<React.SetStateAction<number | null>>;
  setMember_Id: React.Dispatch<React.SetStateAction<number | null>>;
  setCourse: React.Dispatch<React.SetStateAction<string | null>>;
  setRoute: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useSession = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useSession must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [user_Id, setUser_Id] = useState<string | null>("");
  const [book_Id, setBook_Id] = useState<number | null>(null);
  const [member_Id, setMember_Id] = useState<number | null>(null);
  const [course, setCourse] = useState<string | null>("");

  const [route, setRoute] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const Url = process.env.NEXT_PUBLIC_API;
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = sessionStorage.getItem("user_id");
      setUser_Id(storedUserId);
    }
  }, []);

  const fetchUserDetails = useCallback(async () => {
    if (!user_Id) return;

    try {
      const response = await fetch(`${Url}/auth/userDetails/${user_Id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        toast({
          title: "Login failed",
          variant: "destructive",
        });
        setIsAuthenticated(false);
        setUser(null);
      }

      const result = await response.json();
      setUser(result.user);
      setIsAuthenticated(true);
      setCourse(result.user.course);
      setIsAdmin(result.user.role == "admin");
    } catch {
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive",
      });
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [Url, user_Id]);

  const logOut = useCallback(async () => {
    try {
      const response = await fetch(`${Url}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const result = await response.json();
      if (!response.ok) {
        toast({
          title: "An error occurred",
          description: "Please try again later.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Logout Successfully",
          description: result.message,
          variant: "default",
        });
      }
      sessionStorage.clear();
      setUser_Id(null);
      setIsAuthenticated(false);
      setUser(null);
      router.push("/");
    } catch {
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  }, [Url, router]);

  useEffect(() => {
    if (user_Id) {
      fetchUserDetails();
    } else {
      setLoading(false);
    }
  }, [fetchUserDetails, user_Id]);

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        isAuthenticated,
        user,
        user_Id,
        book_Id,
        member_Id,
        course,
        route,
        setIsAdmin,
        setIsAuthenticated,
        setUser,
        setUser_Id,
        fetchUserDetails,
        logOut,
        setBook_Id,
        setMember_Id,
        setCourse,
        setRoute,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
