/**
 * @jest-environment node
 */

import { randomNum, randomStr } from '../../../../src/randomizer';
import { partner } from '../../../../src/methods/partner';
import { sleep } from '../../../../src/methods/utils';
import { checkPartnerPaymentCasesHybrid } from '../../../../src/expects/exPartner';
import { mysqlConnection } from '../../../../src/methods/mysqlConnection';
import { regUsersAndPlayCases } from '../../../../src/methods/regUsersForPartner';

const defaultPass = '123123AA';
const CASE_COST_RUB = 1000;
const CASE_COST_USD = 10;
const CASE_COST_EUR = 10;
const CASE_COST_UAH = 500;

describe('Cases', () => {
  let promocode;
  let partnerEmail;

  beforeAll(async () => {
    const dbResult = await mysqlConnection.executeQuery('DELETE FROM 1win.riskmanagement_ip_log;');
    // console.log(dbResult);
    await sleep(1500);
  });

  beforeEach(() => {
    promocode = randomNum(10).toString();
    partnerEmail = `${randomStr(10)}@ahem.email`;
  });

  describe('Case one time + cpa qualified', () => {
    let presetNumber;
    beforeAll(async () => {
      presetNumber = await partner.createPreset(0, 0, 0, 0, 1, 100000, 1);
    });
    it('C2131463 Partner RUB + player RUB', async () => {
      const { info: { user: { id: partnerId } }, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'RUB');
      // console.log(`partnerId = ${partnerId}`);
      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocodeId);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_RUB, 'RUB', promocode);
      await sleep(10000);
      await partner.addCpaPaymentCk(partnerId);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);
      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        1, 1, 'RUB', 'RUB', partnerId);
    });
    it('C2131464 Partner RUB + player USD', async () => {
      const { info: { user: { id: partnerId } }, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'RUB');
      // console.log(`partnerId = ${partnerId}`);
      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocodeId);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_USD, 'USD', promocode);
      await sleep(10000);
      await partner.addCpaPaymentCk(partnerId);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);
      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        1, 1, 'RUB', 'USD', partnerId);
    });
    it('C2131465 Partner RUB + player EUR', async () => {
      const { info: { user: { id: partnerId } }, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'RUB');
      // console.log(`partnerId = ${partnerId}`);
      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocodeId);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_EUR, 'EUR', promocode);
      await sleep(10000);
      await partner.addCpaPaymentCk(partnerId);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        1, 1, 'RUB', 'EUR', partnerId);
    });
    it('C2131466 Partner RUB + player UAH', async () => {
      const { info: { user: { id: partnerId } }, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'RUB');
      // console.log(`partnerId = ${partnerId}`);
      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocodeId);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_UAH, 'UAH', promocode);
      await sleep(10000);
      await partner.addCpaPaymentCk(partnerId);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);
      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        1, 1, 'RUB', 'UAH', partnerId);
    });
    it('C2131467 Partner USD + player RUB', async () => {
      const { info: { user: { id: partnerId } }, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'USD');
      // console.log(`partnerId = ${partnerId}`);
      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocodeId);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_RUB, 'RUB', promocode);
      await sleep(10000);
      await partner.addCpaPaymentCk(partnerId);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);
      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        1, 1, 'USD', 'RUB', partnerId);
    });
    it('C2131468 Partner USD + player USD', async () => {
      const { info: { user: { id: partnerId } }, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'USD');
      // console.log(`partnerId = ${partnerId}`);
      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocodeId);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_USD, 'USD', promocode);
      await sleep(10000);
      await partner.addCpaPaymentCk(partnerId);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);
      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        1, 1, 'USD', 'USD', partnerId);
    });
    it('C2131469 Partner USD + player EUR', async () => {
      const { info: { user: { id: partnerId } }, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'USD');
      // console.log(`partnerId = ${partnerId}`);
      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocodeId);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_EUR, 'EUR', promocode);
      await sleep(10000);
      await partner.addCpaPaymentCk(partnerId);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        1, 1, 'USD', 'EUR', partnerId);
    });
    it('C2131470 Partner USD + player UAH', async () => {
      const { info: { user: { id: partnerId } }, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'USD');
      // console.log(`partnerId = ${partnerId}`);
      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocodeId);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_UAH, 'UAH', promocode);
      await sleep(10000);
      await partner.addCpaPaymentCk(partnerId);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);
      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        1, 1, 'USD', 'UAH', partnerId);
    });
    it('C2131471 Partner EUR + player RUB', async () => {
      const { info: { user: { id: partnerId } }, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'EUR');
      // console.log(`partnerId = ${partnerId}`);
      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocodeId);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_RUB, 'RUB', promocode);
      await sleep(10000);
      await partner.addCpaPaymentCk(partnerId);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);
      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        1, 1, 'EUR', 'RUB', partnerId);
    });
    it('C2131472 Partner EUR + player USD', async () => {
      const { info: { user: { id: partnerId } }, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'EUR');
      // console.log(`partnerId = ${partnerId}`);
      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocodeId);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_USD, 'USD', promocode);
      await sleep(10000);
      await partner.addCpaPaymentCk(partnerId);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);
      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        1, 1, 'EUR', 'USD', partnerId);
    });
    it('C2131473 Partner EUR + player EUR', async () => {
      const { info: { user: { id: partnerId } }, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'EUR');
      // console.log(`partnerId = ${partnerId}`);
      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocodeId);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_EUR, 'EUR', promocode);
      await sleep(10000);
      await partner.addCpaPaymentCk(partnerId);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);
      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        1, 1, 'EUR', 'EUR', partnerId);
    });
    it('C2131474 Partner EUR + player UAH', async () => {
      const { info: { user: { id: partnerId } }, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'EUR');
      // console.log(`partnerId = ${partnerId}`);
      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocodeId);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_UAH, 'UAH', promocode);
      await sleep(10000);
      await partner.addCpaPaymentCk(partnerId);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);
      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        1, 1, 'EUR', 'UAH', partnerId);
    });
  });

  describe('Case several times + cpa not qualified', () => {
    let presetNumber;
    beforeAll(async () => {
      presetNumber = await partner.createPreset(0, 0, 0, 0, 100, 100000, 1);
    });
    it('C2131475 Partner RUB + player RUB', async () => {
      const { info: { user: { id: partnerId } }, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'RUB');
      // console.log(`partnerId = ${partnerId}`);
      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocodeId);

      const { caseResults } = await regUsersAndPlayCases(1, 3, CASE_COST_RUB, 'RUB', promocode);
      await sleep(5000);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'rs_profit');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_rs_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        0, 0, 'RUB', 'RUB', partnerId);
    });
    it('C2131476 Partner RUB + player USD', async () => {
      const { info: { user: { id: partnerId } }, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'RUB');
      // console.log(`partnerId = ${partnerId}`);
      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocodeId);

      const { caseResults } = await regUsersAndPlayCases(1, 3, CASE_COST_USD, 'USD', promocode);
      await sleep(5000);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'rs_profit');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_rs_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        0, 0, 'RUB', 'USD', partnerId);
    });
    it('C2131477 Partner RUB + player EUR', async () => {
      const { info: { user: { id: partnerId } }, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'RUB');
      // console.log(`partnerId = ${partnerId}`);
      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocodeId);

      const { caseResults } = await regUsersAndPlayCases(1, 3, CASE_COST_EUR, 'EUR', promocode);
      await sleep(5000);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'rs_profit');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_rs_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        0, 0, 'RUB', 'EUR', partnerId);
    });
    it('C2131478 Partner RUB + player UAH', async () => {
      const { info: { user: { id: partnerId } }, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'RUB');
      // console.log(`partnerId = ${partnerId}`);
      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocodeId);

      const { caseResults } = await regUsersAndPlayCases(1, 3, CASE_COST_UAH, 'UAH', promocode);
      await sleep(5000);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'rs_profit');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_rs_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        0, 0, 'RUB', 'UAH', partnerId);
    });
    it('C2131479 Partner USD + player RUB', async () => {
      const { info: { user: { id: partnerId } }, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'USD');
      // console.log(`partnerId = ${partnerId}`);
      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocodeId);

      const { caseResults } = await regUsersAndPlayCases(1, 3, CASE_COST_RUB, 'RUB', promocode);
      await sleep(5000);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'rs_profit');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_rs_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        0, 0, 'USD', 'RUB', partnerId);
    });
    it('C2131480 Partner USD + player USD', async () => {
      const { info: { user: { id: partnerId } }, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'USD');
      // console.log(`partnerId = ${partnerId}`);
      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocodeId);

      const { caseResults } = await regUsersAndPlayCases(1, 3, CASE_COST_USD, 'USD', promocode);
      await sleep(5000);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'rs_profit');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_rs_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        0, 0, 'USD', 'USD', partnerId);
    });
    it('C2131481 Partner USD + player EUR', async () => {
      const { info: { user: { id: partnerId } }, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'USD');
      // console.log(`partnerId = ${partnerId}`);
      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocodeId);

      const { caseResults } = await regUsersAndPlayCases(1, 3, CASE_COST_EUR, 'EUR', promocode);
      await sleep(5000);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'rs_profit');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_rs_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        0, 0, 'USD', 'EUR', partnerId);
    });
    it('C2131482 Partner USD + player UAH', async () => {
      const { info: { user: { id: partnerId } }, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'USD');
      // console.log(`partnerId = ${partnerId}`);
      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocodeId);

      const { caseResults } = await regUsersAndPlayCases(1, 3, CASE_COST_UAH, 'UAH', promocode);
      await sleep(5000);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'rs_profit');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_rs_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        0, 0, 'USD', 'UAH', partnerId);
    });
    it('C2131483 Partner EUR + player RUB', async () => {
      const { info: { user: { id: partnerId } }, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'EUR');
      // console.log(`partnerId = ${partnerId}`);
      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocodeId);

      const { caseResults } = await regUsersAndPlayCases(1, 3, CASE_COST_RUB, 'RUB', promocode);
      await sleep(5000);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'rs_profit');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_rs_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        0, 0, 'EUR', 'RUB', partnerId);
    });
    it('C2131484 Partner EUR + player USD', async () => {
      const { info: { user: { id: partnerId } }, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'EUR');
      // console.log(`partnerId = ${partnerId}`);
      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocodeId);

      const { caseResults } = await regUsersAndPlayCases(1, 3, CASE_COST_USD, 'USD', promocode);
      await sleep(5000);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'rs_profit');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_rs_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        0, 0, 'EUR', 'USD', partnerId);
    });
    it('C2131485 Partner EUR + player EUR', async () => {
      const { info: { user: { id: partnerId } }, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'EUR');
      // console.log(`partnerId = ${partnerId}`);
      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocodeId);

      const { caseResults } = await regUsersAndPlayCases(1, 3, CASE_COST_EUR, 'EUR', promocode);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'rs_profit');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_rs_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        0, 0, 'EUR', 'EUR', partnerId);
    });
    it('C2131486 Partner EUR + player UAH', async () => {
      const { info: { user: { id: partnerId } }, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'EUR');
      // console.log(`partnerId = ${partnerId}`);
      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocodeId);

      const { caseResults } = await regUsersAndPlayCases(1, 3, CASE_COST_UAH, 'UAH', promocode);
      await sleep(5000);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'rs_profit');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_rs_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        0, 0, 'EUR', 'UAH', partnerId);
    });
  });

  describe('Case several times + cpa qualified', () => {
    let presetNumber;
    beforeAll(async () => {
      presetNumber = await partner.createPreset(0, 0, 0, 0, 1, 100000, 1);
    });
    it('C2131487 Partner RUB + player RUB', async () => {
      const { info: { user: { id: partnerId } }, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'RUB');
      // console.log(`partnerId = ${partnerId}`);
      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocodeId);

      const { caseResults } = await regUsersAndPlayCases(1, 3, CASE_COST_RUB, 'RUB', promocode);
      await sleep(10000);
      await partner.addCpaPaymentCk(partnerId);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        1, 1, 'RUB', 'RUB', partnerId);
    });
    it('C2131488 Partner RUB + player USD', async () => {
      const { info: { user: { id: partnerId } }, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'RUB');
      // console.log(`partnerId = ${partnerId}`);
      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocodeId);

      const { caseResults } = await regUsersAndPlayCases(1, 3, CASE_COST_USD, 'USD', promocode);
      await sleep(10000);
      await partner.addCpaPaymentCk(partnerId);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        1, 1, 'RUB', 'USD', partnerId);
    });
    it('C2131489 Partner RUB + player EUR', async () => {
      const { info: { user: { id: partnerId } }, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'RUB');
      // console.log(`partnerId = ${partnerId}`);
      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocodeId);

      const { caseResults } = await regUsersAndPlayCases(1, 3, CASE_COST_EUR, 'EUR', promocode);
      await sleep(10000);
      await partner.addCpaPaymentCk(partnerId);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        1, 1, 'RUB', 'EUR', partnerId);
    });
    it('C2131490 Partner RUB + player UAH', async () => {
      const { info: { user: { id: partnerId } }, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'RUB');
      // console.log(`partnerId = ${partnerId}`);
      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocodeId);

      const { caseResults } = await regUsersAndPlayCases(1, 3, CASE_COST_UAH, 'UAH', promocode);
      await sleep(10000);
      await partner.addCpaPaymentCk(partnerId);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        1, 1, 'RUB', 'UAH', partnerId);
    });
    it('C2131491 Partner USD + player RUB', async () => {
      const { info: { user: { id: partnerId } }, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'USD');
      // console.log(`partnerId = ${partnerId}`);
      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocodeId);

      const { caseResults } = await regUsersAndPlayCases(1, 3, CASE_COST_RUB, 'RUB', promocode);
      await sleep(10000);
      await partner.addCpaPaymentCk(partnerId);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        1, 1, 'USD', 'RUB', partnerId);
    });
    it('C2131492 Partner USD + player USD', async () => {
      const { info: { user: { id: partnerId } }, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'USD');
      // console.log(`partnerId = ${partnerId}`);
      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocodeId);

      const { caseResults } = await regUsersAndPlayCases(1, 3, CASE_COST_USD, 'USD', promocode);
      await sleep(10000);
      await partner.addCpaPaymentCk(partnerId);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        1, 1, 'USD', 'USD', partnerId);
    });
    it('C2131493 Partner USD + player EUR', async () => {
      const { info: { user: { id: partnerId } }, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'USD');
      // console.log(`partnerId = ${partnerId}`);
      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocodeId);

      const { caseResults } = await regUsersAndPlayCases(1, 3, CASE_COST_EUR, 'EUR', promocode);
      await sleep(10000);
      await partner.addCpaPaymentCk(partnerId);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        1, 1, 'USD', 'EUR', partnerId);
    });
    it('C2131494 Partner USD + player UAH', async () => {
      const { info: { user: { id: partnerId } }, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'USD');
      // console.log(`partnerId = ${partnerId}`);
      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocodeId);

      const { caseResults } = await regUsersAndPlayCases(1, 3, CASE_COST_UAH, 'UAH', promocode);
      await sleep(10000);
      await partner.addCpaPaymentCk(partnerId);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        1, 1, 'USD', 'UAH', partnerId);
    });
    it('C2131495 Partner EUR + player RUB', async () => {
      const { info: { user: { id: partnerId } }, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'EUR');
      // console.log(`partnerId = ${partnerId}`);
      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocodeId);

      const { caseResults } = await regUsersAndPlayCases(1, 3, CASE_COST_RUB, 'RUB', promocode);
      await sleep(10000);
      await partner.addCpaPaymentCk(partnerId);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        1, 1, 'EUR', 'RUB', partnerId);
    });
    it('C2131496 Partner EUR + player USD', async () => {
      const { info: { user: { id: partnerId } }, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'EUR');
      // console.log(`partnerId = ${partnerId}`);
      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocodeId);

      const { caseResults } = await regUsersAndPlayCases(1, 3, CASE_COST_USD, 'USD', promocode);
      await sleep(10000);
      await partner.addCpaPaymentCk(partnerId);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        1, 1, 'EUR', 'USD', partnerId);
    });
    it('C2131497 Partner EUR + player EUR', async () => {
      const { info: { user: { id: partnerId } }, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'EUR');
      // console.log(`partnerId = ${partnerId}`);
      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocodeId);

      const { caseResults } = await regUsersAndPlayCases(1, 3, CASE_COST_EUR, 'EUR', promocode);
      await sleep(10000);
      await partner.addCpaPaymentCk(partnerId);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        1, 1, 'EUR', 'EUR', partnerId);
    });
    it('C2131498 Partner EUR + player UAH', async () => {
      const { info: { user: { id: partnerId } }, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'EUR');
      // console.log(`partnerId = ${partnerId}`);
      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocodeId);

      const { caseResults } = await regUsersAndPlayCases(1, 3, CASE_COST_UAH, 'UAH', promocode);
      await sleep(10000);
      await partner.addCpaPaymentCk(partnerId);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        1, 1, 'EUR', 'UAH', partnerId);
    });
  });
});
