import { userPool } from '../../../src/methods/userPool';
import { userList } from '../../../src/methods/userList';
import { banking } from '../../../src/methods/banking';
import { cases } from '../../../src/methods/cases';
import { checkErrMsg } from '../../../src/responseChecker';

// юзеры, которым был один трансфер
describe('One transfer', () => {
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
  });

  it('C1021299 - (-) nothing spent, withdraw money', async () => {
    const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(10);
    // console.log(withdrawalCheck);
    expect(withdrawalCheck.result).toEqual(false);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', DEPOSIT_AMOUNT);
    // console.log(create);
    expect(withdrawalCreate.withdrawalBlocked).toEqual(true);
  });

  it('C1021300 - (-) spent part of transfer, withdraw money', async () => {
    const { data } = await cases.playCaseWithoutChance(2);
    // console.log(data);

    const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(data.result);
    // console.log(withdrawalCheck);
    expect(withdrawalCheck.result).toEqual(false);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', DEPOSIT_AMOUNT);
    // console.log(create);
    expect(withdrawalCreate.withdrawalBlocked).toEqual(true);
  });

  it('C1021301 - (+) spent all money, withdraw amount < balance', async () => {
    const { data } = await cases.playCaseWithoutChance(4);
    // console.log(data);

    const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(data.result);
    // console.log(withdrawalCheck);
    expect(withdrawalCheck.result).toEqual(true);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', data.result / 2);
    // console.log(withdrawalCreate);
    expect(withdrawalCreate.confirmationRequested).toEqual(false);
  });

  it('C1021302 - (-) spent all money, withdraw amount > balance', async () => {
    const { data } = await cases.playCaseWithoutChance(4);
    // console.log(data);

    const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(100500);
    // console.log(withdrawalCheck);
    expect(withdrawalCheck.result).toEqual(true);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', '10000');
    // console.log(withdrawalCreate);
    checkErrMsg(withdrawalCreate, 403, 'Недостаточно средств');
  });
});
