import { User } from "../../../users/entities/User";
import { Statement } from "../../entities/Statement";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";

let user: User;
let statement: Statement;
let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
}

describe('Create Statement test cases', () => {
    beforeAll(async () => {
        usersRepository = new InMemoryUsersRepository();
        statementsRepository = new InMemoryStatementsRepository();
        getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository, statementsRepository);

        user = await usersRepository.create({
            name: 'Fulano da Silva',
            email: 'fulano.silva@gmail.com',
            password: '1234',
        });

        statement = await statementsRepository.create({
            user_id: user.id as string,
            type: 'deposit' as OperationType,
            amount: 1000,
            description: 'Depósito',
        });
    });
    
    it('should be able to see a statement', async () => {
        const statementResult = await getStatementOperationUseCase.execute({
            user_id: user.id as string,
            statement_id: statement.id as string,
        });

        expect(statementResult).toEqual(statement);
    });
});