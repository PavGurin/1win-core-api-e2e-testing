import { register } from '../../../../../src/methods/register';
import { banking } from '../../../../../src/methods/banking';
import { successDepositCreate } from '../../../../../src/expects/exBanking';
import { checkErrMsg } from '../../../../../src/responseChecker';

const paymentType = 'card_rub';
const currency = 'RUB';

describe.skip('Create deposite for card_rub - RUB @master', () => {
  before(async () => {
    await register.oneClickReg();
  });

  it('C22535 - (+) amount = 100 & wallet = empty', async () => {
    const { data } = await banking.depositCreateRub(
      100, '', paymentType, currency,
    );
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 100);
  });

  it('C22536 - (+) amount = 100.01 & wallet = symbols', async () => {
    const { data } = await banking.depositCreateRub(
      100.01, '123 autotests', paymentType, currency,
    );
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 100.01);
  });

  it('C22537 - amount = 2000 & wallet = symbols', async () => {
    const { data } = await banking.depositCreateRub(
      2000, 'порпорпорпэ', paymentType, currency,
    );
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 2000);
  });

  it('C22538 - min amount & wallet = symbols', async () => {
    const { data } = await banking.depositCreateRub(10, '123234345456 etryrt',
      paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 10);
  });

  it('C22539 - > min amount & wallet = symbols', async () => {
    const { data } = await banking.depositCreateRub(11, '12№%:№%:45456etryrt',
      paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 11);
  });

  it('C22540 - max amount & wallet = numbers', async () => {
    const { data } = await banking.depositCreateRub(100000, '09090909999',
      paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 100000);
  });

  it('C22541 - < max amount & wallet = numbers', async () => {
    const { data } = await banking.depositCreateRub(99999, '0[[[?<><?999',
      paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 99999);
  });

  // Не знаю, какой должен быть результат
  it('C22543 - wallet = undefined', async () => {
    const { data } = await banking.depositCreateRub(100, undefined,
      paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 100);
  });

  it('C22542 - without currency', async () => {
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

describe('Create deposite for card_rub invalid - RUB', () => {
  it('C22510 - amount = 0', async () => {
    const { data } = await banking.depositCreateRub(0, '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is invalid');
  });

  it('C22511 - amount = null', async () => {
    const { data } = await banking.depositCreateRub(null, '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is required, no default value provided');
  });

  it('C22512 - amount = empty', async () => {
    const { data } = await banking.depositCreateRub(' ', '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is invalid');
  });

  it('C22513 - amount = undefined', async () => {
    const { data } = await banking.depositCreateRub(undefined, '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is required, no default value provided');
  });

  it('C22514 - amount = string', async () => {
    const { data } = await banking.depositCreateRub('fjfj', '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount should have a type of number, but found string');
  });

  it('C22515 - amount = string - number', async () => {
    const { data } = await banking.depositCreateRub('50', '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22516 - amount double < min amount', async () => {
    const { data } = await banking.depositCreateRub(0.6, '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22517 - 1 < amount < min amount', async () => {
    const { data } = await banking.depositCreateRub(9, '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22518 - amount > max amount', async () => {
    const { data } = await banking.depositCreateRub(100001, '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22519 - amount doudle > max amount ', async () => {
    const { data } = await banking.depositCreateRub(100000.56, '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22525 - incorrect paymentType = card_rub_test', async () => {
    const { data } = await banking.depositCreateRub(10,
      '3123123123',
      'card_rub_test', currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный способ оплаты');
  });
});
