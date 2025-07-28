import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { Request } from 'express';
import path from 'path';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage configuration for profile photos
const profilePhotoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wonder-dating/profile-photos',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 800, height: 800, crop: 'fill', quality: 'auto' },
      { flags: 'progressive' }
    ],
  } as any,
});

// Cloudinary storage configuration for chat images
const chatImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wonder-dating/chat-images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    transformation: [
      { width: 1200, height: 1200, crop: 'limit', quality: 'auto' },
      { flags: 'progressive' }
    ],
  } as any,
});

// File filter function
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF files are allowed.'));
  }
};

// Profile photo upload middleware
export const uploadProfilePhoto = multer({
  storage: profilePhotoStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 6, // Maximum 6 photos per user
  },
});

// Chat image upload middleware
export const uploadChatImage = multer({
  storage: chatImageStorage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1,
  },
});

// Lookalike photo upload (temporary storage for processing)
const lookalikeStorage = multer.memoryStorage();

export const uploadLookalikePhoto = multer({
  storage: lookalikeStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1,
  },
});

// Utility function to delete image from Cloudinary
export const deleteCloudinaryImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
  }
};

// Utility function to extract public ID from Cloudinary URL
export const extractPublicId = (url: string): string => {
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  return filename.split('.')[0];
};

// Utility function to upload base64 image to Cloudinary
export const uploadBase64ToCloudinary = async (
  base64Data: string,
  folder: string,
  transformation?: any
): Promise<string> => {
  try {
    const result = await cloudinary.uploader.upload(base64Data, {
      folder: `wonder-dating/${folder}`,
      transformation,
    });
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading base64 to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
};

// Middleware to handle upload errors
export const handleUploadError = (error: any, req: Request, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.',
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum is 6 photos.',
      });
    }
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: 'File upload failed',
    error: error.message,
  });
};

export { cloudinary };