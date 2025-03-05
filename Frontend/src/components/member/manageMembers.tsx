"use client";

import { useState, useEffect } from "react";
import { UserType } from "@/types/types.s";
import Image from "next/image";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { X } from "lucide-react";
import { Input } from "../ui/input";
import EditMember from "./editMember";
import bookImg from "../../picture/The_Great_Gatsby_Cover_1925_Retouched.jpg";
import DeleteMember from "./deleteMember";
import { fetchMembers } from "@/api/members/members";
import { useSession } from "@/app/context/authContext";
import { useRouter } from "next/navigation";

export const ManageMembers = () => {
  const [addItem, setAddItem] = useState<string>("default");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectMemberID, setSelectMemberId] = useState<number>(0);
  const [selectMember, setSelectMember] = useState<UserType>();
  const [data, setData] = useState<UserType[]>([]);
  const { setMember_Id } = useSession();

  const router = useRouter();

  useEffect(() => {
    const searchMembers = async () => {
      try {
        const members = await fetchMembers({ memberName: searchQuery });
        setData(members);
      } catch {
        setData([]);
      } finally {
      }
    };

    const timeoutId = setTimeout(() => {
      searchMembers();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, data]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <div className="w-full h-full flex flex-col gap-4">
        <div className="flex w-full justify-between">
          <div className="w-1/2 md:w-1/3 flex flex-col gap-2">
            <span>Manage Members</span>
            <Input
              placeholder="Search members"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div className="w-full h-full flex gap-4 overflow-x-auto">
          {data !== undefined && data.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Sex</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Studying</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((member, index) => (
                  <TableRow
                    key={member.user_id}
                    onClick={() => {
                      setMember_Id(member.user_id);
                      router.push("/member/memberdetails");
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Image
                        src={
                          member?.userimage
                            ? `${process.env.NEXT_PUBLIC_USER_IMAGE_LOCATION}/image/user/${member?.userimage}`
                            : bookImg
                        }
                        alt={member.name}
                        width={100}
                        height={100}
                        priority
                      />
                    </TableCell>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.sex}</TableCell>
                    <TableCell>{member.age}</TableCell>
                    <TableCell>{member.studying ? "Yes" : "No"}</TableCell>
                    <TableCell>{member.course}</TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>{member.phone_number}</TableCell>

                    <TableCell className="flex gap-2">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectMemberId(member.user_id);
                          setSelectMember(member);
                          setAddItem("edit");
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAddItem("delete");
                          setSelectMemberId(member.user_id);
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <span className="text-center text-gray-500">
              No Members available
            </span>
          )}
        </div>
      </div>

      {addItem === "edit" && (
        <div className="fixed w-screen h-screen inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <X
            className="top-20 left-5 p-1 md:size-8 absolute bg-white rounded-lg"
            onClick={() => {
              setAddItem("default");
            }}
          />
          <EditMember
            user_id={selectMemberID}
            data={selectMember}
            setDefault={setAddItem}
          />
        </div>
      )}
      {addItem === "delete" && (
        <div className="fixed w-screen h-screen inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <X
            className="top-20 left-5 p-1 md:size-8 absolute bg-white rounded-lg"
            onClick={() => {
              setAddItem("default");
            }}
          />
          <DeleteMember user_id={selectMemberID} setDefault={setAddItem} />
        </div>
      )}
    </>
  );
};
