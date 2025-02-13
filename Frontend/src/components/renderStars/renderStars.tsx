export const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const halfStars = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStars;

  return (
    <>
      {Array.from({ length: fullStars }).map((_, index) => (
        <span key={`full-${index}`} className="text-yellow-500">
          ★
        </span>
      ))}
      {halfStars === 1 && <span className="text-yellow-500">★</span>}
      {Array.from({ length: emptyStars }).map((_, index) => (
        <span key={`empty-${index}`} className="text-gray-300">
          ★
        </span>
      ))}
    </>
  );
};
