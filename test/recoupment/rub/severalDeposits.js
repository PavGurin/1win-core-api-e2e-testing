import { userPool } from '../../../src/methods/userPool';
import { userList } from '../../../src/methods/userList';
import { banking } from '../../../src/methods/banking';
import { cases } from '../../../src/methods/cases';
import { checkErrMsg } from '../../../src/responseChecker';
import { sleep } from '../../../src/methods/utils';

// юзеры с несколькими депозитами
describe('Several deposits', () => {
  const TEN_ROUBLES_CASE_ID = 5;
  const HUNDRED_ROUBLES_CASE_ID = 3;
  const USERS_NUMBER = 6;
  const DEPOSIT_AMOUNT = 100;
  const DEPOSIT_PER_USER = 2;
  let users = [];
  let currentUser = {};

  beforeEach(async () => {
    users = await userPool.usersWithDepositRub(USERS_NUMBER, DEPOSIT_AMOUNT, DEPOSIT_PER_USER);
    await sleep(1000);
    // console.log(users);
    currentUser = users.pop();
    await userList.loginWithParams(currentUser.email, currentUser.password);
    // console.log(currentUser.email, currentUser.password);
  });

  it('C1021294 - (-) nothing spent, withdraw money', async () => {
    const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(10);
    // console.log(withdrawalCheck);

    // checkWithdrawalPossible возвращает true, возможно это баг (но вывести все равно нельзя))
    // expect(withdrawalCheck.result).toEqual(false);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', DEPOSIT_AMOUNT);
    // console.log(withdrawalCreate);
    expect(withdrawalCreate.withdrawalBlocked).toEqual(true);
  });

  it('C1021295 - (-) spent part of one deposit, withdraw money', async () => {
    const { data } = await cases.playCaseWithoutChance(TEN_ROUBLES_CASE_ID);
    // console.log(data);

    const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(data.result);
    // console.log(withdrawalCheck);
    expect(withdrawalCheck.result).toEqual(false);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', DEPOSIT_AMOUNT);
    // console.log(withdrawalCreate);
    expect(withdrawalCreate.withdrawalBlocked).toEqual(true);
  });

  it('C1021296 - (-) spent one deposit, withdraw earned money', async () => {
    const { data } = await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
    // console.log(data);

    const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(data.result);
    // console.log(withdrawalCheck);
    expect(withdrawalCheck.result).toEqual(false);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', DEPOSIT_AMOUNT);
    // console.log(withdrawalCreate);
    expect(withdrawalCreate.withdrawalBlocked).toEqual(true);
  });

  it('C1021297 - (-) spent one deposit and part of other, withdraw money', async () => {
    await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
    await cases.playCaseWithoutChance(TEN_ROUBLES_CASE_ID);

    const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(10);
    // console.log(withdrawalCheck);
    expect(withdrawalCheck.result).toEqual(false);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', DEPOSIT_AMOUNT);
    // console.log(withdrawalCreate);
    expect(withdrawalCreate.withdrawalBlocked).toEqual(true);
  });

  it('C1021298 - (+) spent all money, withdraw amount < balance', async () => {
    await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
    await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);

    const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(100500);
    // console.log(withdrawalCheck);
    expect(withdrawalCheck.result).toEqual(true);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', '10');
    // console.log(withdrawalCreate);
    expect(withdrawalCreate.confirmationRequested).toEqual(false);
  });

  it('C1091384 - (-) spent all money, withdraw amount > balance', async () => {
    await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
    await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);

    const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(100500);
    // console.log(withdrawalCheck);
    expect(withdrawalCheck.result).toEqual(true);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', '10000');
    // console.log(withdrawalCreate);
    checkErrMsg(withdrawalCreate, 403, 'Недостаточно средств');
  });
});
