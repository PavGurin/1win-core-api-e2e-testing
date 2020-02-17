import { userPool } from '../../../src/methods/userPool';
import { userList } from '../../../src/methods/userList';
import { banking } from '../../../src/methods/banking';
import { cases } from '../../../src/methods/cases';
import { checkErrMsg } from '../../../src/responseChecker';
import { sleep } from '../../../src/methods/utils';

// юзеры, которые делют исходящий перевод
describe('Users with transfer from', () => {
  const TEN_ROUBLES_CASE_ID = 5;
  const HUNDRED_ROUBLES_CASE_ID = 3;
  const USERS_NUMBER = 5;
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
    const { data } = await banking.checkWithdrawalPossible(10);
    expect(data.result).toEqual(true);
  });

  it('C1021309 - (-) transfer part of deposit, withdraw money', async () => {
    await banking.transferCreate(100, 'RUB');
    const { data } = await banking.checkWithdrawalPossible(10);
    expect(data.result).toEqual(false);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', DEPOSIT_AMOUNT);
    // console.log(withdrawalCreate);
    expect(withdrawalCreate.withdrawalBlocked).toEqual(true);
  });

  it('C1021310 - (-) transfer part of deposit, spent part of remaining money, withdraw money', async () => {
    await banking.transferCreate(100, 'RUB');
    await cases.playCaseWithoutChance(TEN_ROUBLES_CASE_ID);
    const { data } = await banking.checkWithdrawalPossible(10);
    expect(data.result).toEqual(false);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', DEPOSIT_AMOUNT);
    // console.log(withdrawalCreate);
    expect(withdrawalCreate.withdrawalBlocked).toEqual(true);
  });

  it('C1021311 - (+) transfer part of deposit, spent remained money, withdraw amount <= balance', async () => {
    await banking.transferCreate(100, 'RUB');
    await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
    const { data } = await banking.checkWithdrawalPossible(100500);
    expect(data.result).toEqual(true);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', '10');
    // console.log(withdrawalCreate);
    expect(withdrawalCreate.confirmationRequested).toEqual(false);
  });

  it('C1091386 - (-) transfer part of deposit, spent remained money, withdraw amount > balance', async () => {
    await banking.transferCreate(100, 'RUB');
    await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
    const { data } = await banking.checkWithdrawalPossible(100500);
    expect(data.result).toEqual(true);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', '10000');
    // console.log(withdrawalCreate);
    checkErrMsg(withdrawalCreate, 403, 'Недостаточно средств');
  });
});
