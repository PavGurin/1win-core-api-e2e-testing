import { userPool } from '../../../src/methods/userPool';
import { userList } from '../../../src/methods/userList';
import { setUserDemoWithdrawal, setUserWithdrawalBlock, setUserWithdrawalManualControl } from '../../../src/methods/user';
import { banking } from '../../../src/methods/banking';
import { cases } from '../../../src/methods/cases';

// Юзеры с withdrawal block & withdrawal manual control
describe('Withdrawal block and manual control', () => {
  const USERS_NUMBER = 1;
  const DEPOSIT_AMOUNT = 100;
  let users = [];
  let currentUser = {};
  beforeEach(async () => {
    users = await userPool.usersWithDepositRub(USERS_NUMBER, DEPOSIT_AMOUNT);
    currentUser = users.pop();
    await userList.loginWithParams(currentUser.email, currentUser.password);
  });

  it('C1086845 - (-) withdrawal block, nothing spent', async () => {
    await setUserWithdrawalBlock(currentUser.id);
    const { data } = await banking.checkWithdrawalPossible(100);
    // console.log(data);
    expect(data.result).toEqual(false);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', DEPOSIT_AMOUNT);
    // console.log(create);
    expect(withdrawalCreate.withdrawalBlocked).toEqual(true);
  });

  it('C1086846 - (+) withdrawal block, spent all deposit', async () => {
    await cases.playCaseWithoutChance(4);
    await setUserWithdrawalBlock(currentUser.id);
    const { data } = await banking.checkWithdrawalPossible(100);
    // console.log(data);
    expect(data.result).toEqual(true);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', '10');
    // console.log(withdrawalCreate);
    expect(withdrawalCreate.confirmationRequested).toEqual(false);
  });

  it('C1086847 - (-) withdrawal manual control, nothing spent', async () => {
    await setUserWithdrawalManualControl(currentUser.id);
    const { data } = await banking.checkWithdrawalPossible(100);
    // console.log(data);
    expect(data.result).toEqual(false);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', DEPOSIT_AMOUNT);
    // console.log(create);
    expect(withdrawalCreate.withdrawalBlocked).toEqual(true);
  });

  it('C1086848 - (+) withdrawal manual control, spent all deposit', async () => {
    await cases.playCaseWithoutChance(4);
    await setUserWithdrawalManualControl(currentUser.id);
    const { data } = await banking.checkWithdrawalPossible(100);
    // console.log(data);
    expect(data.result).toEqual(true);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', '10');
    // console.log(withdrawalCreate);
    expect(withdrawalCreate.confirmationRequested).toEqual(false);
  });

  // непонятно что должно быть, сейчас вывести нельзя
  it('C1086871 - (?) user demo withdrawal, nothing spent', async () => {
    await setUserDemoWithdrawal(currentUser.id);
    await setUserWithdrawalBlock(currentUser.id);
    const { data } = await banking.checkWithdrawalPossible(100);
    // console.log(data);
    expect(data.result).toEqual(true);
  });

  it('C1086872 - (+) user demo withdrawal, spent all deposit', async () => {
    await cases.playCaseWithoutChance(4);
    await setUserDemoWithdrawal(currentUser.id);
    await setUserWithdrawalBlock(currentUser.id);
    const { data } = await banking.checkWithdrawalPossible(100);
    // console.log(data);
    expect(data.result).toEqual(true);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', '10');
    // console.log(withdrawalCreate);
    expect(withdrawalCreate.confirmationRequested).toEqual(false);
  });
});
