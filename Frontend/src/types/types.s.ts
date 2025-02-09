
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
  image_url: string;
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
  image_url: string;
  };
  