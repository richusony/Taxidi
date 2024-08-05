// middlewares/verifyRole.js
export const verifyRole = (requiredRole) => {
  return (req, res, next) => {
    try {
      if (req.user) {
        if (req.user.role !== requiredRole) {
          return res
            .status(403)
            .json({ error: "Forbidden - Insufficient user role" });
        }
      } else if (req.admin) {
        if (req.admin.role !== requiredRole) {
          return res
            .status(403)
            .json({ error: "Forbidden - Insufficient admin role" });
        }
      } else if (req.hostDetails) {
        if (req.hostDetails.role !== requiredRole) {
          return res
            .status(403)
            .json({ error: "Forbidden - Insufficient host role" });
        }
      }
      next();
    } catch (error) {
      console.log(error.message);
    }
  };
};
