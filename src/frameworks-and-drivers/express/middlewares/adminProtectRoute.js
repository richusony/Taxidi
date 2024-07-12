import jwt from "jsonwebtoken";
import { AdminModel } from "../../database/mongoose/models/AdminModel.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ err: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ err: "Unauthorized - Invalid Token" });
    }

    const admin = await AdminModel.findById(decoded.id);

    if (!admin) {
      return res.status(404).json({ err: "admin not found" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(500).json({ err: "Internal Server Error : protectRoute" });
  }
};

export default protectRoute;
