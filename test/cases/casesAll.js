import { cases } from '../../src/methods/cases';
import { register } from '../../src/methods/register';
import { checkInfoCase } from '../../src/expects/exCases';

describe('Get cases info', () => {
  describe('RUB', () => {
    beforeAll(async () => {
      await register.oneClickReg(socket);
    });

    it('C483524 - all cases', async () => {
      const { data } = await cases.getCaseInfo('all');

      // console.log(data);
      checkInfoCase(data, 0, 10, 'RUB', 1, 100,
        2, 'Парни', 100, 2);
      checkInfoCase(data, 1, 20, 'RUB', 2, 200,
        5, 'Я', 200, 5);
      checkInfoCase(data, 2, 50, 'RUB', 3, 500,
        10, 'Вас', 500, 10);
      checkInfoCase(data, 3, 100, 'RUB', 4, 500,
        50, 'Никогда', 500, 50);
      checkInfoCase(data, 4, 500, 'RUB', 5, 5000,
        100, 'Не забуду.', 5000, 100);
      checkInfoCase(data, 5, 1000, 'RUB', 6, 10000,
        500, 'p.s.', 10000, 500);
      checkInfoCase(data, 6, 5000, 'RUB', 7, 10000,
        2500, 'Это мой', 10000, 2500);
      checkInfoCase(data, 7, 10000, 'RUB', 8, 50000,
        5000, 'Любимый микросервис', 50000, 5000);
    });
  });

  describe('USD', () => {
    beforeAll(async () => {
      await register.oneClickRegUSD(socket);
    });

    it('C483525 - all cases', async () => {
      const { data } = await cases.getCaseInfo('all');

      // console.log(data);
      checkInfoCase(data, 0, 10, 'USD', 10, 100,
        2, 'case 1', 100, 2);
      checkInfoCase(data, 1, 20, 'USD', 11, 200,
        5, 'case 2', 200, 5);
      checkInfoCase(data, 2, 50, 'USD', 12, 500,
        10, 'case 3', 500, 10);
      checkInfoCase(data, 3, 100, 'USD', 13, 500,
        50, 'case 4', 500, 50);
      checkInfoCase(data, 4, 500, 'USD', 14, 5000,
        100, 'case 5', 5000, 100);
      checkInfoCase(data, 5, 1000, 'USD', 15, 10000,
        500, 'case 6', 10000, 500);
    });
  });
});
