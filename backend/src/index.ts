import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pino from 'pino';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const logger = pino({
    transport: {
        target: 'pino-pretty'
    }
});

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
    logger.info(`Server running at http://localhost:${port}`);
});
