import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
import { Request } from "express";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "recibos-logistica",
    format: (req: Request, file: Express.Multer.File) => {
      const allowedFormats = ["png", "jpg", "jpeg", "webp"];
      const fileFormat = file.mimetype.split("/")[1];
      return allowedFormats.includes(fileFormat) ? fileFormat : "jpg";
    },
    public_id: (req: Request, file: Express.Multer.File) => {
      const hash = Math.random().toString(36).substring(7);
      return `${Date.now()}-${hash}`;
    },
  } as any,
});

export { cloudinary };
