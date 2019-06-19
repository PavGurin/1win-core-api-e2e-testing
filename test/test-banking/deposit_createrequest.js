import {expect} from 'chai';
import {register} from '../../src/methods/register';

describe('Deposit requests', () => {
    //TODO больше проверок на PaymentType
    it('C19376 (-) create without currency @master', async () => {
        await register.one_click_reg();
        const {data} = await socket.send('BANKING:deposit-create-request', {
            amount: 100,
            wallet: '',
            paymentType: 'card_rub'
        });
        // console.log(data);
        expect(data.redirectUrl).not.equal(null);
        expect(data.message).equal(undefined);
    });

    it(' (+) create with currency @master', async () => {
        await register.one_click_reg();
        const {data} = await socket.send('BANKING:deposit-create-request', {
            amount: 100,
            wallet: '',
            paymentType: 'card_rub',
            currency: 'RUB'
        });
        //console.log(data);
        expect(data.redirectUrl).not.equal(null);
        expect(data.message).equal(undefined);
    });

    it('C19377 (-) with incorrect hash ', async () => {
        await register.one_click_reg();
        const {data} = await socket.send('BANKING:deposit-request', {h: 'gjhg'});
        // console.log(data);
        expect(data.status).equal(404);
        expect(data.message).equal('Запрос депозита не найден');
    });
});
