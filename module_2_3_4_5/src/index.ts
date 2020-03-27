import express from 'express';
import expressWinston from 'express-winston';
import { logger } from './utils/logger';
import { initializeDB } from './db-init';

import { createUserRouter } from './routers/user';
import { UserService } from './services/user';
import { AccessorToUserData } from './data-access/user';

import { createGroupRouter } from './routers/group';
import { GroupService } from './services/group';
import { AccessorToGroupData } from './data-access/group';

import errorHandlingMiddleware from './middlewares/errorHandlingMiddlware';

const app = express();

app.use(express.json());

const db = initializeDB();

const accessorToUserData = new AccessorToUserData();
const userService = new UserService(accessorToUserData);

const accessorToGroupData = new AccessorToGroupData();
const groupService = new GroupService(accessorToGroupData);

app.use(
    '/',
    expressWinston.logger({ winstonInstance: logger }),
    createUserRouter(userService),
    createGroupRouter(groupService)
);

app.use(
    errorHandlingMiddleware
);

const server = app.listen(8080);

process.on('uncaughtException', async (error) => {
    try {
        await new Promise((resolve) => {
            logger.error('uncaughtException', error);
            logger.on('end', resolve);
        });

        if (server) {
            await new Promise(server.close.bind(server));
            console.log('Server closed!');
        }
        if (db) {
            await db.closeConnection();
            console.log('Database connection is closed!');
        }
    } finally {
        process.exit(1);
    }
});

process.on('unhandledRejection', (error) => {
    if (error) {
        logger.error('unhandledRejection', error);
    }
});
