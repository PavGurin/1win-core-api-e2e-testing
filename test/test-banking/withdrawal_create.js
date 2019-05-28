import {expect} from 'chai';
import {userList} from '../../src/userList';

describe('Withdrawal create with user without money ', () => {


    it('Without money', async () => {
        userList.login_without_money();
        const {data} = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            wallet: '5446546',
            payment_system: 'card_rub',
            currency: 'RUB'
        });
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it('Without money card_rub + valid wallet ', async () => {
        userList.login_without_money();
        const {data} = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            wallet: '0000111122223333',
            payment_system: 'card_rub',
            currency: 'RUB'
        });
        console.log(data);
        expect(data).to.deep.include({status: 403});
        expect(data).to.deep.include({message: 'Недостаточно средств'});
    });

    it('With money invalid', async () => {
        userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            wallet: '5446546',
            payment_system: 'card_rub',
            currency: 'RUB'
        });
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it('With money card_rub + valid wallet', async () => {
        userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            wallet: '0000111122223333',
            payment_system: 'card_rub',
            currency: 'RUB'
        });
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it('With money card_uah + valid wallet + RUB', async () => {
        userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            wallet: '0000111122223333',
            payment_system: 'card_uah',
            currency: 'RUB'
        });
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it('With money card_uah + valid wallet + USD', async () => {
        userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            wallet: '0000111122223333',
            payment_system: 'card_uah',
            currency: 'USD'
        });
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it('With money beeline_rub + valid wallet + RUB', async () => {
        userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            payment_system: 'beeline_rub',
            wallet: '+79215645654',
            currency: 'RUB'
        });
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it('With money beeline_rub + valid wallet + USD', async () => {
        userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            payment_system: 'beeline_rub',
            wallet: '+79215645656',
            currency: 'USD'
        });
        console.log(data);
        expect(data.message).equal(undefined);
    });

});
