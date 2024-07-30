import jwt from "jsonwebtoken";
import HostModel from "../../database/mongoose/models/HostModel.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }

    const host = await HostModel.findById(decoded.id);

    if (!host) {
      return res.status(404).json({ error: "host not found" });
    }

    req.hostDetails = host;
    next();
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal Server erroror : protectRoute" });
  }
};

export default protectRoute;
