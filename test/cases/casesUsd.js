import { userList } from '../../src/methods/userList';
import { userPool } from '../../src/methods/userPool';
import { cases } from '../../src/methods/cases';
import { checkCaseResult } from '../../src/expects/exCases';
import { checkErrMsg } from '../../src/responseChecker';

describe('Cases play USD', () => {
  describe('Valid', () => {
    const USERS_NUMBER = 7;
    const BALANCE = 1200;
    let currentUser = {};
    let users = [];

    beforeAll(async () => {
      // формируем пул юзеров
      users = await userPool.usersWithBalanceUsd(socket, USERS_NUMBER, BALANCE);
      currentUser = users.pop();
      await userList.loginWithParams(socket, currentUser.email, currentUser.password);
    });

    it('C608899 - (+) play  cases 1', async () => {
      const { data } = await cases.playCaseWithoutChance(1);
      checkErrMsg(data, 400, 'Bad request');
    });

    it('C491787 - (+) play  cases 10', async () => {
      const data = await cases.playCaseWithoutChance(10);
      // console.log(data);
      checkCaseResult(data, 2.01, 0.19);
    });
    it('C491788 - (+) play  cases 11', async () => {
      const data = await cases.playCaseWithoutChance(11);

      checkCaseResult(data, 4.01, 0.07);
    });

    it('C491789 - (+) play  cases 12', async () => {
      const data = await cases.playCaseWithoutChance(12);

      checkCaseResult(data, 10.01, 0.09);
    });
    it('C491790 - (+) play  cases 13', async () => {
      const data = await cases.playCaseWithoutChance(13);

      checkCaseResult(data, 100.01, 0.09);
    });
    it('C491791 - (+) play  cases 14', async () => {
      const data = await cases.playCaseWithoutChance(14);

      checkCaseResult(data, 2.01, 0.03);
    });
    it('C491792 - (+) play  cases 22', async () => {
      const data = await cases.playCaseWithoutChance(22);

      checkCaseResult(data, 200.01, 9.09);
    });
  });
});
