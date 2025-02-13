import { toast } from "@/components/hooks/use-toast";
import { ArticleType } from "@/types/types.s";

const Url = process.env.NEXT_PUBLIC_API;
export const fetchArticles = async (
  category: string | null
): Promise<ArticleType[]> => {
  try {
    if (category === null) {
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
    const response = await fetch(`${Url}/article/category/${category}`, {
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
