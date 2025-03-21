import { ManageBooks } from "@/components/book/managebooks";
import HeaderBar from "@/components/headerBar";
const Page = () => {
  return (
    <>
      <HeaderBar />
      <main className="p-4 flex flex-col gap-4">
        <ManageBooks />
      </main>
    </>
  );
};

export default Page;
