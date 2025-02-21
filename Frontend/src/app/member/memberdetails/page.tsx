"use client";

import { useEffect, useState } from "react";
import { UserType } from "@/types/types.s";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import HeaderBar from "@/components/headerBar";
import { getIndividualDetail } from "@/api/members/members";
import { useSession } from "@/app/context/authContext";
import { GetIndividualDetail } from "@/components/member/getMemberDetails";
import { ManageIndividualLoanBooks } from "@/components/loans/manageIndividualLoanBook";
import { ManageMemberReturnLists } from "@/components/returnbook/manageMemberReturnLists";

const Page = () => {
  const { member_Id } = useSession();
  const [userDetail, setUserDetail] = useState<UserType | null>(null);
  const [select, setSelect] = useState<string>("Loan");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getIndividualDetail(member_Id);
      setUserDetail(data.user);
    };
    fetchData();
  }, [member_Id]);

  const handleSelectChange = (value: string) => {
    setSelect(value);
  };

  return (
    <>
      <HeaderBar />
      {userDetail ? (
        <>
          <main className="p-4 flex flex-col gap-4">
            <X
              className="top-32 left-5 p-1 md:size-8 absolute rounded-lg"
              onClick={() => {
                router.push("/member/manageMember");
              }}
            />
            <GetIndividualDetail userData={userDetail} />

            <Select value={select} onValueChange={handleSelectChange}>
              <SelectTrigger className="p-3 w-1/5 text-xl font-bold md:text-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Loan"> User Loan Books List</SelectItem>
                <SelectItem value="Return"> User Return Books List</SelectItem>
              </SelectContent>
            </Select>

            {select === "Loan" && <ManageIndividualLoanBooks />}
            {select === "Return" && <ManageMemberReturnLists />}
          </main>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default Page;
