"use client";

import { useState, useEffect } from "react";
import { BookType } from "@/types/types.s";
import Image from "next/image";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { X } from "lucide-react";
import { Input } from "../ui/input";
import AddBook from "@/components/book/addBook";
import EditBook from "./editBook";
import bookImg from "../../picture/The_Great_Gatsby_Cover_1925_Retouched.jpg";
import { renderStars } from "../renderStars/renderStars";
import DeleteBook from "./deleteBook";
import { fetchManageBooks } from "@/api/search/search";

export const ManageBooks = () => {
  const [addItem, setAddItem] = useState<string>("default");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectBookID, setSelectBookId] = useState<number>(0);
  const [selectBook, setSelectBook] = useState<BookType>();
  const [data, setData] = useState<BookType[]>([]);

  useEffect(() => {
    const searchBooks = async () => {
      try {
        const books = await fetchManageBooks({ searchBook: searchQuery });
        setData(books);
      } catch (error) {
        console.error("Error fetching books:", error);
        setData([]);
      } finally {
      }
    };

    const timeoutId = setTimeout(() => {
      searchBooks();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, data]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <div className="w-full h-full flex flex-col gap-4">
        <div className="flex w-full justify-between">
          <div className="w-1/2 md:w-1/3 flex flex-col gap-2">
            <span>Manage Books</span>
            <Input
              placeholder="Search books"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <Button
            className="px-2 py-1 text-xs md:p-3 md:text-base"
            onClick={() => {
              setAddItem("add");
            }}
          >
            Add Book
          </Button>
        </div>
        <div className="w-full h-full flex gap-4 overflow-x-auto">
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
                  <TableHead>Publication Year</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Description</TableHead>
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
                    <TableCell>{book.publication_year}</TableCell>
                    <TableCell>{book.quantity}</TableCell>
                    <TableCell>{book.available}</TableCell>
                    <TableCell>{renderStars(book.average_rating)}</TableCell>
                    <TableCell className="text-start md:w-40 text-wrap">
                      {book.description}
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        onClick={() => {
                          setSelectBookId(book.book_id);
                          setSelectBook(book);
                          setAddItem("edit");
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => {
                          setAddItem("delete");
                          setSelectBookId(book.book_id);
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
            <span className="text-center text-gray-500">
              No books available
            </span>
          )}
        </div>
      </div>
      {addItem === "add" && (
        <div className="fixed w-screen h-screen inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <X
            className="top-20 left-5 p-1 md:size-8 absolute bg-white rounded-lg"
            onClick={() => {
              setAddItem("default");
            }}
          />
          <AddBook setDefault={setAddItem} />
        </div>
      )}
      {addItem === "edit" && (
        <div className="fixed w-screen h-screen inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <X
            className="top-20 left-5 p-1 md:size-8 absolute bg-white rounded-lg"
            onClick={() => {
              setAddItem("default");
            }}
          />
          <EditBook
            book_id={selectBookID}
            data={selectBook}
            setDefault={setAddItem}
          />
        </div>
      )}
      {addItem === "delete" && (
        <div className="fixed w-screen h-screen inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <X
            className="top-20 left-5 p-1 md:size-8 absolute bg-white rounded-lg"
            onClick={() => {
              setAddItem("default");
            }}
          />
          <DeleteBook book_id={selectBookID} setDefault={setAddItem} />
        </div>
      )}
    </>
  );
};
