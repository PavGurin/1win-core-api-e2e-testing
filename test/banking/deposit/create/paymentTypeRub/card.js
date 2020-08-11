import { banking } from '../../../../../src/methods/banking';
import { checkErrMsg } from '../../../../../src/responseChecker';
import { register } from '../../../../../src/methods/register';
import { getLastDeposit, successDbDeposit } from '../../../../../src/expects/exBanking';

const paymentType = 'card_rub';
const currency = 'RUB';
let user = {};

describe('Create deposite for card_rub - RUB', () => {
  beforeEach(async () => {
    user = await register.oneClickReg();
  });

  it('C22538 - min amount', async () => {
    await banking.depositCreate('3333444455556666', paymentType, currency, 100);
    await successDbDeposit(user.data.id, 100, '3333444455556666',
      'card_rub', 'RUB');
  });

  it('C22539 - > min amount', async () => {
    await banking.depositCreate('9090787856564545', paymentType, currency, 101.31);
    await successDbDeposit(user.data.id, 101.31, '9090787856564545',
      'card_rub', 'RUB');
  });

  it('C22540 - max amount', async () => {
    await banking.depositCreate('0909090999990909', paymentType, currency, 100000);
    await successDbDeposit(user.data.id, 100000, '0909090999990909',
      'card_rub', 'RUB');
  });

  it('C22541 - < max amount', async () => {
    await banking.depositCreate('5566556644553344', paymentType, currency, 99999);
    await successDbDeposit(user.data.id, 99999, '5566556644553344',
      'card_rub', 'RUB');
  });

  it('C22543 wallet = undefined', async () => {
    await banking.depositCreate(undefined, paymentType, currency, 100);
    const dbResult = await getLastDeposit(user.data.id);
    expect(dbResult.length).toEqual(0);
  });
});

describe('Create deposite for card_rub invalid - RUB', () => {
  beforeEach(async () => {
    await register.oneClickReg();
  });

  it('C22516 - amount double < min amount', async () => {
    const { data } = await banking.depositCreate('', paymentType, currency, 90.6);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22517 - 1 < amount < min amount', async () => {
    const { data } = await banking.depositCreate('', paymentType, currency, 99);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22518 - amount > max amount', async () => {
    const { data } = await banking.depositCreate('', paymentType, currency, 100001);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22519 - amount doudle > max amount ', async () => {
    const { data } = await banking.depositCreate('', paymentType, currency, 100000.56);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22535 (-) wallet = empty', async () => {
    const { data } = await banking.depositCreate('', paymentType, currency, 100);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный формат кошелька');
  });
});
