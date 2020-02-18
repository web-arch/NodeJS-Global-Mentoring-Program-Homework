import express from 'express';
import { createUserRouter } from './routers/user';
import { UserService } from './services/user';
import { db } from './db-init';
import { AccessorToUserData } from './data-access/user';

const app = express();

app.listen(8080);
app.use(express.json());

const accessorToUserData = new AccessorToUserData();
const userService = new UserService(accessorToUserData);

app.use('/', createUserRouter(userService));

async function trySql() {
    try {
        await db.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

trySql();
