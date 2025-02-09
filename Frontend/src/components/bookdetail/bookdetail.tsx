import { BookType } from "@/types/types.s";
import { Button } from "../ui/button";
import Image from "next/image";
import { renderStars } from "../renderStars/renderStars";
import bookImg from "../../picture/The_Great_Gatsby_Cover_1925_Retouched.jpg";

export const BookDetail = ({ data }: { data: BookType }) => {
  return (
    <div
      key={data.book_id}
      className="relative w-full flex flex-col md:flex-row items-center md:items-start md:justify-center gap-4 md:gap-24"
    >
      <Image
        src={bookImg}
        alt={data?.title}
        className="w-1/2 md:w-1/4 md:flex-shrink-0"
      />
      <div className="md:w-1/2 flex flex-col gap-2 ">
        <span className="text-2xl md:text-4xl font-bold ">{data?.title}</span>
        <span className="text-xs">by {data?.author}</span>
        <div className="flex items-center gap-1 md:gap-2">
          {renderStars(data.average_rating)} {data.average_rating}
        </div>
        <div className="md:text-xl font-semibold">{data?.category}</div>
        <div className="md:text-xl">Available:{data?.available}</div>
        <Button className="w-1/2 md:w-1/4 bottom-0 md:absolute ">Borrow</Button>
      </div>
    </div>
  );
};
