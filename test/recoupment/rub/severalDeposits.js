import { userPool } from '../../../src/methods/userPool';
import { userList } from '../../../src/methods/userList';
import { banking } from '../../../src/methods/banking';
import { cases } from '../../../src/methods/cases';
import { sleep } from '../../../src/methods/utils';
import { register } from '../../../src/methods/register';
import { checkRecoupment } from '../../../src/expects/exRecoupment';

// юзеры с несколькими депозитами
describe('Several deposits', () => {
  const TEN_ROUBLES_CASE_ID = 5;
  const HUNDRED_ROUBLES_CASE_ID = 3;
  const USERS_NUMBER = 1;
  const DEPOSIT_AMOUNT = 100;
  const DEPOSIT_PER_USER = 2;

  describe('Deposits before recouping', () => {
    let users = [];
    let currentUser = {};
    beforeEach(async () => {
      users = await userPool.usersWithDepositRub(USERS_NUMBER, DEPOSIT_AMOUNT, DEPOSIT_PER_USER);
      await sleep(1000);
      // console.log(users);
      currentUser = users.pop();
      await userList.loginWithParams(currentUser.email, currentUser.password);
      await sleep(2000);
      // console.log(currentUser.email, currentUser.password);
    });

    it('C1021294 - (-) nothing spent, withdraw money', async () => {
      await checkRecoupment(DEPOSIT_AMOUNT, false);
    });

    it('C1021295 - (-) spent part of one deposit, withdraw money', async () => {
      const { data } = await cases.playCaseWithoutChance(TEN_ROUBLES_CASE_ID);
      // console.log(data);

      await checkRecoupment(DEPOSIT_AMOUNT, false);
    });

    it('C1021296 - (-) spent one deposit, withdraw earned money', async () => {
      const { data } = await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
      // console.log(data);

      await checkRecoupment(data.result, false);
    });

    it('C1021297 - (-) spent one deposit and part of other, withdraw money', async () => {
      await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
      await cases.playCaseWithoutChance(TEN_ROUBLES_CASE_ID);

      await checkRecoupment('10', false);
    });

    it('C1021298 - (+) spent all money, withdraw amount < balance', async () => {
      await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
      await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);

      await checkRecoupment('10', true);
    });

    it('C1091384 - (-) spent all money, withdraw amount > balance', async () => {
      await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
      await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);

      await checkRecoupment('10000', '403');
    });
  });

  describe('One deposit before recouping, one deposit after', () => {
    let user;
    beforeEach(async () => {
      const { data } = await register.oneClickReg();
      user = data;
      // console.log(user);
      await banking.createDepositInBD(user.id, 'RUB', DEPOSIT_AMOUNT);
      await banking.setBalance(user.id, DEPOSIT_AMOUNT);
      await sleep(1500);
      const { data: { result } } = await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
      await banking.createDepositInBD(user.id, 'RUB', DEPOSIT_AMOUNT);
      await banking.setBalance(user.id, DEPOSIT_AMOUNT + result);
      await sleep(1500);
    });

    it('C2064290 (-) Second deposit not spent', async () => {
      await checkRecoupment(DEPOSIT_AMOUNT, false);
    });

    it('C2064291 (-) Part of second deposit spent', async () => {
      const { data } = await cases.playCaseWithoutChance(TEN_ROUBLES_CASE_ID);

      await sleep(2000);
      await checkRecoupment(DEPOSIT_AMOUNT - 10 + data.result, false);
    });

    it('C2064292 (+) Second deposit spent', async () => {
      const { data } = await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
      // console.log(data);
      await sleep(2000);
      await checkRecoupment(data.result, true);
    });
  });
});
