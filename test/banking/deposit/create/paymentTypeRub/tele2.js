import { banking } from '../../../../../src/methods/banking';
import { checkErrMsg } from '../../../../../src/responseChecker';
import { register } from '../../../../../src/methods/register';
import { getLastDeposit, successDbDeposit } from '../../../../../src/expects/exBanking';

const paymentType = 'tele2_rub';
const currency = 'RUB';
let user = {};

describe('Create deposite for tele2 - RUB', () => {
  beforeEach(async () => {
    user = await register.oneClickReg();
  });

  it('C22672 - (+) amount = 100 & wallet = (+7)phone', async () => {
    await banking.depositCreate('+79772520000', paymentType, currency, 100);
    await successDbDeposit(user.data.id, 100, '9772520000',
      'tele2_rub', 'RUB');
  });

  it('C22675 - min amount & wallet = symbols', async () => {
    await banking.depositCreate('+79772520000', paymentType, currency, 10);
    await successDbDeposit(user.data.id, 10, '9772520000',
      'tele2_rub', 'RUB');
  });

  it('C22676 - > min amount & wallet = symbols', async () => {
    await banking.depositCreate('+79772520000', paymentType, currency, 11);
    await successDbDeposit(user.data.id, 11, '9772520000',
      'tele2_rub', 'RUB');
  });

  it('C22677 - max amount & wallet = numbers', async () => {
    await banking.depositCreate('+79772520000', paymentType, currency, 15000);
    await successDbDeposit(user.data.id, 15000, '9772520000',
      'tele2_rub', 'RUB');
  });

  it('C22678 - < max amount & wallet = numbers', async () => {
    await banking.depositCreate('+79772520000', paymentType, currency, 14999);
    await successDbDeposit(user.data.id, 14999, '9772520000',
      'tele2_rub', 'RUB');
  });

  it('C2196278 wallet = undefined', async () => {
    await banking.depositCreate(undefined, paymentType, currency, 1000);
    const dbResult = await getLastDeposit(user.data.id);
    expect(dbResult.length).toEqual(0);
  });
});

describe('Create deposite for tele2_rub invalid - RUB', () => {
  beforeEach(async () => {
    await register.oneClickReg();
  });

  it('C22687 - amount double < min amount', async () => {
    const { data } = await banking.depositCreate('+79772520000', paymentType, currency, 0.6);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22688 - amount < min amount', async () => {
    const { data } = await banking.depositCreate('+79772520000', paymentType, currency, 9);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22689 - amount > max amount', async () => {
    const { data } = await banking.depositCreate('+79772520000', paymentType, currency, 15001);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22690 - amount double > max amount', async () => {
    const { data } = await banking.depositCreate('+79772520000', paymentType, currency, 15000.000001);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });
});
