import { ManageMembers } from "@/components/member/manageMembers";
import HeaderBar from "@/components/headerBar";
const Page = () => {
  return (
    <>
      <HeaderBar />
      <main className="p-4 flex flex-col gap-4">
        <ManageMembers />
      </main>
    </>
  );
};

export default Page;
