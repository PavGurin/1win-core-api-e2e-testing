/**
 * @jest-environment node
 */
import { partner } from '../../../../src/methods/partner';
import { randomNum, randomStr } from '../../../../src/randomizer';
import { sleep } from '../../../../src/methods/utils';
import {
  checkPartnerPaymentCase,
  checkSubpartnerPayment,
} from '../../../../src/expects/exPartner';
import { mysqlConnection } from '../../../../src/methods/mysqlConnection';
import { regUsersAndPlayCases } from '../../../../src/methods/regUsersForPartner';

describe(' subpartner ', () => {
  const CASE_COST_RUB = 10000;
  const CASE_COST_USD = 200;
  const CASE_COST_EUR = 200;
  const CASE_COST_UAH = 5000;
  const defaultPass = '123123AA';
  let partnerEmail;
  let subpartnerEmail;
  let promocode;

  beforeAll(async () => {
    const dbResult = await mysqlConnection.executeQuery('DELETE FROM 1win.riskmanagement_ip_log;');
    // console.log(dbResult);
    await sleep(1500);
  });

  beforeEach(async () => {
    promocode = randomNum(10).toString();
    partnerEmail = `${randomStr(10)}@ahem.email`;
    subpartnerEmail = `${randomStr(10)}@ahem.email`;
    // console.log(partnerEmail, subpartnerEmail);
    // console.log(promocode);
  });

  describe('Partner RUB + subpartner RUB', () => {
    it('C2111935 player RUB ', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
      const hash = await partner.UrlSubPartner(cookie);
      const { cookie: cookieSubPartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'RUB', hash);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_RUB, 'RUB', promocode);
      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'RUB', 'RUB');
      await checkSubpartnerPayment(cookie, 'RUB', 'RUB', statsAll.values.payment_sum);
    });
    it('C2111936 player USD ', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
      const hash = await partner.UrlSubPartner(cookie);
      const { cookie: cookieSubPartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'RUB', hash);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_USD, 'USD', promocode);
      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'RUB', 'USD');
      await checkSubpartnerPayment(cookie, 'RUB', 'RUB', statsAll.values.payment_sum);
    });
    it('C2111937 player EUR ', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
      const hash = await partner.UrlSubPartner(cookie);
      const { cookie: cookieSubPartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'RUB', hash);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_EUR, 'EUR', promocode);
      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'RUB', 'EUR');
      await checkSubpartnerPayment(cookie, 'RUB', 'RUB', statsAll.values.payment_sum);
    });
    it('C2111938 player UAH ', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
      const hash = await partner.UrlSubPartner(cookie);
      const { cookie: cookieSubPartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'RUB', hash);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_UAH, 'UAH', promocode);
      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'RUB', 'UAH');
      await checkSubpartnerPayment(cookie, 'RUB', 'RUB', statsAll.values.payment_sum);
    });
  });

  describe('Partner RUB + subpartner USD', () => {
    it('C2111940 player RUB ', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
      const hash = await partner.UrlSubPartner(cookie);
      const { cookie: cookieSubPartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'USD', hash);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_RUB, 'RUB', promocode);
      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'USD', 'RUB');
      await checkSubpartnerPayment(cookie, 'RUB', 'USD', statsAll.values.payment_sum);
    });
    it('C2111941 player USD ', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
      const hash = await partner.UrlSubPartner(cookie);
      const { cookie: cookieSubPartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'USD', hash);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_USD, 'USD', promocode);
      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'USD', 'USD');
      await checkSubpartnerPayment(cookie, 'RUB', 'USD', statsAll.values.payment_sum);
    });
    it('C2111942 player EUR ', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
      const hash = await partner.UrlSubPartner(cookie);
      const { cookie: cookieSubPartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'USD', hash);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_EUR, 'EUR', promocode);
      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'USD', 'EUR');
      await checkSubpartnerPayment(cookie, 'RUB', 'USD', statsAll.values.payment_sum);
    });
    it('C2111943 player UAH ', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
      const hash = await partner.UrlSubPartner(cookie);
      const { cookie: cookieSubPartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'USD', hash);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_UAH, 'UAH', promocode);
      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'USD', 'UAH');
      await checkSubpartnerPayment(cookie, 'RUB', 'USD', statsAll.values.payment_sum);
    });
  });

  describe('Partner RUB + subpartner EUR', () => {
    it('C2111944 player RUB ', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
      const hash = await partner.UrlSubPartner(cookie);
      const { cookie: cookieSubPartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'EUR', hash);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_RUB, 'RUB', promocode);
      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'EUR', 'RUB');
      await checkSubpartnerPayment(cookie, 'RUB', 'EUR', statsAll.values.payment_sum);
    });
    it('C2111945 player USD ', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
      const hash = await partner.UrlSubPartner(cookie);
      const { cookie: cookieSubPartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'EUR', hash);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_USD, 'USD', promocode);
      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'EUR', 'USD');
      await checkSubpartnerPayment(cookie, 'RUB', 'EUR', statsAll.values.payment_sum);
    });
    it('C2111946 player EUR ', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
      const hash = await partner.UrlSubPartner(cookie);
      const { cookie: cookieSubPartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'EUR', hash);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_EUR, 'EUR', promocode);
      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'EUR', 'EUR');
      await checkSubpartnerPayment(cookie, 'RUB', 'EUR', statsAll.values.payment_sum);
    });
    it('C2111947 player UAH ', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
      const hash = await partner.UrlSubPartner(cookie);
      const { cookie: cookieSubPartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'EUR', hash);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_UAH, 'UAH', promocode);
      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'EUR', 'UAH');
      await checkSubpartnerPayment(cookie, 'RUB', 'EUR', statsAll.values.payment_sum);
    });
  });

  describe('Partner USD + subpartner RUB', () => {
    it('C2111948 player RUB ', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
      const hash = await partner.UrlSubPartner(cookie);
      const { cookie: cookieSubPartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'RUB', hash);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_RUB, 'RUB', promocode);
      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'RUB', 'RUB');
      await checkSubpartnerPayment(cookie, 'USD', 'RUB', statsAll.values.payment_sum);
    });
    it('C2111949 player USD ', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
      const hash = await partner.UrlSubPartner(cookie);
      const { cookie: cookieSubPartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'RUB', hash);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_USD, 'USD', promocode);
      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'RUB', 'USD');
      await checkSubpartnerPayment(cookie, 'USD', 'RUB', statsAll.values.payment_sum);
    });
    it('C2111950 player EUR ', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
      const hash = await partner.UrlSubPartner(cookie);
      const { cookie: cookieSubPartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'RUB', hash);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_EUR, 'EUR', promocode);
      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'RUB', 'EUR');
      await checkSubpartnerPayment(cookie, 'USD', 'RUB', statsAll.values.payment_sum);
    });
    it('C2111951 player UAH ', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
      const hash = await partner.UrlSubPartner(cookie);
      const { cookie: cookieSubPartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'RUB', hash);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_UAH, 'UAH', promocode);
      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'RUB', 'UAH');
      await checkSubpartnerPayment(cookie, 'USD', 'RUB', statsAll.values.payment_sum);
    });
  });

  describe('Partner USD + subpartner USD', () => {
    it('C2111952 player RUB ', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
      const hash = await partner.UrlSubPartner(cookie);
      const { cookie: cookieSubPartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'USD', hash);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_RUB, 'RUB', promocode);
      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'USD', 'RUB');
      await checkSubpartnerPayment(cookie, 'USD', 'USD', statsAll.values.payment_sum);
    });
    it('C2111953 player USD ', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
      const hash = await partner.UrlSubPartner(cookie);
      const { cookie: cookieSubPartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'USD', hash);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_USD, 'USD', promocode);
      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'USD', 'USD');
      await checkSubpartnerPayment(cookie, 'USD', 'USD', statsAll.values.payment_sum);
    });
    it('C2111954 player EUR ', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
      const hash = await partner.UrlSubPartner(cookie);
      const { cookie: cookieSubPartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'USD', hash);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_EUR, 'EUR', promocode);
      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'USD', 'EUR');
      await checkSubpartnerPayment(cookie, 'USD', 'USD', statsAll.values.payment_sum);
    });
    it('C2111955 player UAH ', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
      const hash = await partner.UrlSubPartner(cookie);
      const { cookie: cookieSubPartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'USD', hash);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_UAH, 'UAH', promocode);
      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'USD', 'UAH');
      await checkSubpartnerPayment(cookie, 'USD', 'USD', statsAll.values.payment_sum);
    });
  });

  describe('Partner USD + subpartner EUR', () => {
    it('C2111956 player RUB ', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
      const hash = await partner.UrlSubPartner(cookie);
      const { cookie: cookieSubPartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'EUR', hash);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_RUB, 'RUB', promocode);
      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'EUR', 'RUB');
      await checkSubpartnerPayment(cookie, 'USD', 'EUR', statsAll.values.payment_sum);
    });
    it('C2111957 player USD ', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
      const hash = await partner.UrlSubPartner(cookie);
      const { cookie: cookieSubPartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'EUR', hash);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_USD, 'USD', promocode);
      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'EUR', 'USD');
      await checkSubpartnerPayment(cookie, 'USD', 'EUR', statsAll.values.payment_sum);
    });
    it('C2111958 player EUR ', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
      const hash = await partner.UrlSubPartner(cookie);
      const { cookie: cookieSubPartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'EUR', hash);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_EUR, 'EUR', promocode);
      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'EUR', 'EUR');
      await checkSubpartnerPayment(cookie, 'USD', 'EUR', statsAll.values.payment_sum);
    });
    it('C2111959 player UAH ', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
      const hash = await partner.UrlSubPartner(cookie);
      const { cookie: cookieSubPartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'EUR', hash);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_UAH, 'UAH', promocode);
      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'EUR', 'UAH');
      await checkSubpartnerPayment(cookie, 'USD', 'EUR', statsAll.values.payment_sum);
    });
  });

  describe('Partner EUR + subpartner RUB', () => {
    it('C2111960 player RUB ', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
      const hash = await partner.UrlSubPartner(cookie);
      const { cookie: cookieSubPartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'RUB', hash);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_RUB, 'RUB', promocode);
      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'RUB', 'RUB');
      await checkSubpartnerPayment(cookie, 'EUR', 'RUB', statsAll.values.payment_sum);
    });
    it('C2111961 player USD ', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
      const hash = await partner.UrlSubPartner(cookie);
      const { cookie: cookieSubPartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'RUB', hash);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_USD, 'USD', promocode);
      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'RUB', 'USD');
      await checkSubpartnerPayment(cookie, 'EUR', 'RUB', statsAll.values.payment_sum);
    });
    it('C2111962 player EUR ', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
      const hash = await partner.UrlSubPartner(cookie);
      const { cookie: cookieSubPartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'RUB', hash);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_EUR, 'EUR', promocode);
      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'RUB', 'EUR');
      await checkSubpartnerPayment(cookie, 'EUR', 'RUB', statsAll.values.payment_sum);
    });
    it('C2111963 player UAH ', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
      const hash = await partner.UrlSubPartner(cookie);
      const { cookie: cookieSubPartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'RUB', hash);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_UAH, 'UAH', promocode);
      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'RUB', 'UAH');
      await checkSubpartnerPayment(cookie, 'EUR', 'RUB', statsAll.values.payment_sum);
    });
  });

  describe('Partner EUR + subpartner USD', () => {
    it('C2111964 player RUB ', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
      const hash = await partner.UrlSubPartner(cookie);
      const { cookie: cookieSubPartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'USD', hash);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_RUB, 'RUB', promocode);
      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'USD', 'RUB');
      await checkSubpartnerPayment(cookie, 'EUR', 'USD', statsAll.values.payment_sum);
    });
    it('C2111965 player USD ', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
      const hash = await partner.UrlSubPartner(cookie);
      const { cookie: cookieSubPartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'USD', hash);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_USD, 'USD', promocode);
      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'USD', 'USD');
      await checkSubpartnerPayment(cookie, 'EUR', 'USD', statsAll.values.payment_sum);
    });
    it('C2111966 player EUR ', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
      const hash = await partner.UrlSubPartner(cookie);
      const { cookie: cookieSubPartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'USD', hash);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_EUR, 'EUR', promocode);
      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'USD', 'EUR');
      await checkSubpartnerPayment(cookie, 'EUR', 'USD', statsAll.values.payment_sum);
    });
    it('C2111967 player UAH ', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
      const hash = await partner.UrlSubPartner(cookie);
      const { cookie: cookieSubPartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'USD', hash);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_UAH, 'UAH', promocode);
      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'USD', 'UAH');
      await checkSubpartnerPayment(cookie, 'EUR', 'USD', statsAll.values.payment_sum);
    });
  });

  describe('Partner EUR + subpartner EUR', () => {
    it('C2111968 player RUB ', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
      const hash = await partner.UrlSubPartner(cookie);
      const { cookie: cookieSubPartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'EUR', hash);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_RUB, 'RUB', promocode);
      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'EUR', 'RUB');
      await checkSubpartnerPayment(cookie, 'EUR', 'EUR', statsAll.values.payment_sum);
    });
    it('C2111969 player USD ', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
      const hash = await partner.UrlSubPartner(cookie);
      const { cookie: cookieSubPartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'EUR', hash);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_USD, 'USD', promocode);
      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'EUR', 'USD');
      await checkSubpartnerPayment(cookie, 'EUR', 'EUR', statsAll.values.payment_sum);
    });
    it('C2111970 player EUR ', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
      const hash = await partner.UrlSubPartner(cookie);
      const { cookie: cookieSubPartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'EUR', hash);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_EUR, 'EUR', promocode);
      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'EUR', 'EUR');
      await checkSubpartnerPayment(cookie, 'EUR', 'EUR', statsAll.values.payment_sum);
    });
    it('C2111971 player UAH ', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
      const hash = await partner.UrlSubPartner(cookie);
      const { cookie: cookieSubPartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'EUR', hash);
      const { data: { id: promocodeId } } = await partner
        .createPromocode(cookieSubPartner, promocode);

      const { caseResults } = await regUsersAndPlayCases(1, 1, CASE_COST_UAH, 'UAH', promocode);
      const { data: statsAll } = await partner.getStatsAll(cookieSubPartner, promocodeId, undefined, 'payments_amount');
      // console.log(statsAll);
      const { data: statsDay } = await partner.getStatsDay(cookieSubPartner, new Date(), promocodeId, undefined, 'day_payments_amount');
      // console.log(statsDay);

      await checkPartnerPaymentCase(statsAll, statsDay.days[0], caseResults, 'EUR', 'UAH');
      await checkSubpartnerPayment(cookie, 'EUR', 'EUR', statsAll.values.payment_sum);
    });
  });
});
