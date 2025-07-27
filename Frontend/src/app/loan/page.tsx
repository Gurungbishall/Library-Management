"use client";

import { fetchLoansBooks } from "@/api/loan/loan";
import HeaderBar from "@/components/headerBar";
import { toast } from "@/components/hooks/use-toast";
import { LoanBooks } from "@/components/loans/loanBooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoanBookType } from "@/types/types.s";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  Clock,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "../context/authContext";

const Page = () => {
  const [loanBooks, setLoanBooks] = useState<LoanBookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"title" | "dueDate" | "loanDate">(
    "dueDate"
  );
  const [filterBy, setFilterBy] = useState<"all" | "overdue" | "dueSoon">(
    "all"
  );
  const { user_Id } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (user_Id) {
        const userIdNumber = Number(user_Id);

        if (!isNaN(userIdNumber)) {
          try {
            const data = await fetchLoansBooks(userIdNumber);
            setLoanBooks(data);
          } catch {
            toast({
              title: "Error Loading Books",
              description:
                "Failed to load your borrowed books. Please try again.",
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Invalid User ID",
            description: "Please log in again.",
            variant: "destructive",
          });
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [user_Id]);

  const totalLoans = loanBooks?.length || 0;
  const overdueBooks =
    loanBooks?.filter((book) => {
      const dueDate = new Date(book.due_date);
      const today = new Date();
      return dueDate < today;
    }).length || 0;

  const dueSoon =
    loanBooks?.filter((book) => {
      const dueDate = new Date(book.due_date);
      const today = new Date();
      const threeDaysFromNow = new Date(
        today.getTime() + 3 * 24 * 60 * 60 * 1000
      );
      return dueDate >= today && dueDate <= threeDaysFromNow;
    }).length || 0;

  const filteredBooks = (loanBooks || [])
    .filter((book) => {
      const matchesSearch = book.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (filterBy === "all") return true;

      const dueDate = new Date(book.due_date);
      const today = new Date();
      const threeDaysFromNow = new Date(
        today.getTime() + 3 * 24 * 60 * 60 * 1000
      );

      if (filterBy === "overdue") return dueDate < today;
      if (filterBy === "dueSoon")
        return dueDate >= today && dueDate <= threeDaysFromNow;

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "dueDate")
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      if (sortBy === "loanDate")
        return (
          new Date(b.loan_date).getTime() - new Date(a.loan_date).getTime()
        );
      return 0;
    });

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
      title: "Total Borrowed",
      value: totalLoans,
      icon: BookOpen,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-600 dark:text-blue-400",
      filter: "all" as const,
    },
    {
      title: "Due Soon",
      value: dueSoon,
      icon: Clock,
      color: "from-orange-500 to-yellow-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      iconColor: "text-orange-600 dark:text-orange-400",
      filter: "dueSoon" as const,
    },
    {
      title: "Overdue",
      value: overdueBooks,
      icon: AlertTriangle,
      color: "from-red-500 to-pink-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      iconColor: "text-red-600 dark:text-red-400",
      filter: "overdue" as const,
    },
  ];

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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            My Borrowed Books
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Track your reading progress and manage due dates
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
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
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterBy(stat.filter)}
              className="cursor-pointer"
            >
              <Card
                className={`
                relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 
                bg-white dark:bg-slate-800 dark:border dark:border-slate-700
                ${
                  filterBy === stat.filter
                    ? "ring-2 ring-blue-500 ring-opacity-50"
                    : ""
                }
              `}
              >
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
                  {filterBy === stat.filter && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-2 text-xs text-blue-600 dark:text-blue-400 font-medium"
                    >
                      Currently filtered
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-wrap gap-3 justify-center sm:justify-start"
        >
          <Button
            onClick={() => (window.location.href = "/dashboard/user")}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Browse Books
          </Button>

          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>

          {overdueBooks > 0 && (
            <Button
              onClick={() => setFilterBy("overdue")}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20 transition-all duration-300"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              View Overdue ({overdueBooks})
            </Button>
          )}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 items-center justify-between"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search your books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 
                         bg-white dark:bg-slate-800 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-200"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={filterBy}
              onChange={(e) =>
                setFilterBy(e.target.value as "all" | "overdue" | "dueSoon")
              }
              className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 
                         bg-white dark:bg-slate-800 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-200"
            >
              <option value="all">All Books</option>
              <option value="overdue">Overdue</option>
              <option value="dueSoon">Due Soon</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "title" | "dueDate" | "loanDate")
              }
              className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 
                         bg-white dark:bg-slate-800 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-200"
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="title">Sort by Title</option>
              <option value="loanDate">Sort by Loan Date</option>
            </select>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg bg-white dark:bg-slate-800 dark:border dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-white">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Your Borrowed Books
                <span className="ml-auto text-sm font-normal text-gray-500 dark:text-gray-400">
                  {(filteredBooks || []).length} of {totalLoans}{" "}
                  {totalLoans === 1 ? "book" : "books"}
                  {searchTerm && ` matching "${searchTerm}"`}
                  {filterBy !== "all" && ` (${filterBy})`}
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
                        className="h-80 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"
                      />
                    ))}
                  </motion.div>
                ) : (filteredBooks || []).length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <LoanBooks data={filteredBooks || []} />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="text-6xl mb-4">📚</div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {searchTerm ? "No books found" : "No borrowed books"}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {searchTerm
                        ? `No books match "${searchTerm}". Try a different search term.`
                        : "You haven't borrowed any books yet. Start exploring our collection!"}
                    </p>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Clear Search
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </motion.main>
    </div>
  );
};

export default Page;
