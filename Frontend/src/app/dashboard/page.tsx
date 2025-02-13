"use client";

import { useEffect, useState } from "react";
import { BookType, ArticleType } from "@/types/types.s";
import HeaderBar from "@/components/headerBar";
import { BooksOnCategory } from "@/components/dashboard/booksOnCategory";
import { ArticlesOnCategory } from "@/components/article/articlesOnCategory";
import { fetchBooks } from "@/api/book/book";
import { fetchArticles } from "@/api/article/article";
const Page = () => {
  const [books, setBooks] = useState<BookType[]>([]);
  const [articles, setArticles] = useState<ArticleType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchBooks("");
      setBooks(data);
      const articleData = await fetchArticles("");
      setArticles(articleData);
    };
    fetchData();
  }, []);
  return (
    <>
      <HeaderBar />
      <main className="p-4 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-xl font-bold">Books</span>
          <BooksOnCategory data={books} />
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
