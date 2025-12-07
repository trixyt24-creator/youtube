import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async (filepath) => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });
  try {
    if (!filepath) return null;
    const result = await cloudinary.uploader.upload(filepath, {
      resource_type: "auto",
    });
    return result;
  } catch (error) {
    console.log(error);
    return null;
  } finally {
    fs.unlinkSync(filepath);
  }
};

export default uploadOnCloudinary;
