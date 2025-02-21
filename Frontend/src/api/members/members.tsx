import { toast } from "@/components/hooks/use-toast";
import { UserType, LoanBookType } from "@/types/types.s";

const Url = process.env.NEXT_PUBLIC_API;

export const fetchMembers = async ({
  memberName,
}: {
  memberName: string;
}): Promise<UserType[]> => {
  try {
    const response = await fetch(
      `${Url}/admin/getMembers/?member_Name=${encodeURIComponent(memberName)}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const result = await response.json();

    if (!response.ok || !result.data) {
      toast({
        title: "No results found",
        description: result.message,
        variant: "destructive",
      });
      return [];
    }

    return result.data;
  } catch {
    toast({
      title: "An error occurred",
      description: "Please try again later.",
      variant: "destructive",
    });

    return [];
  }
};

//delete member
export const deleteMember = async (user_Id: number | null) => {
  try {
    if (user_Id === null || user_Id === 0) {
      toast({
        title: "InValid user id",
        description: "Please try again.",
        variant: "destructive",
      });
    }

    const response = await fetch(`${Url}/admin/deleteMember`, {
      method: "POST",
      body: JSON.stringify({ user_id: user_Id }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      toast({
        title: "An error occurred",
        description: result.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Member deleted successfully",
        description: result.message,
        variant: "default",
      });
    }
  } catch {
    toast({
      title: "An error occurred",
      description: "Please try again later.",
      variant: "destructive",
    });
    return [];
  }
};

//get individual details

export const getIndividualDetail = async (user_Id: number | null) => {
  try {
    if (user_Id === null || user_Id === 0) {
      toast({
        title: "InValid user id",
        description: "Please try again.",
        variant: "destructive",
      });
    }

    const response = await fetch(`${Url}/auth/userDetails/${user_Id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const result = await response.json();

    if (!response.ok) {
      toast({
        title: "An error occurred",
        description: result.message,
        variant: "destructive",
      });
    }
    return result;
  } catch {
    toast({
      title: "An error occurred",
      description: "Please try again later.",
      variant: "destructive",
    });
    return [];
  }
};

//returned book

export const returnLoanBook = async (loan_Id: number) => {
  try {
    if (loan_Id === null || loan_Id === 0) {
      toast({
        title: "InValid user id",
        description: "Please try again.",
        variant: "destructive",
      });
    }

    const response = await fetch(`${Url}/admin/returnLoanBook`, {
      method: "POST",
      body: JSON.stringify({ loan_id: loan_Id }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const result = await response.json();
    if (!response.ok) {
      toast({
        title: "An error occurred",
        description: result.message,
        variant: "destructive",
      });
    }
    return result;
  } catch {
    toast({
      title: "An error occurred",
      description: "Please try again later.",
      variant: "destructive",
    });
    return [];
  }
};

//fetch Member Loan List
export const fetchMemberLoanlist = async (
  user_id: number | null,
  search_Book: string
): Promise<LoanBookType[]> => {
  try {
    const response = await fetch(
      `${Url}/admin/getMemberLoanLists/${user_id}?search_Book=${search_Book}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const result = await response.json();
    if (!response.ok) {
      toast({
        title: "An error occurred",
        description: result.message,
        variant: "destructive",
      });
    }
    return result.data;
  } catch {
    toast({
      title: "An error occurred",
      description: "Please try again later.",
      variant: "destructive",
    });

    return [];
  }
};

//fetch Member Return List
export const fetchMemberReturnlist = async (
  user_id: number | null,
  search_Book: string
): Promise<LoanBookType[]> => {
  try {
    const response = await fetch(
      `${Url}/admin/getMemberReturnLists/${user_id}?search_Book=${search_Book}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const result = await response.json();
    if (!response.ok) {
      toast({
        title: "An error occurred",
        description: result.message,
        variant: "destructive",
      });
    }
    return result.data;
  } catch {
    toast({
      title: "An error occurred",
      description: "Please try again later.",
      variant: "destructive",
    });

    return [];
  }
};

//Delete the Member Return Info
export const deleteReturnedBook = async (loan_Id: number | null) => {
  try {
    if (loan_Id === null || loan_Id === 0) {
      toast({
        title: "InValid user id",
        description: "Please try again.",
        variant: "destructive",
      });
    }

    const response = await fetch(`${Url}/admin/deleteReturnedBookInfo`, {
      method: "POST",
      body: JSON.stringify({ loan_id: loan_Id }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      toast({
        title: "An error occurred",
        description: result.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Return Book deleted successfully",
        description: result.message,
        variant: "default",
      });
    }
  } catch {
    toast({
      title: "An error occurred",
      description: "Please try again later.",
      variant: "destructive",
    });
    return [];
  }
};
