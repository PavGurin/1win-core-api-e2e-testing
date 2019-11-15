import { userList } from '../../src/methods/userList';
import { userPool } from '../../src/methods/userPool';
import { cases } from '../../src/methods/cases';
import { checkCaseResult } from '../../src/expects/exCases';
import { checkErrMsg } from '../../src/responseChecker';

describe('Cases play EUR', () => {
  describe('Valid', () => {
    const USERS_NUMBER = 1;
    const BALANCE = 12000;
    let currentUser = {};
    let users = [];

    beforeEach(async () => {
      // формируем пул юзеров
      users = await userPool.usersWithBalanceEur(USERS_NUMBER, BALANCE);
      currentUser = users.pop();
      await userList.loginWithParams(currentUser.email, currentUser.password);
    });

    it('C1516040 - (-) incorrect currency', async () => {
      const { data } = await cases.playCaseWithoutChance(1);
      checkErrMsg(data, 400, 'Bad request');
    });

    it('C1516041 - (+) play  cases 18', async () => {
      const data = await cases.playCaseWithoutChance(18);
      // console.log(data);
      checkCaseResult(data, 10, 0.2);
    });

    it('C1516042 - (+) play  cases 19', async () => {
      const data = await cases.playCaseWithoutChance(19);

      checkCaseResult(data, 4, 0.08);
    });

    it('C1516043 - (+) play  cases 20', async () => {
      const data = await cases.playCaseWithoutChance(20);

      checkCaseResult(data, 10, 1);
    });

    it('C1516044 - (+) play  cases 21', async () => {
      const data = await cases.playCaseWithoutChance(21);

      checkCaseResult(data, 100, 2);
    });

    it('C1516045 - (+) play  cases 22', async () => {
      const data = await cases.playCaseWithoutChance(22);

      checkCaseResult(data, 2, 0.04);
    });

    it('C1516046 - (+) play  cases 23', async () => {
      const data = await cases.playCaseWithoutChance(23);

      checkCaseResult(data, 200, 10);
    });
  });
});
