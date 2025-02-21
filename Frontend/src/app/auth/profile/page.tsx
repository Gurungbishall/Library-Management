"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { UserType } from "@/types/types.s";
import { Button } from "@/components/ui/button";
import bookImg from "../../../picture/The_Great_Gatsby_Cover_1925_Retouched.jpg";
import { useSession } from "@/app/context/authContext";
import HeaderBar from "@/components/headerBar";
import { useRouter } from "next/navigation";
import EditUser from "@/components/user/editUser";

export default function Page() {
  const { user, user_Id, loading, } = useSession();
  const router = useRouter();
  const [addItem, setAddItem] = useState<string>("default");
  const [selectUserID, setSelectUserID] = useState<number | null>(0);
  const [selectUser, setSelectUser] = useState<UserType | null>(null);


  const parsedUserId = user_Id ? parseInt(user_Id, 10) : null;
  return (
    <>
      <HeaderBar />
      <main className="p-4 flex flex-col gap-4">
        <Button
          variant="outline"
          size="icon"
          className="top-20 left-5 p-2 md:size-8 absolute"
          onClick={() => {
            router.push("/dashboard/user");
          }}
        >
          <X />
        </Button>

        {!loading ? (
          <div
            key={user?.user_id}
            className="w-full flex flex-col md:flex-row items-center md:items-center md:justify-center gap-4 md:gap-24"
          >
            <Image
              src={
                user?.userimage
                  ? `${process.env.NEXT_PUBLIC_USER_IMAGE_LOCATION}/image/user/${user?.userimage}`
                  : bookImg
              }
              height={100}
              width={100}
              alt={user?.name || "user Image"}
              className="w-1/2 md:w-1/4 md:flex-shrink-0 rounded-2xl shadow-xl"
            />
            <div className="md:w-1/2 flex flex-col gap-1 md:gap-2 text-base md:text-xl font-semibold ">
              <span className="text-xl md:text-3xl font-bold ">
                Name : {user?.name}
              </span>
              <span>Email: {user?.email}</span>
              <span>Course: {user?.course}</span>
              <span>Age: {user?.age}</span>
              <span>Gender: {user?.sex}</span>
              <span>Number: {user?.phone_number}</span>
              <span>Role: {user?.role}</span>
              <Button
                className="w-1/2 md:w-1/4"
                onClick={() => {
                  setAddItem("edit");
                  setSelectUserID(parsedUserId);
                  setSelectUser(user);
                }}
              >
                Edit
              </Button>
            </div>
          </div>
        ) : (
          "loading user details"
        )}
      </main>
      {addItem === "edit" && (
        <div className="absolute w-screen h-screen inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <Button
            variant="outline"
            size="icon"
            className="top-20 left-5 p-2 md:size-8 absolute"
            onClick={() => {
              setAddItem("default");
            }}
          >
            <X />
          </Button>
          <EditUser
            user_id={selectUserID}
            data={selectUser}
            setDefault={setAddItem}
          />
        </div>
      )}
    </>
  );
}
