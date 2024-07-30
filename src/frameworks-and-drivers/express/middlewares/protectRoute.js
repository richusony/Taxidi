import jwt from "jsonwebtoken";
import {UserModel} from "../../database/mongoose/models/UserModel.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    // console.log(token);
    if (!token) {
      return res.status(401).json({ err: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ err: "Unauthorized - Invalid Token" });
    }

    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ err: "User not found" });
    }

    req.user = user;
    next();

  } catch (error) {
    res.status(500).json({ err: "Internal Server Error : protectRoute" });
  }
};

export default protectRoute;