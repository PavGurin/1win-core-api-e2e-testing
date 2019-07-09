import { register } from '../../../../../src/methods/register';
import { banking } from '../../../../../src/methods/banking';
import { successDepositCreate } from '../../../../../src/expects/exBanking';
import { checkErrMsg } from '../../../../../src/responseChecker';

const paymentType = 'yamoney_rub';
const currency = 'RUB';

describe.skip('Create deposite for yamoney_ru - RUB @master', () => {
  before(async () => {
    await register.oneClickReg();
  });

  it('C22646 (+) amount = 100 & wallet = empty', async () => {
    const { data } = await banking.depositCreateRub(
      100, '', paymentType, currency,
    );
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 100);
  });

  it('C22647 - (+) amount = 100.01 & wallet = symbols', async () => {
    const { data } = await banking.depositCreateRub(
      100.01, '123 autotests', paymentType, currency,
    );
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 100.01);
  });

  it('C22648 - amount = 2000 & wallet = symbols', async () => {
    const { data } = await banking.depositCreateRub(
      2000, 'порпорпорпэ', paymentType, currency,
    );
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 2000);
  });

  it('C22649 - min amount & wallet = symbols', async () => {
    const { data } = await banking.depositCreateRub(10,
      '123234345456 etryrt', paymentType, currency);

    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 10);
  });

  it('C22650 - > min amount & wallet = symbols', async () => {
    const { data } = await banking.depositCreateRub(11,
      '12№%:№%:45456etryrt', paymentType, currency);

    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 11);
  });

  it('C22651 - max amount & wallet = numbers', async () => {
    const { data } = await banking.depositCreateRub(100000, '09090909999',
      paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 100000);
  });

  it('C22652 - < max amount & wallet = numbers', async () => {
    const { data } = await banking.depositCreateRub(99999, '0[[[?<><?999',
      paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 99999);
  });

  // Не знаю, какой должен быть результат
  it('C22654 wallet = undefined', async () => {
    const { data } = await banking.depositCreateRub(100, undefined,
      paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 100);
  });

  it('C22653 - without currency', async () => {
    const { data } = await socket.send('BANKING:deposit-create', {
      amount: '100',
      wallet: '00001111222223333',
      paymentType,
    });
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 100);
  });

  it('C22660 - amount =string - number', async () => {
    const { data } = await banking.depositCreateRub('50', '',
      paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 50);
  });
});

describe('Create deposite for yamoney_ru invalid - RUB', () => {
  it('C22655 - amount = 0', async () => {
    const { data } = await banking.depositCreateRub(0, '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is invalid');
  });

  it('C22656 - amount = null', async () => {
    const { data } = await banking.depositCreateRub(null, '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is required, no default value provided');
  });

  it('C22657 - amount = empty', async () => {
    const { data } = await banking.depositCreateRub(' ', '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is invalid');
  });

  it('C22658 - amount = undefined', async () => {
    const { data } = await banking.depositCreateRub(undefined, '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is required, no default value provided');
  });

  it('C22659 - amount = string', async () => {
    const { data } = await banking.depositCreateRub('fjfj', '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount should have a type of number, but found string');
  });

  it('C22661 - amount double < min amount', async () => {
    const { data } = await banking.depositCreateRub(0.6, '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22662 - amount < min amount', async () => {
    const { data } = await banking.depositCreateRub(9, '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22663 - amount > max amount', async () => {
    const { data } = await banking.depositCreateRub(100001, '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22664 - amount double > max amount', async () => {
    const { data } = await banking.depositCreateRub(100000.56, '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  // Не знаю что тут должно быть
  it('C22667 - incorrect paymentType = yamoney_ru_test', async () => {
    const { data } = await banking.depositCreateRub(100,
      '12312312',
      'yamoney_ru_test', currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный способ оплаты');
  });
});
