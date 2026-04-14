import multer from "multer";
import path from "path";
import crypto from "crypto";

const storage = multer.diskStorage({
  destination: path.resolve(__dirname, "..", "..", "uploads"),
  filename(req, file, callback) {
    const hash = crypto.randomBytes(6).toString("hex");
    const fileName = `${hash}-${file.originalname}`;
    callback(null, fileName);
  },
});

export const uploadConfig = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/pjpeg",
      "image/png",
      "image/gif",
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Tipo de arquivo inválido. Apenas imagens são permitidas."));
    }
  },
});
