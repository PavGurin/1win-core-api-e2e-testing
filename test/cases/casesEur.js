import { userList } from '../../src/methods/userList';
import { userPool } from '../../src/methods/userPool';
import { cases } from '../../src/methods/cases';
import { checkCaseResult } from '../../src/expects/exCases';
import { checkErrMsg } from '../../src/responseChecker';
import { getNewSocket } from '../global';

describe('Cases play EUR', () => {
  describe('Valid', () => {
    const USERS_NUMBER = 7;
    const BALANCE = 1200;
    let currentUser = {};
    let users = [];
    let socket;

    beforeAll(async () => {
      // формируем пул юзеров
      socket = await getNewSocket();
      users = await userPool.usersWithBalanceEur(socket, USERS_NUMBER, BALANCE);
      await socket.disconnect();
    });

    beforeEach(async () => {
      socket = await getNewSocket();
      currentUser = users.pop();
      await userList.loginWithParams(socket, currentUser.email, currentUser.password);
    });

    afterEach(async () => { await socket.disconnect(); });

    it('C1516040 - (+) play  cases 1', async () => {
      const { data } = await cases.playCaseWithoutChance(socket, 1);
      checkErrMsg(data, 400, 'Bad request');
    });

    it('C1516041 - (+) play  cases 19', async () => {
      const data = await cases.playCaseWithoutChance(socket, 19);
      // console.log(data);
      checkCaseResult(data, 2, 0.2);
    });

    it('C1516042 - (+) play  cases 18', async () => {
      const data = await cases.playCaseWithoutChance(socket, 18);

      checkCaseResult(data, 4, 0.08);
    });

    it('C1516043 - (+) play  cases 20', async () => {
      const data = await cases.playCaseWithoutChance(socket, 20);

      checkCaseResult(data, 10, 1);
    });

    it('C1516044 - (+) play  cases 21', async () => {
      const data = await cases.playCaseWithoutChance(socket, 21);

      checkCaseResult(data, 100, 2);
    });

    it('C1516045 - (+) play  cases 17', async () => {
      const data = await cases.playCaseWithoutChance(socket, 17);

      checkCaseResult(data, 2, 0.04);
    });

    it('C1516046 - (+) play  cases 23', async () => {
      const data = await cases.playCaseWithoutChance(socket, 23);

      checkCaseResult(data, 200, 10);
    });
  });
});
