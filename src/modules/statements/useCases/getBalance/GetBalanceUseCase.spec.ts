import { User } from "../../../users/entities/User";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";

let user: User;
let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
}

describe('Create Statement test cases', () => {
    beforeAll(async () => {
        usersRepository = new InMemoryUsersRepository();
        statementsRepository = new InMemoryStatementsRepository();
        getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository);

        user = await usersRepository.create({
            name: 'Fulano da Silva',
            email: 'fulano.silva@gmail.com',
            password: '1234',
        });
    });
    
    it('should be able to see the user balance', async () => {
        const deposit = await statementsRepository.create({
            user_id: user.id as string,
            type: 'deposit' as OperationType,
            amount: 1000,
            description: 'Depósito',
        });

        const withdraw = await statementsRepository.create({
            user_id: user.id as string,
            type: 'withdraw' as OperationType,
            amount: 450,
            description: 'Saque',
        });
        
        const balance = await getBalanceUseCase.execute({ user_id: user.id as string });

        expect(balance.statement.length).toEqual(2);
        expect(balance.balance).toEqual(deposit.amount - withdraw.amount);
    });
});