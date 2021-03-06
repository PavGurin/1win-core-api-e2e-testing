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

describe('Email registration with promocode', () => {
  const defaultPass = '123123AA';

  beforeAll(async () => {
    const dbResult = await mysqlConnection.executeQuery('DELETE FROM 1win.riskmanagement_ip_log;');
    // console.log(dbResult);
    await sleep(150);
  });

  describe('Revshare partner', () => {
    it('C1789861 (+) RUB partner + RUB', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.usualRegPromocode(promocode, 'RUB');

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaion(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaion(statsDay.days[0], 1, new Date());
    });

    it('C1789862 (+) RUB partner + USD', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.usualRegPromocode(promocode, 'RUB');

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaion(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaion(statsDay.days[0], 1, new Date());
    });

    it('C1789863 (+) RUB partner + EUR', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.usualRegPromocode(promocode, 'RUB');

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaion(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaion(statsDay.days[0], 1, new Date());
    });

    it('C1789864 (+) RUB partner + UAH', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.usualRegPromocode(promocode, 'UAH');

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaion(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaion(statsDay.days[0], 1, new Date());
    });

    it('C1789865 (+) USD partner + RUB', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.usualRegPromocode(promocode, 'USD');

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaion(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaion(statsDay.days[0], 1, new Date());
    });

    it('C1789866 (+) USD partner + USD', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.usualRegPromocode(promocode, 'USD');

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaion(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaion(statsDay.days[0], 1, new Date());
    });

    it('C1789867 (+) USD partner + EUR', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.usualRegPromocode(promocode, 'USD');

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaion(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaion(statsDay.days[0], 1, new Date());
    });

    it('C1789868 (+) USD partner + UAH', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.usualRegPromocode(promocode, 'UAH');

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaion(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaion(statsDay.days[0], 1, new Date());
    });

    it('C1789869 (+) EUR partner + RUB', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.usualRegPromocode(promocode, 'EUR');

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaion(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaion(statsDay.days[0], 1, new Date());
    });

    it('C1789870 (+) EUR partner + USD', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.usualRegPromocode(promocode, 'EUR');

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaion(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaion(statsDay.days[0], 1, new Date());
    });

    it('C1789871 (+) EUR partner + EUR', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.usualRegPromocode(promocode, 'EUR');

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaion(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaion(statsDay.days[0], 1, new Date());
    });

    it('C1789872 (+) EUR partner + UAH', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
      const { data: { id: promocodeId } } = await partner.createPromocode(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.usualRegPromocode(promocode, 'UAH');

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaion(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaion(statsDay.days[0], 1, new Date());
    });
  });

  describe('CPA partner', () => {
    it('C1789873 (+) RUB partner + RUB ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'RUB');
      const { data: { id: promocodeId } } = await partner.createPromocodeWithCPA(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.usualRegPromocode(promocode, 'RUB');

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaionCPA(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaionCPA(statsDay.days[0], 1, new Date());
    });

    it('C1789874 (+) RUB partner + USD ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'RUB');
      const { data: { id: promocodeId } } = await partner.createPromocodeWithCPA(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.usualRegPromocode(promocode, 'USD');

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaionCPA(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaionCPA(statsDay.days[0], 1, new Date());
    });

    it('C1789875 (+) RUB partner + EUR ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'RUB');
      const { data: { id: promocodeId } } = await partner.createPromocodeWithCPA(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.usualRegPromocode(promocode, 'EUR');

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaionCPA(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaionCPA(statsDay.days[0], 1, new Date());
    });

    it('C1789876 (+) RUB partner + UAH ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'RUB');
      const { data: { id: promocodeId } } = await partner.createPromocodeWithCPA(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.usualRegPromocode(promocode, 'UAH');

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaionCPA(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaionCPA(statsDay.days[0], 1, new Date());
    });

    it('C1789877 (+) USD partner + RUB ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'USD');
      const { data: { id: promocodeId } } = await partner.createPromocodeWithCPA(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.usualRegPromocode(promocode, 'RUB');

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaionCPA(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaionCPA(statsDay.days[0], 1, new Date());
    });

    it('C1789878 (+) USD partner + USD ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'USD');
      const { data: { id: promocodeId } } = await partner.createPromocodeWithCPA(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.usualRegPromocode(promocode, 'USD');

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaionCPA(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaionCPA(statsDay.days[0], 1, new Date());
    });

    it('C1789879 (+) USD partner + EUR ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'USD');
      const { data: { id: promocodeId } } = await partner.createPromocodeWithCPA(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.usualRegPromocode(promocode, 'EUR');

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaionCPA(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaionCPA(statsDay.days[0], 1, new Date());
    });

    it('C1789880 (+) USD partner + UAH ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'USD');
      const { data: { id: promocodeId } } = await partner.createPromocodeWithCPA(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.usualRegPromocode(promocode, 'UAH');

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaionCPA(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaionCPA(statsDay.days[0], 1, new Date());
    });

    it('C1789881 (+) EUR partner + RUB ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'EUR');
      const { data: { id: promocodeId } } = await partner.createPromocodeWithCPA(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.usualRegPromocode(promocode, 'RUB');

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaionCPA(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaionCPA(statsDay.days[0], 1, new Date());
    });

    it('C1789882 (+) EUR partner + USD ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'EUR');
      const { data: { id: promocodeId } } = await partner.createPromocodeWithCPA(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.usualRegPromocode(promocode, 'USD');

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaionCPA(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaionCPA(statsDay.days[0], 1, new Date());
    });

    it('C1789883 (+) EUR partner + EUR ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'EUR');
      const { data: { id: promocodeId } } = await partner.createPromocodeWithCPA(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.usualRegPromocode(promocode, 'EUR');

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaionCPA(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaionCPA(statsDay.days[0], 1, new Date());
    });

    it('C1789884 (+) EUR partner + UAH ', async () => {
      const promocode = randomNum(10).toString();
      const partnerEmail = `${randomStr(10)}@ahem.email`;

      const { cookie } = await partner.registerCPA(partnerEmail, defaultPass, 'EUR');
      const { data: { id: promocodeId } } = await partner.createPromocodeWithCPA(cookie, promocode);
      // console.log(promocodeId);

      const { data: user } = await register.usualRegPromocode(promocode, 'UAH');

      const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId, undefined, 'regs');
      // console.log(statsAll);
      checkStatsAllAfterOneRegistrtaionCPA(statsAll, 1);

      const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId, undefined, 'day_regs');
      // console.log(statsDay);
      checkStatsDailyAfterOneRegistrtaionCPA(statsDay.days[0], 1, new Date());
    });
  });
});
