import { banking } from '../../../../src/methods/banking';
import { successDepositCreate } from '../../../../src/expects/exBanking';
import { checkErrMsg } from '../../../../src/responseChecker';
import { getNewSocket } from '../../../global';
import { register } from '../../../../src/methods/register';

const paymentType = 'card';
const currency = 'USD';

describe.skip('Create deposite for card_rub - USD @master', () => {
  let socket;
  beforeEach(async () => {
    socket = await getNewSocket();
    await register.oneClickRegUSD(socket);
  });

  afterEach(() => socket.disconnect());


  it(' (+) amount = 100 & wallet = empty', async () => {
    const { data } = await banking.depositCreate(socket, '', paymentType, currency, 100);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 100);
  });

  it(' (+) amount = 100.01 & wallet = symbols', async () => {
    const { data } = await banking.depositCreate(socket, '123 autotests', paymentType, currency, 100.01);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 100.01);
  });

  it(' amount = 2000 & wallet = symbols', async () => {
    const { data } = await banking.depositCreate(socket, 'порпорпорпэ', paymentType, currency, 2000);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 2000);
  });

  it(' min amount & wallet = symbols', async () => {
    const { data } = await banking.depositCreate(socket, '123234345456 etryrt', paymentType, currency, 10);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 10);
  });

  it('> min amount & wallet = symbols', async () => {
    const { data } = await banking.depositCreate(socket, '12№%:№%:45456etryrt', paymentType, currency, 11);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 11);
  });

  it(' max amount & wallet = numbers', async () => {
    const { data } = await banking.depositCreate(socket, '09090909999', paymentType, currency, 100000);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 100000);
  });

  it('< max amount & wallet = numbers', async () => {
    const { data } = await banking.depositCreate(socket, '0[[[?<><?999', paymentType, currency, 99999);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 99999);
  });

  // Не знаю, какой должен быть результат
  it(' wallet = undefined', async () => {
    const { data } = await banking.depositCreate(socket, undefined, paymentType, currency, 100);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 100);
  });

  it(' without currency', async () => {
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

describe.skip('Create deposite for card_rub invalid - USD', () => {
  let socket;
  beforeAll(async () => {
    socket = await getNewSocket();
    await register.oneClickRegUSD(socket);
  });

  afterEach(() => socket.disconnect());
  it(' amount < min amount', async () => {
    const { data } = await banking.depositCreate(socket, '', paymentType, currency, 0.6);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' 1 < amount < min amount', async () => {
    const { data } = await banking.depositCreate(socket, '', paymentType, currency, 9);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' amount > max amount', async () => {
    const { data } = await banking.depositCreate(socket, '', paymentType, currency, 100001);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' amount doudle > max amount ', async () => {
    const { data } = await banking.depositCreate(socket, '', paymentType, currency, 100000.56);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });
});
