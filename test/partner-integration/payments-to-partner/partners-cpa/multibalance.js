/**
 * @jest-environment node
 */

import { rndPhoneForPartner, sleep } from '../../../../src/methods/utils';
import { randomStr } from '../../../../src/randomizer';
import { partner } from '../../../../src/methods/partner';
import { register } from '../../../../src/methods/register';
import { regUsersAndPlayCases } from '../../../../src/methods/regUsersForPartner';
import {
  calculateExpectedCpaPayments, checkPartnerError, checkPartnerWithdrawalSuccess,
  checkSourceProfit,
  checkSources,
} from '../../../../src/expects/exPartner';
import { mysqlConnection } from '../../../../src/methods/mysqlConnection';

const defaultPass = '123123AA';
const cpaPayment1 = 1;
const cpaPayment2 = 2;
const userDeposit = 5000;

// skip т.к. для cpa мультибаланс сейчас не включается
describe.skip('CPA multibalance tests', () => {
  /* eslint no-await-in-loop: off */
  let presetId1;
  let presetId2;
  let partnerEmail;
  let promocode1;
  let promocode2;

  beforeAll(async () => {
    const dbResult = await mysqlConnection.executeQuery('DELETE FROM 1win.riskmanagement_ip_log;');
    // console.log(dbResult);
    await sleep(1500);

    presetId1 = await partner.createPreset(0, 0, 0, 0, 1, 100000, cpaPayment1);
    presetId2 = await partner.createPreset(0, 0, 0, 0, 1, 100000, cpaPayment2);
  });

  beforeEach(async () => {
    partnerEmail = `${randomStr(10)}@ahem.email`;
    promocode1 = `${randomStr(8)}`;
    promocode2 = `${randomStr(8)}`;
  });

  describe('Two sources + default, check source stats', () => {
    it('C2152772 - Partner RUB + players RUB, USD', async () => {
      const { cookie, info: { user: { id: partnerId } } } = await partner.registerCPA(partnerEmail, defaultPass, 'RUB');
      await partner.setMultibalance(partnerId);
      const sourceId1 = await partner.createSource(cookie, 'source1');
      const sourceId2 = await partner.createSource(cookie, 'source2');
      const { data: { id: promocodeId1 } } = await partner
        .createPromocodeWithCPA(cookie, promocode1, sourceId1, presetId1);
      const { data: { id: promocodeId2 } } = await partner
        .createPromocodeWithCPA(cookie, promocode2, sourceId2, presetId2);

      await regUsersAndPlayCases(2, 5, 1000, 'RUB', promocode1, partnerId, promocodeId1, sourceId1, userDeposit);
      await regUsersAndPlayCases(2, 5, 20, 'USD', promocode2, partnerId, promocodeId2, sourceId2, userDeposit);

      const payment1 = await calculateExpectedCpaPayments(cpaPayment1 * 2, 'RUB');
      const payment2 = await calculateExpectedCpaPayments(cpaPayment2 * 2, 'RUB');
      // console.log(partnerEmail);
      // console.log(payment1);
      await sleep(8000);
      await partner.addCpaPaymentCk(partnerId);
      await sleep(2000);
      await checkSourceProfit(cookie, sourceId1, payment1, payment1);
      await checkSourceProfit(cookie, sourceId2, payment2, payment2);
      await checkSourceProfit(cookie, await partner.getSourceId(cookie), 0, 0);
    });
    it('C2152773 - Partner RUB + players EUR, UAH', async () => {
      const { cookie, info: { user: { id: partnerId } } } = await partner.registerCPA(partnerEmail, defaultPass, 'RUB');
      await partner.setMultibalance(partnerId);
      const sourceId1 = await partner.createSource(cookie, 'source1');
      const sourceId2 = await partner.createSource(cookie, 'source2');
      const { data: { id: promocodeId1 } } = await partner
        .createPromocodeWithCPA(cookie, promocode1, sourceId1, presetId1);
      const { data: { id: promocodeId2 } } = await partner
        .createPromocodeWithCPA(cookie, promocode2, sourceId2, presetId2);

      await regUsersAndPlayCases(2, 5, 20, 'EUR', promocode1, partnerId, promocodeId1, sourceId1, userDeposit);
      await regUsersAndPlayCases(2, 5, 500, 'UAH', promocode2, partnerId, promocodeId2, sourceId2, userDeposit);

      const payment1 = await calculateExpectedCpaPayments(cpaPayment1 * 2, 'RUB');
      const payment2 = await calculateExpectedCpaPayments(cpaPayment2 * 2, 'RUB');
      // console.log(partnerEmail);
      // console.log(payment1);
      await sleep(8000);
      await partner.addCpaPaymentCk(partnerId);
      await sleep(2000);
      await checkSourceProfit(cookie, sourceId1, payment1, payment1);
      await checkSourceProfit(cookie, sourceId2, payment2, payment2);
      await checkSourceProfit(cookie, await partner.getSourceId(cookie), 0, 0);
    });
    it('C2152774 - Partner USD + players RUB, UAH', async () => {
      const { cookie, info: { user: { id: partnerId } } } = await partner.registerCPA(partnerEmail, defaultPass, 'USD');
      await partner.setMultibalance(partnerId);
      const sourceId1 = await partner.createSource(cookie, 'source1');
      const sourceId2 = await partner.createSource(cookie, 'source2');
      const { data: { id: promocodeId1 } } = await partner
        .createPromocodeWithCPA(cookie, promocode1, sourceId1, presetId1);
      const { data: { id: promocodeId2 } } = await partner
        .createPromocodeWithCPA(cookie, promocode2, sourceId2, presetId2);

      await regUsersAndPlayCases(2, 5, 1000, 'RUB', promocode1, partnerId, promocodeId1, sourceId1, userDeposit);
      await regUsersAndPlayCases(2, 5, 500, 'UAH', promocode2, partnerId, promocodeId2, sourceId2, userDeposit);

      const payment1 = await calculateExpectedCpaPayments(cpaPayment1 * 2, 'USD');
      const payment2 = await calculateExpectedCpaPayments(cpaPayment2 * 2, 'USD');
      // console.log(partnerEmail);
      // console.log(payment1);
      await sleep(8000);
      await partner.addCpaPaymentCk(partnerId);
      await sleep(2000);
      await checkSourceProfit(cookie, sourceId1, payment1, payment1);
      await checkSourceProfit(cookie, sourceId2, payment2, payment2);
      await checkSourceProfit(cookie, await partner.getSourceId(cookie), 0, 0);
    });
    it('C2152775 - Partner USD + players USD, EUR', async () => {
      const { cookie, info: { user: { id: partnerId } } } = await partner.registerCPA(partnerEmail, defaultPass, 'USD');
      await partner.setMultibalance(partnerId);
      const sourceId1 = await partner.createSource(cookie, 'source1');
      const sourceId2 = await partner.createSource(cookie, 'source2');
      const { data: { id: promocodeId1 } } = await partner
        .createPromocodeWithCPA(cookie, promocode1, sourceId1, presetId1);
      const { data: { id: promocodeId2 } } = await partner
        .createPromocodeWithCPA(cookie, promocode2, sourceId2, presetId2);

      await regUsersAndPlayCases(2, 5, 20, 'USD', promocode1, partnerId, promocodeId1, sourceId1, userDeposit);
      await regUsersAndPlayCases(2, 5, 20, 'EUR', promocode2, partnerId, promocodeId2, sourceId2, userDeposit);

      const payment1 = await calculateExpectedCpaPayments(cpaPayment1 * 2, 'USD');
      const payment2 = await calculateExpectedCpaPayments(cpaPayment2 * 2, 'USD');
      // console.log(partnerEmail);
      // console.log(payment1);
      await sleep(8000);
      await partner.addCpaPaymentCk(partnerId);
      await sleep(2000);
      await checkSourceProfit(cookie, sourceId1, payment1, payment1);
      await checkSourceProfit(cookie, sourceId2, payment2, payment2);
      await checkSourceProfit(cookie, await partner.getSourceId(cookie), 0, 0);
    });
    it('C2152776 - Partner EUR + players RUB, EUR', async () => {
      const { cookie, info: { user: { id: partnerId } } } = await partner.registerCPA(partnerEmail, defaultPass, 'EUR');
      await partner.setMultibalance(partnerId);
      const sourceId1 = await partner.createSource(cookie, 'source1');
      const sourceId2 = await partner.createSource(cookie, 'source2');
      const { data: { id: promocodeId1 } } = await partner
        .createPromocodeWithCPA(cookie, promocode1, sourceId1, presetId1);
      const { data: { id: promocodeId2 } } = await partner
        .createPromocodeWithCPA(cookie, promocode2, sourceId2, presetId2);

      await regUsersAndPlayCases(2, 5, 1000, 'RUB', promocode1, partnerId, promocodeId1, sourceId1, userDeposit);
      await regUsersAndPlayCases(2, 5, 20, 'EUR', promocode2, partnerId, promocodeId2, sourceId2, userDeposit);

      const payment1 = await calculateExpectedCpaPayments(cpaPayment1 * 2, 'EUR');
      const payment2 = await calculateExpectedCpaPayments(cpaPayment2 * 2, 'EUR');
      // console.log(partnerEmail);
      // console.log(payment1);
      await sleep(8000);
      await partner.addCpaPaymentCk(partnerId);
      await sleep(2000);
      await checkSourceProfit(cookie, sourceId1, payment1, payment1);
      await checkSourceProfit(cookie, sourceId2, payment2, payment2);
      await checkSourceProfit(cookie, await partner.getSourceId(cookie), 0, 0);
    });
    it('C2152777 - Partner EUR + players USD, UAH', async () => {
      const { cookie, info: { user: { id: partnerId } } } = await partner.registerCPA(partnerEmail, defaultPass, 'EUR');
      await partner.setMultibalance(partnerId);
      const sourceId1 = await partner.createSource(cookie, 'source1');
      const sourceId2 = await partner.createSource(cookie, 'source2');
      const { data: { id: promocodeId1 } } = await partner
        .createPromocodeWithCPA(cookie, promocode1, sourceId1, presetId1);
      const { data: { id: promocodeId2 } } = await partner
        .createPromocodeWithCPA(cookie, promocode2, sourceId2, presetId2);

      await regUsersAndPlayCases(2, 5, 20, 'USD', promocode1, partnerId, promocodeId1, sourceId1, userDeposit);
      await regUsersAndPlayCases(2, 5, 500, 'UAH', promocode2, partnerId, promocodeId2, sourceId2, userDeposit);

      const payment1 = await calculateExpectedCpaPayments(cpaPayment1 * 2, 'EUR');
      const payment2 = await calculateExpectedCpaPayments(cpaPayment2 * 2, 'EUR');
      // console.log(partnerEmail);
      // console.log(payment1);
      await sleep(8000);
      await partner.addCpaPaymentCk(partnerId);
      await sleep(2000);
      await checkSourceProfit(cookie, sourceId1, payment1, payment1);
      await checkSourceProfit(cookie, sourceId2, payment2, payment2);
      await checkSourceProfit(cookie, await partner.getSourceId(cookie), 0, 0);
    });
  });

  describe('Sources on withdrawal', () => {
    it('C2152778 - Check that there are multiple sources on withdrawal', async () => {
      const sourceName1 = `${randomStr(8)}`;
      const sourceName2 = `${randomStr(8)}`;
      const { cookie, info: { user: { id: partnerId } } } = await partner.registerCPA(partnerEmail, defaultPass, 'RUB');
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

    describe('Create withdrawal, conditions on withdrawal are not fulfilled for source', () => {
      it('C2152779 - Active users < 10, RUB', async () => {
        const { cookie, info: { user: { id: partnerId } } } = await partner.registerCPA(partnerEmail, defaultPass, 'RUB');
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
        await partner.addCpaPaymentCk(partnerId);
        const { data: user } = await register.oneClickReg();
        const income = await partner.getSourceIncome(cookie, sourceId1);
        // console.log(income);
        await partner.connectUser(cookie, user.email, `${rndPhoneForPartner()}`);
        const withdrawal = await partner.addWithdrawal(cookie,
          (income.balance).toString(), sourceId1);
        // console.log(withdrawal);
        checkPartnerError(withdrawal, 400, 'Для вывода средств, Вам необходимо привести не менее 10 клиентов через систему реферальных ссылок, а их общая сумма депозитов должна составлять не менее 5000 RUB. На данный момент у Вас привлечено 2 активных клиентов и общая сумма их депозитов составляет 10000 RUB.');
      });
      it('C2152780 - Active users < 10, USD', async () => {
        const { cookie, info: { user: { id: partnerId } } } = await partner.registerCPA(partnerEmail, defaultPass, 'USD');
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
        await partner.addCpaPaymentCk(partnerId);
        const { data: user } = await register.oneClickReg();
        const income = await partner.getSourceIncome(cookie, sourceId1);
        // console.log(income);
        await partner.connectUser(cookie, user.email, `${rndPhoneForPartner()}`);
        const withdrawal = await partner.addWithdrawal(cookie,
          (income.balance).toString(), sourceId1);
        // console.log(withdrawal);
        checkPartnerError(withdrawal, 400, 'Для вывода средств, Вам необходимо привести не менее 10 клиентов через систему реферальных ссылок, а их общая сумма депозитов должна составлять не менее 80 USD. На данный момент у Вас привлечено 2 активных клиентов и общая сумма их депозитов составляет 10000 USD.');
      });
      it('C2152781 - Active users < 10, EUR', async () => {
        const { cookie, info: { user: { id: partnerId } } } = await partner.registerCPA(partnerEmail, defaultPass, 'EUR');
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
        await partner.addCpaPaymentCk(partnerId);
        const { data: user } = await register.oneClickReg();
        const income = await partner.getSourceIncome(cookie, sourceId1);
        // console.log(income);
        await partner.connectUser(cookie, user.email, `${rndPhoneForPartner()}`);
        const withdrawal = await partner.addWithdrawal(cookie,
          (income.balance).toString(), sourceId1);
        // console.log(withdrawal);
        checkPartnerError(withdrawal, 400, 'Для вывода средств, Вам необходимо привести не менее 10 клиентов через систему реферальных ссылок, а их общая сумма депозитов должна составлять не менее 70 EUR. На данный момент у Вас привлечено 2 активных клиентов и общая сумма их депозитов составляет 10000 EUR.');
      });

      it('C2152782 - Deposits amount < 5000, RUB', async () => {
        const { cookie, info: { user: { id: partnerId } } } = await partner.registerCPA(partnerEmail, defaultPass, 'RUB');
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
        await partner.addCpaPaymentCk(partnerId);
        const { data: user } = await register.oneClickReg();
        const income = await partner.getSourceIncome(cookie, sourceId1);
        // console.log(income);
        await partner.connectUser(cookie, user.email, `${rndPhoneForPartner()}`);
        const withdrawal = await partner.addWithdrawal(cookie,
          (income.balance).toString(), sourceId1);
        // console.log(withdrawal);
        checkPartnerError(withdrawal, 400, 'Для вывода средств, Вам необходимо привести не менее 10 клиентов через систему реферальных ссылок, а их общая сумма депозитов должна составлять не менее 5000 RUB. На данный момент у Вас привлечено 10 активных клиентов и общая сумма их депозитов составляет 2000 RUB.');
      });
      it('C2152783 - Deposits amount < 80, USD', async () => {
        const { cookie, info: { user: { id: partnerId } } } = await partner.registerCPA(partnerEmail, defaultPass, 'USD');
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
        await partner.addCpaPaymentCk(partnerId);
        const { data: user } = await register.oneClickReg();
        const income = await partner.getSourceIncome(cookie, sourceId1);
        // console.log(income);
        await partner.connectUser(cookie, user.email, `${rndPhoneForPartner()}`);
        const withdrawal = await partner.addWithdrawal(cookie,
          (income.balance).toString(), sourceId1);
        // console.log(withdrawal);
        checkPartnerError(withdrawal, 400, 'Для вывода средств, Вам необходимо привести не менее 10 клиентов через систему реферальных ссылок, а их общая сумма депозитов должна составлять не менее 80 USD. На данный момент у Вас привлечено 10 активных клиентов и общая сумма их депозитов составляет 50 USD.');
      });
      it('C2152784 - Deposits amount < 70, EUR', async () => {
        const { cookie, info: { user: { id: partnerId } } } = await partner.registerCPA(partnerEmail, defaultPass, 'EUR');
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
        await partner.addCpaPaymentCk(partnerId);
        const { data: user } = await register.oneClickReg();
        const income = await partner.getSourceIncome(cookie, sourceId1);
        // console.log(income);
        await partner.connectUser(cookie, user.email, `${rndPhoneForPartner()}`);
        const withdrawal = await partner.addWithdrawal(cookie,
          (income.balance).toString(), sourceId1);
        // console.log(withdrawal);
        checkPartnerError(withdrawal, 400, 'Для вывода средств, Вам необходимо привести не менее 10 клиентов через систему реферальных ссылок, а их общая сумма депозитов должна составлять не менее 70 EUR. На данный момент у Вас привлечено 10 активных клиентов и общая сумма их депозитов составляет 50 EUR.');
      });

      it('C2152785 - Withdrawal amount < 5, RUB', async () => {
        const { cookie, info: { user: { id: partnerId } } } = await partner.registerCPA(partnerEmail, defaultPass, 'RUB');
        await partner.setMultibalance(partnerId);
        const sourceId1 = await partner.createSource(cookie, 'source1');
        const { data: user } = await register.oneClickReg();
        await sleep(1500);
        await partner.connectUser(cookie, user.email, `${rndPhoneForPartner()}`);
        const withdrawal = await partner.addWithdrawal(cookie, '1', sourceId1);
        checkPartnerError(withdrawal, 400, 'Минимальная сумма вывода - 5 RUB.');
      });
      it('C2152786 - Withdrawal amount < 2, USD', async () => {
        const { cookie, info: { user: { id: partnerId } } } = await partner.registerCPA(partnerEmail, defaultPass, 'USD');
        await partner.setMultibalance(partnerId);
        const sourceId1 = await partner.createSource(cookie, 'source1');
        const { data: user } = await register.oneClickReg();
        await sleep(1500);
        await partner.connectUser(cookie, user.email, `${rndPhoneForPartner()}`);
        const withdrawal = await partner.addWithdrawal(cookie, '1', sourceId1);
        checkPartnerError(withdrawal, 400, 'Минимальная сумма вывода - 2 USD.');
      });
      it('C2152787 - Withdrawal amount < 1, EUR', async () => {
        const { cookie, info: { user: { id: partnerId } } } = await partner.registerCPA(partnerEmail, defaultPass, 'EUR');
        await partner.setMultibalance(partnerId);
        const sourceId1 = await partner.createSource(cookie, 'source1');
        const { data: user } = await register.oneClickReg();
        await sleep(1500);
        await partner.connectUser(cookie, user.email, `${rndPhoneForPartner()}`);
        const withdrawal = await partner.addWithdrawal(cookie, '0.5', sourceId1);
        checkPartnerError(withdrawal, 400, 'Минимальная сумма вывода - 1 EUR.');
      });

      it('C2157473 - Withdrawal amount > balance, RUB', async () => {
        const { cookie, info: { user: { id: partnerId } } } = await partner.registerCPA(partnerEmail, defaultPass, 'RUB');
        await partner.setMultibalance(partnerId);
        const sourceId1 = await partner.createSource(cookie, 'source1');
        const { data: user } = await register.oneClickReg();
        await sleep(1500);
        await partner.connectUser(cookie, user.email, `${rndPhoneForPartner()}`);
        const withdrawal = await partner.addWithdrawal(cookie, '1000', sourceId1);
        checkPartnerError(withdrawal, 400, 'Недостаточно средств');
      });
      it('C2157474 - Withdrawal amount > balance, USD', async () => {
        const { cookie, info: { user: { id: partnerId } } } = await partner.registerCPA(partnerEmail, defaultPass, 'USD');
        await partner.setMultibalance(partnerId);
        const sourceId1 = await partner.createSource(cookie, 'source1');
        const { data: user } = await register.oneClickReg();
        await sleep(1500);
        await partner.connectUser(cookie, user.email, `${rndPhoneForPartner()}`);
        const withdrawal = await partner.addWithdrawal(cookie, '1000', sourceId1);
        checkPartnerError(withdrawal, 400, 'Недостаточно средств');
      });
      it('C2157475 - Withdrawal amount > balance, EUR', async () => {
        const { cookie, info: { user: { id: partnerId } } } = await partner.registerCPA(partnerEmail, defaultPass, 'EUR');
        await partner.setMultibalance(partnerId);
        const sourceId1 = await partner.createSource(cookie, 'source1');
        const { data: user } = await register.oneClickReg();
        await sleep(1500);
        await partner.connectUser(cookie, user.email, `${rndPhoneForPartner()}`);
        const withdrawal = await partner.addWithdrawal(cookie, '1000', sourceId1);
        checkPartnerError(withdrawal, 400, 'Недостаточно средств');
      });
    });

    describe('Successful withdrawal from one source & check balance for all sources after', () => {
      it('C2152788 - Partner RUB', async () => {
        const { cookie, info: { user: { id: partnerId } } } = await partner.registerCPA(partnerEmail, defaultPass, 'RUB');
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
        await partner.addCpaPaymentCk(partnerId);
        const incomeBefore = await partner.getSourceIncome(cookie, sourceId1);
        // console.log(incomeBefore);
        const incomeBefore2 = await partner.getSourceIncome(cookie, sourceId2);

        const { data: user } = await register.oneClickReg();
        await partner.connectUser(cookie, user.email, `${rndPhoneForPartner()}`);
        const withdrawal = await partner.addWithdrawal(cookie,
          (incomeBefore.balance).toString(), sourceId1);
        // console.log(withdrawal);
        const incomeAfter = await partner.getSourceIncome(cookie, sourceId1);
        // console.log(incomeAfter);

        checkPartnerWithdrawalSuccess(incomeAfter.profit, incomeAfter.balance,
          incomeBefore.profit, incomeBefore.balance, incomeBefore.balance);
        await checkSourceProfit(cookie, sourceId2, parseFloat(incomeBefore2.balance),
          parseFloat(incomeBefore2.profit));
        await checkSourceProfit(cookie, await partner.getSourceId(cookie), 0, 0);
      });
      it('C2152789 - Partner USD', async () => {
        const { cookie, info: { user: { id: partnerId } } } = await partner.registerCPA(partnerEmail, defaultPass, 'USD');
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
        await partner.addCpaPaymentCk(partnerId);
        const incomeBefore = await partner.getSourceIncome(cookie, sourceId1);
        // console.log(incomeBefore);
        const incomeBefore2 = await partner.getSourceIncome(cookie, sourceId2);

        const { data: user } = await register.oneClickReg();
        await partner.connectUser(cookie, user.email, `${rndPhoneForPartner()}`);
        const withdrawal = await partner.addWithdrawal(cookie,
          (incomeBefore.balance).toString(), sourceId1);
        // console.log(withdrawal);
        const incomeAfter = await partner.getSourceIncome(cookie, sourceId1);
        // console.log(incomeAfter);

        checkPartnerWithdrawalSuccess(incomeAfter.profit, incomeAfter.balance,
          incomeBefore.profit, incomeBefore.balance, incomeBefore.balance);
        await checkSourceProfit(cookie, sourceId2, parseFloat(incomeBefore2.balance),
          parseFloat(incomeBefore2.profit));
        await checkSourceProfit(cookie, await partner.getSourceId(cookie), 0, 0);
      });
      it('C2152790 - Partner EUR', async () => {
        const { cookie, info: { user: { id: partnerId } } } = await partner.registerCPA(partnerEmail, defaultPass, 'EUR');
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
        await partner.addCpaPaymentCk(partnerId);
        const incomeBefore = await partner.getSourceIncome(cookie, sourceId1);
        // console.log(incomeBefore);
        const incomeBefore2 = await partner.getSourceIncome(cookie, sourceId2);

        const { data: user } = await register.oneClickReg();
        await partner.connectUser(cookie, user.email, `${rndPhoneForPartner()}`);
        const withdrawal = await partner.addWithdrawal(cookie,
          (incomeBefore.balance).toString(), sourceId1);
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
