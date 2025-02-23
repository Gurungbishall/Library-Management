import { useState } from "react";
import { BookType } from "@/types/types.s";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import Image from "next/image";
import { renderStars } from "../renderStars/renderStars";
import bookImg from "../../picture/The_Great_Gatsby_Cover_1925_Retouched.jpg";
import { AddBookinLoanList } from "../loans/addBookInloanList";
import { AddReview } from "../review/addReview";

export const BookDetail = ({ data }: { data: BookType }) => {
  const [selectedBookId, setSelectedBookId] = useState<number>();
  const [addItem, setAddItem] = useState<string>("default");

  return (
    <>
      {" "}
      <div
        key={data.book_id}
        className="relative w-full flex flex-col md:flex-row items-center md:items-start md:justify-center gap-4 md:gap-24"
      >
        <Image
          src={
            data?.bookimage
              ? `${process.env.NEXT_PUBLIC_USER_IMAGE_LOCATION}/image/book/${data?.bookimage}`
              : bookImg
          }
          height={100}
          width={100}
          alt={data.title}
          className="w-1/2 md:w-1/6 md:flex-shrink-0"
        />
        <div className="md:w-1/2 flex flex-col gap-2 ">
          <span className="text-2xl md:text-4xl font-bold ">{data.title}</span>
          <span className="text-xs">by {data.author}</span>
          <div className="flex items-center gap-1 md:gap-2 size-4">
            {renderStars(data.average_rating)} {data.average_rating}
          </div>
          <div className="md:text-xl font-semibold">{data.category}</div>
          <div className="md:text-xl font-semibold">
            Available: {data.available}
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-semibold md:text-xl">Description: </span>
            <div>{data.description}</div>
          </div>
          <Button
            className="w-1/2 md:w-1/4"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedBookId(data.book_id);
              setAddItem("loan");
            }}
          >
            Borrow
          </Button>
          <Button
            className="w-1/2 md:w-1/4"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedBookId(data.book_id);
              setAddItem("review");
            }}
          >
            Review
          </Button>
        </div>
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
      {addItem === "review" && selectedBookId !== undefined && (
        <div className="absolute w-screen h-screen inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <X
            className="top-20 left-5 p-1 md:size-8 absolute bg-white rounded-lg"
            onClick={() => {
              setAddItem("default");
            }}
          />
          <AddReview  book_id={selectedBookId} setDefault={setAddItem}/>
        </div>
      )}
    </>
  );
};
