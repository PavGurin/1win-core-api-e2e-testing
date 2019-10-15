import { expect } from 'chai';
import { userList } from '../../src/methods/userList';
import { userPool } from '../../src/methods/userPool';
import { cases } from '../../src/methods/cases';
import { banking } from '../../src/methods/banking';
import { getNewSocket } from '../global';

describe('Check user balance after play cases', () => {
  describe('RUB', () => {
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

    it('C490980 - play  cases 1', async () => {
      const caseCost = await cases.getCaseCost(socket, 1);
      const { data } = await cases.playCaseWithoutChance(socket, 1);
      const balance = await banking.balanceCheck(socket);

      expect(balance).to.equal(currentUser.balance - caseCost + data.result);
    });

    it('C490981 - play  cases 2', async () => {
      const caseCost = await cases.getCaseCost(socket, 2);
      const { data } = await cases.playCaseWithoutChance(socket, 2);
      const balance = await banking.balanceCheck(socket);

      expect(balance).to.equal(currentUser.balance - caseCost + data.result);
    });

    it('C490982 - play  cases 3', async () => {
      const caseCost = await cases.getCaseCost(socket, 3);
      const { data } = await cases.playCaseWithoutChance(socket, 3);
      const balance = await banking.balanceCheck(socket);

      expect(balance).to.equal(currentUser.balance - caseCost + data.result);
    });

    it('C490983 - play  cases 4', async () => {
      const caseCost = await cases.getCaseCost(socket, 4);
      const { data } = await cases.playCaseWithoutChance(socket, 4);
      const balance = await banking.balanceCheck(socket);

      expect(balance).to.equal(currentUser.balance - caseCost + data.result);
    });

    it('C490984 - play  cases 5', async () => {
      const caseCost = await cases.getCaseCost(socket, 5);
      const { data } = await cases.playCaseWithoutChance(socket, 5);
      const balance = await banking.balanceCheck(socket);

      expect(balance).to.equal(currentUser.balance - caseCost + data.result);
    });

    it('C490985 - play  cases 6', async () => {
      const caseCost = await cases.getCaseCost(socket, 6);
      const { data } = await cases.playCaseWithoutChance(socket, 6);
      const balance = await banking.balanceCheck(socket);

      expect(balance).to.equal(currentUser.balance - caseCost + data.result);
    });

    it('C490986 - play  cases 7', async () => {
      const caseCost = await cases.getCaseCost(socket, 7);
      const { data } = await cases.playCaseWithoutChance(socket, 7);
      const balance = await banking.balanceCheck(socket);

      expect(balance).to.equal(currentUser.balance - caseCost + data.result);
    });

    it('C490987 - play  cases 8', async () => {
      const caseCost = await cases.getCaseCost(socket, 8);
      const { data } = await cases.playCaseWithoutChance(socket, 8);
      const balance = await banking.balanceCheck(socket);

      expect(balance).to.equal(currentUser.balance - caseCost + data.result);
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
      // eslint-disable-next-line no-tabs,no-mixed-spaces-and-tabs
      socket = await getNewSocket();
      currentUser = users.pop();
      await userList.loginWithParams(socket, currentUser.email, currentUser.password);
    });

    afterEach(async () => { await socket.disconnect(); });

    it('C490988 - play  cases 10', async () => {
      const caseCost = await cases.getCaseCost(socket, 10);
      const { data } = await cases.playCaseWithoutChance(socket, 10);
      const balance = await banking.balanceCheck(socket);

      expect(balance.toFixed(2)).to.equal((currentUser.balance
        - caseCost + data.result).toFixed(2));
    });
    it('C490989 - play  cases 11', async () => {
      const caseCost = await cases.getCaseCost(socket, 11);
      const { data } = await cases.playCaseWithoutChance(socket, 11);
      const balance = await banking.balanceCheck(socket);

      expect(balance.toFixed(2)).to.equal((currentUser.balance
        - caseCost + data.result).toFixed(2));
    });

    it('C490990 - play  cases 12', async () => {
      const caseCost = await cases.getCaseCost(socket, 12);
      const { data } = await cases.playCaseWithoutChance(socket, 12);
      const balance = await banking.balanceCheck(socket);

      expect(balance.toFixed(2)).to.equal((currentUser.balance
        - caseCost + data.result).toFixed(2));
    });
    it('C490991 - play  cases 13', async () => {
      const caseCost = await cases.getCaseCost(socket, 13);
      const { data } = await cases.playCaseWithoutChance(socket, 13);
      const balance = await banking.balanceCheck(socket);

      expect(balance.toFixed(2)).to.equal((currentUser.balance
        - caseCost + data.result).toFixed(2));
    });
    it('C490992 - play  cases 14', async () => {
      const caseCost = await cases.getCaseCost(socket, 14);
      const { data } = await cases.playCaseWithoutChance(socket, 14);
      const balance = await banking.balanceCheck(socket);

      expect(balance.toFixed(2)).to.equal((currentUser.balance
        - caseCost + data.result).toFixed(2));
    });
    it('C490993 - play  cases 22', async () => {
      const caseCost = await cases.getCaseCost(socket, 22);
      const { data } = await cases.playCaseWithoutChance(socket, 22);
      const balance = await banking.balanceCheck(socket);

      expect(balance.toFixed(2)).to.equal((currentUser.balance
        - caseCost + data.result).toFixed(2));
    });
  });
});
