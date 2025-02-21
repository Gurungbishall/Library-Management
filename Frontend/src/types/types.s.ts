
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

  export type SearchedBookType = {
    book_id: number;
    title: string;
    author: string;
    average_rating: number;
    bookimage: string;
    };
  
export type UserType = {
  user_id: number;
  name: string;
  email: string;
  password: string;
  sex: string;
  age: number;
  studying: boolean;
  course: string;
  role: string;
  userimage: string;
  phone_number: string;
  };
  

export type LoanBookType = {
    loan_id: number;
    book_id: number;
    loan_date: string; 
    return_date: string;
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