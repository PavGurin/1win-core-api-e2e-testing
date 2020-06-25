/**
 * @jest-environment node
 */
import { partner } from '../../../../src/methods/partner';
import { randomNum, randomStr } from '../../../../src/randomizer';
import { sleep } from '../../../../src/methods/utils';
import {
  checkPartnerPaymentBets,
  checkSubpartnerPayment,
} from '../../../../src/expects/exPartner';
import { mysqlConnection } from '../../../../src/methods/mysqlConnection';
import { regUsersAndSellBetsOrdinary } from '../../../../src/methods/regUsersForPartner';

// TODO тесты на ставки со всеми комбинациями валют, кейсы в другом файле

describe('subpartner bets tests', () => {
  const Bets_RUB = 2000;
  const Bets_USD = 2000;
  const Bets_EUR = 2000;
  const defaultPass = '123123AA';
  let promocode;
  let partnerEmail;
  let subpartnerEmail;

  beforeAll(async () => {
    const dbResult = await mysqlConnection.executeQuery('DELETE FROM 1win.riskmanagement_ip_log;');
    // console.log(dbResult);
    await sleep(1500);
  });

  beforeEach(async () => {
    promocode = randomNum(10).toString();
    partnerEmail = `${randomStr(10)}@ahem.email`;
    subpartnerEmail = `${randomStr(10)}@ahem.email`;
  });

  it('C1998168 - Partner RUB + subpartner RUB + Bet RUB', async () => {
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
    const hash = await partner.UrlSubPartner(cookie);
    const { cookie: cookieSubpartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'RUB', hash);
    const { data: { id: promocodeId } } = await partner
      .createPromocode(cookieSubpartner, promocode);
    // console.log(promocodeId);
    const { betResults } = await regUsersAndSellBetsOrdinary(1, 1, Bets_RUB, 'RUB', promocode);

    const { data: statsAll } = await partner.getStatsAll(cookieSubpartner, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookieSubpartner, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], betResults, 'RUB', 'RUB');
    await checkSubpartnerPayment(cookie, 'RUB', 'RUB', statsAll.values.payment_sum);
  });
  it('C1998169 - Partner RUB + subpartner RUB + Bet USD ', async () => {
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
    const hash = await partner.UrlSubPartner(cookie);
    const { cookie: cookieSubpartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'RUB', hash);
    const { data: { id: promocodeId } } = await partner
      .createPromocode(cookieSubpartner, promocode);
    // console.log(promocodeId);
    const { betResults } = await regUsersAndSellBetsOrdinary(1, 1, Bets_USD, 'USD', promocode);

    const { data: statsAll } = await partner.getStatsAll(cookieSubpartner, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookieSubpartner, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], betResults, 'RUB', 'USD');
    await checkSubpartnerPayment(cookie, 'RUB', 'RUB', statsAll.values.payment_sum);
  });
  it('C2136053 - Partner RUB + subpartner USD + Bet RUB', async () => {
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
    const hash = await partner.UrlSubPartner(cookie);
    const { cookie: cookieSubpartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'USD', hash);
    // console.log(subpartnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner
      .createPromocode(cookieSubpartner, promocode);
    // console.log(promocodeId);
    const { betResults } = await regUsersAndSellBetsOrdinary(1, 1, Bets_RUB, 'RUB', promocode);

    const { data: statsAll } = await partner.getStatsAll(cookieSubpartner, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookieSubpartner, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], betResults, 'USD', 'RUB');
    await checkSubpartnerPayment(cookie, 'RUB', 'USD', statsAll.values.payment_sum);
  });
  it('C2136054 - Partner RUB + subpartner USD + Bet USD', async () => {
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
    const hash = await partner.UrlSubPartner(cookie);
    const { cookie: cookieSubpartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'USD', hash);
    // console.log(subpartnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner
      .createPromocode(cookieSubpartner, promocode);
    // console.log(promocodeId);
    const { betResults } = await regUsersAndSellBetsOrdinary(1, 1, Bets_USD, 'USD', promocode);

    const { data: statsAll } = await partner.getStatsAll(cookieSubpartner, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookieSubpartner, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], betResults, 'USD', 'USD');
    await checkSubpartnerPayment(cookie, 'RUB', 'USD', statsAll.values.payment_sum);
  });
  it('C2136055 - Partner RUB + subpartner USD + Bet EUR', async () => {
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
    const hash = await partner.UrlSubPartner(cookie);
    const { cookie: cookieSubpartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'USD', hash);
    // console.log(subpartnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner
      .createPromocode(cookieSubpartner, promocode);
    // console.log(promocodeId);
    const { betResults } = await regUsersAndSellBetsOrdinary(1, 1, Bets_EUR, 'EUR', promocode);

    const { data: statsAll } = await partner.getStatsAll(cookieSubpartner, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookieSubpartner, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], betResults, 'USD', 'EUR');
    await checkSubpartnerPayment(cookie, 'RUB', 'USD', statsAll.values.payment_sum);
  });
  it('C2136056 - Partner RUB + subpartner EUR + Bet RUB', async () => {
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
    const hash = await partner.UrlSubPartner(cookie);
    const { cookie: cookieSubpartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'EUR', hash);
    // console.log(subpartnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner
      .createPromocode(cookieSubpartner, promocode);
    // console.log(promocodeId);
    const { betResults } = await regUsersAndSellBetsOrdinary(1, 1, Bets_RUB, 'RUB', promocode);

    const { data: statsAll } = await partner.getStatsAll(cookieSubpartner, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookieSubpartner, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], betResults, 'EUR', 'RUB');
    await checkSubpartnerPayment(cookie, 'RUB', 'EUR', statsAll.values.payment_sum);
  });

  it('C2136057 - Partner USD + subpartner RUB + Bet RUB', async () => {
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
    const hash = await partner.UrlSubPartner(cookie);
    const { cookie: cookieSubpartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'RUB', hash);
    // console.log(subpartnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner
      .createPromocode(cookieSubpartner, promocode);
    // console.log(promocodeId);
    const { betResults } = await regUsersAndSellBetsOrdinary(1, 1, Bets_RUB, 'RUB', promocode);

    const { data: statsAll } = await partner.getStatsAll(cookieSubpartner, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookieSubpartner, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], betResults, 'RUB', 'RUB');
    await checkSubpartnerPayment(cookie, 'USD', 'RUB', statsAll.values.payment_sum);
  });
  it('C2136058 - Partner USD + subpartner RUB + Bet USD', async () => {
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
    const hash = await partner.UrlSubPartner(cookie);
    const { cookie: cookieSubpartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'RUB', hash);
    // console.log(subpartnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner
      .createPromocode(cookieSubpartner, promocode);
    // console.log(promocodeId);
    const { betResults } = await regUsersAndSellBetsOrdinary(1, 1, Bets_USD, 'USD', promocode);

    const { data: statsAll } = await partner.getStatsAll(cookieSubpartner, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookieSubpartner, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], betResults, 'RUB', 'USD');
    await checkSubpartnerPayment(cookie, 'USD', 'RUB', statsAll.values.payment_sum);
  });
  it('C2136059 - Partner USD + subpartner RUB + Bet EUR', async () => {
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
    const hash = await partner.UrlSubPartner(cookie);
    const { cookie: cookieSubpartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'RUB', hash);
    // console.log(subpartnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner
      .createPromocode(cookieSubpartner, promocode);
    // console.log(promocodeId);
    const { betResults } = await regUsersAndSellBetsOrdinary(1, 1, Bets_EUR, 'EUR', promocode);

    const { data: statsAll } = await partner.getStatsAll(cookieSubpartner, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookieSubpartner, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], betResults, 'RUB', 'EUR');
    await checkSubpartnerPayment(cookie, 'USD', 'RUB', statsAll.values.payment_sum);
  });
  it('C2136060 - Partner USD + subpartner USD + Bet RUB', async () => {
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
    const hash = await partner.UrlSubPartner(cookie);
    const { cookie: cookieSubpartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'USD', hash);
    // console.log(subpartnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner
      .createPromocode(cookieSubpartner, promocode);
    // console.log(promocodeId);
    const { betResults } = await regUsersAndSellBetsOrdinary(1, 1, Bets_RUB, 'RUB', promocode);

    const { data: statsAll } = await partner.getStatsAll(cookieSubpartner, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookieSubpartner, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], betResults, 'USD', 'RUB');
    await checkSubpartnerPayment(cookie, 'USD', 'USD', statsAll.values.payment_sum);
  });
  it('C2136061 - Partner USD + subpartner USD + Bet USD', async () => {
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
    const hash = await partner.UrlSubPartner(cookie);
    const { cookie: cookieSubpartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'USD', hash);
    // console.log(subpartnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner
      .createPromocode(cookieSubpartner, promocode);
    // console.log(promocodeId);
    const { betResults } = await regUsersAndSellBetsOrdinary(1, 1, Bets_USD, 'USD', promocode);

    const { data: statsAll } = await partner.getStatsAll(cookieSubpartner, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookieSubpartner, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], betResults, 'USD', 'USD');
    await checkSubpartnerPayment(cookie, 'USD', 'USD', statsAll.values.payment_sum);
  });
  it('C2136062 - Partner USD + subpartner USD + Bet EUR', async () => {
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
    const hash = await partner.UrlSubPartner(cookie);
    const { cookie: cookieSubpartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'USD', hash);
    // console.log(subpartnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner
      .createPromocode(cookieSubpartner, promocode);
    // console.log(promocodeId);
    const { betResults } = await regUsersAndSellBetsOrdinary(1, 1, Bets_EUR, 'EUR', promocode);

    const { data: statsAll } = await partner.getStatsAll(cookieSubpartner, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookieSubpartner, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], betResults, 'USD', 'EUR');
    await checkSubpartnerPayment(cookie, 'USD', 'USD', statsAll.values.payment_sum);
  });
  it('C2136063 - Partner USD + subpartner EUR + Bet USD', async () => {
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
    const hash = await partner.UrlSubPartner(cookie);
    const { cookie: cookieSubpartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'EUR', hash);
    // console.log(subpartnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner
      .createPromocode(cookieSubpartner, promocode);
    // console.log(promocodeId);
    const { betResults } = await regUsersAndSellBetsOrdinary(1, 1, Bets_USD, 'USD', promocode);

    const { data: statsAll } = await partner.getStatsAll(cookieSubpartner, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookieSubpartner, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], betResults, 'EUR', 'USD');
    await checkSubpartnerPayment(cookie, 'USD', 'EUR', statsAll.values.payment_sum);
  });

  it('C2136064 - Partner EUR + subpartner RUB + Bet RUB', async () => {
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
    const hash = await partner.UrlSubPartner(cookie);
    const { cookie: cookieSubpartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'RUB', hash);
    // console.log(subpartnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner
      .createPromocode(cookieSubpartner, promocode);
    // console.log(promocodeId);
    const { betResults } = await regUsersAndSellBetsOrdinary(1, 1, Bets_RUB, 'RUB', promocode);

    const { data: statsAll } = await partner.getStatsAll(cookieSubpartner, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookieSubpartner, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], betResults, 'RUB', 'RUB');
    await checkSubpartnerPayment(cookie, 'EUR', 'RUB', statsAll.values.payment_sum);
  });
  it('C2136065 - Partner EUR + subpartner RUB + Bet USD', async () => {
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
    const hash = await partner.UrlSubPartner(cookie);
    const { cookie: cookieSubpartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'RUB', hash);
    // console.log(subpartnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner
      .createPromocode(cookieSubpartner, promocode);
    // console.log(promocodeId);
    const { betResults } = await regUsersAndSellBetsOrdinary(1, 1, Bets_USD, 'USD', promocode);

    const { data: statsAll } = await partner.getStatsAll(cookieSubpartner, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookieSubpartner, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], betResults, 'RUB', 'USD');
    await checkSubpartnerPayment(cookie, 'EUR', 'RUB', statsAll.values.payment_sum);
  });
  it('C2136066 - Partner EUR + subpartner RUB + Bet EUR', async () => {
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
    const hash = await partner.UrlSubPartner(cookie);
    const { cookie: cookieSubpartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'RUB', hash);
    // console.log(subpartnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner
      .createPromocode(cookieSubpartner, promocode);
    // console.log(promocodeId);
    const { betResults } = await regUsersAndSellBetsOrdinary(1, 1, Bets_EUR, 'EUR', promocode);

    const { data: statsAll } = await partner.getStatsAll(cookieSubpartner, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookieSubpartner, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], betResults, 'RUB', 'EUR');
    await checkSubpartnerPayment(cookie, 'EUR', 'RUB', statsAll.values.payment_sum);
  });
  it('C2136067 - Partner EUR + subpartner USD + Bet RUB', async () => {
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
    const hash = await partner.UrlSubPartner(cookie);
    const { cookie: cookieSubpartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'USD', hash);
    // console.log(subpartnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner
      .createPromocode(cookieSubpartner, promocode);
    // console.log(promocodeId);
    const { betResults } = await regUsersAndSellBetsOrdinary(1, 1, Bets_RUB, 'RUB', promocode);

    const { data: statsAll } = await partner.getStatsAll(cookieSubpartner, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookieSubpartner, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], betResults, 'USD', 'RUB');
    await checkSubpartnerPayment(cookie, 'EUR', 'USD', statsAll.values.payment_sum);
  });
  it('C2136068 - Partner EUR + subpartner USD + Bet USD', async () => {
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
    const hash = await partner.UrlSubPartner(cookie);
    const { cookie: cookieSubpartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'USD', hash);
    // console.log(subpartnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner
      .createPromocode(cookieSubpartner, promocode);
    // console.log(promocodeId);
    const { betResults } = await regUsersAndSellBetsOrdinary(1, 1, Bets_USD, 'USD', promocode);

    const { data: statsAll } = await partner.getStatsAll(cookieSubpartner, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookieSubpartner, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], betResults, 'USD', 'USD');
    await checkSubpartnerPayment(cookie, 'EUR', 'USD', statsAll.values.payment_sum);
  });
  it('C2136069 - Partner EUR + subpartner USD + Bet EUR', async () => {
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
    const hash = await partner.UrlSubPartner(cookie);
    const { cookie: cookieSubpartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'USD', hash);
    // console.log(subpartnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner
      .createPromocode(cookieSubpartner, promocode);
    // console.log(promocodeId);
    const { betResults } = await regUsersAndSellBetsOrdinary(1, 1, Bets_EUR, 'EUR', promocode);

    const { data: statsAll } = await partner.getStatsAll(cookieSubpartner, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookieSubpartner, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], betResults, 'USD', 'EUR');
    await checkSubpartnerPayment(cookie, 'EUR', 'USD', statsAll.values.payment_sum);
  });
  it('C2136070 - Partner EUR + subpartner EUR + Bet EUR', async () => {
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
    const hash = await partner.UrlSubPartner(cookie);
    const { cookie: cookieSubpartner } = await partner.registerRevshare(subpartnerEmail, defaultPass, 'EUR', hash);
    // console.log(subpartnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner
      .createPromocode(cookieSubpartner, promocode);
    // console.log(promocodeId);
    const { betResults } = await regUsersAndSellBetsOrdinary(1, 1, Bets_EUR, 'EUR', promocode);

    const { data: statsAll } = await partner.getStatsAll(cookieSubpartner, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookieSubpartner, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], betResults, 'EUR', 'EUR');
    await checkSubpartnerPayment(cookie, 'EUR', 'EUR', statsAll.values.payment_sum);
  });
});
