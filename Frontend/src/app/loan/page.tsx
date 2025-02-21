"use client";

import { useEffect, useState } from "react";
import { LoanBookType } from "@/types/types.s";
import HeaderBar from "@/components/headerBar";
import { LoanBooks } from "@/components/loans/loanBooks";
import { fetchLoansBooks } from "@/api/loan/loan";
import { toast } from "@/components/hooks/use-toast";
import { useSession } from "../context/authContext";

const Page = () => {
  const [loanBooks, setLoanBooks] = useState<LoanBookType[]>([]);
  const { user_Id } = useSession();
  useEffect(() => {
    const fetchData = async () => {
      if (user_Id) {
        const userIdNumber = Number(user_Id);

        if (!isNaN(userIdNumber)) {
          const data = await fetchLoansBooks(userIdNumber);
          setLoanBooks(data);
        } else {
          // Handle invalid user_id scenario
          toast({
            title: "Invalid User ID",
            description: "Please log in again.",
            variant: "destructive",
          });
        }
      }
    };
    fetchData();
  }, [user_Id]);

  return (
    <>
      <HeaderBar />
      <main className="p-4">
        <div className="flex flex-col gap-2">
          <span className="text-xl font-bold">Loans Book</span>
          <LoanBooks data={loanBooks} />
        </div>
      </main>
    </>
  );
};

export default Page;
