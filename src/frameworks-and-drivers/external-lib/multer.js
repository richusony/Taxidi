import multer from 'multer';
import {storage} from './cloudinaryStorage.js';

export const parser = multer({ storage: storage });