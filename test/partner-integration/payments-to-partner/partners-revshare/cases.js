/**
 * @jest-environment node
 */

import { partner } from '../../../../src/methods/partner';
import { randomNum, randomStr } from '../../../../src/randomizer';
import { register } from '../../../../src/methods/register';
import { cases } from '../../../../src/methods/cases';
import { banking } from '../../../../src/methods/banking';
import {
  checkPartnerPaymentCase,
} from '../../../../src/expects/exPartner';
import { sleep } from '../../../../src/methods/utils';
import { mysqlConnection } from '../../../../src/methods/mysqlConnection';

describe('Payments to revshare partner from cases', () => {
  const defaultPass = '123123AA';
  const THOUSAND_ROUBLES_CASE_ID = 6;
  const CASE_COST_RUB = 1000;
  const TEN_USD_CASE_ID = 13;
  const CASE_COST_USD = 10;
  const TEN_EUR_CASE_ID = 21;
  const CASE_COST_EUR = 10;
  const FIVE_HUNDRED_UAH_CASE_ID = 31;
  const CASE_COST_UAH = 500;

  beforeAll(async () => {
    const dbResult = await mysqlConnection.executeQuery('DELETE FROM 1win.riskmanagement_ip_log;');
    // console.log(dbResult);
    await sleep(1500);
  });

  describe('All partner and player currency combinations', () => {
    it('C1789885 (+) Partner RUB + player RUB', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      // console.log(partnerEmail);

      await partner.register(partnerEmail, defaultPass, 'RUB');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);
      const { data: user } = await register.oneClickRegRubWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_RUB);
      const { data: caseWin } = await cases.playCaseWithoutChance(THOUSAND_ROUBLES_CASE_ID);
      // console.log(caseWin);

      await sleep(1000);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId);
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId);
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{ caseCost: CASE_COST_RUB, profit: caseWin.result }], 'RUB', 'RUB');
    });

    it('C1789886 (+) Partner RUB + player USD', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      // console.log(partnerEmail);

      await partner.register(partnerEmail, defaultPass, 'RUB');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);
      const { data: user } = await register.oneClickRegUsdWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_USD);
      const { data: caseWin } = await cases.playCaseWithoutChance(TEN_USD_CASE_ID);
      // console.log(caseWin);

      await sleep(1000);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId);
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId);
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{ caseCost: CASE_COST_USD, profit: caseWin.result }], 'RUB', 'USD');
    });

    it('C1789887 (+) Partner RUB + player EUR', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      // console.log(partnerEmail);

      await partner.register(partnerEmail, defaultPass, 'RUB');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);
      const { data: user } = await register.oneClickRegEurWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_EUR);
      const { data: caseWin } = await cases.playCaseWithoutChance(TEN_EUR_CASE_ID);
      // console.log(caseWin);

      await sleep(1000);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId);
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId);
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{ caseCost: CASE_COST_EUR, profit: caseWin.result }], 'RUB', 'EUR');
    });

    it('C1789888 (+) Partner RUB + player UAH', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      // console.log(partnerEmail);

      await partner.register(partnerEmail, defaultPass, 'RUB');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);
      const { data: user } = await register.oneClickRegUahWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_UAH);
      const { data: caseWin } = await cases.playCaseWithoutChance(FIVE_HUNDRED_UAH_CASE_ID);
      // console.log(caseWin);

      await sleep(1000);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId);
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId);
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{ caseCost: CASE_COST_UAH, profit: caseWin.result }], 'RUB', 'UAH');
    });

    it('C1789889 (+) Partner USD + player RUB', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      // console.log(partnerEmail);

      await partner.register(partnerEmail, defaultPass, 'USD');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);
      const { data: user } = await register.oneClickRegRubWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_RUB);
      const { data: caseWin } = await cases.playCaseWithoutChance(THOUSAND_ROUBLES_CASE_ID);
      // console.log(caseWin);

      await sleep(1000);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId);
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId);
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{ caseCost: CASE_COST_RUB, profit: caseWin.result }], 'USD', 'RUB');
    });

    it('C1789890 (+) Partner USD + player USD', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      // console.log(partnerEmail);

      await partner.register(partnerEmail, defaultPass, 'USD');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);
      const { data: user } = await register.oneClickRegUsdWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_USD);
      const { data: caseWin } = await cases.playCaseWithoutChance(TEN_USD_CASE_ID);
      // console.log(caseWin);

      await sleep(1000);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId);
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId);
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{ caseCost: CASE_COST_USD, profit: caseWin.result }], 'USD', 'USD');
    });

    it('C1789891 (+) Partner USD + player EUR', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      // console.log(partnerEmail);

      await partner.register(partnerEmail, defaultPass, 'USD');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);
      const { data: user } = await register.oneClickRegEurWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_EUR);
      const { data: caseWin } = await cases.playCaseWithoutChance(TEN_EUR_CASE_ID);
      // console.log(caseWin);

      await sleep(1000);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId);
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId);
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{ caseCost: CASE_COST_EUR, profit: caseWin.result }], 'USD', 'EUR');
    });

    it('C1789892 (+) Partner USD + player UAH', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      // console.log(partnerEmail);

      await partner.register(partnerEmail, defaultPass, 'USD');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);
      const { data: user } = await register.oneClickRegUahWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_UAH);
      const { data: caseWin } = await cases.playCaseWithoutChance(FIVE_HUNDRED_UAH_CASE_ID);
      // console.log(caseWin);

      await sleep(1000);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId);
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId);
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{ caseCost: CASE_COST_UAH, profit: caseWin.result }], 'USD', 'UAH');
    });

    it('C1789893 (+) Partner EUR + player RUB', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      // console.log(partnerEmail);

      await partner.register(partnerEmail, defaultPass, 'EUR');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);
      const { data: user } = await register.oneClickRegRubWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_RUB);
      const { data: caseWin } = await cases.playCaseWithoutChance(THOUSAND_ROUBLES_CASE_ID);
      // console.log(caseWin);

      await sleep(1000);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId);
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId);
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{ caseCost: CASE_COST_RUB, profit: caseWin.result }], 'EUR', 'RUB');
    });

    it('C1789894 (+) Partner EUR + player USD', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      // console.log(partnerEmail);

      await partner.register(partnerEmail, defaultPass, 'EUR');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);
      const { data: user } = await register.oneClickRegUsdWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_USD);
      const { data: caseWin } = await cases.playCaseWithoutChance(TEN_USD_CASE_ID);
      // console.log(caseWin);

      await sleep(1000);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId);
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId);
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{ caseCost: CASE_COST_USD, profit: caseWin.result }], 'EUR', 'USD');
    });

    it('C1789895 (+) Partner EUR + player EUR', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      // console.log(partnerEmail);

      await partner.register(partnerEmail, defaultPass, 'EUR');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);
      const { data: user } = await register.oneClickRegEurWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_EUR);
      const { data: caseWin } = await cases.playCaseWithoutChance(TEN_EUR_CASE_ID);
      // console.log(caseWin);

      await sleep(1000);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId);
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId);
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{ caseCost: CASE_COST_EUR, profit: caseWin.result }], 'EUR', 'EUR');
    });

    it('C1789896 (+) Partner EUR + player UAH', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      // console.log(partnerEmail);

      await partner.register(partnerEmail, defaultPass, 'EUR');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);
      const { data: user } = await register.oneClickRegUahWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_UAH);
      const { data: caseWin } = await cases.playCaseWithoutChance(FIVE_HUNDRED_UAH_CASE_ID);
      // console.log(caseWin);

      await sleep(1000);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId);
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId);
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{ caseCost: CASE_COST_UAH, profit: caseWin.result }], 'EUR', 'UAH');
    });
  });

  describe('Cases played several times', () => {
    it('C1789897 (+) Different partner and player currency, same case', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      // console.log(partnerEmail);

      await partner.register(partnerEmail, defaultPass, 'USD');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);
      const { data: user } = await register.oneClickRegRubWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_RUB * 2);
      const { data: caseWin } = await cases.playCaseWithoutChance(THOUSAND_ROUBLES_CASE_ID);
      // console.log(caseWin);

      await sleep(1000);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId);
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId);
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{ caseCost: CASE_COST_RUB, profit: caseWin.result }], 'USD', 'RUB');

      const { data: caseWin2 } = await cases.playCaseWithoutChance(THOUSAND_ROUBLES_CASE_ID);
      // console.log(caseWin2);

      await sleep(1000);
      const { data: statsAll2 } = await partner.getStatsAll(cookie, promocodeId);
      // console.log(statsAll2);

      const { data: statsDay2 } = await partner.getStatsDay(cookie, new Date(), promocodeId);
      // console.log(statsDay2);

      await checkPartnerPaymentCase(statsAll2, statsDay2.days[0], [{ caseCost: CASE_COST_RUB, profit: caseWin.result }, { caseCost: CASE_COST_RUB, profit: caseWin2.result }], 'USD', 'RUB');
    });

    it('C1789898 (+) Same partner and player currency, same case', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      // console.log(partnerEmail);

      await partner.register(partnerEmail, defaultPass, 'RUB');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);
      const { data: user } = await register.oneClickRegRubWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_RUB * 2);
      const { data: caseWin } = await cases.playCaseWithoutChance(THOUSAND_ROUBLES_CASE_ID);
      // console.log(caseWin);

      await sleep(1000);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId);
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId);
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{ caseCost: CASE_COST_RUB, profit: caseWin.result }], 'RUB', 'RUB');

      const { data: caseWin2 } = await cases.playCaseWithoutChance(THOUSAND_ROUBLES_CASE_ID);
      // console.log(caseWin2);

      await sleep(1000);
      const { data: statsAll2 } = await partner.getStatsAll(cookie, promocodeId);
      // console.log(statsAll2);

      const { data: statsDay2 } = await partner.getStatsDay(cookie, new Date(), promocodeId);
      // console.log(statsDay2);

      await checkPartnerPaymentCase(statsAll2, statsDay2.days[0], [{ caseCost: CASE_COST_RUB, profit: caseWin.result }, { caseCost: CASE_COST_RUB, profit: caseWin2.result }], 'RUB', 'RUB');
    });

    it('C1789899 (+) Same partner and player currency, different cases', async () => {
      const CASE_COST_RUB_2 = 500;
      const FIVE_HUNDRED_ROUBLES_CASE_ID = 4;

      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      // console.log(partnerEmail);

      await partner.register(partnerEmail, defaultPass, 'RUB');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);
      const { data: user } = await register.oneClickRegRubWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_RUB + CASE_COST_RUB_2);
      const { data: caseWin } = await cases.playCaseWithoutChance(THOUSAND_ROUBLES_CASE_ID);
      // console.log(caseWin);

      await sleep(1000);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId);
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId);
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{ caseCost: CASE_COST_RUB, profit: caseWin.result }], 'RUB', 'RUB');

      const { data: caseWin2 } = await cases.playCaseWithoutChance(FIVE_HUNDRED_ROUBLES_CASE_ID);
      // console.log(caseWin2);

      await sleep(1000);
      const { data: statsAll2 } = await partner.getStatsAll(cookie, promocodeId);
      // console.log(statsAll2);

      const { data: statsDay2 } = await partner.getStatsDay(cookie, new Date(), promocodeId);
      // console.log(statsDay2);

      await checkPartnerPaymentCase(statsAll2, statsDay2.days[0], [{ caseCost: CASE_COST_RUB, profit: caseWin.result }, { caseCost: CASE_COST_RUB_2, profit: caseWin2.result }], 'RUB', 'RUB');
    });

    it('C1789900 (+) Different partner and player currency, different cases', async () => {
      const CASE_COST_RUB_2 = 500;
      const FIVE_HUNDRED_ROUBLES_CASE_ID = 4;

      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      // console.log(partnerEmail);

      await partner.register(partnerEmail, defaultPass, 'USD');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);
      const { data: user } = await register.oneClickRegRubWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_RUB + CASE_COST_RUB_2);
      const { data: caseWin } = await cases.playCaseWithoutChance(THOUSAND_ROUBLES_CASE_ID);
      // console.log(caseWin);

      await sleep(1000);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId);
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId);
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{ caseCost: CASE_COST_RUB, profit: caseWin.result }], 'USD', 'RUB');

      const { data: caseWin2 } = await cases.playCaseWithoutChance(FIVE_HUNDRED_ROUBLES_CASE_ID);
      // console.log(caseWin2);

      await sleep(1000);
      const { data: statsAll2 } = await partner.getStatsAll(cookie, promocodeId);
      // console.log(statsAll2);

      const { data: statsDay2 } = await partner.getStatsDay(cookie, new Date(), promocodeId);
      // console.log(statsDay2);

      await checkPartnerPaymentCase(statsAll2, statsDay2.days[0], [{ caseCost: CASE_COST_RUB, profit: caseWin.result }, { caseCost: CASE_COST_RUB_2, profit: caseWin2.result }], 'USD', 'RUB');
    });
  });
});
