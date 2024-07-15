import cloudinary from './cloudinaryConfig.js';

export const uploadImages = async (files) => {
  const urls = files.map(file => file.path);
  return urls;
};
