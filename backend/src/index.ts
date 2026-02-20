import { app, logger } from './app';
import { config } from './infrastructure/config';
import { connectToDatabase } from './infrastructure/database';

const start = async () => {
    try {
        // Initiate database connection silently without strictly blocking the port binding
        connectToDatabase().catch(err => logger.error({ err }, 'Failed to start DB'));

        app.listen(config.PORT, () => {
            logger.info(`Server running at http://localhost:${config.PORT}`);
        });
    } catch (error) {
        logger.error({ err: error }, 'Failed to start server');
        process.exit(1);
    }
};

start();
