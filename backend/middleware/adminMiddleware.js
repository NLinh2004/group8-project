// middleware/adminMiddleware.js
const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Chỉ Admin được phép truy cập" });
  }
  next();
};

export default adminMiddleware;
