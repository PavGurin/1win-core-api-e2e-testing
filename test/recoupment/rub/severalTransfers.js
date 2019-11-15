import { userPool } from '../../../src/methods/userPool';
import { userList } from '../../../src/methods/userList';
import { banking } from '../../../src/methods/banking';
import { cases } from '../../../src/methods/cases';
import { checkErrMsg } from '../../../src/responseChecker';


// юзеры, которым было несколько трансферов
describe('Several transfers', () => {
  const USERS_NUMBER = 1;
  const DEPOSIT_AMOUNT = 100;
  let users = [];
  let currentUser = {};

  beforeEach(async () => {
    users = await userPool.usersWithTransferRub(USERS_NUMBER, DEPOSIT_AMOUNT, 2);
    // console.log(users);
    currentUser = users.pop();
    await userList.loginWithParams(
      currentUser.email, currentUser.password,
    );
    // console.log(currentUser.email, currentUser.password);
  });

  it('C1021303 - (-) nothing spent, withdraw money', async () => {
    const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(10);
    // console.log(withdrawalCheck);
    expect(withdrawalCheck.result).toEqual(false);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', DEPOSIT_AMOUNT);
    // console.log(create);
    expect(withdrawalCreate.withdrawalBlocked).toEqual(true);
  });

  it('C1021304 - (-) spent part of one transfer, withdraw money', async () => {
    const { data } = await cases.playCaseWithoutChance(2);
    // console.log(data);

    const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(data.result);
    // console.log(withdrawalCheck);
    expect(withdrawalCheck.result).toEqual(false);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', DEPOSIT_AMOUNT);
    // console.log(create);
    expect(withdrawalCreate.withdrawalBlocked).toEqual(true);
  });

  it('C1021305 - (-) spent one transfer, withdraw earned money', async () => {
    const { data } = await cases.playCaseWithoutChance(4);
    // console.log(data);

    const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(data.result);
    // console.log(withdrawalCheck);
    expect(withdrawalCheck.result).toEqual(false);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', DEPOSIT_AMOUNT);
    // console.log(create);
    expect(withdrawalCreate.withdrawalBlocked).toEqual(true);
  });

  it('C1021306 - (-) spent one transfer and part of other, withdraw money', async () => {
    await cases.playCaseWithoutChance(4);
    await cases.playCaseWithoutChance(1);

    const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(10);
    // console.log(withdrawalCheck);
    expect(withdrawalCheck.result).toEqual(false);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', DEPOSIT_AMOUNT);
    // console.log(create);
    expect(withdrawalCreate.withdrawalBlocked).toEqual(true);
  });

  it('C1021307 - (+) spent all money, withdraw amount < balance ', async () => {
    await cases.playCaseWithoutChance(4);
    await cases.playCaseWithoutChance(4);

    const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(100500);
    // console.log(withdrawalCheck);
    expect(withdrawalCheck.result).toEqual(true);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', '10');
    // console.log(withdrawalCreate);
    expect(withdrawalCreate.confirmationRequested).toEqual(false);
  });

  it('C1091385 - (-) spent all money, withdraw amount > balance', async () => {
    await cases.playCaseWithoutChance(4);
    await cases.playCaseWithoutChance(4);

    const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(100500);
    // console.log(withdrawalCheck);
    expect(withdrawalCheck.result).toEqual(true);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', '10000');
    // console.log(withdrawalCreate);
    checkErrMsg(withdrawalCreate, 403, 'Недостаточно средств');
  });
});