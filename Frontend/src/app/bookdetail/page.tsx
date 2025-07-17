"use client";

import { fetchBooks, getBookDetail } from "@/api/book/book";
import { getBookReviewLists } from "@/api/review/review";
import { BookDetail } from "@/components/book/bookdetail";
import { BookReviewLists } from "@/components/book/bookReviewList";
import { BooksOnCategory } from "@/components/dashboard/booksOnCategory";
import HeaderBar from "@/components/headerBar";
import { Button } from "@/components/ui/button";
import { BookType, ReviewLists } from "@/types/types.s";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "../context/authContext";
const Page = () => {
  const { book_Id } = useSession();
  const [book, setBook] = useState<BookType | null>(null);
  const [books, setBooks] = useState<BookType[]>([]);
  const [reviewList, setReviewList] = useState<ReviewLists[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      if (book_Id != null) {
        try {
          const data = await getBookDetail(book_Id);
          if (isMounted) {
            setBook(data);
          }

          const categoryData = await fetchBooks(data.category);
          setBooks(categoryData);

          const bookReviewData = await getBookReviewLists(book_Id, "book");
          setReviewList(bookReviewData);
        } catch (error) {
          console.error("Error fetching book details:", error);
        }
      }
      setLoading(false);
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [book_Id]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <HeaderBar />

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center min-h-[60vh]"
          >
            <div className="text-center">
              <motion.div
                className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Loading book details...
              </p>
            </div>
          </motion.div>
        ) : book ? (
          <motion.main
            key="content"
            className="p-4 md:p-6 lg:p-8 space-y-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Back Navigation */}
            <motion.div variants={itemVariants}>
              <Button
                variant="ghost"
                onClick={() => window.history.back()}
                className="mb-6 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Library
              </Button>
            </motion.div>

            {/* Book Detail */}
            <motion.div variants={itemVariants}>
              <BookDetail data={book} reviewCount={reviewList?.length || 0} />
            </motion.div>

            {/* Similar Books Section */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="text-center">
                <motion.h2
                  className="text-3xl font-bold text-gray-900 dark:text-white mb-3"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  You May Also Like
                </motion.h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  More books from the{" "}
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {book.category}
                  </span>{" "}
                  category
                </p>
              </div>
              <BooksOnCategory data={books} />
            </motion.div>

            {/* Reviews Section */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="text-center">
                <motion.h2
                  className="text-3xl font-bold text-gray-900 dark:text-white mb-3 flex items-center justify-center gap-3"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  Reader Reviews
                </motion.h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  See what other readers think about this book
                </p>
              </div>
              <BookReviewLists data={reviewList} />
            </motion.div>
          </motion.main>
        ) : (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center min-h-[60vh]"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">📚</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Book Not Found
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                The book you&apos;re looking for doesn&apos;t exist or has been
                removed.
              </p>
              <Button
                onClick={() => window.history.back()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Page;
