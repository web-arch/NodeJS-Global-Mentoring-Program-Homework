import { User } from './user-scheme';

const USERS: User[] = [
    {
        id: '0',
        login: 'user1',
        password: '12345',
        age: 12,
        isDeleted: false
    },
    {
        id: '1',
        login: 'user2',
        password: 'password',
        age: 16,
        isDeleted: false
    },
    {
        id: '2',
        login: 'MegaKillerSuperShot',
        password: 'qwerty',
        age: 10,
        isDeleted: false
    },
    {
        id: '3',
        login: 'Bogdan',
        password: '192837',
        age: 26,
        isDeleted: false
    }
];

function getUserById(id: string): User | null {
    return USERS.find(user => user.id === id) || null;
}

function createOrUpdateUser(user: User): User {
    const dbUserIndex = USERS.findIndex(dbUser => dbUser.id === user.id);

    if (dbUserIndex === -1) {
        USERS.push(user);
        
    } else {
        USERS[dbUserIndex] = user;
    }

    return user;
}

function getAutoSuggestUsers(loginSubstringin: string, limit: number): User[] {
    const suggestedUsers: User[] = [];

    for (const user of USERS) {
        if (user.login.indexOf(loginSubstringin) !== -1) {
            suggestedUsers.push(user);
        }

        if (suggestedUsers.length >= limit) {
            break;
        }
    }

    return suggestedUsers;
}

function removeUserSoftly(id: string) {
    const dbUserIndex = USERS.findIndex(dbUser => dbUser.id === id);

    if (dbUserIndex !== -1) {
        USERS[dbUserIndex].isDeleted = true;
    }
}

export default {
    getUserById,
    createOrUpdateUser,
    removeUserSoftly,
    getAutoSuggestUsers
};
