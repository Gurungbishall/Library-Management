"use client";

import { fetchMemberReturnlist } from "@/api/members/members";
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
import { motion } from "framer-motion";
import { Book, Calendar, Clock, Search, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import bookImg from "../../picture/The_Great_Gatsby_Cover_1925_Retouched.jpg";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import DeleteReturnedBook from "./deletereturnedBook";

export const ManageMemberReturnLists = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [addItem, setAddItem] = useState<string>("default");
  const [selectLoanID, setSelectLoanId] = useState<number>(0);
  const [data, setData] = useState<LoanBookType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const calculateDaysLeft = (dueDate: string) => {
    const currentDate = new Date();
    const due = new Date(dueDate);
    const timeDifference = due.getTime() - currentDate.getTime();
    const daysAgo = Math.abs(Math.ceil(timeDifference / (1000 * 3600 * 24)));
    return daysAgo;
  };

  const { member_Id } = useSession();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const getReturnStatusBadge = (returnDate: string) => {
    const daysAgo = calculateDaysLeft(returnDate);
    if (daysAgo <= 7) {
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          Recently Returned
        </Badge>
      );
    } else if (daysAgo <= 30) {
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          Returned
        </Badge>
      );
    } else {
      return (
        <Badge
          variant="outline"
          className="bg-gray-50 text-gray-700 border-gray-200"
        >
          Old Return
        </Badge>
      );
    }
  };

  const filteredData =
    data?.filter((book) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        book.title?.toLowerCase().includes(searchLower) ||
        book.author?.toLowerCase().includes(searchLower) ||
        book.category?.toLowerCase().includes(searchLower) ||
        book.isbn?.toLowerCase().includes(searchLower)
      );
    }) || [];

  useEffect(() => {
    const searchLoanBooks = async () => {
      try {
        setLoading(true);
        const loanBooks = await fetchMemberReturnlist(member_Id, searchQuery);
        setData(loanBooks || []);
      } catch {
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

  return (
    <div className="w-full h-full flex flex-col gap-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Returns
              </CardTitle>
              <Book className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Books returned by member
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Recent Returns
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data?.filter(
                  (book) => calculateDaysLeft(book.return_date) <= 7
                ).length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                In the last 7 days
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Days
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data?.length > 0
                  ? Math.round(
                      data.reduce(
                        (acc, book) =>
                          acc + calculateDaysLeft(book.return_date),
                        0
                      ) / data.length
                    )
                  : 0}
              </div>
              <p className="text-xs text-muted-foreground">Days since return</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4 items-start sm:items-center"
      >
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search returned books..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-9"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {filteredData.length} of {data?.length || 0} returns
        </div>
      </motion.div>

      {/* Returns Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-lg border bg-card"
      >
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredData.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">#</TableHead>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>ISBN</TableHead>
                  <TableHead>Loan Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Return Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((book, index) => (
                  <TableRow key={book.book_id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="w-12 h-16 relative rounded-md overflow-hidden">
                        <Image
                          src={
                            book?.bookimage
                              ? `${process.env.NEXT_PUBLIC_USER_IMAGE_LOCATION}/image/book/${book?.bookimage}`
                              : bookImg
                          }
                          alt={book.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{book.title}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {book.author}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{book.category}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {book.isbn}
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(book.loan_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(book.due_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(book.return_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {getReturnStatusBadge(book.return_date)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setAddItem("delete");
                          setSelectLoanId(book.loan_id);
                        }}
                        className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No returned books found
              </h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your search query"
                  : "This member hasn't returned any books yet"}
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Delete Dialog */}
      {addItem === "delete" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setAddItem("default")}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md mx-4"
          >
            <DeleteReturnedBook
              loan_id={selectLoanID}
              setDefault={setAddItem}
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
