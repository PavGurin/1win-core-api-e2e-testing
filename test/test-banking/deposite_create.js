import {expect} from 'chai';
import {userList} from '../../src/userList';

//TODO after fix change all skip tests to real check
describe('Create deposite', () => {

    function checkErrorMsg(data, expMessage) {
        expect(data.status).equal(400);
        expect(data.message).equal(expMessage);
    }

    it.skip('C19384 RUB - paymentType = card_rub and wallet = empty', async () => {
        await userList.login_without_money();
        const {data} = await socket.send('BANKING:deposit-create', {

            amount: 100,
            wallet: '',
            paymentType: 'card_rub',
            currency: 'RUB'
        });
        // console.log(data);
        expect(data.message).to.equal(undefined);
    });

    it.skip('C19382 RUB - paymentType = tele2_rub and wallet != null', async () => {
        await userList.login_without_money();
        const {data} = await socket.send('BANKING:deposit-create', {

            amount: 100,
            wallet: '89545654565',
            paymentType: 'tele2_rub',
            currency: 'RUB'
        });
        // console.log(data);
        expect(data.message).to.equal(undefined);
    });

    it('C19383 RUB - paymentType = tele2_rub and wallet = null', async () => {
        await userList.login_without_money();
        const {data} = await socket.send('BANKING:deposit-create', {

            amount: 100,
            wallet: '',
            paymentType: 'tele2_rub',
            currency: 'RUB'
        });
        // console.log(data);
        expect(data).to.deep.include({status: 400});
        expect(data).to.deep.include({message: 'Неверный формат кошелька'});
    });

    it.skip('C19385 USD - paymentType = card_rub and wallet = null', async () => {
        await userList.login_without_money();
        const {data} = await socket.send('BANKING:deposit-create', {

            amount: 100,
            wallet: '',
            paymentType: 'card_rub',
            currency: 'USD'
        });
        // console.log(data);
        expect(data.message).to.equal(undefined);
    });

    it.skip('C19386 Must not pass', async () => {
        await userList.login_without_money();
        const {data} = await socket.send('BANKING:deposit-create', {
            amount: 10,
            wallet: '',
            paymentType: 'card_rub',
            currency: 'USD'
        });
        // console.log(data);
        expect(data.message).to.equal(undefined);
    });

    it.skip('C19387 (-) RUB - paymentType = card_rub and amount = null', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:deposit-create', {

            amount: null,
            wallet: '',
            paymentType: 'card_rub',
            currency: 'RUB'
        });
        // console.log(data);
        checkErrorMsg(data, 'Bad request, amount is required, no default value provided');
    });

    it('C19388 (-) RUB - paymentType = card_rub and wallet = null', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:deposit-create', {

            amount: '1',
            wallet: null,
            paymentType: 'card_rub',
            currency: 'RUB'
        });
        // console.log(data);
        expect(data.status).equal(400);
        expect(data.message).equal('Неверная сумма');
    });

    it('C19389 (-) RUB - paymentType = card_rub and wallet = null', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:deposit-create', {

            amount: '0',
            wallet: null,
            paymentType: 'card_rub',
            currency: 'RUB'
        });
        // console.log(data);
        expect(data.status).equal(400);
        expect(data.message).equal('Неверная сумма');
    });

    it.skip('C19390 (-) RUB - paymentType = card_rub and currency = null', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:deposit-create', {

            amount: '100',
            wallet: null,
            paymentType: 'card_rub'
            //currency: 'RUB'
        });
        // console.log(data);
        expect(data.status).equal(200);
    });

    it.skip('C19391 (-) RUB - paymentType = card_rub and wallet != null', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:deposit-create', {

            amount: '100',
            wallet: 'порпорпорпэ',
            paymentType: 'card_rub'
            //currency: 'RUB'
        });
        // console.log(data);
        expect(data.status).equal(200);
    });
});
