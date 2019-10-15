import { userList } from '../../src/methods/userList';
import { userPool } from '../../src/methods/userPool';
import { cases } from '../../src/methods/cases';
import { checkCaseResult } from '../../src/expects/exCases';
import { checkErrMsg } from '../../src/responseChecker';
import { getNewSocket } from '../global';

describe('Cases play RUB', () => {
  describe('Valid', () => {
    const USERS_NUMBER = 10;
    const BALANCE = 12000;
    let currentUser = {};
    let users = [];
    let socket;

    beforeAll(async () => {
    // формируем пул юзеров
      socket = await getNewSocket();
      users = await userPool.usersWithBalanceRub(socket, USERS_NUMBER, BALANCE);
      await socket.disconnect();
    });

    beforeEach(async () => {
      socket = await getNewSocket();
      currentUser = users.pop();
      await userList.loginWithParams(socket, currentUser.email, currentUser.password);
    });

    afterEach(async () => { await socket.disconnect(); });

    it('C608898 - (+) play  cases 10', async () => {
      const { data } = await cases.playCaseWithoutChance(socket, 10);

      checkErrMsg(data, 400, 'Bad request');
    });

    it('C484968 - (+) play  cases 1', async () => {
      const data = await cases.playCaseWithoutChance(socket, 1);

      checkCaseResult(data, 101, 1);
    });
    it('C484969 - (+) play  cases 2', async () => {
      const data = await cases.playCaseWithoutChance(socket, 2);

      checkCaseResult(data, 201, 4);
    });

    it('C484970 - (+) play  cases 3', async () => {
      const data = await cases.playCaseWithoutChance(socket, 3);

      checkCaseResult(data, 501, 9);
    });
    it('C484971 - (+) play  cases 4', async () => {
      const data = await cases.playCaseWithoutChance(socket, 4);

      checkCaseResult(data, 501, 49);
    });
    it('C484972 - (+) play  cases 5', async () => {
      const data = await cases.playCaseWithoutChance(socket, 5);

      checkCaseResult(data, 5001, 99);
    });
    it('C484973 - (+) play  cases 6', async () => {
      const data = await cases.playCaseWithoutChance(socket, 6);

      checkCaseResult(data, 10001, 499);
    });
    it('C484974 - (+) play  cases 7', async () => {
      const data = await cases.playCaseWithoutChance(socket, 7);

      checkCaseResult(data, 10001, 2499);
    });
    it('C484975 - (+) play  cases 8', async () => {
      const data = await cases.playCaseWithoutChance(socket, 8);

      checkCaseResult(data, 50001, 4999);
    });

    it('C484976 - (-) invalid id', async () => {
      const { data } = await cases.playCaseWithoutChance(socket, 9);

      checkErrMsg(data, 400, 'Bad request');
    });
  });

  describe('Unauthorized', () => {
    let socket;
    it('C484977 - play  cases 8', async () => {
      socket = await getNewSocket();
      const { data } = await cases.playCaseWithoutChance(socket, 8);

      checkErrMsg(data, 401, 'Unauthorized');
    });
  });
});
