import { register } from '../../src/methods/register';
import { banking } from '../../src/methods/banking';
import { checkBalanceCreate } from '../../src/expects/exBanking';
import { checkErrMsg } from '../../src/responseChecker';
import { mysqlConnection } from '../../src/methods/mysqlConnection';

describe('Balance-create route tests', () => {
  it('C2240435 - unauthorized', async () => {
    const currency = 'EUR';
    const { data } = await banking.balanceCreate(currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный запрос');
  });
  it('C2240436 + RUB', async () => {
    const currency = 'RUB';
    const { data: user } = await register.oneClickReg({ currency: 'USD' });
    const { data } = await banking.balanceCreate(currency);
    // console.log(data);
    expect(data.error).toEqual(false);
    await checkBalanceCreate(user.id, currency);
  });
  it('C2240437 + USD', async () => {
    const currency = 'USD';
    const { data: user } = await register.oneClickReg();
    const { data } = await banking.balanceCreate(currency);
    // console.log(data);
    expect(data.error).toEqual(false);
    await checkBalanceCreate(user.id, currency);
  });
  it('C2240438 + EUR', async () => {
    const currency = 'EUR';
    const { data: user } = await register.usualReg();
    const { data } = await banking.balanceCreate(currency);
    // console.log(data);
    expect(data.error).toEqual(false);
    await checkBalanceCreate(user.id, currency);
  });
  it('C2240439 + UAH', async () => {
    const currency = 'UAH';
    const { data: user } = await register.usualReg();
    const { data } = await banking.balanceCreate(currency);
    // console.log(data);
    expect(data.error).toEqual(false);
    await checkBalanceCreate(user.id, currency);
  });
  it('C2240440 + AMD', async () => {
    const currency = 'AMD';
    const { data: user } = await register.usualReg();
    const { data } = await banking.balanceCreate(currency);
    // console.log(data);
    expect(data.error).toEqual(false);
    await checkBalanceCreate(user.id, currency);
  });
  it('C2240441 + JPY', async () => {
    const currency = 'JPY';
    const { data: user } = await register.usualReg();
    const { data } = await banking.balanceCreate(currency);
    // console.log(data);
    expect(data.error).toEqual(false);
    await checkBalanceCreate(user.id, currency);
  });
  it('C2240442 + CZK', async () => {
    const currency = 'CZK';
    const { data: user } = await register.usualReg();
    const { data } = await banking.balanceCreate(currency);
    // console.log(data);
    expect(data.error).toEqual(false);
    await checkBalanceCreate(user.id, currency);
  });
  it('C2240443 + GBP', async () => {
    const currency = 'GBP';
    const { data: user } = await register.oneClickReg();
    const { data } = await banking.balanceCreate(currency);
    // console.log(data);
    expect(data.error).toEqual(false);
    await checkBalanceCreate(user.id, currency);
  });
  it('C2240444 - try to create balance that already exists', async () => {
    const currency = 'RUB';
    const { data: user } = await register.oneClickReg();
    const { data } = await banking.balanceCreate(currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный запрос');
  });
  it('C2240445 - invalid currency', async () => {
    const currency = '125131';
    const { data: user } = await register.oneClickReg();
    const { data } = await banking.balanceCreate(currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, currency is invalid');
  });
  it('C2240446 - without currency', async () => {
    const { data: user } = await register.oneClickReg();
    const { data } = await banking.balanceCreate();
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, currency is required, no default value provided');
  });
  it('C2240447 - currency is number', async () => {
    const currency = 25;
    const { data: user } = await register.oneClickReg();
    const { data } = await banking.balanceCreate(currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, currency should have a type of string, but found number');
  });
  it('C2240448 + all valid currencies', async () => {
    const currencies = [
      // 'RUB',
      'USD',
      'EUR',
      'AMD',
      'AUD',
      'AZN',
      'BGN',
      'BRL',
      'BYN',
      'CAD',
      'CHF',
      'CNY',
      'CZK',
      'DKK',
      'GBP',
      'HUF',
      'INR',
      'JPY',
      'KGS',
      'KRW',
      'KZT',
      'MDL',
      'NOK',
      'PLN',
      'RON',
      'SEK',
      'SGD',
      'TJS',
      'TMT',
      'TRY',
      'UAH',
      'UZS',
      'XDR',
      'ZAR',
    ];
    const { data: user } = await register.oneClickReg();
    // await mysqlConnection.executeQuery(`delete from 1win.ma_balance
    // where id_user ='${user.id}' and currency = 'RUB'`);
    // eslint-disable-next-line no-restricted-syntax
    for await (const currency of currencies) {
      const { data } = await banking.balanceCreate(currency);
      // console.log(`${currency} ${JSON.stringify(data)}`);
      expect(data.error).toEqual(false);
      await checkBalanceCreate(user.id, currency);
    }
  });
});
