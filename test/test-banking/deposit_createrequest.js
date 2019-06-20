import {expect} from 'chai';
import {register} from '../../src/methods/register';
import {checkError404} from '../../src/responseChecker';

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
        checkError404(data, 'Запрос депозита не найден');
    });
});
