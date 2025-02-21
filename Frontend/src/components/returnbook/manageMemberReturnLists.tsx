"use client";

import { useState, useEffect } from "react";
import { LoanBookType } from "@/types/types.s";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import Image from "next/image";
import bookImg from "../../picture/The_Great_Gatsby_Cover_1925_Retouched.jpg";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "../ui/input";
import DeleteReturnedBook from "./deletereturnedBook";
import { useSession } from "@/app/context/authContext";
import { fetchMemberReturnlist } from "@/api/members/members";

export const ManageMemberReturnLists = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [addItem, setAddItem] = useState<string>("default");
  const [selectLoanID, setSelectLoanId] = useState<number>(0);
  const [data, setData] = useState<LoanBookType[]>([]);

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

  useEffect(() => {
    const searchLoanBooks = async () => {
      try {
        const loanBooks = await fetchMemberReturnlist(member_Id, searchQuery);

        setData(loanBooks);
      } catch {
        setData([]);
      } finally {
      }
    };

    const timeoutId = setTimeout(() => {
      searchLoanBooks();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, data, member_Id]);

  return (
    <>
      <div className="w-full h-full flex flex-col gap-4">
        <div className="flex w-full justify-between">
          <div className="w-1/2 md:w-1/3 flex flex-col gap-2">
            <Input
              placeholder="Search Return Book"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div className="w-full flex flex-col gap-4 overflow-x-auto">
          {data !== undefined && data.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>ISBN</TableHead>
                  <TableHead>Loan Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Return Date</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((book, index) => (
                  <TableRow key={book.book_id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Image
                        src={
                          book?.bookimage
                            ? `${process.env.NEXT_PUBLIC_USER_IMAGE_LOCATION}/image/book/${book?.bookimage}`
                            : bookImg
                        }
                        alt={book.title}
                        width={100}
                        height={100}
                      />
                    </TableCell>
                    <TableCell>{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.category}</TableCell>
                    <TableCell>{book.isbn}</TableCell>
                    <TableCell>
                      {new Date(book.loan_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(book.due_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(book.return_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {calculateDaysLeft(book.return_date)} days ago
                    </TableCell>

                    <TableCell>
                      <Button
                        onClick={() => {
                          setAddItem("delete");
                          setSelectLoanId(book.loan_id);
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <span className="text-center text-gray-500">No loans </span>
          )}
        </div>
      </div>
      {addItem === "delete" && (
        <div className="absolute w-screen h-screen inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <X
            className="top-20 left-5 p-1 md:size-8 absolute bg-white rounded-lg"
            onClick={() => {
              setAddItem("default");
            }}
          />
          <DeleteReturnedBook loan_id={selectLoanID} setDefault={setAddItem} />
        </div>
      )}
    </>
  );
};
