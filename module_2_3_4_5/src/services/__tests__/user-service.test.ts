import { UserService } from '../user';
import { IAccessorToUserData } from '../../data-access/user';
import { User } from '../../types/user';

const createTestUser = (data?: Partial<User>): User => ({
    id: '32',
    login: 'login',
    password: 'strongPass',
    age: 12,
    isDeleted: false,

    ...data
});

const accessor: IAccessorToUserData<User> = {
    async getById(id: string) {
        return createTestUser({ id });
    },
    async getSomeBySubstring(regexpString: string) {
        return [createTestUser({ login: regexpString })];
    },
    async createOrUpdate(entity: User) {
        return createTestUser(entity);
    }
};

describe('removeSoftly', () => {
    it('should return true if userv successfully soft removed', async () => {
        const userService = new UserService(accessor);

        const actual = await userService.removeSoftly('123');

        expect(actual).toBe(true);
    });

    it('should throw an error if user was not found', async () => {
        const userService = new UserService({ ...accessor, getById: async () => null });

        await expect(userService.removeSoftly('123')).rejects.toEqual(new Error('User not found!'));
    });

    it('should throw an error if something happened while updating user', async () => {
        const userService = new UserService({ ...accessor, createOrUpdate: async () => null });

        await expect(userService.removeSoftly('123')).rejects.toEqual(new Error('Error while updating!'));
    });
});

describe('search', () => {
    it('should find users by substring of login', async () => {
        const userService = new UserService(accessor);

        const actual = await userService.search('login', 1);

        expect(actual[0].login).toEqual('login');
    });
});

describe('checkUserCredentials', () => {
    it('should return user, if login and password correct', async () => {
        const userLogin = 'loginnn';
        const userPassword = 'sttrongpass';

        const userService = new UserService({
            ...accessor,
            getSomeBySubstring: async () => ([createTestUser({
                login: userLogin, password: userPassword
            })])
        });

        const actual = await userService.checkUserCredentials(userLogin, userPassword);

        expect(actual).toMatchObject({ login: userLogin, password: userPassword });
    });

    it('should return `null` password did not match', async () => {
        const userLogin = 'Aleksandr';

        const userService = new UserService({
            ...accessor,
            getSomeBySubstring: async () => ([createTestUser({
                login: userLogin,
                password: 'random'
            })])
        });

        const actual = await userService.checkUserCredentials(userLogin, 'differntFromGiven');

        expect(actual).toBeNull();
    });
});
