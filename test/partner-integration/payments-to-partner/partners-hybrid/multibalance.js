/**
 * @jest-environment node
 */

import { rndPhoneForPartner, sleep } from '../../../../src/methods/utils';
import { randomStr } from '../../../../src/randomizer';
import { partner } from '../../../../src/methods/partner';
import { register } from '../../../../src/methods/register';
import { regUsersAndPlayCases } from '../../../../src/methods/regUsersForPartner';
import {
  calculateExpectedCaseHybridPayments,
  checkPartnerWithdrawalError, checkPartnerWithdrawalSuccess,
  checkSourceProfit,
  checkSources,
} from '../../../../src/expects/exPartner';

const defaultPass = '123123AA';
const cpaPayment1 = 10;
const cpaPayment2 = 20;
const userDeposit = 5000;

describe('Hybrid multibalance tests', () => {
  /* eslint no-await-in-loop: off */
  let presetId1;
  let presetId2;
  let partnerEmail;
  let promocode1;
  let promocode2;

  beforeAll(async () => {
    presetId1 = await partner.createPreset(0, 0, 0, 0, 1, 100000, cpaPayment1);
    presetId2 = await partner.createPreset(0, 0, 0, 0, 1, 100000, cpaPayment2);
  });

  beforeEach(async () => {
    partnerEmail = `${randomStr(10)}@ahem.email`;
    promocode1 = `${randomStr(8)}`;
    promocode2 = `${randomStr(8)}`;
  });

  describe('Two sources + default, check source stats', () => {
    it('C2157479 - Partner RUB + players RUB, USD', async () => {
      const { cookie, info: { user: { id: partnerId } } } = await partner.registerHybrid(partnerEmail, defaultPass, 'RUB');
      await partner.setMultibalance(partnerId);
      const sourceId1 = await partner.createSource(cookie, 'source1');
      const sourceId2 = await partner.createSource(cookie, 'source2');
      const { data: { id: promocodeId1 } } = await partner
        .createPromocodeWithCPA(cookie, promocode1, sourceId1, presetId1);
      const { data: { id: promocodeId2 } } = await partner
        .createPromocodeWithCPA(cookie, promocode2, sourceId2, presetId2);

      const casesProfit1 = await regUsersAndPlayCases(2, 5, 1000, 'RUB', promocode1, partnerId, promocodeId1, sourceId1, userDeposit);
      const casesProfit2 = await regUsersAndPlayCases(2, 5, 20, 'USD', promocode2, partnerId, promocodeId2, sourceId2, userDeposit);

      await sleep(8000);
      await partner.addCpaPayment(partnerId);
      await sleep(2000);
      const { payment: payment1 } = await calculateExpectedCaseHybridPayments(partnerId, casesProfit1, cpaPayment1, 2, 'RUB', 'RUB', sourceId1);
      const { payment: payment2 } = await calculateExpectedCaseHybridPayments(partnerId, casesProfit2, cpaPayment2, 2, 'RUB', 'USD', sourceId2);
      // console.log(partnerEmail);
      // console.log(payment1);
      await checkSourceProfit(cookie, sourceId1, payment1, payment1);
      await checkSourceProfit(cookie, sourceId2, payment2, payment2);
      await checkSourceProfit(cookie, await partner.getSourceId(cookie), 0, 0);
    });
    it('C2157480 - Partner RUB + players EUR, UAH', async () => {
      const { cookie, info: { user: { id: partnerId } } } = await partner.registerHybrid(partnerEmail, defaultPass, 'RUB');
      await partner.setMultibalance(partnerId);
      const sourceId1 = await partner.createSource(cookie, 'source1');
      const sourceId2 = await partner.createSource(cookie, 'source2');
      const { data: { id: promocodeId1 } } = await partner
        .createPromocodeWithCPA(cookie, promocode1, sourceId1, presetId1);
      const { data: { id: promocodeId2 } } = await partner
        .createPromocodeWithCPA(cookie, promocode2, sourceId2, presetId2);

      const casesProfit1 = await regUsersAndPlayCases(2, 5, 20, 'EUR', promocode1, partnerId, promocodeId1, sourceId1, userDeposit);
      const casesProfit2 = await regUsersAndPlayCases(2, 5, 500, 'UAH', promocode2, partnerId, promocodeId2, sourceId2, userDeposit);

      await sleep(8000);
      await partner.addCpaPayment(partnerId);
      await sleep(2000);
      const { payment: payment1 } = await calculateExpectedCaseHybridPayments(partnerId, casesProfit1, cpaPayment1, 2, 'RUB', 'EUR', sourceId1);
      const { payment: payment2 } = await calculateExpectedCaseHybridPayments(partnerId, casesProfit2, cpaPayment2, 2, 'RUB', 'UAH', sourceId2);
      // console.log(partnerEmail);
      // console.log(payment1);
      await checkSourceProfit(cookie, sourceId1, payment1, payment1);
      await checkSourceProfit(cookie, sourceId2, payment2, payment2);
      await checkSourceProfit(cookie, await partner.getSourceId(cookie), 0, 0);
    });
    it('C2157481 - Partner USD + players RUB, UAH', async () => {
      const { cookie, info: { user: { id: partnerId } } } = await partner.registerHybrid(partnerEmail, defaultPass, 'USD');
      await partner.setMultibalance(partnerId);
      const sourceId1 = await partner.createSource(cookie, 'source1');
      const sourceId2 = await partner.createSource(cookie, 'source2');
      const { data: { id: promocodeId1 } } = await partner
        .createPromocodeWithCPA(cookie, promocode1, sourceId1, presetId1);
      const { data: { id: promocodeId2 } } = await partner
        .createPromocodeWithCPA(cookie, promocode2, sourceId2, presetId2);

      const casesProfit1 = await regUsersAndPlayCases(2, 5, 1000, 'RUB', promocode1, partnerId, promocodeId1, sourceId1, userDeposit);
      const casesProfit2 = await regUsersAndPlayCases(2, 5, 500, 'UAH', promocode2, partnerId, promocodeId2, sourceId2, userDeposit);

      await sleep(8000);
      await partner.addCpaPayment(partnerId);
      await sleep(2000);
      const { payment: payment1 } = await calculateExpectedCaseHybridPayments(partnerId, casesProfit1, cpaPayment1, 2, 'USD', 'RUB', sourceId1);
      const { payment: payment2 } = await calculateExpectedCaseHybridPayments(partnerId, casesProfit2, cpaPayment2, 2, 'USD', 'UAH', sourceId2);
      // console.log(partnerEmail);
      // console.log(payment1);
      await checkSourceProfit(cookie, sourceId1, payment1, payment1);
      await checkSourceProfit(cookie, sourceId2, payment2, payment2);
      await checkSourceProfit(cookie, await partner.getSourceId(cookie), 0, 0);
    });
    it('C2157482 - Partner USD + players USD, EUR', async () => {
      const { cookie, info: { user: { id: partnerId } } } = await partner.registerHybrid(partnerEmail, defaultPass, 'USD');
      await partner.setMultibalance(partnerId);
      const sourceId1 = await partner.createSource(cookie, 'source1');
      const sourceId2 = await partner.createSource(cookie, 'source2');
      const { data: { id: promocodeId1 } } = await partner
        .createPromocodeWithCPA(cookie, promocode1, sourceId1, presetId1);
      const { data: { id: promocodeId2 } } = await partner
        .createPromocodeWithCPA(cookie, promocode2, sourceId2, presetId2);

      const casesProfit1 = await regUsersAndPlayCases(2, 5, 20, 'USD', promocode1, partnerId, promocodeId1, sourceId1, userDeposit);
      const casesProfit2 = await regUsersAndPlayCases(2, 5, 20, 'EUR', promocode2, partnerId, promocodeId2, sourceId2, userDeposit);

      await sleep(8000);
      await partner.addCpaPayment(partnerId);
      await sleep(2000);
      const { payment: payment1 } = await calculateExpectedCaseHybridPayments(partnerId, casesProfit1, cpaPayment1, 2, 'USD', 'USD', sourceId1);
      const { payment: payment2 } = await calculateExpectedCaseHybridPayments(partnerId, casesProfit2, cpaPayment2, 2, 'USD', 'EUR', sourceId2);
      // console.log(partnerEmail);
      // console.log(payment1);
      await checkSourceProfit(cookie, sourceId1, payment1, payment1);
      await checkSourceProfit(cookie, sourceId2, payment2, payment2);
      await checkSourceProfit(cookie, await partner.getSourceId(cookie), 0, 0);
    });
    it('C2157483 - Partner EUR + players RUB, EUR', async () => {
      const { cookie, info: { user: { id: partnerId } } } = await partner.registerHybrid(partnerEmail, defaultPass, 'EUR');
      await partner.setMultibalance(partnerId);
      const sourceId1 = await partner.createSource(cookie, 'source1');
      const sourceId2 = await partner.createSource(cookie, 'source2');
      const { data: { id: promocodeId1 } } = await partner
        .createPromocodeWithCPA(cookie, promocode1, sourceId1, presetId1);
      const { data: { id: promocodeId2 } } = await partner
        .createPromocodeWithCPA(cookie, promocode2, sourceId2, presetId2);

      const casesProfit1 = await regUsersAndPlayCases(2, 5, 1000, 'RUB', promocode1, partnerId, promocodeId1, sourceId1, userDeposit);
      const casesProfit2 = await regUsersAndPlayCases(2, 5, 20, 'EUR', promocode2, partnerId, promocodeId2, sourceId2, userDeposit);

      await sleep(8000);
      await partner.addCpaPayment(partnerId);
      await sleep(2000);
      const { payment: payment1 } = await calculateExpectedCaseHybridPayments(partnerId, casesProfit1, cpaPayment1, 2, 'EUR', 'RUB', sourceId1);
      const { payment: payment2 } = await calculateExpectedCaseHybridPayments(partnerId, casesProfit2, cpaPayment2, 2, 'EUR', 'EUR', sourceId2);
      // console.log(partnerEmail);
      // console.log(payment1);
      await checkSourceProfit(cookie, sourceId1, payment1, payment1);
      await checkSourceProfit(cookie, sourceId2, payment2, payment2);
      await checkSourceProfit(cookie, await partner.getSourceId(cookie), 0, 0);
    });
    it('C2157484 - Partner EUR + players USD, UAH', async () => {
      const { cookie, info: { user: { id: partnerId } } } = await partner.registerHybrid(partnerEmail, defaultPass, 'EUR');
      await partner.setMultibalance(partnerId);
      const sourceId1 = await partner.createSource(cookie, 'source1');
      const sourceId2 = await partner.createSource(cookie, 'source2');
      const { data: { id: promocodeId1 } } = await partner
        .createPromocodeWithCPA(cookie, promocode1, sourceId1, presetId1);
      const { data: { id: promocodeId2 } } = await partner
        .createPromocodeWithCPA(cookie, promocode2, sourceId2, presetId2);

      const casesProfit1 = await regUsersAndPlayCases(2, 5, 20, 'USD', promocode1, partnerId, promocodeId1, sourceId1, userDeposit);
      const casesProfit2 = await regUsersAndPlayCases(2, 5, 500, 'UAH', promocode2, partnerId, promocodeId2, sourceId2, userDeposit);

      await sleep(8000);
      await partner.addCpaPayment(partnerId);
      await sleep(2000);
      const { payment: payment1 } = await calculateExpectedCaseHybridPayments(partnerId, casesProfit1, cpaPayment1, 2, 'EUR', 'USD', sourceId1);
      const { payment: payment2 } = await calculateExpectedCaseHybridPayments(partnerId, casesProfit2, cpaPayment2, 2, 'EUR', 'UAH', sourceId2);
      // console.log(partnerEmail);
      // console.log(payment1);
      await checkSourceProfit(cookie, sourceId1, payment1, payment1);
      await checkSourceProfit(cookie, sourceId2, payment2, payment2);
      await checkSourceProfit(cookie, await partner.getSourceId(cookie), 0, 0);
    });
  });

  describe('Sources on withdrawal', () => {
    it('C2157485 - Check that there are multiple sources on withdrawal', async () => {
      const sourceName1 = `${randomStr(8)}`;
      const sourceName2 = `${randomStr(8)}`;
      const { cookie, info: { user: { id: partnerId } } } = await partner.registerHybrid(partnerEmail, defaultPass, 'RUB');
      await partner.setMultibalance(partnerId);
      const sourceId1 = await partner.createSource(cookie, sourceName1);
      const sourceId2 = await partner.createSource(cookie, sourceName2);
      const sourceIdDefault = await partner.getSourceId(cookie);

      const sources = await partner.sourcesSearch(cookie);
      // console.log(sources);
      checkSources(sources, [{ id: sourceId1, name: sourceName1, is_sub_partner: 0 },
        { id: sourceId2, name: sourceName2, is_sub_partner: 0 },
        { id: sourceIdDefault, name: 'Источник по умолчанию', is_sub_partner: 0 }]);
    });

    // пока вывод запрещен для гирбридных партнеров, когда разрешат, удалить тест
    it('C2157486 - Withdrawal is not allowed for hybrid (temp)', async () => {
      const { cookie, info: { user: { id: partnerId } } } = await partner.registerHybrid(partnerEmail, defaultPass, 'RUB');
      await partner.setMultibalance(partnerId);
      const sourceId1 = await partner.createSource(cookie, 'source1');
      const { data: user } = await register.oneClickReg();
      await sleep(1500);
      await partner.connectUser(cookie, user.email, `${rndPhoneForPartner()}`);
      const withdrawal = await partner.addWithdrawal(cookie, sourceId1, '1000');
      checkPartnerWithdrawalError(withdrawal, 400, 'hybridEnabled');
    });

    // пока вывод запрещен для гирбридных партнеров, когда разрешат, убрать скип
    describe.skip('Create withdrawal, conditions on withdrawal are not fulfilled for source', () => {
      it('C2157487 - Active users < 10, RUB', async () => {
        const { cookie, info: { user: { id: partnerId } } } = await partner.registerHybrid(partnerEmail, defaultPass, 'RUB');
        await partner.setMultibalance(partnerId);
        const sourceId1 = await partner.createSource(cookie, 'source1');
        const sourceId2 = await partner.createSource(cookie, 'source2');
        const { data: { id: promocodeId1 } } = await partner
          .createPromocodeWithCPA(cookie, promocode1, sourceId1, presetId1);
        const { data: { id: promocodeId2 } } = await partner
          .createPromocodeWithCPA(cookie, promocode2, sourceId2, presetId2);

        await regUsersAndPlayCases(8, 1, 1000, 'RUB', promocode2, partnerId, promocodeId2, sourceId2, 1000);
        await regUsersAndPlayCases(2, 5, 1000, 'RUB', promocode1, partnerId, promocodeId1, sourceId1, userDeposit);

        // console.log(partnerEmail);
        await sleep(10000);
        await partner.addCpaPayment(partnerId);
        const { data: user } = await register.oneClickReg();
        const income = await partner.getSourceIncome(cookie, sourceId1);
        // console.log(income);
        await partner.connectUser(cookie, user.email, `${rndPhoneForPartner()}`);
        const withdrawal = await partner.addWithdrawal(cookie, sourceId1,
          (income.balance).toString());
        // console.log(withdrawal);
        if (income.balance >= 5) {
          checkPartnerWithdrawalError(withdrawal, 400, 'Для вывода средств, Вам необходимо привести не менее 10 клиентов через систему реферальных ссылок, а их общая сумма депозитов должна составлять не менее 5000 RUB. На данный момент у Вас привлечено 2 активных клиентов и общая сумма их депозитов составляет 10000 RUB.');
        } else {
          checkPartnerWithdrawalError(withdrawal, 400, 'Минимальная сумма вывода - 5 RUB.');
        }
      });
      it('C2157488 - Active users < 10, USD', async () => {
        const { cookie, info: { user: { id: partnerId } } } = await partner.registerHybrid(partnerEmail, defaultPass, 'USD');
        await partner.setMultibalance(partnerId);
        const sourceId1 = await partner.createSource(cookie, 'source1');
        const sourceId2 = await partner.createSource(cookie, 'source2');
        const { data: { id: promocodeId1 } } = await partner
          .createPromocodeWithCPA(cookie, promocode1, sourceId1, presetId1);
        const { data: { id: promocodeId2 } } = await partner
          .createPromocodeWithCPA(cookie, promocode2, sourceId2, presetId2);

        await regUsersAndPlayCases(8, 1, 20, 'USD', promocode2, partnerId, promocodeId2, sourceId2, 20);
        await regUsersAndPlayCases(2, 5, 20, 'USD', promocode1, partnerId, promocodeId1, sourceId1, userDeposit);

        // console.log(partnerEmail);
        await sleep(10000);
        await partner.addCpaPayment(partnerId);
        const { data: user } = await register.oneClickReg();
        const income = await partner.getSourceIncome(cookie, sourceId1);
        // console.log(income);
        await partner.connectUser(cookie, user.email, `${rndPhoneForPartner()}`);
        const withdrawal = await partner.addWithdrawal(cookie, sourceId1,
          (income.balance).toString());
        // console.log(withdrawal);
        if (income.balance >= 2) {
          checkPartnerWithdrawalError(withdrawal, 400, 'Для вывода средств, Вам необходимо привести не менее 10 клиентов через систему реферальных ссылок, а их общая сумма депозитов должна составлять не менее 80 USD. На данный момент у Вас привлечено 2 активных клиентов и общая сумма их депозитов составляет 10000 USD.');
        } else {
          checkPartnerWithdrawalError(withdrawal, 400, 'Минимальная сумма вывода - 2 USD.');
        }
      });
      it('C2157489 - Active users < 10, EUR', async () => {
        const { cookie, info: { user: { id: partnerId } } } = await partner.registerHybrid(partnerEmail, defaultPass, 'EUR');
        await partner.setMultibalance(partnerId);
        const sourceId1 = await partner.createSource(cookie, 'source1');
        const sourceId2 = await partner.createSource(cookie, 'source2');
        const { data: { id: promocodeId1 } } = await partner
          .createPromocodeWithCPA(cookie, promocode1, sourceId1, presetId1);
        const { data: { id: promocodeId2 } } = await partner
          .createPromocodeWithCPA(cookie, promocode2, sourceId2, presetId2);

        await regUsersAndPlayCases(8, 1, 20, 'EUR', promocode2, partnerId, promocodeId2, sourceId2, 20);
        await regUsersAndPlayCases(2, 5, 20, 'EUR', promocode1, partnerId, promocodeId1, sourceId1, userDeposit);

        // console.log(partnerEmail);
        await sleep(10000);
        await partner.addCpaPayment(partnerId);
        const { data: user } = await register.oneClickReg();
        const income = await partner.getSourceIncome(cookie, sourceId1);
        // console.log(income);
        await partner.connectUser(cookie, user.email, `${rndPhoneForPartner()}`);
        const withdrawal = await partner.addWithdrawal(cookie, sourceId1,
          (income.balance).toString());
        // console.log(withdrawal);
        if (income.balance >= 1) {
          checkPartnerWithdrawalError(withdrawal, 400, 'Для вывода средств, Вам необходимо привести не менее 10 клиентов через систему реферальных ссылок, а их общая сумма депозитов должна составлять не менее 70 EUR. На данный момент у Вас привлечено 2 активных клиентов и общая сумма их депозитов составляет 10000 EUR.');
        } else {
          checkPartnerWithdrawalError(withdrawal, 400, 'Минимальная сумма вывода - 1 EUR.');
        }
      });

      it('C2157490 - Deposits amount < 5000, RUB', async () => {
        const { cookie, info: { user: { id: partnerId } } } = await partner.registerHybrid(partnerEmail, defaultPass, 'RUB');
        await partner.setMultibalance(partnerId);
        const sourceId1 = await partner.createSource(cookie, 'source1');
        const sourceId2 = await partner.createSource(cookie, 'source2');
        const { data: { id: promocodeId1 } } = await partner
          .createPromocodeWithCPA(cookie, promocode1, sourceId1, presetId1);
        const { data: { id: promocodeId2 } } = await partner
          .createPromocodeWithCPA(cookie, promocode2, sourceId2, presetId2);

        await regUsersAndPlayCases(1, 1, 1000, 'RUB', promocode2, partnerId, promocodeId2, sourceId2, 10000);
        await regUsersAndPlayCases(10, 1, 100, 'RUB', promocode1, partnerId, promocodeId1, sourceId1, 200);

        // console.log(partnerEmail);
        await sleep(10000);
        await partner.addCpaPayment(partnerId);
        const { data: user } = await register.oneClickReg();
        const income = await partner.getSourceIncome(cookie, sourceId1);
        // console.log(income);
        await partner.connectUser(cookie, user.email, `${rndPhoneForPartner()}`);
        const withdrawal = await partner.addWithdrawal(cookie, sourceId1,
          (income.balance).toString());
        // console.log(withdrawal);
        if (income.balance >= 5) {
          checkPartnerWithdrawalError(withdrawal, 400, 'Для вывода средств, Вам необходимо привести не менее 10 клиентов через систему реферальных ссылок, а их общая сумма депозитов должна составлять не менее 5000 RUB. На данный момент у Вас привлечено 10 активных клиентов и общая сумма их депозитов составляет 2000 RUB.');
        } else {
          checkPartnerWithdrawalError(withdrawal, 400, 'Минимальная сумма вывода - 5 RUB.');
        }
      });
      it('C2157491 - Deposits amount < 80, USD', async () => {
        const { cookie, info: { user: { id: partnerId } } } = await partner.registerHybrid(partnerEmail, defaultPass, 'USD');
        await partner.setMultibalance(partnerId);
        const sourceId1 = await partner.createSource(cookie, 'source1');
        const sourceId2 = await partner.createSource(cookie, 'source2');
        const { data: { id: promocodeId1 } } = await partner
          .createPromocodeWithCPA(cookie, promocode1, sourceId1, presetId1);
        const { data: { id: promocodeId2 } } = await partner
          .createPromocodeWithCPA(cookie, promocode2, sourceId2, presetId2);

        await regUsersAndPlayCases(1, 1, 20, 'USD', promocode2, partnerId, promocodeId2, sourceId2, 100);
        await regUsersAndPlayCases(10, 1, 2, 'USD', promocode1, partnerId, promocodeId1, sourceId1, 5);

        // console.log(partnerEmail);
        await sleep(10000);
        await partner.addCpaPayment(partnerId);
        const { data: user } = await register.oneClickReg();
        const income = await partner.getSourceIncome(cookie, sourceId1);
        // console.log(income);
        await partner.connectUser(cookie, user.email, `${rndPhoneForPartner()}`);
        const withdrawal = await partner.addWithdrawal(cookie, sourceId1,
          (income.balance).toString());
        // console.log(withdrawal);
        if (income.balance >= 2) {
          checkPartnerWithdrawalError(withdrawal, 400, 'Для вывода средств, Вам необходимо привести не менее 10 клиентов через систему реферальных ссылок, а их общая сумма депозитов должна составлять не менее 80 USD. На данный момент у Вас привлечено 10 активных клиентов и общая сумма их депозитов составляет 50 USD.');
        } else {
          checkPartnerWithdrawalError(withdrawal, 400, 'Минимальная сумма вывода - 2 USD.');
        }
      });
      it('C2157492 - Deposits amount < 70, EUR', async () => {
        const { cookie, info: { user: { id: partnerId } } } = await partner.registerHybrid(partnerEmail, defaultPass, 'EUR');
        await partner.setMultibalance(partnerId);
        const sourceId1 = await partner.createSource(cookie, 'source1');
        const sourceId2 = await partner.createSource(cookie, 'source2');
        const { data: { id: promocodeId1 } } = await partner
          .createPromocodeWithCPA(cookie, promocode1, sourceId1, presetId1);
        const { data: { id: promocodeId2 } } = await partner
          .createPromocodeWithCPA(cookie, promocode2, sourceId2, presetId2);

        await regUsersAndPlayCases(1, 1, 20, 'EUR', promocode2, partnerId, promocodeId2, sourceId2, 100);
        await regUsersAndPlayCases(10, 1, 2, 'EUR', promocode1, partnerId, promocodeId1, sourceId1, 5);

        // console.log(partnerEmail);
        await sleep(10000);
        await partner.addCpaPayment(partnerId);
        const { data: user } = await register.oneClickReg();
        const income = await partner.getSourceIncome(cookie, sourceId1);
        // console.log(income);
        await partner.connectUser(cookie, user.email, `${rndPhoneForPartner()}`);
        const withdrawal = await partner.addWithdrawal(cookie, sourceId1,
          (income.balance).toString());
        // console.log(withdrawal);
        if (income.balance >= 1) {
          checkPartnerWithdrawalError(withdrawal, 400, 'Для вывода средств, Вам необходимо привести не менее 10 клиентов через систему реферальных ссылок, а их общая сумма депозитов должна составлять не менее 70 EUR. На данный момент у Вас привлечено 10 активных клиентов и общая сумма их депозитов составляет 50 EUR.');
        } else {
          checkPartnerWithdrawalError(withdrawal, 400, 'Минимальная сумма вывода - 1 EUR.');
        }
      });

      it('C2157493 - Withdrawal amount < 5, RUB', async () => {
        const { cookie, info: { user: { id: partnerId } } } = await partner.registerHybrid(partnerEmail, defaultPass, 'RUB');
        await partner.setMultibalance(partnerId);
        const sourceId1 = await partner.createSource(cookie, 'source1');
        const { data: user } = await register.oneClickReg();
        await sleep(1500);
        await partner.connectUser(cookie, user.email, `${rndPhoneForPartner()}`);
        const withdrawal = await partner.addWithdrawal(cookie, sourceId1, '1');
        checkPartnerWithdrawalError(withdrawal, 400, 'Минимальная сумма вывода - 5 RUB.');
      });
      it('C2157494 - Withdrawal amount < 2, USD', async () => {
        const { cookie, info: { user: { id: partnerId } } } = await partner.registerHybrid(partnerEmail, defaultPass, 'USD');
        await partner.setMultibalance(partnerId);
        const sourceId1 = await partner.createSource(cookie, 'source1');
        const { data: user } = await register.oneClickReg();
        await sleep(1500);
        await partner.connectUser(cookie, user.email, `${rndPhoneForPartner()}`);
        const withdrawal = await partner.addWithdrawal(cookie, sourceId1, '1');
        checkPartnerWithdrawalError(withdrawal, 400, 'Минимальная сумма вывода - 2 USD.');
      });
      it('C2157495 - Withdrawal amount < 1, EUR', async () => {
        const { cookie, info: { user: { id: partnerId } } } = await partner.registerHybrid(partnerEmail, defaultPass, 'EUR');
        await partner.setMultibalance(partnerId);
        const sourceId1 = await partner.createSource(cookie, 'source1');
        const { data: user } = await register.oneClickReg();
        await sleep(1500);
        await partner.connectUser(cookie, user.email, `${rndPhoneForPartner()}`);
        const withdrawal = await partner.addWithdrawal(cookie, sourceId1, '0.5');
        checkPartnerWithdrawalError(withdrawal, 400, 'Минимальная сумма вывода - 1 EUR.');
      });

      it('C2157496 - Withdrawal amount > balance, RUB', async () => {
        const { cookie, info: { user: { id: partnerId } } } = await partner.registerHybrid(partnerEmail, defaultPass, 'RUB');
        await partner.setMultibalance(partnerId);
        const sourceId1 = await partner.createSource(cookie, 'source1');
        const { data: user } = await register.oneClickReg();
        await sleep(1500);
        await partner.connectUser(cookie, user.email, `${rndPhoneForPartner()}`);
        const withdrawal = await partner.addWithdrawal(cookie, sourceId1, '1000');
        checkPartnerWithdrawalError(withdrawal, 400, 'Недостаточно средств');
      });
      it('C2157497 - Withdrawal amount > balance, USD', async () => {
        const { cookie, info: { user: { id: partnerId } } } = await partner.registerHybrid(partnerEmail, defaultPass, 'USD');
        await partner.setMultibalance(partnerId);
        const sourceId1 = await partner.createSource(cookie, 'source1');
        const { data: user } = await register.oneClickReg();
        await sleep(1500);
        await partner.connectUser(cookie, user.email, `${rndPhoneForPartner()}`);
        const withdrawal = await partner.addWithdrawal(cookie, sourceId1, '1000');
        checkPartnerWithdrawalError(withdrawal, 400, 'Недостаточно средств');
      });
      it('C2157498 - Withdrawal amount > balance, EUR', async () => {
        const { cookie, info: { user: { id: partnerId } } } = await partner.registerHybrid(partnerEmail, defaultPass, 'EUR');
        await partner.setMultibalance(partnerId);
        const sourceId1 = await partner.createSource(cookie, 'source1');
        const { data: user } = await register.oneClickReg();
        await sleep(1500);
        await partner.connectUser(cookie, user.email, `${rndPhoneForPartner()}`);
        const withdrawal = await partner.addWithdrawal(cookie, sourceId1, '1000');
        checkPartnerWithdrawalError(withdrawal, 400, 'Недостаточно средств');
      });
    });

    // пока вывод запрещен для гирбридных партнеров, когда разрешат, убрать скип
    describe.skip('Successful withdrawal from one source & check balance for all sources after', () => {
      it('C2157499 - Partner RUB', async () => {
        const { cookie, info: { user: { id: partnerId } } } = await partner.registerHybrid(partnerEmail, defaultPass, 'RUB');
        await partner.setMultibalance(partnerId);
        const sourceId1 = await partner.createSource(cookie, 'source1');
        const sourceId2 = await partner.createSource(cookie, 'source2');
        const { data: { id: promocodeId1 } } = await partner
          .createPromocodeWithCPA(cookie, promocode1, sourceId1, presetId1);
        const { data: { id: promocodeId2 } } = await partner
          .createPromocodeWithCPA(cookie, promocode2, sourceId2, presetId2);

        await regUsersAndPlayCases(10, 1, 1000, 'RUB', promocode1, partnerId, promocodeId1, sourceId1, 1000);
        await regUsersAndPlayCases(10, 1, 1000, 'RUB', promocode2, partnerId, promocodeId2, sourceId2, 1000);

        // console.log(partnerEmail);
        await sleep(10000);
        await partner.addCpaPayment(partnerId);
        const incomeBefore = await partner.getSourceIncome(cookie, sourceId1);
        // console.log(incomeBefore);
        const incomeBefore2 = await partner.getSourceIncome(cookie, sourceId2);

        const { data: user } = await register.oneClickReg();
        await partner.connectUser(cookie, user.email, `${rndPhoneForPartner()}`);
        const withdrawal = await partner.addWithdrawal(cookie, sourceId1,
          (incomeBefore.balance).toString());
        // console.log(withdrawal);
        const incomeAfter = await partner.getSourceIncome(cookie, sourceId1);
        // console.log(incomeAfter);

        checkPartnerWithdrawalSuccess(incomeAfter.profit, incomeAfter.balance,
          incomeBefore.profit, incomeBefore.balance, incomeBefore.balance);
        await checkSourceProfit(cookie, sourceId2, parseFloat(incomeBefore2.balance),
          parseFloat(incomeBefore2.profit));
        await checkSourceProfit(cookie, await partner.getSourceId(cookie), 0, 0);
      });
      it('C2157500 - Partner USD', async () => {
        const { cookie, info: { user: { id: partnerId } } } = await partner.registerHybrid(partnerEmail, defaultPass, 'USD');
        await partner.setMultibalance(partnerId);
        const sourceId1 = await partner.createSource(cookie, 'source1');
        const sourceId2 = await partner.createSource(cookie, 'source2');
        const { data: { id: promocodeId1 } } = await partner
          .createPromocodeWithCPA(cookie, promocode1, sourceId1, presetId1);
        const { data: { id: promocodeId2 } } = await partner
          .createPromocodeWithCPA(cookie, promocode2, sourceId2, presetId2);

        await regUsersAndPlayCases(10, 1, 20, 'USD', promocode1, partnerId, promocodeId1, sourceId1, 20);
        await regUsersAndPlayCases(10, 1, 20, 'USD', promocode2, partnerId, promocodeId2, sourceId2, 20);

        // console.log(partnerEmail);
        await sleep(10000);
        await partner.addCpaPayment(partnerId);
        const incomeBefore = await partner.getSourceIncome(cookie, sourceId1);
        // console.log(incomeBefore);
        const incomeBefore2 = await partner.getSourceIncome(cookie, sourceId2);

        const { data: user } = await register.oneClickReg();
        await partner.connectUser(cookie, user.email, `${rndPhoneForPartner()}`);
        const withdrawal = await partner.addWithdrawal(cookie, sourceId1,
          (incomeBefore.balance).toString());
        // console.log(withdrawal);
        const incomeAfter = await partner.getSourceIncome(cookie, sourceId1);
        // console.log(incomeAfter);

        checkPartnerWithdrawalSuccess(incomeAfter.profit, incomeAfter.balance,
          incomeBefore.profit, incomeBefore.balance, incomeBefore.balance);
        await checkSourceProfit(cookie, sourceId2, parseFloat(incomeBefore2.balance),
          parseFloat(incomeBefore2.profit));
        await checkSourceProfit(cookie, await partner.getSourceId(cookie), 0, 0);
      });
      it('C2157501 - Partner EUR', async () => {
        const { cookie, info: { user: { id: partnerId } } } = await partner.registerHybrid(partnerEmail, defaultPass, 'EUR');
        await partner.setMultibalance(partnerId);
        const sourceId1 = await partner.createSource(cookie, 'source1');
        const sourceId2 = await partner.createSource(cookie, 'source2');
        const { data: { id: promocodeId1 } } = await partner
          .createPromocodeWithCPA(cookie, promocode1, sourceId1, presetId1);
        const { data: { id: promocodeId2 } } = await partner
          .createPromocodeWithCPA(cookie, promocode2, sourceId2, presetId2);

        await regUsersAndPlayCases(10, 1, 20, 'EUR', promocode1, partnerId, promocodeId1, sourceId1, 20);
        await regUsersAndPlayCases(10, 1, 20, 'EUR', promocode2, partnerId, promocodeId2, sourceId2, 20);

        // console.log(partnerEmail);
        await sleep(10000);
        await partner.addCpaPayment(partnerId);
        const incomeBefore = await partner.getSourceIncome(cookie, sourceId1);
        // console.log(incomeBefore);
        const incomeBefore2 = await partner.getSourceIncome(cookie, sourceId2);

        const { data: user } = await register.oneClickReg();
        await partner.connectUser(cookie, user.email, `${rndPhoneForPartner()}`);
        const withdrawal = await partner.addWithdrawal(cookie, sourceId1,
          (incomeBefore.balance).toString());
        // console.log(withdrawal);
        const incomeAfter = await partner.getSourceIncome(cookie, sourceId1);
        // console.log(incomeAfter);

        checkPartnerWithdrawalSuccess(incomeAfter.profit, incomeAfter.balance,
          incomeBefore.profit, incomeBefore.balance, incomeBefore.balance);
        await checkSourceProfit(cookie, sourceId2, parseFloat(incomeBefore2.balance),
          parseFloat(incomeBefore2.profit));
        await checkSourceProfit(cookie, await partner.getSourceId(cookie), 0, 0);
      });
    });
  });
});
