import { CreateUserUseCase } from "./CreateUserUseCase";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";

let usersRepository: IUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe('User creation test cases', () => {
    beforeAll(() => {
        usersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(usersRepository);
    });

    it('should create a new user', async () => {
        const user = await createUserUseCase.execute({
           email: 'fulano@gmail.com',
           name: 'Fulano',
           password: '1234'
        });

        expect(user).toHaveProperty('id');
    });
});