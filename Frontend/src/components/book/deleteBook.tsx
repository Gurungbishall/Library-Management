"use client";

import { deleteBook } from "@/api/book/book";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Trash2, X } from "lucide-react";
import React, { useState } from "react";

export default function DeleteBook({
  book_id,
  setDefault,
}: {
  book_id: number;
  setDefault: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteBook(book_id);
    } catch (error) {
      console.error("Error deleting book:", error);
    } finally {
      setDefault("default");
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border-0 shadow-2xl bg-white dark:bg-slate-900">
      <CardHeader className="bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-full">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <CardTitle className="text-xl font-bold">Delete Book</CardTitle>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setDefault("default")}
            className="text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
            <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Are you sure?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This action cannot be undone. This will permanently delete the
              book from your library.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDefault("default")}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Deleting...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete Book
                </div>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
