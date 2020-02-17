import { cases } from '../../src/methods/cases';
import { register } from '../../src/methods/register';
import { banking } from '../../src/methods/banking';
import { checkRatingRecord, checkRatingValid } from '../../src/expects/exCases';

describe('Get raiting cases', () => {
  describe('RUB', () => {
    let user;

    beforeEach(async () => {
      user = await register.oneClickReg();
    });

    it('C483526 - valid request cases rating', async () => {
      const data = await cases.raitingCase();

      // console.log(data);
      expect(data.status).toEqual(200);
      checkRatingValid(data.data);
    });

    it('C1802200 - valid data about case and user in rating', async () => {
      const CASE_COST = 500;
      const CASE_ID = 4;
      const CASE_TYPE_ID = 3;

      await banking.setBalance(user.data.id, CASE_COST);

      const date = new Date();
      const { data: { result } } = await cases.playCaseWithoutChance(CASE_ID);
      const { data } = await cases.raitingCase();
      // console.log(data);
      const resultItem = data.find(item => item.id === user.data.id);
      checkRatingRecord(resultItem, user.data.name, result, CASE_TYPE_ID, date);
    });
  });

  describe('USD', () => {
    let user;

    beforeEach(async () => {
      user = await register.oneClickRegUSD();
    });

    it('C483527 -  valid request cases rating', async () => {
      const data = await cases.raitingCase();

      // console.log(data);
      expect(data.status).toEqual(200);
      checkRatingValid(data.data);
    });

    it('C1802201 - valid data about case and user in rating', async () => {
      const CASE_COST = 20;
      const CASE_ID = 15;
      const CASE_TYPE_ID = 5;

      await banking.setBalance(user.data.id, CASE_COST);

      const date = new Date();
      const { data: { result } } = await cases.playCaseWithoutChance(CASE_ID);
      const { data } = await cases.raitingCase();
      // console.log(data);
      const resultItem = data.find(item => item.id === user.data.id);
      checkRatingRecord(resultItem, user.data.name, result, CASE_TYPE_ID, date);
    });

    it('C1802202 - user with prize < 10 USD is not in rating', async () => {
      const CASE_COST = 0.20;
      const CASE_ID = 14;

      await banking.setBalance(user.data.id, CASE_COST);

      await cases.playCaseWithoutChance(CASE_ID);
      const { data } = await cases.raitingCase();
      // console.log(data);
      const resultItem = data.find(item => item.id === user.data.id);
      expect(resultItem).toBeUndefined();
    });
  });

  describe('EUR', () => {
    let user;

    beforeEach(async () => {
      user = await register.oneClickRegEUR();
    });

    it('C1802204 -  valid request cases rating', async () => {
      const data = await cases.raitingCase();

      // console.log(data);
      expect(data.status).toEqual(200);
      checkRatingValid(data.data);
    });

    it('C1802205 - valid data about case and user in rating', async () => {
      const CASE_COST = 100;
      const CASE_ID = 24;
      const CASE_TYPE_ID = 6;

      await banking.setBalance(user.data.id, CASE_COST);

      const date = new Date();
      const { data: { result } } = await cases.playCaseWithoutChance(CASE_ID);
      const { data } = await cases.raitingCase();
      // console.log(data);
      const resultItem = data.find(item => item.id === user.data.id);
      checkRatingRecord(resultItem, user.data.name, result, CASE_TYPE_ID, date);
    });

    it('C1802206 - user with prize < 10 EUR is not in rating', async () => {
      const CASE_COST = 0.40;
      const CASE_ID = 19;

      await banking.setBalance(user.data.id, CASE_COST);

      await cases.playCaseWithoutChance(CASE_ID);
      const { data } = await cases.raitingCase();
      // console.log(data);
      const resultItem = data.find(item => item.id === user.data.id);
      expect(resultItem).toBeUndefined();
    });
  });

  describe('UAH', () => {
    let user;

    beforeEach(async () => {
      user = await register.oneClickRegUAH();
    });

    it('C1802207 -  valid request cases rating', async () => {
      const data = await cases.raitingCase();

      // console.log(data);
      expect(data.status).toEqual(200);
      checkRatingValid(data.data);
    });

    it('C1802208 - valid data about case and user in rating', async () => {
      const CASE_COST = 5000;
      const CASE_ID = 33;
      const CASE_TYPE_ID = 7;

      await banking.setBalance(user.data.id, CASE_COST);

      const date = new Date();
      const { data: { result } } = await cases.playCaseWithoutChance(CASE_ID);
      // console.log(user.data);
      // console.log(result);
      const { data } = await cases.raitingCase();
      // console.log(data);
      const resultItem = data.find(item => item.id === user.data.id);
      checkRatingRecord(resultItem, user.data.name, result, CASE_TYPE_ID, date);
    });
  });

  describe('User should be in rating no more than 3 times', () => {
    const CASE_COST_RUB = 500;
    const CASE_ID_RUB = 4;

    it('C1802209 - did not play cases', async () => {
      const { data: user } = await register.usualReg();
      const { data } = await cases.raitingCase();
      // console.log(data);
      data.forEach((ratingPosition) => {
        expect(ratingPosition.name).not.toEqual(user.name);
      });
    });

    it('C1802211 - played case one time', async () => {
      const { data: user } = await register.usualReg();
      // console.log(user.name);
      await banking.setBalance(user.id, CASE_COST_RUB);
      await cases.playCaseWithoutChance(CASE_ID_RUB);
      const { data } = await cases.raitingCase();
      // console.log(data);
      const count = data.reduce((n, ratingPosition) => {
        // eslint-disable-next-line no-param-reassign
        if (ratingPosition.name === user.name) { n++; }
        return n;
      }, 0);
      // console.log(count);
      expect(count).toBeLessThanOrEqual(1);
    });

    it('C1802214 - played cases three times', async () => {
      const { data: user } = await register.usualReg();
      // console.log(user.name);
      await banking.setBalance(user.id, CASE_COST_RUB * 3);
      for (let i = 0; i < 3; i++) {
        // eslint-disable-next-line no-await-in-loop
        await cases.playCaseWithoutChance(CASE_ID_RUB);
      }
      const { data } = await cases.raitingCase();
      // console.log(data);
      const count = data.reduce((n, ratingPosition) => {
        // eslint-disable-next-line no-param-reassign
        if (ratingPosition.name === user.name) { n++; }
        return n;
      }, 0);
      // console.log(count);
      expect(count).toBeLessThanOrEqual(3);
    });

    // сейчас не работает, юзер отображается более 3 раз
    it.skip('C1802219 - played more than three times', async () => {
      const { data: user } = await register.usualReg();
      // console.log(user.name);
      await banking.setBalance(user.id, CASE_COST_RUB * 10);
      for (let i = 0; i < 10; i++) {
        // eslint-disable-next-line no-await-in-loop
        await cases.playCaseWithoutChance(CASE_ID_RUB);
      }
      const { data } = await cases.raitingCase();
      // console.log(data);
      const count = data.reduce((n, ratingPosition) => {
        // eslint-disable-next-line no-param-reassign
        if (ratingPosition.name === user.name) { n++; }
        return n;
      }, 0);
      // console.log(count);
      expect(count).toBeLessThanOrEqual(3);
    });
  });
});
