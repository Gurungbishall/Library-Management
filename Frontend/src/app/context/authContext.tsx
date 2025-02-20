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

interface AuthContextType {
  isAdmin: boolean;
  isAuthenticated: boolean;
  user: UserType | null;
  book_Id: number | null;
  member_Id: number | null;
  logOut: () => Promise<void>;
  fetchUserDetails: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setBook_Id: React.Dispatch<React.SetStateAction<number | null>>;
  setMember_Id: React.Dispatch<React.SetStateAction<number | null>>;
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
  const [loading, setLoading] = useState<boolean>(true);
  const Url = process.env.NEXT_PUBLIC_API;

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
    } catch (error) {
      console.error(error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [Url, userId]);

  const logOut = useCallback(async () => {
    sessionStorage.clear();
    try {
      const response = await fetch(`${Url}/auth/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const result = await response.json();
      if (!response.ok) {
        toast({
          title: "Error not found",
          description: result.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Logout Successfully",
          description: result.message,
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  }, [Url]);

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
        setIsAdmin,
        setIsAuthenticated,
        setUser,
        fetchUserDetails,
        logOut,
        setBook_Id,
        setMember_Id,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
