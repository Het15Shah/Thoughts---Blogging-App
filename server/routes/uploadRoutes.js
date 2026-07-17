import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    const unique = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, unique);
  },
});

const allowedTypes = /jpg|jpeg|png|gif|webp/;

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter(req, file, cb) {
    const ext  = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mime = allowedTypes.test(file.mimetype);
    if (ext && mime) cb(null, true);
    else cb(new Error('Only image files are allowed (jpg, png, gif, webp)'));
  },
});

// POST /api/upload  — upload a single image file
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  // Return path as Appwrite-compatible $id  →  '/uploads/filename.jpg'
  const filePath = `/${req.file.path.replace(/\\/g, '/')}`;
  res.json({ $id: filePath });
});

// DELETE /api/upload/:filename  — permanently remove uploaded image
router.delete('/:filename', (req, res) => {
  const filePath = path.join(process.cwd(), 'uploads', req.params.filename);

  fs.access(filePath, fs.constants.F_OK, (accessErr) => {
    if (accessErr) return res.status(404).json({ message: 'File not found' });

    fs.unlink(filePath, (unlinkErr) => {
      if (unlinkErr) {
        console.error('Delete file error:', unlinkErr);
        return res.status(500).json({ message: 'Error deleting file' });
      }
      res.json({ message: 'File deleted successfully' });
    });
  });
});

export default router;
