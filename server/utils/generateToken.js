import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || "my-super-secreat",
    {
      expiresIn: process.env.JWT_EXPIRES || "7d",
    }
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  };

  res.cookie("token", token, cookieOptions);
  return token;
};

export default generateToken;
