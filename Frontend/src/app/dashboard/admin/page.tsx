"use client";

import { fetchBooks } from "@/api/book/book";
import { fetchMembers } from "@/api/members/members";
import { LoanChart } from "@/components/Chart/loanChart";
import HeaderBar from "@/components/headerBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookType, UserType } from "@/types/types.s";
import { motion } from "framer-motion";
import {
  BookOpen,
  BookPlus,
  Clock,
  Plus,
  Settings,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const [books, setBooks] = useState<BookType[]>([]);
  const [members, setMembers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInClient, setIsInClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [booksData, membersData] = await Promise.all([
          fetchBooks(""),
          fetchMembers({ memberName: "" }),
        ]);
        setBooks(booksData);
        setMembers(membersData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalBooks = books?.length || 0;
  const totalMembers = members?.length || 0;
  const activeMembers =
    members?.filter((member) => member.studying)?.length || 0;
  const adminCount =
    members?.filter((member) => member.role === "admin")?.length || 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const statsData = [
    {
      title: "Total Books",
      value: totalBooks,
      icon: BookOpen,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-600 dark:text-blue-400",
      description: "Books in library",
    },
    {
      title: "Total Members",
      value: totalMembers,
      icon: Users,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      iconColor: "text-green-600 dark:text-green-400",
      description: "Registered users",
    },
    {
      title: "Active Students",
      value: activeMembers,
      icon: Clock,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      iconColor: "text-purple-600 dark:text-purple-400",
      description: "Currently studying",
    },
    {
      title: "Admin Users",
      value: adminCount,
      icon: Settings,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      iconColor: "text-orange-600 dark:text-orange-400",
      description: "System administrators",
    },
  ];

  const quickActions = [
    {
      title: "Add New Book",
      description: "Add a new book to the library",
      icon: BookPlus,
      color: "from-blue-500 to-cyan-500",
      onClick: () => router.push("/category"),
    },
    {
      title: "Add New Member",
      description: "Register a new library member",
      icon: UserPlus,
      color: "from-green-500 to-emerald-500",
      onClick: () => router.push("/member/manageMember"),
    },
    {
      title: "Manage Loans",
      description: "View and manage book loans",
      icon: Clock,
      color: "from-purple-500 to-pink-500",
      onClick: () => router.push("/loan"),
    },
  ];

  useEffect(() => {
    setIsInClient(true);
  }, []);

  if (!isInClient) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <HeaderBar />

      <motion.main
        className="p-4 md:p-6 lg:p-8 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="text-center md:text-left"
          variants={itemVariants}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Manage your library system efficiently
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
        >
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.title}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                transition: { type: "spring", stiffness: 300 },
              }}
            >
              <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800 dark:border dark:border-slate-700">
                <div
                  className={`absolute top-0 right-0 w-20 h-20 ${stat.bgColor} rounded-full -translate-y-10 translate-x-10 opacity-50`}
                />
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                        {stat.title}
                      </p>
                      <motion.div
                        className="text-3xl font-bold text-gray-900 dark:text-white mb-1"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: 0.2 + index * 0.1,
                          type: "spring",
                        }}
                      >
                        {loading ? (
                          <div className="w-12 h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
                        ) : (
                          stat.value
                        )}
                      </motion.div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {stat.description}
                      </p>
                    </div>
                    <motion.div
                      className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg bg-white dark:bg-slate-800 dark:border dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-white">
                <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Button
                      onClick={action.onClick}
                      className={`w-full h-auto p-4 bg-gradient-to-r ${action.color} text-white hover:shadow-lg transition-all duration-300 flex flex-col items-center gap-3`}
                      asChild
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <action.icon className="w-6 h-6" />
                        <div className="text-center">
                          <p className="font-medium">{action.title}</p>
                          <p className="text-xs opacity-90 mt-1">
                            {action.description}
                          </p>
                        </div>
                      </motion.div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={itemVariants}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LoanChart />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-0 shadow-lg bg-white dark:bg-slate-800 dark:border dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-white">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                  System Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">
                      Total Books
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {totalBooks}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">
                      Active Members
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {activeMembers}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">
                      Total Admins
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {adminCount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">
                      System Status
                    </span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      Online
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.main>
    </div>
  );
};

export default Page;
