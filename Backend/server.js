import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/auth/auth.route.js";
import bookRoutes from "./src/routes/book/book.route.js";
import loanRoutes from "./src/routes/loan/loan.route.js";
import searchRoutes from "./src/routes/search/search.route.js";
import memberRoutes from "./src/routes/member/member.route.js";
import reviewRoutes from "./src/routes/review/review.route.js";
import articleRoutes from "./src/routes/article/article.route.js";
import path from "path";
import { fileURLToPath } from "url";
const PORT = process.env.PORT || 3000;

const app = express();

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

const allowedOrigins = process.env.Frontend_URL;
// const allowedOrigins = "https://library-management-gilt-two.vercel.app";

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use("/image", express.static(path.join(__dirname, "public/image")));

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/book", bookRoutes);
app.use("/loan", loanRoutes);
app.use("/search", searchRoutes);
app.use("/article", articleRoutes);
app.use("/review", reviewRoutes);
app.use("/admin", memberRoutes);

app.listen(PORT, () => {
  console.log("Server has started ");
});
