import { userList } from '../../src/methods/userList';
import { userPool } from '../../src/methods/userPool';
import { cases } from '../../src/methods/cases';
import { checkCaseResult } from '../../src/expects/exCases';
import { sleep } from '../../src/methods/utils';

describe('Cases play with different chance', () => {
  describe('RUB', () => {
    const USERS_NUMBER = 1;
    const BALANCE = 12000;
    let currentUser = {};
    let users = [];

    beforeEach(async () => {
      // формируем пул юзеров
      users = await userPool.usersWithBalanceRub(USERS_NUMBER, BALANCE);
      currentUser = users.pop();
      await userList.loginWithParams(currentUser.email, currentUser.password);
      await sleep(100);
    });


    it('C490201 - (+) play  cases 1 with chance = 10', async () => {
      const data = await cases.playCaseWithChance(1, 10);

      checkCaseResult(data, 500, 10);
    });

    it('C490202 - (+) play  cases 2 with chance = 20', async () => {
      const data = await cases.playCaseWithChance(2, 20);

      checkCaseResult(data, 200, 5);
    });

    it('C490203 - (+) play  cases 3 with chance = 30', async () => {
      const data = await cases.playCaseWithChance(3, 30);

      checkCaseResult(data, 500, 50);
    });

    it('C490204 - (+) play  cases 4 with chance = 2', async () => {
      const data = await cases.playCaseWithChance(4, 2);

      checkCaseResult(data, 5000, 100);
    });
  });

  describe('USD', () => {
    const USERS_NUMBER = 1;
    const BALANCE = 1200;
    let currentUser = {};
    let users = [];

    beforeEach(async () => {
      // формируем пул юзеров
      users = await userPool.usersWithBalanceUsd(USERS_NUMBER, BALANCE);
      currentUser = users.pop();
      await userList.loginWithParams(currentUser.email, currentUser.password);
      await sleep(100);
    });

    it('C490205 - (+) play  cases 10 with chance = 10', async () => {
      const data = await cases.playCaseWithChance(10, 10);
      // console.log(data);
      checkCaseResult(data, 10, 0.2);
    });

    it('C490206 - (+) play  cases 11 with chance = 20', async () => {
      const data = await cases.playCaseWithChance(11, 20);

      checkCaseResult(data, 4, 0.08);
    });

    it('C490207 - (+) play  cases 12 with chance = 30', async () => {
      const data = await cases.playCaseWithChance(12, 30);

      checkCaseResult(data, 10, 1);
    });

    it('C490208 - (+) play  cases 13 with chance = 2', async () => {
      const data = await cases.playCaseWithChance(13, 2);

      checkCaseResult(data, 100, 2);
    });
  });

  describe('EUR', () => {
    const USERS_NUMBER = 4;
    const BALANCE = 1200;
    let currentUser = {};
    let users = [];
    beforeEach(async () => {
      // формируем пул юзеров
      users = await userPool.usersWithBalanceEur(USERS_NUMBER, BALANCE);
      currentUser = users.pop();
      await userList.loginWithParams(currentUser.email, currentUser.password);
      await sleep(100);
    });

    it('C1508935 - (+) play  cases 19 with chance = 10', async () => {
      const data = await cases.playCaseWithChance(18, 10);

      checkCaseResult(data, 10, 0.2);
    });

    it('C1508936 - (+) play  cases 18 with chance = 20', async () => {
      const data = await cases.playCaseWithChance(19, 20);

      checkCaseResult(data, 4, 0.08);
    });

    it('C1508937 - (+) play  cases 20 with chance = 30', async () => {
      const data = await cases.playCaseWithChance(20, 30);

      checkCaseResult(data, 10, 1);
    });

    it('C1508938 - (+) play  cases 21 with chance = 2', async () => {
      const data = await cases.playCaseWithChance(21, 2);

      checkCaseResult(data, 100, 2);
    });
  });
});
