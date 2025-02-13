"use client";

import { useEffect, useState } from "react";
import { LoanBookType } from "@/types/types.s";
import HeaderBar from "@/components/headerBar";
import { LoanBooks } from "@/components/loans/loanBooks";
import { fetchLoansBooks } from "@/api/loan/loan";
const Page = () => {
  const [loanBooks, setLoanBooks] = useState<LoanBookType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchLoansBooks();
      setLoanBooks(data);
    };
    fetchData();
  }, []);
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
