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
import { regUsersAndPlayCases } from '../../../../src/methods/regUsersForPartner';
import { caseIdByCost } from '../../../../src/caseCostIdMap';

describe('Payments to revshare partner from cases', () => {
  const defaultPass = '123123AA';
  let partnerEmail;
  let promocode;

  beforeAll(async () => {
    const dbResult = await mysqlConnection.executeQuery('DELETE FROM 1win.riskmanagement_ip_log;');
    // console.log(dbResult);
    await sleep(1500);
  });

  beforeEach(async () => {
    promocode = randomNum(10).toString();
    partnerEmail = `${randomStr(10)}@ahem.email`;
    // console.log(partnerEmail);
  });

  describe('All partner and player currency combinations', () => {
    it('C1789885 (+) Partner RUB + player RUB', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);
      const { caseResults } = await regUsersAndPlayCases(1, 1, 1000, 'RUB', promocode);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'RUB', 'RUB');
    });

    it('C1789886 (+) Partner RUB + player USD', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);
      const { caseResults } = await regUsersAndPlayCases(1, 1, 20, 'USD', promocode);


      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'RUB', 'USD');
    });

    it('C1789887 (+) Partner RUB + player EUR', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);
      const { caseResults } = await regUsersAndPlayCases(1, 1, 20, 'EUR', promocode);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'RUB', 'EUR');
    });

    it('C1789888 (+) Partner RUB + player UAH', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);
      const { caseResults } = await regUsersAndPlayCases(1, 1, 500, 'UAH', promocode);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'RUB', 'UAH');
    });

    it('C1789889 (+) Partner USD + player RUB', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);
      const { caseResults } = await regUsersAndPlayCases(1, 1, 1000, 'RUB', promocode);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'USD', 'RUB');
    });

    it('C1789890 (+) Partner USD + player USD', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);
      const { caseResults } = await regUsersAndPlayCases(1, 1, 20, 'USD', promocode);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'USD', 'USD');
    });

    it('C1789891 (+) Partner USD + player EUR', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);
      const { caseResults } = await regUsersAndPlayCases(1, 1, 20, 'EUR', promocode);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'USD', 'EUR');
    });

    it('C1789892 (+) Partner USD + player UAH', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);
      const { caseResults } = await regUsersAndPlayCases(1, 1, 500, 'UAH', promocode);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'USD', 'UAH');
    });

    it('C1789893 (+) Partner EUR + player RUB', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);
      const { caseResults } = await regUsersAndPlayCases(1, 1, 1000, 'RUB', promocode);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'EUR', 'RUB');
    });

    it('C1789894 (+) Partner EUR + player USD', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);
      const { caseResults } = await regUsersAndPlayCases(1, 1, 20, 'USD', promocode);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'EUR', 'USD');
    });

    it('C1789895 (+) Partner EUR + player EUR', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);
      const { caseResults } = await regUsersAndPlayCases(1, 1, 20, 'EUR', promocode);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'EUR', 'EUR');
    });

    it('C1789896 (+) Partner EUR + player UAH', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);
      const { caseResults } = await regUsersAndPlayCases(1, 1, 500, 'UAH', promocode);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'EUR', 'UAH');
    });
  });

  describe('Cases played several times', () => {
    it('C1789897 (+) Different partner and player currency, same case', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);
      const { caseResults } = await regUsersAndPlayCases(1, 2, 1000, 'RUB', promocode);

      await sleep(5000);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'USD', 'RUB');
    });

    it('C1789898 (+) Same partner and player currency, same case', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);
      const { caseResults } = await regUsersAndPlayCases(1, 2, 1000, 'RUB', promocode);

      await sleep(5000);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'RUB', 'RUB');
    });

    it('C1789899 (+) Same partner and player currency, different cases', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);
      const { data: user } = await register.oneClickRegWithPromocode(promocode, 'RUB');
      // console.log(user);
      await banking.setBalance(user.id, 1500);
      const { data: caseWin } = await cases.playCaseWithoutChance(caseIdByCost('RUB', 1000));
      // console.log(caseWin);
      const { data: caseWin2 } = await cases.playCaseWithoutChance(caseIdByCost('RUB', 500));
      // console.log(caseWin2);

      await sleep(5000);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{ caseCost: 1000, profit: caseWin.result }, { caseCost: 500, profit: caseWin2.result }], 'RUB', 'RUB');
    });

    it('C1789900 (+) Different partner and player currency, different cases', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);
      const { data: user } = await register.oneClickRegWithPromocode(promocode, 'RUB');
      // console.log(user);
      await banking.setBalance(user.id, 1500);
      const { data: caseWin } = await cases.playCaseWithoutChance(caseIdByCost('RUB', 1000));
      // console.log(caseWin);
      const { data: caseWin2 } = await cases.playCaseWithoutChance(caseIdByCost('RUB', 500));
      // console.log(caseWin2);

      await sleep(5000);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{ caseCost: 1000, profit: caseWin.result }, { caseCost: 500, profit: caseWin2.result }], 'USD', 'RUB');
    });
  });
});
