import { Card, CardContent } from "@/components/ui/card";
import { UserType } from "@/types/types.s";
import { motion } from "framer-motion";
import {
  BookOpen,
  Calendar,
  GraduationCap,
  Mail,
  Phone,
  Shield,
  User,
} from "lucide-react";
import Image from "next/image";
import bookImg from "../../picture/The_Great_Gatsby_Cover_1925_Retouched.jpg";
import { Badge } from "../ui/badge";

export const GetIndividualDetail = ({ userData }: { userData: UserType }) => {
  const getGenderIcon = () => {
    return <User className="w-4 h-4" />;
  };

  const getRoleColor = (role: string) => {
    return role === "admin"
      ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
      : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
  };

  const getStudyingColor = (studying: boolean) => {
    return studying
      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
            {/* Profile Image */}
            <motion.div
              className="relative group"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden ring-4 ring-blue-200 dark:ring-blue-800 shadow-lg">
                <Image
                  src={
                    userData?.userimage
                      ? `${process.env.NEXT_PUBLIC_USER_IMAGE_LOCATION}/image/user/${userData?.userimage}`
                      : bookImg
                  }
                  height={160}
                  width={160}
                  alt={userData.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 p-2 bg-blue-600 dark:bg-blue-500 rounded-full shadow-lg">
                <User className="w-5 h-5 text-white" />
              </div>
            </motion.div>

            {/* Member Information */}
            <div className="flex-1 space-y-6">
              {/* Name and Role */}
              <motion.div
                className="text-center lg:text-left"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {userData.name}
                </h1>
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                  <Badge className={getRoleColor(userData.role)}>
                    <Shield className="w-3 h-3 mr-1" />
                    {userData.role.charAt(0).toUpperCase() +
                      userData.role.slice(1)}
                  </Badge>
                  <Badge className={getStudyingColor(userData.studying)}>
                    <GraduationCap className="w-3 h-3 mr-1" />
                    {userData.studying ? "Currently Studying" : "Not Studying"}
                  </Badge>
                </div>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Email
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {userData.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Phone
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {userData.phone_number}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                    <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Age
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {userData.age} years old
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-full">
                    {getGenderIcon()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Gender
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white capitalize">
                      {userData.sex}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Course
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {userData.course || "Not specified"}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
