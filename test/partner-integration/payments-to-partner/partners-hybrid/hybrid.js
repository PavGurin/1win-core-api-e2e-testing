import { randomNum, randomStr } from '../../../../src/randomizer';
import { partner } from '../../../../src/methods/partner';
import { register } from '../../../../src/methods/register';
import { banking } from '../../../../src/methods/banking';
import { createPreset, getLastPresetNumber } from '../../../../src/methods/partnerInDB';
import { cases } from '../../../../src/methods/cases';
import { sleep } from '../../../../src/methods/utils';
import {
  checkPartnerPaymentCasesCPA, checkPartnerPaymentCasesHybrid,
  checkUserMetaCpaPending,
} from '../../../../src/expects/exPartner';
import { mysqlConnection } from '../../../../src/methods/mysqlConnection';
import { generateExpressCoupon } from '../../../../src/methods/better';

const defaultPass = '123123AA';
const TEN_USD_CASE_ID = 13;
const CASE_COST_USD = 10;

describe('hybrid', () => {
  beforeAll(async () => {
    const dbResult = await mysqlConnection.executeQuery('DELETE FROM 1win.riskmanagement_ip_log;');
    // console.log(dbResult);
    await sleep(150);
  });

  it(' Partner RUB + player RUB', async () => {
    const caseCostProfits = [];
    const cpaPayment = 1.33;
    const promocode = randomNum(10).toString();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    console.log(`partnerEmail = ${partnerEmail}`);
    console.log(defaultPass);

    const { partnerId, cookie } = await partner.registerHybrid(partnerEmail, defaultPass, 'RUB');
    // const { cookie } = await partner.login(partnerEmail, defaultPass);
    console.log(`partnerId = ${partnerId}`);
    const { data: { id: promocodeId } } = await partner
      .createPromocodeWithCPA(cookie, promocode, null, 31);
    console.log(promocode);
    console.log(promocodeId);

    for (let i = 0; i < 1; i++) {
      /* eslint no-await-in-loop: off */
      const { data: user } = await register.oneClickRegUsdWithPromocode(promocode);
      console.log(user);
      await banking.setBalance(user.id, 1000000);
      // квалификация сра
      // const { data: caseWin } = await cases.playCaseWithoutChance(THOUSAND_ROUBLES_CASE_ID);
      // console.log(caseWin);

      for (let j = 0; i < 10; i++) {
        const { data } = await cases.playCaseWithoutChance(17); // 100 rub
        caseCostProfits.push({ caseCost: 100, profit: data.result });
        // console.log(data);
        await sleep(10000);
        const { data: statsAll } = await partner.getStatsAll(cookie, promocodeId);
        // console.log(statsAll);

        const { data: statsDay } = await partner.getStatsDay(cookie, new Date(), promocodeId);
        console.log(statsDay);
        // eslint-disable-next-line radix
        expect(parseFloat(((statsDay.days['0'].day_difference) / 2).toFixed(2)))
          .toBeCloseTo(parseFloat(statsDay.days['0'].day_rs_profit.toFixed(2)), 1);
        // await checkPartnerPaymentCasesHybrid(statsAll, statsDay.days[0], caseCostProfits,
        //   cpaPayment * (i + 1), i + 1, 'RUB', 'RUB', partnerId);
      }

      await checkUserMetaCpaPending(user.id);

      await sleep(1000);
      const { data: statsAll2 } = await partner.getStatsAll(cookie, promocodeId);
      console.log(statsAll2);

      const { data: statsDay2 } = await partner.getStatsDay(cookie, new Date(), promocodeId);
      console.log(statsDay2);
    }
  });
});
