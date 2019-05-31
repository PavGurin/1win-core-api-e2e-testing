import {expect} from 'chai';
import {userList} from '../../src/userList';

describe('Create deposite', () => {

    it('RUB - paymentType = card_rub and wallet = null', async () => {
        userList.login_without_money();
        const {data} = await socket.send('BANKING:deposit-create', {

            amount: 100,
            wallet: '',
            paymentType: 'card_rub',
            currency: 'RUB'
        });
        console.log(data);
        expect(data.message).to.equal(undefined);
    });

    it('RUB - paymentType = tele2_rub and wallet != null', async () => {
        userList.login_without_money();
        const {data} = await socket.send('BANKING:deposit-create', {

            amount: 100,
            wallet: '89545654565',
            paymentType: 'tele2_rub',
            currency: 'RUB'
        });
        console.log(data);
        expect(data.message).to.equal(undefined);
    });

    it('RUB - paymentType = tele2_rub and wallet = null', async () => {
        userList.login_without_money();
        const {data} = await socket.send('BANKING:deposit-create', {

            amount: 100,
            wallet: '',
            paymentType: 'tele2_rub',
            currency: 'RUB'
        });
        console.log(data);
        expect(data).to.deep.include({status: 400});
        expect(data).to.deep.include({message: 'Неверный формат кошелька'});
    });

    it('USD - paymentType = card_rub and wallet = null', async () => {
        userList.login_without_money();
        const {data} = await socket.send('BANKING:deposit-create', {

            amount: 100,
            wallet: '',
            paymentType: 'card_rub',
            currency: 'USD'
        });
        console.log(data);
        expect(data.message).to.equal(undefined);
    });

    it('Must not pass', async () => {
        userList.login_without_money();
        const {data} = await socket.send('BANKING:deposit-create', {
            amount: 10,
            wallet: '',
            paymentType: 'card_rub',
            currency: 'USD'
        });

        console.log(data);
        expect(data.message).to.equal(undefined);
    });

});
