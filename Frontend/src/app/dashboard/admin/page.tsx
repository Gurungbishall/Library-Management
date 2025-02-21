import HeaderBar from "@/components/headerBar";

import { LoanChart } from "@/components/Chart/loanChart";
const Page = () => {
  return (
    <>
      <HeaderBar />
      <main className="p-4 flex flex-col gap-4">
        <LoanChart />
      </main>
    </>
  );
};

export default Page;
