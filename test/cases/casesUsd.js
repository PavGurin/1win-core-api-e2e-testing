import { userList } from '../../src/methods/userList';
import { userPool } from '../../src/methods/userPool';
import { cases } from '../../src/methods/cases';
import { checkCaseResult } from '../../src/expects/exCases';
import { checkErrMsg } from '../../src/responseChecker';

describe('Cases play USD', () => {
  describe('Valid', () => {
    const USERS_NUMBER = 1;
    const BALANCE = 1200;
    let currentUser = {};
    let users = [];

    beforeEach(async () => {
      // формируем пул юзеров
      users = await userPool.usersWithBalanceUsd(USERS_NUMBER, BALANCE);
      currentUser = users.pop();
      await userList.loginWithParams(currentUser.email, currentUser.password);
    });


    it('C608899 - (-) incorrect currency', async () => {
      const { data } = await cases.playCaseWithoutChance(1);
      checkErrMsg(data, 400, 'Bad request');
    });

    it('C491787 - (+) play  cases 10', async () => {
      const data = await cases.playCaseWithoutChance(10);
      // console.log(data);
      checkCaseResult(data, 10, 0.2);
    });

    it('C491788 - (+) play  cases 11', async () => {
      const data = await cases.playCaseWithoutChance(11);

      checkCaseResult(data, 4, 0.08);
    });

    it('C491789 - (+) play  cases 12', async () => {
      const data = await cases.playCaseWithoutChance(12);

      checkCaseResult(data, 10, 1);
    });

    it('C491790 - (+) play  cases 13', async () => {
      const data = await cases.playCaseWithoutChance(13);

      checkCaseResult(data, 100, 2);
    });

    it('C491791 - (+) play  cases 14', async () => {
      const data = await cases.playCaseWithoutChance(14);

      checkCaseResult(data, 2, 0.04);
    });

    it('C491792 - (+) play  cases 15', async () => {
      const data = await cases.playCaseWithoutChance(15);

      checkCaseResult(data, 200, 10);
    });

    it('C1630097 - (+) play  cases 16', async () => {
      const data = await cases.playCaseWithoutChance(16);

      checkCaseResult(data, 200, 10);
    });

    it('C1630098 - (+) play  cases 17', async () => {
      const data = await cases.playCaseWithoutChance(17);

      checkCaseResult(data, 1000, 100);
    });
  });
});
