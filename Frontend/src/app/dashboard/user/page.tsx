"use client";

import { useEffect, useState } from "react";
import { BookType, ArticleType } from "@/types/types.s";
import HeaderBar from "@/components/headerBar";
import { BooksOnCategory } from "@/components/dashboard/booksOnCategory";
import { ArticlesOnCategory } from "@/components/article/articlesOnCategory";
import { fetchBooks } from "@/api/book/book";
import { fetchArticles } from "@/api/article/article";
import { useSession } from "@/app/context/authContext";
const Page = () => {
  const [books, setBooks] = useState<BookType[]>([]);
  const [selectBooks, setSelectBooks] = useState<BookType[]>([]);
  const [articles, setArticles] = useState<ArticleType[]>([]);
  const { course } = useSession();

  useEffect(() => {
    console.log(course);
    const fetchData = async () => {
      const data = await fetchBooks("");
      setBooks(data);
      if (course !== null) {
        const selectData = await fetchBooks(course);
        setSelectBooks(selectData);
      }
      const articleData = await fetchArticles("");
      setArticles(articleData);
    };
    fetchData();
  }, [course]);
  return (
    <>
      <HeaderBar />
      <main className="p-4 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-xl font-bold">Books</span>
          <BooksOnCategory data={books} />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xl font-bold capitalize">{course}</span>
          <BooksOnCategory data={selectBooks} />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xl font-bold">Articles</span>
          <ArticlesOnCategory data={articles} />
        </div>
      </main>
    </>
  );
};

export default Page;
