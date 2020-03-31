import { userPool } from '../../../src/methods/userPool';
import { userList } from '../../../src/methods/userList';
import { cases } from '../../../src/methods/cases';
import { sleep } from '../../../src/methods/utils';
import { checkRecoupment } from '../../../src/expects/exRecoupment';

// юзеры, которым был один трансфер
describe('One transfer', () => {
  const TEN_ROUBLES_CASE_ID = 5;
  const HUNDRED_ROUBLES_CASE_ID = 3;
  const USERS_NUMBER = 1;
  const DEPOSIT_AMOUNT = 100;
  let users = [];
  let currentUser = {};

  beforeEach(async () => {
    users = await userPool.usersWithTransferRub(USERS_NUMBER, DEPOSIT_AMOUNT);
    // console.log(users);
    currentUser = users.pop();
    await userList.loginWithParams(currentUser.email, currentUser.password);
    // console.log(currentUser.email, currentUser.password);
    await sleep(2000);
  });

  it('C1021299 - (-) nothing spent, withdraw money', async () => {
    await checkRecoupment(currentUser.balance, false);
  });

  it('C1021300 - (-) spent part of transfer, withdraw money', async () => {
    const { data } = await cases.playCaseWithoutChance(TEN_ROUBLES_CASE_ID);
    // console.log(data);

    await checkRecoupment(DEPOSIT_AMOUNT - 10 + data.result, false);
  });

  it('C1021301 - (+) spent all money, withdraw amount < balance', async () => {
    const { data } = await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
    // console.log(data);

    await checkRecoupment(data.result / 2, true);
  });

  it('C1021302 - (-) spent all money, withdraw amount > balance', async () => {
    const { data } = await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
    // console.log(data);

    await checkRecoupment('10000', '403');
  });
});
