"use client";

import { useEffect, useState } from "react";
import { BookType } from "@/types/types.s";
import { BookDetail } from "@/components/bookdetail/bookdetail";
import HeaderBar from "@/components/headerBar";
import { BooksOnCategory } from "@/components/dashboard/booksOnCategory";
import { getBookDetail } from "@/api/book/book";
import { fetchBooks } from "@/api/book/book";
import { useSession } from "../context/authContext";

const Page = () => {
  const { book_Id } = useSession();
  const [book, setBook] = useState<BookType | null>(null);
  const [books, setBooks] = useState<BookType[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (book_Id != null) {
        const data = await getBookDetail(book_Id);
        if (isMounted) {
          setBook(data);
        }

        const categoryData = await fetchBooks(data.category);
        setBooks(categoryData);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [book_Id]);

  return (
    <>
      <HeaderBar />
      {book ? (
        <>
          <main className="p-4">
            <div className="flex flex-col gap-8">
              <BookDetail data={book} />
              <span className="text-xl font-bold">You may like Them</span>
              <BooksOnCategory data={books} />
            </div>
          </main>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default Page;
