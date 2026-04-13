import multer from 'multer'
import path from 'path'

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/')
  },
  filename: (req, file, cb) => {
    // Générer un nom unique : timestamp + extension originale
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  }
})

// Filtrer les types de fichiers
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accepter seulement les images
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type'))
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
})