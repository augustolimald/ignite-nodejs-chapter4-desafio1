import { User } from "../../entities/User";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";

let user: User;
let usersRepository: IUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe('User authentication test cases', () => {
    beforeAll(async () => {
        usersRepository = new InMemoryUsersRepository();
        user = await usersRepository.create({
            email: 'fulano@gmail.com',
            name: 'Fulano',
            password: '1234',
        });

        showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
    });

    it('should be able to see a user profile', async () => {
        const response = await showUserProfileUseCase.execute(user.id as string);

        expect(response).toHaveProperty('name');
    });

    it('should not be able to see a non existent user profile', async () => {
        expect(async () => {
            await showUserProfileUseCase.execute('-1');
        }).rejects.toBeInstanceOf(ShowUserProfileError);
    });
});