import { userPool } from '../../../src/methods/userPool';
import { userList } from '../../../src/methods/userList';
import { addBetToBD } from '../../../src/methods/betsInBD';
import { banking } from '../../../src/methods/banking';
import { cases } from '../../../src/methods/cases';
import { sleep } from '../../../src/methods/utils';
import { checkRecoupment } from '../../../src/expects/exRecoupment';

describe('Bets coeffs', () => {
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
    await checkRecoupment((betAmount * betCoeff).toFixed(2), true);
  });

  it('C1139209 - (-), bet with coeff > 1.1 (win), withdraw amount > balance', async () => {
    const betAmount = 100;
    const betCoeff = 2.75;
    await addBetToBD(currentUser.id, 'RUB', betAmount, betCoeff, WIN);
    await banking.setBalance(currentUser.id, betAmount * betCoeff);
    await checkRecoupment((betAmount * betCoeff + 1).toFixed(2), '403');
  });

  it('C1139220 - (+), bet with coeff = 1.1 (win)', async () => {
    const betAmount = 100;
    const betCoeff = 1.1;
    await addBetToBD(currentUser.id, 'RUB', betAmount, betCoeff, WIN);
    await banking.setBalance(currentUser.id, betAmount * betCoeff);
    // console.log(currentUser.id);
    await checkRecoupment((betAmount * betCoeff).toFixed(2), true);
  });

  it('C1139232 - (-), bet with coeff < 1.1 (win)', async () => {
    const betAmount = 100;
    const betCoeff = 1.09;
    await addBetToBD(currentUser.id, 'RUB', betAmount, betCoeff, WIN);
    await banking.setBalance(currentUser.id, betAmount * betCoeff);
    await checkRecoupment((betAmount * betCoeff).toFixed(2), false);
  });

  it('C1140136 - (-), bet with coeff < 1.1 (win) + cases', async () => {
    const betAmount = 50;
    const betCoeff = 1.09;
    await addBetToBD(currentUser.id, 'RUB', betAmount, betCoeff, WIN);
    await banking.setBalance(currentUser.id, DEPOSIT_AMOUNT - betAmount + betAmount * betCoeff);

    const { data: casesResult } = await cases.playCaseWithoutChance(1); // 50 rub
    await checkRecoupment(casesResult.result, false);
  });

  it('C2064111 - (+), bet with coeff < 1.1 (win) + cases on all deposit amount', async () => {
    const betAmount = 50;
    const betCoeff = 1.09;
    await addBetToBD(currentUser.id, 'RUB', betAmount, betCoeff, WIN);
    await banking.setBalance(currentUser.id, DEPOSIT_AMOUNT - betAmount + betAmount * betCoeff);

    const { data: casesResult } = await cases.playCaseWithoutChance(3); // 100 rub
    await checkRecoupment(casesResult.result, true);
  });

  it('C1143819 - (+), bet with coeff > 1.1 (lose), withdrawal check = true', async () => {
    const betAmount = 100;
    const betCoeff = 2.75;
    await addBetToBD(currentUser.id, 'RUB', betAmount, betCoeff, LOSE);
    await banking.setBalance(currentUser.balance - betAmount);
    await checkRecoupment((betAmount * betCoeff).toFixed(2), '403');
  });

  it('C1143820 - (-), bet with coeff > 1.1 (lose), withdraw amount > balance', async () => {
    const betAmount = 100;
    const betCoeff = 2.75;
    await addBetToBD(currentUser.id, 'RUB', betAmount, betCoeff, LOSE);
    await banking.setBalance(currentUser.balance - betAmount);
    await checkRecoupment((betAmount * betCoeff + 1).toFixed(2), '403');
  });

  it('C1143821 - (+), bet with coeff = 1.1 (lose)', async () => {
    const betAmount = 100;
    const betCoeff = 1.1;
    await addBetToBD(currentUser.id, 'RUB', betAmount, betCoeff, LOSE);
    await banking.setBalance(currentUser.balance - betAmount);
    // console.log(currentUser.id);
    await checkRecoupment((betAmount * betCoeff).toFixed(2), '403');
  });

  it('C1143822 - (-), bet with coeff < 1.1 (lose)', async () => {
    const betAmount = 100;
    const betCoeff = 1.09;
    await addBetToBD(currentUser.id, 'RUB', betAmount, betCoeff, LOSE);
    await banking.setBalance(currentUser.balance - betAmount);
    await checkRecoupment((betAmount * betCoeff).toFixed(2), false);
  });

  it('C1143823 - (-), bet with coeff < 1.1 (lose) + cases', async () => {
    const betAmount = 50;
    const betCoeff = 1.09;
    await addBetToBD(currentUser.id, 'RUB', betAmount, betCoeff, LOSE);
    await banking.setBalance(DEPOSIT_AMOUNT - betAmount);
    const { data: casesResult } = await cases.playCaseWithoutChance(1); // 50 rub
    await checkRecoupment(casesResult.result, false);
  });

  it('C1146557 - (+), several bets with coeff > 1.1', async () => {
    const betAmount = 50;
    const coef1 = 1.2;
    const coef2 = 5.3;

    await addBetToBD(currentUser.id, 'RUB', betAmount, coef1, WIN);
    await addBetToBD(currentUser.id, 'RUB', betAmount, coef2, LOSE);
    await banking.setBalance(currentUser.id, betAmount * coef1);
    await checkRecoupment((betAmount * coef1).toFixed(2), true);
  });

  it('C1146558 - (-), several bets with coeff < 1.1 ', async () => {
    const betAmount = 50;
    const coef1 = 1.02;
    const coef2 = 1.07;

    await addBetToBD(currentUser.id, 'RUB', betAmount, coef1, WIN);
    await addBetToBD(currentUser.id, 'RUB', betAmount, coef2, LOSE);
    await banking.setBalance(currentUser.id, betAmount * coef1);
    await checkRecoupment((betAmount * coef1).toFixed(2), false);
  });

  it('C1146559 - (-), bet with coeff > 1.1 + bet with coeff < 1.1', async () => {
    const betAmount = 50;
    const coef1 = 1.02;
    const coef2 = 5.66;

    await addBetToBD(currentUser.id, 'RUB', betAmount, coef1, WIN);
    await addBetToBD(currentUser.id, 'RUB', betAmount, coef2, LOSE);
    await banking.setBalance(currentUser.id, betAmount * coef1);
    await checkRecoupment((betAmount * coef1).toFixed(2), false);
  });
});
