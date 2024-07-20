import multer from 'multer';
import {storage} from './cloudinaryStorage.js';
import {storage as hostStorage} from './hostRequestImagesConfig.js';

export const parser = multer({ storage: storage });
export const hostParser = multer({ storage: hostStorage });