import { toast } from "@/components/hooks/use-toast";
import { BookType } from "@/types/types.s";

const Url = process.env.NEXT_PUBLIC_API;
export const fetchBooks = async (
  category: string | null
): Promise<BookType[]> => {
  try {
    if (category === null) {
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
    const response = await fetch(`${Url}/book/category/${category}`, {
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

export const getBookDetail = async (
  book_Id: number | null
): Promise<BookType> => {
  try {
    if (book_Id === null || book_Id === 0) {
      throw new Error("Invalid book ID");
    }

    const response = await fetch(`${Url}/book/getBookDetails/${book_Id}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch book details");
    }

    const result = await response.json();
    return result.data;
  } catch {
    toast({
      title: "An error occurred",
      description: "Please try again later.",
      variant: "destructive",
    });
    return {
      book_id: 0,
      title: "Error",
      author: "Error",
      category: "Error",
      isbn: "Error",
      publication_year: 0,
      quantity: 0,
      available: 0,
      average_rating: 0,
      bookimage: "",
      description: "",
    };
  }
};

export const deleteBook = async (book_Id: number | null) => {
  try {
    if (book_Id === null || book_Id === 0) {
      throw new Error("Invalid book ID");
    }

    const response = await fetch(`${Url}/book/deleteBook`, {
      method: "POST",
      body: JSON.stringify({ book_id: book_Id }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive",
      });
    } else {
      const result = await response.json();
      toast({
        title: "Book deleted successfully",
        description: result.message,
        variant: "default",
      });
    }
  } catch {
    toast({
      title: "An error occurred",
      description: "Please try again later.",
      variant: "destructive",
    });
    return [];
  }
};
