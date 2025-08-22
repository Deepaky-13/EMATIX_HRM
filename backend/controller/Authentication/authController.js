import jwt from "jsonwebtoken";
import RoleModel from "../../model/Roles/RoleModel.js";
import { StatusCodes } from "http-status-codes";
export const loginUser = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(email, password);

  if (!email || !name) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Name and Email are required" });
  }

  // Find user from DB
  const user = await RoleModel.findOne({
    name: name.trim(),
    email: { $regex: new RegExp(`^${email.trim()}$`, "i") },
  });

  if (!user) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Invalid credentials" });
  }

  if (!user.isActive) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ msg: "User disabled by admin" });
  }

  if (user.password && user.password !== password) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Invalid password" });
  }

  // Admin check — must match exact email + password + role
  console.log(user.role, " : userRole");

  if (
    user.email.toLowerCase() === "ematixsolutions@gmail.com" &&
    user.password === "Ematix@123" &&
    user.role === "admin"
  ) {
    const adminToken = jwt.sign(
      { userId: user._id, name: user.name, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log(adminToken);

    res.cookie("token", adminToken, {
      httpOnly: true,
      //  secure: process.env.NODE_ENV === "production",
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res
      .status(StatusCodes.OK)
      .json({ msg: "Admin login successful", role: "admin", user });
  }

  //  Employee login
  const employeeToken = jwt.sign(
    { userId: user._id, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("token", employeeToken, {
    httpOnly: true,
    //     secure: process.env.NODE_ENV === "production",
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res
    .status(StatusCodes.OK)
    .json({ msg: "Employee login successful", user });
};

export const getCurrentUser = (req, res) => {
  const { user } = req; // Set in auth middleware
  res.status(200).json({ user }); // Includes _id, name, role, etc.
};

export const logOutUser = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expiresIn: new Date(Date.now()),
  });
  res.status(200).json({ msg: "user logout successfully" });
};
