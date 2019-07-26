import { banking } from '../../../../../src/methods/banking';
import { successDepositCreate } from '../../../../../src/expects/exBanking';
import { checkErrMsg } from '../../../../../src/responseChecker';
import { register } from '../../../../../src/methods/register';

const paymentType = 'tele2_rub';
const currency = 'RUB';

describe.skip('Create deposite for tele2 - RUB @master', () => {
  beforeAll(async () => {
    await register.oneClickReg();
  });

  it('C22672 - (+) amount = 100 & wallet = (+7)phone', async () => {
    const { data } = await banking.depositCreateRub(
      100, '+79772520000', paymentType, currency,
    );
    // console.log
    successDepositCreate(data, currency,
      paymentType, 100);
  });

  it('C22673 - (+) amount = 100.01 & wallet = (7)phone', async () => {
    const { data } = await banking.depositCreateRub(
      100.01, '79772520000', paymentType, currency,
    );
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 100.01);
  });

  it('C22674 - amount = 2000 & wallet = (8)phone', async () => {
    const { data } = await banking.depositCreateRub(
      2000, '89772520000', paymentType, currency,
    );
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 2000);
  });

  it('C22675 - min amount & wallet = symbols', async () => {
    const { data } = await banking.depositCreateRub(10,
      '+79772520000', paymentType, currency);

    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 10);
  });

  it('C22676 - > min amount & wallet = symbols', async () => {
    const { data } = await banking.depositCreateRub(11,
      '+79772520000', paymentType, currency);

    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 11);
  });

  it('C22677 - max amount & wallet = numbers', async () => {
    const { data } = await banking.depositCreateRub(15000, '+79772520000',
      paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 15000);
  });

  it('C22678 - < max amount & wallet = numbers', async () => {
    const { data } = await banking.depositCreateRub(14999, '+79772520000',
      paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 14999);
  });

  it('C22679 - without currency', async () => {
    const { data } = await socket.send('BANKING:deposit-create', {
      amount: '100',
      wallet: '+79772520000',
      paymentType,
    });
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 100);
  });

  it('C22680 - < max amount & wallet = valid short number', async () => {
    const { data } = await banking.depositCreateRub(14999, '+79772520',
      paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 14999);
  });

  it('C22686 - amount = string-number', async () => {
    const { data } = await banking.depositCreateRub('50', '+79772520000',
      paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 50);
  });
});

describe('Create deposite for tele2_rub invalid - RUB', () => {
  it('C22681 - amount = 0', async () => {
    const { data } = await banking.depositCreateRub(0, '+79772520000',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is invalid');
  });

  it('C22682 - amount = null', async () => {
    const { data } = await banking.depositCreateRub(null, '+79772520000',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is required, no default value provided');
  });

  it('C22683 - amount = empty', async () => {
    const { data } = await banking.depositCreateRub(' ', '+79772520000',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is invalid');
  });

  it('C22684 - amount = undefined', async () => {
    const { data } = await banking.depositCreateRub(undefined, '+79772520000',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is required, no default value provided');
  });

  it('C22685 - amount = string', async () => {
    const { data } = await banking.depositCreateRub('fjfj', '+79772520000',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount should have a type of number, but found string');
  });

  it('C22687 - amount double < min amount', async () => {
    const { data } = await banking.depositCreateRub(0.6, '+79772520000',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22688 - amount < min amount', async () => {
    const { data } = await banking.depositCreateRub(9, '+79772520000',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22689 - amount > max amount', async () => {
    const { data } = await banking.depositCreateRub(15001, '+79772520000',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22690 - amount double > max amount', async () => {
    const { data } = await banking.depositCreateRub(15000.000001, '+79772520000',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22694 - wallet = empty', async () => {
    const { data } = await banking.depositCreateRub(100, '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный формат кошелька');
  });

  it('C22695 - wallet = number', async () => {
    const { data } = await banking.depositCreateRub(100, 111122223330000,
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, wallet should have a type of string, but found number');
  });

  it('C22696 - wallet = short phone', async () => {
    const { data } = await banking.depositCreateRub(100, '+7123',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный формат кошелька');
  });


  it('C22697 - wallet = long string', async () => {
    const { data } = await banking.depositCreateRub(100,
      '+797798778987',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный формат кошелька');
  });

  // Не знаю что тут должно быть
  it('C22693 incorrect paymentType = tele2_rub_test', async () => {
    const { data } = await banking.depositCreateRub(100,
      '+79001234567',
      'tele2_rub_test', currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный способ оплаты');
  });
});
