import { register } from '../../../../../src/methods/register';
import { banking } from '../../../../../src/methods/banking';
import { successDepositCreate } from '../../../../../src/expects/exBanking';
import { checkErrMsg } from '../../../../../src/responseChecker';
import { getNewSocket } from '../../../../global';

const paymentType = 'card_rub';
const currency = 'RUB';

describe.skip('Create deposite for card_rub - RUB @master', () => {
  let socket;
  beforeAll(async () => {
    socket = await getNewSocket();
    await register.oneClickReg(socket);
  });

  it(' - (+) amount = 100 & wallet = empty', async () => {
    const { data } = await banking.depositCreateRequest(socket, '', paymentType, currency, 100);
    // console.log
    successDepositCreate(data, currency,
      paymentType, 100);
  });

  it(' - (+) amount = 100.01 & wallet = symbols', async () => {
    const { data } = await banking.depositCreateRequest(socket, '123 autotests', paymentType, currency, 100.01);
    // console.log
    successDepositCreate(data, currency,
      paymentType, 100.01);
  });

  it(' - amount = 2000 & wallet = symbols', async () => {
    const { data } = await banking.depositCreateRequest(socket, 'порпорпорпэ', paymentType, currency, 2000);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 2000);
  });

  it(' - min amount & wallet = symbols', async () => {
    const { data } = await banking.depositCreateRequest(socket, '123234345456 etryrt', paymentType, currency, 10);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 10);
  });

  it(' - > min amount & wallet = symbols', async () => {
    const { data } = await banking.depositCreateRequest(socket, '12№%:№%:45456etryrt', paymentType, currency, 11);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 11);
  });

  it(' - max amount & wallet = numbers', async () => {
    const { data } = await banking.depositCreateRequest(socket, '0909090999987878', paymentType, currency, 100000);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 100000);
  });

  it(' - < max amount & wallet = numbers', async () => {
    const { data } = await banking.depositCreateRequest(socket, '0[[[?<><?999', paymentType, currency, 99999);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 99999);
  });

  // Не знаю, какой должен быть результат
  it(' - wallet = undefined', async () => {
    const { data } = await banking.depositCreateRequest(socket, undefined, paymentType,
      currency, 100);
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
    // console.log
    successDepositCreate(data, currency,
      paymentType, 100);
  });
});

describe.skip('Create deposite for card_rub invalid - RUB', () => {
  let socket;
  beforeAll(async () => {
    socket = await getNewSocket();
    await register.oneClickReg(socket);
  });
  it(' - amount = 0', async () => {
    const { data } = await banking.depositCreateRequest(socket, '', paymentType, currency, 0);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is invalid');
  });

  it(' - amount = null', async () => {
    const { data } = await banking.depositCreateRequest(socket, '', paymentType, currency, null);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is required, no default value provided');
  });

  it(' - amount = empty', async () => {
    const { data } = await banking.depositCreateRequest(socket, '', paymentType, currency, ' ');
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is invalid');
  });

  it(' - amount = undefined', async () => {
    const { data } = await banking.depositCreateRequest(socket, '', paymentType, currency, undefined);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is required, no default value provided');
  });

  it(' - amount = string', async () => {
    const { data } = await banking.depositCreateRequest(socket, '', paymentType, currency, 'fjfj');
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount should have a type of number, but found string');
  });

  it(' - amount = string - number', async () => {
    const { data } = await banking.depositCreateRequest(socket, '', paymentType, currency, '50');
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' - amount double < min amount', async () => {
    const { data } = await banking.depositCreateRequest(socket, '', paymentType, currency, 0.6);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' - 1 < amount < min amount', async () => {
    const { data } = await banking.depositCreateRequest(socket, '', paymentType, currency, 9);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' - amount > max amount', async () => {
    const { data } = await banking.depositCreateRequest(socket, '', paymentType, currency, 100001);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' - amount doudle > max amount ', async () => {
    const { data } = await banking.depositCreateRequest(socket, '', paymentType, currency, 100000.56);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' - wallet = null', async () => {
    const { data } = await banking.depositCreateRequest(socket, null, paymentType, currency, 100);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный формат кошелька');
  });

  it(' - wallet = long string', async () => {
    const { data } = await banking.depositCreateRequest(socket, '1231231231231231453453345345342312312312312123123123123', paymentType, currency, 10);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный формат кошелька');
  });

  // Не знаю что тут должно быть
  it(' - incorrect paymentType = card_rub_test', async () => {
    const { data } = await banking.depositCreateRequest(socket, '3123123123', 'card_rub_test', currency, 10);
    // console.log(data);
    checkErrMsg(data, 400, '?????');
  });
});
