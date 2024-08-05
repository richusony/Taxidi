import jwt from "jsonwebtoken";
import { UserModel } from "../../database/mongoose/models/UserModel.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;
    // console.log("accessToken from frontend :", token);
    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized - No Access Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // console.log("decoded : ", decoded);
    if (!decoded) {
      console.log("reached if statement : ", decoded);
      return res
        .status(401)
        .json({ error: "Unauthorized - Invalid Access Token" });
    }

    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("User jwt errors :", error.message);
    res.status(401).json({ error: "Access not allowed : protectRoute" });
  }
};

export default protectRoute;
