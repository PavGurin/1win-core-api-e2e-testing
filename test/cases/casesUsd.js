import { userList } from '../../src/methods/userList';
import { userPool } from '../../src/methods/userPool';
import { cases } from '../../src/methods/cases';
import { checkCaseResult } from '../../src/expects/exCases';
import { checkErrMsg } from '../../src/responseChecker';
import { getNewSocket } from '../global';

describe('Cases play USD', () => {
  describe('Valid', () => {
    const USERS_NUMBER = 7;
    const BALANCE = 1200;
    let currentUser = {};
    let users = [];
    let socket;

    beforeAll(async () => {
      // формируем пул юзеров
      socket = await getNewSocket();
      users = await userPool.usersWithBalanceUsd(socket, USERS_NUMBER, BALANCE);
      await socket.disconnect();
    });

    beforeEach(async () => {
      socket = await getNewSocket();
      currentUser = users.pop();
      await userList.loginWithParams(socket, currentUser.email, currentUser.password);
    });

    afterEach(async () => { await socket.disconnect(); });

    it('C608899 - (+) play  cases 1', async () => {
      const { data } = await cases.playCaseWithoutChance(socket, 1);
      checkErrMsg(data, 400, 'Bad request');
    });

    it('C491787 - (+) play  cases 10', async () => {
      const data = await cases.playCaseWithoutChance(socket, 10);
      // console.log(data);
      checkCaseResult(data, 2.01, 0.19);
    });
    it('C491788 - (+) play  cases 11', async () => {
      const data = await cases.playCaseWithoutChance(socket, 11);

      checkCaseResult(data, 4.01, 0.07);
    });

    it('C491789 - (+) play  cases 12', async () => {
      const data = await cases.playCaseWithoutChance(socket, 12);

      checkCaseResult(data, 10.01, 0.09);
    });
    it('C491790 - (+) play  cases 13', async () => {
      const data = await cases.playCaseWithoutChance(socket, 13);

      checkCaseResult(data, 100.01, 0.09);
    });
    it('C491791 - (+) play  cases 14', async () => {
      const data = await cases.playCaseWithoutChance(socket, 14);

      checkCaseResult(data, 2.01, 0.03);
    });
    it('C491792 - (+) play  cases 22', async () => {
      const data = await cases.playCaseWithoutChance(socket, 22);

      checkCaseResult(data, 200.01, 9.09);
    });
  });
});
