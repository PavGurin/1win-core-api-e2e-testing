import { banking } from '../../../../../src/methods/banking';
import { successDepositCreate } from '../../../../../src/expects/exBanking';
import { checkErrMsg } from '../../../../../src/responseChecker';
import { register } from '../../../../../src/methods/register';

const paymentType = 'btc_usd';
const currency = 'RUB';

describe.skip('Create deposit for btc_usd - RUB @master', () => {
  beforeAll(async () => {
    await register.oneClickReg();
  });

  it(' - (+) amount = 1750 & wallet = (+7)phone', async () => {
    const { data } = await banking.depositCreateRequestRub(
      1751, '+79001234567', paymentType, currency,
    );
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 1751);
  });

  it(' - min amount & wallet = symbols', async () => {
    const { data } = await banking.depositCreateRequestRub(1750,
      '+79215598289', paymentType, currency);

    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 1750);
  });

  it(' - max amount & wallet = numbers', async () => {
    const { data } = await banking.depositCreateRequestRub(21000,
      '+79215598226', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 21000);
  });

  it(' - < max amount & wallet = numbers', async () => {
    const { data } = await banking.depositCreateRequestRub(20999, '+79215598236',
      paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 20999);
  });
});

describe.skip('Create deposite for btc_usd invalid - RUB', () => {
  it(' - amount = 0', async () => {
    const { data } = await banking.depositCreateRequestRub(0, '+79215598256',
      paymentType, currency);
      // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is invalid');
  });


  it(' - amount double < min amount', async () => {
    const { data } = await banking.depositCreateRequestRub(1749.6, '79215598386',
      paymentType, currency);
      // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' - amount < min amount', async () => {
    const { data } = await banking.depositCreateRequestRub(1749, '79215598486',
      paymentType, currency);
      // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' - amount > max amount', async () => {
    const { data } = await banking.depositCreateRequestRub(21001, '79215598586',
      paymentType, currency);
      // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' - amount double > max amount', async () => {
    const { data } = await banking.depositCreateRequestRub(21000.000001, '79215598686',
      paymentType, currency);
      // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });
});
