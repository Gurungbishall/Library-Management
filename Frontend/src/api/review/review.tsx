import { toast } from "@/components/hooks/use-toast";
import { ReviewLists } from "@/types/types.s";

const Url = process.env.NEXT_PUBLIC_API;

export const getBookReviewLists = async (contend_id : number | null, content_type: string): Promise<ReviewLists[]> => {
  try {
    const response = await fetch(`${Url}/review/accessReviews?content_type=${content_type}&content_id=${contend_id}`, {
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
