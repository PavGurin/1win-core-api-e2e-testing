import { userList } from '../../src/methods/userList';
import { userPool } from '../../src/methods/userPool';
import { logOut } from '../../src/methods/user';
import { cases } from '../../src/methods/cases';
import { checkCaseResult } from '../../src/expects/exCases';
import { checkErrMsg } from '../../src/responseChecker';

describe('Cases play RUB', () => {
  describe('Valid', () => {
    const USERS_NUMBER = 10;
    const BALANCE = 12000;
    let currentUser = {};
    let users = [];

    beforeAll(async () => {
    // формируем пул юзеров
      users = await userPool.usersWithBalanceRub(socket, USERS_NUMBER, BALANCE);
    });

    beforeEach(async () => {
      await logOut();
      currentUser = users.pop();
      await userList.loginWithParams(socket, currentUser.email, currentUser.password);
    });
    it('C608898 - (+) play  cases 10', async () => {
      const { data } = await cases.playCaseWithoutChance(10);

      checkErrMsg(data, 400, 'Bad request');
    });

    it('C484968 - (+) play  cases 1', async () => {
      const data = await cases.playCaseWithoutChance(1);

      checkCaseResult(data, 101, 1);
    });
    it('C484969 - (+) play  cases 2', async () => {
      const data = await cases.playCaseWithoutChance(2);

      checkCaseResult(data, 201, 4);
    });

    it('C484970 - (+) play  cases 3', async () => {
      const data = await cases.playCaseWithoutChance(3);

      checkCaseResult(data, 501, 9);
    });
    it('C484971 - (+) play  cases 4', async () => {
      const data = await cases.playCaseWithoutChance(4);

      checkCaseResult(data, 501, 49);
    });
    it('C484972 - (+) play  cases 5', async () => {
      const data = await cases.playCaseWithoutChance(5);

      checkCaseResult(data, 5001, 99);
    });
    it('C484973 - (+) play  cases 6', async () => {
      const data = await cases.playCaseWithoutChance(6);

      checkCaseResult(data, 10001, 499);
    });
    it('C484974 - (+) play  cases 7', async () => {
      const data = await cases.playCaseWithoutChance(7);

      checkCaseResult(data, 10001, 2499);
    });
    it('C484975 - (+) play  cases 8', async () => {
      const data = await cases.playCaseWithoutChance(8);

      checkCaseResult(data, 50001, 4999);
    });

    it('C484976 - (-) invalid id', async () => {
      const { data } = await cases.playCaseWithoutChance(9);
      console.log(data);
      checkErrMsg(data, 400, 'Bad request');
    });
  });
  describe('Unauthorized', () => {
    it('C484977 - play  cases 8', async () => {
      await logOut();
      const { data } = await cases.playCaseWithoutChance(8);

      checkErrMsg(data, 401, 'Unauthorized');
    });
  });
});
