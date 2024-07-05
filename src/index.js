import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import { connectMongoDB } from "./frameworks-and-drivers/database/mongoose/connection.js";
import userRoutes from "./frameworks-and-drivers/express/routes/userRoutes.js";

const app = express();
const PORT = process.env.PORT | 8080;
const MONGODB_URI = process.env.MONGODB_URI;
connectMongoDB(MONGODB_URI);

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

app.use("/", userRoutes);

app.listen(PORT, () => {
  console.log("listening on port : ", PORT);
});
