import { cases } from '../../src/methods/cases';
import { register } from '../../src/methods/register';
import { checkCaseInfoByTypeId, checkInfoCase } from '../../src/expects/exCases';
import { getNewSocket } from '../global';

describe('Get cases info', () => {
  describe('RUB', () => {
    let socket;

    beforeAll(async () => {
      socket = await getNewSocket();
      await register.oneClickReg(socket);
    });

    it('C483524 - all cases', async () => {
      const { data } = await cases.getCaseInfo(socket, 'all');

      // console.log(data);
      checkInfoCase(data, 0, 10, 'RUB', 1, 100,
        2, 'Новичок', 100, 2, 0);
      checkInfoCase(data, 1, 20, 'RUB', 2, 200,
        5, 'Везунчик', 200, 5, 1);
      checkInfoCase(data, 2, 50, 'RUB', 3, 500,
        10, 'Топовый', 500, 10, 2);
      checkInfoCase(data, 3, 100, 'RUB', 4, 500,
        50, 'Фартовый', 500, 50, 3);
      checkInfoCase(data, 4, 500, 'RUB', 5, 5000,
        100, 'Лакшери', 5000, 100, 4);
      checkInfoCase(data, 5, 1000, 'RUB', 6, 10000,
        500, 'Олигарх', 10000, 500, 5);
      checkInfoCase(data, 6, 5000, 'RUB', 7, 10000,
        2500, 'Миллионер', 10000, 2500, 6);
      checkInfoCase(data, 7, 10000, 'RUB', 8, 50000,
        5000, 'Хозяин жизни', 50000, 5000, 7);
    });
    it('C1436413 - get case info by TypeId', async () => {
      const { data } = await cases.getCaseInfoByTypeId(socket, 1);
      // console.log(data);
      checkCaseInfoByTypeId(data, 0, 1, 2);
      checkCaseInfoByTypeId(data, 1, 1, 11);
      checkCaseInfoByTypeId(data, 2, 1, 18);
    });
  });

  describe('USD', () => {
    beforeAll(async () => {
      socket = await getNewSocket();
      await register.oneClickRegUSD(socket);
    });

    it('C483525 - all cases', async () => {
      const { data } = await cases.getCaseInfo(socket, 'all');

      // console.log(data);
      checkInfoCase(data, 0, 1, 'USD', 10, 10,
        0.2, 'Топовый', 10, 0.2, 2);
      checkInfoCase(data, 1, 0.4, 'USD', 11, 4,
        0.08, 'Везунчик', 4, 0.08, 1);
      checkInfoCase(data, 2, 2, 'USD', 12, 10,
        1, 'Фартовый', 10, 1, 3);
      checkInfoCase(data, 3, 10, 'USD', 13, 100,
        2, 'Лакшери', 100, 2, 4);
      checkInfoCase(data, 4, 0.2, 'USD', 14, 2,
        0.04, 'Новичок', 2, 0.04, 0);
      checkInfoCase(data, 5, 20, 'USD', 22, 200,
        10, 'Олигарх', 200, 10, 5);
      checkInfoCase(data, 6, 100, 'USD', 24, 200,
        50, 'Миллионер', 200, 50, 6);
      checkInfoCase(data, 7, 200, 'USD', 26, 1000,
        100, 'Хозяин жизни', 1000, 100, 7);
    });
  });
});
