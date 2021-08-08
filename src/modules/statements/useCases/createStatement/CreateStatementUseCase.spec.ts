import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let user: User;
let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
}

describe('Create Statement test cases', () => {
    beforeAll(async () => {
        usersRepository = new InMemoryUsersRepository();
        statementsRepository = new InMemoryStatementsRepository();
        createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);

        user = await usersRepository.create({
            name: 'Fulano da Silva',
            email: 'fulano.silva@gmail.com',
            password: '1234',
        });
    });
    
    it('should be able to add a deposit', async () => {
        const statement = await createStatementUseCase.execute({
            user_id: user.id as string,
            type: 'deposit' as OperationType,
            amount: 1000,
            description: 'Test case'
        });

        expect(statement).toHaveProperty('id');
    });

    it('should be able to add a withdraw with funds', async () => {
        await createStatementUseCase.execute({
            user_id: user.id as string,
            type: 'deposit' as OperationType,
            amount: 1000,
            description: 'Test case'
        });
        
        const statement = await createStatementUseCase.execute({
            user_id: user.id as string,
            type: 'withdraw' as OperationType,
            amount: 500,
            description: 'Test case'
        });

        expect(statement).toHaveProperty('id');
    });

    it('should not be able to add a withdraw without funds', async () => {
        expect(async () => {
            await createStatementUseCase.execute({
                user_id: user.id as string,
                type: 'withdraw' as OperationType,
                amount: 1000000,
                description: 'Test case'
            });
        }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
    });
});