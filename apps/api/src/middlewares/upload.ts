import multer from "multer";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2MB

const RESUME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

const DOCUMENT_TYPES = [...RESUME_TYPES, ...PHOTO_TYPES];

const storage = multer.memoryStorage();

export const uploadApplicationFiles = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "photo") {
      if (!PHOTO_TYPES.includes(file.mimetype)) {
        return cb(new Error("Photo must be JPG, PNG, or WEBP"));
      }
    } else if (file.fieldname === "resume") {
      if (!RESUME_TYPES.includes(file.mimetype)) {
        return cb(new Error("Resume must be PDF or Word document"));
      }
    } else {
      return cb(new Error(`Unexpected file field: ${file.fieldname}`));
    }
    cb(null, true);
  },
}).fields([
  { name: "resume", maxCount: 1 },
  { name: "photo", maxCount: 1 },
]);

export const uploadAvatar = multer({
  storage,
  limits: { fileSize: MAX_AVATAR_SIZE },
  fileFilter: (req, file, cb) => {
    if (!PHOTO_TYPES.includes(file.mimetype)) {
      return cb(new Error("Avatar must be JPG, PNG, or WEBP"));
    }
    cb(null, true);
  },
}).single("avatar");

export const uploadDocument = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (!DOCUMENT_TYPES.includes(file.mimetype)) {
      return cb(new Error("Document must be PDF, Word, JPG, PNG, or WEBP"));
    }
    cb(null, true);
  },
}).single("file");
