import jwt from "jsonwebtoken";
import HostModel from "../../database/mongoose/models/HostModel.js";

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
      // console.log("reached if statement : ", decoded);
      return res
        .status(401)
        .json({ error: "Unauthorized - Invalid Access Token" });
    }

    const host = await HostModel.findById(decoded.id);

    if (!host) {
      return res.status(404).json({ error: "host not found" });
    }

    req.hostDetails = host;
    next();
  } catch (error) {
    console.log("Host jwt errors :", error.message);
    res.status(401).json({ error: "Access not allowed : protectRoute" });
  }
};

export default protectRoute;
