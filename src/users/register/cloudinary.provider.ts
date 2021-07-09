import { v2 } from 'cloudinary';
import { CLOUDINARY } from './constants';

export const CloudinaryProvider = {
  provide: CLOUDINARY.provide,
  useFactory: () => {
    return v2.config({
      cloud_name: CLOUDINARY.cloudName,
      api_key: CLOUDINARY.apiKey,
      api_secret: CLOUDINARY.apiSecret,
    });
  },
};
