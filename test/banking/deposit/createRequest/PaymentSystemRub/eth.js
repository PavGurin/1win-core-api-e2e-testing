import { banking } from '../../../../../src/methods/banking';
import { successDepositCreate } from '../../../../../src/expects/exBanking';
import { checkErrMsg } from '../../../../../src/responseChecker';
import { register } from '../../../../../src/methods/register';

const paymentType = 'eth_usd';
const currency = 'RUB';

// скип, эти тесты будут работать только на проде, т.к. на стейдже будет ответ 500
describe.skip('Create deposit for eth_usd - RUB @master', () => {
  beforeEach(async () => {
    await register.oneClickReg();
  });

  it(' - (+) amount = 151 & wallet = (+7)phone', async () => {
    const { data } = await banking.depositCreateRequest('+79001234567', paymentType, currency, 1751);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 1751);
  });

  it(' - min amount & wallet = symbols', async () => {
    const { data } = await banking.depositCreateRequest('+79215598289', paymentType, currency, 1750);

    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 1750);
  });

  it(' - max amount & wallet = numbers', async () => {
    const { data } = await banking.depositCreateRequest('+79215598226', paymentType, currency, 21000);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 21000);
  });

  it(' - < max amount & wallet = numbers', async () => {
    const { data } = await banking.depositCreateRequest('+79215598236', paymentType, currency, 20999);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 20999);
  });
});

describe.skip('Create deposite for eth_usd invalid - RUB', () => {
  beforeEach(async () => {
    await register.oneClickReg();
  });
  it(' - amount = 0', async () => {
    const { data } = await banking.depositCreateRequest('+79215598256', paymentType, currency, 0);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is invalid');
  });


  it(' - amount double < min amount', async () => {
    const { data } = await banking.depositCreateRequest('79215598386', paymentType, currency, 1749.9);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' - amount < min amount', async () => {
    const { data } = await banking.depositCreateRequest('79215598486', paymentType, currency, 1598);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' - amount > max amount', async () => {
    const { data } = await banking.depositCreateRequest('79215598586', paymentType, currency, 21001);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' - amount double > max amount', async () => {
    const { data } = await banking.depositCreateRequest('79215598686', paymentType, currency, 21000.000001);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });
});
