import { useState } from "react";
import { LoanBookType, UserType } from "@/types/types.s";
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
import ReturnLoanBook from "../loans/returnLoanBook";

export const GetIndividualDetail = ({
  userData,
  loanBooks,
}: {
  userData: UserType;
  loanBooks: LoanBookType[];
}) => {
  const [addItem, setAddItem] = useState<string>("default");
  const [selectLoanID, setSelectLoanId] = useState<number>(0);

  const calculateDaysLeft = (dueDate: string) => {
    const currentDate = new Date();
    const due = new Date(dueDate);
    const timeDifference = due.getTime() - currentDate.getTime();
    const daysLeft = Math.ceil(timeDifference / (1000 * 3600 * 24));
    return daysLeft;
  };
  return (
    <>
      <div
        key={userData.user_id}
        className="w-full flex flex-col md:flex-row items-center md:items-center md:justify-center gap-4 md:gap-24"
      >
        <Image
          src={
            userData?.userimage
              ? `${process.env.NEXT_PUBLIC_USER_IMAGE_LOCATION}/image/user/${userData?.userimage}`
              : bookImg
          }
          height={100}
          width={100}
          alt={userData.name}
          className="w-1/2 md:w-1/4 md:flex-shrink-0 rounded-2xl shadow-xl"
        />
        <div className="md:w-1/2 flex flex-col gap-1 md:gap-2 text-base md:text-xl font-semibold ">
          <span className="text-xl md:text-3xl font-bold ">
            Name : {userData.name}
          </span>
          <span>Email: {userData.email}</span>
          <span>Course: {userData.course}</span>
          <span>Age: {userData.age}</span>
          <span>Gender: {userData.sex}</span>
          <span>Number: {userData.phone_number}</span>
          <span>Role: {userData.role}</span>
        </div>
      </div>
      <div className="text-xl font-bold md:text-2xl">User Loan Books List</div>
      <div className="w-full flex flex-col gap-4 overflow-x-auto">
        {loanBooks !== undefined && loanBooks.length > 0 ? (
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
                <TableHead>Due_Date</TableHead>
                <TableHead>Days Left</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loanBooks.map((book, index) => (
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
                    {calculateDaysLeft(book.due_date) > 0
                      ? `${calculateDaysLeft(book.due_date)} days left`
                      : "Overdue"}
                  </TableCell>
                  <TableCell>
                    {new Date(book.due_date).toLocaleDateString()}
                  </TableCell>

                  <TableCell>
                    <Button
                      onClick={() => {
                        setAddItem("delete");
                        setSelectLoanId(book.loan_id);
                      }}
                    >
                      Return
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
      {addItem === "delete" && (
        <div className="absolute w-screen h-screen inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <X
            className="top-20 left-5 p-1 md:size-8 absolute bg-white rounded-lg"
            onClick={() => {
              setAddItem("default");
            }}
          />
          <ReturnLoanBook loan_id={selectLoanID} setDefault={setAddItem} />
        </div>
      )}
    </>
  );
};
