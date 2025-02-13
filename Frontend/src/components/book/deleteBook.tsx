"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteBook } from "@/api/book/book";
import { Card, CardTitle } from "../ui/card";
export default function DeleteBook({
  book_id,
  setDefault,
}: {
  book_id: number;
  setDefault: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <Card className="w-1/2 md:w-1/5 px-3 md:px-1 py-5 flex flex-col gap-4 items-center justify-center">
      <CardTitle className="text-lg md:text-xl">
        Really You want to delete book ?
      </CardTitle>
      <Button
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          try {
            await deleteBook(book_id);
          } catch {
          } finally {
            setDefault("default");
            setLoading(false);
          }
        }}
      >
        Delete the Book
      </Button>
    </Card>
  );
}
