import { userPool } from '../../../src/methods/userPool';
import { userList } from '../../../src/methods/userList';
import { banking } from '../../../src/methods/banking';
import { cases } from '../../../src/methods/cases';
import { sleep } from '../../../src/methods/utils';
import { register } from '../../../src/methods/register';
import { checkRecoupment } from '../../../src/expects/exRecoupment';

// юзеры, которым было несколько трансферов
describe('Several transfers', () => {
  const TEN_ROUBLES_CASE_ID = 5;
  const HUNDRED_ROUBLES_CASE_ID = 3;
  const USERS_NUMBER = 1;
  const DEPOSIT_AMOUNT = 100;

  describe('Transfers before recouping', () => {
    let users = [];
    let currentUser = {};
    beforeEach(async () => {
      users = await userPool.usersWithTransferRub(USERS_NUMBER, DEPOSIT_AMOUNT, 2);
      // console.log(users);
      currentUser = users.pop();
      await userList.loginWithParams(
        currentUser.email, currentUser.password,
      );
      await sleep(2000);
      // console.log(currentUser.email, currentUser.password);
    });

    it('C1021303 - (-) nothing spent, withdraw money', async () => {
      await checkRecoupment(DEPOSIT_AMOUNT, false);
    });

    it('C1021304 - (-) spent part of one transfer, withdraw money', async () => {
      const { data } = await cases.playCaseWithoutChance(TEN_ROUBLES_CASE_ID);
      // console.log(data);
      await sleep(2000);
      await checkRecoupment(DEPOSIT_AMOUNT, false);
    });

    it('C1021305 - (-) spent one transfer, withdraw earned money', async () => {
      const { data } = await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
      // console.log(data);
      await sleep(2000);
      await checkRecoupment(DEPOSIT_AMOUNT, false);
    });

    it('C1021306 - (-) spent one transfer and part of other, withdraw money', async () => {
      await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
      await cases.playCaseWithoutChance(TEN_ROUBLES_CASE_ID);
      await sleep(2000);
      await checkRecoupment(DEPOSIT_AMOUNT, false);
    });

    it('C1021307 - (+) spent all money, withdraw amount < balance ', async () => {
      await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
      await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
      await sleep(2000);
      await checkRecoupment('10', true);
    });

    it('C1091385 - (-) spent all money, withdraw amount > balance', async () => {
      await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
      await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
      await sleep(2000);
      await checkRecoupment('10000', '403');
    });
  });

  describe('One transfer before recouping, one transfer after', () => {
    let user;
    beforeEach(async () => {
      const { data } = await register.oneClickReg();
      user = data;
      // console.log(user);
      await banking.createTransferInBD(user.id, 'RUB', DEPOSIT_AMOUNT);
      await banking.setBalance(user.id, DEPOSIT_AMOUNT);
      await sleep(2000);
      const { data: { result } } = await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
      await sleep(2000);
      await banking.createTransferInBD(user.id, 'RUB', DEPOSIT_AMOUNT);
      await banking.setBalance(user.id, DEPOSIT_AMOUNT + result);
      await sleep(2000);
    });

    it('C2064293 (-) Second transfer not spent', async () => {
      await checkRecoupment(DEPOSIT_AMOUNT, false);
    });

    it('C2064294 (-) Part of second transfer spent', async () => {
      const { data } = await cases.playCaseWithoutChance(TEN_ROUBLES_CASE_ID);

      await sleep(2000);
      await checkRecoupment(DEPOSIT_AMOUNT - 10 + data.result, false);
    });

    it('C2064295 (+) Second transfer spent', async () => {
      const { data } = await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
      // console.log(data);
      await sleep(2000);
      await checkRecoupment(data.result, true);
    });
  });
});
