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

// TODO тесты на ставки со всеми комбинациями валют, кейсы в другом файле

describe(' Subpartner ', () => {
  const Money = 2000;
  const Bets_RUB = 2000;
  const Bets_USD = 2000;
  const Bets_EUR = 2000;
  const defaultPass = '123123AA';
  it('C1998168 - Partner RUB + Subpartner RUB + Bet RUB', async () => {
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
  it('C1998169 - Partner RUB + Subpartner RUB + Bet USD ', async () => {
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
  it('C2136053 - Partner RUB + Subpartner USD + Bet RUB', async () => {
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
  it('C2136054 - Partner RUB + Subpartner USD + Bet USD', async () => {
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
  it('C2136055 - Partner RUB + Subpartner USD + Bet EUR', async () => {
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
  it('C2136056 - Partner RUB + Subpartner EUR + Bet RUB', async () => {
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

  it('C2136057 - Partner USD + Subpartner RUB + Bet RUB', async () => {
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
  it('C2136058 - Partner USD + Subpartner RUB + Bet USD', async () => {
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
  it('C2136059 - Partner USD + Subpartner RUB + Bet EUR', async () => {
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
  it('C2136060 - Partner USD + Subpartner USD + Bet RUB', async () => {
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
  it('C2136061 - Partner USD + Subpartner USD + Bet USD', async () => {
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
  it('C2136062 - Partner USD + Subpartner USD + Bet EUR', async () => {
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
  it('C2136063 - Partner USD + Subpartner EUR + Bet USD', async () => {
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

  it('C2136064 - Partner EUR + Subpartner RUB + Bet RUB', async () => {
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
  it('C2136065 - Partner EUR + Subpartner RUB + Bet USD', async () => {
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
  it('C2136066 - Partner EUR + Subpartner RUB + Bet EUR', async () => {
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
  it('C2136067 - Partner EUR + Subpartner USD + Bet RUB', async () => {
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
  it('C2136068 - Partner EUR + Subpartner USD + Bet USD', async () => {
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
  it('C2136069 - Partner EUR + Subpartner USD + Bet EUR', async () => {
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
  it('C2136070 - Partner EUR + Subpartner EUR + Bet EUR', async () => {
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
