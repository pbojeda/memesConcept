import { app, logger } from './app';
import { config } from './infrastructure/config';
import { connectToDatabase, disconnectFromDatabase } from './infrastructure/database';

const start = async () => {
    try {
        // Initiate database connection silently without strictly blocking the port binding
        connectToDatabase().catch(err => logger.error({ err }, 'Failed to start DB'));

        const server = app.listen(config.PORT, () => {
            logger.info(`Server running at http://localhost:${config.PORT}`);
        });

        // Graceful shutdown handling
        const gracefulShutdown = async (signal: string) => {
            logger.info({ signal }, `Received signal to terminate: closing HTTP server...`);
            server.close(async () => {
                logger.info('HTTP server closed.');
                try {
                    await disconnectFromDatabase();
                    logger.info('MongoDB connection closed.');
                    process.exit(0);
                } catch (err) {
                    logger.error({ err }, 'Error during database disconnection');
                    process.exit(1);
                }
            });

            // Force close after 10 seconds if not already closed
            setTimeout(() => {
                logger.error('Could not close connections in time, forcefully shutting down');
                process.exit(1);
            }, 10000).unref();
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    } catch (error) {
        logger.error({ err: error }, 'Failed to start server');
        process.exit(1);
    }
};

start();
