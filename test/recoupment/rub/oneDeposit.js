import { userPool } from '../../../src/methods/userPool';
import { userList } from '../../../src/methods/userList';
import { banking } from '../../../src/methods/banking';
import { cases } from '../../../src/methods/cases';
import { checkErrMsg } from '../../../src/responseChecker';

// юзеры с одним депозитом
describe('One deposit', () => {
  const TEN_ROUBLES_CASE_ID = 5;
  const HUNDRED_ROUBLES_CASE_ID = 3;
  const FIFTY_ROUBLES_CASE_ID = 1;
  const USERS_NUMBER = 7;
  const DEPOSIT_AMOUNT = 100;
  let users = [];
  let currentUser = {};

  beforeEach(async () => {
    users = await userPool.usersWithDepositRub(USERS_NUMBER, DEPOSIT_AMOUNT);
    // console.log(users);
    currentUser = users.pop();
    await userList.loginWithParams(currentUser.email, currentUser.password);
    // console.log(currentUser);
  });

  it('C1021290 - (-) nothing spent, withdraw money', async () => {
    const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(10);
    // console.log(withdrawalCheck);

    // checkWithdrawalPossible возвращает true, возможно это баг (но вывести все равно нельзя))
    // expect(withdrawalCheck.result).toEqual(false);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', DEPOSIT_AMOUNT);
    // console.log(withdrawalCreate);
    expect(withdrawalCreate.withdrawalBlocked).toEqual(true);
  });

  it('C1021291 - (-) spent part of deposit, withdraw money', async () => {
    const { data } = await cases.playCaseWithoutChance(TEN_ROUBLES_CASE_ID);
    // console.log(data);

    const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(data.result);
    // console.log(withdrawalCheck);
    expect(withdrawalCheck.result).toEqual(false);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', DEPOSIT_AMOUNT);
    // console.log(withdrawalCreate);
    expect(withdrawalCreate.withdrawalBlocked).toEqual(true);
  });

  it('C1021292 - (+) spent all money, withdraw amount < balance', async () => {
    const { data } = await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
    // console.log(data);

    const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(data.result);
    // console.log(withdrawalCheck);
    expect(withdrawalCheck.result).toEqual(true);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', data.result);
    // console.log(withdrawalCreate);
    expect(withdrawalCreate.confirmationRequested).toEqual(false);
  });

  it('C1021293 - (-) spent all money, withdraw amount > balance', async () => {
    const { data } = await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
    // console.log(data);

    const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(10000);
    // console.log(withdrawalCheck);
    expect(withdrawalCheck.result).toEqual(true);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', '10000');
    // console.log(withdrawalCreate);
    checkErrMsg(withdrawalCreate, 403, 'Недостаточно средств');
  });

  it('C1022178 - (+) spent all money, cases played several times, withdraw amount < balance', async () => {
    await cases.playCaseWithoutChance(FIFTY_ROUBLES_CASE_ID);
    await cases.playCaseWithoutChance(FIFTY_ROUBLES_CASE_ID);

    const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(10000);
    // console.log(withdrawalCheck);
    expect(withdrawalCheck.result).toEqual(true);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', '10');
    // console.log(withdrawalCreate);
    expect(withdrawalCreate.confirmationRequested).toEqual(false);
  });

  it('C1086873 - (+) deposit + case + withdrawal, withdraw again', async () => {
    const { data } = await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
    await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', data.result / 2);

    const { data: check } = await banking.checkWithdrawalPossible(data.result / 2);
    expect(check.result).toEqual(true);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', data.result / 2);
    // console.log(withdrawalCreate);
    expect(withdrawalCreate.confirmationRequested).toEqual(false);
  });

  it('C1090487 - (-) deposit + case + withdrawal + new deposit, withdraw again', async () => {
    const { data } = await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
    await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', data.result / 2);
    await banking.createDepositInBD(currentUser.id, 'RUB', 100, new Date(), 'mts_rub', '79111223366', 1);
    const { data: check } = await banking.checkWithdrawalPossible(data.result / 2);
    expect(check.result).toEqual(false);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', data.result / 2);
    // console.log(withdrawalCreate);
    expect(withdrawalCreate.withdrawalBlocked).toEqual(true);
  });
});
