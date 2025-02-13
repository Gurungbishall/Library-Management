"use client";
import { useEffect, useState } from "react";

import { BookType } from "@/types/types.s";
import { ManageBooks } from "@/components/book/managebooks";
import { fetchBooks } from "@/api/book/book";

const Page = () => {
  const [books, setBooks] = useState<BookType[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchBooks("");
      setBooks(data);
    };
    fetchData();
  }, [books]);
  return (
    <>
      <main className="p-4 flex flex-col gap-4">
        <ManageBooks data={books} />
      </main>
    </>
  );
};

export default Page;
