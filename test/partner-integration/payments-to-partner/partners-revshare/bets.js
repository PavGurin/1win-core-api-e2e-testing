/**
 * @jest-environment node
 */
import { partner } from '../../../../src/methods/partner';
import { randomNum, randomStr } from '../../../../src/randomizer';
import { register } from '../../../../src/methods/register';
import { checkPartnerPaymentBets } from '../../../../src/expects/exPartner';
import { banking } from '../../../../src/methods/banking';
import { Refund } from '../../../../src/methods/BetsRefund';
import { sleep } from '../../../../src/methods/utils';
import { mysqlConnection } from '../../../../src/methods/mysqlConnection';


describe('One click registration with promocode + play bets and sale bets ', () => {
  const Money = 2000;
  const Bets_RUB = 1000;
  const Bets_USD = 2000;
  const Bets_EUR = 2000;
  const Bets_UAH = 2000;

  beforeAll(async () => {
    const dbResult = await mysqlConnection.executeQuery('DELETE FROM 1win.riskmanagement_ip_log;');
    // console.log(dbResult);
    await sleep(1500);
  });

  it('C1914718 - RUB partner + RUB ordinary bets', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const defaultPass = '123123AA';
    await partner.register(partnerEmail, defaultPass, 'RUB');
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegRubWithPromocode(promocode);
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_RUB);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_RUB - price], 'RUB', 'RUB');
  });
  it('C1914719 - RUB partner + USD ordinary bets', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const defaultPass = '123123AA';
    await partner.register(partnerEmail, defaultPass, 'RUB');
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegUsdWithPromocode(promocode);
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_USD);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_USD - price], 'RUB', 'USD');
  });
  it('C1914720 - RUB partner + EUR ordinary bets', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const defaultPass = '123123AA';
    await partner.register(partnerEmail, defaultPass, 'RUB');
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegEurWithPromocode(promocode);
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_EUR);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_EUR - price], 'RUB', 'EUR');
  });
  it('C1914721 - RUB partner + UAH ordinary bets', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const defaultPass = '123123AA';
    await partner.register(partnerEmail, defaultPass, 'RUB');
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegUahWithPromocode(promocode);
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_UAH);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_UAH - price], 'RUB', 'UAH');
  });
  it('C1914722 - RUB partner + RUB express bets', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const defaultPass = '123123AA';
    await partner.register(partnerEmail, defaultPass, 'RUB');
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegRubWithPromocode(promocode);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetExpress(Bets_RUB);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_RUB - price], 'RUB', 'RUB');
  });
  it('C1914723 - RUB partner + USD express bets', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const defaultPass = '123123AA';
    await partner.register(partnerEmail, defaultPass, 'RUB');
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegUsdWithPromocode(promocode);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetExpress(Bets_USD);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_USD - price], 'RUB', 'USD');
  });
  it('C1914724 - RUB partner + EUR express bets', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const defaultPass = '123123AA';
    await partner.register(partnerEmail, defaultPass, 'RUB');
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegEurWithPromocode(promocode);
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetExpress(Bets_EUR);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_EUR - price], 'RUB', 'EUR');
  });
  it('C1914725 - RUB partner + UAH express bets', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const defaultPass = '123123AA';
    await partner.register(partnerEmail, defaultPass, 'RUB');
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegUahWithPromocode(promocode);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetExpress(Bets_UAH);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_UAH - price], 'RUB', 'UAH');
  });
  it('C1914726 - USD partner + RUB ordinary bets', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const defaultPass = '123123AA';
    await partner.register(partnerEmail, defaultPass, 'USD');
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegRubWithPromocode(promocode);
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_RUB);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_RUB - price], 'USD', 'RUB');
  });
  it('C1914727 - USD partner + USD ordinary bets', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const defaultPass = '123123AA';
    await partner.register(partnerEmail, defaultPass, 'USD');
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegUsdWithPromocode(promocode);
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_USD);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_USD - price], 'USD', 'USD');
  });
  it('C1914728 - USD partner + EUR ordinary bets', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const defaultPass = '123123AA';
    await partner.register(partnerEmail, defaultPass, 'USD');
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegEurWithPromocode(promocode);
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_EUR);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_EUR - price], 'USD', 'EUR');
  });
  it('C1914729 - USD partner + UAH ordinary bets', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const defaultPass = '123123AA';
    await partner.register(partnerEmail, defaultPass, 'USD');
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegUahWithPromocode(promocode);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_UAH);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_UAH - price], 'USD', 'UAH');
  });
  it('C1914730 - EUR partner + RUB ordinary bets', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const defaultPass = '123123AA';
    await partner.register(partnerEmail, defaultPass, 'EUR');
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegRubWithPromocode(promocode);
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_RUB);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_RUB - price], 'EUR', 'RUB');
  });
  it('C1914731 - EUR partner + USD ordinary bets', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const defaultPass = '123123AA';
    await partner.register(partnerEmail, defaultPass, 'EUR');
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegUsdWithPromocode(promocode);
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_USD);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_USD - price], 'EUR', 'USD');
  });
  it('C1914732 - EUR partner + EUR ordinary bets', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const defaultPass = '123123AA';
    await partner.register(partnerEmail, defaultPass, 'EUR');
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegEurWithPromocode(promocode);
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_EUR);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_EUR - price], 'EUR', 'EUR');
  });
  it('C1914733 - EUR partner + UAH ordinary bets', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const defaultPass = '123123AA';
    await partner.register(partnerEmail, defaultPass, 'EUR');
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegUahWithPromocode(promocode);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetOrdinar(Bets_UAH);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_UAH - price], 'EUR', 'UAH');
  });
  it('C1914734 - USD partner + RUB express bets', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const defaultPass = '123123AA';
    await partner.register(partnerEmail, defaultPass, 'USD');
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegRubWithPromocode(promocode);
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetExpress(Bets_RUB);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_RUB - price], 'USD', 'RUB');
  });
  it('C1914735 - USD partner + USD express bets', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const defaultPass = '123123AA';
    await partner.register(partnerEmail, defaultPass, 'USD');
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegUsdWithPromocode(promocode);
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetExpress(Bets_USD);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_USD - price], 'USD', 'USD');
  });
  it('C1914736 - USD partner + EUR express bets', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const defaultPass = '123123AA';
    await partner.register(partnerEmail, defaultPass, 'USD');
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegEurWithPromocode(promocode);
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetExpress(Bets_EUR);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_EUR - price], 'USD', 'EUR');
  });
  it('C1914737 - USD partner + UAH express bets', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const defaultPass = '123123AA';
    await partner.register(partnerEmail, defaultPass, 'USD');
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegUahWithPromocode(promocode);
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetExpress(Bets_UAH);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_UAH - price], 'USD', 'UAH');
  });
  it('C1914738 - EUR partner + RUB express bets', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const defaultPass = '123123AA';
    await partner.register(partnerEmail, defaultPass, 'EUR');
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegRubWithPromocode(promocode);
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetExpress(Bets_RUB);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_RUB - price], 'EUR', 'RUB');
  });
  it('C1914739 - EUR partner + USD express bets', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const defaultPass = '123123AA';
    await partner.register(partnerEmail, defaultPass, 'EUR');
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegUsdWithPromocode(promocode);
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetExpress(Bets_USD);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_USD - price], 'EUR', 'USD');
  });
  it('C1914740 - EUR partner + EUR express bets', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const defaultPass = '123123AA';
    await partner.register(partnerEmail, defaultPass, 'EUR');
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegEurWithPromocode(promocode);
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetExpress(Bets_EUR);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_EUR - price], 'EUR', 'EUR');
  });
  it('C1914741 - EUR partner + UAH express bets', async () => {
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const defaultPass = '123123AA';
    await partner.register(partnerEmail, defaultPass, 'EUR');
    const { cookie } = await partner.login(partnerEmail, defaultPass);
    const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
    // console.log(promocodeId);
    const { data: { id } } = await register.oneClickRegUahWithPromocode(promocode);
    // console.log(id);
    await banking.setBalance(id, Money);
    const price = await Refund.SellBetExpress(Bets_UAH);

    const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
    // console.log(statsAll);
    const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_difference');
    // console.log(statsDay);
    await checkPartnerPaymentBets(statsAll, statsDay.days[0], [Bets_UAH - price], 'EUR', 'UAH');
  });
});
