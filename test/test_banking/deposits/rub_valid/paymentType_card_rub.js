import {expect} from 'chai';
import {userList} from '../../src/methods/userList';
import {register} from '../../src/methods/register';

describe('Create deposite - RUB @master', () => {

    it('C19384 (+) card_rub and wallet = empty', async () => {
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

    it('C19390 (+) card_rub and without currency', async () => {
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

    it('C22187 (+) card_rub and without currency + wallet empty', async () => {
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

    it('C19391 (+) card_rub and wallet = russian symbols', async () => {
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

    it(' (+) card_rub and wallet = russian symbols and amount 100.01', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:deposit-create', {

            amount: '100.01',
            wallet: '123 autotests',
            paymentType: 'card_rub',
            currency: 'RUB'
        });
        //console.log(data);
        console.log(data);
        expect(data.apiResponse.error).equal(false);
        expect(data.currency).equal('RUB');
        expect(data.user_id).not.equal(null);
        expect(data.paymentType).equal('card_rub');
        expect(data.amount).equal(100.01);
    });

    it('C19391 card_rub and wallet != russian symbols', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:deposit-create', {

            amount: '2000',
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
        expect(data.amount).equal(2000);
    });

    it('C19391 card_rub and min amount', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:deposit-create', {

            amount: '10',
            wallet: '123234345456etryrt',
            paymentType: 'card_rub'
            //currency: 'RUB'
        });
        //console.log(data);
        console.log(data);
        expect(data.apiResponse.error).equal(false);
        expect(data.currency).equal('RUB');
        expect(data.user_id).not.equal(null);
        expect(data.paymentType).equal('card_rub');
        expect(data.amount).equal(10);
    });

    it('C19391 card_rub and max amount', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:deposit-create', {

            amount: '100000',
            wallet: '09090909999',
            paymentType: 'card_rub'
            //currency: 'RUB'
        });
        //console.log(data);
        console.log(data);
        expect(data.apiResponse.error).equal(false);
        expect(data.currency).equal('RUB');
        expect(data.user_id).not.equal(null);
        expect(data.paymentType).equal('card_rub');
        expect(data.amount).equal(2000);
    });
});
