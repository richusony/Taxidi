import multer from 'multer';
import {storage} from './cloudinaryStorage.js';
import {storage as brandStorage} from './brandImageUploads.js';
import {storage as hostStorage} from './hostRequestImagesConfig.js';
import {storage as userLicenseStorage} from './userLicenseUploads.js';

export const parser = multer({ storage: storage });
export const hostParser = multer({ storage: hostStorage });
export const brandParser = multer({ storage: brandStorage });
export const userParser = multer({ storage: userLicenseStorage });