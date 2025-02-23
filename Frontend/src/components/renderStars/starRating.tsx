export const StarRating = ({
  rating,
  onRatingChange,
}: {
  rating: number | null;
  onRatingChange: (rating: number) => void; 
}) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <div
          key={star}
          onClick={() => {
            onRatingChange(star);
          }}
          className={`cursor-pointer text-2xl md:text-4xl flex justify-center items-center ${
            rating && rating >= star ? "text-yellow-500" : "text-gray-400"
          }`}
        >
          {rating && rating >= star ? "★" : "☆"}
        </div>
      ))}
    </div>
  );
};
