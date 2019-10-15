import { userList } from '../../src/methods/userList';
import { userPool } from '../../src/methods/userPool';
import { cases } from '../../src/methods/cases';
import { checkCaseResult } from '../../src/expects/exCases';
import { getNewSocket } from '../global';

describe('Cases play with different chance', () => {
  describe('RUB', () => {
    const USERS_NUMBER = 4;
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

    it('C490201 - (+) play  cases 1 with chance = 10', async () => {
      const data = await cases.playCaseWithChance(socket, 1, 10);

      checkCaseResult(data, 101, 1);
    });
    it('C490202 - (+) play  cases 2 with chance = 20', async () => {
      const data = await cases.playCaseWithChance(socket, 2, 20);

      checkCaseResult(data, 201, 4);
    });

    it('C490203 - (+) play  cases 3 with chance = 30', async () => {
      const data = await cases.playCaseWithChance(socket, 3, 30);

      checkCaseResult(data, 501, 9);
    });
    it('C490204 - (+) play  cases 4 with chance = 2', async () => {
      const data = await cases.playCaseWithChance(socket, 4, 2);

      checkCaseResult(data, 501, 49);
    });
  });

  describe('USD', () => {
    const USERS_NUMBER = 4;
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

    it('C490205 - (+) play  cases 10 with chance = 10', async () => {
      const data = await cases.playCaseWithChance(socket, 10, 10);
      // console.log(data);
      checkCaseResult(data, 2, 0.2);
    });
    it('C490206 - (+) play  cases 11 with chance = 20', async () => {
      const data = await cases.playCaseWithChance(socket, 11, 20);

      checkCaseResult(data, 4, 0.08);
    });

    it('C490207 - (+) play  cases 12 with chance = 30', async () => {
      const data = await cases.playCaseWithChance(socket, 12, 30);

      checkCaseResult(data, 10, 1);
    });
    it('C490208 - (+) play  cases 13 with chance = 2', async () => {
      const data = await cases.playCaseWithChance(socket, 13, 2);

      checkCaseResult(data, 100, 1);
    });
  });
});
