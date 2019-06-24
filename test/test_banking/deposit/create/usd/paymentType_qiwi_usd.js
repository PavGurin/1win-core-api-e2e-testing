import {register} from '../../../../../src/methods/register';
import {banking} from "../../../../../src/methods/banking";
import {succses_deposit_create} from "../../../../../src/expects/expect_banking";
import {checkErrMsg} from "../../../../../src/responseChecker";

// beforeEach('Регистрация нового пользователя перед началом каждого теста', async () => {
//     const {user} = await register.one_click_reg();
//     }
// );
const paymentType = 'qiwi_rub';
const currency = 'USD';

describe('Create deposite for qiwi_rub - USD @master', () => {

    it(' (+) amount = 100 & wallet = (+7)phone', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(
            100, '+79001234567', paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency, user.id, paymentType, 100)
    });

    it(' (+) amount = 100.01 & wallet = (7)phone', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(
            100.01, '79001234567', paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency, user.id, paymentType, 100.01)
    });

    it(' amount = 2000 & wallet = (8)phone', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(
            2000, '89001234567', paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency, user.id, paymentType, 2000)

    });

    it(' min amount & wallet =  = (+91)', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(10,
            '+919001234567', paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency, user.id, paymentType, 10)

    });

    it('> min amount & wallet = (+994)', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(11,
            '+9949001234567', paymentType, currency);

        //console.log(data);
        succses_deposit_create(data, currency, user.id, paymentType, 11)

    });

    it(' max amount & wallet = (+82)', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(15000,
            '+829001234567', paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency, user.id, paymentType, 15000)

    });

    it('< max amount & wallet = (+372)', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(14999, '+3729001234567',
            paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency, user.id, paymentType, 14999)

    });

    it(' without currency & wallet = (+375)', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await socket.send('BANKING:deposit-create', {
            amount: '100',
            wallet: '+3759001234567',
            paymentType: paymentType,
        });
        //console.log(data);
        succses_deposit_create(data, currency, user.id, paymentType, 100)
    });

    it(' max amount & wallet = (+374)', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(15, '+3749001234567', paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency, user.id, paymentType, 15)
    });

    it(' max amount & wallet = (+44)', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(15, '+449001234567', paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency, user.id, paymentType, 15)
    });

    it(' max amount & wallet = (+998)', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(15, '+9989001234567', paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency, user.id, paymentType, 15)
    });

    it(' max amount & wallet = (+972)', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(15, '+9729001234567', paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency, user.id, paymentType, 15)
    });

    it(' max amount & wallet = (+66)', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(15, '+669001234567', paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency, user.id, paymentType, 15)
    });

    it(' max amount & wallet = (+90)', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(15, '+909001234567', paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency, user.id, paymentType, 15)
    });

    it(' max amount & wallet = (+81)', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(15, '+8149001234567', paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency, user.id, paymentType, 15)
    });

    it(' max amount & wallet = (+1)', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(15, '+19001234567', paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency, user.id, paymentType, 15)
    });

    it(' max amount & wallet = (+507)', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(15, '+5079001234567', paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency, user.id, paymentType, 15)
    });

    it(' max amount & wallet = (+77)', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(15, '+779001234567', paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency, user.id, paymentType, 15)
    });

    it(' max amount & wallet = (+380)', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(15,
            '+3809001234567', paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency, user.id,
            paymentType, 15)
    });

    it(' max amount & wallet = (+371)', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(15,
            '+3719001234567', paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency, user.id,
            paymentType, 15)
    });

    it(' max amount & wallet = (+370)', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(15,
            '+3709001234567', paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency, user.id,
            paymentType, 15)
    });

    it(' max amount & wallet = (+996)', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(15,
            '+9969001234567', paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency, user.id,
            paymentType, 15)
    });

    it(' max amount & wallet = (+9955)', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(15,
            '+99559001234567', paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency, user.id,
            paymentType, 15)
    });

    it(' max amount & wallet = (+992)', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(15,
            '+9929001234567', paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency, user.id,
            paymentType, 15)
    });

    it(' max amount & wallet = (+373)', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(15,
            '+3739001234567', paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency, user.id,
            paymentType, 15)
    });

    it(' max amount & wallet = (+84)', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(15,
            '+849001234567', paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency, user.id,
            paymentType, 15)
    });

    it('< max amount & wallet = valid short number', async () => {
        //TODO узнать валидный короткий номер городского телефона
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(14999, '+79001234',
            paymentType, currency);
        //console.log(data);
        succses_deposit_create(data, currency, user.id,
            paymentType, 14999)
    });
});

