import { ArticleType } from "@/types/types.s";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { renderStars } from "../renderStars/renderStars";

export const ArticlesOnCategory = ({ data }: { data: ArticleType[] }) => {
  return (
    <>
      <div className="w-full  md:h-64 flex gap-4 overflow-x-auto">
        {data !== undefined && data.length > 0 ? (
          data.map((article) => (
            <Card
              key={article.article_id}
              className="w-1/2 md:w-1/5 flex-shrink-0 p-3 flex flex-col md:gap-3 justify-between items-center rounded-lg hover:shadow-xl"
            >
              <div className="text-xs sm:text-base md:text-lg font-semibold text-center line-clamp-2 overflow-hidden">
                {article.title} by {article.author}
              </div>

              <div className="text-xs md:text-base md:text-justify">
                {article.description}
              </div>
              <div className="flex items-center gap-2">
                {renderStars(article.average_rating)}
              </div>

              <Button className="text-xs md:w-full md:block ">Download</Button>
            </Card>
          ))
        ) : (
          <span className="text-center text-gray-500">
            No Articles available
          </span>
        )}
      </div>
    </>
  );
};
