import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role.middleware';

const publicDir = path.join(__dirname, '..', '..', '..', 'public');
const imagesDir = path.join(publicDir, 'images');
const filesDir = path.join(publicDir, 'files');

fs.mkdirSync(imagesDir, { recursive: true });
fs.mkdirSync(filesDir, { recursive: true });

const allowedFileExtensions = [
  '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
  '.txt', '.csv', '.zip', '.rar', '.7z',
  '.jpg', '.jpeg', '.png', '.webp', '.gif',
];

function makeStorage(dir: string) {
  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, dir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`);
    },
  });
}

const imageUpload = multer({
  storage: makeStorage(imagesDir),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (/^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Допустимы только изображения (jpeg, png, webp, gif)'));
    }
  },
});

const fileUpload = multer({
  storage: makeStorage(filesDir),
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedFileExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Недопустимый тип файла'));
    }
  },
});

const router = Router();

function fileUrl(req: Request, folder: string, filename: string): string {
  return `${req.protocol}://${req.get('host')}/${folder}/${filename}`;
}

router.post(
  '/image',
  authMiddleware,
  requireRole('ADMIN'),
  (req: Request, res: Response) => {
    imageUpload.single('image')(req, res, (err: unknown) => {
      if (err) {
        const message = err instanceof Error ? err.message : 'Ошибка загрузки';
        res.status(400).json({ message });
        return;
      }
      if (!req.file) {
        res.status(400).json({ message: 'Файл не получен' });
        return;
      }
      res.status(201).json({ url: fileUrl(req, 'images', req.file.filename) });
    });
  }
);

router.post(
  '/file',
  authMiddleware,
  requireRole('ADMIN'),
  (req: Request, res: Response) => {
    fileUpload.single('file')(req, res, (err: unknown) => {
      if (err) {
        const message = err instanceof Error ? err.message : 'Ошибка загрузки';
        res.status(400).json({ message });
        return;
      }
      if (!req.file) {
        res.status(400).json({ message: 'Файл не получен' });
        return;
      }
      res.status(201).json({
        url: fileUrl(req, 'files', req.file.filename),
        name: req.file.originalname,
      });
    });
  }
);

export default router;
