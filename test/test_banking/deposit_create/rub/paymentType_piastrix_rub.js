import {register} from '../../../../src/methods/register';
import {banking} from "../../../../src/methods/banking";
import {succses_deposit_create} from "../../../../src/expects/expect_banking";
import {checkErrMsg} from "../../../../src/responseChecker";

// beforeEach('Регистрация нового пользователя перед началом каждого теста', async () => {
//     const {user} = await register.one_click_reg();
//     }
// );
const paymentType = 'piastrix_rub';
const currency = 'RUB';

describe('Create deposite for piastrix_rub - RUB @master', () => {

    it(' (+) amount = 100 & wallet = empty', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(
            100, '', paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency, user.id,
            paymentType, 100)
    });

    it(' (+) amount = 100.01 & wallet = symbols', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(
            100.01, '123 autotests', paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency, user.id,
            paymentType, 100.01)
    });

    it(' amount = 2000 & wallet = symbols', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(
            2000, 'порпорпорпэ', paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency, user.id,
            paymentType, 2000)
    });

    it(' min amount & wallet = symbols', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(1,
            '123234345456 etryrt', paymentType, currency);

        //console.log(data);
        succses_deposit_create(data, currency, user.id,
            paymentType, 1)
    });

    it('> min amount & wallet = symbols', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(2,
            '12№%:№%:45456etryrt', paymentType, currency);

        //console.log(data);
        succses_deposit_create(data, currency, user.id,
            paymentType, 2)
    });

    it(' max amount & wallet = numbers', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(100000, '09090909999',
            paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency, user.id,
            paymentType, 100000)
    });

    it('< max amount & wallet = numbers', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(99999, '0[[[?<><?999',
            paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency, user.id,
            paymentType, 99999)
    });

    //Не знаю, какой должен быть результат
    it(' wallet = undefined', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(100, undefined,
            paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency, user.id,
            paymentType, 100)
    });

    it(' without currency', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await socket.send('BANKING:deposit-create', {
            amount: '100',
            wallet: '00001111222223333',
            paymentType: paymentType,
        });
        //console.log(data);
        succses_deposit_create(data, currency, user.id,
            paymentType, 100)
    });
});

describe('Create deposite for piastrix_rub invalid - RUB', () => {

    it(' amount = 0', async () => {
        await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(0, '',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(400, 'Неверная сумма')
    });

    it(' amount = null', async () => {
        await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(null, '',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(400, 'Неверная сумма')
    });

    it(' amount = empty', async () => {
        await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(' ', '',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(400, 'Неверная сумма')
    });

    it(' amount = undefined', async () => {
        await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(undefined, '',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(400, 'Неверная сумма')
    });

    it(' amount = latinic', async () => {
        await register.one_click_reg();
        const {data} = await banking.deposite_create_rub('fjfj', '',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(400, 'Неверная сумма')
    });

    it(' amount = symbols', async () => {
        await register.one_click_reg();
        const {data} = await banking.deposite_create_rub('(#&@(@&%', '',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(400, 'Неверная сумма')
    });

    it(' amount = string', async () => {
        await register.one_click_reg();
        const {data} = await banking.deposite_create_rub('50', '',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(400, 'Неверная сумма')
    });

    it(' amount < min amount', async () => {
        await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(0.6, '',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(400, 'Неверная сумма')
    });

    it(' amount > max amount', async () => {
        await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(100001, '',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(400, 'Неверная сумма')
    });

    it(' amount > max amount', async () => {
        await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(100000.56, '',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(400, 'Неверная сумма')
    });

    it(' wallet = null', async () => {
        await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(1, null,
            paymentType, currency);
        //console.log(data);
        checkErrMsg(400, 'Неверный формат кошелька')
    });

    it(' wallet = long string', async () => {
        await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(1,
            //TODO посмотреть количество символов доступных в кошельке
            '1231231231231231453453345345342312312312312123123123123',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(400, 'Неверный формат кошелька')
    });

    //Не знаю что тут должно быть
    it(' incorrect paymentType = piastrix_rub_test', async () => {
        await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(1,
            //TODO посмотреть количество символов доступных в кошельке
            '1231231231231231453453345345342312312312312123123123123',
            'piastrix_rub_test', currency);
        //console.log(data);
        checkErrMsg(400, '?????')
    });
});