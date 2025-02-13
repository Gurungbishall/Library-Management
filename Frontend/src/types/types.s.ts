
export type BookType = {
  book_id: number;
  title: string;
  author: string;
  category: string;
  isbn: string;
  publication_year: number;
  quantity: number;
  available: number;
  average_rating: number;
  bookimage: string;
  description: string;
  };

export type UserType = {
  name: string;
  email: string;
  password: string;
  sex: string;
  age: number;
  studying: boolean;
  course: string;
  role: string;
  userimage: string;
  };
  

export type LoanBookType = {
    book_id: number;
    loan_date: string; 
    return_date: string | null;
    due_date: string; 
    returned: boolean;
    title: string;
    author: string;
    category: string;
    isbn: string;
    bookimage: string;
  };
  

 export type ArticleType = {
    article_id:number;
    title: string;
    author: string;
    articleimage: string;
    description: string; 
    average_rating: number;
 } 