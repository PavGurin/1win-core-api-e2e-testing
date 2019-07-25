import { banking } from '../../../../../src/methods/banking';
import { successDepositCreate } from '../../../../../src/expects/exBanking';
import { checkErrMsg } from '../../../../../src/responseChecker';
import { register } from '../../../../../src/methods/register';

const paymentType = 'beeline_rub';
const currency = 'RUB';

describe.skip('Create deposite for beeline_rub - RUB @master', () => {
  beforeAll(async () => {
    await register.oneClickReg();
  });

  it('C22485 - (+) amount = 100 & wallet = (+7)phone', async () => {
    const { data } = await banking.depositCreateRub(
      100, '+79001234567', paymentType, currency,
    );
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 100);
  });

  it('C22486 - (+) amount = 100.01 & wallet = (7)phone', async () => {
    const { data } = await banking.depositCreateRub(
      100.01, '79215598287', paymentType, currency,
    );
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 100.01);
  });

  it(' - (+) amount = 100.156 & wallet = (7)phone', async () => {
    const { data } = await banking.depositCreateRub(
      100.156, '79215598287', paymentType, currency,
    );
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 100.156);
  });

  it('C22487 - amount = 2000 & wallet = (8)phone', async () => {
    const { data } = await banking.depositCreateRub(
      2000, '89215598288', paymentType, currency,
    );
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 2000);
  });

  it('C22488 - min amount & wallet = symbols', async () => {
    const { data } = await banking.depositCreateRub(10,
      '+79215598289', paymentType, currency);

    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 10);
  });

  it('C22489 - > min amount & wallet = symbols', async () => {
    const { data } = await banking.depositCreateRub(11,
      '+79215598216', paymentType, currency);

    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 11);
  });

  it('C22490 - max amount & wallet = numbers', async () => {
    const { data } = await banking.depositCreateRub(15000,
      '+79215598226', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 15000);
  });

  it('C22491 - < max amount & wallet = numbers', async () => {
    const { data } = await banking.depositCreateRub(14999, '+79215598236',
      paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 14999);
  });

  it('C22492 - without currency', async () => {
    const { data } = await socket.send('BANKING:deposit-create', {
      amount: '100',
      wallet: '+79215598246',
      paymentType,
    });
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 100);
  });

  it('C22499 - amount = string-number', async () => {
    const { data } = await banking.depositCreateRub('50', '79215598186',
      paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 50);
  });
});

describe('Create deposite for beeline_rub invalid - RUB', () => {
  it('C22494 - amount = 0', async () => {
    const { data } = await banking.depositCreateRub(0, '+79215598256',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is invalid');
  });

  it('C22495 - amount = null', async () => {
    const { data } = await banking.depositCreateRub(null, '+79215598266',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is required, no default value provided');
  });

  it('C22496 - amount = empty', async () => {
    const { data } = await banking.depositCreateRub(' ', '79215598276',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is invalid');
  });

  it('C22497 - amount = undefined', async () => {
    const { data } = await banking.depositCreateRub(undefined, '79215598206',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is required, no default value provided');
  });

  it('C22498 - amount = string', async () => {
    const { data } = await banking.depositCreateRub('fjfj', '79215598296',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount should have a type of number, but found string');
  });

  it('C22500 - amount double < min amount', async () => {
    const { data } = await banking.depositCreateRub(0.6, '79215598386',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22501 - amount < min amount', async () => {
    const { data } = await banking.depositCreateRub(9, '79215598486',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22502 - amount > max amount', async () => {
    const { data } = await banking.depositCreateRub(15001, '79215598586',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22503 - amount double > max amount', async () => {
    const { data } = await banking.depositCreateRub(15000.000001, '79215598686',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22506 - wallet = empty', async () => {
    const { data } = await banking.depositCreateRub(100, '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный формат кошелька');
  });

  it('C22507 - wallet = number', async () => {
    const { data } = await banking.depositCreateRub(100, 111122223330000,
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, wallet should have a type of string, but found number');
  });

  it('C22508 - wallet = short phone', async () => {
    const { data } = await banking.depositCreateRub(100, +7123,
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, wallet should have a type of string, but found number');
  });

  // Не знаю что тут должно быть
  it('C22509 - incorrect paymentType = beeline_rub_test', async () => {
    const { data } = await banking.depositCreateRub(1,
      '+79215598286',
      'beeline_rub_test', currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный способ оплаты');
  });
});
