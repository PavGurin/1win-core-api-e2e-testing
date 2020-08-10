import { register } from '../../../../../src/methods/register';
import { banking } from '../../../../../src/methods/banking';
import { checkErrMsg } from '../../../../../src/responseChecker';
import { getLastDeposit, successDbDeposit } from '../../../../../src/expects/exBanking';

const paymentType = 'piastrix_rub';
const currency = 'RUB';
let user = {};

describe('Create deposite for piastrix_rub - RUB ', () => {
  beforeEach(async () => {
    user = await register.oneClickReg();
  });

  it('C22594 - (+) amount = 100 & wallet = empty', async () => {
    await banking.depositCreate('', paymentType, currency, 100);
    await successDbDeposit(user.data.id, 100, '',
      'piastrix_rub', 'RUB');
  });

  it('C22597 - min amount & wallet = symbols', async () => {
    await banking.depositCreate('123234345456 etryrt', paymentType, currency, 1);
    await successDbDeposit(user.data.id, 1, '123234345456 etryrt',
      'piastrix_rub', 'RUB');
  });

  it('C22598 - > min amount & wallet = symbols', async () => {
    await banking.depositCreate('12№%:№%:45456etryrt', paymentType, currency, 2);
    await successDbDeposit(user.data.id, 2, '12№%:№%:45456etryrt',
      'piastrix_rub', 'RUB');
  });

  it('C22600 - < max amount & wallet = numbers', async () => {
    await banking.depositCreate('0[[[?<><?999', paymentType, currency, 99999);
    await successDbDeposit(user.data.id, 99999, '0[[[?<><?999',
      'piastrix_rub', 'RUB');
  });

  it('C2196280 wallet = undefined', async () => {
    await banking.depositCreate(undefined, paymentType, currency, 1000);
    const dbResult = await getLastDeposit(user.data.id);
    expect(dbResult.length).toEqual(1);
  });
});

describe('Create deposite for piastrix_rub invalid - RUB', () => {
  beforeEach(async () => {
    await register.oneClickReg();
  });

  it('C22609 - amount double < min amount', async () => {
    const { data } = await banking.depositCreate('', paymentType, currency, 0.6);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22611 - amount > max amount', async () => {
    const { data } = await banking.depositCreate('', paymentType, currency, 100001);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22612 - amount double > max amount', async () => {
    const { data } = await banking.depositCreate('', paymentType, currency, 100000.56);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });
});
