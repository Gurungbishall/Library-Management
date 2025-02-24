import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { SearchedBookType } from "@/types/types.s";
import { fetchSearchBooks } from "@/api/search/search";
import Image from "next/image";
import { Card, CardTitle } from "../ui/card";
import bookImg from "../../picture/The_Great_Gatsby_Cover_1925_Retouched.jpg";
import { renderStars } from "../renderStars/renderStars";
import { useSession } from "@/app/context/authContext";
import { useRouter } from "next/navigation";

export const HeaderSearch = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchedBooks, setSearchBooks] = useState<SearchedBookType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setBook_Id } = useSession();
  const router = useRouter();

  useEffect(() => {
    const searchBooks = async () => {
      if (searchQuery.trim() === "") {
        setSearchBooks([]);
        return;
      }

      setIsLoading(true);

      try {
        const books = await fetchSearchBooks({ searchBook: searchQuery });
        setSearchBooks(books);
      } catch (error) {
        console.error("Error fetching books:", error);
        setSearchBooks([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      searchBooks();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <div className="relative w-full md:w-1/2">
        <Input
          placeholder="Search for books..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        {isLoading && <p>Loading...</p>}

        {searchedBooks.length > 0 && (
          <div className="absolute bg-white shadow-lg mt-2 w-full h-80 rounded-md overflow-y-scroll z-10">
            <ul>
              {searchedBooks.map((book) => (
                <Card
                  key={book.book_id}
                  className="flex gap-3"
                  onClick={() => {
                    setBook_Id(book.book_id);
                    router.push("/bookdetail");
                  }}
                >
                  <Image
                    src={
                      book?.bookimage
                        ? `${process.env.NEXT_PUBLIC_USER_IMAGE_LOCATION}/image/book/${book?.bookimage}`
                        : bookImg
                    }
                    height={80}
                    width={80}
                    alt={book.title}
                  />
                  <div className="p-2 flex flex-col gap-1">
                    <CardTitle className="text-base font-semibold">
                      {book.title}
                    </CardTitle>
                    <span>by {book.author}</span>
                    <span>{renderStars(book.average_rating)}</span>
                  </div>
                </Card>
              ))}
            </ul>
          </div>
        )}

        {searchedBooks.length === 0 && searchQuery && !isLoading && (
          <div className="absolute bg-white shadow-lg mt-2 w-full rounded-md">
            <p className="p-2 text-center text-gray-600">No books found.</p>
          </div>
        )}
      </div>
    </>
  );
};
