import { register } from '../../../../../src/methods/register';
import { banking } from '../../../../../src/methods/banking';
import { successDepositCreate } from '../../../../../src/expects/exBanking';
import { checkErrMsg } from '../../../../../src/responseChecker';
import { getNewSocket } from '../../../../global';

const paymentType = 'beeline_rub';
const currency = 'USD';

describe('Create deposite for beeline_rub - USD @master', () => {
  let socket;

  beforeEach(async () => {
    socket = await getNewSocket();
    await register.oneClickRegUSD(socket);
  });

  afterEach(() => socket.disconnect());

  it(' (+) amount = 100 & wallet = (+7)phone', async () => {
    const { data } = await banking.depositCreate(
      50, '+79215598286', paymentType, currency,
    );
    // console.log
    successDepositCreate(data, currency,
      paymentType, 100);
  });

  it(' (+) amount = 100.01 & wallet = (7)phone', async () => {
    const { data } = await banking.depositCreate(
      100.01, '79215598286', paymentType, currency,
    );
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 100.01);
  });

  it(' amount = 2000 & wallet = (8)phone', async () => {
    const { data } = await banking.depositCreate(
      2000, '89215598286', paymentType, currency,
    );
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 2000);
  });

  it(' min amount & wallet = symbols', async () => {
    const { data } = await banking.depositCreate(10,
      '+79215598286', paymentType, currency);

    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 10);
  });

  it('> min amount & wallet = symbols', async () => {
    const { data } = await banking.depositCreate(11,
      '+79215598286', paymentType, currency);

    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 11);
  });

  it(' max amount & wallet = numbers', async () => {
    const { data } = await banking.depositCreate(15000,
      '+79215598286', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 15000);
  });

  it('< max amount & wallet = numbers', async () => {
    const { data } = await banking.depositCreate(14999, '+79215598286',
      paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 14999);
  });

  it(' without currency', async () => {
    const { data } = await socket.send('BANKING:deposit-create', {
      amount: '100',
      wallet: '+79215598286',
      paymentType,
    });
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 100);
  });

  it('< max amount & wallet = valid short number', async () => {
    // TODO узнать валидный короткий номер городского телефона
    const { data } = await banking.depositCreate(14999, '+79001234',
      paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 14999);
  });
});

describe('Create deposite for beeline_rub invalid - USD', () => {
  it('  amount double < min amount', async () => {
    await register.oneClickReg(socket);
    const { data } = await banking.depositCreate(0.6, '79215598286',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is invalid');
  });

  it(' amount < min amount', async () => {
    await register.oneClickReg(socket);
    const { data } = await banking.depositCreate(9, '79215598286',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' amount > max amount', async () => {
    await register.oneClickReg(socket);
    const { data } = await banking.depositCreate(15001, '79215598286',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' amount double > max amount', async () => {
    await register.oneClickReg(socket);
    const { data } = await banking.depositCreate(15000.000001, '79215598286',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });
});
