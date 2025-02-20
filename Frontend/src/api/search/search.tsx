import { toast } from "@/components/hooks/use-toast";
import { BookType, SearchedBookType } from "@/types/types.s";

const Url = process.env.NEXT_PUBLIC_API;

export const fetchSearchBooks = async ({
  searchBook,
}: {
  searchBook: string;
}): Promise<SearchedBookType[]> => {
  try {
    const response = await fetch(
      `${Url}/search/searchBook/?search_Book=${encodeURIComponent(searchBook)}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const result = await response.json();

    if (!response.ok || !result.data) {
      toast({
        title: "No results found",
        description: "No books matched your search criteria.",
        variant: "destructive",
      });
      return [];
    }

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

export const fetchManageBooks = async ({
  searchBook,
}: {
  searchBook: string;
}): Promise<BookType[]> => {
  console.log(searchBook);
  try {
    const response = await fetch(
      `${Url}/search/manageBooks/?search_Book=${encodeURIComponent(
        searchBook
      )}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const result = await response.json();

    if (!response.ok || !result.data) {
      toast({
        title: "No results found",
        description: "No books matched your search criteria.",
        variant: "destructive",
      });
      return [];
    }

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
