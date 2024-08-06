import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";

import userRoutes from "./frameworks-and-drivers/express/routes/userRoutes.js";
import hostRoutes from "./frameworks-and-drivers/express/routes/hostRoutes.js";
import adminRoutes from "./frameworks-and-drivers/express/routes/adminRoutes.js";
import { connectMongoDB } from "./frameworks-and-drivers/database/mongoose/connection.js";

const app = express();
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI;

connectMongoDB(MONGODB_URI);

const whitelist = [
  "http://localhost:5173",
  "https://taxidi.vercel.app",
  "http://192.168.1.2:5173",
  "http://103.175.136.101:5173",
];

const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      // console.log("origin :::: ", origin);
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

// User Routes
app.use("/", userRoutes);

// Admin Routes
app.use("/admin", adminRoutes);

// Host Routes
app.use("/host", hostRoutes);



// Global Error Handler
// app.use((err, req, res, next) => {
//   console.log(err);
//   res.status(500).json({ error: err?.message });
// });

app.listen(PORT, () => {
  console.log("listening on port :", PORT, "ON :", process.env.NODE_ENV);
});
