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
      const imageFormats = ["png", "jpg", "jpeg", "webp"];
      const videoFormats = ["mp4", "mov", "avi", "webm"];
      const fileFormat = file.mimetype.split("/")[1];

      if (imageFormats.includes(fileFormat)) return fileFormat;
      if (videoFormats.includes(fileFormat)) return fileFormat;
      return "jpg"; 
    },

    resource_type: (req: Request, file: Express.Multer.File) => {
      return file.mimetype.startsWith("video/") ? "video" : "image";
    },

    public_id: (req: Request, file: Express.Multer.File) => {
      const hash = Math.random().toString(36).substring(7);
      return `${Date.now()}-${hash}`;
    },
  } as any,
});

import multer from "multer";
export const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, 
});

export { cloudinary };
