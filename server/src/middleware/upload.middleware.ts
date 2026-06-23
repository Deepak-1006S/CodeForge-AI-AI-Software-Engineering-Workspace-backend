import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import { ApiError } from '../utils/ApiError';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
];

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

const memoryStorage = multer.memoryStorage();

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
): void => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(
      new ApiError(
        400,
        `Invalid file type: ${file.mimetype}. Only JPEG, PNG, GIF, WebP, and SVG are allowed.`,
      ) as unknown as null,
      false,
    );
  }
};

export const upload = multer({
  storage: memoryStorage,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: 1,
  },
  fileFilter,
});

/**
 * Single image upload middleware for avatar uploads.
 * Field name: 'avatar'
 */
export const uploadAvatar = upload.single('avatar');
