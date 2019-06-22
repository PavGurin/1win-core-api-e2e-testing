import {register} from '../../src/methods/register';
import {banking} from "../../../../src/methods/banking";
import {succses_deposit_create} from "../../../../src/expects/expect_banking";
import {checkErrMsg} from "../../../../src/responseChecker";

// beforeEach('Регистрация нового пользователя перед началом каждого теста', async () => {
//     const {user} = await register.one_click_reg();
//     }
// );

describe('Create deposite for card_rub - RUB @master', () => {

    it(' (+) amount = 100 & wallet = empty', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(
            100, '', 'card_rub', 'RUB');
        //console.log(data);
        succses_deposit_create(data, 'RUB', user.id,
            'card_rub', 100)
    });

    it(' (+) amount = 100.01 & wallet = symbols', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(
            100.01, '123 autotests', 'card_rub', 'RUB');
        //console.log(data);
        succses_deposit_create(data, 'RUB', user.id,
            'card_rub', 100.01)
    });

    it(' amount = 2000 & wallet = symbols', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(
            2000, 'порпорпорпэ', 'card_rub', 'RUB');
        //console.log(data);
        succses_deposit_create(data, 'RUB', user.id,
            'card_rub', 2000)
    });

    it(' min amount & wallet = symbols', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(10, '123234345456 etryrt', 'card_rub', 'RUB')

        //console.log(data);
        succses_deposit_create(data, 'RUB', user.id,
            'card_rub', 10)
    });

    it('> min amount & wallet = symbols', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(11, '12№%:№%:45456etryrt', 'card_rub', 'RUB')

        //console.log(data);
        succses_deposit_create(data, 'RUB', user.id,
            'card_rub', 11)
    });

    it(' max amount & wallet = numbers', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(100000, '09090909999',
            'card_rub', 'RUB')
        //console.log(data);
        succses_deposit_create(data, 'RUB', user.id,
            'card_rub', 100000)
    });

    it('< max amount & wallet = numbers', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(99999, '0[[[?<><?999',
            'card_rub', 'RUB')
        //console.log(data);
        succses_deposit_create(data, 'RUB', user.id,
            'card_rub', 99999)
    });

    //Не знаю, какой должен быть результат
    it(' without currency', async () => {
        const {user} = await register.one_click_reg();
        const {data1} = await banking.deposite_create_rub(100, undefined,
            'card_rub', 'RUB')
        //console.log(data);
        succses_deposit_create(data, 'RUB', user.id,
            'card_rub', 100)
    });

    it(' without currency', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await socket.send('BANKING:deposit-create', {
            amount: '100',
            wallet: '00001111222223333',
            paymentType: 'card_rub',
        });
        //console.log(data);
        succses_deposit_create(data, 'RUB', user.id,
            'card_rub', 100)
    });
});

describe('Create deposite for card_rub invalid - RUB', () => {

    it(' amount = 0', async () => {
        const {user} = await register.one_click_reg();
        const {data1} = await banking.deposite_create_rub(0, '',
            'card_rub', 'RUB')
        //console.log(data);
        checkErrMsg(400, 'Неверная сумма')
    });

    it(' amount < min amount', async () => {
        const {user} = await register.one_click_reg();
        const {data1} = await banking.deposite_create_rub(0.6, '',
            'card_rub', 'RUB')
        //console.log(data);
        checkErrMsg(400, 'Неверная сумма')
    });

    it(' amount < min amount', async () => {
        const {user} = await register.one_click_reg();
        const {data1} = await banking.deposite_create_rub(9, '',
            'card_rub', 'RUB')
        //console.log(data);
        checkErrMsg(400, 'Неверная сумма')
    });

    it(' amount > max amount', async () => {
        const {user} = await register.one_click_reg();
        const {data1} = await banking.deposite_create_rub(100001, '',
            'card_rub', 'RUB')
        //console.log(data);
        checkErrMsg(400, 'Неверная сумма')
    });

    it(' amount > max amount', async () => {
        const {user} = await register.one_click_reg();
        const {data1} = await banking.deposite_create_rub(100000.56, '',
            'card_rub', 'RUB')
        //console.log(data);
        checkErrMsg(400, 'Неверная сумма')
    });

    it(' wallet = null', async () => {
        const {user} = await register.one_click_reg();
        const {data1} = await banking.deposite_create_rub(1, null,
            'card_rub', 'RUB')
        //console.log(data);
        checkErrMsg(400, 'Неверный формат кошелька')
    });

    it(' wallet = long string', async () => {
        const {user} = await register.one_click_reg();
        const {data1} = await banking.deposite_create_rub(1,
            //TODO посмотреть количество символов доступных в кошельке
            '1231231231231231453453345345342312312312312123123123123',
            'card_rub', 'RUB')
        //console.log(data);
        checkErrMsg(400, 'Неверный формат кошелька')
    });

    //Не знаю что тут должно быть
    it(' incorrect paymentType = card_rub_test', async () => {
        const {user} = await register.one_click_reg();
        const {data1} = await banking.deposite_create_rub(1,
            //TODO посмотреть количество символов доступных в кошельке
            '1231231231231231453453345345342312312312312123123123123',
            'card_rub_test', 'RUB')
        //console.log(data);
        checkErrMsg(400, '?????')
    });
});