import { cases } from '../../src/methods/cases';
import { register } from '../../src/methods/register';

describe('Get raiting cases', () => {
  describe('RUB', () => {
    beforeEach(async () => {
      await register.oneClickReg();
    });

    it('C483526 - valid request cases rating', async () => {
      const data = await cases.raitingCase();

      // console.log(data);
      expect(data.status).toEqual(200);
      expect(data).toBeObject();
    });
  });

  describe('USD', () => {
    beforeEach(async () => {
      await register.oneClickRegUSD();
    });

    it('C483527 -  valid request cases rating', async () => {
      const data = await cases.raitingCase();

      // console.log(data);
      expect(data.status).toEqual(200);
      expect(data).toBeObject();
    });
  });
});
