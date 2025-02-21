"use client";

import { toast } from "@/components/ui/use-toast";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { UserType } from "@/types/types.s";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isAdmin: boolean;
  isAuthenticated: boolean;
  user: UserType | null;
  book_Id: number | null;
  member_Id: number | null;
  route: string;
  logOut: () => Promise<void>;
  fetchUserDetails: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setBook_Id: React.Dispatch<React.SetStateAction<number | null>>;
  setMember_Id: React.Dispatch<React.SetStateAction<number | null>>;
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
  const [book_Id, setBook_Id] = useState<number | null>(null);
  const [member_Id, setMember_Id] = useState<number | null>(null);
  const [route, setRoute] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const Url = process.env.NEXT_PUBLIC_API;
  const router = useRouter();

  const userId = sessionStorage.getItem("user_id");

  const fetchUserDetails = useCallback(async () => {
    try {
      const response = await fetch(`${Url}/auth/userDetails/${userId}`, {
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
  }, [Url, userId]);

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
          title: "Logout Sucessfully",
          description: result.message,
          variant: "default",
        });

        sessionStorage.clear();
        router.push("/");
      }
    } catch {
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  }, [Url, router]);

  useEffect(() => {
    if (userId) {
      fetchUserDetails();
    } else {
      setLoading(false);
    }
  }, [fetchUserDetails, userId]);

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        isAuthenticated,
        user,
        book_Id,
        member_Id,
        route,
        setIsAdmin,
        setIsAuthenticated,
        setUser,
        fetchUserDetails,
        logOut,
        setBook_Id,
        setMember_Id,
        setRoute,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
