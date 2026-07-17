import express from 'express';
import {
  toggleFollow,
  toggleBookmark,
  toggleHide,
  getPreferences,
} from '../controllers/actionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All action routes require authentication

router.post('/follow', toggleFollow);
router.post('/bookmark', toggleBookmark);
router.post('/hide', toggleHide);
router.get('/preferences', getPreferences);

export default router;
