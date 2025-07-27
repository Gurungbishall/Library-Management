"use client";

import { useSession } from "@/app/context/authContext";
import HeaderBar from "@/components/headerBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EditUser from "@/components/user/editUser";
import { UserType } from "@/types/types.s";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Camera,
  Edit3,
  GraduationCap,
  Mail,
  Phone,
  User,
  UserCheck,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import bookImg from "../../../picture/The_Great_Gatsby_Cover_1925_Retouched.jpg";

export default function Page() {
  const { user, user_Id, loading, isAdmin } = useSession();
  const router = useRouter();
  const [addItem, setAddItem] = useState<string>("default");
  const [selectUserID, setSelectUserID] = useState<number | null>(0);
  const [selectUser, setSelectUser] = useState<UserType | null>(null);

  const parsedUserId = user_Id ? parseInt(user_Id, 10) : null;

  const userDetails = [
    {
      icon: Mail,
      label: "Email",
      value: user?.email,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: GraduationCap,
      label: "Course",
      value: user?.course,
      color: "text-green-600 dark:text-green-400",
    },
    {
      icon: Calendar,
      label: "Age",
      value: user?.age,
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: User,
      label: "Gender",
      value: user?.sex,
      color: "text-pink-600 dark:text-pink-400",
    },
    {
      icon: Phone,
      label: "Phone",
      value: user?.phone_number,
      color: "text-orange-600 dark:text-orange-400",
    },
    {
      icon: UserCheck,
      label: "Role",
      value: user?.role,
      color: "text-indigo-600 dark:text-indigo-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <HeaderBar />

      <motion.main
        className="p-4 md:p-6 lg:p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() =>
              router.push(isAdmin ? "/dashboard/admin" : "/dashboard/user")
            }
            className="hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </motion.div>

        {!loading ? (
          <div className="max-w-4xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-900/90 dark:to-gray-800/70 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-700 dark:to-purple-700 h-32"></div>
                    <div className="absolute inset-0 bg-white/20 dark:bg-black/20 h-32"></div>

                    <div className="relative pt-8 pb-6 px-6">
                      <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                        <motion.div
                          className="relative group"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-gray-800 shadow-xl overflow-hidden bg-white dark:bg-gray-800">
                            <Image
                              src={
                                user?.userimage
                                  ? `${process.env.NEXT_PUBLIC_USER_IMAGE_LOCATION}/image/user/${user?.userimage}`
                                  : bookImg
                              }
                              fill
                              alt={user?.name || "User Image"}
                              className="object-cover"
                            />
                          </div>

                          <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Camera className="w-8 h-8 text-white" />
                          </div>
                        </motion.div>

                        <div className="text-center md:text-left flex-1">
                          <motion.h1
                            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white drop-shadow-lg mb-2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                          >
                            {user?.name}
                          </motion.h1>
                          <motion.p
                            className="text-gray-700 dark:text-white/90 text-lg drop-shadow-md"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                          >
                            {user?.role === "admin"
                              ? "Administrator"
                              : "Student"}
                          </motion.p>
                        </div>

                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.6, delay: 0.6 }}
                        >
                          <Button
                            onClick={() => {
                              setAddItem("edit");
                              setSelectUserID(parsedUserId);
                              setSelectUser(user);
                            }}
                            className="bg-white/90 hover:bg-white text-gray-900 border border-gray-200 hover:border-gray-300 dark:bg-white/20 dark:hover:bg-white/30 dark:text-white dark:border-white/30 dark:hover:border-white/50 backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-xl"
                          >
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit Profile
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userDetails.map((detail, index) => (
                      <motion.div
                        key={detail.label}
                        className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div
                          className={`p-2 rounded-full bg-white dark:bg-gray-800 ${detail.color}`}
                        >
                          <detail.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {detail.label}
                          </p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {detail.value || "Not specified"}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        ) : (
          <motion.div
            className="flex items-center justify-center min-h-[60vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center">
              <motion.div
                className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Loading profile...
              </p>
            </div>
          </motion.div>
        )}
      </motion.main>

      <AnimatePresence>
        {addItem === "edit" && (
          <EditUser
            user_id={selectUserID}
            data={selectUser}
            setDefault={setAddItem}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
