"use client";

import { fetchMemberLoanlist } from "@/api/members/members";
import { useSession } from "@/app/context/authContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoanBookType } from "@/types/types.s";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  Clock,
  RotateCcw,
  Search,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import bookImg from "../../picture/The_Great_Gatsby_Cover_1925_Retouched.jpg";
import ReturnLoanBook from "../loans/returnLoanBook";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";

export const ManageIndividualLoanBooks = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [addItem, setAddItem] = useState<string>("default");
  const [selectLoanID, setSelectLoanId] = useState<number>(0);
  const [data, setData] = useState<LoanBookType[]>([]);
  const [loading, setLoading] = useState(true);

  const calculateDaysLeft = (dueDate: string) => {
    const currentDate = new Date();
    const due = new Date(dueDate);
    const timeDifference = due.getTime() - currentDate.getTime();
    const daysLeft = Math.ceil(timeDifference / (1000 * 3600 * 24));
    return daysLeft;
  };

  const getDaysLeftBadge = (dueDate: string) => {
    const daysLeft = calculateDaysLeft(dueDate);

    if (daysLeft < 0) {
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Overdue
        </Badge>
      );
    } else if (daysLeft <= 3) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
          <Clock className="w-3 h-3 mr-1" />
          {daysLeft} day{daysLeft !== 1 ? "s" : ""} left
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          <Calendar className="w-3 h-3 mr-1" />
          {daysLeft} days left
        </Badge>
      );
    }
  };

  const { member_Id } = useSession();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const searchLoanBooks = async () => {
      setLoading(true);
      try {
        const loanBooks = await fetchMemberLoanlist(member_Id, searchQuery);
        setData(loanBooks || []);
      } catch (error) {
        console.error("Error fetching loan books:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      searchLoanBooks();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, member_Id]);

  const totalLoans = data.length;
  const overdueLoans = data.filter(
    (book) => calculateDaysLeft(book.due_date) < 0
  ).length;
  const dueSoonLoans = data.filter((book) => {
    const daysLeft = calculateDaysLeft(book.due_date);
    return daysLeft >= 0 && daysLeft <= 3;
  }).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    Total Loans
                  </p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {totalLoans}
                  </p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                    Due Soon
                  </p>
                  <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                    {dueSoonLoans}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">
                    Overdue
                  </p>
                  <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                    {overdueLoans}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
          <CardContent className="p-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search loan books by title, author, or ISBN..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-12 text-center">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">
                  Loading loans...
                </p>
              </div>
            ) : data.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-b border-gray-200 dark:border-gray-700">
                      <TableHead className="font-semibold text-gray-900 dark:text-white">
                        #
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white">
                        Cover
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white">
                        Title
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white">
                        Author
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white">
                        Category
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white">
                        Loan Date
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white">
                        Due Date
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white">
                        Status
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((book, index) => (
                      <TableRow
                        key={book.loan_id}
                        className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="w-12 h-16 rounded-lg overflow-hidden shadow-md">
                            <Image
                              src={
                                book?.bookimage
                                  ? `${process.env.NEXT_PUBLIC_USER_IMAGE_LOCATION}/image/book/${book?.bookimage}`
                                  : bookImg
                              }
                              alt={book.title}
                              width={48}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-gray-900 dark:text-white max-w-xs">
                            {book.title}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-600 dark:text-gray-400">
                            {book.author}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{book.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-900 dark:text-white">
                            {new Date(book.loan_date).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-900 dark:text-white">
                            {new Date(book.due_date).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell>{getDaysLeftBadge(book.due_date)}</TableCell>
                        <TableCell>
                          <Button
                            onClick={() => {
                              setAddItem("return");
                              setSelectLoanId(book.loan_id);
                            }}
                            variant="outline"
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                          >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Return
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No loans found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchQuery
                    ? "Try adjusting your search terms"
                    : "This member has no active loans"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence>
        {addItem === "return" && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
            >
              <ReturnLoanBook loan_id={selectLoanID} setDefault={setAddItem} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
