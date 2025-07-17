import { useSession } from "@/app/context/authContext";
import { LoanBookType } from "@/types/types.s";
import { motion } from "framer-motion";
import { AlertTriangle, CalendarDays, CheckCircle, Clock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import bookImg from "../../picture/The_Great_Gatsby_Cover_1925_Retouched.jpg";
import { Card } from "../ui/card";

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
    <div className="w-full h-80 flex gap-4 overflow-x-auto pb-2">
      {data !== undefined && data.length > 0 ? (
        data.map((book, index) => {
          const daysLeft = calculateDaysLeft(book.due_date);
          const isOverdue = daysLeft <= 0;
          const isAlmostDue = daysLeft <= 3 && daysLeft > 0;

          return (
            <motion.div
              key={book.book_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{
                scale: 1.05,
                y: -5,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                className={`
                  w-72 h-full flex-shrink-0 p-4 flex flex-col gap-3 justify-between items-center 
                  rounded-xl cursor-pointer transition-all duration-300
                  bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-900/90 dark:to-gray-800/70
                  backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60
                  shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10
                  ${
                    isOverdue
                      ? "ring-2 ring-red-500/50 shadow-red-500/20"
                      : isAlmostDue
                      ? "ring-2 ring-amber-500/50 shadow-amber-500/20"
                      : "hover:ring-2 hover:ring-blue-500/30"
                  }
                `}
                onClick={() => {
                  setBook_Id(book.book_id);
                  router.push("/bookdetail");
                }}
              >
                {/* Book Image with Status Badge */}
                <div className="relative">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Image
                      src={
                        book?.bookimage
                          ? `${process.env.NEXT_PUBLIC_USER_IMAGE_LOCATION}/image/book/${book?.bookimage}`
                          : bookImg
                      }
                      height={120}
                      width={90}
                      alt={book.title}
                      className="w-20 h-28 md:w-24 md:h-32 rounded-lg shadow-md object-cover"
                    />
                  </motion.div>

                  {/* Status Badge */}
                  <div
                    className={`
                    absolute -top-2 -right-2 p-1.5 rounded-full shadow-lg
                    ${
                      isOverdue
                        ? "bg-red-500 text-white"
                        : isAlmostDue
                        ? "bg-amber-500 text-white"
                        : "bg-green-500 text-white"
                    }
                  `}
                  >
                    {isOverdue ? (
                      <AlertTriangle className="w-3 h-3" />
                    ) : isAlmostDue ? (
                      <Clock className="w-3 h-3" />
                    ) : (
                      <CheckCircle className="w-3 h-3" />
                    )}
                  </div>
                </div>

                {/* Book Title */}
                <h3 className="text-sm md:text-base font-semibold text-center line-clamp-2 text-gray-900 dark:text-gray-100 leading-tight">
                  {book.title}
                </h3>

                {/* Date Information */}
                <div className="w-full space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      <span>Borrowed</span>
                    </div>
                    <span className="font-medium">
                      {new Date(book.loan_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Due</span>
                    </div>
                    <span className="font-medium">
                      {new Date(book.due_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Status Text */}
                <motion.div
                  className={`
                    text-xs font-bold px-3 py-1.5 rounded-full text-center w-full
                    ${
                      isOverdue
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                        : isAlmostDue
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                        : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                    }
                  `}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {isOverdue
                    ? `Overdue by ${Math.abs(daysLeft)} day${
                        Math.abs(daysLeft) !== 1 ? "s" : ""
                      }`
                    : daysLeft === 0
                    ? "Due Today"
                    : `${daysLeft} day${daysLeft !== 1 ? "s" : ""} left`}
                </motion.div>
              </Card>
            </motion.div>
          );
        })
      ) : (
        <motion.div
          className="w-full h-full flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center p-8 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
            <div className="text-4xl mb-4">📚</div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              No books borrowed yet
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Start exploring our collection!
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};
