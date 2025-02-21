import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "../ui/card";
import { returnLoanBook } from "@/api/members/members";

export default function DeleteReturnBookInfo({
  loan_id,
  setDefault,
}: {
  loan_id: number;
  setDefault: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <Card className="w-1/2 md:w-1/5 px-3 md:px-1 py-5 flex flex-col gap-4 items-center justify-center">
      <CardTitle className="text-lg md:text-xl">
        Did Student return Book ?
      </CardTitle>
      <Button
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          try {
            await returnLoanBook(loan_id);
          } catch {
          } finally {
            setDefault("default");
            setLoading(false);
          }
        }}
      >
        Return 
      </Button>
    </Card>
  );
}
