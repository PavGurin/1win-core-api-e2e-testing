import { banking } from '../../../../../src/methods/banking';
import { successDepositCreate } from '../../../../../src/expects/exBanking';
import { checkErrMsg } from '../../../../../src/responseChecker';
import { register } from '../../../../../src/methods/register';

const paymentType = 'eth_usd';
const currency = 'RUB';

describe.skip('Create deposit for eth_usd - RUB @master', () => {
  beforeAll(async () => {
    await register.oneClickReg();
  });

  it('C28665 - (+) amount = 751 & wallet = (+7)phone', async () => {
    const { data } = await banking.depositCreateRub(
      751, '+79001234567', paymentType, currency,
    );
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 751);
  });

  it('C28666 - min amount & wallet = symbols', async () => {
    const { data } = await banking.depositCreateRub(750,
      '+79215598289', paymentType, currency);

    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 750);
  });

  it('C28667 - max amount & wallet = numbers', async () => {
    const { data } = await banking.depositCreateRub(21000,
      '+79215598226', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 21000);
  });

  it('C28668 - < max amount & wallet = numbers', async () => {
    const { data } = await banking.depositCreateRub(20999, '+79215598236',
      paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 20999);
  });
});

describe('Create deposite for eth_usd invalid - RUB', () => {
  it('C28669 - amount = 0', async () => {
    const { data } = await banking.depositCreateRub(0, '+79215598256',
      paymentType, currency);
      // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is invalid');
  });


  it('C28670 - amount double < min amount', async () => {
    const { data } = await banking.depositCreateRub(750.6, '79215598386',
      paymentType, currency);
      // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C28671 - amount < min amount', async () => {
    const { data } = await banking.depositCreateRub(749, '79215598486',
      paymentType, currency);
      // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C28672 - amount > max amount', async () => {
    const { data } = await banking.depositCreateRub(21001, '79215598586',
      paymentType, currency);
      // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C28673 - amount double > max amount', async () => {
    const { data } = await banking.depositCreateRub(21000.000001, '79215598686',
      paymentType, currency);
      // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });
});
