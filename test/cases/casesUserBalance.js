import { expect } from 'chai';
import { userList } from '../../src/methods/userList';
import { userPool } from '../../src/methods/userPool';
import { logOut } from '../../src/methods/user';
import { cases } from '../../src/methods/cases';
import { banking } from '../../src/methods/banking';

describe('Check user balance after play cases', () => {
  describe('RUB', () => {
    const USERS_NUMBER = 8;
    const BALANCE = 12000;
    let currentUser = {};
    let users = [];

    beforeAll(async () => {
      // формируем пул юзеров
      users = await userPool.usersWithBalanceRub(USERS_NUMBER, BALANCE);
    });

    beforeEach(async () => {
      // eslint-disable-next-line no-tabs,no-mixed-spaces-and-tabs
    	await logOut();
      currentUser = users.pop();
      await userList.loginWithParams(currentUser.email, currentUser.password);
    });

    it('C490980 - play  cases 1', async () => {
      const caseCost = await cases.getCaseCost(1);
      const { data } = await cases.playCaseWithoutChance(1);
      const balance = await banking.balanceCheck();

      expect(balance).to.equal(currentUser.balance - caseCost + data.result);
    });

    it('C490981 - play  cases 2', async () => {
      const caseCost = await cases.getCaseCost(2);
      const { data } = await cases.playCaseWithoutChance(2);
      const balance = await banking.balanceCheck();

      expect(balance).to.equal(currentUser.balance - caseCost + data.result);
    });

    it('C490982 - play  cases 3', async () => {
      const caseCost = await cases.getCaseCost(3);
      const { data } = await cases.playCaseWithoutChance(3);
      const balance = await banking.balanceCheck();

      expect(balance).to.equal(currentUser.balance - caseCost + data.result);
    });

    it('C490983 - play  cases 4', async () => {
      const caseCost = await cases.getCaseCost(4);
      const { data } = await cases.playCaseWithoutChance(4);
      const balance = await banking.balanceCheck();

      expect(balance).to.equal(currentUser.balance - caseCost + data.result);
    });

    it('C490984 - play  cases 5', async () => {
      const caseCost = await cases.getCaseCost(5);
      const { data } = await cases.playCaseWithoutChance(5);
      const balance = await banking.balanceCheck();

      expect(balance).to.equal(currentUser.balance - caseCost + data.result);
    });

    it('C490985 - play  cases 6', async () => {
      const caseCost = await cases.getCaseCost(6);
      const { data } = await cases.playCaseWithoutChance(6);
      const balance = await banking.balanceCheck();

      expect(balance).to.equal(currentUser.balance - caseCost + data.result);
    });

    it('C490986 - play  cases 7', async () => {
      const caseCost = await cases.getCaseCost(7);
      const { data } = await cases.playCaseWithoutChance(7);
      const balance = await banking.balanceCheck();

      expect(balance).to.equal(currentUser.balance - caseCost + data.result);
    });

    it('C490987 - play  cases 8', async () => {
      const caseCost = await cases.getCaseCost(8);
      const { data } = await cases.playCaseWithoutChance(8);
      const balance = await banking.balanceCheck();

      expect(balance).to.equal(currentUser.balance - caseCost + data.result);
    });
  });
  describe('USD', () => {
    const USERS_NUMBER = 6;
    const BALANCE = 1200;
    let currentUser = {};
    let users = [];

    beforeAll(async () => {
      // формируем пул юзеров
      users = await userPool.usersWithBalanceUsd(USERS_NUMBER, BALANCE);
    });

    beforeEach(async () => {
      // eslint-disable-next-line no-tabs,no-mixed-spaces-and-tabs
      await logOut();
      currentUser = users.pop();
      await userList.loginWithParams(currentUser.email, currentUser.password);
    });
    it('C490988 - play  cases 10', async () => {
      const caseCost = await cases.getCaseCost(10);
      const { data } = await cases.playCaseWithoutChance(10);
      const balance = await banking.balanceCheck();

      expect(balance).to.equal(currentUser.balance - caseCost + data.result);
    });
    it('C490989 - play  cases 11', async () => {
      const caseCost = await cases.getCaseCost(11);
      const { data } = await cases.playCaseWithoutChance(11);
      const balance = await banking.balanceCheck();

      expect(balance).to.equal(currentUser.balance - caseCost + data.result);
    });

    it('C490990 - play  cases 12', async () => {
      const caseCost = await cases.getCaseCost(12);
      const { data } = await cases.playCaseWithoutChance(12);
      const balance = await banking.balanceCheck();

      expect(balance).to.equal(currentUser.balance - caseCost + data.result);
    });
    it('C490991 - play  cases 13', async () => {
      const caseCost = await cases.getCaseCost(13);
      const { data } = await cases.playCaseWithoutChance(13);
      const balance = await banking.balanceCheck();

      expect(balance).to.equal(currentUser.balance - caseCost + data.result);
    });
    it('C490992 - play  cases 14', async () => {
      const caseCost = await cases.getCaseCost(14);
      const { data } = await cases.playCaseWithoutChance(14);
      const balance = await banking.balanceCheck();

      expect(balance).to.equal(currentUser.balance - caseCost + data.result);
    });
    it('C490993 - play  cases 15', async () => {
      const caseCost = await cases.getCaseCost(15);
      const { data } = await cases.playCaseWithoutChance(15);
      const balance = await banking.balanceCheck();

      expect(balance).to.equal(currentUser.balance - caseCost + data.result);
    });
  });
});
