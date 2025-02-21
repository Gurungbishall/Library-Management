"use client";

import { useEffect, useState } from "react";
import { LoanBookType } from "@/types/types.s";
import HeaderBar from "@/components/headerBar";
import { LoanBooks } from "@/components/loans/loanBooks";
import { fetchLoansBooks } from "@/api/loan/loan";
import { toast } from "@/components/hooks/use-toast";

const Page = () => {
  const [loanBooks, setLoanBooks] = useState<LoanBookType[]>([]);
  const user_id = sessionStorage.getItem("user_id");

  useEffect(() => {
    const fetchData = async () => {
      if (user_id) {
        // Convert user_id to a number if it's a valid string
        const userIdNumber = Number(user_id);

        // Check if user_id is a valid number before fetching
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
  }, [user_id]);

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
