/**
 * @jest-environment node
 */
import { partner } from '../../../src/methods/partner';
import { randomNum, randomStr } from '../../../src/randomizer';
import { register } from '../../../src/methods/register';
import { banking } from '../../../src/methods/banking';
import { Refund } from '../../../src/methods/BetsRefund';
import { sleep } from '../../../src/methods/utils';
import { checkPartnerPaymentBets, checkPartnerPaymentCase, getCoeffForPayment } from '../../../src/expects/exPartner';
import { cases } from '../../../src/methods/cases';
import { changeCurrency } from '../../../src/methods/user';

describe(' Subpartner ', () => {
  const Money = 2000;
  const Bets_RUB = 2000;
  const Bets_USD = 2000;
  const Bets_EUR = 2000;
  const CASE_COST_EUR = 10;
  const TEN_EUR_CASE_ID = 21;
  // const promocode = randomNum(10).toString();
  const defaultPass = '123123AA';
  const FIVE_HUNDRED_UAH_CASE_ID = 31;
  const CASE_COST_UAH = 500;
  it('C1998168 - Субпартнер + партнер + ставка RUB', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const partnerEmail2 = `${randomStr(10)}@ahem.email`;
    await partner.register(partnerEmail, defaultPass, 'RUB');
    // console.log(partnerEmail, defaultPass);
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const hash = await partner.UrlSubPartner(cookie);
    // console.log(hash);
    await partner.register(partnerEmail2, defaultPass, 'RUB', hash);
    // console.log(hash);
    const { cookie: cookie2 } = await partner.login(partnerEmail2, defaultPass);
    // console.log(partnerEmail2, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie2, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegRubWithPromocode(promocode);
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_RUB);
    // console.log(price)
    await sleep(2000);
    const { data: statsAll } = await partner.getStatsAll(cookie2, promocodeId);
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie2, new Date(), promocodeId);
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_RUB - price], 'RUB', 'RUB');
    const { data: { partners: [p0] } } = await partner.getStatsSubpartner(cookie);
    const Myincome = (p0.webmasterSum).toFixed(2);
    const Partnerincome = (p0.partnerSum * 0.05).toFixed(2);
    expect(Myincome).toEqual(Partnerincome);
  });
  it('C1998169 - Субпартнер + партнер + ставка USD ', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const partnerEmail2 = `${randomStr(10)}@ahem.email`;
    await partner.register(partnerEmail, defaultPass, 'RUB');
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const hash = await partner.UrlSubPartner(cookie);
    // console.log(hash);
    await partner.register(partnerEmail2, defaultPass, 'RUB', hash);
    const { cookie: cookie2 } = await partner.login(partnerEmail2, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie2, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegUsdWithPromocode(promocode);
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_USD);
    // console.log(price);
    await sleep(1000);
    const { data: statsAll } = await partner.getStatsAll(cookie2, promocodeId);
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie2, new Date(), promocodeId);
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_USD - price], 'RUB', 'USD');
    const { data: { partners: [p0] } } = await partner.getStatsSubpartner(cookie);
    const Myincome = (p0.webmasterSum).toFixed(2);
    const Partnerincome = (p0.partnerSum * 0.05).toFixed(2);
    expect(Myincome).toEqual(Partnerincome);
  });
  it('C1998170 - Субпартнер + партнер + кейс EUR ', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const partnerEmail2 = `${randomStr(10)}@ahem.email`;
    await partner.register(partnerEmail, defaultPass, 'RUB');
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const hash = await partner.UrlSubPartner(cookie);
    // console.log(hash);
    await partner.register(partnerEmail2, defaultPass, 'RUB', hash);
    const { cookie: cookie2 } = await partner.login(partnerEmail2, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie2, promocode);
    // console.log(promocode);
    const { data: user } = await register.oneClickRegEurWithPromocode(promocode);
    // console.log(user);
    await banking.setBalance(user.id, CASE_COST_EUR);
    const { data: caseWin } = await cases.playCaseWithoutChance(TEN_EUR_CASE_ID);
    // console.log(caseWin);
    await sleep(1000);
    const { data: statsAll } = await partner.getStatsAll(cookie2, promocodeId);
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie2, new Date(), promocodeId);
    // console.log(statsDay);
    await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{
      caseCost: CASE_COST_EUR,
      profit: caseWin.result,
    }], 'RUB', 'EUR');
    const { data: { partners: [p0] } } = await partner.getStatsSubpartner(cookie);
    const Myincome = (p0.webmasterSum).toFixed(2);
    const Partnerincome = (p0.partnerSum * 0.05).toFixed(2);
    expect(Myincome).toEqual(Partnerincome);
  });
  it('C1998171 - Субпартнер + партнер + кейс UAH', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const partnerEmail2 = `${randomStr(10)}@ahem.email`;
    await partner.register(partnerEmail, defaultPass, 'RUB');
    // console.log(partnerEmail, defaultPass);
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const hash = await partner.UrlSubPartner(cookie);
    // console.log(hash);
    await partner.register(partnerEmail2, defaultPass, 'RUB', hash);
    // console.log(partnerEmail2, defaultPass);
    const { cookie: cookie2 } = await partner.login(partnerEmail2, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie2, promocode);
    // console.log(promocode);
    const { data: user } = await register.oneClickRegUahWithPromocode(promocode);
    // console.log(user);
    await banking.setBalance(user.id, CASE_COST_UAH);
    const { data: caseWin } = await cases.playCaseWithoutChance(FIVE_HUNDRED_UAH_CASE_ID);
    // console.log(caseWin);
    await sleep(1000);
    const { data: statsAll } = await partner.getStatsAll(cookie2, promocodeId);
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie2, new Date(), promocodeId);
    // console.log(statsDay);
    await checkPartnerPaymentCase(statsAll, statsDay.days[0], [{
      caseCost: CASE_COST_UAH,
      profit: caseWin.result,
    }], 'RUB', 'UAH');
    const { data: { partners: [p0] } } = await partner.getStatsSubpartner(cookie);
    const Myincome = (p0.webmasterSum).toFixed(2);
    const Partnerincome = (p0.partnerSum * 0.05).toFixed(2);
    expect(Myincome).toEqual(Partnerincome);
  });

  it('Sub USD + Part RUB + Bet RUB', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const partnerEmail2 = `${randomStr(10)}@ahem.email`;
    await partner.register(partnerEmail, defaultPass, 'USD');
    // console.log(partnerEmail, defaultPass);
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const hash = await partner.UrlSubPartner(cookie);
    // console.log(hash);
    await partner.register(partnerEmail2, defaultPass, 'RUB', hash);
    // console.log(hash);
    const { cookie: cookie2 } = await partner.login(partnerEmail2, defaultPass);
    // console.log(partnerEmail2, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie2, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegRubWithPromocode(promocode);
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_RUB);
    // console.log(price)
    await sleep(2000);
    const { data: statsAll } = await partner.getStatsAll(cookie2, promocodeId);
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie2, new Date(), promocodeId);
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_RUB - price], 'RUB', 'RUB');
    const { data: { partners: [p0] } } = await partner.getStatsSubpartner(cookie);
    const MyIncome = (p0.webmasterSum).toFixed(2);
    const PartnerIncome = ((p0.partnerSum * 0.05) / (await getCoeffForPayment('RUB', 'USD'))).toFixed(2);
    expect(MyIncome).toEqual(PartnerIncome);
  });

  it('Sub USD + Part RUB + Bet USD', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const partnerEmail2 = `${randomStr(10)}@ahem.email`;
    await partner.register(partnerEmail, defaultPass, 'USD');
    // console.log(partnerEmail, defaultPass);
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const hash = await partner.UrlSubPartner(cookie);
    // console.log(hash);
    await partner.register(partnerEmail2, defaultPass, 'RUB', hash);
    // console.log(hash);
    const { cookie: cookie2 } = await partner.login(partnerEmail2, defaultPass);
    // console.log(partnerEmail2, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie2, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegUsdWithPromocode(promocode);
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_USD);
    // console.log(price)
    await sleep(2000);
    const { data: statsAll } = await partner.getStatsAll(cookie2, promocodeId);
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie2, new Date(), promocodeId);
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_USD - price], 'RUB', 'USD');
    const { data: { partners: [p0] } } = await partner.getStatsSubpartner(cookie);
    const MyIncome = (p0.webmasterSum).toFixed(2);
    const PartnerIncome = ((p0.partnerSum * 0.05) / (await getCoeffForPayment('RUB', 'USD'))).toFixed(2);
    expect(MyIncome).toEqual(PartnerIncome);
  });

  it('Sub USD + Part RUB + Bet EUR', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const partnerEmail2 = `${randomStr(10)}@ahem.email`;
    await partner.register(partnerEmail, defaultPass, 'USD');
    // console.log(partnerEmail, defaultPass);
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const hash = await partner.UrlSubPartner(cookie);
    // console.log(hash);
    await partner.register(partnerEmail2, defaultPass, 'RUB', hash);
    // console.log(hash);
    const { cookie: cookie2 } = await partner.login(partnerEmail2, defaultPass);
    // console.log(partnerEmail2, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie2, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegEurWithPromocode(promocode);
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_EUR);
    // console.log(price)
    await sleep(2000);
    const { data: statsAll } = await partner.getStatsAll(cookie2, promocodeId);
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie2, new Date(), promocodeId);
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_EUR - price], 'RUB', 'EUR');
    const { data: { partners: [p0] } } = await partner.getStatsSubpartner(cookie);
    const MyIncome = (p0.webmasterSum).toFixed(2);
    const PartnerIncome = ((p0.partnerSum * 0.05) / (await getCoeffForPayment('RUB', 'USD'))).toFixed(2);
    expect(MyIncome).toEqual(PartnerIncome);
  });

  it('Sub EUR + Part RUB + Bet RUB', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const partnerEmail2 = `${randomStr(10)}@ahem.email`;
    await partner.register(partnerEmail, defaultPass, 'EUR');
    // console.log(partnerEmail, defaultPass);
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const hash = await partner.UrlSubPartner(cookie);
    // console.log(hash);
    await partner.register(partnerEmail2, defaultPass, 'RUB', hash);
    // console.log(hash);
    const { cookie: cookie2 } = await partner.login(partnerEmail2, defaultPass);
    // console.log(partnerEmail2, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie2, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegRubWithPromocode(promocode);
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_RUB);
    // console.log(price)
    await sleep(2000);
    const { data: statsAll } = await partner.getStatsAll(cookie2, promocodeId);
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie2, new Date(), promocodeId);
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_RUB - price], 'RUB', 'RUB');
    const { data: { partners: [p0] } } = await partner.getStatsSubpartner(cookie);
    const MyIncome = (p0.webmasterSum).toFixed(2);
    const PartnerIncome = ((p0.partnerSum * 0.05) / (await getCoeffForPayment('RUB', 'EUR'))).toFixed(2);
    expect(MyIncome).toEqual(PartnerIncome);
  });

  it('Sub EUR + Part RUB + Bet USD', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const partnerEmail2 = `${randomStr(10)}@ahem.email`;
    await partner.register(partnerEmail, defaultPass, 'EUR');
    // console.log(partnerEmail, defaultPass);
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const hash = await partner.UrlSubPartner(cookie);
    // console.log(hash);
    await partner.register(partnerEmail2, defaultPass, 'RUB', hash);
    // console.log(hash);
    const { cookie: cookie2 } = await partner.login(partnerEmail2, defaultPass);
    // console.log(partnerEmail2, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie2, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegUsdWithPromocode(promocode);
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_EUR);
    // console.log(price)
    await sleep(2000);
    const { data: statsAll } = await partner.getStatsAll(cookie2, promocodeId);
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie2, new Date(), promocodeId);
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_EUR - price], 'RUB', 'USD');
    const { data: { partners: [p0] } } = await partner.getStatsSubpartner(cookie);
    const MyIncome = (p0.webmasterSum).toFixed(2);
    const PartnerIncome = ((p0.partnerSum * 0.05) / (await getCoeffForPayment('RUB', 'EUR'))).toFixed(2);
    expect(MyIncome).toEqual(PartnerIncome);
  });

  it('Sub EUR + Part RUB + Bet EUR', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const partnerEmail2 = `${randomStr(10)}@ahem.email`;
    await partner.register(partnerEmail, defaultPass, 'EUR');
    // console.log(partnerEmail, defaultPass);
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const hash = await partner.UrlSubPartner(cookie);
    // console.log(hash);
    await partner.register(partnerEmail2, defaultPass, 'RUB', hash);
    // console.log(hash);
    const { cookie: cookie2 } = await partner.login(partnerEmail2, defaultPass);
    // console.log(partnerEmail2, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie2, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegEurWithPromocode(promocode);
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_EUR);
    // console.log(price)
    await sleep(2000);
    const { data: statsAll } = await partner.getStatsAll(cookie2, promocodeId);
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie2, new Date(), promocodeId);
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_EUR - price], 'RUB', 'EUR');
    const { data: { partners: [p0] } } = await partner.getStatsSubpartner(cookie);
    const MyIncome = (p0.webmasterSum).toFixed(2);
    const PartnerIncome = ((p0.partnerSum * 0.05) / (await getCoeffForPayment('RUB', 'EUR'))).toFixed(2);
    expect(MyIncome).toEqual(PartnerIncome);
  });

  it('Sub EUR + Part USD + Bet RUB', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const partnerEmail2 = `${randomStr(10)}@ahem.email`;
    await partner.register(partnerEmail, defaultPass, 'EUR');
    // console.log(partnerEmail, defaultPass);
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const hash = await partner.UrlSubPartner(cookie);
    // console.log(hash);
    await partner.register(partnerEmail2, defaultPass, 'USD', hash);
    // console.log(hash);
    const { cookie: cookie2 } = await partner.login(partnerEmail2, defaultPass);
    // console.log(partnerEmail2, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie2, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegRubWithPromocode(promocode);
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_RUB);
    // console.log(price)
    await sleep(2000);
    const { data: statsAll } = await partner.getStatsAll(cookie2, promocodeId);
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie2, new Date(), promocodeId);
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_RUB - price], 'USD', 'RUB');
    const { data: { partners: [p0] } } = await partner.getStatsSubpartner(cookie);
    const MyIncome = (p0.webmasterSum).toFixed(2);
    const PartnerIncome = ((p0.partnerSum * 0.05) / (await getCoeffForPayment('USD', 'EUR'))).toFixed(2);
    expect(MyIncome).toEqual(PartnerIncome);
  });

  it('Sub EUR + Part USD + Bet USD', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const partnerEmail2 = `${randomStr(10)}@ahem.email`;
    await partner.register(partnerEmail, defaultPass, 'EUR');
    // console.log(partnerEmail, defaultPass);
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const hash = await partner.UrlSubPartner(cookie);
    // console.log(hash);
    await partner.register(partnerEmail2, defaultPass, 'USD', hash);
    // console.log(hash);
    const { cookie: cookie2 } = await partner.login(partnerEmail2, defaultPass);
    // console.log(partnerEmail2, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie2, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegUsdWithPromocode(promocode);
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_USD);
    // console.log(price)
    await sleep(2000);
    const { data: statsAll } = await partner.getStatsAll(cookie2, promocodeId);
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie2, new Date(), promocodeId);
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_USD - price], 'USD', 'USD');
    const { data: { partners: [p0] } } = await partner.getStatsSubpartner(cookie);
    const MyIncome = (p0.webmasterSum).toFixed(2);
    const PartnerIncome = ((p0.partnerSum * 0.05) / (await getCoeffForPayment('USD', 'EUR'))).toFixed(2);
    expect(MyIncome).toEqual(PartnerIncome);
  });

  it('Sub EUR + Part USD + Bet EUR', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const partnerEmail2 = `${randomStr(10)}@ahem.email`;
    await partner.register(partnerEmail, defaultPass, 'EUR');
    // console.log(partnerEmail, defaultPass);
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const hash = await partner.UrlSubPartner(cookie);
    // console.log(hash);
    await partner.register(partnerEmail2, defaultPass, 'USD', hash);
    // console.log(hash);
    const { cookie: cookie2 } = await partner.login(partnerEmail2, defaultPass);
    // console.log(partnerEmail2, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie2, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegEurWithPromocode(promocode);
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_EUR);
    // console.log(price)
    await sleep(2000);
    const { data: statsAll } = await partner.getStatsAll(cookie2, promocodeId);
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie2, new Date(), promocodeId);
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_EUR - price], 'USD', 'EUR');
    const { data: { partners: [p0] } } = await partner.getStatsSubpartner(cookie);
    const MyIncome = (p0.webmasterSum).toFixed(2);
    const PartnerIncome = ((p0.partnerSum * 0.05) / (await getCoeffForPayment('USD', 'EUR'))).toFixed(2);
    expect(MyIncome).toEqual(PartnerIncome);
  });

  it('Sub USD + Part USD + Bet RUB', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const partnerEmail2 = `${randomStr(10)}@ahem.email`;
    await partner.register(partnerEmail, defaultPass, 'USD');
    // console.log(partnerEmail, defaultPass);
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const hash = await partner.UrlSubPartner(cookie);
    // console.log(hash);
    await partner.register(partnerEmail2, defaultPass, 'USD', hash);
    // console.log(hash);
    const { cookie: cookie2 } = await partner.login(partnerEmail2, defaultPass);
    // console.log(partnerEmail2, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie2, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegRubWithPromocode(promocode);
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_RUB);
    // console.log(price)
    await sleep(2000);
    const { data: statsAll } = await partner.getStatsAll(cookie2, promocodeId);
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie2, new Date(), promocodeId);
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_RUB - price], 'USD', 'RUB');
    const { data: { partners: [p0] } } = await partner.getStatsSubpartner(cookie);
    const MyIncome = (p0.webmasterSum).toFixed(2);
    const PartnerIncome = ((p0.partnerSum * 0.05) / (await getCoeffForPayment('USD', 'USD'))).toFixed(2);
    expect(MyIncome).toEqual(PartnerIncome);
  });

  it('Sub USD + Part USD + Bet USD', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const partnerEmail2 = `${randomStr(10)}@ahem.email`;
    await partner.register(partnerEmail, defaultPass, 'USD');
    // console.log(partnerEmail, defaultPass);
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const hash = await partner.UrlSubPartner(cookie);
    // console.log(hash);
    await partner.register(partnerEmail2, defaultPass, 'USD', hash);
    // console.log(hash);
    const { cookie: cookie2 } = await partner.login(partnerEmail2, defaultPass);
    // console.log(partnerEmail2, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie2, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegUsdWithPromocode(promocode);
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_USD);
    // console.log(price)
    await sleep(2000);
    const { data: statsAll } = await partner.getStatsAll(cookie2, promocodeId);
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie2, new Date(), promocodeId);
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_USD - price], 'USD', 'USD');
    const { data: { partners: [p0] } } = await partner.getStatsSubpartner(cookie);
    const MyIncome = (p0.webmasterSum).toFixed(2);
    const PartnerIncome = ((p0.partnerSum * 0.05) / (await getCoeffForPayment('USD', 'USD'))).toFixed(2);
    expect(MyIncome).toEqual(PartnerIncome);
  });

  it('Sub USD + Part USD + Bet EUR', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const partnerEmail2 = `${randomStr(10)}@ahem.email`;
    await partner.register(partnerEmail, defaultPass, 'USD');
    // console.log(partnerEmail, defaultPass);
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const hash = await partner.UrlSubPartner(cookie);
    // console.log(hash);
    await partner.register(partnerEmail2, defaultPass, 'USD', hash);
    // console.log(hash);
    const { cookie: cookie2 } = await partner.login(partnerEmail2, defaultPass);
    // console.log(partnerEmail2, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie2, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegEurWithPromocode(promocode);
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_EUR);
    // console.log(price)
    await sleep(2000);
    const { data: statsAll } = await partner.getStatsAll(cookie2, promocodeId);
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie2, new Date(), promocodeId);
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_EUR - price], 'USD', 'EUR');
    const { data: { partners: [p0] } } = await partner.getStatsSubpartner(cookie);
    const MyIncome = (p0.webmasterSum).toFixed(2);
    const PartnerIncome = ((p0.partnerSum * 0.05) / (await getCoeffForPayment('USD', 'USD'))).toFixed(2);
    expect(MyIncome).toEqual(PartnerIncome);
  });

  it('Sub RUB + Part USD + Bet RUB', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const partnerEmail2 = `${randomStr(10)}@ahem.email`;
    await partner.register(partnerEmail, defaultPass, 'RUB');
    // console.log(partnerEmail, defaultPass);
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const hash = await partner.UrlSubPartner(cookie);
    // console.log(hash);
    await partner.register(partnerEmail2, defaultPass, 'USD', hash);
    // console.log(hash);
    const { cookie: cookie2 } = await partner.login(partnerEmail2, defaultPass);
    // console.log(partnerEmail2, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie2, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegRubWithPromocode(promocode);
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_RUB);
    // console.log(price)
    await sleep(2000);
    const { data: statsAll } = await partner.getStatsAll(cookie2, promocodeId);
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie2, new Date(), promocodeId);
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_RUB - price], 'USD', 'RUB');
    const { data: { partners: [p0] } } = await partner.getStatsSubpartner(cookie);
    const MyIncome = (p0.webmasterSum).toFixed(2);
    const PartnerIncome = ((p0.partnerSum * 0.05) / (await getCoeffForPayment('USD', 'RUB'))).toFixed(2);
    expect(MyIncome).toEqual(PartnerIncome);
  });

  it('Sub RUB + Part USD + Bet USD', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const partnerEmail2 = `${randomStr(10)}@ahem.email`;
    await partner.register(partnerEmail, defaultPass, 'RUB');
    // console.log(partnerEmail, defaultPass);
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const hash = await partner.UrlSubPartner(cookie);
    // console.log(hash);
    await partner.register(partnerEmail2, defaultPass, 'USD', hash);
    // console.log(hash);
    const { cookie: cookie2 } = await partner.login(partnerEmail2, defaultPass);
    // console.log(partnerEmail2, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie2, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegUsdWithPromocode(promocode);
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_USD);
    // console.log(price)
    await sleep(2000);
    const { data: statsAll } = await partner.getStatsAll(cookie2, promocodeId);
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie2, new Date(), promocodeId);
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_USD - price], 'USD', 'USD');
    const { data: { partners: [p0] } } = await partner.getStatsSubpartner(cookie);
    const MyIncome = (p0.webmasterSum).toFixed(2);
    const PartnerIncome = ((p0.partnerSum * 0.05) / (await getCoeffForPayment('USD', 'RUB'))).toFixed(2);
    expect(MyIncome).toEqual(PartnerIncome);
  });

  it('Sub RUB + Part USD + Bet EUR', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const partnerEmail2 = `${randomStr(10)}@ahem.email`;
    await partner.register(partnerEmail, defaultPass, 'RUB');
    // console.log(partnerEmail, defaultPass);
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const hash = await partner.UrlSubPartner(cookie);
    // console.log(hash);
    await partner.register(partnerEmail2, defaultPass, 'USD', hash);
    // console.log(hash);
    const { cookie: cookie2 } = await partner.login(partnerEmail2, defaultPass);
    // console.log(partnerEmail2, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie2, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegEurWithPromocode(promocode);
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_EUR);
    // console.log(price)
    await sleep(2000);
    const { data: statsAll } = await partner.getStatsAll(cookie2, promocodeId);
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie2, new Date(), promocodeId);
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_EUR - price], 'USD', 'EUR');
    const { data: { partners: [p0] } } = await partner.getStatsSubpartner(cookie);
    const MyIncome = (p0.webmasterSum).toFixed(2);
    const PartnerIncome = ((p0.partnerSum * 0.05) / (await getCoeffForPayment('USD', 'RUB'))).toFixed(2);
    expect(MyIncome).toEqual(PartnerIncome);
  });

  it('Sub RUB + Part EUR + Bet RUB', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const partnerEmail2 = `${randomStr(10)}@ahem.email`;
    await partner.register(partnerEmail, defaultPass, 'RUB');
    // console.log(partnerEmail, defaultPass);
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const hash = await partner.UrlSubPartner(cookie);
    // console.log(hash);
    await partner.register(partnerEmail2, defaultPass, 'EUR', hash);
    // console.log(hash);
    const { cookie: cookie2 } = await partner.login(partnerEmail2, defaultPass);
    // console.log(partnerEmail2, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie2, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegRubWithPromocode(promocode);
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_RUB);
    // console.log(price)
    await sleep(2000);
    const { data: statsAll } = await partner.getStatsAll(cookie2, promocodeId);
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie2, new Date(), promocodeId);
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_RUB - price], 'EUR', 'RUB');
    const { data: { partners: [p0] } } = await partner.getStatsSubpartner(cookie);
    const MyIncome = (p0.webmasterSum).toFixed(2);
    const PartnerIncome = ((p0.partnerSum * 0.05) / (await getCoeffForPayment('EUR', 'RUB'))).toFixed(2);
    expect(MyIncome).toEqual(PartnerIncome);
  });

  it('Sub USD + Part EUR + Bet USD', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const partnerEmail2 = `${randomStr(10)}@ahem.email`;
    await partner.register(partnerEmail, defaultPass, 'USD');
    // console.log(partnerEmail, defaultPass);
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const hash = await partner.UrlSubPartner(cookie);
    // console.log(hash);
    await partner.register(partnerEmail2, defaultPass, 'EUR', hash);
    // console.log(hash);
    const { cookie: cookie2 } = await partner.login(partnerEmail2, defaultPass);
    // console.log(partnerEmail2, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie2, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegUsdWithPromocode(promocode);
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_USD);
    // console.log(price)
    await sleep(2000);
    const { data: statsAll } = await partner.getStatsAll(cookie2, promocodeId);
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie2, new Date(), promocodeId);
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_USD - price], 'EUR', 'USD');
    const { data: { partners: [p0] } } = await partner.getStatsSubpartner(cookie);
    const MyIncome = (p0.webmasterSum).toFixed(2);
    const PartnerIncome = ((p0.partnerSum * 0.05) / (await getCoeffForPayment('EUR', 'USD'))).toFixed(2);
    expect(MyIncome).toEqual(PartnerIncome);
  });

  it('Sub EUR + Part EUR + Bet EUR', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const partnerEmail2 = `${randomStr(10)}@ahem.email`;
    await partner.register(partnerEmail, defaultPass, 'EUR');
    // console.log(partnerEmail, defaultPass);
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const hash = await partner.UrlSubPartner(cookie);
    // console.log(hash);
    await partner.register(partnerEmail2, defaultPass, 'EUR', hash);
    // console.log(hash);
    const { cookie: cookie2 } = await partner.login(partnerEmail2, defaultPass);
    // console.log(partnerEmail2, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie2, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegEurWithPromocode(promocode);
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_EUR);
    // console.log(price)
    await sleep(2000);
    const { data: statsAll } = await partner.getStatsAll(cookie2, promocodeId);
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie2, new Date(), promocodeId);
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_EUR - price], 'EUR', 'EUR');
    const { data: { partners: [p0] } } = await partner.getStatsSubpartner(cookie);
    const MyIncome = (p0.webmasterSum).toFixed(2);
    const PartnerIncome = ((p0.partnerSum * 0.05) / (await getCoeffForPayment('EUR', 'EUR'))).toFixed(2);
    expect(MyIncome).toEqual(PartnerIncome);
  });
});
