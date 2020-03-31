import { userPool } from '../../../src/methods/userPool';
import { userList } from '../../../src/methods/userList';
import { setUserDemoWithdrawal, setUserWithdrawalBlock, setUserWithdrawalManualControl } from '../../../src/methods/user';
import { cases } from '../../../src/methods/cases';
import { sleep } from '../../../src/methods/utils';
import { checkRecoupment } from '../../../src/expects/exRecoupment';

// Юзеры с withdrawal block & withdrawal manual control
describe('Withdrawal block and manual control', () => {
  const HUNDRED_ROUBLES_CASE_ID = 3;
  const USERS_NUMBER = 1;
  const DEPOSIT_AMOUNT = 100;
  let users = [];
  let currentUser = {};
  beforeEach(async () => {
    users = await userPool.usersWithDepositRub(USERS_NUMBER, DEPOSIT_AMOUNT);
    currentUser = users.pop();
    await userList.loginWithParams(currentUser.email, currentUser.password);
    await sleep(2000);
  });

  it('C1086845 - (-) withdrawal block, nothing spent', async () => {
    await setUserWithdrawalBlock(currentUser.id);
    await sleep(2000);
    await checkRecoupment(DEPOSIT_AMOUNT, false);
  });

  it('C1086846 - (+) withdrawal block, spent all deposit', async () => {
    await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
    await setUserWithdrawalBlock(currentUser.id);
    await sleep(2000);
    await checkRecoupment('10', true);
  });

  it('C1086847 - (-) withdrawal manual control, nothing spent', async () => {
    await setUserWithdrawalManualControl(currentUser.id);
    await sleep(2000);
    await checkRecoupment(DEPOSIT_AMOUNT, false);
  });

  it('C1086848 - (+) withdrawal manual control, spent all deposit', async () => {
    await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
    await setUserWithdrawalManualControl(currentUser.id);
    await sleep(2000);
    await checkRecoupment('10', true);
  });

  // непонятно что должно быть, сейчас вывести нельзя
  it('C1086871 - (?) user demo withdrawal, nothing spent', async () => {
    await setUserDemoWithdrawal(currentUser.id);
    await setUserWithdrawalBlock(currentUser.id);
    await sleep(2000);
    await checkRecoupment('10', true);
  });

  it('C1086872 - (+) user demo withdrawal, spent all deposit', async () => {
    await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
    await setUserDemoWithdrawal(currentUser.id);
    await setUserWithdrawalBlock(currentUser.id);
    await sleep(2000);
    await checkRecoupment('10', true);
  });
});
