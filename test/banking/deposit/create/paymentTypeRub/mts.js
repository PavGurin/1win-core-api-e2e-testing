import { register } from '../../../../../src/methods/register';
import { banking } from '../../../../../src/methods/banking';
import { checkErrMsg } from '../../../../../src/responseChecker';
import { getLastDeposit, successDbDeposit } from '../../../../../src/expects/exBanking';

const paymentType = 'mts_rub';
const currency = 'RUB';
let user = {};

describe('Create deposite for mts_rub - RUB', () => {
  beforeEach(async () => {
    user = await register.oneClickReg();
  });

  it('C22568 - (+) amount = min amount & wallet = (+7)phone', async () => {
    await banking.depositCreate('+79001234567', paymentType, currency, 100);
    await successDbDeposit(user.data.id, 100, '9001234567',
      'mts_rub', 'RUB');
  });

  it('C22571 - amount = double & wallet = (7)phone', async () => {
    await banking.depositCreate('79001234567', paymentType, currency, 225.14);
    await successDbDeposit(user.data.id, 225.14, '9001234567',
      'mts_rub', 'RUB');
  });

  it('C22572 - > min amount & wallet = phone without 7', async () => {
    await banking.depositCreate('+79001234567', paymentType, currency, 110);
    await successDbDeposit(user.data.id, 110, '9001234567',
      'mts_rub', 'RUB');
  });

  it('C22573 - max amount & wallet = (+7)phone)', async () => {
    await banking.depositCreate('+79001234567', paymentType, currency, 14999);
    await successDbDeposit(user.data.id, 14999, '9001234567',
      'mts_rub', 'RUB');
  });

  it('C2196281 wallet = undefined', async () => {
    await banking.depositCreate(undefined, paymentType, currency, 1000);
    const dbResult = await getLastDeposit(user.data.id);
    expect(dbResult.length).toEqual(0);
  });
});

describe('Create deposite for mts_rub invalid - RUB', () => {
  beforeEach(async () => {
    await register.oneClickReg();
  });

  it('C22583 amount double < min amount', async () => {
    const { data } = await banking.depositCreate('+79001234567', paymentType, currency, 0.6);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22584 - amount < min amount', async () => {
    const { data } = await banking.depositCreate('+79001234567', paymentType, currency, 99);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22585 - amount > max amount', async () => {
    const { data } = await banking.depositCreate('+79001234567', paymentType, currency, 15000);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22586 - amount double> max amount', async () => {
    const { data } = await banking.depositCreate('+79001234567', paymentType, currency, 14999.000001);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });
});
