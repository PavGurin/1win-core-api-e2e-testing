/**
 * @jest-environment node
 */
import { partner } from '../../../../src/methods/partner';
import { randomNum, randomStr } from '../../../../src/randomizer';
import { checkPartnerPaymentBets } from '../../../../src/expects/exPartner';
import { sleep } from '../../../../src/methods/utils';
import { mysqlConnection } from '../../../../src/methods/mysqlConnection';
import { regUsersAndSellBetsExpress, regUsersAndSellBetsOrdinary } from '../../../../src/methods/regUsersForPartner';

const defaultPass = '123123AA';

describe('One click registration with promocode + play bets and sale bets ', () => {
  const Bets_RUB = 1000;
  const Bets_USD = 2000;
  const Bets_EUR = 2000;
  const Bets_UAH = 2000;
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
  });

  it('C1914718 - RUB partner + RUB ordinary bets', async () => {
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { betResults } = await regUsersAndSellBetsOrdinary(1, 1, Bets_RUB, 'RUB', promocode);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], betResults, 'RUB', 'RUB');
  });
  it('C1914719 - RUB partner + USD ordinary bets', async () => {
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { betResults } = await regUsersAndSellBetsOrdinary(1, 1, Bets_USD, 'USD', promocode);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], betResults, 'RUB', 'USD');
  });
  it('C1914720 - RUB partner + EUR ordinary bets', async () => {
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { betResults } = await regUsersAndSellBetsOrdinary(1, 1, Bets_EUR, 'EUR', promocode);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], betResults, 'RUB', 'EUR');
  });
  it('C1914721 - RUB partner + UAH ordinary bets', async () => {
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { betResults } = await regUsersAndSellBetsOrdinary(1, 1, Bets_UAH, 'UAH', promocode);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], betResults, 'RUB', 'UAH');
  });
  it('C1914722 - RUB partner + RUB express bets', async () => {
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { betResults } = await regUsersAndSellBetsExpress(1, 1, Bets_RUB, 'RUb', promocode);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], betResults, 'RUB', 'RUB');
  });
  it('C1914723 - RUB partner + USD express bets', async () => {
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { betResults } = await regUsersAndSellBetsExpress(1, 1, Bets_USD, 'USD', promocode);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], betResults, 'RUB', 'USD');
  });
  it('C1914724 - RUB partner + EUR express bets', async () => {
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { betResults } = await regUsersAndSellBetsExpress(1, 1, Bets_EUR, 'EUR', promocode);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], betResults, 'RUB', 'EUR');
  });
  it('C1914725 - RUB partner + UAH express bets', async () => {
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { betResults } = await regUsersAndSellBetsExpress(1, 1, Bets_UAH, 'UAH', promocode);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], betResults, 'RUB', 'UAH');
  });
  it('C1914726 - USD partner + RUB ordinary bets', async () => {
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { betResults } = await regUsersAndSellBetsOrdinary(1, 1, Bets_RUB, 'RUB', promocode);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], betResults, 'USD', 'RUB');
  });
  it('C1914727 - USD partner + USD ordinary bets', async () => {
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { betResults } = await regUsersAndSellBetsOrdinary(1, 1, Bets_USD, 'USD', promocode);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], betResults, 'USD', 'USD');
  });
  it('C1914728 - USD partner + EUR ordinary bets', async () => {
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { betResults } = await regUsersAndSellBetsOrdinary(1, 1, Bets_EUR, 'EUR', promocode);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], betResults, 'USD', 'EUR');
  });
  it('C1914729 - USD partner + UAH ordinary bets', async () => {
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { betResults } = await regUsersAndSellBetsOrdinary(1, 1, Bets_UAH, 'UAH', promocode);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], betResults, 'USD', 'UAH');
  });
  it('C1914730 - EUR partner + RUB ordinary bets', async () => {
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { betResults } = await regUsersAndSellBetsOrdinary(1, 1, Bets_RUB, 'RUB', promocode);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], betResults, 'EUR', 'RUB');
  });
  it('C1914731 - EUR partner + USD ordinary bets', async () => {
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { betResults } = await regUsersAndSellBetsOrdinary(1, 1, Bets_USD, 'USD', promocode);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], betResults, 'EUR', 'USD');
  });
  it('C1914732 - EUR partner + EUR ordinary bets', async () => {
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { betResults } = await regUsersAndSellBetsOrdinary(1, 1, Bets_EUR, 'EUR', promocode);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], betResults, 'EUR', 'EUR');
  });
  it('C1914733 - EUR partner + UAH ordinary bets', async () => {
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { betResults } = await regUsersAndSellBetsOrdinary(1, 1, Bets_UAH, 'UAH', promocode);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], betResults, 'EUR', 'UAH');
  });
  it('C1914734 - USD partner + RUB express bets', async () => {
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { betResults } = await regUsersAndSellBetsExpress(1, 1, Bets_RUB, 'RUB', promocode);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], betResults, 'USD', 'RUB');
  });
  it('C1914735 - USD partner + USD express bets', async () => {
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { betResults } = await regUsersAndSellBetsExpress(1, 1, Bets_USD, 'USD', promocode);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], betResults, 'USD', 'USD');
  });
  it('C1914736 - USD partner + EUR express bets', async () => {
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { betResults } = await regUsersAndSellBetsExpress(1, 1, Bets_EUR, 'EUR', promocode);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], betResults, 'USD', 'EUR');
  });
  it('C1914737 - USD partner + UAH express bets', async () => {
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { betResults } = await regUsersAndSellBetsExpress(1, 1, Bets_UAH, 'UAH', promocode);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], betResults, 'USD', 'UAH');
  });
  it('C1914738 - EUR partner + RUB express bets', async () => {
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { betResults } = await regUsersAndSellBetsExpress(1, 1, Bets_RUB, 'RUB', promocode);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], betResults, 'EUR', 'RUB');
  });
  it('C1914739 - EUR partner + USD express bets', async () => {
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { betResults } = await regUsersAndSellBetsExpress(1, 1, Bets_USD, 'USD', promocode);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], betResults, 'EUR', 'USD');
  });
  it('C1914740 - EUR partner + EUR express bets', async () => {
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { betResults } = await regUsersAndSellBetsExpress(1, 1, Bets_EUR, 'EUR', promocode);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], betResults, 'EUR', 'EUR');
  });
  it('C1914741 - EUR partner + UAH express bets', async () => {
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { betResults } = await regUsersAndSellBetsExpress(1, 1, Bets_UAH, 'UAH', promocode);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], betResults, 'EUR', 'UAH');
  });
});
