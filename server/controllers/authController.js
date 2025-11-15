import bcrypt from "bcrypt";
import User from "../models/User.js";

import generateToken from "../utils/generateToken.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

// Signup (with optional image)
export const signup = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    // all field are required
    if (!fullName || !email || !password) {
      res.status(400).json({ error: "All fields are required" });
    }

    //  check password length
    if (password.length < 6) {
      res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    // 2. Validate email using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // check user already existed in database
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Handle image upload
    let avatar = {};
    if (req.file) {
      const localFilePath = req.file.path; // path to temp file
      // console.log("Local file Path: ", localFilePath);

      // ✅ Upload file to Cloudinary
      const result = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "image", // auto-detect type: image, video, pdf, etc.
        folder: "profile_pictures", // optional folder name in Cloudinary
        use_filename: true, // use original name
        unique_filename: false, // prevent random renaming
      });

      avatar = { url: result.secure_url, public_id: result.public_id };

      // ✅ Remove temporary local file after successful upload
      fs.unlink(localFilePath, (err) => {
        if (err) console.error("Error deleting temp file:", err);
      });
    }

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      avatar,
    });

    // console.log(user);

    generateToken(res, user._id);

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "All fields required" });

    // check user exist or not and also check user password
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    generateToken(res, user._id);

    res.json({
      message: "Logged in successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });
    res.status(200).json({ message: "Logged out :)" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get current user
export const getMe = async (req, res) => {
  try {
    const user = req.user;
    res.json({ user });
  } catch (error) {
    console.log("Error in getMe controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
