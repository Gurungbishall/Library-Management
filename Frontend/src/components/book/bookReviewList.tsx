import { ReviewLists } from "@/types/types.s";
import { motion } from "framer-motion";
import { Calendar, MessageCircle } from "lucide-react";
import { renderStars } from "../renderStars/renderStars";
import { Card, CardContent } from "../ui/card";

export const BookReviewLists = ({ data }: { data: ReviewLists[] }) => {
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {data && data.length > 0 ? (
        <motion.div className="grid gap-6" variants={containerVariants}>
          {data.map((review, index) => (
            <motion.div
              key={review.review_id}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800 overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* User Info and Rating */}
                    <div className="lg:w-1/3 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {review.user_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                            {review.user_name}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            {new Date(review.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {renderStars(review.rating)}
                        <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                          {review.rating}
                        </span>
                      </div>
                    </div>

                    {/* Review Content */}
                    <div className="lg:w-2/3 space-y-3">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Review</span>
                      </div>
                      <blockquote className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg italic border-l-4 border-blue-500 pl-4">
                        "{review.review_text}"
                      </blockquote>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">💭</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Reviews Yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Be the first to share your thoughts about this book!
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};
