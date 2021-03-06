/**
 * @jest-environment node
 */

import { randomNum, randomStr } from '../../../../src/randomizer';
import { partner } from '../../../../src/methods/partner';
import { register } from '../../../../src/methods/register';
import { banking } from '../../../../src/methods/banking';
import { cases } from '../../../../src/methods/cases';
import { sleep } from '../../../../src/methods/utils';
import {
  checkUserMetaCpaPending, checkPartnerPaymentCasesCPA, checkPartnerPaymentBetsCPA,
} from '../../../../src/expects/exPartner';
import { mysqlConnection } from '../../../../src/methods/mysqlConnection';
import { betsCustom } from '../../../../src/methods/betsCustom';
import { regUsersAndPlayCases } from '../../../../src/methods/regUsersForPartner';
import { caseIdByCost } from '../../../../src/caseCostIdMap';

// описание СРА https://fbet-gitlab.ex2b.co/qa/qa-autotests/-/wikis/7.Partnerka/CPA

describe('Cpa preset conditions', () => {
  const defaultPass = '123123AA';
  const CASE_COST_USD = 10;
  const CASE_ID = caseIdByCost('USD', CASE_COST_USD);
  const EXPECTED_PAYMENT_AMOUNT_USD = 5;
  const TIME_REGISTRATION = 10000;
  const BET_AMOUNT = 10;
  let promocode;
  let partnerEmail;

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

  it('C1789913 (+) cpa_gambling_amount - one case, spent preset value', async () => {
    const presetNumber = await partner.createPreset(0, 0, 0,
      CASE_COST_USD, 0, 600000, EXPECTED_PAYMENT_AMOUNT_USD);
    const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'USD');
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
    // console.log(promocodeId);

    const { caseResults, userIds } = await regUsersAndPlayCases(1, 1, CASE_COST_USD, 'USD', promocode);
    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);

    await checkPartnerPaymentCasesCPA(statsAll, statsDay.days[0], caseResults, EXPECTED_PAYMENT_AMOUNT_USD, 'USD', 'USD');
    await checkUserMetaCpaPending(userIds[0], true);
  });

  it('C1789914 (-) cpa_gambling_amount - one case, spent less than preset value', async () => {
    const presetNumber = await partner.createPreset(0, 0, 0,
      CASE_COST_USD + 0.01, 0, 600000, EXPECTED_PAYMENT_AMOUNT_USD);
    const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'USD');
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
    // console.log(promocodeId);

    const { caseResults, userIds } = await regUsersAndPlayCases(1, 1, CASE_COST_USD, 'USD', promocode);
    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);

    await checkPartnerPaymentCasesCPA(statsAll, statsDay.days[0], caseResults, 0, 'USD', 'USD');
    await checkUserMetaCpaPending(userIds[0], false);
  });

  it('C1789915 (+) cpa_gambling_amount - several cases, spent preset value', async () => {
    const presetNumber = await partner.createPreset(0, 0, 0,
      CASE_COST_USD + 0.01, 0, 600000, EXPECTED_PAYMENT_AMOUNT_USD);
    const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'USD');
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
    // console.log(promocodeId);

    const { data: user } = await register.oneClickRegWithPromocode(promocode, 'USD');
    // console.log(user);
    await banking.setBalance(user.id, CASE_COST_USD * 2);
    const { data: caseWin } = await cases.playCaseWithoutChance(CASE_ID);
    // console.log(caseWin);
    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentCasesCPA(statsAll, statsDay.days[0],
      [{ caseCost: CASE_COST_USD, profit: caseWin.result }], 0, 'USD', 'USD');
    await checkUserMetaCpaPending(user.id, false);

    const { data: caseWin2 } = await cases.playCaseWithoutChance(CASE_ID);
    // console.log(caseWin2);
    await sleep(5000);
    const { data: statsAll2 } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll2);
    const { data: statsDay2 } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay2);
    await checkPartnerPaymentCasesCPA(statsAll2, statsDay2.days[0],
      [{ caseCost: CASE_COST_USD, profit: caseWin.result }, { caseCost: CASE_COST_USD, profit: caseWin2.result }], EXPECTED_PAYMENT_AMOUNT_USD, 'USD', 'USD');
    await checkUserMetaCpaPending(user.id, true);
  });

  it('C1789916 (-) cpa_gambling_amount - several cases, spent less than preset value', async () => {
    const presetNumber = await partner.createPreset(0, 0, 0,
      CASE_COST_USD * 2 + 0.01, 0, 600000, EXPECTED_PAYMENT_AMOUNT_USD);
    const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'USD');
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
    // console.log(promocodeId);

    const { data: user } = await register.oneClickRegWithPromocode(promocode, 'USD');
    // console.log(user);
    await banking.setBalance(user.id, CASE_COST_USD * 2);
    const { data: caseWin } = await cases.playCaseWithoutChance(CASE_ID);
    // console.log(caseWin);
    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentCasesCPA(statsAll, statsDay.days[0],
      [{ caseCost: CASE_COST_USD, profit: caseWin.result }], 0, 'USD', 'USD');
    const { data: caseWin2 } = await cases.playCaseWithoutChance(CASE_ID);
    // console.log(caseWin2);

    await sleep(5000);
    const { data: statsAll2 } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll2);
    const { data: statsDay2 } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay2);
    await checkPartnerPaymentCasesCPA(statsAll2, statsDay2.days[0],
      [{ caseCost: CASE_COST_USD, profit: caseWin.result }, { caseCost: CASE_COST_USD, profit: caseWin2.result }], 0, 'USD', 'USD');
    await checkUserMetaCpaPending(user.id, false);
  });

  it('C1789917 (+) cpa_total_amount - one case, spent preset value', async () => {
    const presetNumber = await partner.createPreset(0, 0, 0,
      0, CASE_COST_USD, 600000, EXPECTED_PAYMENT_AMOUNT_USD);
    const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'USD');
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
    // console.log(promocodeId);

    const { caseResults, userIds } = await regUsersAndPlayCases(1, 1, CASE_COST_USD, 'USD', promocode);
    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);

    await checkPartnerPaymentCasesCPA(statsAll, statsDay.days[0], caseResults, EXPECTED_PAYMENT_AMOUNT_USD, 'USD', 'USD');
    await checkUserMetaCpaPending(userIds[0], true);
  });

  it('C1789918 (-) cpa_total_amount - one case, spent less than preset value', async () => {
    const presetNumber = await partner.createPreset(0, 0, 0,
      0, CASE_COST_USD + 0.01, 600000, EXPECTED_PAYMENT_AMOUNT_USD);
    const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'USD');
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
    // console.log(promocodeId);

    const { caseResults, userIds } = await regUsersAndPlayCases(1, 1, CASE_COST_USD, 'USD', promocode);
    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);

    await checkPartnerPaymentCasesCPA(statsAll, statsDay.days[0], caseResults, 0, 'USD', 'USD');
    await checkUserMetaCpaPending(userIds[0], false);
  });

  it('C1789919 (+) cpa_total_amount - several cases, spent preset value', async () => {
    const presetNumber = await partner.createPreset(0, 0, 0,
      0, CASE_COST_USD + 0.01, 600000, EXPECTED_PAYMENT_AMOUNT_USD);
    const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'USD');
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
    // console.log(promocodeId);

    const { data: user } = await register.oneClickRegWithPromocode(promocode, 'USD');
    // console.log(user);
    await banking.setBalance(user.id, CASE_COST_USD * 2);
    const { data: caseWin } = await cases.playCaseWithoutChance(CASE_ID);
    // console.log(caseWin);
    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentCasesCPA(statsAll, statsDay.days[0],
      [{ caseCost: CASE_COST_USD, profit: caseWin.result }], 0, 'USD', 'USD');
    await checkUserMetaCpaPending(user.id, false);

    const { data: caseWin2 } = await cases.playCaseWithoutChance(CASE_ID);
    // console.log(caseWin2);
    await sleep(5000);
    const { data: statsAll2 } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll2);
    const { data: statsDay2 } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay2);
    await checkPartnerPaymentCasesCPA(statsAll2, statsDay2.days[0],
      [{ caseCost: CASE_COST_USD, profit: caseWin.result }, { caseCost: CASE_COST_USD, profit: caseWin2.result }], EXPECTED_PAYMENT_AMOUNT_USD, 'USD', 'USD');
    await checkUserMetaCpaPending(user.id, true);
  });

  it('C1789920 (-) cpa_total_amount - several cases, spent less than preset value', async () => {
    const presetNumber = await partner.createPreset(0, 0, 0,
      CASE_COST_USD * 2 + 0.01, 0, 600000, EXPECTED_PAYMENT_AMOUNT_USD);
    const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'USD');
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
    // console.log(promocodeId);

    const { data: user } = await register.oneClickRegWithPromocode(promocode, 'USD');
    // console.log(user);
    await banking.setBalance(user.id, CASE_COST_USD * 2);
    const { data: caseWin } = await cases.playCaseWithoutChance(CASE_ID);
    // console.log(caseWin);
    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentCasesCPA(statsAll, statsDay.days[0],
      [{ caseCost: CASE_COST_USD, profit: caseWin.result }], 0, 'USD', 'USD');

    const { data: caseWin2 } = await cases.playCaseWithoutChance(CASE_ID);
    // console.log(caseWin2);
    await sleep(5000);
    const { data: statsAll2 } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll2);
    const { data: statsDay2 } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay2);
    await checkPartnerPaymentCasesCPA(statsAll2, statsDay2.days[0],
      [{ caseCost: CASE_COST_USD, profit: caseWin.result }, { caseCost: CASE_COST_USD, profit: caseWin2.result }], 0, 'USD', 'USD');
    await checkUserMetaCpaPending(user.id, false);
  });

  it('C1789921 (+) cpa_time_registration, fulfill conditions before preset time', async () => {
    const presetNumber = await partner.createPreset(0, 0, 0,
      CASE_COST_USD, 0, TIME_REGISTRATION, EXPECTED_PAYMENT_AMOUNT_USD);
    const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'USD');
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
    // console.log(promocodeId);

    const { caseResults, userIds } = await regUsersAndPlayCases(1, 1, CASE_COST_USD, 'USD', promocode);
    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);

    await checkPartnerPaymentCasesCPA(statsAll, statsDay.days[0], caseResults, EXPECTED_PAYMENT_AMOUNT_USD, 'USD', 'USD');
    await checkUserMetaCpaPending(userIds[0], true);
  });

  it('C1789922 (-) cpa_time_registration, fulfill conditions after preset time', async () => {
    const presetNumber = await partner.createPreset(0, 0, 0,
      CASE_COST_USD + 0.01, 0, TIME_REGISTRATION, EXPECTED_PAYMENT_AMOUNT_USD);
    const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'USD');
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
    // console.log(promocodeId);

    const { caseResults, userIds } = await regUsersAndPlayCases(1, 1, CASE_COST_USD, 'USD', promocode);
    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);

    await checkPartnerPaymentCasesCPA(statsAll, statsDay.days[0], caseResults, 0, 'USD', 'USD');
    await checkUserMetaCpaPending(userIds[0], false);
  });

  // TODO переписать с учетом betsCustomFixtures и новой successfulOrdinaryBet
  it.skip('(+) cpa_bet_count = 1, custom bet', async () => {
    const coeff = 10;

    const presetNumber = await partner.createPreset(0, 1, 0,
      0, 0, 600000, EXPECTED_PAYMENT_AMOUNT_USD);
    const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'USD');
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
    // console.log(promocodeId);

    const { data: user } = await register.oneClickRegWithPromocode(promocode, 'USD');
    // console.log(user);
    await banking.setBalance(user.id, BET_AMOUNT);
    await betsCustom.successfulOrdinaryBet(BET_AMOUNT, coeff);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBetsCPA(statsAll, statsDay.days[0], [BET_AMOUNT * coeff - BET_AMOUNT], EXPECTED_PAYMENT_AMOUNT_USD, 'USD', 'USD');
  });
  // TODO переписать с учетом betsCustomFixtures и новой successfulOrdinaryBet
  it.skip('(-) cpa_bet_count = 2, one custom bet', async () => {
    const coeff = 10;

    const presetNumber = await partner.createPreset(0, 2, 0,
      0, 0, 600000, EXPECTED_PAYMENT_AMOUNT_USD);
    const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'USD');
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
    // console.log(promocodeId);

    const { data: user } = await register.oneClickRegWithPromocode(promocode, 'USD');
    // console.log(user);
    await banking.setBalance(user.id, BET_AMOUNT);
    await betsCustom.successfulOrdinaryBet(BET_AMOUNT, coeff);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBetsCPA(statsAll, statsDay.days[0], [BET_AMOUNT * coeff - BET_AMOUNT], 0, 'USD', 'USD');
  });
  // TODO переписать с учетом betsCustomFixtures и новой successfulOrdinaryBet
  it.skip('(+) cpa_bet_amount <= bet amount, custom bet', async () => {
    const coeff = 10;

    const presetNumber = await partner.createPreset(0, 1, BET_AMOUNT,
      0, 0, 600000, EXPECTED_PAYMENT_AMOUNT_USD);
    const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'USD');
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
    // console.log(promocodeId);

    const { data: user } = await register.oneClickRegWithPromocode(promocode, 'USD');
    // console.log(user);
    await banking.setBalance(user.id, BET_AMOUNT);
    await betsCustom.successfulOrdinaryBet(BET_AMOUNT, coeff);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBetsCPA(statsAll, statsDay.days[0], [BET_AMOUNT * coeff - BET_AMOUNT], EXPECTED_PAYMENT_AMOUNT_USD, 'USD', 'USD');
  });
  // TODO переписать с учетом betsCustomFixtures и новой successfulOrdinaryBet
  it.skip('(-) cpa_bet_amount > bet amount, custom bet', async () => {
    const coeff = 10;

    const presetNumber = await partner.createPreset(0, 1, BET_AMOUNT + 0.01,
      0, 0, 600000, EXPECTED_PAYMENT_AMOUNT_USD);
    const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'USD');
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
    // console.log(promocodeId);

    const { data: user } = await register.oneClickRegWithPromocode(promocode, 'USD');
    // console.log(user);
    await banking.setBalance(user.id, BET_AMOUNT);
    await betsCustom.successfulOrdinaryBet(BET_AMOUNT, coeff);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBetsCPA(statsAll, statsDay.days[0], [BET_AMOUNT * coeff - BET_AMOUNT], 0, 'USD', 'USD');
  });
});
