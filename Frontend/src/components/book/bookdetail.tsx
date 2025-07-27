import { BookType } from "@/types/types.s";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Heart, Share2, Star, User, Users, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import bookImg from "../../picture/The_Great_Gatsby_Cover_1925_Retouched.jpg";
import { AddBookinLoanList } from "../loans/addBookInloanList";
import { renderStars } from "../renderStars/renderStars";
import { AddReview } from "../review/addReview";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

export const BookDetail = ({
  data,
  reviewCount = 0,
}: {
  data: BookType;
  reviewCount?: number;
}) => {
  const [selectedBookId, setSelectedBookId] = useState<number>();
  const [addItem, setAddItem] = useState<string>("default");
  const [imageLoaded, setImageLoaded] = useState(false);

  const getAvailabilityStatus = () => {
    if (data.available > 5)
      return {
        text: "In Stock",
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-100 dark:bg-green-900/30",
      };
    if (data.available > 0)
      return {
        text: "Limited",
        color: "text-amber-600 dark:text-amber-400",
        bgColor: "bg-amber-100 dark:bg-amber-900/30",
      };
    return {
      text: "Out of Stock",
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-900/30",
    };
  };

  const availability = getAvailabilityStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-900/90 dark:to-gray-800/70 backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="relative flex flex-col lg:flex-row">
            <motion.div
              className="lg:w-2/5 p-8 lg:p-12 flex justify-center lg:justify-start items-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative group">
                <motion.div
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <Image
                    src={
                      data?.bookimage
                        ? `${process.env.NEXT_PUBLIC_USER_IMAGE_LOCATION}/image/book/${data?.bookimage}`
                        : bookImg
                    }
                    height={400}
                    width={300}
                    alt={data.title}
                    className="w-64 h-80 lg:w-72 lg:h-96 object-cover rounded-xl shadow-2xl transition-all duration-300"
                    onLoad={() => setImageLoaded(true)}
                  />

                  <motion.div
                    className="absolute top-4 right-4 flex flex-col gap-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: imageLoaded ? 1 : 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-10 h-10 rounded-full shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:scale-110 transition-all duration-200"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-10 h-10 rounded-full shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:scale-110 transition-all duration-200"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </motion.div>

                <motion.div
                  className={`absolute -bottom-2 -right-2 px-3 py-1.5 rounded-full text-xs font-semibold ${availability.bgColor} ${availability.color} shadow-lg`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, type: "spring" }}
                >
                  {availability.text}
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              className="lg:w-3/5 p-8 lg:p-12 flex flex-col justify-center"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="mb-6">
                <motion.h1
                  className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 leading-tight"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {data.title}
                </motion.h1>
                <motion.div
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-lg"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <User className="w-5 h-5" />
                  <span>by {data.author}</span>
                </motion.div>
              </div>

              <motion.div
                className="flex flex-wrap items-center gap-6 mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center gap-2">
                  {renderStars(data.average_rating)}
                  <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    {data.average_rating}
                  </span>
                </div>
                <div className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium">
                  {data.category}
                </div>
              </motion.div>

              <motion.div
                className="grid grid-cols-2 gap-4 mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <BookOpen className="w-6 h-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {data.available}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Available
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <Users className="w-6 h-6 mx-auto mb-2 text-green-600 dark:text-green-400" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {reviewCount}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Reviews
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Description
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                  {data.description}
                </p>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1"
                >
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    disabled={data.available === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBookId(data.book_id);
                      setAddItem("loan");
                    }}
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    {data.available > 0 ? "Borrow Book" : "Out of Stock"}
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1"
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBookId(data.book_id);
                      setAddItem("review");
                    }}
                  >
                    <Star className="w-5 h-5 mr-2" />
                    Write Review
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </CardContent>
      </Card>

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

        {addItem === "review" && selectedBookId !== undefined && (
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
              <AddReview book_id={selectedBookId} setDefault={setAddItem} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
