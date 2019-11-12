import { cases } from '../../src/methods/cases';
import { register } from '../../src/methods/register';
import { getNewSocket } from '../global';

describe('Get raiting cases', () => {
  describe('RUB', () => {
    let socket;

    beforeAll(async () => {
      socket = await getNewSocket();
      await register.oneClickReg(socket);
    });

    it('C483526 - valid request cases rating', async () => {
      const data = await cases.raitingCase(socket);

      // console.log(data);
      expect(data.status).toEqual(200);
      for (let i = 0; i < Object.values(data)[1].length; i++) {
        const { caseTypeId } = Object.values(data)[1][0];
        expect(caseTypeId).toBeNumber();
      }
      expect(data).toBeObject();
    });
  });

  describe('USD', () => {
    let socket;

    beforeAll(async () => {
      socket = await getNewSocket();
      await register.oneClickRegUSD(socket);
    });

    it('C483527 -  valid request cases rating', async () => {
      const data = await cases.raitingCase(socket);

      // console.log(data);
      expect(data.status).toEqual(200);
      for (let i = 0; i < Object.values(data)[1].length; i++) {
        const { caseTypeId } = Object.values(data)[1][0];
        expect(caseTypeId).toBeNumber();
      }
      expect(data).toBeObject();
    });
  });
});
