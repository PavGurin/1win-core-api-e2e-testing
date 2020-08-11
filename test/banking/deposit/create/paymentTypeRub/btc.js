import { banking } from '../../../../../src/methods/banking';
import { checkErrMsg } from '../../../../../src/responseChecker';
import { register } from '../../../../../src/methods/register';
import { getLastDeposit, successDbDeposit } from '../../../../../src/expects/exBanking';

const paymentType = 'btc_usd';
const currency = 'RUB';
let user = {};

describe('Creating deposit for btc_usd - RUB', () => {
  beforeEach(async () => {
    user = await register.oneClickReg();
  });

  it('C28655 - (+) amount = double & wallet = empty', async () => {
    await banking.depositCreate('', paymentType, currency, 2251.7);
    await successDbDeposit(user.data.id, 2251.7, '',
      'btc_usd', 'RUB');
  });

  it('C28656 - min amount & wallet = symbols', async () => {
    await banking.depositCreate('+79215598289', paymentType, currency, 2250);
    await successDbDeposit(user.data.id, 2250, '+79215598289',
      'btc_usd', 'RUB');
  });

  it('C28660 - max amount & wallet = numbers', async () => {
    await banking.depositCreate('+79215598226', paymentType, currency, 210000);
    await successDbDeposit(user.data.id, 210000, '+79215598226',
      'btc_usd', 'RUB');
  });

  it('C28661 - < max amount & wallet = numbers', async () => {
    await banking.depositCreate('+79215598236', paymentType, currency, 200999);
    await successDbDeposit(user.data.id, 200999, '+79215598236',
      'btc_usd', 'RUB');
  });

  it('C2196285 wallet = undefined', async () => {
    await banking.depositCreate(undefined, paymentType, currency, 3000);
    const dbResult = await getLastDeposit(user.data.id);
    expect(dbResult.length).toEqual(1);
  });
});

describe('Create deposite for btc_usd invalid - RUB', () => {
  beforeEach(async () => {
    await register.oneClickReg();
  });

  it('C28659 - amount = 0', async () => {
    const { data } = await banking.depositCreate('+79215598256', paymentType, currency, 0);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is invalid');
  });


  it('C28662 - amount double < min amount', async () => {
    const { data } = await banking.depositCreate('79215598386', paymentType, currency, 2249.6);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C28663 - amount < min amount', async () => {
    const { data } = await banking.depositCreate('79215598486', paymentType, currency, 2249);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C28664 - amount > max amount', async () => {
    const { data } = await banking.depositCreate('79215598586', paymentType, currency, 210001);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C28657 - amount double > max amount', async () => {
    const { data } = await banking.depositCreate('79215598686', paymentType, currency, 210000.000001);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });
});
