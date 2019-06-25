import {expect} from 'chai';
import {userList} from '../../src/methods/userList';
import {register} from '../../src/methods/register';

describe('Create deposite', () => {

    function checkErrorMsg(data, expMessage) {
        expect(data.status).equal(400);
        expect(data.message).equal(expMessage);
    }

    it('C22616 - RUB - paymentType = card_rub and wallet = empty', async () => {
        await register.one_click_reg();
        const {data} = await socket.send('BANKING:deposit-create', {

            amount: 100,
            wallet: '',
            paymentType: 'card_rub',
            currency: 'RUB'
        });
        //console.log(data);
        expect(data.currency).to.equal('RUB');
    });
    //TODO нужна тестовая симкарта теле2
    it.skip(' RUB - paymentType = tele2_rub and wallet != null @master', async () => {
        await register.one_click_reg();
        const {data} = await socket.send('BANKING:deposit-create', {

            amount: 100,
            wallet: '89772520000',
            paymentType: 'tele2_rub',
            currency: 'RUB'
        });
        //console.log(data);
        expect(data.currency).to.equal('RUB');
    });

    it(' RUB - paymentType = tele2_rub and wallet = null', async () => {
        await register.one_click_reg();
        const {data} = await socket.send('BANKING:deposit-create', {

            amount: 100,
            wallet: '',
            paymentType: 'tele2_rub',
            currency: 'RUB'
        });
        console.log(data);
        checkErrorMsg(data, 'Неверный формат кошелька');
    });

    it(' USD - paymentType = card_rub and wallet = null', async () => {
        await register.one_click_reg();
        const {data} = await socket.send('BANKING:deposit-create', {

            amount: 100,
            wallet: '',
            paymentType: 'card_rub',
            currency: 'USD'
        });
        //console.log(data);
        expect(data.currency).to.equal('USD');
    });

    it(' Must not pass', async () => {
        await register.one_click_reg();
        const {data} = await socket.send('BANKING:deposit-create', {
            amount: 10,
            wallet: '',
            paymentType: 'card_rub',
            currency: 'USD'
        });
        //console.log(data);
        expect(data.message).to.equal(undefined);
    });

    it(' (-) RUB - paymentType = card_rub and amount = null', async () => {
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

    it(' (-) RUB - paymentType = card_rub and wallet = null', async () => {
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

    it(' (-) RUB - paymentType = card_rub and wallet = null', async () => {
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

    it(' (+) RUB - paymentType = card_rub and currency = null', async () => {
        await userList.login_with_real_money();
        const {data} = await socket.send('BANKING:deposit-create', {

            amount: '100',
            wallet: '00001111222223333',
            paymentType: 'card_rub',
            //currency: 'RUB'
        });
        //console.log(data);
        expect(data.apiResponse.error).equal(false);
        expect(data.currency).equal('RUB');
        expect(data.user_id).not.equal(null);
        expect(data.paymentType).equal('card_rub');
        expect(data.amount).equal(100);
    });

    it(' (+) RUB - paymentType = card_rub and currency = null', async () => {
        await userList.login_with_real_money();
        const {data} = await socket.send('BANKING:deposit-create', {

            amount: '100',
            wallet: '',
            paymentType: 'card_rub',
            //currency: 'RUB'
        });
        //console.log(data);
        expect(data.apiResponse.error).equal(false);
        expect(data.currency).equal('RUB');
        expect(data.user_id).not.equal(null);
        expect(data.paymentType).equal('card_rub');
        expect(data.amount).equal(100);

    });

    it(' (+) RUB - paymentType = card_rub and wallet != null', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:deposit-create', {

            amount: '100',
            wallet: 'порпорпорпэ',
            paymentType: 'card_rub'
            //currency: 'RUB'
        });
        //console.log(data);
        console.log(data);
        expect(data.apiResponse.error).equal(false);
        expect(data.currency).equal('RUB');
        expect(data.user_id).not.equal(null);
        expect(data.paymentType).equal('card_rub');
        expect(data.amount).equal(100);
    });
});
