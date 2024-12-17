import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";
export const register = async (req, res) => {
  try {
    const { fullname, email, password, phoneNumber, role } = req.body;
    if (!fullname || !email || !password || !phoneNumber || !role) {
      return res
        .status(400)
        .json({ message: "provide all credentials", success: false });
    }
    const file=req.file;
    const fileUri=getDataUri(file);
    const cloudResponse=await cloudinary.uploader.upload(fileUri.content)
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "user already exist! go to login", success: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
      profile:{
        profilePhoto: cloudResponse.secure_url
      }
    });

    return res.status(200).json({
      message: "user created successfully",
      success: true,
      newUser,
    });
  } catch (error) {
    console.log("error in register handler", error);
    return res.status(500).json({ message: "internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ message: "provide all credentials", success: false });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "user doesn't exist! go to signup", success: false });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ message: "incorrect email or password", success: false });
    }
    if (role !== user.role) {
      return res
        .status(400)
        .json({ message: "incorrect role", success: false });
    }

    const tokenData = { userId: user._id };
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    res
      .status(200)
      .cookie("authToken", token, {
        httpOnly: true,
        maxAge: 24 * 3600000,
        secure: true,
        sameSite: "strict",
      })
      .json({ message: "login successful", user, success: true });
  } catch (error) {
    console.log("error in login handler", error);
    return res.status(500).json({ message: "internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("authToken", "", { maxAge: 0 })
      .json({ message: "logout successful", success: true });
  } catch (error) {
    console.log("error in logout handler", error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;
    const fileUri=getDataUri(file);
    const cloudResponse=await cloudinary.uploader.upload(fileUri.content)

    let skillsArray;
    if (skills) {
      skillsArray = skills.split(",");
    }
    const userId = req.id;
    let user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ message: "user not found", success: false });
    }

    if (fullname) user.fullname = fullname;

    if (email) user.email = email;

    if (phoneNumber) user.phoneNumber = phoneNumber;

    if (bio) user.profile.bio = bio;

    if (skills) user.profile.skills = skillsArray;

    if(cloudResponse){
      user.profile.resume=cloudResponse.secure_url;
      user.profile.resumeOriginalName=file.originalname
    }

    await user.save();

    return res.status(200).json({
      message: "user updated",
      success: true,
      user,
    });
  } catch (error) {
    console.log("error in update profile handler", error);
  }
};
