"use client";

import { useEffect, useState } from "react";
import { LoanBookType, UserType } from "@/types/types.s";
import HeaderBar from "@/components/headerBar";
import { getIndividualDetail } from "@/api/members/members";
import { useSession } from "../context/authContext";
import { GetIndividualDetail } from "@/components/member/getMemberDetails";
const Page = () => {
  const { member_Id } = useSession();
  const [loanbooks, setLoanBooks] = useState<LoanBookType[] | null>([]);
  const [userDetail, setUserDetail] = useState<UserType | null>();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getIndividualDetail(member_Id);
      console.log(data);
      setLoanBooks(data.loans);
      setUserDetail(data.user);
    };
    fetchData();
  }, [member_Id]);

  return (
    <>
      <HeaderBar />
      {loanbooks && userDetail ? (
        <>
          <main className="p-4 flex flex-col gap-6">
            <GetIndividualDetail userData={userDetail} loanBooks={loanbooks} />
          </main>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default Page;
