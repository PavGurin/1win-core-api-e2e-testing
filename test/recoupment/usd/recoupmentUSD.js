import { userPool } from '../../../src/methods/userPool';
import { userList } from '../../../src/methods/userList';
import { cases } from '../../../src/methods/cases';
import { banking } from '../../../src/methods/banking';
import { checkErrMsg } from '../../../src/responseChecker';

// юзеры с одним депозитом Recoupument tests USD
describe('One deposit', () => {
  const USERS_NUMBER = 1;
  const DEPOSIT_AMOUNT = 100;
  let users = [];
  let currentUser = {};

  beforeEach(async () => {
    users = await userPool.usersWithDepositUSD(USERS_NUMBER, DEPOSIT_AMOUNT);
    // console.log(users);
    currentUser = users.pop();
    await userList.loginWithParams(
      currentUser.email, currentUser.password,
    );
    // console.log(currentUser);
  });

  // пока отыгрыши с валютой не работают
  // тест будет фейлиться
  it('C1086849 - (-) nothing spent, withdraw money', async () => {
    const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(10);
    // console.log(withdrawalCheck);
    expect(withdrawalCheck.result).toEqual(false);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('1212363645457878', 'card', 'USD', DEPOSIT_AMOUNT);
    // console.log(create);
    expect(withdrawalCreate.withdrawalBlocked).toEqual(true);
  });

  // пока отыгрыши с валютой не работают
  // тест будет фейлиться
  it('C1086850 - (-) spent part of deposit, withdraw money', async () => {
    const { data } = await cases.playCaseWithoutChance(10);
    // console.log(data);

    const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(data.result);
    // console.log(withdrawalCheck);
    expect(withdrawalCheck.result).toEqual(false);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('1212363645457878', 'card', 'USD', DEPOSIT_AMOUNT);
    // console.log(create);
    expect(withdrawalCreate.withdrawalBlocked).toEqual(true);
  });

  it('C1086857 - (+) spent all money, withdraw amount < balance', async () => {
    const { data } = await cases.playCaseWithoutChance(24);
    // console.log(data);

    const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(data.result);
    // console.log(withdrawalCheck);
    expect(withdrawalCheck.result).toEqual(true);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('1212363645457878', 'card', 'USD', data.result);
    // console.log(withdrawalCreate);
    expect(withdrawalCreate.confirmationRequested).toEqual(true);
  });

  it('C1086858 - (+) spent all money, withdraw amount > balance', async () => {
    const { data } = await cases.playCaseWithoutChance(24);
    // console.log(data);

    const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(100500);
    // console.log(withdrawalCheck);
    expect(withdrawalCheck.result).toEqual(true);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('1212363645457878', 'card', 'USD', '500');
    // console.log(withdrawalCreate);
    checkErrMsg(withdrawalCreate, 403, 'Недостаточно средств');
  });
});
