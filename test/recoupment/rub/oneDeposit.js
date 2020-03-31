import { userPool } from '../../../src/methods/userPool';
import { userList } from '../../../src/methods/userList';
import { banking } from '../../../src/methods/banking';
import { cases } from '../../../src/methods/cases';
import { sleep } from '../../../src/methods/utils';
import { checkRecoupment } from '../../../src/expects/exRecoupment';

// юзеры с одним депозитом
describe('One deposit', () => {
  const TEN_ROUBLES_CASE_ID = 5;
  const HUNDRED_ROUBLES_CASE_ID = 3;
  const FIFTY_ROUBLES_CASE_ID = 1;
  const USERS_NUMBER = 1;
  const DEPOSIT_AMOUNT = 100;
  let users = [];
  let currentUser = {};

  beforeEach(async () => {
    users = await userPool.usersWithDepositRub(USERS_NUMBER, DEPOSIT_AMOUNT);
    // console.log(users);
    currentUser = users.pop();
    await userList.loginWithParams(currentUser.email, currentUser.password);
    // console.log(currentUser);
    await sleep(2000);
  });

  it('C1021290 - (-) nothing spent, withdraw money', async () => {
    await checkRecoupment(currentUser.balance, false);
  });

  it('C1021291 - (-) spent part of deposit, withdraw money', async () => {
    const { data } = await cases.playCaseWithoutChance(TEN_ROUBLES_CASE_ID);
    // console.log(data);
    await sleep(2000);
    await checkRecoupment(DEPOSIT_AMOUNT - 10 + data.result, false);
  });

  it('C1021292 - (+) spent all money, withdraw amount < balance', async () => {
    const { data } = await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
    // console.log(data);
    await sleep(2000);
    await checkRecoupment(data.result, true);
  });

  it('C1021293 - (-) spent all money, withdraw amount > balance', async () => {
    const { data } = await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
    // console.log(data);
    await sleep(2000);
    await checkRecoupment('10000', '403');
  });

  it('C1022178 - (+) spent all money, cases played several times, withdraw amount < balance', async () => {
    await cases.playCaseWithoutChance(FIFTY_ROUBLES_CASE_ID);
    await cases.playCaseWithoutChance(FIFTY_ROUBLES_CASE_ID);
    await sleep(2000);
    await checkRecoupment(10, true);
  });

  it('C1086873 - (+) deposit + case + withdrawal, withdraw again', async () => {
    const { data } = await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
    await sleep(2000);
    await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', data.result / 2);
    await sleep(2000);
    await checkRecoupment(data.result / 2, true);
  });

  it('C1090487 - (-) deposit + case + withdrawal + new deposit, withdraw again', async () => {
    // console.log(currentUser.email, currentUser.password);
    const { data } = await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
    await sleep(2000);
    await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', data.result / 2);
    await sleep(2000);
    await banking.createDepositInBD(currentUser.id, 'RUB', 100, new Date(), 'mts_rub', '9111223366', 1);
    await sleep(2000);
    await checkRecoupment(data.result / 2, false);
  });
});
