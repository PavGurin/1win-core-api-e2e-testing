/**
 * @jest-environment node
 */

import { sleep } from '../../../src/methods/utils';
import { register } from '../../../src/methods/register';
import { partner } from '../../../src/methods/partner';
import { randomNum, randomStr } from '../../../src/randomizer';
import {
  checkStatsAllAfterOneRegistrtaion,
  checkStatsAllAfterOneRegistrtaionCPA,
  checkStatsDailyAfterOneRegistrtaion, checkStatsDailyAfterOneRegistrtaionCPA,
} from '../../../src/expects/exPartner';
import { mysqlConnection } from '../../../src/methods/mysqlConnection';

describe('One click registration with promocode', () => {
  const defaultPass = '123123AA';

  beforeAll(async () => {
    const dbResult = await mysqlConnection.executeQuery('DELETE FROM 1win.riskmanagement_ip_log;');
    // console.log(dbResult);
    await sleep(1500);
  });


  describe('Revshare partner', () => {
    it('C1789837 (+) RUB partner + RUB', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'RUB');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegRubWithPromocode(promocode);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaion(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaion(statsDay.days[0], 1, new Date());
    });

    it('C1789838 (+) RUB partner + USD', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'RUB');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegUsdWithPromocode(promocode);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaion(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaion(statsDay.days[0], 1, new Date());
    });

    it('C1789839 (+) RUB partner + EUR', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'RUB');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegEurWithPromocode(promocode);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaion(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaion(statsDay.days[0], 1, new Date());
    });

    it('C1789840 (+) RUB partner + UAH', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'RUB');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegUahWithPromocode(promocode);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaion(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaion(statsDay.days[0], 1, new Date());
    });


    it('C1789841 (+) USD partner + RUB', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'USD');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegRubWithPromocode(promocode);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaion(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaion(statsDay.days[0], 1, new Date());
    });

    it('C1789842 (+) USD partner + USD', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'USD');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegUsdWithPromocode(promocode);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaion(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaion(statsDay.days[0], 1, new Date());
    });

    it('C1789843  (+) USD partner + EUR', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'USD');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegEurWithPromocode(promocode);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaion(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaion(statsDay.days[0], 1, new Date());
    });

    it('C1789844 (+) USD partner + UAH', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'USD');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegUahWithPromocode(promocode);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaion(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaion(statsDay.days[0], 1, new Date());
    });


    it('C1789845 (+) EUR partner + RUB', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'EUR');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegRubWithPromocode(promocode);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaion(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaion(statsDay.days[0], 1, new Date());
    });

    it('C1789846 (+) EUR partner + USD', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'EUR');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegUsdWithPromocode(promocode);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaion(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaion(statsDay.days[0], 1, new Date());
    });

    it('C1789847 (+) EUR partner + EUR', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'EUR');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegEurWithPromocode(promocode);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaion(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaion(statsDay.days[0], 1, new Date());
    });

    it('C1789848 (+) EUR partner + UAH', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.register(partnerEmail, defaultPass, 'EUR');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegUahWithPromocode(promocode);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaion(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaion(statsDay.days[0], 1, new Date());
    });
  });

  describe('CPA partner', () => {
    it('C1789849 (+) RUB partner + RUB ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.registerWithCPA(partnerEmail, defaultPass, 'RUB');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner.createPromocodeWithCPA(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegRubWithPromocode(promocode);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaionCPA(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaionCPA(statsDay.days[0], 1, new Date());
    });

    it('C1789850 (+) RUB partner + USD ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.registerWithCPA(partnerEmail, defaultPass, 'RUB');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner.createPromocodeWithCPA(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegUsdWithPromocode(promocode);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaionCPA(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaionCPA(statsDay.days[0], 1, new Date());
    });

    it('C1789851 (+) RUB partner + EUR ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.registerWithCPA(partnerEmail, defaultPass, 'RUB');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner.createPromocodeWithCPA(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegEurWithPromocode(promocode);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaionCPA(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaionCPA(statsDay.days[0], 1, new Date());
    });

    it('C1789852 (+) RUB partner + UAH ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.registerWithCPA(partnerEmail, defaultPass, 'RUB');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner.createPromocodeWithCPA(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegUahWithPromocode(promocode);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaionCPA(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaionCPA(statsDay.days[0], 1, new Date());
    });

    it('C1789853 (+) USD partner + RUB ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.registerWithCPA(partnerEmail, defaultPass, 'USD');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner.createPromocodeWithCPA(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegRubWithPromocode(promocode);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaionCPA(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaionCPA(statsDay.days[0], 1, new Date());
    });

    it('C1789854 (+) USD partner + USD ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.registerWithCPA(partnerEmail, defaultPass, 'USD');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner.createPromocodeWithCPA(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegUsdWithPromocode(promocode);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaionCPA(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaionCPA(statsDay.days[0], 1, new Date());
    });

    it('C1789855  (+) USD partner + EUR ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.registerWithCPA(partnerEmail, defaultPass, 'USD');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner.createPromocodeWithCPA(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegEurWithPromocode(promocode);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaionCPA(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaionCPA(statsDay.days[0], 1, new Date());
    });

    it('C1789856 (+) USD partner + UAH ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.registerWithCPA(partnerEmail, defaultPass, 'USD');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner.createPromocodeWithCPA(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegUahWithPromocode(promocode);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaionCPA(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaionCPA(statsDay.days[0], 1, new Date());
    });

    it('C1789857 (+) EUR partner + RUB ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.registerWithCPA(partnerEmail, defaultPass, 'EUR');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner.createPromocodeWithCPA(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegRubWithPromocode(promocode);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaionCPA(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaionCPA(statsDay.days[0], 1, new Date());
    });

    it('C1789858 (+) EUR partner + USD ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.registerWithCPA(partnerEmail, defaultPass, 'EUR');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner.createPromocodeWithCPA(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegUsdWithPromocode(promocode);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaionCPA(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaionCPA(statsDay.days[0], 1, new Date());
    });

    it('C1789859 (+) EUR partner + EUR ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.registerWithCPA(partnerEmail, defaultPass, 'EUR');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner.createPromocodeWithCPA(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegEurWithPromocode(promocode);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaionCPA(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaionCPA(statsDay.days[0], 1, new Date());
    });

    it('C1789860 (+) EUR partner + UAH ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      await partner.registerWithCPA(partnerEmail, defaultPass, 'EUR');
      const { cookie } = await partner.login(partnerEmail, defaultPass);
      const { data: { id: promocodeId } } = await partner.createPromocodeWithCPA(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.oneClickRegUahWithPromocode(promocode);

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaionCPA(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaionCPA(statsDay.days[0], 1, new Date());
    });
  });
});
