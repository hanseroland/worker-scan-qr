import dotenv from "dotenv";
dotenv.config();

const required = ["JWT_SECRET", "JWT_REFRESH_SECRET"];
required.forEach((key) => {
    if (!process.env[key])
        throw new Error(`Missing required env variable: ${key}`);
});

export const config = {
    app: {
        port: process.env.PORT || 5000,
        env: process.env.NODE_ENV || 'development',
        apiUrl: process.env.API_URL || "/api/v1",
        corsOriginLocal:
            process.env.CORS_ORIGIN_LOCAL ||
            "http://localhost:3000,http://localhost:5000,http://127.0.0.1:3000,http://127.0.0.1:5000",
        corsOriginProd:
            process.env.CORS_ORIGIN_PROD ||
            "https://your-production-domain.com",
    },
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        name: process.env.DB_NAME || 'worker_scan_qr'
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'secret',
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
    },
    email: {
        host: process.env.EMAIL_HOST || "smtp.example.com",
        port: process.env.EMAIL_PORT || 587,
        secure: process.env.EMAIL_SECURE === "true",
        user: process.env.EMAIL_USER || "<EMAIL>",
        pass: process.env.EMAIL_PASS || "email_password",
    },
    qrcode: {
        rotationInterval: Number(process.env.QR_ROTATION_INTERVAL) || 30
    }
}