describe('Create deposite for qiwi_rub invalid - USD', () => {

    it(' amount = 0', async () => {
        await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(0, '+79001234567',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(data, 400, 'Bad request, amount is invalid')
    });

    it(' amount = null', async () => {
        await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(null, '+79001234567',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(data, 400, 'Bad request, amount is required, no default value provided')
    });

    it(' amount = empty', async () => {
        await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(' ', '+79001234567',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(data, 400, 'Bad request, amount should have a type of number, but found string')
    });

    it(' amount = undefined', async () => {
        await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(undefined, '+79001234567',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(data, 400, 'Bad request, amount is required, no default value provided')
    });

    it(' amount = latanic', async () => {
        await register.one_click_reg();
        const {data} = await banking.deposite_create_rub('fjfj', '+79001234567',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(data, 400, 'Bad request, amount should have a type of number, but found string')
    });

    it(' amount = sy,bols', async () => {
        await register.one_click_reg();
        const {data} = await banking.deposite_create_rub('(#&@(@&%', '+79001234567',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(data, 400, 'Bad request, amount should have a type of number, but found string')
    });

    it(' amount = string', async () => {
        await register.one_click_reg();
        const {data} = await banking.deposite_create_rub('50', '+79001234567',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(data, 400, 'Неверная сумма')
    });

    it(' amount double < min amount', async () => {
        await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(0.6, '+79001234567',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(data, 400, 'Bad request, amount is invalid')
    });

    it(' amount < min amount', async () => {
        await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(9, '+79001234567',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(data, 400, 'Неверная сумма')
    });

    it(' amount > max amount', async () => {
        await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(15001, '+79001234567',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(data, 400, 'Неверная сумма')
    });

    it(' amount double > max amount', async () => {
        await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(15000.000001, '+79001234567',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(data, 400, 'Неверная сумма')
    });

    it(' wallet = undefined', async () => {
        await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(100, undefined,
            paymentType, currency);
        //console.log(data);
        checkErrMsg(data, 400, 'Неверный формат кошелька')
    });

    it(' wallet = null', async () => {
        await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(100, null,
            paymentType, currency);
        //console.log(data);
        checkErrMsg(data, 400, 'Неверный формат кошелька')
    });

    it(' wallet = empty', async () => {
        await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(100, '',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(data, 400, 'Неверный формат кошелька')
    });

    it(' wallet = number', async () => {
        await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(100, 111122223330000,
            paymentType, currency);
        //console.log(data);
        checkErrMsg(data, 400, 'Bad request, wallet should have a type of string, but found number')
    });

    it(' wallet = short phone', async () => {
        await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(100, '+7123',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(data, 400, 'Неверный формат кошелька')
    });

    it(' wallet = long string', async () => {
        await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(100,
            '+797798778987',
            paymentType, currency);
        //console.log(data);
        checkErrMsg(data, 400, 'Неверный формат кошелька')
    });

    //Не знаю что тут должно быть
    it(' incorrect paymentType = qiwi_rub_test', async () => {
        await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(100,
            //TODO посмотреть количество символов доступных в кошельке
            '+79001234567',
            'qiwi_rub_test', currency);
        //console.log(data);
        checkErrMsg(data, 400, '?????')
    });
});