import jwt, { type JwtPayload } from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import { throwError } from "../utils/throwError.js";
import { User } from "../models/user.model.js";

interface JwtUserPayload extends JwtPayload {
  id: string;
}

export const authMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    throwError(401, "Not authorized. Token missing");
  }

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET!
  ) as JwtUserPayload;

  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    throwError(401, "User no longer exists");
    return;
  }

  req.userId = user._id;

  next();
});