import { toast } from "@/components/hooks/use-toast";
import { LoanBookType } from "@/types/types.s";

const Url = process.env.NEXT_PUBLIC_API;

export const fetchLoansBooks = async (user_id : number | null): Promise<LoanBookType[]> => {
  try {
    const response = await fetch(`${Url}/loan/user/${user_id}`, {
      method: "GET",
      credentials: "include",
    });

    const result = await response.json();
    return result.data;
  } catch {
    toast({
      title: "An error occurred",
      description: "Please try again later.",
      variant: "destructive",
    });

    return [];
  }
};
