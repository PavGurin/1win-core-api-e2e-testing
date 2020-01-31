import { register } from '../../src/methods/register';
import { history } from '../../src/methods/history';
import { banking } from '../../src/methods/banking';
import { cases } from '../../src/methods/cases';
import { checkHistoryCase } from '../../src/expects/exHistory';
import { changeCurrency } from '../../src/methods/user';

// детализация по кейсам больше не выводится
describe.skip('Cases history', () => {
  describe('User with no cases played', () => {
    it(' (-) new user, try to open cases', async () => {
      await register.oneClickReg();
      const { data } = await history.category('cases');
      // console.log(data);
      expect(data.count).toBe(0);
      expect(data.items).toBeEmpty();
    });
  });

  describe('Users with cases played', () => {
    const TWENTY_ROUBLES_CASE_ID = 2;
    const HUNDRED_ROUBLES_CASE_ID = 3;
    const FIVE_HUNDRED_ROUBLES_CASE_ID = 4;
    const TEN_USD_CASE_ID = 13;
    const TEN_EUR_CASE_ID = 21;

    it(' (+) played case one time RUB', async () => {
      const caseCost = 100;

      const { data: user } = await register.oneClickReg();
      await banking.setBalance(user.id, caseCost);
      const { data: caseResult } = await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);

      const { data } = await history.category('cases');
      // console.log(data);
      // console.log(data.items[0].pnl);
      checkHistoryCase(data, new Date(), 'RUB', (caseResult.result - caseCost).toFixed(2));
    });

    it(' (+) played case one time USD', async () => {
      const caseCost = 10;

      const { data: user } = await register.oneClickRegUSD();
      await banking.setBalance(user.id, caseCost);
      const { data: caseResult } = await cases.playCaseWithoutChance(TEN_USD_CASE_ID);

      const { data } = await history.category('cases');
      // console.log(data);
      // console.log(data.items[0].pnl);
      checkHistoryCase(data, new Date(), 'USD', (caseResult.result - caseCost).toFixed(2));
    });

    it(' (+) played case one time EUR', async () => {
      const caseCost = 10;

      const { data: user } = await register.oneClickRegEUR();
      await banking.setBalance(user.id, caseCost);
      const { data: caseResult } = await cases.playCaseWithoutChance(TEN_EUR_CASE_ID);

      const { data } = await history.category('cases');
      // console.log(data);
      // console.log(data.items[0].pnl);
      checkHistoryCase(data, new Date(), 'EUR', (caseResult.result - caseCost).toFixed(2));
    });

    it(' (+) played cases in all currencies', async () => {
      const caseCostRub = 100;
      const caseCostUsdEur = 10;

      const { data: user } = await register.oneClickReg();
      await changeCurrency('USD');
      await changeCurrency('EUR');
      await banking.setBalance(user.id, caseCostRub);

      const { data: caseResultEur } = await cases.playCaseWithoutChance(TEN_EUR_CASE_ID);

      await changeCurrency('USD');
      const { data: caseResultUsd } = await cases.playCaseWithoutChance(TEN_USD_CASE_ID);

      await changeCurrency('RUB');
      const { data: caseResultRub } = await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);

      const { data } = await history.category('cases');
      // console.log(data);
      // console.log(data.items[0].pnl);
      checkHistoryCase(data, new Date(), 'RUB', (caseResultRub.result - caseCostRub).toFixed(2));
      checkHistoryCase(data, new Date(), 'EUR', (caseResultEur.result - caseCostUsdEur).toFixed(2));
      checkHistoryCase(data, new Date(), 'USD', (caseResultUsd.result - caseCostUsdEur).toFixed(2));
    });

    it(' (+) played several cases of one currency', async () => {
      const caseCost = 620;

      const { data: user } = await register.oneClickReg();
      await banking.setBalance(user.id, caseCost);

      const { data: caseResult } = await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
      const { data: caseResult2 } = await cases.playCaseWithoutChance(FIVE_HUNDRED_ROUBLES_CASE_ID);
      const { data: caseResult3 } = await cases.playCaseWithoutChance(TWENTY_ROUBLES_CASE_ID);

      const { data } = await history.category('cases');
      // console.log(data, caseResult, caseResult2, caseResult3);
      // console.log(data.items[0].pnl);
      checkHistoryCase(data, new Date(), 'RUB', (caseResult.result + caseResult2.result + caseResult3.result - caseCost).toFixed(2));
    });
  });
});
