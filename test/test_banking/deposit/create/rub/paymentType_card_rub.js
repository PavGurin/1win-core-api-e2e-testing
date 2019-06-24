import {register} from '../../../../../src/methods/register';
import {banking} from "../../../../../src/methods/banking";
import {succses_deposit_create} from "../../../../../src/expects/expect_banking";
import {checkErrMsg} from "../../../../../src/responseChecker";

// beforeEach('Регистрация нового пользователя перед началом каждого теста', async () => {
//     const {user} = await register.one_click_reg();
//     }
// );
const paymentType = 'card_rub';
const currency = 'RUB';

describe('Create deposite for card_rub - RUB @master', () => {

    beforeEach(async () => {

    });

    it('C22535 - (+) amount = 100 & wallet = empty', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(
            100, '', paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency,
            paymentType, 100)
    });

    it('C22536 - (+) amount = 100.01 & wallet = symbols', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(
            100.01, '123 autotests', paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency,
            paymentType, 100.01)
    });

    it('C22537 - amount = 2000 & wallet = symbols', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(
            2000, 'порпорпорпэ', paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency,
            paymentType, 2000)
    });

    it('C22538 - min amount & wallet = symbols', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(10, '123234345456 etryrt',
            paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency,
            paymentType, 10)
    });

    it('C22539 - > min amount & wallet = symbols', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(11, '12№%:№%:45456etryrt',
            paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency,
            paymentType, 11)
    });

    it('C22540 - max amount & wallet = numbers', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(100000, '09090909999',
            paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency,
            paymentType, 100000)
    });

    it('C22541 - < max amount & wallet = numbers', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(99999, '0[[[?<><?999',
            paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency,
            paymentType, 99999)
    });

    //Не знаю, какой должен быть результат
    it('C22543 - wallet = undefined', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(100, undefined,
            paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency,
            paymentType, 100)
    });

    it('C22542 - without currency', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await socket.send('BANKING:deposit-create', {
            amount: '100',
            wallet: '00001111222223333',
            paymentType: paymentType,
        });
        //console.log(data);
        succses_deposit_create(data, currency,
            paymentType, 100)
    });
});

describe('Create deposite for card_rub invalid - RUB', () => {

    it('C22510 - amount = 0', async () => {

        const {data} = await banking.deposite_create_rub(0, '',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(data, 400, 'Bad request, amount is invalid')
    });

    it('C22511 - amount = null', async () => {

        const {data} = await banking.deposite_create_rub(null, '',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(data, 400, 'Bad request, amount is required, no default value provided')
    });

    it('C22512 - amount = empty', async () => {

        const {data} = await banking.deposite_create_rub(' ', '',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(data, 400, 'Bad request, amount should have a type of number, but found string')
    });

    it('C22513 - amount = undefined', async () => {

        const {data} = await banking.deposite_create_rub(undefined, '',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(data, 400, 'Bad request, amount is required, no default value provided')
    });

    it('C22514 - amount = string', async () => {

        const {data} = await banking.deposite_create_rub('fjfj', '',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(data, 400, 'Bad request, amount should have a type of number, but found string')
    });

    it('C22515 - amount = string - number', async () => {

        const {data} = await banking.deposite_create_rub('50', '',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(data, 400, 'Неверная сумма')
    });

    it('C22516 - amount double < min amount', async () => {

        const {data} = await banking.deposite_create_rub(0.6, '',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(data, 400, 'Неверная сумма')
    });

    it('C22517 - 1 < amount < min amount', async () => {

        const {data} = await banking.deposite_create_rub(9, '',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(data, 400, 'Неверная сумма')
    });

    it('C22518 - amount > max amount', async () => {

        const {data} = await banking.deposite_create_rub(100001, '',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(data, 400, 'Неверная сумма')
    });

    it('C22519 - amount doudle > max amount ', async () => {

        const {data} = await banking.deposite_create_rub(100000.56, '',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(data, 400, 'Неверная сумма')
    });

    it('C22521 - wallet = null', async () => {

        const {data} = await banking.deposite_create_rub(100, null,
            paymentType, currency);
        //console.log(data);
        checkErrMsg(data, 400, 'Неверный формат кошелька')
    });

    it('C22521 - wallet = long string', async () => {

        const {data} = await banking.deposite_create_rub(10,
            //TODO посмотреть количество символов доступных в кошельке
            '1231231231231231453453345345342312312312312123123123123',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(data, 400, 'Неверный формат кошелька')
    });

    //Не знаю что тут должно быть
    it('C22525 - incorrect paymentType = card_rub_test', async () => {

        const {data} = await banking.deposite_create_rub(10,
            //TODO посмотреть количество символов доступных в кошельке
            '3123123123',
            'card_rub_test', currency);
        //console.log(data);
        checkErrMsg(data, 400, '?????')
    });
});