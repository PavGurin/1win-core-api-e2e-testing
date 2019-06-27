import {register} from '../../../../../src/methods/register';
import {banking} from '../../../../../src/methods/banking';
import {succses_deposit_create} from '../../../../../src/expects/expect_banking';
import {checkErrMsg} from '../../../../../src/responseChecker';

const paymentType = 'qiwi_rub';
const currency = 'RUB';

describe('Create deposite for qiwi_rub - RUB @master', () => {
    before(async () => {
        await register.one_click_reg();
    });

    it('C22620 - (+) amount = 100 & wallet = (+7)phone', async () => {
        const {data} = await banking.deposite_create_rub(
            100, '+79001234567', paymentType, currency,
        );
        // console.log(data);
        succses_deposit_create(data, currency, paymentType, 100);
    });

    it('C22621 (+) amount = 100.01 & wallet = (7)phone', async () => {
        const {data} = await banking.deposite_create_rub(
            100.01, '79001234567', paymentType, currency,
        );
        // console.log(data);
        succses_deposit_create(data, currency, paymentType, 100.01);
    });

    it('C22622 amount = 2000 & wallet = (8)phone', async () => {
        const {data} = await banking.deposite_create_rub(
            2000, '89001234567', paymentType, currency,
        );
        // console.log(data);
        succses_deposit_create(data, currency, paymentType, 2000);
    });

    it('C22623 min amount & wallet = (+91)', async () => {
        const {data} = await banking.deposite_create_rub(10,
            '+919001234567', paymentType, currency);
        // console.log(data);
        succses_deposit_create(data, currency, paymentType, 10);
    });

    it('C22624 - > min amount & wallet = (+994)', async () => {
        const {data} = await banking.deposite_create_rub(11,
            '+9949001234567', paymentType, currency);

        // console.log(data);
        succses_deposit_create(data, currency, paymentType, 11);
    });

    it('C22625 - max amount & wallet = (+82)', async () => {
        const {data} = await banking.deposite_create_rub(15000,
            '+829001234567', paymentType, currency);
        // console.log(data);
        succses_deposit_create(data, currency, paymentType, 15000);
    });

    it('C22626 - < max amount & wallet = (+372)', async () => {
        const {data} = await banking.deposite_create_rub(14999, '+3729001234567',
            paymentType, currency);
        // console.log(data);
        succses_deposit_create(data, currency, paymentType, 14999);
    });

    it('C22627 - without currency & wallet = (+375)', async () => {
        const {data} = await socket.send('BANKING:deposit-create', {
            amount: '100',
            wallet: '+3759001234567',
            paymentType,
        });
        // console.log(data);
        succses_deposit_create(data, currency, paymentType, 100);
    });

    it('C22628 - amount & wallet = (+374)', async () => {
        const {data} = await banking.deposite_create_rub(15, '+3749001234567', paymentType, currency);
        // console.log(data);
        succses_deposit_create(data, currency, paymentType, 15);
    });

    it('C22710 - amount & wallet = (+44)', async () => {
        const {data} = await banking.deposite_create_rub(15, '+449001234567', paymentType, currency);
        // console.log(data);
        succses_deposit_create(data, currency, paymentType, 15);
    });

    it('C22711 - amount & wallet = (+998)', async () => {
        const {data} = await banking.deposite_create_rub(15, '+9989001234567', paymentType, currency);
        // console.log(data);
        succses_deposit_create(data, currency, paymentType, 15);
    });

    it('C22712 - amount & wallet = (+972)', async () => {
        const {data} = await banking.deposite_create_rub(15, '+9729001234567', paymentType, currency);
        // console.log(data);
        succses_deposit_create(data, currency, paymentType, 15);
    });

    it('C22713 - amount & wallet = (+66)', async () => {
        const {data} = await banking.deposite_create_rub(15, '+669001234567', paymentType, currency);
        // console.log(data);
        succses_deposit_create(data, currency, paymentType, 15);
    });

    it('C22714 - amount & wallet = (+90)', async () => {
        const {data} = await banking.deposite_create_rub(15, '+909001234567', paymentType, currency);
        // console.log(data);
        succses_deposit_create(data, currency, paymentType, 15);
    });

    it('C22715 - amount & wallet = (+81)', async () => {
        const {data} = await banking.deposite_create_rub(15, '+8149001234567', paymentType, currency);
        // console.log(data);
        succses_deposit_create(data, currency, paymentType, 15);
    });

    it('C22716 - amount & wallet = (+1)', async () => {
        const {data} = await banking.deposite_create_rub(15, '+19001234567', paymentType, currency);
        // console.log(data);
        succses_deposit_create(data, currency, paymentType, 15);
    });

    it('C22717 - amount & wallet = (+507)', async () => {
        const {data} = await banking.deposite_create_rub(15, '+5079001234567', paymentType, currency);
        // console.log(data);
        succses_deposit_create(data, currency, paymentType, 15);
    });

    it('C22718 - amount & wallet = (+77)', async () => {
        const {data} = await banking.deposite_create_rub(15, '+779001234567', paymentType, currency);
        // console.log(data);
        succses_deposit_create(data, currency, paymentType, 15);
    });

    it('C22719 - amount & wallet = (+380)', async () => {
        const {data} = await banking.deposite_create_rub(15,
            '+3809001234567', paymentType, currency);
        // console.log(data);
        succses_deposit_create(data, currency,
            paymentType, 15);
    });

    it('C22720 - amount & wallet = (+371)', async () => {
        const {data} = await banking.deposite_create_rub(15,
            '+3719001234567', paymentType, currency);
        // console.log(data);
        succses_deposit_create(data, currency,
            paymentType, 15);
    });

    it('C22721 - amount & wallet = (+370)', async () => {
        const {data} = await banking.deposite_create_rub(15,
            '+3709001234567', paymentType, currency);
        // console.log(data);
        succses_deposit_create(data, currency,
            paymentType, 15);
    });

    it('C22722 - amount & wallet = (+996)', async () => {
        const {data} = await banking.deposite_create_rub(15,
            '+9969001234567', paymentType, currency);
        // console.log(data);
        succses_deposit_create(data, currency,
            paymentType, 15);
    });

    it('C22723 - amount & wallet = (+9955)', async () => {
        const {data} = await banking.deposite_create_rub(15,
            '+99559001234567', paymentType, currency);
        // console.log(data);
        succses_deposit_create(data, currency,
            paymentType, 15);
    });

    it('C22724 - amount & wallet = (+992)', async () => {
        const {data} = await banking.deposite_create_rub(15,
            '+9929001234567', paymentType, currency);
        // console.log(data);
        succses_deposit_create(data, currency,
            paymentType, 15);
    });

    it('C22725 - amount & wallet = (+373)', async () => {
        const {data} = await banking.deposite_create_rub(15,
            '+3739001234567', paymentType, currency);
        // console.log(data);
        succses_deposit_create(data, currency,
            paymentType, 15);
    });

    it('C22726 - amount & wallet = (+84)', async () => {
        const {data} = await banking.deposite_create_rub(15,
            '+849001234567', paymentType, currency);
        // console.log(data);
        succses_deposit_create(data, currency,
            paymentType, 15);
    });

    it('C22727 - < max amount & wallet = valid short number', async () => {
        // TODO узнать валидный короткий номер городского телефона
        const {data} = await banking.deposite_create_rub(14999, '+79001234',
            paymentType, currency);
        // console.log(data);
        succses_deposit_create(data, currency,
            paymentType, 14999);
    });
});

