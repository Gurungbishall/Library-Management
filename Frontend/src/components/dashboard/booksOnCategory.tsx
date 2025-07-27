import { useSession } from "@/app/context/authContext";
import { BookType } from "@/types/types.s";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import bookImg from "../../picture/The_Great_Gatsby_Cover_1925_Retouched.jpg";
import { AddBookinLoanList } from "../loans/addBookInloanList";
import { renderStars } from "../renderStars/renderStars";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

export const BooksOnCategory = ({ data }: { data: BookType[] }) => {
  const router = useRouter();
  const { setBook_Id } = useSession();

  const [addItem, setAddItem] = useState<string>("default");
  const [selectedBookId, setSelectedBookId] = useState<number>();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <div className="w-full flex gap-6 overflow-x-auto pb-4">
        {data && data.length > 0 ? (
          data.map((book) => (
            <motion.div
              key={book.book_id}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                y: -8,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Card className="w-64 h-96 flex-shrink-0 cursor-pointer relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white dark:bg-slate-800 group">
                <div
                  className="relative h-3/5 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800"
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
                    height={250}
                    width={200}
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/90 hover:bg-white text-gray-900 shadow-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        setBook_Id(book.book_id);
                        router.push("/bookdetail");
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBookId(book.book_id);
                        setAddItem("loan");
                      }}
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </div>

                  <div
                    className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold ${
                      book.available > 0
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {book.available > 0
                      ? `${book.available} available`
                      : "Out of stock"}
                  </div>
                </div>

                <div className="p-4 h-2/5 flex flex-col justify-between">
                  <div className="space-y-2 flex-1">
                    <h3
                      className="font-semibold text-sm line-clamp-1 text-gray-900 dark:text-white leading-tight"
                      title={book.title}
                    >
                      {book.title}
                    </h3>
                    <p
                      className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1"
                      title={book.author}
                    >
                      by {book.author}
                    </p>
                    <div className="flex items-center gap-1">
                      {renderStars(book.average_rating)}
                      <span className="text-xs text-gray-500 ml-1">
                        {book.average_rating}
                      </span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md"
                    disabled={book.available === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBookId(book.book_id);
                      setAddItem("loan");
                    }}
                  >
                    {book.available > 0 ? "Borrow" : "Out of Stock"}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full text-center py-12"
          >
            <div className="text-6xl mb-4">📚</div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              No similar books found
            </p>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {addItem === "loan" && selectedBookId !== undefined && (
          <motion.div
            className="fixed w-screen h-screen inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
            >
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-4 right-4 z-10 rounded-full w-10 h-10 p-0 bg-white dark:bg-gray-800 shadow-lg"
                onClick={() => setAddItem("default")}
              >
                <X className="w-4 h-4" />
              </Button>
              <AddBookinLoanList
                book_id={selectedBookId}
                setDefault={setAddItem}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
