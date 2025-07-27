"use client";

import { BooksOnCategory } from "@/components/dashboard/booksOnCategory";
import HeaderBar from "@/components/headerBar";
import { BookType } from "@/types/types.s";
import { useEffect, useState } from "react";
import { fetchBooks } from "@/api/book/book";
import { fetchLoansBooks } from "@/api/loan/loan";
import { useSession } from "@/app/context/authContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, BookOpen, Clock, GraduationCap } from "lucide-react";
const Page = () => {
  const [books, setBooks] = useState<BookType[]>([]);
  const [selectBooks, setSelectBooks] = useState<BookType[]>([]);
  const [loanBooks, setLoanBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInClient, setIsInClient] = useState(false);
  const { course, user_Id } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchBooks("");
        setBooks(data);
        if (course !== null) {
          const selectData = await fetchBooks(course);
          setSelectBooks(selectData);
        }
        if (user_Id) {
          const userIdNumber = Number(user_Id);
          if (!isNaN(userIdNumber)) {
            const loanData = await fetchLoansBooks(userIdNumber);
            setLoanBooks(loanData);
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [course, user_Id]);

  const totalBooks = books?.length || 0;
  const courseBooks = selectBooks?.length || 0;
  const totalLoans = loanBooks?.length || 0;
  const overdueBooks =
    loanBooks?.filter((book) => {
      const dueDate = new Date(book.due_date);
      const today = new Date();
      return dueDate < today;
    }).length || 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const statsData = [
    {
      title: "Total Books",
      value: totalBooks,
      icon: BookOpen,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Course Books",
      value: courseBooks,
      icon: GraduationCap,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "Borrowed Books",
      value: totalLoans,
      icon: Clock,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Overdue Books",
      value: overdueBooks,
      icon: AlertTriangle,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      iconColor: "text-orange-600 dark:text-orange-400",
    },
  ];

  useEffect(() => {
    setIsInClient(true);
  }, []);

  if (!isInClient) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <HeaderBar />

      <motion.main
        className="p-4 md:p-6 lg:p-8 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="text-center md:text-left"
          variants={itemVariants}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to Your Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Explore your personalized library experience
          </p>
        </motion.div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
        >
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.title}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                transition: { type: "spring", stiffness: 300 },
              }}
            >
              <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800 dark:border dark:border-slate-700">
                <div
                  className={`absolute top-0 right-0 w-20 h-20 ${stat.bgColor} rounded-full -translate-y-10 translate-x-10 opacity-50`}
                />
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                        {stat.title}
                      </p>
                      <motion.div
                        className="text-3xl font-bold text-gray-900 dark:text-white"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: 0.2 + index * 0.1,
                          type: "spring",
                        }}
                      >
                        {loading ? (
                          <div className="w-12 h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
                        ) : (
                          stat.value
                        )}
                      </motion.div>
                    </div>
                    <motion.div
                      className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="space-y-8">
          <motion.div className="space-y-6" variants={itemVariants}>
            <Card className="border-0 shadow-lg bg-white dark:bg-slate-800 dark:border dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-white">
                  <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  All Books
                  <span className="ml-auto text-sm font-normal text-gray-500 dark:text-gray-400">
                    {totalBooks} books available
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AnimatePresence>
                  {loading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"
                    >
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="h-40 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"
                        />
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <BooksOnCategory data={books || []} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {course && (
            <motion.div className="space-y-6" variants={itemVariants}>
              <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 dark:bg-slate-800 dark:border dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-white">
                    <GraduationCap className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="capitalize">{course} Books</span>
                    <span className="ml-auto text-sm font-normal text-gray-500 dark:text-gray-400">
                      {courseBooks} books in your course
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AnimatePresence>
                    {loading ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"
                      >
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={i}
                            className="h-40 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"
                          />
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <BooksOnCategory data={selectBooks || []} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
   
      </motion.main>
    </div>
  );
};

export default Page;
