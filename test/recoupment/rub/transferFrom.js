import { userPool } from '../../../src/methods/userPool';
import { userList } from '../../../src/methods/userList';
import { banking } from '../../../src/methods/banking';
import { cases } from '../../../src/methods/cases';
import { sleep } from '../../../src/methods/utils';
import { checkRecoupment } from '../../../src/expects/exRecoupment';

// юзеры, которые делют исходящий перевод
describe('Users with transfer from', () => {
  const TEN_ROUBLES_CASE_ID = 5;
  const HUNDRED_ROUBLES_CASE_ID = 3;
  const USERS_NUMBER = 1;
  const DEPOSIT_AMOUNT = 200;
  let users = [];
  let currentUser = {};

  beforeEach(async () => {
    users = await userPool.usersWithDepositRub(USERS_NUMBER, DEPOSIT_AMOUNT);
    // console.log(users);
    currentUser = users.pop();
    await userList.loginWithParams(
      currentUser.email, currentUser.password,
    );
    // console.log(currentUser.email, currentUser.password);
    await sleep(2000);
  });

  it('C1021308 - (+) transfer all deposit, can withdraw any amount', async () => {
    await banking.transferCreate(DEPOSIT_AMOUNT, 'RUB');
    await banking.setBalance(currentUser.id, 10);
    await checkRecoupment(10, true);
  });

  it('C1021309 - (-) transfer part of deposit, withdraw money', async () => {
    await banking.transferCreate(DEPOSIT_AMOUNT / 2, 'RUB');
    await checkRecoupment(DEPOSIT_AMOUNT / 2, false);
  });

  it('C1021310 - (-) transfer part of deposit, spent part of remaining money, withdraw money', async () => {
    await banking.transferCreate(DEPOSIT_AMOUNT / 2, 'RUB');
    await cases.playCaseWithoutChance(TEN_ROUBLES_CASE_ID);
    await checkRecoupment(10, false);
  });

  it('C1021311 - (+) transfer part of deposit, spent remained money, withdraw amount <= balance', async () => {
    await banking.transferCreate(100, 'RUB');
    await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
    const balance = await banking.balanceCheck();
    await checkRecoupment(balance, true);
  });

  it('C1091386 - (-) transfer part of deposit, spent remained money, withdraw amount > balance', async () => {
    await banking.transferCreate(100, 'RUB');
    await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
    const balance = await banking.balanceCheck();
    await checkRecoupment(balance + 1, '403');
  });
});
