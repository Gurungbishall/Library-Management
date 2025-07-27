"use client";

import { fetchMembers } from "@/api/members/members";
import { useSession } from "@/app/context/authContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserType } from "@/types/types.s";
import { AnimatePresence, motion } from "framer-motion";
import {
  Edit3,
  Filter,
  GraduationCap,
  Mail,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Trash2,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import bookImg from "../../picture/The_Great_Gatsby_Cover_1925_Retouched.jpg";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import AddMember from "./addMember";
import DeleteMember from "./deleteMember";
import EditMember from "./editMember";

export const ManageMembers = () => {
  const [addItem, setAddItem] = useState<string>("default");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectMemberID, setSelectMemberId] = useState<number>(0);
  const [selectMember, setSelectMember] = useState<UserType>();
  const [data, setData] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const { setMember_Id } = useSession();

  const router = useRouter();

  useEffect(() => {
    const searchMembers = async () => {
      setLoading(true);
      try {
        const members = await fetchMembers({ memberName: searchQuery });
        setData(members || []);
      } catch (error) {
        console.error("Error fetching members:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      searchMembers();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredMembers = data.filter((member) => {
    if (roleFilter === "all") return true;
    return member.role.toLowerCase() === roleFilter.toLowerCase();
  });

  const roles = [...new Set(data.map((member) => member.role))];

  const totalMembers = data.length;
  const activeStudents = data.filter((member) => member.studying).length;
  const adminCount = data.filter((member) => member.role === "admin").length;
  const userCount = data.filter((member) => member.role === "user").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    Total Members
                  </p>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                    {totalMembers}
                  </p>
                </div>
                <Users className="w-10 h-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">
                    Active Students
                  </p>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                    {activeStudents}
                  </p>
                </div>
                <GraduationCap className="w-10 h-10 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    Admins
                  </p>
                  <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                    {adminCount}
                  </p>
                </div>
                <User className="w-10 h-10 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                    Users
                  </p>
                  <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">
                    {userCount}
                  </p>
                </div>
                <Users className="w-10 h-10 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 items-center flex-1">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search members by name or email..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="pl-10"
                  />
                </div>

                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={() => setAddItem("add")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-12 text-center">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">
                  Loading members...
                </p>
              </div>
            ) : filteredMembers.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-b border-gray-200 dark:border-gray-700">
                      <TableHead className="font-semibold text-gray-900 dark:text-white">
                        #
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white">
                        Avatar
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white">
                        Name
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white">
                        Email
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white">
                        Gender
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white">
                        Age
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white">
                        Student
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white">
                        Course
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white">
                        Role
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white">
                        Phone
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.map((member, index) => (
                      <TableRow
                        key={member.user_id}
                        className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                        onClick={() => {
                          setMember_Id(member.user_id);
                          router.push("/member/memberdetails");
                        }}
                      >
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700">
                            <Image
                              src={
                                member?.userimage
                                  ? `${process.env.NEXT_PUBLIC_USER_IMAGE_LOCATION}/image/user/${member?.userimage}`
                                  : bookImg
                              }
                              alt={member.name}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {member.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {member.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="capitalize text-gray-900 dark:text-white">
                            {member.sex}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-900 dark:text-white">
                            {member.age}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              member.studying
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                            }`}
                          >
                            {member.studying ? "Yes" : "No"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-900 dark:text-white">
                            {member.course || "N/A"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              member.role === "admin"
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                            }`}
                          >
                            {member.role.charAt(0).toUpperCase() +
                              member.role.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {member.phone_number}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-slate-600"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectMemberId(member.user_id);
                                  setSelectMember(member);
                                  setAddItem("edit");
                                }}
                              >
                                <Edit3 className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setAddItem("delete");
                                  setSelectMemberId(member.user_id);
                                }}
                                className="text-red-600 dark:text-red-400"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No members found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {searchQuery
                    ? "Try adjusting your search terms or filters"
                    : "Get started by adding your first member"}
                </p>
                <Button
                  onClick={() => setAddItem("add")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Member
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence>
        {addItem === "add" && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
            >
              <AddMember setDefault={setAddItem} />
            </motion.div>
          </motion.div>
        )}

        {addItem === "edit" && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
            >
              <EditMember
                user_id={selectMemberID}
                data={selectMember}
                setDefault={setAddItem}
              />
            </motion.div>
          </motion.div>
        )}

        {addItem === "delete" && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
            >
              <DeleteMember user_id={selectMemberID} setDefault={setAddItem} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
