import {register} from '../../../../src/methods/register';
import {banking} from "../../../../src/methods/banking";
import {succses_deposit_create} from "../../../../src/expects/expect_banking";
import {checkErrMsg} from "../../../../src/responseChecker";

// beforeEach('Регистрация нового пользователя перед началом каждого теста', async () => {
//     const {user} = await register.one_click_reg();
//     }
// );

describe('Create deposite for piastrix_rub - RUB @master', () => {

    it(' (+) amount = 100 & wallet = empty', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(
            100, '', 'piastrix_rub', 'RUB');
        //console.log(data);
        succses_deposit_create(data, 'RUB', user.id,
            'piastrix_rub', 100)
    });

    it(' (+) amount = 100.01 & wallet = symbols', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(
            100.01, '123 autotests', 'piastrix_rub', 'RUB');
        //console.log(data);
        succses_deposit_create(data, 'RUB', user.id,
            'piastrix_rub', 100.01)
    });

    it(' amount = 2000 & wallet = symbols', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(
            2000, 'порпорпорпэ', 'piastrix_rub', 'RUB');
        //console.log(data);
        succses_deposit_create(data, 'RUB', user.id,
            'piastrix_rub', 2000)
    });

    it(' min amount & wallet = symbols', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(1,
            '123234345456 etryrt', 'piastrix_rub', 'RUB');

        //console.log(data);
        succses_deposit_create(data, 'RUB', user.id,
            'piastrix_rub', 1)
    });

    it('> min amount & wallet = symbols', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(2,
            '12№%:№%:45456etryrt', 'piastrix_rub', 'RUB');

        //console.log(data);
        succses_deposit_create(data, 'RUB', user.id,
            'piastrix_rub', 2)
    });

    it(' max amount & wallet = numbers', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(100000, '09090909999',
            'piastrix_rub', 'RUB');
        //console.log(data);
        succses_deposit_create(data, 'RUB', user.id,
            'piastrix_rub', 100000)
    });

    it('< max amount & wallet = numbers', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(99999, '0[[[?<><?999',
            'piastrix_rub', 'RUB');
        //console.log(data);
        succses_deposit_create(data, 'RUB', user.id,
            'piastrix_rub', 99999)
    });

    //Не знаю, какой должен быть результат
    it(' wallet = undefined', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(100, undefined,
            'piastrix_rub', 'RUB');
        //console.log(data);
        succses_deposit_create(data, 'RUB', user.id,
            'piastrix_rub', 100)
    });

    it(' without currency', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await socket.send('BANKING:deposit-create', {
            amount: '100',
            wallet: '00001111222223333',
            paymentType: 'piastrix_rub',
        });
        //console.log(data);
        succses_deposit_create(data, 'RUB', user.id,
            'piastrix_rub', 100)
    });
});

describe('Create deposite for piastrix_rub invalid - RUB', () => {

    it(' amount = 0', async () => {
        await register.one_click_reg();
        await banking.deposite_create_rub(0, '',
            'piastrix_rub', 'RUB');
        //console.log(data);
        checkErrMsg(400, 'Неверная сумма')
    });

    it(' amount = null', async () => {
        await register.one_click_reg();
        await banking.deposite_create_rub(null, '',
            'piastrix_rub', 'RUB');
        //console.log(data);
        checkErrMsg(400, 'Неверная сумма')
    });

    it(' amount = empty', async () => {
        await register.one_click_reg();
        await banking.deposite_create_rub(' ', '',
            'piastrix_rub', 'RUB');
        //console.log(data);
        checkErrMsg(400, 'Неверная сумма')
    });

    it(' amount = undefined', async () => {
        await register.one_click_reg();
        await banking.deposite_create_rub(undefined, '',
            'piastrix_rub', 'RUB');
        //console.log(data);
        checkErrMsg(400, 'Неверная сумма')
    });

    it(' amount = latinic', async () => {
        await register.one_click_reg();
        await banking.deposite_create_rub('fjfj', '',
            'piastrix_rub', 'RUB');
        //console.log(data);
        checkErrMsg(400, 'Неверная сумма')
    });

    it(' amount = symbols', async () => {
        await register.one_click_reg();
        await banking.deposite_create_rub('(#&@(@&%', '',
            'piastrix_rub', 'RUB');
        //console.log(data);
        checkErrMsg(400, 'Неверная сумма')
    });

    it(' amount = string', async () => {
        await register.one_click_reg();
        await banking.deposite_create_rub('50', '',
            'piastrix_rub', 'RUB');
        //console.log(data);
        checkErrMsg(400, 'Неверная сумма')
    });

    it(' amount < min amount', async () => {
        await register.one_click_reg();
        await banking.deposite_create_rub(0.6, '',
            'piastrix_rub', 'RUB');
        //console.log(data);
        checkErrMsg(400, 'Неверная сумма')
    });

    it(' amount > max amount', async () => {
        await register.one_click_reg();
        await banking.deposite_create_rub(100001, '',
            'piastrix_rub', 'RUB');
        //console.log(data);
        checkErrMsg(400, 'Неверная сумма')
    });

    it(' amount > max amount', async () => {
        await register.one_click_reg();
        await banking.deposite_create_rub(100000.56, '',
            'piastrix_rub', 'RUB');
        //console.log(data);
        checkErrMsg(400, 'Неверная сумма')
    });

    it(' wallet = null', async () => {
        await register.one_click_reg();
        await banking.deposite_create_rub(1, null,
            'piastrix_rub', 'RUB');
        //console.log(data);
        checkErrMsg(400, 'Неверный формат кошелька')
    });

    it(' wallet = long string', async () => {
        await register.one_click_reg();
        await banking.deposite_create_rub(1,
            //TODO посмотреть количество символов доступных в кошельке
            '1231231231231231453453345345342312312312312123123123123',
            'piastrix_rub', 'RUB');
        //console.log(data);
        checkErrMsg(400, 'Неверный формат кошелька')
    });

    //Не знаю что тут должно быть
    it(' incorrect paymentType = piastrix_rub_test', async () => {
        await register.one_click_reg();
        await banking.deposite_create_rub(1,
            //TODO посмотреть количество символов доступных в кошельке
            '1231231231231231453453345345342312312312312123123123123',
            'piastrix_rub_test', 'RUB');
        //console.log(data);
        checkErrMsg(400, '?????')
    });
});