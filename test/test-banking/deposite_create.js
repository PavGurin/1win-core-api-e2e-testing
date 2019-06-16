import {expect} from 'chai';
import {userList} from '../../src/userList';
import {register} from "../../src/register";

describe('Create deposite', () => {

    function checkErrorMsg(data, expMessage) {
        expect(data.status).equal(400);
        expect(data.message).equal(expMessage);
    }

    it('C19384 RUB - paymentType = card_rub and wallet = empty', async () => {
        await register.one_click_reg();
        const {data} = await socket.send('BANKING:deposit-create', {

            amount: 100,
            wallet: '',
            paymentType: 'card_rub',
            currency: 'RUB'
        });
        // console.log(data);
        expect(data.currency).to.equal('RUB');
    });

    it('C19382 RUB - paymentType = tele2_rub and wallet != null', async () => {
        await register.one_click_reg();
        const {data} = await socket.send('BANKING:deposit-create', {

            amount: 100,
            wallet: '89545654565',
            paymentType: 'tele2_rub',
            currency: 'RUB'
        });
        // console.log(data);
        expect(data.currency).to.equal('RUB');
    });

    it('C19383 RUB - paymentType = tele2_rub and wallet = null', async () => {
        await register.one_click_reg();
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

    it('C19385 USD - paymentType = card_rub and wallet = null', async () => {
        await register.one_click_reg();
        const {data} = await socket.send('BANKING:deposit-create', {

            amount: 100,
            wallet: '',
            paymentType: 'card_rub',
            currency: 'USD'
        });
        // console.log(data);
        expect(data.currency).to.equal('USD');
    });

    it('C19386 Must not pass', async () => {
        await register.one_click_reg();
        const {data} = await socket.send('BANKING:deposit-create', {
            amount: 10,
            wallet: '',
            paymentType: 'card_rub',
            currency: 'USD'
        });
        // console.log(data);
        expect(data.message).to.equal(undefined);
    });

    it('C19387 (-) RUB - paymentType = card_rub and amount = null', async () => {
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
        expect(data.message).equal('Bad request, amount is invalid');
    });

    it('C19390 (-) RUB - paymentType = card_rub and currency = null', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:deposit-create', {

            amount: '100',
            wallet: null,
            paymentType: 'card_rub',
            //currency: 'RUB'
        });
        // console.log(data);
        expect(data.currency).to.equal('RUB');
    });

    it('C19391 (-) RUB - paymentType = card_rub and wallet != null', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:deposit-create', {

            amount: '100',
            wallet: 'порпорпорпэ',
            paymentType: 'card_rub',
            //currency: 'RUB'
        });
        expect(data.currency).to.equal('RUB');
    });
});
