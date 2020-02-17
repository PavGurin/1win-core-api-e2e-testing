import { userPool } from '../../../src/methods/userPool';
import { userList } from '../../../src/methods/userList';
import { addBetToBD } from '../../../src/methods/betsInBD';
import { banking } from '../../../src/methods/banking';
import { checkErrMsg } from '../../../src/responseChecker';
import { cases } from '../../../src/methods/cases';
import { sleep } from '../../../src/methods/utils';

// скип, по очередной версии требований ограничения на коэффициент нет
describe.skip('Bets coeffs', () => {
  const LOSE = 1;
  const WIN = 2;
  const USERS_NUMBER = 1;
  const DEPOSIT_AMOUNT = 100;
  let users = [];
  let currentUser;

  beforeEach(async () => {
    users = await userPool.usersWithDepositRub(USERS_NUMBER, DEPOSIT_AMOUNT);
    // console.log(users);
    currentUser = users.pop();
    await userList.loginWithParams(currentUser.email, currentUser.password);
    await sleep(2000);
  });

  it('C1139208 - (+), bet with coeff > 1.1 (win), withdraw amount < balance', async () => {
    const betAmount = 100;
    const betCoeff = 2.75;
    await addBetToBD(currentUser.id, 'RUB', betAmount, betCoeff, WIN);
    await banking.setBalance(currentUser.id, betAmount * betCoeff);

    const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(
      betAmount * betCoeff,
    );
    expect(withdrawalCheck.result).toEqual(true);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', (betAmount * betCoeff).toFixed(2));
    expect(withdrawalCreate.confirmationRequested).toEqual(false);
  });

  it('C1139209 - (-), bet with coeff > 1.1 (win), withdraw amount > balance', async () => {
    const betAmount = 100;
    const betCoeff = 2.75;
    await addBetToBD(currentUser.id, 'RUB', betAmount, betCoeff, WIN);
    await banking.setBalance(currentUser.id, betAmount * betCoeff);

    const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(
      betAmount * betCoeff + 1,
    );
    expect(withdrawalCheck.result).toEqual(true);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', (betAmount * betCoeff + 1).toFixed(2));
    checkErrMsg(withdrawalCreate, 403, 'Недостаточно средств');
  });

  it('C1139220 - (+), bet with coeff = 1.1 (win)', async () => {
    const betAmount = 100;
    const betCoeff = 1.1;
    await addBetToBD(currentUser.id, 'RUB', betAmount, betCoeff, WIN);
    await banking.setBalance(currentUser.id, betAmount * betCoeff);
    // console.log(currentUser.id);

    const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(
      betAmount * betCoeff,
    );
    expect(withdrawalCheck.result).toEqual(true);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', (betAmount * betCoeff).toFixed(2));
    // console.log(withdrawalCreate);
    expect(withdrawalCreate.confirmationRequested).toEqual(false);
  });

  it('C1139232 - (-), bet with coeff < 1.1 (win)', async () => {
    const betAmount = 100;
    const betCoeff = 1.09;
    await addBetToBD(currentUser.id, 'RUB', betAmount, betCoeff, WIN);
    await banking.setBalance(currentUser.id, betAmount * betCoeff);

    const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(
      betAmount * betCoeff,
    );
    expect(withdrawalCheck.result).toEqual(false);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', (betAmount * betCoeff).toFixed(2));
    expect(withdrawalCreate.withdrawalBlocked).toEqual(true);
  });

  it('C1140136 - (-), bet with coeff < 1.1 (win) + cases', async () => {
    const betAmount = 50;
    const betCoeff = 1.09;
    await addBetToBD(currentUser.id, 'RUB', betAmount, betCoeff, WIN);
    await banking.setBalance(currentUser.id, betAmount * betCoeff);

    const { data: casesResult } = await cases.playCaseWithoutChance(3);

    const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(
      casesResult.result,
    );
    expect(withdrawalCheck.result).toEqual(false);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', casesResult.result);
    expect(withdrawalCreate.withdrawalBlocked).toEqual(true);
  });

  it('C1143819 - (+), bet with coeff > 1.1 (lose), withdrawal check = true', async () => {
    const betAmount = 100;
    const betCoeff = 2.75;
    await addBetToBD(currentUser.id, 'RUB', betAmount, betCoeff, LOSE);
    await banking.setBalance(currentUser.balance - betAmount);

    const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(
      betAmount * betCoeff,
    );
    expect(withdrawalCheck.result).toEqual(true);
  });

  it('C1143820 - (-), bet with coeff > 1.1 (lose), withdraw amount > balance', async () => {
    const betAmount = 100;
    const betCoeff = 2.75;
    await addBetToBD(currentUser.id, 'RUB', betAmount, betCoeff, LOSE);
    await banking.setBalance(currentUser.balance - betAmount);

    const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(
      betAmount * betCoeff + 1,
    );
    expect(withdrawalCheck.result).toEqual(true);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', (betAmount * betCoeff + 1).toFixed(2));
    checkErrMsg(withdrawalCreate, 403, 'Недостаточно средств');
  });

  it('C1143821 - (+), bet with coeff = 1.1 (lose)', async () => {
    const betAmount = 100;
    const betCoeff = 1.1;
    await addBetToBD(currentUser.id, 'RUB', betAmount, betCoeff, LOSE);
    await banking.setBalance(currentUser.balance - betAmount);
    // console.log(currentUser.id);

    const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(
      betAmount * betCoeff,
    );
    expect(withdrawalCheck.result).toEqual(true);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', (betAmount * betCoeff).toFixed(2));
    // console.log(withdrawalCreate);
    checkErrMsg(withdrawalCreate, 403, 'Недостаточно средств');
  });

  it('C1143822 - (-), bet with coeff < 1.1 (lose)', async () => {
    const betAmount = 100;
    const betCoeff = 1.09;
    await addBetToBD(currentUser.id, 'RUB', betAmount, betCoeff, LOSE);
    await banking.setBalance(currentUser.balance - betAmount);

    const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(
      betAmount * betCoeff,
    );
    expect(withdrawalCheck.result).toEqual(false);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', (betAmount * betCoeff).toFixed(2));
    expect(withdrawalCreate.withdrawalBlocked).toEqual(true);
  });

  it('C1143823 - (-), bet with coeff < 1.1 (win) + cases', async () => {
    const betAmount = 50;
    const betCoeff = 1.09;
    await addBetToBD(currentUser.id, 'RUB', betAmount, betCoeff, LOSE);
    await banking.setBalance(currentUser.balance - betAmount);


    const { data: casesResult } = await cases.playCaseWithoutChance(3);

    const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(
      casesResult.result,
    );
    expect(withdrawalCheck.result).toEqual(false);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', casesResult.result);
    expect(withdrawalCreate.withdrawalBlocked).toEqual(true);
  });

  it('C1146557 - (+), several bets with coeff > 1.1', async () => {
    const betAmount = 50;
    const coef1 = (Math.random() * (9) + 1).toFixed(2);
    const coef2 = (Math.random() * (9) + 1).toFixed(2);

    await addBetToBD(currentUser.id, 'RUB', betAmount, coef1, WIN);
    await addBetToBD(currentUser.id, 'RUB', betAmount, coef2, LOSE);
    await banking.setBalance(currentUser.id, betAmount * coef1);

    const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(
      betAmount * coef1,
    );
    expect(withdrawalCheck.result).toEqual(true);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', betAmount * coef1);
    expect(withdrawalCreate.confirmationRequested).toEqual(false);
  });

  it('C1146558 - (-), several bets with coeff < 1.1 ', async () => {
    const betAmount = 50;
    const coef1 = 1.02;
    const coef2 = 1.07;

    await addBetToBD(currentUser.id, 'RUB', betAmount, coef1, WIN);
    await addBetToBD(currentUser.id, 'RUB', betAmount, coef2, LOSE);
    await banking.setBalance(currentUser.id, betAmount * coef1);

    const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(
      betAmount * coef1,
    );
    expect(withdrawalCheck.result).toEqual(false);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', betAmount * coef1);
    expect(withdrawalCreate.withdrawalBlocked).toEqual(true);
  });

  it('C1146559 - (-), bet with coeff > 1.1 + bet with coeff < 1.1', async () => {
    const betAmount = 50;
    const coef1 = 1.02;
    const coef2 = 5.66;

    await addBetToBD(currentUser.id, 'RUB', betAmount, coef1, WIN);
    await addBetToBD(currentUser.id, 'RUB', betAmount, coef2, LOSE);
    await banking.setBalance(currentUser.id, betAmount * coef1);

    const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(
      betAmount * coef1,
    );
    expect(withdrawalCheck.result).toEqual(false);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', betAmount * coef1);
    expect(withdrawalCreate.withdrawalBlocked).toEqual(true);
  });
});
