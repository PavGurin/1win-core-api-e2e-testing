/**
 * @jest-environment node
 */

import { mysqlConnection } from '../../../../src/methods/mysqlConnection';
import { sleep } from '../../../../src/methods/utils';
import { randomNum, randomStr } from '../../../../src/randomizer';
import { partner } from '../../../../src/methods/partner';
import { register } from '../../../../src/methods/register';
import { banking } from '../../../../src/methods/banking';
import { cases } from '../../../../src/methods/cases';
import {
  checkPartnerPaymentCasesCPA,
  checkUserMetaCpaPending,
} from '../../../../src/expects/exPartner';

// описание СРА https://fbet-gitlab.ex2b.co/qa/qa-autotests/-/wikis/7.Partnerka/CPA

describe('Payments for cases to CPA partner, all currency combinations', () => {
  const defaultPass = '123123AA';
  const THOUSAND_ROUBLES_CASE_ID = 6;
  const CASE_COST_RUB = 1000;
  const TEN_USD_CASE_ID = 13;
  const CASE_COST_USD = 10;
  const TEN_EUR_CASE_ID = 21;
  const CASE_COST_EUR = 10;
  const FIVE_HUNDRED_UAH_CASE_ID = 31;
  const CASE_COST_UAH = 500;

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

  it('C1789901 (+) Partner RUB + player RUB', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    // console.log(partnerEmail);

    const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'RUB');
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, PRESET_NUMBER);
    // console.log(promocodeId);

    const { data: user } = await register.oneClickRegWithPromocode(promocode, 'RUB');
    // console.log(user);
    await banking.setBalance(user.id, CASE_COST_RUB);
    const { data: caseWin } = await cases.playCaseWithoutChance(THOUSAND_ROUBLES_CASE_ID);
    // console.log(caseWin);


    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);

    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);

    await checkPartnerPaymentCasesCPA(statsAll, statsDay.days[0],
      [{ caseCost: CASE_COST_RUB, profit: caseWin.result }],
      EXPECTED_PAYMENT_AMOUNT_USD, 'RUB', 'RUB');

    await checkUserMetaCpaPending(user.id, true);
  });

  it('C1789902 (+) Partner RUB + player USD', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    // console.log(partnerEmail);

    const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'RUB');
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, PRESET_NUMBER);
    // console.log(promocodeId);
    const { data: user } = await register.oneClickRegWithPromocode(promocode, 'USD');
    // console.log(user);
    await banking.setBalance(user.id, CASE_COST_USD);
    const { data: caseWin } = await cases.playCaseWithoutChance(TEN_USD_CASE_ID);
    // console.log(caseWin);


    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);

    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);

    await checkPartnerPaymentCasesCPA(statsAll, statsDay.days[0],
      [{ caseCost: CASE_COST_USD, profit: caseWin.result }],
      EXPECTED_PAYMENT_AMOUNT_USD, 'RUB', 'USD');

    await checkUserMetaCpaPending(user.id, true);
  });

  it('C1789903 (+) Partner RUB + player EUR', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    // console.log(partnerEmail);

    const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'RUB');
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, PRESET_NUMBER);
    // console.log(promocodeId);
    const { data: user } = await register.oneClickRegWithPromocode(promocode, 'EUR');
    // console.log(user);
    await banking.setBalance(user.id, CASE_COST_EUR);
    const { data: caseWin } = await cases.playCaseWithoutChance(TEN_EUR_CASE_ID);
    // console.log(caseWin);


    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);

    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);

    await checkPartnerPaymentCasesCPA(statsAll, statsDay.days[0],
      [{ caseCost: CASE_COST_EUR, profit: caseWin.result }],
      EXPECTED_PAYMENT_AMOUNT_USD, 'RUB', 'EUR');

    await checkUserMetaCpaPending(user.id, true);
  });

  it('C1789904 (+) Partner RUB + player UAH', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    // console.log(partnerEmail);

    const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'RUB');
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, PRESET_NUMBER);
    // console.log(promocodeId);
    const { data: user } = await register.oneClickRegWithPromocode(promocode, 'UAH');
    // console.log(user);
    await banking.setBalance(user.id, CASE_COST_UAH);
    const { data: caseWin } = await cases.playCaseWithoutChance(FIVE_HUNDRED_UAH_CASE_ID);
    // console.log(caseWin);


    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);

    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);

    await checkPartnerPaymentCasesCPA(statsAll, statsDay.days[0],
      [{ caseCost: CASE_COST_UAH, profit: caseWin.result }],
      EXPECTED_PAYMENT_AMOUNT_USD, 'RUB', 'UAH');

    await checkUserMetaCpaPending(user.id, true);
  });

  it('C1789905 (+) Partner USD + player RUB', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    // console.log(partnerEmail);

    const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'USD');
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, PRESET_NUMBER);
    // console.log(promocodeId);
    const { data: user } = await register.oneClickRegWithPromocode(promocode, 'RUB');
    // console.log(user);
    await banking.setBalance(user.id, CASE_COST_RUB);
    const { data: caseWin } = await cases.playCaseWithoutChance(THOUSAND_ROUBLES_CASE_ID);
    // console.log(caseWin);


    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);

    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);

    await checkPartnerPaymentCasesCPA(statsAll, statsDay.days[0],
      [{ caseCost: CASE_COST_RUB, profit: caseWin.result }],
      EXPECTED_PAYMENT_AMOUNT_USD, 'USD', 'RUB');

    await checkUserMetaCpaPending(user.id, true);
  });

  it('C1789906 (+) Partner USD + player USD', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    // console.log(partnerEmail);

    const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'USD');
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, PRESET_NUMBER);
    // console.log(promocodeId);
    const { data: user } = await register.oneClickRegWithPromocode(promocode, 'USD');
    // console.log(user);
    await banking.setBalance(user.id, CASE_COST_USD);
    const { data: caseWin } = await cases.playCaseWithoutChance(TEN_USD_CASE_ID);
    // console.log(caseWin);


    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);

    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);

    await checkPartnerPaymentCasesCPA(statsAll, statsDay.days[0],
      [{ caseCost: CASE_COST_USD, profit: caseWin.result }],
      EXPECTED_PAYMENT_AMOUNT_USD, 'USD', 'USD');

    await checkUserMetaCpaPending(user.id, true);
  });

  it('C1789907 (+) Partner USD + player EUR', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    // console.log(partnerEmail);

    const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'USD');
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, PRESET_NUMBER);
    // console.log(promocodeId);
    const { data: user } = await register.oneClickRegWithPromocode(promocode, 'EUR');
    // console.log(user);
    await banking.setBalance(user.id, CASE_COST_EUR);
    const { data: caseWin } = await cases.playCaseWithoutChance(TEN_EUR_CASE_ID);
    // console.log(caseWin);


    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);

    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);

    await checkPartnerPaymentCasesCPA(statsAll, statsDay.days[0],
      [{ caseCost: CASE_COST_EUR, profit: caseWin.result }],
      EXPECTED_PAYMENT_AMOUNT_USD, 'USD', 'EUR');

    await checkUserMetaCpaPending(user.id, true);
  });

  it('C1789908 (+) Partner USD + player UAH', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    // console.log(partnerEmail);

    const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'USD');
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, PRESET_NUMBER);
    // console.log(promocodeId);
    const { data: user } = await register.oneClickRegWithPromocode(promocode, 'UAH');
    // console.log(user);
    await banking.setBalance(user.id, CASE_COST_UAH);
    const { data: caseWin } = await cases.playCaseWithoutChance(FIVE_HUNDRED_UAH_CASE_ID);
    // console.log(caseWin);


    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);

    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);

    await checkPartnerPaymentCasesCPA(statsAll, statsDay.days[0],
      [{ caseCost: CASE_COST_UAH, profit: caseWin.result }],
      EXPECTED_PAYMENT_AMOUNT_USD, 'USD', 'UAH');

    await checkUserMetaCpaPending(user.id, true);
  });

  it('C1789909 (+) Partner EUR + player RUB', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    // console.log(partnerEmail);

    const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'EUR');
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, PRESET_NUMBER);
    // console.log(promocodeId);
    const { data: user } = await register.oneClickRegWithPromocode(promocode, 'RUB');
    // console.log(user);
    await banking.setBalance(user.id, CASE_COST_RUB);
    const { data: caseWin } = await cases.playCaseWithoutChance(THOUSAND_ROUBLES_CASE_ID);
    // console.log(caseWin);


    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);

    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);

    await checkPartnerPaymentCasesCPA(statsAll, statsDay.days[0],
      [{ caseCost: CASE_COST_RUB, profit: caseWin.result }],
      EXPECTED_PAYMENT_AMOUNT_USD, 'EUR', 'RUB');

    await checkUserMetaCpaPending(user.id, true);
  });

  it('C1789910 (+) Partner EUR + player USD', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    // console.log(partnerEmail);

    const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'EUR');
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, PRESET_NUMBER);
    // console.log(promocodeId);
    const { data: user } = await register.oneClickRegWithPromocode(promocode, 'USD');
    // console.log(user);
    await banking.setBalance(user.id, CASE_COST_USD);
    const { data: caseWin } = await cases.playCaseWithoutChance(TEN_USD_CASE_ID);
    // console.log(caseWin);


    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);

    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);

    await checkPartnerPaymentCasesCPA(statsAll, statsDay.days[0],
      [{ caseCost: CASE_COST_USD, profit: caseWin.result }],
      EXPECTED_PAYMENT_AMOUNT_USD, 'EUR', 'USD');

    await checkUserMetaCpaPending(user.id, true);
  });

  it('C1789911 (+) Partner EUR + player EUR', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    // console.log(partnerEmail);

    const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'EUR');
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, PRESET_NUMBER);
    // console.log(promocodeId);
    const { data: user } = await register.oneClickRegWithPromocode(promocode, 'EUR');
    // console.log(user);
    await banking.setBalance(user.id, CASE_COST_EUR);
    const { data: caseWin } = await cases.playCaseWithoutChance(TEN_EUR_CASE_ID);
    // console.log(caseWin);


    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);

    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);

    await checkPartnerPaymentCasesCPA(statsAll, statsDay.days[0],
      [{ caseCost: CASE_COST_EUR, profit: caseWin.result }],
      EXPECTED_PAYMENT_AMOUNT_USD, 'EUR', 'EUR');

    await checkUserMetaCpaPending(user.id, true);
  });

  it('C1789912 (+) Partner EUR + player UAH', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    // console.log(partnerEmail);

    const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'EUR');
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, PRESET_NUMBER);
    // console.log(promocodeId);
    const { data: user } = await register.oneClickRegWithPromocode(promocode, 'UAH');
    // console.log(user);
    await banking.setBalance(user.id, CASE_COST_UAH);
    const { data: caseWin } = await cases.playCaseWithoutChance(FIVE_HUNDRED_UAH_CASE_ID);
    // console.log(caseWin);


    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);

    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);

    await checkPartnerPaymentCasesCPA(statsAll, statsDay.days[0],
      [{ caseCost: CASE_COST_UAH, profit: caseWin.result }],
      EXPECTED_PAYMENT_AMOUNT_USD, 'EUR', 'UAH');

    await checkUserMetaCpaPending(user.id, true);
  });
});
