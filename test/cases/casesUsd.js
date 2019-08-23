import { userList } from '../../src/methods/userList';
import { userPool } from '../../src/methods/userPool';
import { logOut } from '../../src/methods/user';
import { cases } from '../../src/methods/cases';
import { checkCaseResult } from '../../src/expects/exCases';

describe('Cases play USD', () => {
  describe('Valid', () => {
    const USERS_NUMBER = 6;
    const BALANCE = 1200;
    let currentUser = {};
    let users = [];

    beforeAll(async () => {
      // формируем пул юзеров
      users = await userPool.usersWithBalanceUsd(USERS_NUMBER, BALANCE);
    });

    beforeEach(async () => {
      await logOut();
      currentUser = users.pop();
      await userList.loginWithParams(currentUser.email, currentUser.password);
    });

    it('C491787 - (+) play  cases 10', async () => {
      const data = await cases.playCaseWithoutChance(10);

      checkCaseResult(data, 101, 1);
    });
    it('C491788 - (+) play  cases 11', async () => {
      const data = await cases.playCaseWithoutChance(11);

      checkCaseResult(data, 201, 4);
    });

    it('C491789 - (+) play  cases 12', async () => {
      const data = await cases.playCaseWithoutChance(12);

      checkCaseResult(data, 501, 9);
    });
    it('C491790 - (+) play  cases 13', async () => {
      const data = await cases.playCaseWithoutChance(13);

      checkCaseResult(data, 501, 49);
    });
    it('C491791 - (+) play  cases 14', async () => {
      const data = await cases.playCaseWithoutChance(14);

      checkCaseResult(data, 5001, 99);
    });
    it('C491792 - (+) play  cases 15', async () => {
      const data = await cases.playCaseWithoutChance(15);

      checkCaseResult(data, 10001, 499);
    });
  });
});
