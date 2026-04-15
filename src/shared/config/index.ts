import dotenv from 'dotenv';
dotenv.config();

interface Config {
  app: {
    companyName: string;
    port: number;
    env: string;
    cookieDomain: string;
    apiUrl: string;
    corsOriginLocal: string;
    corsOriginProd: string;
  };
  db: {
    host: string;
    port: number;
    user: string;
    password: string;
    name: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
  };
  email: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
  };
  qrcode: {
    rotationInterval: number;
    qr_secret: string;
  };
}

// Vérification stricte des variables critiques
const requiredEnvVars = ['JWT_SECRET', 'JWT_REFRESH_SECRET'];
requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(
      `[Config Error]: Missing required environment variable: ${key}`
    );
  }
});

export const config: Config = {
  app: {
    companyName: process.env.COMPANY_NAME || 'Worker Scan QR',
    port: Number(process.env.PORT) || 5000,
    env: process.env.NODE_ENV || 'development',
    cookieDomain: process.env.NODE_ENV === 'production' 
        ? '.domaine-final.com'
        : 'localhost',
    apiUrl: process.env.API_URL || '/api/v1',
    corsOriginLocal:
      process.env.CORS_ORIGIN_LOCAL ||
      'http://localhost:3000,http://localhost:5000',
    corsOriginProd:
      process.env.CORS_ORIGIN_PROD || 'https://your-production-domain.com',
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'worker_scan_qr',
  },
  jwt: {
    // Utilisation de l'assertion "as string" car on a vérifié l'existence plus haut
    secret: process.env.JWT_SECRET as string,
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET as string,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  email: {
    host: process.env.EMAIL_HOST || 'smtp.example.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
  },
  qrcode: {
    rotationInterval: Number(process.env.QR_ROTATION_INTERVAL) || 30,
    qr_secret: process.env.QR_SECRET || 'QrS3cr3tP@ssw0rd',
  },
};
