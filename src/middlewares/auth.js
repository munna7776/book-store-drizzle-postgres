import jwt from "jsonwebtoken";

export const authenticatedMiddleware = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers["authorization"];
    if (!authorizationHeader?.startsWith("Bearer")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authorizationHeader.split("Bearer ")[1];
    if (!token) {
      return res.status(401).json({ message: "Missing token" });
    }
    const userDetails = jwt.verify(token, process.env.JWT_SECRET);
    req.user = userDetails;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Invalid token" });
  }
};
