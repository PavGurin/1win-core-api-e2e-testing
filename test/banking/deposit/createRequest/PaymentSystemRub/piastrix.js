import { register } from '../../../../../src/methods/register';
import { banking } from '../../../../../src/methods/banking';
import { successDepositCreate } from '../../../../../src/expects/exBanking';
import { checkErrMsg } from '../../../../../src/responseChecker';

const paymentType = 'piastrix_rub';
const currency = 'RUB';

describe.skip('Create deposite for piastrix_rub - RUB @master', () => {
  beforeAll(async () => {
    await register.oneClickReg();
  });

  it(' - (+) amount = 100 & wallet = empty', async () => {
    const { data } = await banking.depositCreateRequestRub(
      100, '', paymentType, currency,
    );
    // console.log
    successDepositCreate(data, currency,
      paymentType, 100);
  });

  it(' - (+) amount = 100.01 & wallet = symbols', async () => {
    const { data } = await banking.depositCreateRequestRub(
      100.01, '123 autotests', paymentType, currency,
    );
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 100.01);
  });

  it(' - amount = 2000 & wallet = symbols', async () => {
    const { data } = await banking.depositCreateRequestRub(
      2000, 'порпорпорпэ', paymentType, currency,
    );
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 2000);
  });

  it(' - min amount & wallet = symbols', async () => {
    const { data } = await banking.depositCreateRequestRub(1,
      '123234345456 etryrt', paymentType, currency);

    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 1);
  });

  it(' - > min amount & wallet = symbols', async () => {
    const { data } = await banking.depositCreateRequestRub(2,
      '12№%:№%:45456etryrt', paymentType, currency);

    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 2);
  });

  it(' - max amount & wallet = numbers', async () => {
    const { data } = await banking.depositCreateRequestRub(100000, '09090909999',
      paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 100000);
  });

  it(' - < max amount & wallet = numbers', async () => {
    const { data } = await banking.depositCreateRequestRub(99999, '0[[[?<><?999',
      paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 99999);
  });

  // Не знаю, какой должен быть результат
  it(' - wallet = undefined', async () => {
    const { data } = await banking.depositCreateRequestRub(100, undefined,
      paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 100);
  });

  it(' - without currency', async () => {
    const { data } = await socket.send('BANKING:deposit-create', {
      amount: '100',
      wallet: '00001111222223333',
      paymentType,
    });
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 100);
  });
});

describe.skip('Create deposite for piastrix_rub invalid - RUB', () => {
  it(' - amount = 0', async () => {
    const { data } = await banking.depositCreateRequestRub(0, '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is invalid');
  });

  it(' - amount = null', async () => {
    const { data } = await banking.depositCreateRequestRub(null, '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is required, no default value provided');
  });

  it(' - amount = empty', async () => {
    const { data } = await banking.depositCreateRequestRub(' ', '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is invalid');
  });

  it(' - amount = undefined', async () => {
    const { data } = await banking.depositCreateRequestRub(undefined, '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is required, no default value provided');
  });

  it(' - amount = string', async () => {
    const { data } = await banking.depositCreateRequestRub('fjfj', '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount should have a type of number, but found string');
  });

  it(' - amount = string-number', async () => {
    const { data } = await banking.depositCreateRequestRub('50', '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' - amount double < min amount', async () => {
    const { data } = await banking.depositCreateRequestRub(0.6, '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' - amount > max amount', async () => {
    const { data } = await banking.depositCreateRequestRub(100001, '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' - amount double > max amount', async () => {
    const { data } = await banking.depositCreateRequestRub(100000.56, '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' - wallet = null', async () => {
    const { data } = await banking.depositCreateRequestRub(1, null,
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный формат кошелька');
  });

  it(' - wallet = long string', async () => {
    const { data } = await banking.depositCreateRequestRub(1,
      // TODO посмотреть количество символов доступных в кошельке
      '1231231231231231453453345345342312312312312123123123123',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный формат кошелька');
  });

  // Не знаю что тут должно быть
  it(' - incorrect paymentType = piastrix_rub_test', async () => {
    const { data } = await banking.depositCreateRequestRub(1,
      // TODO посмотреть количество символов доступных в кошельке
      '12312312312',
      'piastrix_rub_test', currency);
    // console.log(data);
    checkErrMsg(data, 400, '?????');
  });
});
