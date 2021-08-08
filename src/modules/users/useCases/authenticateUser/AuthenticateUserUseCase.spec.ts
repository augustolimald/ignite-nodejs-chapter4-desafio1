import { User } from "../../entities/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let user: User;
let usersRepository: IUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe('User authentication test cases', () => {
    beforeAll(async () => {
        usersRepository = new InMemoryUsersRepository();
        user = await usersRepository.create({
            email: 'fulano@gmail.com',
            name: 'Fulano',
            password: '1234',
        });

        authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
    });

    it('should be able to login with email and password', async () => {
        const response = await authenticateUserUseCase.execute({
            email: 'fulano@gmail.com',
            password: '1234',
        });

        expect(response).toHaveProperty('token');
    });

    it('should not be able to login with incorret email or password', async () => {
        expect(async () => {
            await authenticateUserUseCase.execute({
                email: 'fulanooooo@gmail.com',
                password: '1234',
            })
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);

        expect(async () => {
            await authenticateUserUseCase.execute({
                email: 'fulano@gmail.com',
                password: '12345',
            })
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });
});