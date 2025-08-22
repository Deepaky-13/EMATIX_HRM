import jwt from "jsonwebtoken";
export const authenticateUser = (req, res, next) => {
  const token = req.cookies.token;
  console.log("token", token);

  if (!token) return res.status(401).json({ msg: "No token found" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("user : ", req.user);

    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

export default authenticateUser;
