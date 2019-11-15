import { cases } from '../../src/methods/cases';
import { register } from '../../src/methods/register';
import { checkInfoCase } from '../../src/expects/exCases';
import { changeCurrency } from '../../src/methods/user';
import { sleep } from '../../src/methods/utils';

describe('Get all info about cases for different currencies', () => {
  beforeEach(async () => {
    await register.oneClickReg();
    sleep(3);
  });

  it('C1461832 - currency RUB', async () => {
    await changeCurrency('RUB');
    const { data } = await cases.getCaseInfo('all');

    checkInfoCase(data, 0, 50, 'RUB', 1, 500,
      10, 'Топовый', 500, 10, 0);
    checkInfoCase(data, 1, 20, 'RUB', 2, 200,
      5, 'Везунчик', 200, 5, 1);
    checkInfoCase(data, 2, 100, 'RUB', 3, 500,
      50, 'Фартовый', 500, 50, 2);
    checkInfoCase(data, 3, 500, 'RUB', 4, 5000,
      100, 'Лакшери', 5000, 100, 3);
    checkInfoCase(data, 4, 10, 'RUB', 5, 100,
      2, 'Новичок', 100, 2, 4);
    checkInfoCase(data, 5, 1000, 'RUB', 6, 10000,
      500, 'Олигарх', 10000, 500, 5);
    checkInfoCase(data, 6, 5000, 'RUB', 7, 10000,
      2500, 'Миллионер', 10000, 2500, 6);
    checkInfoCase(data, 7, 10000, 'RUB', 8, 50000,
      5000, 'Хозяин жизни', 50000, 5000, 7);
  });

  it('C1461833 - currency USD', async () => {
    await changeCurrency('USD');
    const { data } = await cases.getCaseInfo('all');

    checkInfoCase(data, 0, 1, 'USD', 10, 10,
      0.2, 'Топовый', 10, 0.2, 0);
    checkInfoCase(data, 1, 0.4, 'USD', 11, 4,
      0.08, 'Везунчик', 4, 0.08, 1);
    checkInfoCase(data, 2, 2, 'USD', 12, 10,
      1, 'Фартовый', 10, 1, 2);
    checkInfoCase(data, 3, 10, 'USD', 13, 100,
      2, 'Лакшери', 100, 2, 3);
    checkInfoCase(data, 4, 0.2, 'USD', 14, 2,
      0.04, 'Новичок', 2, 0.04, 4);
    checkInfoCase(data, 5, 20, 'USD', 15, 200,
      10, 'Олигарх', 200, 10, 5);
    checkInfoCase(data, 6, 100, 'USD', 16, 200,
      50, 'Миллионер', 200, 50, 6);
    checkInfoCase(data, 7, 200, 'USD', 17, 1000,
      100, 'Хозяин жизни', 1000, 100, 7);
  });

  it('C1461834 - currency EUR', async () => {
    await changeCurrency('EUR');
    const { data } = await cases.getCaseInfo('all');

    checkInfoCase(data, 0, 1, 'EUR', 18, 10,
      0.2, 'Топовый', 10, 0.2, 0);
    checkInfoCase(data, 1, 0.4, 'EUR', 19, 4,
      0.08, 'Везунчик', 4, 0.08, 1);
    checkInfoCase(data, 2, 2, 'EUR', 20, 10,
      1, 'Фартовый', 10, 1, 2);
    checkInfoCase(data, 3, 10, 'EUR', 21, 100,
      2, 'Лакшери', 100, 2, 3);
    checkInfoCase(data, 4, 0.2, 'EUR', 22, 2,
      0.04, 'Новичок', 2, 0.04, 4);
    checkInfoCase(data, 5, 20, 'EUR', 23, 200,
      10, 'Олигарх', 200, 10, 5);
    checkInfoCase(data, 6, 100, 'EUR', 24, 200,
      50, 'Миллионер', 200, 50, 6);
    checkInfoCase(data, 7, 200, 'EUR', 25, 1000,
      100, 'Хозяин жизни', 1000, 100, 7);
  });
});
