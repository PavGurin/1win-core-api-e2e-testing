/**
 * @jest-environment node
 */
import { partner } from '../../../../src/methods/partner';
import { randomNum, randomStr } from '../../../../src/randomizer';
import { register } from '../../../../src/methods/register';
import { banking } from '../../../../src/methods/banking';
import { Refund } from '../../../../src/methods/BetsRefund';
import { sleep } from '../../../../src/methods/utils';
import {
  checkPartnerPaymentBets,
  checkPartnerPaymentCase,
  checkSubpartnerPayment,
  getCurrencyExchangeCoeff,
} from '../../../../src/expects/exPartner';
import { cases } from '../../../../src/methods/cases';
import { changeCurrency } from '../../../../src/methods/user';
import { mysqlConnection } from '../../../../src/methods/mysqlConnection';

// TODO тесты на ставки со всеми комбинациями валют, кейсы в другом файле

describe(' subpartner ', () => {
  const Money = 2000;
  const Bets_RUB = 2000;
  const Bets_USD = 2000;
  const Bets_EUR = 2000;
  const defaultPass = '123123AA';

  beforeAll(async () => {
    const dbResult = await mysqlConnection.executeQuery('DELETE FROM 1win.riskmanagement_ip_log;');
    // console.log(dbResult);
    await sleep(1500);
  });
  it('C1998168 - Partner RUB + subpartner RUB + Bet RUB', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const partnerEmail2 = `${randomStr(10)}@ahem.email`;
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
    const hash = await partner.UrlSubPartner(cookie);
    // console.log(hash);
    const { cookie: cookie2 } = await partner.registerRevshare(partnerEmail2, defaultPass, 'RUB', hash);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie2, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegWithPromocode(promocode, 'RUB');
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_RUB);
    // console.log(price)

    const { data: statsAll } = await partner.getStatsAll(cookie2, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie2, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_RUB - price], 'RUB', 'RUB');
    await checkSubpartnerPayment(cookie, 'RUB', 'RUB', statsAll.values.payment_sum);
  });
  it('C1998169 - Partner RUB + subpartner RUB + Bet USD ', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const partnerEmail2 = `${randomStr(10)}@ahem.email`;
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
    const hash = await partner.UrlSubPartner(cookie);
    // console.log(hash);
    const { cookie: cookie2 } = await partner.registerRevshare(partnerEmail2, defaultPass, 'RUB', hash);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie2, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegWithPromocode(promocode, 'USD');
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_USD);
    // console.log(price);

    const { data: statsAll } = await partner.getStatsAll(cookie2, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie2, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_USD - price], 'RUB', 'USD');
    await checkSubpartnerPayment(cookie, 'RUB', 'RUB', statsAll.values.payment_sum);
  });
  it('C2136053 - Partner RUB + subpartner USD + Bet RUB', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const partnerEmail2 = `${randomStr(10)}@ahem.email`;
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
    const hash = await partner.UrlSubPartner(cookie);
    // console.log(hash);
    const { cookie: cookie2 } = await partner.registerRevshare(partnerEmail2, defaultPass, 'USD', hash);
    // console.log(partnerEmail2, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie2, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegWithPromocode(promocode, 'RUB');
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_RUB);
    // console.log(price)

    const { data: statsAll } = await partner.getStatsAll(cookie2, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie2, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_RUB - price], 'USD', 'RUB');
    await checkSubpartnerPayment(cookie, 'RUB', 'USD', statsAll.values.payment_sum);
  });
  it('C2136054 - Partner RUB + subpartner USD + Bet USD', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const partnerEmail2 = `${randomStr(10)}@ahem.email`;
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
    const hash = await partner.UrlSubPartner(cookie);
    // console.log(hash);
    const { cookie: cookie2 } = await partner.registerRevshare(partnerEmail2, defaultPass, 'USD', hash);
    // console.log(partnerEmail2, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie2, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegWithPromocode(promocode, 'USD');
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_USD);
    // console.log(price)

    const { data: statsAll } = await partner.getStatsAll(cookie2, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie2, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_USD - price], 'USD', 'USD');
    await checkSubpartnerPayment(cookie, 'RUB', 'USD', statsAll.values.payment_sum);
  });
  it('C2136055 - Partner RUB + subpartner USD + Bet EUR', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const partnerEmail2 = `${randomStr(10)}@ahem.email`;
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
    const hash = await partner.UrlSubPartner(cookie);
    // console.log(hash);
    const { cookie: cookie2 } = await partner.registerRevshare(partnerEmail2, defaultPass, 'USD', hash);
    // console.log(partnerEmail2, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie2, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegWithPromocode(promocode, 'EUR');
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_EUR);
    // console.log(price)

    const { data: statsAll } = await partner.getStatsAll(cookie2, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie2, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_EUR - price], 'USD', 'EUR');
    await checkSubpartnerPayment(cookie, 'RUB', 'USD', statsAll.values.payment_sum);
  });
  it('C2136056 - Partner RUB + subpartner EUR + Bet RUB', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const partnerEmail2 = `${randomStr(10)}@ahem.email`;
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
    const hash = await partner.UrlSubPartner(cookie);
    // console.log(hash);
    const { cookie: cookie2 } = await partner.registerRevshare(partnerEmail2, defaultPass, 'EUR', hash);
    // console.log(partnerEmail2, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie2, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegWithPromocode(promocode, 'RUB');
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_RUB);
    // console.log(price)

    const { data: statsAll } = await partner.getStatsAll(cookie2, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie2, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_RUB - price], 'EUR', 'RUB');
    await checkSubpartnerPayment(cookie, 'RUB', 'EUR', statsAll.values.payment_sum);
  });

  it('C2136057 - Partner USD + subpartner RUB + Bet RUB', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const partnerEmail2 = `${randomStr(10)}@ahem.email`;
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
    const hash = await partner.UrlSubPartner(cookie);
    // console.log(hash);
    const { cookie: cookie2 } = await partner.registerRevshare(partnerEmail2, defaultPass, 'RUB', hash);
    // console.log(partnerEmail2, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie2, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegWithPromocode(promocode, 'RUB');
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_RUB);
    // console.log(price)

    const { data: statsAll } = await partner.getStatsAll(cookie2, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie2, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_RUB - price], 'RUB', 'RUB');
    await checkSubpartnerPayment(cookie, 'USD', 'RUB', statsAll.values.payment_sum);
  });
  it('C2136058 - Partner USD + subpartner RUB + Bet USD', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const partnerEmail2 = `${randomStr(10)}@ahem.email`;
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
    const hash = await partner.UrlSubPartner(cookie);
    // console.log(hash);
    const { cookie: cookie2 } = await partner.registerRevshare(partnerEmail2, defaultPass, 'RUB', hash);
    // console.log(partnerEmail2, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie2, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegWithPromocode(promocode, 'USD');
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_USD);
    // console.log(price)

    const { data: statsAll } = await partner.getStatsAll(cookie2, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie2, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_USD - price], 'RUB', 'USD');
    await checkSubpartnerPayment(cookie, 'USD', 'RUB', statsAll.values.payment_sum);
  });
  it('C2136059 - Partner USD + subpartner RUB + Bet EUR', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const partnerEmail2 = `${randomStr(10)}@ahem.email`;
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
    const hash = await partner.UrlSubPartner(cookie);
    // console.log(hash);
    const { cookie: cookie2 } = await partner.registerRevshare(partnerEmail2, defaultPass, 'RUB', hash);
    // console.log(partnerEmail2, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie2, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegWithPromocode(promocode, 'EUR');
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_EUR);
    // console.log(price)

    const { data: statsAll } = await partner.getStatsAll(cookie2, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie2, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_EUR - price], 'RUB', 'EUR');
    await checkSubpartnerPayment(cookie, 'USD', 'RUB', statsAll.values.payment_sum);
  });
  it('C2136060 - Partner USD + subpartner USD + Bet RUB', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const partnerEmail2 = `${randomStr(10)}@ahem.email`;
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
    const hash = await partner.UrlSubPartner(cookie);
    // console.log(hash);
    const { cookie: cookie2 } = await partner.registerRevshare(partnerEmail2, defaultPass, 'USD', hash);
    // console.log(partnerEmail2, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie2, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegWithPromocode(promocode, 'RUB');
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_RUB);
    // console.log(price)

    const { data: statsAll } = await partner.getStatsAll(cookie2, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie2, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_RUB - price], 'USD', 'RUB');
    await checkSubpartnerPayment(cookie, 'USD', 'USD', statsAll.values.payment_sum);
  });
  it('C2136061 - Partner USD + subpartner USD + Bet USD', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const partnerEmail2 = `${randomStr(10)}@ahem.email`;
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
    const hash = await partner.UrlSubPartner(cookie);
    // console.log(hash);
    const { cookie: cookie2 } = await partner.registerRevshare(partnerEmail2, defaultPass, 'USD', hash);
    // console.log(partnerEmail2, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie2, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegWithPromocode(promocode, 'USD');
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_USD);
    // console.log(price)

    const { data: statsAll } = await partner.getStatsAll(cookie2, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie2, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_USD - price], 'USD', 'USD');
    await checkSubpartnerPayment(cookie, 'USD', 'USD', statsAll.values.payment_sum);
  });
  it('C2136062 - Partner USD + subpartner USD + Bet EUR', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const partnerEmail2 = `${randomStr(10)}@ahem.email`;
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
    const hash = await partner.UrlSubPartner(cookie);
    // console.log(hash);
    const { cookie: cookie2 } = await partner.registerRevshare(partnerEmail2, defaultPass, 'USD', hash);
    // console.log(partnerEmail2, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie2, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegWithPromocode(promocode, 'EUR');
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_EUR);
    // console.log(price)

    const { data: statsAll } = await partner.getStatsAll(cookie2, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie2, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_EUR - price], 'USD', 'EUR');
    await checkSubpartnerPayment(cookie, 'USD', 'USD', statsAll.values.payment_sum);
  });
  it('C2136063 - Partner USD + subpartner EUR + Bet USD', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const partnerEmail2 = `${randomStr(10)}@ahem.email`;
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
    const hash = await partner.UrlSubPartner(cookie);
    // console.log(hash);
    const { cookie: cookie2 } = await partner.registerRevshare(partnerEmail2, defaultPass, 'EUR', hash);
    // console.log(partnerEmail2, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie2, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegWithPromocode(promocode, 'USD');
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_USD);
    // console.log(price)

    const { data: statsAll } = await partner.getStatsAll(cookie2, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie2, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_USD - price], 'EUR', 'USD');
    await checkSubpartnerPayment(cookie, 'USD', 'EUR', statsAll.values.payment_sum);
  });

  it('C2136064 - Partner EUR + subpartner RUB + Bet RUB', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const partnerEmail2 = `${randomStr(10)}@ahem.email`;
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
    const hash = await partner.UrlSubPartner(cookie);
    // console.log(hash);
    const { cookie: cookie2 } = await partner.registerRevshare(partnerEmail2, defaultPass, 'RUB', hash);
    // console.log(partnerEmail2, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie2, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegWithPromocode(promocode, 'RUB');
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_RUB);
    // console.log(price)

    const { data: statsAll } = await partner.getStatsAll(cookie2, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie2, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_RUB - price], 'RUB', 'RUB');
    await checkSubpartnerPayment(cookie, 'EUR', 'RUB', statsAll.values.payment_sum);
  });
  it('C2136065 - Partner EUR + subpartner RUB + Bet USD', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const partnerEmail2 = `${randomStr(10)}@ahem.email`;
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
    const hash = await partner.UrlSubPartner(cookie);
    // console.log(hash);
    const { cookie: cookie2 } = await partner.registerRevshare(partnerEmail2, defaultPass, 'RUB', hash);
    // console.log(partnerEmail2, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie2, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegWithPromocode(promocode, 'USD');
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_EUR);
    // console.log(price)

    const { data: statsAll } = await partner.getStatsAll(cookie2, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie2, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_EUR - price], 'RUB', 'USD');
    await checkSubpartnerPayment(cookie, 'EUR', 'RUB', statsAll.values.payment_sum);
  });
  it('C2136066 - Partner EUR + subpartner RUB + Bet EUR', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const partnerEmail2 = `${randomStr(10)}@ahem.email`;
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
    const hash = await partner.UrlSubPartner(cookie);
    // console.log(hash);
    const { cookie: cookie2 } = await partner.registerRevshare(partnerEmail2, defaultPass, 'RUB', hash);
    // console.log(partnerEmail2, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie2, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegWithPromocode(promocode, 'EUR');
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_EUR);
    // console.log(price)

    const { data: statsAll } = await partner.getStatsAll(cookie2, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie2, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_EUR - price], 'RUB', 'EUR');
    await checkSubpartnerPayment(cookie, 'EUR', 'RUB', statsAll.values.payment_sum);
  });
  it('C2136067 - Partner EUR + subpartner USD + Bet RUB', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const partnerEmail2 = `${randomStr(10)}@ahem.email`;
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
    const hash = await partner.UrlSubPartner(cookie);
    // console.log(hash);
    const { cookie: cookie2 } = await partner.registerRevshare(partnerEmail2, defaultPass, 'USD', hash);
    // console.log(partnerEmail2, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie2, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegWithPromocode(promocode, 'RUB');
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_RUB);
    // console.log(price)

    const { data: statsAll } = await partner.getStatsAll(cookie2, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie2, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_RUB - price], 'USD', 'RUB');
    await checkSubpartnerPayment(cookie, 'EUR', 'USD', statsAll.values.payment_sum);
  });
  it('C2136068 - Partner EUR + subpartner USD + Bet USD', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const partnerEmail2 = `${randomStr(10)}@ahem.email`;
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
    const hash = await partner.UrlSubPartner(cookie);
    // console.log(hash);
    const { cookie: cookie2 } = await partner.registerRevshare(partnerEmail2, defaultPass, 'USD', hash);
    // console.log(partnerEmail2, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie2, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegWithPromocode(promocode, 'USD');
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_USD);
    // console.log(price)

    const { data: statsAll } = await partner.getStatsAll(cookie2, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie2, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_USD - price], 'USD', 'USD');
    await checkSubpartnerPayment(cookie, 'EUR', 'USD', statsAll.values.payment_sum);
  });
  it('C2136069 - Partner EUR + subpartner USD + Bet EUR', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const partnerEmail2 = `${randomStr(10)}@ahem.email`;
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
    const hash = await partner.UrlSubPartner(cookie);
    // console.log(hash);
    const { cookie: cookie2 } = await partner.registerRevshare(partnerEmail2, defaultPass, 'USD', hash);
    // console.log(partnerEmail2, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie2, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegWithPromocode(promocode, 'EUR');
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_EUR);
    // console.log(price)

    const { data: statsAll } = await partner.getStatsAll(cookie2, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie2, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_EUR - price], 'USD', 'EUR');
    await checkSubpartnerPayment(cookie, 'EUR', 'USD', statsAll.values.payment_sum);
  });
  it('C2136070 - Partner EUR + subpartner EUR + Bet EUR', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const partnerEmail2 = `${randomStr(10)}@ahem.email`;
    const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
    const hash = await partner.UrlSubPartner(cookie);
    // console.log(hash);
    const { cookie: cookie2 } = await partner.registerRevshare(partnerEmail2, defaultPass, 'EUR');
    // console.log(partnerEmail2, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie2, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegWithPromocode(promocode, 'EUR');
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_EUR);
    // console.log(price)

    const { data: statsAll } = await partner.getStatsAll(cookie2, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie2, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_EUR - price], 'EUR', 'EUR');
    await checkSubpartnerPayment(cookie, 'EUR', 'EUR', statsAll.values.payment_sum);
  });
});
