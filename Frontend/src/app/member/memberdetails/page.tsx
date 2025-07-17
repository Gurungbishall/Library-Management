"use client";

import { getIndividualDetail } from "@/api/members/members";
import { useSession } from "@/app/context/authContext";
import HeaderBar from "@/components/headerBar";
import { ManageIndividualLoanBooks } from "@/components/loans/manageIndividualLoanBook";
import { GetIndividualDetail } from "@/components/member/getMemberDetails";
import { ManageMemberReturnLists } from "@/components/returnbook/manageMemberReturnLists";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserType } from "@/types/types.s";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, RotateCcw, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const { member_Id } = useSession();
  const [userDetail, setUserDetail] = useState<UserType | null>(null);
  const [select, setSelect] = useState<string>("Loan");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getIndividualDetail(member_Id);
        setUserDetail(data.user);
      } catch (error) {
        console.error("Error fetching member details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (member_Id) {
      fetchData();
    }
  }, [member_Id]);

  const handleSelectChange = (value: string) => {
    setSelect(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <HeaderBar />

      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading member details...
            </p>
          </div>
        </div>
      ) : userDetail ? (
        <motion.main
          className="p-4 md:p-6 lg:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Back Button */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              variant="ghost"
              onClick={() => router.push("/member/manageMember")}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Members
            </Button>
          </motion.div>

          {/* Page Header */}
          <motion.div
            className="mb-8 text-center md:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  Member Details
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg mt-1">
                  View member information and activity
                </p>
              </div>
            </div>
          </motion.div>

          {/* Member Details */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <GetIndividualDetail userData={userDetail} />
          </motion.div>

          {/* Tab Selection */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Member Activity
                  </h2>
                  <Select value={select} onValueChange={handleSelectChange}>
                    <SelectTrigger className="w-64">
                      <div className="flex items-center gap-2">
                        {select === "Loan" ? (
                          <BookOpen className="w-4 h-4" />
                        ) : (
                          <RotateCcw className="w-4 h-4" />
                        )}
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Loan">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          Current Loans
                        </div>
                      </SelectItem>
                      <SelectItem value="Return">
                        <div className="flex items-center gap-2">
                          <RotateCcw className="w-4 h-4" />
                          Return History
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {select === "Loan" && <ManageIndividualLoanBooks />}
            {select === "Return" && <ManageMemberReturnLists />}
          </motion.div>
        </motion.main>
      ) : (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Member Not Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The requested member details could not be found.
            </p>
            <Button
              onClick={() => router.push("/member/manageMember")}
              variant="outline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Members
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
