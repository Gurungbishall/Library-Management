import { deleteReturnedBook } from "@/api/members/members";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, X } from "lucide-react";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function DeleteReturnedBook({
  loan_id,
  setDefault,
}: {
  loan_id: number;
  setDefault: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteReturnedBook(loan_id);
      setDefault("default");
    } catch (error) {
      console.error("Error deleting returned book:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6" />
            <CardTitle className="text-xl">Delete Return Record</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDefault("default")}
            className="h-8 w-8 p-0 hover:bg-white/20 text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <CardDescription className="text-center text-base mb-6">
          Are you sure you want to delete this return record? This action cannot
          be undone.
        </CardDescription>
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => setDefault("default")}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className="min-w-[100px]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