describe('Create deposite for qiwi_rub invalid - RUB', () => {
    it('C22629 - amount = 0', async () => {
        const {data} = await banking.deposite_create_rub(0, '+79001234567',
            paymentType, currency);
        // console.log(data);
        checkErrMsg(data, 400, 'Bad request, amount is invalid');
    });

    it('C22630 - amount = null', async () => {
        const {data} = await banking.deposite_create_rub(null, '+79001234567',
            paymentType, currency);
        // console.log(data);
        checkErrMsg(data, 400, 'Bad request, amount is required, no default value provided');
    });

    it('C22631 - amount = empty', async () => {
        const {data} = await banking.deposite_create_rub(' ', '+79001234567',
            paymentType, currency);
        // console.log(data);
        checkErrMsg(data, 400, 'Bad request, amount should have a type of number, but found string');
    });

    it('C22632 - amount = undefined', async () => {
        const {data} = await banking.deposite_create_rub(undefined, '+79001234567',
            paymentType, currency);
        // console.log(data);
        checkErrMsg(data, 400, 'Bad request, amount is required, no default value provided');
    });

    it('C22633 - amount = string', async () => {
        const {data} = await banking.deposite_create_rub('fjfj', '+79001234567',
            paymentType, currency);
        // console.log(data);
        checkErrMsg(data, 400, 'Bad request, amount should have a type of number, but found string');
    });


    it('C22634 - amount = number - string', async () => {
        const {data} = await banking.deposite_create_rub('50', '+79001234567',
            paymentType, currency);
        // console.log(data);
        checkErrMsg(data, 400, 'Неверная сумма');
    });

    it('C22635 - amount double < min amount', async () => {
        const {data} = await banking.deposite_create_rub(0.6, '+79001234567',
            paymentType, currency);
        // console.log(data);
        checkErrMsg(data, 400, 'Bad request, amount is invalid');
    });

    it('C22636 - amount < min amount', async () => {
        const {data} = await banking.deposite_create_rub(9, '+79001234567',
            paymentType, currency);
        // console.log(data);
        checkErrMsg(data, 400, 'Неверная сумма');
    });

    it('C22637 - amount > max amount', async () => {
        const {data} = await banking.deposite_create_rub(15001, '+79001234567',
            paymentType, currency);
        // console.log(data);
        checkErrMsg(data, 400, 'Неверная сумма');
    });

    it('C22638 - amount double > max amount', async () => {
        const {data} = await banking.deposite_create_rub(15000.000001, '+79001234567',
            paymentType, currency);
        // console.log(data);
        checkErrMsg(data, 400, 'Неверная сумма');
    });

    it('C22639 - wallet = undefined', async () => {
        const {data} = await banking.deposite_create_rub(100, undefined,
            paymentType, currency);
        // console.log(data);
        checkErrMsg(data, 400, 'Неверный формат кошелька');
    });

    it('C22640 - wallet = null', async () => {
        const {data} = await banking.deposite_create_rub(100, null,
            paymentType, currency);
        // console.log(data);
        checkErrMsg(data, 400, 'Неверный формат кошелька');
    });

    it('C22642 - wallet = empty', async () => {
        const {data} = await banking.deposite_create_rub(100, '',
            paymentType, currency);
        // console.log(data);
        checkErrMsg(data, 400, 'Неверный формат кошелька');
    });

    it('C22643 - wallet = number', async () => {
        const {data} = await banking.deposite_create_rub(100, 111122223330000,
            paymentType, currency);
        // console.log(data);
        checkErrMsg(data, 400, 'Bad request, wallet should have a type of string, but found number');
    });

    it('C22644 - wallet = short phone', async () => {
        const {data} = await banking.deposite_create_rub(100, '+7123',
            paymentType, currency);
        // console.log(data);
        checkErrMsg(data, 400, 'Неверный формат кошелька');
    });

    it('C22645 wallet = long phone', async () => {
        const {data} = await banking.deposite_create_rub(100,
            '+797798778987',
            paymentType, currency);
        // console.log(data);
        checkErrMsg(data, 400, 'Неверный формат кошелька');
    });

    // Не знаю что тут должно быть
    it('C22641 - incorrect paymentType = qiwi_rub_test', async () => {
        const {data} = await banking.deposite_create_rub(100,
            // TODO посмотреть количество символов доступных в кошельке
            '+79001234567',
            'qiwi_rub_test', currency);
        // console.log(data);
        checkErrMsg(data, 400, '?????');
    });
});
