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
  checkUserMetaCpaPending, checkPartnerPaymentCasesCPA,
} from '../../../../src/expects/exPartner';
import { createPreset, getLastPresetNumber } from '../../../../src/methods/partnerInDB';
import { mysqlConnection } from '../../../../src/methods/mysqlConnection';

// описание СРА https://fbet-gitlab.ex2b.co/qa/qa-autotests/-/wikis/7.Partnerka/CPA

describe('Cpa preset conditions', () => {
  const defaultPass = '123123AA';
  const TEN_USD_CASE_ID = 13;
  const CASE_COST_USD = 10;
  const EXPECTED_PAYMENT_AMOUNT_USD = 5;
  const TIME_REGISTRATION = 10000;

  beforeAll(async () => {
    const dbResult = await mysqlConnection.executeQuery('DELETE FROM 1win.riskmanagement_ip_log;');
    // console.log(dbResult);
    await sleep(150);
  });

  it('C1789913 (+) cpa_gambling_amount - one case, spent preset value', async () => {
    let presetNumber = await getLastPresetNumber();
    presetNumber++;

    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    // console.log(partnerEmail);

    await createPreset(presetNumber, 0, 0, 0,
      CASE_COST_USD, 0, 600000, EXPECTED_PAYMENT_AMOUNT_USD);
    await partner.registerWithCPA(partnerEmail, defaultPass, 'USD');
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
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

    await checkPartnerPaymentCasesCPA(statsAll, statsDay.days[0],
      [{ caseCost: CASE_COST_USD, profit: caseWin.result }], EXPECTED_PAYMENT_AMOUNT_USD, 'USD', 'USD');

    await checkUserMetaCpaPending(user.id, true);
  });

  it('C1789914 (-) cpa_gambling_amount - one case, spent less than preset value', async () => {
    let presetNumber = await getLastPresetNumber();
    presetNumber++;

    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    // console.log(partnerEmail);

    await createPreset(presetNumber, 0, 0, 0,
      CASE_COST_USD + 0.01, 0, 600000, EXPECTED_PAYMENT_AMOUNT_USD);
    await partner.registerWithCPA(partnerEmail, defaultPass, 'USD');
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
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

    await checkPartnerPaymentCasesCPA(statsAll, statsDay.days[0],
      [{ caseCost: CASE_COST_USD, profit: caseWin.result }], 0, 'USD', 'USD');

    await checkUserMetaCpaPending(user.id, false);
  });

  it('C1789915 (+) cpa_gambling_amount - several cases, spent preset value', async () => {
    let presetNumber = await getLastPresetNumber();
    presetNumber++;

    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    // console.log(partnerEmail);

    await createPreset(presetNumber, 0, 0, 0,
      CASE_COST_USD + 0.01, 0, 600000, EXPECTED_PAYMENT_AMOUNT_USD);
    await partner.registerWithCPA(partnerEmail, defaultPass, 'USD');
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
    // console.log(promocodeId);

    const { data: user } = await register.oneClickRegUsdWithPromocode(promocode);
    // console.log(user);
    await banking.setBalance(user.id, CASE_COST_USD * 3);
    const { data: caseWin } = await cases.playCaseWithoutChance(TEN_USD_CASE_ID);
    // console.log(caseWin);

    await sleep(1000);
    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId);
    // console.log(statsAll);

    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId);
    // console.log(statsDay);

    await checkPartnerPaymentCasesCPA(statsAll, statsDay.days[0],
      [{ caseCost: CASE_COST_USD, profit: caseWin.result }], 0, 'USD', 'USD');

    await checkUserMetaCpaPending(user.id, false);

    const { data: caseWin2 } = await cases.playCaseWithoutChance(TEN_USD_CASE_ID);
    // console.log(caseWin2);

    await sleep(1000);
    const { data: statsAll2 } = await partner.getStatsAll(cookie, promocodeId);
    // console.log(statsAll2);

    const { data: statsDay2 } = await partner.getStatsDay(cookie, new Date(), promocodeId);
    // console.log(statsDay2);

    await checkPartnerPaymentCasesCPA(statsAll2, statsDay2.days[0],
      [{ caseCost: CASE_COST_USD, profit: caseWin.result }, { caseCost: CASE_COST_USD, profit: caseWin2.result }], EXPECTED_PAYMENT_AMOUNT_USD, 'USD', 'USD');

    await checkUserMetaCpaPending(user.id, true);
  });

  it('C1789916 (-) cpa_gambling_amount - several cases, spent less than preset value', async () => {
    let presetNumber = await getLastPresetNumber();
    presetNumber++;

    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    // console.log(partnerEmail);

    await createPreset(presetNumber, 0, 0, 0,
      CASE_COST_USD * 2 + 0.01, 0, 600000, EXPECTED_PAYMENT_AMOUNT_USD);
    await partner.registerWithCPA(partnerEmail, defaultPass, 'USD');
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
    // console.log(promocodeId);

    const { data: user } = await register.oneClickRegUsdWithPromocode(promocode);
    // console.log(user);
    await banking.setBalance(user.id, CASE_COST_USD * 2);
    const { data: caseWin } = await cases.playCaseWithoutChance(TEN_USD_CASE_ID);
    // console.log(caseWin);

    await sleep(1000);
    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId);
    // console.log(statsAll);

    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId);
    // console.log(statsDay);

    await checkPartnerPaymentCasesCPA(statsAll, statsDay.days[0],
      [{ caseCost: CASE_COST_USD, profit: caseWin.result }], 0, 'USD', 'USD');

    const { data: caseWin2 } = await cases.playCaseWithoutChance(TEN_USD_CASE_ID);
    // console.log(caseWin2);

    await sleep(1000);
    const { data: statsAll2 } = await partner.getStatsAll(cookie, promocodeId);
    // console.log(statsAll2);

    const { data: statsDay2 } = await partner.getStatsDay(cookie, new Date(), promocodeId);
    // console.log(statsDay2);

    await checkPartnerPaymentCasesCPA(statsAll2, statsDay2.days[0],
      [{ caseCost: CASE_COST_USD, profit: caseWin.result }, { caseCost: CASE_COST_USD, profit: caseWin2.result }], 0, 'USD', 'USD');

    await checkUserMetaCpaPending(user.id, false);
  });

  it('C1789917 (+) cpa_total_amount - one case, spent preset value', async () => {
    let presetNumber = await getLastPresetNumber();
    presetNumber++;

    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    // console.log(partnerEmail);

    await createPreset(presetNumber, 0, 0, 0,
      0, CASE_COST_USD, 600000, EXPECTED_PAYMENT_AMOUNT_USD);
    await partner.registerWithCPA(partnerEmail, defaultPass, 'USD');
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
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

    await checkPartnerPaymentCasesCPA(statsAll, statsDay.days[0],
      [{ caseCost: CASE_COST_USD, profit: caseWin.result }], EXPECTED_PAYMENT_AMOUNT_USD, 'USD', 'USD');

    await checkUserMetaCpaPending(user.id, true);
  });

  it('C1789918 (-) cpa_total_amount - one case, spent less than preset value', async () => {
    let presetNumber = await getLastPresetNumber();
    presetNumber++;

    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    // console.log(partnerEmail);

    await createPreset(presetNumber, 0, 0, 0,
      0, CASE_COST_USD + 0.01, 600000, EXPECTED_PAYMENT_AMOUNT_USD);
    await partner.registerWithCPA(partnerEmail, defaultPass, 'USD');
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
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

    await checkPartnerPaymentCasesCPA(statsAll, statsDay.days[0],
      [{ caseCost: CASE_COST_USD, profit: caseWin.result }], 0, 'USD', 'USD');

    await checkUserMetaCpaPending(user.id, false);
  });

  it('C1789919 (+) cpa_total_amount - several cases, spent preset value', async () => {
    let presetNumber = await getLastPresetNumber();
    presetNumber++;

    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    // console.log(partnerEmail);

    await createPreset(presetNumber, 0, 0, 0,
      0, CASE_COST_USD + 0.01, 600000, EXPECTED_PAYMENT_AMOUNT_USD);
    await partner.registerWithCPA(partnerEmail, defaultPass, 'USD');
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
    // console.log(promocodeId);

    const { data: user } = await register.oneClickRegUsdWithPromocode(promocode);
    // console.log(user);
    await banking.setBalance(user.id, CASE_COST_USD * 3);
    const { data: caseWin } = await cases.playCaseWithoutChance(TEN_USD_CASE_ID);
    // console.log(caseWin);

    await sleep(1000);
    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId);
    // console.log(statsAll);

    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId);
    // console.log(statsDay);

    await checkPartnerPaymentCasesCPA(statsAll, statsDay.days[0],
      [{ caseCost: CASE_COST_USD, profit: caseWin.result }], 0, 'USD', 'USD');

    await checkUserMetaCpaPending(user.id, false);

    const { data: caseWin2 } = await cases.playCaseWithoutChance(TEN_USD_CASE_ID);
    // console.log(caseWin2);

    await sleep(1000);
    const { data: statsAll2 } = await partner.getStatsAll(cookie, promocodeId);
    // console.log(statsAll2);

    const { data: statsDay2 } = await partner.getStatsDay(cookie, new Date(), promocodeId);
    // console.log(statsDay2);

    await checkPartnerPaymentCasesCPA(statsAll2, statsDay2.days[0],
      [{ caseCost: CASE_COST_USD, profit: caseWin.result }, { caseCost: CASE_COST_USD, profit: caseWin2.result }], EXPECTED_PAYMENT_AMOUNT_USD, 'USD', 'USD');

    await checkUserMetaCpaPending(user.id, true);
  });

  it('C1789920 (-) cpa_total_amount - several cases, spent less than preset value', async () => {
    let presetNumber = await getLastPresetNumber();
    presetNumber++;

    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    // console.log(partnerEmail);

    await createPreset(presetNumber, 0, 0, 0,
      CASE_COST_USD * 2 + 0.01, 0, 600000, EXPECTED_PAYMENT_AMOUNT_USD);
    await partner.registerWithCPA(partnerEmail, defaultPass, 'USD');
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
    // console.log(promocodeId);

    const { data: user } = await register.oneClickRegUsdWithPromocode(promocode);
    // console.log(user);
    await banking.setBalance(user.id, CASE_COST_USD * 2);
    const { data: caseWin } = await cases.playCaseWithoutChance(TEN_USD_CASE_ID);
    // console.log(caseWin);

    await sleep(1000);
    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId);
    // console.log(statsAll);

    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId);
    // console.log(statsDay);

    await checkPartnerPaymentCasesCPA(statsAll, statsDay.days[0],
      [{ caseCost: CASE_COST_USD, profit: caseWin.result }], 0, 'USD', 'USD');

    const { data: caseWin2 } = await cases.playCaseWithoutChance(TEN_USD_CASE_ID);
    // console.log(caseWin2);

    await sleep(1000);
    const { data: statsAll2 } = await partner.getStatsAll(cookie, promocodeId);
    // console.log(statsAll2);

    const { data: statsDay2 } = await partner.getStatsDay(cookie, new Date(), promocodeId);
    // console.log(statsDay2);

    await checkPartnerPaymentCasesCPA(statsAll2, statsDay2.days[0],
      [{ caseCost: CASE_COST_USD, profit: caseWin.result }, { caseCost: CASE_COST_USD, profit: caseWin2.result }], 0, 'USD', 'USD');

    await checkUserMetaCpaPending(user.id, false);
  });

  it('C1789921 (+) cpa_time_registration, fulfill conditions before preset time', async () => {
    let presetNumber = await getLastPresetNumber();
    presetNumber++;

    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    // console.log(partnerEmail);

    await createPreset(presetNumber, 0, 0, 0,
      CASE_COST_USD, 0, TIME_REGISTRATION, EXPECTED_PAYMENT_AMOUNT_USD);
    await partner.registerWithCPA(partnerEmail, defaultPass, 'USD');
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
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

    await checkPartnerPaymentCasesCPA(statsAll, statsDay.days[0],
      [{ caseCost: CASE_COST_USD, profit: caseWin.result }], EXPECTED_PAYMENT_AMOUNT_USD, 'USD', 'USD');

    await checkUserMetaCpaPending(user.id, true);
  });

  it('C1789922 (-) cpa_time_registration, fulfill conditions after preset time', async () => {
    let presetNumber = await getLastPresetNumber();
    presetNumber++;

    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    // console.log(partnerEmail);

    await createPreset(presetNumber, 0, 0, 0,
      CASE_COST_USD + 0.01, 0, TIME_REGISTRATION, EXPECTED_PAYMENT_AMOUNT_USD);
    await partner.registerWithCPA(partnerEmail, defaultPass, 'USD');
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, presetNumber);
    // console.log(promocodeId);

    const { data: user } = await register.oneClickRegUsdWithPromocode(promocode);
    // console.log(user);
    await banking.setBalance(user.id, CASE_COST_USD);
    await sleep(9000);
    const { data: caseWin } = await cases.playCaseWithoutChance(TEN_USD_CASE_ID);
    // console.log(caseWin);

    await sleep(1000);
    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId);
    // console.log(statsAll);

    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId);
    // console.log(statsDay);

    await checkPartnerPaymentCasesCPA(statsAll, statsDay.days[0],
      [{ caseCost: CASE_COST_USD, profit: caseWin.result }], 0, 'USD', 'USD');

    await checkUserMetaCpaPending(user.id, false);
  });
});
