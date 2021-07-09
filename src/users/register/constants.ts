require('dotenv').config();

export const CLOUDINARY = {
  provide: 'Cloudinary',
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
};
