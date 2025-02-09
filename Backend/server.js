import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/auth/auth.route.js";
import bookRoutes from "./src/routes/book/book.route.js";
import loanRoutes from "./src/routes/loan/loan.route.js";

const app = express();

const allowedOrigins = process.env.Frontend_URL; 

const corsOptions = {
  origin: allowedOrigins, 
  credentials: true,      
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/book", bookRoutes);
app.use("/loan", loanRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server has started ");
});
