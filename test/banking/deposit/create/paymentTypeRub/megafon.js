import { register } from '../../../../../src/methods/register';
import { banking } from '../../../../../src/methods/banking';
import { checkErrMsg } from '../../../../../src/responseChecker';
import { getLastDeposit, successDbDeposit } from '../../../../../src/expects/exBanking';

const paymentType = 'megafon_rub';
const currency = 'RUB';
let user = {};

describe('Create deposite for megafon_rub - RUB', () => {
  beforeEach(async () => {
    user = await register.oneClickReg();
  });

  it('C22526 - (+) amount = 100 & wallet = (+7)phone', async () => {
    await banking.depositCreate('+79001234567', paymentType, currency, 100);
    await successDbDeposit(user.data.id, 100, '9001234567',
      'megafon_rub', 'RUB');
  });

  it('C22529 - min amount & wallet = symbols', async () => {
    await banking.depositCreate('79215598286', paymentType, currency, 10);
    await successDbDeposit(user.data.id, 10, '9215598286',
      'megafon_rub', 'RUB');
  });

  it('C22530 - > min amount & wallet = symbols', async () => {
    await banking.depositCreate('79215598286', paymentType, currency, 11);
    await successDbDeposit(user.data.id, 11, '9215598286',
      'megafon_rub', 'RUB');
  });

  it('C22531 - max amount & wallet = numbers', async () => {
    await banking.depositCreate('+79001234567', paymentType, currency, 15000);
    await successDbDeposit(user.data.id, 15000, '9001234567',
      'megafon_rub', 'RUB');
  });

  it('C2196282 wallet = undefined', async () => {
    await banking.depositCreate(undefined, paymentType, currency, 1000);
    const dbResult = await getLastDeposit(user.data.id);
    expect(dbResult.length).toEqual(0);
  });
});

describe('Create deposite for megafon_rub invalid - RUB', () => {
  beforeEach(async () => {
    await register.oneClickReg();
  });

  it('C28675 - amount double < min amount', async () => {
    const { data } = await banking.depositCreate('+79001234567', paymentType, currency, 0.6);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C28676 - amount < min amount', async () => {
    const { data } = await banking.depositCreate('+79001234567', paymentType, currency, 9);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C28677 - amount > max amount', async () => {
    const { data } = await banking.depositCreate('+79001234567', paymentType, currency, 15001);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C28678 - amount double > max amount', async () => {
    const { data } = await banking.depositCreate('+79001234567', paymentType, currency, 15000.000001);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22560 wallet = long phone', async () => {
    const { data } = await banking.depositCreate('+790012345670909', paymentType, currency, 100);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный формат кошелька');
  });

  it('C22534 (-) < max amount & wallet = valid short number', async () => {
    const { data } = await banking.depositCreate('+79001234', paymentType, currency, 14999);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный формат кошелька');
  });
});
