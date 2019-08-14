import { register } from '../../../../../src/methods/register';
import { banking } from '../../../../../src/methods/banking';
import { successDepositCreate } from '../../../../../src/expects/exBanking';
import { checkErrMsg } from '../../../../../src/responseChecker';

const paymentType = 'beeline_rub';
const currency = 'RUB';

describe.skip('Create deposite for beeline_rub - RUB @master', () => {
  beforeAll(async () => {
    await register.oneClickReg();
  });

  it(' - (+) amount = 100 & wallet = (+7)phone', async () => {
    const { data } = await banking.depositCreateRequestRub(
      40, '+79215598286', paymentType, currency,
    );
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 100);
  });

  it(' - (+) amount = 100.01 & wallet = (7)phone', async () => {
    const { data } = await banking.depositCreateRequestRub(
      100.01, '79215598286', paymentType, currency,
    );
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 100.01);
  });

  it(' - amount = 2000 & wallet = (8)phone', async () => {
    const { data } = await banking.depositCreateRequestRub(
      2000, '89215598286', paymentType, currency,
    );
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 2000);
  });

  it(' - min amount & wallet = symbols', async () => {
    const { data } = await banking.depositCreateRequestRub(10,
      '+79215598286', paymentType, currency);

    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 10);
  });

  it(' - > min amount & wallet = symbols', async () => {
    const { data } = await banking.depositCreateRequestRub(11,
      '+79215598286', paymentType, currency);

    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 11);
  });

  it(' - max amount & wallet = numbers', async () => {
    const { data } = await banking.depositCreateRequestRub(15000,
      '+79215598286', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 15000);
  });

  it(' - < max amount & wallet = numbers', async () => {
    const { data } = await banking.depositCreateRequestRub(14999, '+79215598286',
      paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 14999);
  });

  it(' - without currency', async () => {
    const { data } = await socket.send('BANKING:deposit-create', {
      amount: '100',
      wallet: '+79215598286',
      paymentType,
    });
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 100);
  });

  it(' - < max amount & wallet = valid short number', async () => {
    // TODO узнать валидный короткий номер городского телефона
    const { data } = await banking.depositCreateRequestRub(14999, '+79001234',
      paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 14999);
  });
});

describe.skip('Create deposite for beeline_rub invalid - RUB', () => {
  it(' - amount = 0', async () => {
    const { data } = await banking.depositCreateRequestRub(0, '+79215598286',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is invalid');
  });

  it(' - amount = null', async () => {
    const { data } = await banking.depositCreateRequestRub(null, '+79215598286',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is required, no default value provided');
  });

  it(' - amount = empty', async () => {
    const { data } = await banking.depositCreateRequestRub(' ', '79215598286',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is invalid');
  });

  it(' - amount = undefined', async () => {
    const { data } = await banking.depositCreateRequestRub(undefined, '79215598286',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is required, no default value provided');
  });

  it(' - amount = string', async () => {
    const { data } = await banking.depositCreateRequestRub('fjfj', '79215598286',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount should have a type of number, but found string');
  });

  it(' - amount = string-number', async () => {
    const { data } = await banking.depositCreateRequestRub('50', '79215598286',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' - amount double < min amount', async () => {
    const { data } = await banking.depositCreateRequestRub(0.6, '79215598286',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is invalid');
  });

  it(' - amount < min amount', async () => {
    const { data } = await banking.depositCreateRequestRub(9, '79215598286',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' - amount > max amount', async () => {
    const { data } = await banking.depositCreateRequestRub(15001, '79215598286',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' - amount double > max amount', async () => {
    const { data } = await banking.depositCreateRequestRub(15000.000001, '79215598286',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' - wallet = undefined', async () => {
    const { data } = await banking.depositCreateRequestRub(100, undefined,
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный формат кошелька');
  });

  it(' - wallet = null', async () => {
    const { data } = await banking.depositCreateRequestRub(100, null,
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный формат кошелька');
  });

  it(' - wallet = empty', async () => {
    const { data } = await banking.depositCreateRequestRub(100, '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный формат кошелька');
  });

  it(' - wallet = number', async () => {
    const { data } = await banking.depositCreateRequestRub(100, 111122223330000,
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, wallet should have a type of string, but found number');
  });

  it(' - wallet = short phone', async () => {
    const { data } = await banking.depositCreateRequestRub(100, +7123,
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, wallet should have a type of string, but found number');
  });

  // Не знаю что тут должно быть
  it(' - incorrect paymentType = beeline_rub_test', async () => {
    const { data } = await banking.depositCreateRequestRub(1,
      // TODO посмотреть количество символов доступных в кошельке
      '79215598286',
      'beeline_rub_test', currency);
    // console.log(data);
    checkErrMsg(data, 400, '?????');
  });
});
