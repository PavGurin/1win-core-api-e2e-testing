import {register} from '../../../../../src/methods/register';
import {banking} from '../../../../../src/methods/banking';
import {succses_deposit_create} from '../../../../../src/expects/expect_banking';
import {checkErrMsg} from '../../../../../src/responseChecker';

const paymentType = 'piastrix_rub';
const currency = 'RUB';

describe('Create deposite for piastrix_rub - RUB @master', () => {
    before(async () => {
        await register.one_click_reg();
    });

    it('C22594 - (+) amount = 100 & wallet = empty', async () => {
        const {data} = await banking.deposite_create_rub(
            100, '', paymentType, currency,
        );
        // console.log(data);
        succses_deposit_create(data, currency,
            paymentType, 100);
    });

    it('C22595 - (+) amount = 100.01 & wallet = symbols', async () => {
        const {data} = await banking.deposite_create_rub(
            100.01, '123 autotests', paymentType, currency,
        );
        // console.log(data);
        succses_deposit_create(data, currency,
            paymentType, 100.01);
    });

    it('C22596 - amount = 2000 & wallet = symbols', async () => {
        const {data} = await banking.deposite_create_rub(
            2000, 'порпорпорпэ', paymentType, currency,
        );
        // console.log(data);
        succses_deposit_create(data, currency,
            paymentType, 2000);
    });

    it('C22597 - min amount & wallet = symbols', async () => {
        const {data} = await banking.deposite_create_rub(1,
            '123234345456 etryrt', paymentType, currency);

        // console.log(data);
        succses_deposit_create(data, currency,
            paymentType, 1);
    });

    it('C22598 - > min amount & wallet = symbols', async () => {
        const {data} = await banking.deposite_create_rub(2,
            '12№%:№%:45456etryrt', paymentType, currency);

        // console.log(data);
        succses_deposit_create(data, currency,
            paymentType, 2);
    });

    it('C22599 - max amount & wallet = numbers', async () => {
        const {data} = await banking.deposite_create_rub(100000, '09090909999',
            paymentType, currency);
        // console.log(data);
        succses_deposit_create(data, currency,
            paymentType, 100000);
    });

    it('C22600 - < max amount & wallet = numbers', async () => {
        const {data} = await banking.deposite_create_rub(99999, '0[[[?<><?999',
            paymentType, currency);
        // console.log(data);
        succses_deposit_create(data, currency,
            paymentType, 99999);
    });

    // Не знаю, какой должен быть результат
    it('C22602 - wallet = undefined', async () => {
        const {data} = await banking.deposite_create_rub(100, undefined,
            paymentType, currency);
        // console.log(data);
        succses_deposit_create(data, currency,
            paymentType, 100);
    });

    it('C22601 - without currency', async () => {
        const {data} = await socket.send('BANKING:deposit-create', {
            amount: '100',
            wallet: '00001111222223333',
            paymentType,
        });
        // console.log(data);
        succses_deposit_create(data, currency,
            paymentType, 100);
    });
});

describe('Create deposite for piastrix_rub invalid - RUB', () => {
    it('C22603 - amount = 0', async () => {
        const {data} = await banking.deposite_create_rub(0, '',
            paymentType, currency);
        // console.log(data);
        checkErrMsg(data, 400, 'Bad request, amount is invalid');
    });

    it('C22604 - amount = null', async () => {
        const {data} = await banking.deposite_create_rub(null, '',
            paymentType, currency);
        // console.log(data);
        checkErrMsg(data, 400, 'Bad request, amount is required, no default value provided');
    });

    it('C22605 - amount = empty', async () => {
        const {data} = await banking.deposite_create_rub(' ', '',
            paymentType, currency);
        // console.log(data);
        checkErrMsg(data, 400, 'Bad request, amount should have a type of number, but found string');
    });

    it('C22606 - amount = undefined', async () => {
        const {data} = await banking.deposite_create_rub(undefined, '',
            paymentType, currency);
        // console.log(data);
        checkErrMsg(data, 400, 'Bad request, amount is required, no default value provided');
    });

    it('C22607 - amount = string', async () => {
        const {data} = await banking.deposite_create_rub('fjfj', '',
            paymentType, currency);
        // console.log(data);
        checkErrMsg(data, 400, 'Bad request, amount should have a type of number, but found string');
    });

    it('C22608 - amount = string-number', async () => {
        const {data} = await banking.deposite_create_rub('50', '',
            paymentType, currency);
        // console.log(data);
        checkErrMsg(data, 400, 'Неверная сумма');
    });

    it('C22609 - amount double < min amount', async () => {
        const {data} = await banking.deposite_create_rub(0.6, '',
            paymentType, currency);
        // console.log(data);
        checkErrMsg(data, 400, 'Bad request, amount is invalid');
    });

    it('C22611 - amount > max amount', async () => {
        const {data} = await banking.deposite_create_rub(100001, '',
            paymentType, currency);
        // console.log(data);
        checkErrMsg(data, 400, 'Неверная сумма');
    });

    it('C22612 - amount double > max amount', async () => {
        const {data} = await banking.deposite_create_rub(100000.56, '',
            paymentType, currency);
        // console.log(data);
        checkErrMsg(data, 400, 'Неверная сумма');
    });

    it('C22614 - wallet = null', async () => {
        const {data} = await banking.deposite_create_rub(1, null,
            paymentType, currency);
        // console.log(data);
        checkErrMsg(data, 400, 'Неверный формат кошелька');
    });

    it('C22619 - wallet = long string', async () => {
        const {data} = await banking.deposite_create_rub(1,
            // TODO посмотреть количество символов доступных в кошельке
            '1231231231231231453453345345342312312312312123123123123',
            paymentType, currency);
        // console.log(data);
        checkErrMsg(data, 400, 'Неверный формат кошелька');
    });

    // Не знаю что тут должно быть
    it('C22615 - incorrect paymentType = piastrix_rub_test', async () => {
        const {data} = await banking.deposite_create_rub(1,
            // TODO посмотреть количество символов доступных в кошельке
            '12312312312',
            'piastrix_rub_test', currency);
        // console.log(data);
        checkErrMsg(data, 400, '?????');
    });
});
