import {register} from '../../../../../src/methods/register';
import {banking} from "../../../../../src/methods/banking";
import {succses_deposit_create} from "../../../../../src/expects/expect_banking";
import {checkErrMsg} from "../../../../../src/responseChecker";

const paymentType = 'mts_rub';
const currency = 'RUB';

describe('Create deposite for mts_rub - RUB @master', () => {

    beforeEach(async () => {
        await register.one_click_reg();
    });

    it('C22568 - (+) amount = 100 & wallet = (+7)phone', async () => {
        const {data} = await banking.deposite_create_rub(
            100, '+79001234567', paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency,
            paymentType, 100)
    });

    it('C22569 - (+) amount = 100.01 & wallet = (7)phone', async () => {
        const {data} = await banking.deposite_create_rub(
            100.01, '79001234567', paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency,
            paymentType, 100.01)
    });

    it('C22570 - amount = 2000 & wallet = (8)phone', async () => {
        const {data} = await banking.deposite_create_rub(
            2000, '89001234567', paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency,
            paymentType, 2000)
    });

    it('C22571 - min amount & wallet = symbols', async () => {
        const {data} = await banking.deposite_create_rub(10,
            '+79001234567', paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency,
            paymentType, 10)
    });

    it('C22572 - > min amount & wallet = symbols', async () => {
        const {data} = await banking.deposite_create_rub(11,
            '+79001234567', paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency,
            paymentType, 11)
    });

    it('C22573 - max amount & wallet = numbers', async () => {
        const {data} = await banking.deposite_create_rub(14999,
            '+79001234567', paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency,
            paymentType, 14999)
    });

    it('C22574 - < max amount & wallet = numbers', async () => {
        const {data} = await banking.deposite_create_rub(14998, '+79001234567',
            paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency,
            paymentType, 14998)
    });

    it('C22575 - without currency', async () => {
        const {data} = await socket.send('BANKING:deposit-create', {
            amount: '100',
            wallet: '+79001234567',
            paymentType: paymentType,
        });
        //console.log(data);
        succses_deposit_create(data, currency,
            paymentType, 100)
    });

    it('C22576 - < max amount & wallet = valid short number', async () => {
        //TODO узнать валидный короткий номер городского телефона
        const {data} = await banking.deposite_create_rub(14997, '+79001234',
            paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency,
            paymentType, 14997)
    });
});

describe('Create deposite for mts_rub invalid - RUB', () => {

    it('C22577 - amount = 0', async () => {

        const {data} = await banking.deposite_create_rub(0, '+79001234567',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(data, 400, 'Bad request, amount is invalid')
    });

    it('C22578 - amount = null', async () => {

        const {data} = await banking.deposite_create_rub(null, '+79001234567',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(data, 400, 'Bad request, amount is required, no default value provided')
    });

    it('C22579 - amount = empty', async () => {

        const {data} = await banking.deposite_create_rub(' ', '+79001234567',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(data, 400, 'Bad request, amount should have a type of number, but found string')
    });

    it('C22580 - amount = undefined', async () => {

        const {data} = await banking.deposite_create_rub(undefined, '+79001234567',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(data, 400, 'Bad request, amount is required, no default value provided')
    });

    it('C22581 - amount = string', async () => {

        const {data} = await banking.deposite_create_rub('fjfj', '+79001234567',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(data, 400, 'Bad request, amount should have a type of number, but found string')
    });

    it('C22582 amount = string-number', async () => {

        const {data} = await banking.deposite_create_rub('50', '+79001234567',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(data, 400, 'Неверная сумма')
    });

    it('C22583 amount double < min amount', async () => {

        const {data} = await banking.deposite_create_rub(0.6, '+79001234567',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(data, 400, 'Bad request, amount is invalid')
    });

    it('C22584 - amount < min amount', async () => {

        const {data} = await banking.deposite_create_rub(9, '+79001234567',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(data, 400, 'Неверная сумма')
    });

    it('C22585 - amount > max amount', async () => {

        const {data} = await banking.deposite_create_rub(15000, '+79001234567',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(data, 400, 'Неверная сумма')
    });

    it('C22586 - amount double> max amount', async () => {

        const {data} = await banking.deposite_create_rub(14999.000001, '+79001234567',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(data, 400, 'Неверная сумма')
    });

    it('C22587 - wallet = undefined', async () => {
        const {data} = await banking.deposite_create_rub(100, undefined,
            paymentType, currency);
        //console.log(data);
        checkErrMsg(data, 400, 'Неверный формат кошелька')
    });

    it('C22588 - wallet = null', async () => {

        const {data} = await banking.deposite_create_rub(100, null,
            paymentType, currency);
        //console.log(data);
        checkErrMsg(data, 400, 'Неверный формат кошелька')
    });

    //Не знаю что тут должно быть
    it('C22589 - incorrect paymentType = mts_rub_test', async () => {
        const {data} = await banking.deposite_create_rub(100,
            //TODO посмотреть количество символов доступных в кошельке
            '+79001234567',
            'mts_rub_test', currency)
        //console.log(data);
        checkErrMsg(data, 400, '?????')
    });

    it('C22590 - wallet = empty', async () => {

        const {data} = await banking.deposite_create_rub(100, '',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(data, 400, 'Неверный формат кошелька')
    });

    it('C22591 - wallet = number', async () => {

        const {data} = await banking.deposite_create_rub(100, 111122223330000,
            paymentType, currency);
        //console.log(data);
        checkErrMsg(data, 400, 'Bad request, wallet should have a type of string, but found number')
    });

    it('C22592 - wallet = short phone', async () => {

        const {data} = await banking.deposite_create_rub(100, +7123,
            paymentType, currency);
        //console.log(data);
        checkErrMsg(data, 400, 'Bad request, wallet should have a type of string, but found number')
    });

    it('C22593 - wallet = long string', async () => {

        const {data} = await banking.deposite_create_rub(100,
            '+797798778987',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(data, 400, 'Неверный формат кошелька')
    });

});