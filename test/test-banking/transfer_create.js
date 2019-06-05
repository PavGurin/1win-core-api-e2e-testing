import {expect} from 'chai';
import {userList} from '../../src/userList';

describe('Transfer', () => {

    it('C19367 (-) Without money , not enough amount + RUB', async () => {
        await userList.login_without_money();
        const {data} = await socket.send('BANKING:transfer-create', {
                targetEmail: 'test_transfer@mailinator.com',
                amount: 1,
                currency: 'RUB'
            }
        );
        // console.log(data);
        expect(data.status).equal(403);
        expect(data.message).equal('Недостаточно средств');
    });

    it('C19368 Without money , not enough amount + USD', async () => {
        await userList.login_without_money();
        const {data} = await socket.send('BANKING:transfer-create', {
                targetEmail: 'test_transfer@mailinator.com',
                amount: 1,
                currency: 'USD'
            }
        );
        expect(data.status).equal(403);
        expect(data.message).equal('Недостаточно средств');
    });

    it('C19369 (-) Without money , enough amount + USD', async () => {
        await userList.login_without_money();
        const {data} = await socket.send('BANKING:transfer-create', {
                targetEmail: 'test_transfer@mailinator.com',
                amount: 100,
                currency: 'USD'
            }
        );
        // console.log(data);
        expect(data.status).equal(403);
        expect(data.message).equal('Недостаточно средств');
    });

    it('C19370 (-) Without money , enough amount + RUB', async () => {
        await userList.login_without_money();
        const {data} = await socket.send('BANKING:transfer-create', {
                targetEmail: 'test_transfer@mailinator.com',
                amount: 100,
                currency: 'RUB'
            }
        );
        // console.log(data);
        expect(data.status).equal(403);
        expect(data.message).equal('Недостаточно средств');
    });

    it('C19371 (+) With money', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:transfer-create', {
                targetEmail: 'test_transfer@mailinator.com',
                amount: 100,
                currency: 'RUB'
            }
        );
        // console.log(data);
        expect(data.message).equal(undefined);
    });

    it('C19372 (+) With money + USD, amount = 1 USD', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:transfer-create', {
                targetEmail: 'test_transfer@mailinator.com',
                amount: 1,
                currency: 'USD'
            }
        );
        // console.log(data);
        expect(data.message).equal(undefined);
    });

    it('C19373 (+) With money + USD, amount = 2 USD', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:transfer-create', {
                targetEmail: 'test_transfer@mailinator.com',
                amount: 2,
                currency: 'USD'
            }
        );
        // console.log(data);
        expect(data.message).equal(undefined);
    });

    it('C19374 (+) With money + USD, currency = null', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:transfer-create', {
                targetEmail: 'test_transfer@mailinator.com',
                amount: 2
            }
        );
        // console.log(data);
        expect(data.message).equal(undefined);
    });

    it('C19375 (+) With money, currency = null and amount > 1000', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:transfer-create', {
                targetEmail: 'test_transfer@mailinator.com',
            amount: 1999000
            }
        );
        // console.log(data);
        expect(data.message).equal("Недостаточно средств");
    });
});
