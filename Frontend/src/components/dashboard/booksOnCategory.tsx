import { BookType } from "@/types/types.s";
import Image from "next/image";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import bookImg from "../../picture/The_Great_Gatsby_Cover_1925_Retouched.jpg";
import { renderStars } from "../renderStars/renderStars";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/context/authContext";

export const BooksOnCategory = ({ data }: { data: BookType[] }) => {
  const router = useRouter();
  const { setBook_Id } = useSession();

  return (
    <>
      <div className="w-full h-80 flex gap-4 overflow-x-auto">
        {data.length > 0 ? (
          data.map((book) => (
            <Card
              key={book.book_id}
              className="w-2/5 md:w-1/5 h-full flex-shrink-0 p-2 flex flex-col gap-1 md:gap-3 justify-between items-center rounded-lg hover:shadow-lg"
              onClick={() => {
                setBook_Id(book.book_id);
                router.push("/bookdetail");
              }}
            >
              <Image
                src={bookImg}
                alt={book.title}
                className="md:w-36 md:h-44 rounded-l"
              />

              <div className="text-xs sm:text-base md:text-lg font-semibold text-center line-clamp-2">
                {book.title} by {book.author}
              </div>

              <div className="flex items-center gap-2">
                {renderStars(book.average_rating)}
              </div>

              <Button className="w-full">Borrow</Button>
            </Card>
          ))
        ) : (
          <span className="text-center text-gray-500">No books available</span>
        )}
      </div>
    </>
  );
};
