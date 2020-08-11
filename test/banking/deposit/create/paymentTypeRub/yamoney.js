import { register } from '../../../../../src/methods/register';
import { banking } from '../../../../../src/methods/banking';
import { checkErrMsg } from '../../../../../src/responseChecker';
import { getLastDeposit, successDbDeposit } from '../../../../../src/expects/exBanking';

const paymentType = 'yamoney_rub';
const currency = 'RUB';
let user = {};

describe('Create deposite for yamoney_ru - RUB', () => {
  beforeEach(async () => {
    user = await register.oneClickReg();
  });

  it('C22646 (+) amount = double & wallet = empty', async () => {
    await banking.depositCreate('', paymentType, currency, 555.55);
    await successDbDeposit(user.data.id, 555.55, '',
      'yamoney_rub', 'RUB');
  });

  it('C22649 - min amount & wallet = symbols', async () => {
    await banking.depositCreate('123234345456 etryrt', paymentType, currency, 100);
    await successDbDeposit(user.data.id, 100, '123234345456 etryrt',
      'yamoney_rub', 'RUB');
  });

  it('C22650 - > min amount & wallet = symbols', async () => {
    await banking.depositCreate('12№%:№%:45456etryrt', paymentType, currency, 101);
    await successDbDeposit(user.data.id, 101, '12№%:№%:45456etryrt',
      'yamoney_rub', 'RUB');
  });

  it('C22651 - max amount & wallet = numbers', async () => {
    await banking.depositCreate('09090909999', paymentType, currency, 100000);
    await successDbDeposit(user.data.id, 100000, '09090909999',
      'yamoney_rub', 'RUB');
  });

  it('C22652 - < max amount & wallet = numbers', async () => {
    await banking.depositCreate('0[[[?<><?999', paymentType, currency, 99999);
    await successDbDeposit(user.data.id, 99999, '0[[[?<><?999',
      'yamoney_rub', 'RUB');
  });

  it('C22654 wallet = undefined', async () => {
    await banking.depositCreate(undefined, paymentType, currency, 1000);
    const dbResult = await getLastDeposit(user.data.id);
    expect(dbResult.length).toEqual(1);
  });
});

describe('Create deposite for yamoney_ru invalid - RUB', () => {
  beforeEach(async () => {
    await register.oneClickReg();
  });

  it('C22661 - amount double < min amount', async () => {
    const { data } = await banking.depositCreate('', paymentType, currency, 99.9);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22662 - amount < min amount', async () => {
    const { data } = await banking.depositCreate('', paymentType, currency, 59);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22663 - amount > max amount', async () => {
    const { data } = await banking.depositCreate('', paymentType, currency, 100001);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22664 - amount double > max amount', async () => {
    const { data } = await banking.depositCreate('', paymentType, currency, 100000.56);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });
});
