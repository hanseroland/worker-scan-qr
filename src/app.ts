// src/app.ts
import express, { Application } from 'express';
import { createRoutes } from '@interfaces/http/routes'
import { controllers, jwtTokenService } from 'container';

const app: Application = express();

app.use(express.json());
app.use('/api/v1/', createRoutes(controllers, jwtTokenService))


export default app;
