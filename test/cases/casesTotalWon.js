import { expect } from 'chai';
import { userList } from '../../src/methods/userList';
import { userPool } from '../../src/methods/userPool';
import { logOut } from '../../src/methods/user';
import { cases } from '../../src/methods/cases';

describe('Cases - totally won ', () => {
  describe('Rub', () => {
    const USERS_NUMBER = 8;
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

    it('C489436 - (+) play cases 1', async () => {
      const won1 = await cases.getCaseInfo(1);
      // console.log(won1.data.totallyWon);
      const { data } = await cases.playCaseWithoutChance(1);
      // console.log(data.result);
      const won2 = await cases.getCaseInfo(1);
      // console.log(won2.data.totallyWon);
      expect(won2.data.totallyWon).to.equal(won1.data.totallyWon + data.result);
    });

    it('C489437 - (+) play cases 2', async () => {
      const won1 = await cases.getCaseInfo(2);
      // console.log(won1.data.totallyWon);
      const { data } = await cases.playCaseWithoutChance(2);
      // console.log(data.result);
      const won2 = await cases.getCaseInfo(2);
      // console.log(won2.data.totallyWon);
      expect(won2.data.totallyWon).to.equal(won1.data.totallyWon + data.result);
    });

    it('C489438 - (+) play cases 3', async () => {
      const won1 = await cases.getCaseInfo(3);
      // console.log(won1.data.totallyWon);
      const { data } = await cases.playCaseWithoutChance(3);
      // console.log(data.result);
      const won2 = await cases.getCaseInfo(3);
      // console.log(won2.data.totallyWon);
      expect(won2.data.totallyWon).to.equal(won1.data.totallyWon + data.result);
    });

    it('C489439 - (+) play cases 4', async () => {
      const won1 = await cases.getCaseInfo(4);
      // console.log(won1.data.totallyWon);
      const { data } = await cases.playCaseWithoutChance(4);
      // console.log(data.result);
      const won2 = await cases.getCaseInfo(4);
      // console.log(won2.data.totallyWon);
      expect(won2.data.totallyWon).to.equal(won1.data.totallyWon + data.result);
    });

    it('C489440 - (+) play cases 5', async () => {
      const won1 = await cases.getCaseInfo(5);
      // console.log(won1.data.totallyWon);
      const { data } = await cases.playCaseWithoutChance(5);
      // console.log(data.result);
      const won2 = await cases.getCaseInfo(5);
      // console.log(won2.data.totallyWon);
      expect(won2.data.totallyWon).to.equal(won1.data.totallyWon + data.result);
    });

    it('C489441 - (+) play cases 6', async () => {
      const won1 = await cases.getCaseInfo(6);
      // console.log(won1.data.totallyWon);
      const { data } = await cases.playCaseWithoutChance(6);
      // console.log(data.result);
      const won2 = await cases.getCaseInfo(6);
      // console.log(won2.data.totallyWon);
      expect(won2.data.totallyWon).to.equal(won1.data.totallyWon + data.result);
    });

    it('C489442 - (+) play cases 7', async () => {
      const won1 = await cases.getCaseInfo(7);
      // console.log(won1.data.totallyWon);
      const { data } = await cases.playCaseWithoutChance(7);
      // console.log(data.result);
      const won2 = await cases.getCaseInfo(7);
      // console.log(won2.data.totallyWon);
      expect(won2.data.totallyWon).to.equal(won1.data.totallyWon + data.result);
    });

    it('C489443 - (+) play cases 8', async () => {
      const won1 = await cases.getCaseInfo(8);
      // console.log(won1.data.totallyWon);
      const { data } = await cases.playCaseWithoutChance(8);
      // console.log(data.result);
      const won2 = await cases.getCaseInfo(8);
      // console.log(won2.data.totallyWon);
      expect(won2.data.totallyWon).to.equal(won1.data.totallyWon + data.result);
    });
  });

  describe('USD', () => {
    const USERS_NUMBER = 6;
    const BALANCE = 1200;
    let currentUser = {};
    let users = [];

    beforeAll(async () => {
      // формируем пул юзеров
      users = await userPool.usersWithBalanceUsd(socket, USERS_NUMBER, BALANCE);
    });

    beforeEach(async () => {
      await logOut();
      currentUser = users.pop();
      await userList.loginWithParams(socket, currentUser.email, currentUser.password);
    });

    it('C484978 - (+) play cases 10', async () => {
      const won1 = await cases.getCaseInfo(10);
      // console.log(won1.data.totallyWon);
      const { data } = await cases.playCaseWithoutChance(10);
      // console.log(data.result);
      const won2 = await cases.getCaseInfo(10);
      // console.log(won2.data.totallyWon);
      expect((won2.data.totallyWon).toFixed(2)).to.equal((won1.data.totallyWon + data.result)
        .toFixed(2));
    });

    it('C484979 - (+) play cases 11', async () => {
      const won1 = await cases.getCaseInfo(11);
      // console.log(won1.data.totallyWon);
      const { data } = await cases.playCaseWithoutChance(11);
      // console.log(data.result);
      const won2 = await cases.getCaseInfo(11);
      // console.log(won2.data.totallyWon);
      expect((won2.data.totallyWon).toFixed(2)).to.equal((won1.data.totallyWon + data.result)
        .toFixed(2));
    });

    it('C484980 - (+) play cases 12', async () => {
      const won1 = await cases.getCaseInfo(12);
      // console.log(won1.data.totallyWon);
      const { data } = await cases.playCaseWithoutChance(12);
      // console.log(data.result);
      const won2 = await cases.getCaseInfo(12);
      // console.log(won2.data.totallyWon);
      expect((won2.data.totallyWon).toFixed(2)).to.equal((won1.data.totallyWon + data.result)
        .toFixed(2));
    });

    it('C484981 - (+) play cases 13', async () => {
      const won1 = await cases.getCaseInfo(13);
      // console.log(won1.data.totallyWon);
      const { data } = await cases.playCaseWithoutChance(13);
      // console.log(data.result);
      const won2 = await cases.getCaseInfo(13);
      // console.log(won2.data.totallyWon);
      expect((won2.data.totallyWon).toFixed(2)).to.equal((won1.data.totallyWon + data.result)
        .toFixed(2));
    });

    it('C484982 - (+) play cases 14', async () => {
      const won1 = await cases.getCaseInfo(14);
      // console.log(won1.data.totallyWon);
      const { data } = await cases.playCaseWithoutChance(14);
      // console.log(data.result);
      const won2 = await cases.getCaseInfo(14);
      // console.log(won2.data.totallyWon);
      expect((won2.data.totallyWon).toFixed(2)).to.equal((won1.data.totallyWon + data.result)
        .toFixed(2));
    });

    it('C484983 - (+) play cases 15', async () => {
      const won1 = await cases.getCaseInfo(15);
      // console.log(won1.data.totallyWon);
      const { data } = await cases.playCaseWithoutChance(15);
      // console.log(data.result);
      const won2 = await cases.getCaseInfo(15);
      // console.log(won2.data.totallyWon);
      expect((won2.data.totallyWon).toFixed(2)).to.equal((won1.data.totallyWon + data.result)
        .toFixed(2));
    });
  });
});
