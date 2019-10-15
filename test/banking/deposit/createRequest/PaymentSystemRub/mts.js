import { register } from '../../../../../src/methods/register';
import { banking } from '../../../../../src/methods/banking';
import { successDepositCreate } from '../../../../../src/expects/exBanking';
import { checkErrMsg } from '../../../../../src/responseChecker';
import { getNewSocket } from '../../../../global';

const paymentType = 'mts_rub';
const currency = 'RUB';

describe.skip('Create deposite for mts_rub - RUB @master', () => {
  let socket;
  beforeAll(async () => {
    socket = await getNewSocket();
    await register.oneClickReg(socket);
  });

  it(' - (+) amount = 100 & wallet = (+7)phone', async () => {
    const { data } = await banking.depositCreateRequest(socket, '+79001234567', paymentType, currency, 100);
    // console.log
    successDepositCreate(data, currency,
      paymentType, 100);
  });

  it(' - (+) amount = 100.01 & wallet = (7)phone', async () => {
    const { data } = await banking.depositCreateRequest(socket, '79001234567', paymentType, currency, 100.01);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 100.01);
  });

  it(' - amount = 2000 & wallet = (8)phone', async () => {
    const { data } = await banking.depositCreateRequest(socket, '89001234567', paymentType, currency, 2000);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 2000);
  });

  it(' - min amount & wallet = symbols', async () => {
    const { data } = await banking.depositCreate(socket, '+79001234567', paymentType, currency, 10);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 10);
  });

  it(' - > min amount & wallet = symbols', async () => {
    const { data } = await banking.depositCreate(socket, '+79001234567', paymentType, currency, 11);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 11);
  });

  it(' - max amount & wallet = numbers', async () => {
    const { data } = await banking.depositCreate(socket, '+79001234567', paymentType, currency, 14999);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 14999);
  });

  it(' - < max amount & wallet = numbers', async () => {
    const { data } = await banking.depositCreate(socket, '+79001234567', paymentType, currency, 14998);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 14998);
  });

  it(' - without currency', async () => {
    const { data } = await socket.send('BANKING:deposit-create', {
      amount: '100',
      wallet: '+79001234567',
      paymentType,
    });
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 100);
  });

  it(' - < max amount & wallet = valid short number', async () => {
    // TODO узнать валидный короткий номер городского телефона
    const { data } = await banking.depositCreate(socket, '+79001234', paymentType, currency, 14997);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 14997);
  });
});

describe.skip('Create deposite for mts_rub invalid - RUB', () => {
  let socket;
  beforeAll(async () => {
    socket = await getNewSocket();
    await register.oneClickReg(socket);
  });
  it(' - amount = 0', async () => {
    const { data } = await banking.depositCreate(socket, '+79001234567', paymentType, currency, 0);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is invalid');
  });

  it(' - amount = null', async () => {
    const { data } = await banking.depositCreate(socket, '+79001234567', paymentType, currency, null);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is required, no default value provided');
  });

  it(' - amount = empty', async () => {
    const { data } = await banking.depositCreate(socket, '+79001234567', paymentType, currency, ' ');
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is invalid');
  });

  it(' - amount = undefined', async () => {
    const { data } = await banking.depositCreate(socket, '+79001234567', paymentType, currency, undefined);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is required, no default value provided');
  });

  it(' - amount = string', async () => {
    const { data } = await banking.depositCreate(socket, '+79001234567', paymentType, currency, 'fjfj');
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount should have a type of number, but found string');
  });

  it(' amount = string-number', async () => {
    const { data } = await banking.depositCreate(socket, '+79001234567', paymentType, currency, '50');
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' amount double < min amount', async () => {
    const { data } = await banking.depositCreate(socket, '+79001234567', paymentType, currency, 0.6);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' - amount < min amount', async () => {
    const { data } = await banking.depositCreate(socket, '+79001234567', paymentType, currency, 9);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' - amount > max amount', async () => {
    const { data } = await banking.depositCreate(socket, '+79001234567', paymentType, currency, 15000);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' - amount double> max amount', async () => {
    const { data } = await banking.depositCreate(socket, '+79001234567', paymentType, currency, 14999.000001);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' - wallet = undefined', async () => {
    const { data } = await banking.depositCreate(socket, undefined, paymentType, currency, 100);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный формат кошелька');
  });

  it(' - wallet = null', async () => {
    const { data } = await banking.depositCreate(socket, null, paymentType, currency, 100);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный формат кошелька');
  });

  // Не знаю что тут должно быть
  it(' - incorrect paymentType = mts_rub_test', async () => {
    const { data } = await banking.depositCreate(socket, '+79001234567', 'mts_rub_test', currency, 100);
    // console.log(data);
    checkErrMsg(data, 400, '?????');
  });

  it(' - wallet = empty', async () => {
    const { data } = await banking.depositCreate(socket, '', paymentType, currency, 100);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный формат кошелька');
  });

  it(' - wallet = number', async () => {
    const { data } = await banking.depositCreate(socket, 111122223330000,
      paymentType, currency, 100);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, wallet should have a type of string, but found number');
  });

  it(' - wallet = short phone', async () => {
    const { data } = await banking.depositCreate(socket, +7123, paymentType, currency, 100);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, wallet should have a type of string, but found number');
  });

  it(' - wallet = long string', async () => {
    const { data } = await banking.depositCreate(socket, '+797798778987', paymentType, currency, 100);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный формат кошелька');
  });
});
