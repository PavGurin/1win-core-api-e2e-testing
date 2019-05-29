import {expect} from 'chai';
import {userList} from '../../src/userList';

describe('transfer', () => {

    it('Without money , not enough amount + RUB', async () => {
        await userList.login_without_money();
        const {data} = await socket.send('BANKING:transfer-create', {
                targetEmail: 'test_transfer@mailinator.com',
                amount: 1,
                currency: 'RUB'
            }
        );
        console.log(data);
        expect(data).to.deep.include({status: 403});
        expect(data).to.deep.include({message: 'Недостаточно средств'});
    });

    it('Without money , not enough amount + USD', async () => {
        await userList.login_without_money();
        const {data} = await socket.send('BANKING:transfer-create', {
                targetEmail: 'test_transfer@mailinator.com',
                amount: 1,
                currency: 'USD'
            }
        );
        expect(data).to.deep.include({status: 403});
        expect(data).to.deep.include({message: 'Недостаточно средств'});
    });

    it('Without money , enough amount + USD', async () => {
        await userList.login_without_money();
        const {data} = await socket.send('BANKING:transfer-create', {
                targetEmail: 'test_transfer@mailinator.com',
                amount: 100,
                currency: 'USD'
            }
        );
        console.log(data);
        expect(data).to.deep.include({status: 403});
        expect(data).to.deep.include({message: 'Недостаточно средств'});
    });

    it('Without money , enough amount + RUB', async () => {
        await userList.login_without_money();
        const {data} = await socket.send('BANKING:transfer-create', {
                targetEmail: 'test_transfer@mailinator.com',
                amount: 100,
                currency: 'RUB'
            }
        );
        console.log(data);
        expect(data).to.deep.include({status: 403});
        expect(data).to.deep.include({message: 'Недостаточно средств'});
    });

    it('With money', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:transfer-create', {
                targetEmail: 'test_transfer@mailinator.com',
                amount: 100,
                currency: 'RUB'
            }
        );
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it('With money + USD, amount = 1 USD', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:transfer-create', {
                targetEmail: 'test_transfer@mailinator.com',
                amount: 1,
                currency: 'USD'
            }
        );
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it('With money + USD, amount = 2 USD', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:transfer-create', {
                targetEmail: 'test_transfer@mailinator.com',
                amount: 2,
                currency: 'USD'
            }
        );
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it('With money + USD, currency = null', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:transfer-create', {
                targetEmail: 'test_transfer@mailinator.com',
                amount: 2
            }
        );
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it('With money + USD, currency = null and amount > 1000', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:transfer-create', {
                targetEmail: 'test_transfer@mailinator.com',
                amount: 1999
            }
        );
        console.log(data);
        expect(data.message).equal(undefined);
    });
});
