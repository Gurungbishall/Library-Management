import { ReviewLists } from "@/types/types.s";
import { renderStars } from "../renderStars/renderStars";
import { Card } from "../ui/card";

export const BookReviewLists = ({ data }: { data: ReviewLists[] }) => {
  return (
    <>
      <div>
        <div className="text-3xl font-bold text-center text-gray-800 mb-6">
          Customer Reviews
        </div>
        <div className="px-4 bg-gray-50">
          {data !== undefined &&
            data.map((review) => (
              <Card
                key={review.review_id}
                className="relative w-full flex flex-col md:flex-row items-start bg-white rounded-lg shadow-lg mb-6 p-6"
              >
                <div className="md:w-1/2 flex flex-col gap-4">
                  <span className="text-2xl md:text-3xl font-semibold text-gray-800">
                    {review.user_name}
                  </span>
                  <span className="text-sm text-gray-500 italic">
                    {review.review_text}
                  </span>
                  <div className="flex items-center gap-2 mt-2">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <div className="md:w-1/2 flex flex-col items-start justify-center md:items-end mt-4 md:mt-0">
                  <span className="text-sm text-gray-400">
                    Posted on {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
              </Card>
            ))}
        </div>
      </div>
    </>
  );
};
