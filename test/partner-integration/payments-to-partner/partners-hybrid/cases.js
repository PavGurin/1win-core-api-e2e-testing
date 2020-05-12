/**
 * @jest-environment node
 */

import { randomNum, randomStr } from '../../../../src/randomizer';
import { partner } from '../../../../src/methods/partner';
import { register } from '../../../../src/methods/register';
import { banking } from '../../../../src/methods/banking';
import { addHybridCpaPayment, createPreset } from '../../../../src/methods/partnerInDB';
import { cases } from '../../../../src/methods/cases';
import { sleep } from '../../../../src/methods/utils';
import { checkPartnerPaymentCasesHybrid } from '../../../../src/expects/exPartner';
import { mysqlConnection } from '../../../../src/methods/mysqlConnection';

const defaultPass = '123123AA';
const CASE_COST_RUB = 1000;
const CASE_ID_RUB = 6;
const CASE_ID_USD = 13;
const CASE_COST_USD = 10;
const CASE_COST_EUR = 10;
const CASE_ID_EUR = 21;
const CASE_COST_UAH = 500;
const CASE_ID_UAH = 31;

describe('Cases', () => {
  beforeAll(async () => {
    const dbResult = await mysqlConnection.executeQuery('DELETE FROM 1win.riskmanagement_ip_log;');
    // console.log(dbResult);
    await sleep(150);
  });

  describe('Case one time + cpa qualified', () => {
    let presetNumber;
    beforeAll(async () => {
      presetNumber = await createPreset(0, 0, 0, 0, 1, 100000, 1);
    });
    it('C2131463 Partner RUB + player RUB', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { partnerId, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'RUB');
      // console.log(`partnerId = ${partnerId}`);

      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegRubWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_RUB);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_ID_RUB);
      // console.log(caseWin);

      await sleep(10000);
      await addHybridCpaPayment(partnerId);


      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0],
        [{ caseCost: CASE_COST_RUB, profit: caseWin.result }],
        1, 1, 'RUB', 'RUB', partnerId);
    });
    it('C2131464 Partner RUB + player USD', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { partnerId, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'RUB');
      // console.log(`partnerId = ${partnerId}`);

      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegUsdWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_USD);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_ID_USD);
      // console.log(caseWin);

      await sleep(10000);
      await addHybridCpaPayment(partnerId);


      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0],
        [{ caseCost: CASE_COST_USD, profit: caseWin.result }],
        1, 1, 'RUB', 'USD', partnerId);
    });
    it('C2131465 Partner RUB + player EUR', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { partnerId, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'RUB');
      // console.log(`partnerId = ${partnerId}`);

      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegEurWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_EUR);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_ID_EUR);
      // console.log(caseWin);

      await sleep(10000);
      await addHybridCpaPayment(partnerId);


      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0],
        [{ caseCost: CASE_COST_EUR, profit: caseWin.result }],
        1, 1, 'RUB', 'EUR', partnerId);
    });
    it('C2131466 Partner RUB + player UAH', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { partnerId, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'RUB');
      // console.log(`partnerId = ${partnerId}`);

      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegUahWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_UAH);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_ID_UAH);
      // console.log(caseWin);

      await sleep(10000);
      await addHybridCpaPayment(partnerId);


      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0],
        [{ caseCost: CASE_COST_UAH, profit: caseWin.result }],
        1, 1, 'RUB', 'UAH', partnerId);
    });
    it('C2131467 Partner USD + player RUB', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { partnerId, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'USD');
      // console.log(`partnerId = ${partnerId}`);

      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegRubWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_RUB);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_ID_RUB);
      // console.log(caseWin);

      await sleep(10000);
      await addHybridCpaPayment(partnerId);


      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0],
        [{ caseCost: CASE_COST_RUB, profit: caseWin.result }],
        1, 1, 'USD', 'RUB', partnerId);
    });
    it('C2131468 Partner USD + player USD', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { partnerId, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'USD');
      // console.log(`partnerId = ${partnerId}`);

      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegUsdWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_USD);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_ID_USD);
      // console.log(caseWin);

      await sleep(10000);
      await addHybridCpaPayment(partnerId);


      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0],
        [{ caseCost: CASE_COST_USD, profit: caseWin.result }],
        1, 1, 'USD', 'USD', partnerId);
    });
    it('C2131469 Partner USD + player EUR', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { partnerId, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'USD');
      // console.log(`partnerId = ${partnerId}`);

      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegEurWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_EUR);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_ID_EUR);
      // console.log(caseWin);

      await sleep(10000);
      await addHybridCpaPayment(partnerId);


      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0],
        [{ caseCost: CASE_COST_EUR, profit: caseWin.result }],
        1, 1, 'USD', 'EUR', partnerId);
    });
    it('C2131470 Partner USD + player UAH', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { partnerId, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'USD');
      // console.log(`partnerId = ${partnerId}`);

      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegUahWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_UAH);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_ID_UAH);
      // console.log(caseWin);

      await sleep(10000);
      await addHybridCpaPayment(partnerId);


      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0],
        [{ caseCost: CASE_COST_UAH, profit: caseWin.result }],
        1, 1, 'USD', 'UAH', partnerId);
    });
    it('C2131471 Partner EUR + player RUB', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { partnerId, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'EUR');
      // console.log(`partnerId = ${partnerId}`);

      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegRubWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_RUB);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_ID_RUB);
      // console.log(caseWin);

      await sleep(10000);
      await addHybridCpaPayment(partnerId);


      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0],
        [{ caseCost: CASE_COST_RUB, profit: caseWin.result }],
        1, 1, 'EUR', 'RUB', partnerId);
    });
    it('C2131472 Partner EUR + player USD', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { partnerId, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'EUR');
      // console.log(`partnerId = ${partnerId}`);

      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegUsdWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_USD);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_ID_USD);
      // console.log(caseWin);

      await sleep(10000);
      await addHybridCpaPayment(partnerId);


      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0],
        [{ caseCost: CASE_COST_USD, profit: caseWin.result }],
        1, 1, 'EUR', 'USD', partnerId);
    });
    it('C2131473 Partner EUR + player EUR', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { partnerId, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'EUR');
      // console.log(`partnerId = ${partnerId}`);

      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegEurWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_EUR);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_ID_EUR);
      // console.log(caseWin);

      await sleep(10000);
      await addHybridCpaPayment(partnerId);


      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0],
        [{ caseCost: CASE_COST_EUR, profit: caseWin.result }],
        1, 1, 'EUR', 'EUR', partnerId);
    });
    it('C2131474 Partner EUR + player UAH', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { partnerId, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'EUR');
      // console.log(`partnerId = ${partnerId}`);

      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegUahWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_UAH);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_ID_UAH);
      // console.log(caseWin);

      await sleep(10000);
      await addHybridCpaPayment(partnerId);


      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0],
        [{ caseCost: CASE_COST_UAH, profit: caseWin.result }],
        1, 1, 'EUR', 'UAH', partnerId);
    });
  });

  describe('Case several times + cpa not qualified', () => {
    let presetNumber;
    beforeAll(async () => {
      presetNumber = await createPreset(0, 0, 0, 0, 100, 100000, 1);
    });
    it('C2131475 Partner RUB + player RUB', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { partnerId, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'RUB');
      // console.log(`partnerId = ${partnerId}`);

      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegRubWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_RUB * 3);

      const caseResults = [];
      for (let i = 0; i < 3; i++) {
        /* eslint no-await-in-loop:off */
        const { data: caseWin } = await cases.playCaseWithoutChance(CASE_ID_RUB);
        // console.log(caseWin);
        caseResults.push({ caseCost: CASE_COST_RUB, profit: caseWin.result });
        await sleep(1000);
      }

      await sleep(5000);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'rs_profit');
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_rs_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        0, 0, 'RUB', 'RUB', partnerId);
    });
    it('C2131476 Partner RUB + player USD', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { partnerId, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'RUB');
      // console.log(`partnerId = ${partnerId}`);

      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegUsdWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_USD * 3);

      const caseResults = [];
      for (let i = 0; i < 3; i++) {
        /* eslint no-await-in-loop:off */
        const { data: caseWin } = await cases.playCaseWithoutChance(CASE_ID_USD);
        // console.log(caseWin);
        caseResults.push({ caseCost: CASE_COST_USD, profit: caseWin.result });
        await sleep(1000);
      }

      await sleep(5000);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'rs_profit');
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_rs_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        0, 0, 'RUB', 'USD', partnerId);
    });
    it('C2131477 Partner RUB + player EUR', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { partnerId, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'RUB');
      // console.log(`partnerId = ${partnerId}`);

      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegEurWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_EUR * 3);

      const caseResults = [];
      for (let i = 0; i < 3; i++) {
        /* eslint no-await-in-loop:off */
        const { data: caseWin } = await cases.playCaseWithoutChance(CASE_ID_EUR);
        // console.log(caseWin);
        caseResults.push({ caseCost: CASE_COST_EUR, profit: caseWin.result });
        await sleep(1000);
      }

      await sleep(5000);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'rs_profit');
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_rs_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        0, 0, 'RUB', 'EUR', partnerId);
    });
    it('C2131478 Partner RUB + player UAH', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { partnerId, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'RUB');
      // console.log(`partnerId = ${partnerId}`);

      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegUahWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_UAH * 3);

      const caseResults = [];
      for (let i = 0; i < 3; i++) {
        /* eslint no-await-in-loop:off */
        const { data: caseWin } = await cases.playCaseWithoutChance(CASE_ID_UAH);
        // console.log(caseWin);
        caseResults.push({ caseCost: CASE_COST_UAH, profit: caseWin.result });
        await sleep(1000);
      }

      await sleep(5000);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'rs_profit');
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_rs_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        0, 0, 'RUB', 'UAH', partnerId);
    });
    it('C2131479 Partner USD + player RUB', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { partnerId, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'USD');
      // console.log(`partnerId = ${partnerId}`);

      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegRubWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_RUB * 3);

      const caseResults = [];
      for (let i = 0; i < 3; i++) {
        /* eslint no-await-in-loop:off */
        const { data: caseWin } = await cases.playCaseWithoutChance(CASE_ID_RUB);
        // console.log(caseWin);
        caseResults.push({ caseCost: CASE_COST_RUB, profit: caseWin.result });
        await sleep(1000);
      }

      await sleep(5000);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'rs_profit');
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_rs_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        0, 0, 'USD', 'RUB', partnerId);
    });
    it('C2131480 Partner USD + player USD', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { partnerId, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'USD');
      // console.log(`partnerId = ${partnerId}`);

      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegUsdWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_USD * 3);

      const caseResults = [];
      for (let i = 0; i < 3; i++) {
        /* eslint no-await-in-loop:off */
        const { data: caseWin } = await cases.playCaseWithoutChance(CASE_ID_USD);
        // console.log(caseWin);
        caseResults.push({ caseCost: CASE_COST_USD, profit: caseWin.result });
        await sleep(1000);
      }

      await sleep(5000);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'rs_profit');
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_rs_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        0, 0, 'USD', 'USD', partnerId);
    });
    it('C2131481 Partner USD + player EUR', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { partnerId, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'USD');
      // console.log(`partnerId = ${partnerId}`);

      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegEurWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_EUR * 3);

      const caseResults = [];
      for (let i = 0; i < 3; i++) {
        /* eslint no-await-in-loop:off */
        const { data: caseWin } = await cases.playCaseWithoutChance(CASE_ID_EUR);
        // console.log(caseWin);
        caseResults.push({ caseCost: CASE_COST_EUR, profit: caseWin.result });
        await sleep(1000);
      }

      await sleep(5000);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'rs_profit');
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_rs_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        0, 0, 'USD', 'EUR', partnerId);
    });
    it('C2131482 Partner USD + player UAH', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { partnerId, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'USD');
      // console.log(`partnerId = ${partnerId}`);

      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegUahWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_UAH * 3);

      const caseResults = [];
      for (let i = 0; i < 3; i++) {
        /* eslint no-await-in-loop:off */
        const { data: caseWin } = await cases.playCaseWithoutChance(CASE_ID_UAH);
        // console.log(caseWin);
        caseResults.push({ caseCost: CASE_COST_UAH, profit: caseWin.result });
        await sleep(1000);
      }

      await sleep(5000);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'rs_profit');
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_rs_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        0, 0, 'USD', 'UAH', partnerId);
    });
    it('C2131483 Partner EUR + player RUB', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { partnerId, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'EUR');
      // console.log(`partnerId = ${partnerId}`);

      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegRubWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_RUB * 3);

      const caseResults = [];
      for (let i = 0; i < 3; i++) {
        /* eslint no-await-in-loop:off */
        const { data: caseWin } = await cases.playCaseWithoutChance(CASE_ID_RUB);
        // console.log(caseWin);
        caseResults.push({ caseCost: CASE_COST_RUB, profit: caseWin.result });
        await sleep(1000);
      }

      await sleep(5000);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'rs_profit');
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_rs_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        0, 0, 'EUR', 'RUB', partnerId);
    });
    it('C2131484 Partner EUR + player USD', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { partnerId, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'EUR');
      // console.log(`partnerId = ${partnerId}`);

      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegUsdWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_USD * 3);

      const caseResults = [];
      for (let i = 0; i < 3; i++) {
        /* eslint no-await-in-loop:off */
        const { data: caseWin } = await cases.playCaseWithoutChance(CASE_ID_USD);
        // console.log(caseWin);
        caseResults.push({ caseCost: CASE_COST_USD, profit: caseWin.result });
        await sleep(1000);
      }

      await sleep(5000);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'rs_profit');
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_rs_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        0, 0, 'EUR', 'USD', partnerId);
    });
    it('C2131485 Partner EUR + player EUR', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { partnerId, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'EUR');
      // console.log(`partnerId = ${partnerId}`);

      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegEurWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_EUR * 3);

      const caseResults = [];
      for (let i = 0; i < 3; i++) {
        /* eslint no-await-in-loop:off */
        const { data: caseWin } = await cases.playCaseWithoutChance(CASE_ID_EUR);
        // console.log(caseWin);
        caseResults.push({ caseCost: CASE_COST_EUR, profit: caseWin.result });
        await sleep(1000);
      }

      await sleep(5000);
      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'rs_profit');
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_rs_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        0, 0, 'EUR', 'EUR', partnerId);
    });
    it('C2131486 Partner EUR + player UAH', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { partnerId, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'EUR');
      // console.log(`partnerId = ${partnerId}`);

      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegUahWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_UAH * 3);

      const caseResults = [];
      for (let i = 0; i < 3; i++) {
        /* eslint no-await-in-loop:off */
        const { data: caseWin } = await cases.playCaseWithoutChance(CASE_ID_UAH);
        // console.log(caseWin);
        caseResults.push({ caseCost: CASE_COST_UAH, profit: caseWin.result });
        await sleep(1000);
      }

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
      presetNumber = await createPreset(0, 0, 0, 0, 1, 100000, 1);
    });
    it('C2131487 Partner RUB + player RUB', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { partnerId, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'RUB');
      // console.log(`partnerId = ${partnerId}`);

      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegRubWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_RUB * 3);

      const caseResults = [];
      for (let i = 0; i < 3; i++) {
        /* eslint no-await-in-loop:off */
        const { data: caseWin } = await cases.playCaseWithoutChance(CASE_ID_RUB);
        // console.log(caseWin);
        caseResults.push({ caseCost: CASE_COST_RUB, profit: caseWin.result });
        await sleep(1000);
      }

      await sleep(10000);
      await addHybridCpaPayment(partnerId);


      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        1, 1, 'RUB', 'RUB', partnerId);
    });
    it('C2131488 Partner RUB + player USD', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { partnerId, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'RUB');
      // console.log(`partnerId = ${partnerId}`);

      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegUsdWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_USD * 3);

      const caseResults = [];
      for (let i = 0; i < 3; i++) {
        /* eslint no-await-in-loop:off */
        const { data: caseWin } = await cases.playCaseWithoutChance(CASE_ID_USD);
        // console.log(caseWin);
        caseResults.push({ caseCost: CASE_COST_USD, profit: caseWin.result });
        await sleep(1000);
      }

      await sleep(10000);
      await addHybridCpaPayment(partnerId);


      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        1, 1, 'RUB', 'USD', partnerId);
    });
    it('C2131489 Partner RUB + player EUR', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { partnerId, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'RUB');
      // console.log(`partnerId = ${partnerId}`);

      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegEurWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_EUR * 3);

      const caseResults = [];
      for (let i = 0; i < 3; i++) {
        /* eslint no-await-in-loop:off */
        const { data: caseWin } = await cases.playCaseWithoutChance(CASE_ID_EUR);
        // console.log(caseWin);
        caseResults.push({ caseCost: CASE_COST_EUR, profit: caseWin.result });
        await sleep(1000);
      }

      await sleep(10000);
      await addHybridCpaPayment(partnerId);


      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        1, 1, 'RUB', 'EUR', partnerId);
    });
    it('C2131490 Partner RUB + player UAH', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { partnerId, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'RUB');
      // console.log(`partnerId = ${partnerId}`);

      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegUahWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_UAH * 3);

      const caseResults = [];
      for (let i = 0; i < 3; i++) {
        /* eslint no-await-in-loop:off */
        const { data: caseWin } = await cases.playCaseWithoutChance(CASE_ID_UAH);
        // console.log(caseWin);
        caseResults.push({ caseCost: CASE_COST_UAH, profit: caseWin.result });
        await sleep(1000);
      }

      await sleep(10000);
      await addHybridCpaPayment(partnerId);


      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        1, 1, 'RUB', 'UAH', partnerId);
    });
    it('C2131491 Partner USD + player RUB', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { partnerId, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'USD');
      // console.log(`partnerId = ${partnerId}`);

      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegRubWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_RUB * 3);

      const caseResults = [];
      for (let i = 0; i < 3; i++) {
        /* eslint no-await-in-loop:off */
        const { data: caseWin } = await cases.playCaseWithoutChance(CASE_ID_RUB);
        // console.log(caseWin);
        caseResults.push({ caseCost: CASE_COST_RUB, profit: caseWin.result });
        await sleep(1000);
      }

      await sleep(10000);
      await addHybridCpaPayment(partnerId);


      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        1, 1, 'USD', 'RUB', partnerId);
    });
    it('C2131492 Partner USD + player USD', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { partnerId, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'USD');
      // console.log(`partnerId = ${partnerId}`);

      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegUsdWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_USD * 3);

      const caseResults = [];
      for (let i = 0; i < 3; i++) {
        /* eslint no-await-in-loop:off */
        const { data: caseWin } = await cases.playCaseWithoutChance(CASE_ID_USD);
        // console.log(caseWin);
        caseResults.push({ caseCost: CASE_COST_USD, profit: caseWin.result });
        await sleep(1000);
      }

      await sleep(10000);
      await addHybridCpaPayment(partnerId);


      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        1, 1, 'USD', 'USD', partnerId);
    });
    it('C2131493 Partner USD + player EUR', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { partnerId, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'USD');
      // console.log(`partnerId = ${partnerId}`);

      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegEurWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_EUR * 3);

      const caseResults = [];
      for (let i = 0; i < 3; i++) {
        /* eslint no-await-in-loop:off */
        const { data: caseWin } = await cases.playCaseWithoutChance(CASE_ID_EUR);
        // console.log(caseWin);
        caseResults.push({ caseCost: CASE_COST_EUR, profit: caseWin.result });
        await sleep(1000);
      }

      await sleep(10000);
      await addHybridCpaPayment(partnerId);


      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        1, 1, 'USD', 'EUR', partnerId);
    });
    it('C2131494 Partner USD + player UAH', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { partnerId, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'USD');
      // console.log(`partnerId = ${partnerId}`);

      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegUahWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_UAH * 3);

      const caseResults = [];
      for (let i = 0; i < 3; i++) {
        /* eslint no-await-in-loop:off */
        const { data: caseWin } = await cases.playCaseWithoutChance(CASE_ID_UAH);
        // console.log(caseWin);
        caseResults.push({ caseCost: CASE_COST_UAH, profit: caseWin.result });
        await sleep(1000);
      }

      await sleep(10000);
      await addHybridCpaPayment(partnerId);


      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        1, 1, 'USD', 'UAH', partnerId);
    });
    it('C2131495 Partner EUR + player RUB', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { partnerId, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'EUR');
      // console.log(`partnerId = ${partnerId}`);

      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegRubWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_RUB * 3);

      const caseResults = [];
      for (let i = 0; i < 3; i++) {
        /* eslint no-await-in-loop:off */
        const { data: caseWin } = await cases.playCaseWithoutChance(CASE_ID_RUB);
        // console.log(caseWin);
        caseResults.push({ caseCost: CASE_COST_RUB, profit: caseWin.result });
        await sleep(1000);
      }

      await sleep(10000);
      await addHybridCpaPayment(partnerId);


      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        1, 1, 'EUR', 'RUB', partnerId);
    });
    it('C2131496 Partner EUR + player USD', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { partnerId, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'EUR');
      // console.log(`partnerId = ${partnerId}`);

      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegUsdWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_USD * 3);

      const caseResults = [];
      for (let i = 0; i < 3; i++) {
        /* eslint no-await-in-loop:off */
        const { data: caseWin } = await cases.playCaseWithoutChance(CASE_ID_USD);
        // console.log(caseWin);
        caseResults.push({ caseCost: CASE_COST_USD, profit: caseWin.result });
        await sleep(1000);
      }

      await sleep(10000);
      await addHybridCpaPayment(partnerId);


      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        1, 1, 'EUR', 'USD', partnerId);
    });
    it('C2131497 Partner EUR + player EUR', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { partnerId, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'EUR');
      // console.log(`partnerId = ${partnerId}`);

      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegEurWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_EUR * 3);

      const caseResults = [];
      for (let i = 0; i < 3; i++) {
        /* eslint no-await-in-loop:off */
        const { data: caseWin } = await cases.playCaseWithoutChance(CASE_ID_EUR);
        // console.log(caseWin);
        caseResults.push({ caseCost: CASE_COST_EUR, profit: caseWin.result });
        await sleep(1000);
      }

      await sleep(10000);
      await addHybridCpaPayment(partnerId);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        1, 1, 'EUR', 'EUR', partnerId);
    });
    it('C2131498 Partner EUR + player UAH', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { partnerId, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'EUR');
      // console.log(`partnerId = ${partnerId}`);

      const { data: { id: promocodeId } } = await partner
        .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
      // console.log(promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegUahWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_UAH * 3);

      const caseResults = [];
      for (let i = 0; i < 3; i++) {
        /* eslint no-await-in-loop:off */
        const { data: caseWin } = await cases.playCaseWithoutChance(CASE_ID_UAH);
        // console.log(caseWin);
        caseResults.push({ caseCost: CASE_COST_UAH, profit: caseWin.result });
        await sleep(1000);
      }

      await sleep(10000);
      await addHybridCpaPayment(partnerId);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'cpa_profit');
      // console.log(statsAll);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_cpa_profit');
      // console.log(statsDay.days[0]);

      await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseResults,
        1, 1, 'EUR', 'UAH', partnerId);
    });
  });
});
