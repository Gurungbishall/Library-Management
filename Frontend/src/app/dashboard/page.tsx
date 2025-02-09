"use client";

import { useEffect, useState } from "react";
import { BookType } from "@/types/types.s";
import HeaderBar from "@/components/headerBar";
import { BooksOnCategory } from "@/components/dashboard/booksOnCategory";
import { fetchBooks } from "@/api/book/book";

const Page = () => {
  const [books, setBooks] = useState<BookType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchBooks("");
      setBooks(data);
    };
    fetchData();
  }, []);
  return (
    <>
      <HeaderBar />
      <main className="p-4">
        <div className="flex flex-col gap-2">
          <span className="text-xl font-bold">Books</span>
          <BooksOnCategory data={books} />
        </div>
      </main>
    </>
  );
};

export default Page;
