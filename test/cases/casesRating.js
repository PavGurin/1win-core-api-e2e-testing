import { expect } from 'chai';
import { cases } from '../../src/methods/cases';
import { register } from '../../src/methods/register';

describe('Get raiting cases', () => {
  describe('RUB', () => {
    beforeAll(async () => {
      await register.oneClickReg();
    });

    it('C483526 - valid request cases rating', async () => {
      const data = await cases.raitingCase();

      // console.log(data);
      expect(data.status).equal(200);
      expect(data).to.be.an('object');
    });
  });

  describe('USD', () => {
    beforeAll(async () => {
      await register.oneClickRegUSD();
    });

    it('C483527 -  valid request cases rating', async () => {
      const data = await cases.raitingCase();

      // console.log(data);
      expect(data.status).equal(200);
      expect(data).to.be.an('object');
    });
  });
});
