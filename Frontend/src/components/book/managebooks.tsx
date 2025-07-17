"use client";

import { fetchManageBooks } from "@/api/search/search";
import AddBook from "@/components/book/addBook";
import { BookType } from "@/types/types.s";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Calendar,
  Edit3,
  Filter,
  Hash,
  MoreHorizontal,
  Plus,
  Search,
  Star,
  Trash2,
  User,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import bookImg from "../../picture/The_Great_Gatsby_Cover_1925_Retouched.jpg";
import { renderStars } from "../renderStars/renderStars";
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
import DeleteBook from "./deleteBook";
import EditBook from "./editBook";

export const ManageBooks = () => {
  const [addItem, setAddItem] = useState<string>("default");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("title");
  const [selectBookID, setSelectBookId] = useState<number>(0);
  const [selectBook, setSelectBook] = useState<BookType>();
  const [data, setData] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchBooks = async () => {
      setLoading(true);
      try {
        const books = await fetchManageBooks({ searchBook: searchQuery });
        setData(books);
      } catch (error) {
        console.error("Error fetching books:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      searchBooks();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter and sort books
  const filteredAndSortedBooks = data
    .filter((book) => {
      if (categoryFilter === "all") return true;
      return book.category.toLowerCase() === categoryFilter.toLowerCase();
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "author":
          return a.author.localeCompare(b.author);
        case "category":
          return a.category.localeCompare(b.category);
        case "year":
          return b.publication_year - a.publication_year;
        case "rating":
          return b.average_rating - a.average_rating;
        default:
          return 0;
      }
    });

  const categories = [...new Set(data.map((book) => book.category))];

  // Calculate statistics
  const totalBooks = data.length;
  const totalAvailable = data.reduce((sum, book) => sum + book.available, 0);
  const totalBorrowed = data.reduce(
    (sum, book) => sum + (book.quantity - book.available),
    0
  );
  const averageRating =
    data.length > 0
      ? data.reduce((sum, book) => sum + book.average_rating, 0) / data.length
      : 0;

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
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
                    Total Books
                  </p>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                    {totalBooks}
                  </p>
                </div>
                <BookOpen className="w-10 h-10 text-blue-500" />
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
                    Available
                  </p>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                    {totalAvailable}
                  </p>
                </div>
                <BookOpen className="w-10 h-10 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                    Borrowed
                  </p>
                  <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">
                    {totalBorrowed}
                  </p>
                </div>
                <User className="w-10 h-10 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    Avg Rating
                  </p>
                  <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                    {averageRating.toFixed(1)}
                  </p>
                </div>
                <Star className="w-10 h-10 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Search and Filter Controls */}
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
                    placeholder="Search books by title, author, or ISBN..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="pl-10"
                  />
                </div>

                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-full md:w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="author">Author</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                    <SelectItem value="year">Publication Year</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={() => setAddItem("add")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Book
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Books Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg mb-4"></div>
                    <div className="space-y-2">
                      <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-3/4"></div>
                      <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-1/2"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredAndSortedBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredAndSortedBooks.map((book, index) => (
                <motion.div
                  key={book.book_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800 overflow-hidden">
                    <div className="relative">
                      <div className="aspect-[3/4] overflow-hidden">
                        <Image
                          src={
                            book?.bookimage
                              ? `${process.env.NEXT_PUBLIC_USER_IMAGE_LOCATION}/image/book/${book?.bookimage}`
                              : bookImg
                          }
                          alt={book.title}
                          width={200}
                          height={300}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Action Buttons Overlay */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="secondary"
                              size="sm"
                              className="bg-white/90 hover:bg-white dark:bg-slate-800/90 dark:hover:bg-slate-800 dark:text-white shadow-md hover:shadow-lg transition-all duration-200"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectBookId(book.book_id);
                                setSelectBook(book);
                                setAddItem("edit");
                              }}
                            >
                              <Edit3 className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setAddItem("delete");
                                setSelectBookId(book.book_id);
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Availability Badge */}
                      <div className="absolute top-2 left-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            book.available > 0
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                        >
                          {book.available > 0
                            ? `${book.available} Available`
                            : "Out of Stock"}
                        </span>
                      </div>
                    </div>

                    <CardContent className="p-4 space-y-3">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2">
                          {book.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                          by {book.author}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {renderStars(book.average_rating)}
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          ({book.average_rating.toFixed(1)})
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Hash className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {book.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {book.publication_year}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                        {book.description}
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          ISBN: {book.isbn}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Qty: {book.quantity}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No books found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchQuery
                  ? "Try adjusting your search terms or filters"
                  : "Get started by adding your first book to the library"}
              </p>
              <Button
                onClick={() => setAddItem("add")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Book
              </Button>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Modals */}
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
              <AddBook setDefault={setAddItem} />
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
              <EditBook
                book_id={selectBookID}
                data={selectBook}
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
              <DeleteBook book_id={selectBookID} setDefault={setAddItem} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
