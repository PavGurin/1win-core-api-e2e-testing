/**
 * @jest-environment node
 */

import { mysqlConnection } from '../../../../src/methods/mysqlConnection';
import { sleep } from '../../../../src/methods/utils';
import { randomNum, randomStr } from '../../../../src/randomizer';
import { partner } from '../../../../src/methods/partner';
import {
  checkPartnerPaymentCasesCPA,
  checkUserMetaCpaPending,
} from '../../../../src/expects/exPartner';
import { regUsersAndPlayCases } from '../../../../src/methods/regUsersForPartner';

// описание СРА https://fbet-gitlab.ex2b.co/qa/qa-autotests/-/wikis/7.Partnerka/CPA

describe('Payments for cases to CPA partner, all currency combinations', () => {
  const defaultPass = '123123AA';
  const CASE_COST_RUB = 1000;
  const CASE_COST_USD = 10;
  const CASE_COST_EUR = 10;
  const CASE_COST_UAH = 500;
  let partnerEmail;
  let promocode;

  // используем пресет 8 с настройками
  // cpa_deposit_amount 0
  // cpa_bet_amount 0
  // cpa_bet_count 0
  // cpa_gambling_amount 1
  // cpa_total_amount 0
  // cpa_partner_profit 1.33
  // cpa_time_from_registration 2400000
  // т.е. если юзер потратит сумму >= 1 доллара в казино и/или кейсах
  // в течение 40 минут после реги, то будет выплата партнеру 1.33 доллара
  const PRESET_NUMBER = 8;
  const EXPECTED_PAYMENT_AMOUNT_USD = 1.33;

  beforeAll(async () => {
    const dbResult = await mysqlConnection.executeQuery('DELETE FROM 1win.riskmanagement_ip_log;');
    // console.log(dbResult);
    await sleep(150);
  });

  beforeEach(async () => {
    promocode = randomNum(10).toString();
    partnerEmail = `${randomStr(10)}@ahem.email`;
    // console.log(partnerEmail);
  });

  it('C1789901 (+) Partner RUB + player RUB', async () => {
    const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'RUB');
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, PRESET_NUMBER);
    // console.log(promocodeId);

    const { caseResults, userIds } = await regUsersAndPlayCases(1, 1, CASE_COST_RUB, 'RUB', promocode);
    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);

    await checkPartnerPaymentCasesCPA(statsAll, statsDay.days[0], caseResults,
      EXPECTED_PAYMENT_AMOUNT_USD, 'RUB', 'RUB');
    await checkUserMetaCpaPending(userIds[0], true);
  });

  it('C1789902 (+) Partner RUB + player USD', async () => {
    const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'RUB');
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, PRESET_NUMBER);
    // console.log(promocodeId);

    const { caseResults, userIds } = await regUsersAndPlayCases(1, 1, CASE_COST_USD, 'USD', promocode);
    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);

    await checkPartnerPaymentCasesCPA(statsAll, statsDay.days[0], caseResults,
      EXPECTED_PAYMENT_AMOUNT_USD, 'RUB', 'USD');
    await checkUserMetaCpaPending(userIds[0], true);
  });

  it('C1789903 (+) Partner RUB + player EUR', async () => {
    const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'RUB');
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, PRESET_NUMBER);
    // console.log(promocodeId);

    const { caseResults, userIds } = await regUsersAndPlayCases(1, 1, CASE_COST_EUR, 'EUR', promocode);
    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);

    await checkPartnerPaymentCasesCPA(statsAll, statsDay.days[0], caseResults,
      EXPECTED_PAYMENT_AMOUNT_USD, 'RUB', 'EUR');
    await checkUserMetaCpaPending(userIds[0], true);
  });

  it('C1789904 (+) Partner RUB + player UAH', async () => {
    const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'RUB');
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, PRESET_NUMBER);
    // console.log(promocodeId);

    const { caseResults, userIds } = await regUsersAndPlayCases(1, 1, CASE_COST_UAH, 'UAH', promocode);
    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);

    await checkPartnerPaymentCasesCPA(statsAll, statsDay.days[0], caseResults,
      EXPECTED_PAYMENT_AMOUNT_USD, 'RUB', 'UAH');
    await checkUserMetaCpaPending(userIds[0], true);
  });

  it('C1789905 (+) Partner USD + player RUB', async () => {
    const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'USD');
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, PRESET_NUMBER);
    // console.log(promocodeId);

    const { caseResults, userIds } = await regUsersAndPlayCases(1, 1, CASE_COST_RUB, 'RUB', promocode);
    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);

    await checkPartnerPaymentCasesCPA(statsAll, statsDay.days[0], caseResults,
      EXPECTED_PAYMENT_AMOUNT_USD, 'USD', 'RUB');
    await checkUserMetaCpaPending(userIds[0], true);
  });

  it('C1789906 (+) Partner USD + player USD', async () => {
    const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'USD');
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, PRESET_NUMBER);
    // console.log(promocodeId);

    const { caseResults, userIds } = await regUsersAndPlayCases(1, 1, CASE_COST_USD, 'USD', promocode);
    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);

    await checkPartnerPaymentCasesCPA(statsAll, statsDay.days[0], caseResults,
      EXPECTED_PAYMENT_AMOUNT_USD, 'USD', 'USD');
    await checkUserMetaCpaPending(userIds[0], true);
  });

  it('C1789907 (+) Partner USD + player EUR', async () => {
    const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'USD');
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, PRESET_NUMBER);
    // console.log(promocodeId);

    const { caseResults, userIds } = await regUsersAndPlayCases(1, 1, CASE_COST_EUR, 'EUR', promocode);
    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);

    await checkPartnerPaymentCasesCPA(statsAll, statsDay.days[0], caseResults,
      EXPECTED_PAYMENT_AMOUNT_USD, 'USD', 'EUR');
    await checkUserMetaCpaPending(userIds[0], true);
  });

  it('C1789908 (+) Partner USD + player UAH', async () => {
    const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'USD');
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, PRESET_NUMBER);
    // console.log(promocodeId);

    const { caseResults, userIds } = await regUsersAndPlayCases(1, 1, CASE_COST_UAH, 'UAH', promocode);
    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);

    await checkPartnerPaymentCasesCPA(statsAll, statsDay.days[0], caseResults,
      EXPECTED_PAYMENT_AMOUNT_USD, 'USD', 'UAH');
    await checkUserMetaCpaPending(userIds[0], true);
  });

  it('C1789909 (+) Partner EUR + player RUB', async () => {
    const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'EUR');
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, PRESET_NUMBER);
    // console.log(promocodeId);

    const { caseResults, userIds } = await regUsersAndPlayCases(1, 1, CASE_COST_RUB, 'RUB', promocode);
    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);

    await checkPartnerPaymentCasesCPA(statsAll, statsDay.days[0], caseResults,
      EXPECTED_PAYMENT_AMOUNT_USD, 'EUR', 'RUB');
    await checkUserMetaCpaPending(userIds[0], true);
  });

  it('C1789910 (+) Partner EUR + player USD', async () => {
    const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'EUR');
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, PRESET_NUMBER);
    // console.log(promocodeId);

    const { caseResults, userIds } = await regUsersAndPlayCases(1, 1, CASE_COST_USD, 'USD', promocode);
    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);

    await checkPartnerPaymentCasesCPA(statsAll, statsDay.days[0], caseResults,
      EXPECTED_PAYMENT_AMOUNT_USD, 'EUR', 'USD');
    await checkUserMetaCpaPending(userIds[0], true);
  });

  it('C1789911 (+) Partner EUR + player EUR', async () => {
    const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'EUR');
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, PRESET_NUMBER);
    // console.log(promocodeId);

    const { caseResults, userIds } = await regUsersAndPlayCases(1, 1, CASE_COST_EUR, 'EUR', promocode);
    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);

    await checkPartnerPaymentCasesCPA(statsAll, statsDay.days[0], caseResults,
      EXPECTED_PAYMENT_AMOUNT_USD, 'EUR', 'EUR');
    await checkUserMetaCpaPending(userIds[0], true);
  });

  it('C1789912 (+) Partner EUR + player UAH', async () => {
    const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'EUR');
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, PRESET_NUMBER);
    // console.log(promocodeId);

    const { caseResults, userIds } = await regUsersAndPlayCases(1, 1, CASE_COST_UAH, 'UAH', promocode);
    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);

    await checkPartnerPaymentCasesCPA(statsAll, statsDay.days[0], caseResults,
      EXPECTED_PAYMENT_AMOUNT_USD, 'EUR', 'UAH');
    await checkUserMetaCpaPending(userIds[0], true);
  });
});
