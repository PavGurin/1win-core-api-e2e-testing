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

  it('C28655 - (+) amount = 1751 & wallet = empty', async () => {
    const { data } = await banking.depositCreateRub(
      1751, '', paymentType, currency,
    );
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 1751);
  });

  it('C28656 - min amount & wallet = symbols', async () => {
    const { data } = await banking.depositCreateRub(1750,
      '+79215598289', paymentType, currency);

    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 1750);
  });

  it('C28660 - max amount & wallet = numbers', async () => {
    const { data } = await banking.depositCreateRub(21000,
      '+79215598226', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 21000);
  });

  it('C28661 - < max amount & wallet = numbers', async () => {
    const { data } = await banking.depositCreateRub(20999, '+79215598236',
      paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 20999);
  });
});

describe('Create deposite for btc_usd invalid - RUB', () => {
  it('C28659 - amount = 0', async () => {
    const { data } = await banking.depositCreateRub(0, '+79215598256',
      paymentType, currency);
      // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is invalid');
  });


  it('C28662 - amount double < min amount', async () => {
    const { data } = await banking.depositCreateRub(1749.6, '79215598386',
      paymentType, currency);
      // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C28663 - amount < min amount', async () => {
    const { data } = await banking.depositCreateRub(1749, '79215598486',
      paymentType, currency);
      // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C28664 - amount > max amount', async () => {
    const { data } = await banking.depositCreateRub(21001, '79215598586',
      paymentType, currency);
      // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C28657 - amount double > max amount', async () => {
    const { data } = await banking.depositCreateRub(21000.000001, '79215598686',
      paymentType, currency);
      // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });
});
