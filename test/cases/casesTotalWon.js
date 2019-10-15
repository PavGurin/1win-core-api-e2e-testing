import { expect } from 'chai';
import { userList } from '../../src/methods/userList';
import { userPool } from '../../src/methods/userPool';
import { cases } from '../../src/methods/cases';
import { getNewSocket } from '../global';

describe('Cases - totally won ', () => {
  describe('Rub', () => {
    const USERS_NUMBER = 8;
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

    it('C489436 - (+) play cases 1', async () => {
      const won1 = await cases.getCaseInfo(socket, 1);
      // console.log(won1.data.totallyWon);
      const { data } = await cases.playCaseWithoutChance(socket, 1);
      // console.log(data.result);
      const won2 = await cases.getCaseInfo(socket, 1);
      // console.log(won2.data.totallyWon);
      expect(won2.data.totallyWon).to.equal(won1.data.totallyWon + data.result);
    });

    it('C489437 - (+) play cases 2', async () => {
      const won1 = await cases.getCaseInfo(socket, 2);
      // console.log(won1.data.totallyWon);
      const { data } = await cases.playCaseWithoutChance(socket, 2);
      // console.log(data.result);
      const won2 = await cases.getCaseInfo(socket, 2);
      // console.log(won2.data.totallyWon);
      expect(won2.data.totallyWon).to.equal(won1.data.totallyWon + data.result);
    });

    it('C489438 - (+) play cases 3', async () => {
      const won1 = await cases.getCaseInfo(socket, 3);
      // console.log(won1.data.totallyWon);
      const { data } = await cases.playCaseWithoutChance(socket, 3);
      // console.log(data.result);
      const won2 = await cases.getCaseInfo(socket, 3);
      // console.log(won2.data.totallyWon);
      expect(won2.data.totallyWon).to.equal(won1.data.totallyWon + data.result);
    });

    it('C489439 - (+) play cases 4', async () => {
      const won1 = await cases.getCaseInfo(socket, 4);
      // console.log(won1.data.totallyWon);
      const { data } = await cases.playCaseWithoutChance(socket, 4);
      // console.log(data.result);
      const won2 = await cases.getCaseInfo(socket, 4);
      // console.log(won2.data.totallyWon);
      expect(won2.data.totallyWon).to.equal(won1.data.totallyWon + data.result);
    });

    it('C489440 - (+) play cases 5', async () => {
      const won1 = await cases.getCaseInfo(socket, 5);
      // console.log(won1.data.totallyWon);
      const { data } = await cases.playCaseWithoutChance(socket, 5);
      // console.log(data.result);
      const won2 = await cases.getCaseInfo(socket, 5);
      // console.log(won2.data.totallyWon);
      expect(won2.data.totallyWon).to.equal(won1.data.totallyWon + data.result);
    });

    it('C489441 - (+) play cases 6', async () => {
      const won1 = await cases.getCaseInfo(socket, 6);
      // console.log(won1.data.totallyWon);
      const { data } = await cases.playCaseWithoutChance(socket, 6);
      // console.log(data.result);
      const won2 = await cases.getCaseInfo(socket, 6);
      // console.log(won2.data.totallyWon);
      expect(won2.data.totallyWon).to.equal(won1.data.totallyWon + data.result);
    });

    it('C489442 - (+) play cases 7', async () => {
      const won1 = await cases.getCaseInfo(socket, 7);
      // console.log(won1.data.totallyWon);
      const { data } = await cases.playCaseWithoutChance(socket, 7);
      // console.log(data.result);
      const won2 = await cases.getCaseInfo(socket, 7);
      // console.log(won2.data.totallyWon);
      expect(won2.data.totallyWon).to.equal(won1.data.totallyWon + data.result);
    });

    it('C489443 - (+) play cases 8', async () => {
      const won1 = await cases.getCaseInfo(socket, 8);
      // console.log(won1.data.totallyWon);
      const { data } = await cases.playCaseWithoutChance(socket, 8);
      // console.log(data.result);
      const won2 = await cases.getCaseInfo(socket, 8);
      // console.log(won2.data.totallyWon);
      expect(won2.data.totallyWon).to.equal(won1.data.totallyWon + data.result);
    });
  });

  describe('USD', () => {
    const USERS_NUMBER = 6;
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

    it('C484978 - (+) play cases 10', async () => {
      const won1 = await cases.getCaseInfo(socket, 10);
      // console.log(won1.data.totallyWon);
      const { data } = await cases.playCaseWithoutChance(socket, 10);
      // console.log(data.result);
      const won2 = await cases.getCaseInfo(socket, 10);
      // console.log(won2.data.totallyWon);
      expect((won2.data.totallyWon).toFixed(2)).to.equal((won1.data.totallyWon + data.result)
        .toFixed(2));
    });

    it('C484979 - (+) play cases 11', async () => {
      const won1 = await cases.getCaseInfo(socket, 11);
      // console.log(won1.data.totallyWon);
      const { data } = await cases.playCaseWithoutChance(socket, 11);
      // console.log(data.result);
      const won2 = await cases.getCaseInfo(socket, 11);
      // console.log(won2.data.totallyWon);
      expect((won2.data.totallyWon).toFixed(2)).to.equal((won1.data.totallyWon + data.result)
        .toFixed(2));
    });

    it('C484980 - (+) play cases 12', async () => {
      const won1 = await cases.getCaseInfo(socket, 12);
      // console.log(won1.data.totallyWon);
      const { data } = await cases.playCaseWithoutChance(socket, 12);
      // console.log(data.result);
      const won2 = await cases.getCaseInfo(socket, 12);
      // console.log(won2.data.totallyWon);
      expect((won2.data.totallyWon).toFixed(2)).to.equal((won1.data.totallyWon + data.result)
        .toFixed(2));
    });

    it('C484981 - (+) play cases 13', async () => {
      const won1 = await cases.getCaseInfo(socket, 13);
      // console.log(won1.data.totallyWon);
      const { data } = await cases.playCaseWithoutChance(socket, 13);
      // console.log(data.result);
      const won2 = await cases.getCaseInfo(socket, 13);
      // console.log(won2.data.totallyWon);
      expect((won2.data.totallyWon).toFixed(2)).to.equal((won1.data.totallyWon + data.result)
        .toFixed(2));
    });

    it('C484982 - (+) play cases 14', async () => {
      const won1 = await cases.getCaseInfo(socket, 14);
      // console.log(won1.data.totallyWon);
      const { data } = await cases.playCaseWithoutChance(socket, 14);
      // console.log(data.result);
      const won2 = await cases.getCaseInfo(socket, 14);
      // console.log(won2.data.totallyWon);
      expect((won2.data.totallyWon).toFixed(2)).to.equal((won1.data.totallyWon + data.result)
        .toFixed(2));
    });

    it('C484983 - (+) play cases 15', async () => {
      const won1 = await cases.getCaseInfo(socket, 22);
      // console.log(won1.data.totallyWon);
      const { data } = await cases.playCaseWithoutChance(socket, 22);
      // console.log(data.result);
      const won2 = await cases.getCaseInfo(socket, 22);
      // console.log(won2.data.totallyWon);
      expect((won2.data.totallyWon).toFixed(2)).to.equal((won1.data.totallyWon + data.result)
        .toFixed(2));
    });
  });
});
