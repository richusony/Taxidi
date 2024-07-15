import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinaryConfig.js";

export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // Custom folder path within Cloudinary
    format: async (req, file) => {
      const extension = file.originalname.split(".").pop();
      return extension;
    },
    public_id: (req, file) => file.originalname,
  },
});
