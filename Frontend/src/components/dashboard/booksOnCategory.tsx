import { useState } from "react";
import { BookType } from "@/types/types.s";
import Image from "next/image";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import bookImg from "../../picture/The_Great_Gatsby_Cover_1925_Retouched.jpg";
import { renderStars } from "../renderStars/renderStars";
import { AddBookinLoanList } from "../loans/addBookInloanList";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/context/authContext";

export const BooksOnCategory = ({ data }: { data: BookType[] }) => {
  const router = useRouter();
  const { setBook_Id } = useSession();

  const [addItem, setAddItem] = useState<string>("default");
  const [selectedBookId, setSelectedBookId] = useState<number>();
  return (
    <>
      <div className="w-full flex gap-4 overflow-x-auto">
        {data !== undefined && data.length > 0 ? (
          data.map((book) => (
            <Card
              key={book.book_id}
              className="w-2/5 sm:w-2/6 md:w-3/12 xl:w-1/6 h-64 md:h-80 xl:h-[350px] flex-shrink-0 p-2 flex flex-col gap-1 md:gap-3 justify-between items-center rounded-lg hover:shadow-xl"
              onClick={() => {
                setBook_Id(book.book_id);
                router.push("/bookdetail");
              }}
            >
              <Image
                src={
                  book?.bookimage
                    ? `${process.env.NEXT_PUBLIC_USER_IMAGE_LOCATION}/image/book/${book?.bookimage}`
                    : bookImg
                }
                height={100}
                width={100}
                alt={book.title}
                className="w-28 h-32 md:w-36 md:h-44 rounded-l"
              />

              <div className="text-xs md:text-base lg:text-lg font-semibold text-center line-clamp-2">
                {book.title} by {book.author}
              </div>

              <div className="flex items-center gap-2">
                {renderStars(book.average_rating)}
              </div>

              <Button
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedBookId(book.book_id);
                  setAddItem("loan");
                }}
              >
                Borrow
              </Button>
            </Card>
          ))
        ) : (
          <span className="text-center text-gray-500">No books available</span>
        )}
      </div>
      {addItem === "loan" && selectedBookId !== undefined && (
        <div className="absolute w-screen h-screen inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <X
            className="top-20 left-5 p-1 md:size-8 absolute bg-white rounded-lg"
            onClick={() => {
              setAddItem("default");
            }}
          />
          <AddBookinLoanList book_id={selectedBookId} setDefault={setAddItem} />
        </div>
      )}
    </>
  );
};
