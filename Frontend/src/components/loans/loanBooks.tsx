import { LoanBookType } from "@/types/types.s";
import Image from "next/image";
import { Card } from "../ui/card";
import bookImg from "../../picture/The_Great_Gatsby_Cover_1925_Retouched.jpg";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/context/authContext";

export const LoanBooks = ({ data }: { data: LoanBookType[] }) => {
  const router = useRouter();
  const { setBook_Id } = useSession();

  const calculateDaysLeft = (dueDate: string) => {
    const currentDate = new Date();
    const due = new Date(dueDate);
    const timeDifference = due.getTime() - currentDate.getTime();
    const daysLeft = Math.ceil(timeDifference / (1000 * 3600 * 24));
    return daysLeft;
  };

  return (
    <div className="w-full h-80 flex gap-4 overflow-x-auto">
      {data !== undefined && data.length > 0 ? (
        data.map((book) => {
          const daysLeft = calculateDaysLeft(book.due_date);
          return (
            <Card
              key={book.book_id}
              className="w-2/5 md:w-1/5 h-full flex-shrink-0 p-2 flex flex-col gap-1 md:gap-1 justify-between items-center rounded-lg hover:shadow-xl"
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
                className="md:w-36 md:h-44 rounded-l"
              />

              <div className="text-xs sm:text-base md:text-lg font-semibold text-center line-clamp-1">
                {book.title}
              </div>

              <div className="text-xs md:text-base">
                <span>Loan Date:</span>
                <span>{new Date(book.loan_date).toLocaleDateString()}</span>
              </div>
              <div className="text-xs md:text-base">
                <span>Due Date: </span>
                <span>{new Date(book.due_date).toLocaleDateString()}</span>
              </div>

              <div className="text-sm font-semibold text-gray-500">
                {daysLeft > 0 ? `${daysLeft} days left` : "Overdue"}
              </div>
            </Card>
          );
        })
      ) : (
        <span className="text-center text-gray-500">No books available</span>
      )}
    </div>
  );
};
