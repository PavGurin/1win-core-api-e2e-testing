import {expect} from 'chai';
import {register} from '../../../src/methods/register';
import {checkErrMsg} from "../../../src/responseChecker";

const currency = 'RUB';
const paymentType = 'card_rub';

describe('Deposit requests', () => {
    //TODO больше проверок на PaymentType
    it('C19376 (-) create without currency @master', async () => {
        await register.one_click_reg();
        const {data} = await socket.send('BANKING:deposit-create-request', {
            amount: 100,
            wallet: '',
            paymentType: paymentType,
        });
        console.log(data);
        expect(data.redirectUrl).not.equal(null);
        expect(data.message).equal(undefined);
    });

    it(' (+) create with currency @master', async () => {
        await register.one_click_reg();
        const {data} = await socket.send('BANKING:deposit-create-request', {
            amount: 100,
            wallet: '',
            paymentType: paymentType,
            currency: currency
        });
        console.log(data);
        expect(data.redirectUrl).not.equal(null);
        expect(data.message).equal(undefined);
    });

    it('C19377 (-) with incorrect hash ', async () => {
        await register.one_click_reg();
        const {data} = await socket.send('BANKING:deposit-request', {h: 'gjhg'});
        // console.log(data);
        checkErrMsg(data, 404, 'Запрос депозита не найден')
    });
});
