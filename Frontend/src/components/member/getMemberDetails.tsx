import { UserType } from "@/types/types.s";
import Image from "next/image";
import bookImg from "../../picture/The_Great_Gatsby_Cover_1925_Retouched.jpg";

export const GetIndividualDetail = ({ userData }: { userData: UserType }) => {
  return (
    <>
      <div
        key={userData.user_id}
        className="w-full flex flex-col md:flex-row items-center md:items-center md:justify-center gap-4 md:gap-24"
      >
        <Image
          src={
            userData?.userimage
              ? `${process.env.NEXT_PUBLIC_USER_IMAGE_LOCATION}/image/user/${userData?.userimage}`
              : bookImg
          }
          height={100}
          width={100}
          alt={userData.name}
          className="w-1/2 md:w-1/4 md:flex-shrink-0 rounded-2xl shadow-xl"
        />
        <div className="md:w-1/2 flex flex-col gap-1 md:gap-2 text-base md:text-xl font-semibold ">
          <span className="text-xl md:text-3xl font-bold ">
            Name : {userData.name}
          </span>
          <span>Email: {userData.email}</span>
          <span>Course: {userData.course}</span>
          <span>Age: {userData.age}</span>
          <span>Gender: {userData.sex}</span>
          <span>Number: {userData.phone_number}</span>
          <span>Role: {userData.role}</span>
        </div>
      </div>
    </>
  );
};
