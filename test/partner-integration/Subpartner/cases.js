/**
 * @jest-environment node
 */
import { partner } from '../../../src/methods/partner';
import { randomNum, randomStr } from '../../../src/randomizer';
import { register } from '../../../src/methods/register';
import { banking } from '../../../src/methods/banking';
import { Refund } from '../../../src/methods/BetsRefund';
import { sleep } from '../../../src/methods/utils';
import {
  checkPartnerPaymentBets,
  checkPartnerPaymentCase,
  checkSubpartnerPayment,
  getCurrencyExchangeCoeff,
} from '../../../src/expects/exPartner';
import { cases } from '../../../src/methods/cases';
import { changeCurrency } from '../../../src/methods/user';
import { mysqlConnection } from '../../../src/methods/mysqlConnection';

describe(' Subpartner ', () => {
  const CASE_COST_RUB = 10000;
  const CASE_RUB_ID = 8;
  const CASE_COST_USD = 200;
  const CASE_USD_ID = 17;
  const CASE_COST_EUR = 200;
  const CASE_EUR_ID = 25;
  const CASE_COST_UAH = 5000;
  const CASE_UAH_ID = 33;
  const defaultPass = '123123AA';

  beforeAll(async () => {
    const dbResult = await mysqlConnection.executeQuery('DELETE FROM 1win.riskmanagement_ip_log;');
    // console.log(dbResult);
    await sleep(1500);
  });

  describe('Partner RUB + subpartner RUB', () => {
    it('C2111935 player RUB ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      const subpartnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'RUB');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const hash = await partner.UrlSubPartner(cookie);
      await partner.register(subpartnerEmail, defaultPass, 'RUB', hash);
      const { cookie: cookieSubPartner } = await partner.login(subpartnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);
      // console.log(partnerEmail, subpartnerEmail);
      // console.log(promocode);

      const { data: user } = await register.oneClickRegRubWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_RUB);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_RUB_ID);
      // console.log(caseWin);
      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{
        caseCost: CASE_COST_RUB,
        profit: caseWin.result,
      }], 'RUB', 'RUB');

      await checkSubpartnerPayment(cookie, 'RUB', 'RUB', statsAll.values.payment_sum);
    });
    it('C2111936 player USD ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      const subpartnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'RUB');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const hash = await partner.UrlSubPartner(cookie);
      await partner.register(subpartnerEmail, defaultPass, 'RUB', hash);
      const { cookie: cookieSubPartner } = await partner.login(subpartnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);
      // console.log(partnerEmail, subpartnerEmail);
      // console.log(promocode);

      const { data: user } = await register.oneClickRegUsdWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_USD);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_USD_ID);
      // console.log(caseWin);

      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);
      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{
        caseCost: CASE_COST_USD,
        profit: caseWin.result,
      }], 'RUB', 'USD');

      await checkSubpartnerPayment(cookie, 'RUB', 'RUB', statsAll.values.payment_sum);
    });
    it('C2111937 player EUR ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      const subpartnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'RUB');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const hash = await partner.UrlSubPartner(cookie);
      await partner.register(subpartnerEmail, defaultPass, 'RUB', hash);
      const { cookie: cookieSubPartner } = await partner.login(subpartnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);
      // console.log(partnerEmail, subpartnerEmail);
      // console.log(promocode);

      const { data: user } = await register.oneClickRegEurWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_EUR);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_EUR_ID);
      // console.log(caseWin);

      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);
      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{
        caseCost: CASE_COST_EUR,
        profit: caseWin.result,
      }], 'RUB', 'EUR');

      await checkSubpartnerPayment(cookie, 'RUB', 'RUB', statsAll.values.payment_sum);
    });
    it('C2111938 player UAH ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      const subpartnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'RUB');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const hash = await partner.UrlSubPartner(cookie);
      await partner.register(subpartnerEmail, defaultPass, 'RUB', hash);
      const { cookie: cookieSubPartner } = await partner.login(subpartnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);
      // console.log(partnerEmail, subpartnerEmail);
      // console.log(promocode);

      const { data: user } = await register.oneClickRegUahWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_UAH);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_UAH_ID);
      // console.log(caseWin);

      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);
      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{
        caseCost: CASE_COST_UAH,
        profit: caseWin.result,
      }], 'RUB', 'UAH');

      await checkSubpartnerPayment(cookie, 'RUB', 'RUB', statsAll.values.payment_sum);
    });
  });

  describe('Partner RUB + subpartner USD', () => {
    it('C2111940 player RUB ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      const subpartnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'RUB');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const hash = await partner.UrlSubPartner(cookie);
      await partner.register(subpartnerEmail, defaultPass, 'USD', hash);
      const { cookie: cookieSubPartner } = await partner.login(subpartnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);
      // console.log(partnerEmail, subpartnerEmail);
      // console.log(promocode);

      const { data: user } = await register.oneClickRegRubWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_RUB);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_RUB_ID);
      // console.log(caseWin);

      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);
      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{
        caseCost: CASE_COST_RUB,
        profit: caseWin.result,
      }], 'USD', 'RUB');

      await checkSubpartnerPayment(cookie, 'RUB', 'USD', statsAll.values.payment_sum);
    });
    it('C2111941 player USD ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      const subpartnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'RUB');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const hash = await partner.UrlSubPartner(cookie);
      await partner.register(subpartnerEmail, defaultPass, 'USD', hash);
      const { cookie: cookieSubPartner } = await partner.login(subpartnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);
      // console.log(partnerEmail, subpartnerEmail);
      // console.log(promocode);

      const { data: user } = await register.oneClickRegUsdWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_USD);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_USD_ID);
      // console.log(caseWin);

      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);
      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{
        caseCost: CASE_COST_USD,
        profit: caseWin.result,
      }], 'USD', 'USD');

      await checkSubpartnerPayment(cookie, 'RUB', 'USD', statsAll.values.payment_sum);
    });
    it('C2111942 player EUR ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      const subpartnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'RUB');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const hash = await partner.UrlSubPartner(cookie);
      await partner.register(subpartnerEmail, defaultPass, 'USD', hash);
      const { cookie: cookieSubPartner } = await partner.login(subpartnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);
      // console.log(partnerEmail, subpartnerEmail);
      // console.log(promocode);

      const { data: user } = await register.oneClickRegEurWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_EUR);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_EUR_ID);
      // console.log(caseWin);

      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);
      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{
        caseCost: CASE_COST_EUR,
        profit: caseWin.result,
      }], 'USD', 'EUR');

      await checkSubpartnerPayment(cookie, 'RUB', 'USD', statsAll.values.payment_sum);
    });
    it('C2111943 player UAH ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      const subpartnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'RUB');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const hash = await partner.UrlSubPartner(cookie);
      await partner.register(subpartnerEmail, defaultPass, 'USD', hash);
      const { cookie: cookieSubPartner } = await partner.login(subpartnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);
      // console.log(partnerEmail, subpartnerEmail);
      // console.log(promocode);

      const { data: user } = await register.oneClickRegUahWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_UAH);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_UAH_ID);
      // console.log(caseWin);

      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);
      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{
        caseCost: CASE_COST_UAH,
        profit: caseWin.result,
      }], 'USD', 'UAH');

      await checkSubpartnerPayment(cookie, 'RUB', 'USD', statsAll.values.payment_sum);
    });
  });

  describe('Partner RUB + subpartner EUR', () => {
    it('C2111944 player RUB ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      const subpartnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'RUB');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const hash = await partner.UrlSubPartner(cookie);
      await partner.register(subpartnerEmail, defaultPass, 'EUR', hash);
      const { cookie: cookieSubPartner } = await partner.login(subpartnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);
      // console.log(partnerEmail, subpartnerEmail);
      // console.log(promocode);

      const { data: user } = await register.oneClickRegRubWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_RUB);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_RUB_ID);
      // console.log(caseWin);

      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);
      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{
        caseCost: CASE_COST_RUB,
        profit: caseWin.result,
      }], 'EUR', 'RUB');

      await checkSubpartnerPayment(cookie, 'RUB', 'EUR', statsAll.values.payment_sum);
    });
    it('C2111945 player USD ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      const subpartnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'RUB');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const hash = await partner.UrlSubPartner(cookie);
      await partner.register(subpartnerEmail, defaultPass, 'EUR', hash);
      const { cookie: cookieSubPartner } = await partner.login(subpartnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);
      // console.log(partnerEmail, subpartnerEmail);
      // console.log(promocode);

      const { data: user } = await register.oneClickRegUsdWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_USD);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_USD_ID);
      // console.log(caseWin);

      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);
      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{
        caseCost: CASE_COST_USD,
        profit: caseWin.result,
      }], 'EUR', 'USD');

      await checkSubpartnerPayment(cookie, 'RUB', 'EUR', statsAll.values.payment_sum);
    });
    it('C2111946 player EUR ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      const subpartnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'RUB');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const hash = await partner.UrlSubPartner(cookie);
      await partner.register(subpartnerEmail, defaultPass, 'EUR', hash);
      const { cookie: cookieSubPartner } = await partner.login(subpartnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);
      // console.log(partnerEmail, subpartnerEmail);
      // console.log(promocode);

      const { data: user } = await register.oneClickRegEurWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_EUR);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_EUR_ID);
      // console.log(caseWin);

      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);
      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{
        caseCost: CASE_COST_EUR,
        profit: caseWin.result,
      }], 'EUR', 'EUR');

      await checkSubpartnerPayment(cookie, 'RUB', 'EUR', statsAll.values.payment_sum);
    });
    it('C2111947 player UAH ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      const subpartnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'RUB');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const hash = await partner.UrlSubPartner(cookie);
      await partner.register(subpartnerEmail, defaultPass, 'EUR', hash);
      const { cookie: cookieSubPartner } = await partner.login(subpartnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);
      // console.log(partnerEmail, subpartnerEmail);
      // console.log(promocode);

      const { data: user } = await register.oneClickRegUahWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_UAH);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_UAH_ID);
      // console.log(caseWin);

      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);
      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{
        caseCost: CASE_COST_UAH,
        profit: caseWin.result,
      }], 'EUR', 'UAH');

      await checkSubpartnerPayment(cookie, 'RUB', 'EUR', statsAll.values.payment_sum);
    });
  });

  describe('Partner USD + subpartner RUB', () => {
    it('C2111948 player RUB ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      const subpartnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'USD');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const hash = await partner.UrlSubPartner(cookie);
      await partner.register(subpartnerEmail, defaultPass, 'RUB', hash);
      const { cookie: cookieSubPartner } = await partner.login(subpartnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);
      // console.log(partnerEmail, subpartnerEmail);
      // console.log(promocode);

      const { data: user } = await register.oneClickRegRubWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_RUB);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_RUB_ID);
      // console.log(caseWin);

      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);
      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{
        caseCost: CASE_COST_RUB,
        profit: caseWin.result,
      }], 'RUB', 'RUB');

      await checkSubpartnerPayment(cookie, 'USD', 'RUB', statsAll.values.payment_sum);
    });
    it('C2111949 player USD ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      const subpartnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'USD');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const hash = await partner.UrlSubPartner(cookie);
      await partner.register(subpartnerEmail, defaultPass, 'RUB', hash);
      const { cookie: cookieSubPartner } = await partner.login(subpartnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);
      // console.log(partnerEmail, subpartnerEmail);
      // console.log(promocode);

      const { data: user } = await register.oneClickRegUsdWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_USD);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_USD_ID);
      // console.log(caseWin);

      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);
      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{
        caseCost: CASE_COST_USD,
        profit: caseWin.result,
      }], 'RUB', 'USD');

      await checkSubpartnerPayment(cookie, 'USD', 'RUB', statsAll.values.payment_sum);
    });
    it('C2111950 player EUR ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      const subpartnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'USD');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const hash = await partner.UrlSubPartner(cookie);
      await partner.register(subpartnerEmail, defaultPass, 'RUB', hash);
      const { cookie: cookieSubPartner } = await partner.login(subpartnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);
      // console.log(partnerEmail, subpartnerEmail);
      // console.log(promocode);

      const { data: user } = await register.oneClickRegEurWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_EUR);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_EUR_ID);
      // console.log(caseWin);

      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);
      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{
        caseCost: CASE_COST_EUR,
        profit: caseWin.result,
      }], 'RUB', 'EUR');

      await checkSubpartnerPayment(cookie, 'USD', 'RUB', statsAll.values.payment_sum);
    });
    it('C2111951 player UAH ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      const subpartnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'USD');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const hash = await partner.UrlSubPartner(cookie);
      await partner.register(subpartnerEmail, defaultPass, 'RUB', hash);
      const { cookie: cookieSubPartner } = await partner.login(subpartnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);
      // console.log(partnerEmail, subpartnerEmail);
      // console.log(promocode);

      const { data: user } = await register.oneClickRegUahWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_UAH);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_UAH_ID);
      // console.log(caseWin);

      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);
      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{
        caseCost: CASE_COST_UAH,
        profit: caseWin.result,
      }], 'RUB', 'UAH');

      await checkSubpartnerPayment(cookie, 'USD', 'RUB', statsAll.values.payment_sum);
    });
  });

  describe('Partner USD + subpartner USD', () => {
    it('C2111952 player RUB ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      const subpartnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'USD');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const hash = await partner.UrlSubPartner(cookie);
      await partner.register(subpartnerEmail, defaultPass, 'USD', hash);
      const { cookie: cookieSubPartner } = await partner.login(subpartnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);
      // console.log(partnerEmail, subpartnerEmail);
      // console.log(promocode);

      const { data: user } = await register.oneClickRegRubWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_RUB);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_RUB_ID);
      // console.log(caseWin);

      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);
      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{
        caseCost: CASE_COST_RUB,
        profit: caseWin.result,
      }], 'USD', 'RUB');

      await checkSubpartnerPayment(cookie, 'USD', 'USD', statsAll.values.payment_sum);
    });
    it('C2111953 player USD ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      const subpartnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'USD');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const hash = await partner.UrlSubPartner(cookie);
      await partner.register(subpartnerEmail, defaultPass, 'USD', hash);
      const { cookie: cookieSubPartner } = await partner.login(subpartnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);
      // console.log(partnerEmail, subpartnerEmail);
      // console.log(promocode);

      const { data: user } = await register.oneClickRegUsdWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_USD);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_USD_ID);
      // console.log(caseWin);

      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);
      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{
        caseCost: CASE_COST_USD,
        profit: caseWin.result,
      }], 'USD', 'USD');

      await checkSubpartnerPayment(cookie, 'USD', 'USD', statsAll.values.payment_sum);
    });
    it('C2111954 player EUR ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      const subpartnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'USD');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const hash = await partner.UrlSubPartner(cookie);
      await partner.register(subpartnerEmail, defaultPass, 'USD', hash);
      const { cookie: cookieSubPartner } = await partner.login(subpartnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);
      // console.log(partnerEmail, subpartnerEmail);
      // console.log(promocode);

      const { data: user } = await register.oneClickRegEurWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_EUR);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_EUR_ID);
      // console.log(caseWin);

      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);
      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{
        caseCost: CASE_COST_EUR,
        profit: caseWin.result,
      }], 'USD', 'EUR');

      await checkSubpartnerPayment(cookie, 'USD', 'USD', statsAll.values.payment_sum);
    });
    it('C2111955 player UAH ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      const subpartnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'USD');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const hash = await partner.UrlSubPartner(cookie);
      await partner.register(subpartnerEmail, defaultPass, 'USD', hash);
      const { cookie: cookieSubPartner } = await partner.login(subpartnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);
      // console.log(partnerEmail, subpartnerEmail);
      // console.log(promocode);

      const { data: user } = await register.oneClickRegUahWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_UAH);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_UAH_ID);
      // console.log(caseWin);

      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);
      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{
        caseCost: CASE_COST_UAH,
        profit: caseWin.result,
      }], 'USD', 'UAH');

      await checkSubpartnerPayment(cookie, 'USD', 'USD', statsAll.values.payment_sum);
    });
  });

  describe('Partner USD + subpartner EUR', () => {
    it('C2111956 player RUB ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      const subpartnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'USD');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const hash = await partner.UrlSubPartner(cookie);
      await partner.register(subpartnerEmail, defaultPass, 'EUR', hash);
      const { cookie: cookieSubPartner } = await partner.login(subpartnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);
      // console.log(partnerEmail, subpartnerEmail);
      // console.log(promocode);

      const { data: user } = await register.oneClickRegRubWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_RUB);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_RUB_ID);
      // console.log(caseWin);

      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);
      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{
        caseCost: CASE_COST_RUB,
        profit: caseWin.result,
      }], 'EUR', 'RUB');

      await checkSubpartnerPayment(cookie, 'USD', 'EUR', statsAll.values.payment_sum);
    });
    it('C2111957 player USD ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      const subpartnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'USD');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const hash = await partner.UrlSubPartner(cookie);
      await partner.register(subpartnerEmail, defaultPass, 'EUR', hash);
      const { cookie: cookieSubPartner } = await partner.login(subpartnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);
      // console.log(partnerEmail, subpartnerEmail);
      // console.log(promocode);

      const { data: user } = await register.oneClickRegUsdWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_USD);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_USD_ID);
      // console.log(caseWin);

      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);
      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{
        caseCost: CASE_COST_USD,
        profit: caseWin.result,
      }], 'EUR', 'USD');

      await checkSubpartnerPayment(cookie, 'USD', 'EUR', statsAll.values.payment_sum);
    });
    it('C2111958 player EUR ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      const subpartnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'USD');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const hash = await partner.UrlSubPartner(cookie);
      await partner.register(subpartnerEmail, defaultPass, 'EUR', hash);
      const { cookie: cookieSubPartner } = await partner.login(subpartnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);
      // console.log(partnerEmail, subpartnerEmail);
      // console.log(promocode);

      const { data: user } = await register.oneClickRegEurWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_EUR);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_EUR_ID);
      // console.log(caseWin);

      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);
      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{
        caseCost: CASE_COST_EUR,
        profit: caseWin.result,
      }], 'EUR', 'EUR');

      await checkSubpartnerPayment(cookie, 'USD', 'EUR', statsAll.values.payment_sum);
    });
    it('C2111959 player UAH ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      const subpartnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'USD');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const hash = await partner.UrlSubPartner(cookie);
      await partner.register(subpartnerEmail, defaultPass, 'EUR', hash);
      const { cookie: cookieSubPartner } = await partner.login(subpartnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);
      // console.log(partnerEmail, subpartnerEmail);
      // console.log(promocode);

      const { data: user } = await register.oneClickRegUahWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_UAH);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_UAH_ID);
      // console.log(caseWin);

      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);
      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{
        caseCost: CASE_COST_UAH,
        profit: caseWin.result,
      }], 'EUR', 'UAH');

      await checkSubpartnerPayment(cookie, 'USD', 'EUR', statsAll.values.payment_sum);
    });
  });

  describe('Partner EUR + subpartner RUB', () => {
    it('C2111960 player RUB ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      const subpartnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'EUR');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const hash = await partner.UrlSubPartner(cookie);
      await partner.register(subpartnerEmail, defaultPass, 'RUB', hash);
      const { cookie: cookieSubPartner } = await partner.login(subpartnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);
      // console.log(partnerEmail, subpartnerEmail);
      // console.log(promocode);

      const { data: user } = await register.oneClickRegRubWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_RUB);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_RUB_ID);
      // console.log(caseWin);

      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);
      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{
        caseCost: CASE_COST_RUB,
        profit: caseWin.result,
      }], 'RUB', 'RUB');

      await checkSubpartnerPayment(cookie, 'EUR', 'RUB', statsAll.values.payment_sum);
    });
    it('C2111961 player USD ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      const subpartnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'EUR');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const hash = await partner.UrlSubPartner(cookie);
      await partner.register(subpartnerEmail, defaultPass, 'RUB', hash);
      const { cookie: cookieSubPartner } = await partner.login(subpartnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);
      // console.log(partnerEmail, subpartnerEmail);
      // console.log(promocode);

      const { data: user } = await register.oneClickRegUsdWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_USD);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_USD_ID);
      // console.log(caseWin);

      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);
      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{
        caseCost: CASE_COST_USD,
        profit: caseWin.result,
      }], 'RUB', 'USD');

      await checkSubpartnerPayment(cookie, 'EUR', 'RUB', statsAll.values.payment_sum);
    });
    it('C2111962 player EUR ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      const subpartnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'EUR');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const hash = await partner.UrlSubPartner(cookie);
      await partner.register(subpartnerEmail, defaultPass, 'RUB', hash);
      const { cookie: cookieSubPartner } = await partner.login(subpartnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);
      // console.log(partnerEmail, subpartnerEmail);
      // console.log(promocode);

      const { data: user } = await register.oneClickRegEurWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_EUR);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_EUR_ID);
      // console.log(caseWin);

      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);
      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{
        caseCost: CASE_COST_EUR,
        profit: caseWin.result,
      }], 'RUB', 'EUR');

      await checkSubpartnerPayment(cookie, 'EUR', 'RUB', statsAll.values.payment_sum);
    });
    it('C2111963 player UAH ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      const subpartnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'EUR');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const hash = await partner.UrlSubPartner(cookie);
      await partner.register(subpartnerEmail, defaultPass, 'RUB', hash);
      const { cookie: cookieSubPartner } = await partner.login(subpartnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);
      // console.log(partnerEmail, subpartnerEmail);
      // console.log(promocode);

      const { data: user } = await register.oneClickRegUahWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_UAH);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_UAH_ID);
      // console.log(caseWin);

      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);
      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{
        caseCost: CASE_COST_UAH,
        profit: caseWin.result,
      }], 'RUB', 'UAH');

      await checkSubpartnerPayment(cookie, 'EUR', 'RUB', statsAll.values.payment_sum);
    });
  });

  describe('Partner EUR + subpartner USD', () => {
    it('C2111964 player RUB ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      const subpartnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'EUR');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const hash = await partner.UrlSubPartner(cookie);
      await partner.register(subpartnerEmail, defaultPass, 'USD', hash);
      const { cookie: cookieSubPartner } = await partner.login(subpartnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);
      // console.log(partnerEmail, subpartnerEmail);
      // console.log(promocode);

      const { data: user } = await register.oneClickRegRubWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_RUB);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_RUB_ID);
      // console.log(caseWin);

      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);
      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{
        caseCost: CASE_COST_RUB,
        profit: caseWin.result,
      }], 'USD', 'RUB');

      await checkSubpartnerPayment(cookie, 'EUR', 'USD', statsAll.values.payment_sum);
    });
    it('C2111965 player USD ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      const subpartnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'EUR');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const hash = await partner.UrlSubPartner(cookie);
      await partner.register(subpartnerEmail, defaultPass, 'USD', hash);
      const { cookie: cookieSubPartner } = await partner.login(subpartnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);
      // console.log(partnerEmail, subpartnerEmail);
      // console.log(promocode);

      const { data: user } = await register.oneClickRegUsdWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_USD);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_USD_ID);
      // console.log(caseWin);

      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);
      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{
        caseCost: CASE_COST_USD,
        profit: caseWin.result,
      }], 'USD', 'USD');

      await checkSubpartnerPayment(cookie, 'EUR', 'USD', statsAll.values.payment_sum);
    });
    it('C2111966 player EUR ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      const subpartnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'EUR');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const hash = await partner.UrlSubPartner(cookie);
      await partner.register(subpartnerEmail, defaultPass, 'USD', hash);
      const { cookie: cookieSubPartner } = await partner.login(subpartnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);
      // console.log(partnerEmail, subpartnerEmail);
      // console.log(promocode);

      const { data: user } = await register.oneClickRegEurWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_EUR);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_EUR_ID);
      // console.log(caseWin);

      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);
      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{
        caseCost: CASE_COST_EUR,
        profit: caseWin.result,
      }], 'USD', 'EUR');

      await checkSubpartnerPayment(cookie, 'EUR', 'USD', statsAll.values.payment_sum);
    });
    it('C2111967 player UAH ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      const subpartnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'EUR');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const hash = await partner.UrlSubPartner(cookie);
      await partner.register(subpartnerEmail, defaultPass, 'USD', hash);
      const { cookie: cookieSubPartner } = await partner.login(subpartnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);
      // console.log(partnerEmail, subpartnerEmail);
      // console.log(promocode);

      const { data: user } = await register.oneClickRegUahWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_UAH);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_UAH_ID);
      // console.log(caseWin);

      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);
      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{
        caseCost: CASE_COST_UAH,
        profit: caseWin.result,
      }], 'USD', 'UAH');

      await checkSubpartnerPayment(cookie, 'EUR', 'USD', statsAll.values.payment_sum);
    });
  });

  describe('Partner EUR + subpartner EUR', () => {
    it('C2111968 player RUB ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      const subpartnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'EUR');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const hash = await partner.UrlSubPartner(cookie);
      await partner.register(subpartnerEmail, defaultPass, 'EUR', hash);
      const { cookie: cookieSubPartner } = await partner.login(subpartnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);
      // console.log(partnerEmail, subpartnerEmail);
      // console.log(promocode);

      const { data: user } = await register.oneClickRegRubWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_RUB);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_RUB_ID);
      // console.log(caseWin);

      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);
      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{
        caseCost: CASE_COST_RUB,
        profit: caseWin.result,
      }], 'EUR', 'RUB');

      await checkSubpartnerPayment(cookie, 'EUR', 'EUR', statsAll.values.payment_sum);
    });
    it('C2111969 player USD ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      const subpartnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'EUR');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const hash = await partner.UrlSubPartner(cookie);
      await partner.register(subpartnerEmail, defaultPass, 'EUR', hash);
      const { cookie: cookieSubPartner } = await partner.login(subpartnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);
      // console.log(partnerEmail, subpartnerEmail);
      // console.log(promocode);

      const { data: user } = await register.oneClickRegUsdWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_USD);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_USD_ID);
      // console.log(caseWin);

      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);
      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{
        caseCost: CASE_COST_USD,
        profit: caseWin.result,
      }], 'EUR', 'USD');

      await checkSubpartnerPayment(cookie, 'EUR', 'EUR', statsAll.values.payment_sum);
    });
    it('C2111970 player EUR ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      const subpartnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'EUR');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const hash = await partner.UrlSubPartner(cookie);
      await partner.register(subpartnerEmail, defaultPass, 'EUR', hash);
      const { cookie: cookieSubPartner } = await partner.login(subpartnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);
      // console.log(partnerEmail, subpartnerEmail);
      // console.log(promocode);

      const { data: user } = await register.oneClickRegEurWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_EUR);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_EUR_ID);
      // console.log(caseWin);

      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);
      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{
        caseCost: CASE_COST_EUR,
        profit: caseWin.result,
      }], 'EUR', 'EUR');

      await checkSubpartnerPayment(cookie, 'EUR', 'EUR', statsAll.values.payment_sum);
    });
    it('C2111971 player UAH ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;
      const subpartnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'EUR');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const hash = await partner.UrlSubPartner(cookie);
      await partner.register(subpartnerEmail, defaultPass, 'EUR', hash);
      const { cookie: cookieSubPartner } = await partner.login(subpartnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);
      // console.log(partnerEmail, subpartnerEmail);
      // console.log(promocode);

      const { data: user } = await register.oneClickRegUahWithPromocode(promocode);
      // console.log(user);
      await banking.setBalance(user.id, CASE_COST_UAH);
      const { data: caseWin } = await cases.playCaseWithoutChance(CASE_UAH_ID);
      // console.log(caseWin);

      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);
      await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{
        caseCost: CASE_COST_UAH,
        profit: caseWin.result,
      }], 'EUR', 'UAH');

      await checkSubpartnerPayment(cookie, 'EUR', 'EUR', statsAll.values.payment_sum);
    });
  });
});
