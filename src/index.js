import dotenv from "dotenv";
dotenv.config();
import cors from "cors"
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import { connectMongoDB } from "./frameworks-and-drivers/database/mongoose/connection.js";
import userRoutes from "./frameworks-and-drivers/express/routes/userRoutes.js";
import adminRoutes from "./frameworks-and-drivers/express/routes/adminRoutes.js";

const app = express();
const PORT = process.env.PORT | 8080;
const MONGODB_URI = process.env.MONGODB_URI;
connectMongoDB(MONGODB_URI);

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, // Allow credentials (cookies, authorization headers, TLS client certificates)
}));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

app.use("/", userRoutes);
app.use("/admin", adminRoutes)

app.listen(PORT, () => {
  console.log("listening on port : ", PORT);
});
