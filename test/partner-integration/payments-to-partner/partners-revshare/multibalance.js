/**
 * @jest-environment node
 */


import { randomStr } from '../../../../src/randomizer';
import { partner } from '../../../../src/methods/partner';
import { register } from '../../../../src/methods/register';
import { regUsersAndPlayCases } from '../../../../src/methods/regUsersForPartner';
import {
  calculateExpectedCasePayments,
  checkPartnerError, checkPartnerWithdrawalSuccess,
  checkSourceProfit,
  checkSources,
} from '../../../../src/expects/exPartner';
import { sleep, rndPhoneForPartner } from '../../../../src/methods/utils';
import { mysqlConnection } from '../../../../src/methods/mysqlConnection';

const defaultPass = '123123AA';
const userDeposit = 5000;

describe('Revshare multibalance tests', () => {
  /* eslint no-await-in-loop: off */
  let partnerEmail;
  let promocode1;
  let promocode2;

  beforeAll(async () => {
    const dbResult = await mysqlConnection.executeQuery('DELETE FROM 1win.riskmanagement_ip_log;');
    // console.log(dbResult);
    await sleep(1500);
  });

  beforeEach(async () => {
    partnerEmail = `${randomStr(10)}@ahem.email`;
    promocode1 = `${randomStr(8)}`;
    promocode2 = `${randomStr(8)}`;
  });

  describe('Two sources + default, check source stats', () => {
    it('C2149723 - Partner RUB + players RUB, USD', async () => {
      const { cookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
      await partner.setMultibalance(partnerId);
      const sourceId1 = await partner.createSource(cookie, 'source1');
      const sourceId2 = await partner.createSource(cookie, 'source2');
      const { data: { id: promocodeId1 } } = await partner
        .createPromocode(cookie, promocode1, sourceId1);
      const { data: { id: promocodeId2 } } = await partner
        .createPromocode(cookie, promocode2, sourceId2);

      const { caseResults: caseResults1 } = await regUsersAndPlayCases(2, 5, 1000, 'RUB', promocode1, partnerId, promocodeId1, sourceId1, userDeposit);
      const { caseResults: caseResults2 } = await regUsersAndPlayCases(2, 5, 20, 'USD', promocode2, partnerId, promocodeId2, sourceId2, userDeposit);

      const { payment: payment1 } = await calculateExpectedCasePayments(caseResults1, 'RUB', 'RUB');
      const { payment: payment2 } = await calculateExpectedCasePayments(caseResults2, 'RUB', 'USD');
      // console.log(partnerEmail);
      // console.log(payment1);
      await sleep(10000);
      await checkSourceProfit(cookie, sourceId1, payment1, payment1);
      await checkSourceProfit(cookie, sourceId2, payment2, payment2);
      await checkSourceProfit(cookie, await partner.getSourceId(cookie), 0, 0);
    });
    it('C2149724 - Partner RUB + players EUR, UAH', async () => {
      const { cookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
      await partner.setMultibalance(partnerId);
      const sourceId1 = await partner.createSource(cookie, 'source1');
      const sourceId2 = await partner.createSource(cookie, 'source2');
      const { data: { id: promocodeId1 } } = await partner
        .createPromocode(cookie, promocode1, sourceId1);
      const { data: { id: promocodeId2 } } = await partner
        .createPromocode(cookie, promocode2, sourceId2);

      const { caseResults: caseResults1 } = await regUsersAndPlayCases(2, 5, 20, 'EUR', promocode1, partnerId, promocodeId1, sourceId1, userDeposit);
      const { caseResults: caseResults2 } = await regUsersAndPlayCases(2, 5, 500, 'UAH', promocode2, partnerId, promocodeId2, sourceId2, userDeposit);

      const { payment: payment1 } = await calculateExpectedCasePayments(caseResults1, 'RUB', 'EUR');
      const { payment: payment2 } = await calculateExpectedCasePayments(caseResults2, 'RUB', 'UAH');
      // console.log(partnerEmail);
      // console.log(payment1);
      await sleep(10000);
      await checkSourceProfit(cookie, sourceId1, payment1, payment1);
      await checkSourceProfit(cookie, sourceId2, payment2, payment2);
      await checkSourceProfit(cookie, await partner.getSourceId(cookie), 0, 0);
    });
    it('C2149725 - Partner USD + players RUB, UAH', async () => {
      const { cookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
      await partner.setMultibalance(partnerId);
      const sourceId1 = await partner.createSource(cookie, 'source1');
      const sourceId2 = await partner.createSource(cookie, 'source2');
      const { data: { id: promocodeId1 } } = await partner
        .createPromocode(cookie, promocode1, sourceId1);
      const { data: { id: promocodeId2 } } = await partner
        .createPromocode(cookie, promocode2, sourceId2);

      const { caseResults: caseResults1 } = await regUsersAndPlayCases(2, 5, 1000, 'RUB', promocode1, partnerId, promocodeId1, sourceId1, userDeposit);
      const { caseResults: caseResults2 } = await regUsersAndPlayCases(2, 5, 500, 'UAH', promocode2, partnerId, promocodeId2, sourceId2, userDeposit);

      const { payment: payment1 } = await calculateExpectedCasePayments(caseResults1, 'USD', 'RUB');
      const { payment: payment2 } = await calculateExpectedCasePayments(caseResults2, 'USD', 'UAH');
      // console.log(partnerEmail);
      // console.log(payment1);
      await sleep(10000);
      await checkSourceProfit(cookie, sourceId1, payment1, payment1);
      await checkSourceProfit(cookie, sourceId2, payment2, payment2);
      await checkSourceProfit(cookie, await partner.getSourceId(cookie), 0, 0);
    });
    it('C2149726 - Partner USD + players USD, EUR', async () => {
      const { cookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
      await partner.setMultibalance(partnerId);
      const sourceId1 = await partner.createSource(cookie, 'source1');
      const sourceId2 = await partner.createSource(cookie, 'source2');
      const { data: { id: promocodeId1 } } = await partner
        .createPromocode(cookie, promocode1, sourceId1);
      const { data: { id: promocodeId2 } } = await partner
        .createPromocode(cookie, promocode2, sourceId2);

      const { caseResults: caseResults1 } = await regUsersAndPlayCases(2, 5, 20, 'USD', promocode1, partnerId, promocodeId1, sourceId1, userDeposit);
      const { caseResults: caseResults2 } = await regUsersAndPlayCases(2, 5, 20, 'EUR', promocode2, partnerId, promocodeId2, sourceId2, userDeposit);

      const { payment: payment1 } = await calculateExpectedCasePayments(caseResults1, 'USD', 'USD');
      const { payment: payment2 } = await calculateExpectedCasePayments(caseResults2, 'USD', 'EUR');
      // console.log(partnerEmail);
      // console.log(payment1);
      await sleep(10000);
      await checkSourceProfit(cookie, sourceId1, payment1, payment1);
      await checkSourceProfit(cookie, sourceId2, payment2, payment2);
      await checkSourceProfit(cookie, await partner.getSourceId(cookie), 0, 0);
    });
    it('C2149727 - Partner EUR + players RUB, EUR', async () => {
      const { cookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
      await partner.setMultibalance(partnerId);
      const sourceId1 = await partner.createSource(cookie, 'source1');
      const sourceId2 = await partner.createSource(cookie, 'source2');
      const { data: { id: promocodeId1 } } = await partner
        .createPromocode(cookie, promocode1, sourceId1);
      const { data: { id: promocodeId2 } } = await partner
        .createPromocode(cookie, promocode2, sourceId2);

      const { caseResults: caseResults1 } = await regUsersAndPlayCases(2, 5, 1000, 'RUB', promocode1, partnerId, promocodeId1, sourceId1, userDeposit);
      const { caseResults: caseResults2 } = await regUsersAndPlayCases(2, 5, 20, 'EUR', promocode2, partnerId, promocodeId2, sourceId2, userDeposit);

      const { payment: payment1 } = await calculateExpectedCasePayments(caseResults1, 'EUR', 'RUB');
      const { payment: payment2 } = await calculateExpectedCasePayments(caseResults2, 'EUR', 'EUR');
      // console.log(partnerEmail);
      // console.log(payment1);
      await sleep(10000);
      await checkSourceProfit(cookie, sourceId1, payment1, payment1);
      await checkSourceProfit(cookie, sourceId2, payment2, payment2);
      await checkSourceProfit(cookie, await partner.getSourceId(cookie), 0, 0);
    });
    it('C2149728 - Partner EUR + players USD, UAH', async () => {
      const { cookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
      await partner.setMultibalance(partnerId);
      const sourceId1 = await partner.createSource(cookie, 'source1');
      const sourceId2 = await partner.createSource(cookie, 'source2');
      const { data: { id: promocodeId1 } } = await partner
        .createPromocode(cookie, promocode1, sourceId1);
      const { data: { id: promocodeId2 } } = await partner
        .createPromocode(cookie, promocode2, sourceId2);

      const { caseResults: caseResults1 } = await regUsersAndPlayCases(2, 5, 20, 'USD', promocode1, partnerId, promocodeId1, sourceId1, userDeposit);
      const { caseResults: caseResults2 } = await regUsersAndPlayCases(2, 5, 500, 'UAH', promocode2, partnerId, promocodeId2, sourceId2, userDeposit);

      const { payment: payment1 } = await calculateExpectedCasePayments(caseResults1, 'EUR', 'USD');
      const { payment: payment2 } = await calculateExpectedCasePayments(caseResults2, 'EUR', 'UAH');
      // console.log(partnerEmail);
      // console.log(payment1);
      await sleep(10000);
      await checkSourceProfit(cookie, sourceId1, payment1, payment1);
      await checkSourceProfit(cookie, sourceId2, payment2, payment2);
      await checkSourceProfit(cookie, await partner.getSourceId(cookie), 0, 0);
    });
  });

  describe('Sources on withdrawal', () => {
    it('C2149729 - Check that there are multiple sources on withdrawal', async () => {
      const sourceName1 = `${randomStr(8)}`;
      const sourceName2 = `${randomStr(8)}`;
      const { cookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
      await partner.setMultibalance(partnerId);
      const sourceId1 = await partner.createSource(cookie, sourceName1);
      const sourceId2 = await partner.createSource(cookie, sourceName2);
      const sourceIdDefault = await partner.getSourceId(cookie);

      const sources = await partner.sourcesSearch(cookie);
      // console.log(sources);
      checkSources(sources, [{ id: sourceId1, name: sourceName1, is_sub_partner: 0 },
        { id: sourceId2, name: sourceName2, is_sub_partner: 0 },
        { id: sourceIdDefault, name: '???????????????? ???? ??????????????????', is_sub_partner: 0 }]);
    });

    describe('Create withdrawal, conditions on withdrawal are not fulfilled', () => {
      it('C2149730 - Active users < 10, RUB', async () => {
        const { cookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
        await partner.setMultibalance(partnerId);
        const sourceId1 = await partner.createSource(cookie, 'sourceName1');
        const sourceId2 = await partner.createSource(cookie, 'sourceName2');
        const { data: { id: promocodeId1 } } = await partner
          .createPromocode(cookie, promocode1, sourceId1);
        const { data: { id: promocodeId2 } } = await partner
          .createPromocode(cookie, promocode2, sourceId2);
        await regUsersAndPlayCases(8, 1, 500, 'RUB', promocode2, partnerId, promocodeId2, sourceId2, userDeposit);
        await regUsersAndPlayCases(2, 5, 1000, 'RUB', promocode1, partnerId, promocodeId1, sourceId1, userDeposit);

        // console.log(partnerEmail);
        await sleep(10000);

        const { data: user } = await register.oneClickReg();
        const income = await partner.getSourceIncome(cookie, sourceId1);
        // console.log(income);
        await partner.connectUser(cookie, user.email, `${rndPhoneForPartner()}`);
        const withdrawal = await partner.addWithdrawal(cookie,
          (income.balance).toString(), sourceId1);
        // console.log(withdrawal);
        if (income.balance >= 5) {
          checkPartnerError(withdrawal, 400, '?????? ???????????? ??????????????, ?????? ???????????????????? ???????????????? ???? ?????????? 10 ???????????????? ?????????? ?????????????? ?????????????????????? ????????????, ?? ???? ?????????? ?????????? ?????????????????? ???????????? ???????????????????? ???? ?????????? 5000 RUB. ???? ???????????? ???????????? ?? ?????? ???????????????????? 2 ???????????????? ???????????????? ?? ?????????? ?????????? ???? ?????????????????? ???????????????????? 10000 RUB.');
        } else {
          checkPartnerError(withdrawal, 400, '?????????????????????? ?????????? ???????????? - 5 RUB.');
        }
      });
      it('C2149731 - Deposits amount < 5000, RUB', async () => {
        const { cookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
        await partner.setMultibalance(partnerId);
        const sourceId1 = await partner.createSource(cookie, 'sourceName1');
        const sourceId2 = await partner.createSource(cookie, 'sourceName2');
        const { data: { id: promocodeId1 } } = await partner
          .createPromocode(cookie, promocode1, sourceId1);
        const { data: { id: promocodeId2 } } = await partner
          .createPromocode(cookie, promocode2, sourceId2);
        await regUsersAndPlayCases(1, 1, 500, 'RUB', promocode2, partnerId, promocodeId2, sourceId2, userDeposit);
        await regUsersAndPlayCases(10, 1, 100, 'RUB', promocode1, partnerId, promocodeId1, sourceId1, 200);

        // console.log(partnerEmail);
        await sleep(10000);

        const { data: user } = await register.oneClickReg();
        const income = await partner.getSourceIncome(cookie, sourceId1);
        // console.log(income);
        await partner.connectUser(cookie, user.email, `${rndPhoneForPartner()}`);
        const withdrawal = await partner.addWithdrawal(cookie,
          (income.balance).toString(), sourceId1);
        // console.log(withdrawal);
        if (income.balance >= 5) {
          checkPartnerError(withdrawal, 400, '?????? ???????????? ??????????????, ?????? ???????????????????? ???????????????? ???? ?????????? 10 ???????????????? ?????????? ?????????????? ?????????????????????? ????????????, ?? ???? ?????????? ?????????? ?????????????????? ???????????? ???????????????????? ???? ?????????? 5000 RUB. ???? ???????????? ???????????? ?? ?????? ???????????????????? 10 ???????????????? ???????????????? ?? ?????????? ?????????? ???? ?????????????????? ???????????????????? 2000 RUB.');
        } else {
          checkPartnerError(withdrawal, 400, '?????????????????????? ?????????? ???????????? - 5 RUB.');
        }
      });

      it('C2149732 - Active users < 10, USD', async () => {
        const { cookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
        await partner.setMultibalance(partnerId);
        const sourceId1 = await partner.createSource(cookie, 'sourceName1');
        const sourceId2 = await partner.createSource(cookie, 'sourceName2');
        const { data: { id: promocodeId1 } } = await partner
          .createPromocode(cookie, promocode1, sourceId1);
        const { data: { id: promocodeId2 } } = await partner
          .createPromocode(cookie, promocode2, sourceId2);
        await regUsersAndPlayCases(8, 1, 20, 'USD', promocode2, partnerId, promocodeId2, sourceId2, 20);
        await regUsersAndPlayCases(2, 5, 20, 'USD', promocode1, partnerId, promocodeId1, sourceId1, userDeposit);

        // console.log(partnerEmail);
        await sleep(10000);

        const { data: user } = await register.oneClickReg();
        const income = await partner.getSourceIncome(cookie, sourceId1);
        // console.log(income);
        await partner.connectUser(cookie, user.email, `${rndPhoneForPartner()}`);
        const withdrawal = await partner.addWithdrawal(cookie,
          (income.balance).toString(), sourceId1);
        // console.log(withdrawal);
        if (income.balance >= 2) {
          checkPartnerError(withdrawal, 400, '?????? ???????????? ??????????????, ?????? ???????????????????? ???????????????? ???? ?????????? 10 ???????????????? ?????????? ?????????????? ?????????????????????? ????????????, ?? ???? ?????????? ?????????? ?????????????????? ???????????? ???????????????????? ???? ?????????? 80 USD. ???? ???????????? ???????????? ?? ?????? ???????????????????? 2 ???????????????? ???????????????? ?? ?????????? ?????????? ???? ?????????????????? ???????????????????? 10000 USD.');
        } else {
          checkPartnerError(withdrawal, 400, '?????????????????????? ?????????? ???????????? - 2 USD.');
        }
      });
      it('C2149733 - Deposits amount < 80, USD', async () => {
        const { cookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
        await partner.setMultibalance(partnerId);
        const sourceId1 = await partner.createSource(cookie, 'sourceName1');
        const sourceId2 = await partner.createSource(cookie, 'sourceName2');
        const { data: { id: promocodeId1 } } = await partner
          .createPromocode(cookie, promocode1, sourceId1);
        const { data: { id: promocodeId2 } } = await partner
          .createPromocode(cookie, promocode2, sourceId2);
        await regUsersAndPlayCases(1, 1, 20, 'USD', promocode2, partnerId, promocodeId2, sourceId2, userDeposit);
        await regUsersAndPlayCases(10, 1, 2, 'USD', promocode1, partnerId, promocodeId1, sourceId1, 5);

        // console.log(partnerEmail);
        await sleep(10000);

        const { data: user } = await register.oneClickReg();
        const income = await partner.getSourceIncome(cookie, sourceId1);
        // console.log(income);
        await partner.connectUser(cookie, user.email, `${rndPhoneForPartner()}`);
        const withdrawal = await partner.addWithdrawal(cookie,
          (income.balance).toString(), sourceId1);
        // console.log(withdrawal);
        if (income.balance >= 2) {
          checkPartnerError(withdrawal, 400, '?????? ???????????? ??????????????, ?????? ???????????????????? ???????????????? ???? ?????????? 10 ???????????????? ?????????? ?????????????? ?????????????????????? ????????????, ?? ???? ?????????? ?????????? ?????????????????? ???????????? ???????????????????? ???? ?????????? 80 USD. ???? ???????????? ???????????? ?? ?????? ???????????????????? 10 ???????????????? ???????????????? ?? ?????????? ?????????? ???? ?????????????????? ???????????????????? 50 USD.');
        } else {
          checkPartnerError(withdrawal, 400, '?????????????????????? ?????????? ???????????? - 2 USD.');
        }
      });

      it('C2149734 - Active users < 10, EUR', async () => {
        const { cookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
        await partner.setMultibalance(partnerId);
        const sourceId1 = await partner.createSource(cookie, 'sourceName1');
        const sourceId2 = await partner.createSource(cookie, 'sourceName2');
        const { data: { id: promocodeId1 } } = await partner
          .createPromocode(cookie, promocode1, sourceId1);
        const { data: { id: promocodeId2 } } = await partner
          .createPromocode(cookie, promocode2, sourceId2);
        await regUsersAndPlayCases(8, 1, 20, 'EUR', promocode2, partnerId, promocodeId2, sourceId2, 20);
        await regUsersAndPlayCases(2, 5, 20, 'EUR', promocode1, partnerId, promocodeId1, sourceId1, userDeposit);

        // console.log(partnerEmail);
        await sleep(10000);

        const { data: user } = await register.oneClickReg();
        const income = await partner.getSourceIncome(cookie, sourceId1);
        // console.log(income);
        await partner.connectUser(cookie, user.email, `${rndPhoneForPartner()}`);
        const withdrawal = await partner.addWithdrawal(cookie,
          (income.balance).toString(), sourceId1);
        // console.log(withdrawal);
        if (income.balance >= 1) {
          checkPartnerError(withdrawal, 400, '?????? ???????????? ??????????????, ?????? ???????????????????? ???????????????? ???? ?????????? 10 ???????????????? ?????????? ?????????????? ?????????????????????? ????????????, ?? ???? ?????????? ?????????? ?????????????????? ???????????? ???????????????????? ???? ?????????? 70 EUR. ???? ???????????? ???????????? ?? ?????? ???????????????????? 2 ???????????????? ???????????????? ?? ?????????? ?????????? ???? ?????????????????? ???????????????????? 10000 EUR.');
        } else {
          checkPartnerError(withdrawal, 400, '?????????????????????? ?????????? ???????????? - 1 EUR.');
        }
      });
      it('C2149735 - Deposits amount < 70, EUR', async () => {
        const { cookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
        await partner.setMultibalance(partnerId);
        const sourceId1 = await partner.createSource(cookie, 'sourceName1');
        const sourceId2 = await partner.createSource(cookie, 'sourceName2');
        const { data: { id: promocodeId1 } } = await partner
          .createPromocode(cookie, promocode1, sourceId1);
        const { data: { id: promocodeId2 } } = await partner
          .createPromocode(cookie, promocode2, sourceId2);
        await regUsersAndPlayCases(1, 1, 20, 'EUR', promocode2, partnerId, promocodeId2, sourceId2, userDeposit);
        await regUsersAndPlayCases(10, 1, 2, 'EUR', promocode1, partnerId, promocodeId1, sourceId1, 5);

        // console.log(partnerEmail);
        await sleep(10000);

        const { data: user } = await register.oneClickReg();
        const income = await partner.getSourceIncome(cookie, sourceId1);
        // console.log(income);
        await partner.connectUser(cookie, user.email, `${rndPhoneForPartner()}`);
        const withdrawal = await partner.addWithdrawal(cookie,
          (income.balance).toString(), sourceId1);
        // console.log(withdrawal);
        if (income.balance >= 1) {
          checkPartnerError(withdrawal, 400, '?????? ???????????? ??????????????, ?????? ???????????????????? ???????????????? ???? ?????????? 10 ???????????????? ?????????? ?????????????? ?????????????????????? ????????????, ?? ???? ?????????? ?????????? ?????????????????? ???????????? ???????????????????? ???? ?????????? 70 EUR. ???? ???????????? ???????????? ?? ?????? ???????????????????? 10 ???????????????? ???????????????? ?? ?????????? ?????????? ???? ?????????????????? ???????????????????? 50 EUR.');
        } else {
          checkPartnerError(withdrawal, 400, '?????????????????????? ?????????? ???????????? - 1 EUR.');
        }
      });

      it('C2157470 - Withdrawal amount > balance, RUB', async () => {
        const { cookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
        await partner.setMultibalance(partnerId);
        const sourceId1 = await partner.createSource(cookie, 'source1');
        const { data: user } = await register.oneClickReg();
        await sleep(1500);
        await partner.connectUser(cookie, user.email, `${rndPhoneForPartner()}`);
        const withdrawal = await partner.addWithdrawal(cookie, '1000', sourceId1);
        checkPartnerError(withdrawal, 400, '???????????????????????? ??????????????');
      });
      it('C2157471 - Withdrawal amount > balance, USD', async () => {
        const { cookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
        await partner.setMultibalance(partnerId);
        const sourceId1 = await partner.createSource(cookie, 'source1');
        const { data: user } = await register.oneClickReg();
        await sleep(1500);
        await partner.connectUser(cookie, user.email, `${rndPhoneForPartner()}`);
        const withdrawal = await partner.addWithdrawal(cookie, '1000', sourceId1);
        checkPartnerError(withdrawal, 400, '???????????????????????? ??????????????');
      });
      it('C2157472 - Withdrawal amount > balance, EUR', async () => {
        const { cookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
        await partner.setMultibalance(partnerId);
        const sourceId1 = await partner.createSource(cookie, 'source1');
        const { data: user } = await register.oneClickReg();
        await sleep(1500);
        await partner.connectUser(cookie, user.email, `${rndPhoneForPartner()}`);
        const withdrawal = await partner.addWithdrawal(cookie, '1000', sourceId1);
        checkPartnerError(withdrawal, 400, '???????????????????????? ??????????????');
      });

      it('C2157476 - Withdrawal amount < 5, RUB', async () => {
        const { cookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
        await partner.setMultibalance(partnerId);
        const sourceId1 = await partner.createSource(cookie, 'source1');
        const { data: user } = await register.oneClickReg();
        await sleep(1500);
        await partner.connectUser(cookie, user.email, `${rndPhoneForPartner()}`);
        const withdrawal = await partner.addWithdrawal(cookie, '1', sourceId1);
        checkPartnerError(withdrawal, 400, '?????????????????????? ?????????? ???????????? - 5 RUB.');
      });
      it('C2157477 - Withdrawal amount < 2, USD', async () => {
        const { cookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
        await partner.setMultibalance(partnerId);
        const sourceId1 = await partner.createSource(cookie, 'source1');
        const { data: user } = await register.oneClickReg();
        await sleep(1500);
        await partner.connectUser(cookie, user.email, `${rndPhoneForPartner()}`);
        const withdrawal = await partner.addWithdrawal(cookie, '1', sourceId1);
        checkPartnerError(withdrawal, 400, '?????????????????????? ?????????? ???????????? - 2 USD.');
      });
      it('C2157478 - Withdrawal amount < 1, EUR', async () => {
        const { cookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
        await partner.setMultibalance(partnerId);
        const sourceId1 = await partner.createSource(cookie, 'source1');
        const { data: user } = await register.oneClickReg();
        await sleep(1500);
        await partner.connectUser(cookie, user.email, `${rndPhoneForPartner()}`);
        const withdrawal = await partner.addWithdrawal(cookie, '0.5', sourceId1);
        checkPartnerError(withdrawal, 400, '?????????????????????? ?????????? ???????????? - 1 EUR.');
      });
    });

    describe('Successful withdrawal from one source & check balance for all sources after', () => {
      it('C2149736 - Partner RUB', async () => {
        const { cookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
        await partner.setMultibalance(partnerId);
        const sourceId1 = await partner.createSource(cookie, 'sourceName1');
        const sourceId2 = await partner.createSource(cookie, 'sourceName2');
        const { data: { id: promocodeId1 } } = await partner
          .createPromocode(cookie, promocode1, sourceId1);
        const { data: { id: promocodeId2 } } = await partner
          .createPromocode(cookie, promocode2, sourceId2);
        await regUsersAndPlayCases(2, 5, 500, 'RUB', promocode2, partnerId, promocodeId2, sourceId2, userDeposit);

        let incomeBefore;
        let usersNum = 0;
        do {
          await regUsersAndPlayCases(1, 1, 500, 'RUB', promocode1, partnerId, promocodeId1, sourceId1, userDeposit);
          usersNum++;
          await sleep(2000);
          incomeBefore = await partner.getSourceIncome(cookie, sourceId1);
          // console.log(incomeBefore);
        } while (usersNum < 10 || incomeBefore.balance < 5);

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
      it('C2149737 - Partner USD', async () => {
        const { cookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
        await partner.setMultibalance(partnerId);
        const sourceId1 = await partner.createSource(cookie, 'sourceName1');
        const sourceId2 = await partner.createSource(cookie, 'sourceName2');
        const { data: { id: promocodeId1 } } = await partner
          .createPromocode(cookie, promocode1, sourceId1);
        const { data: { id: promocodeId2 } } = await partner
          .createPromocode(cookie, promocode2, sourceId2);
        await regUsersAndPlayCases(2, 5, 20, 'USD', promocode2, partnerId, promocodeId2, sourceId2, userDeposit);

        let incomeBefore;
        let usersNum = 0;
        do {
          await regUsersAndPlayCases(1, 1, 20, 'USD', promocode1, partnerId, promocodeId1, sourceId1, userDeposit);
          usersNum++;
          await sleep(2000);
          incomeBefore = await partner.getSourceIncome(cookie, sourceId1);
          // console.log(incomeBefore);
        } while (usersNum < 10 || incomeBefore.balance < 2);

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
      it('C2149738 - Partner EUR', async () => {
        const { cookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
        await partner.setMultibalance(partnerId);
        const sourceId1 = await partner.createSource(cookie, 'sourceName1');
        const sourceId2 = await partner.createSource(cookie, 'sourceName2');
        const { data: { id: promocodeId1 } } = await partner
          .createPromocode(cookie, promocode1, sourceId1);
        const { data: { id: promocodeId2 } } = await partner
          .createPromocode(cookie, promocode2, sourceId2);
        await regUsersAndPlayCases(2, 5, 20, 'EUR', promocode2, partnerId, promocodeId2, sourceId2, userDeposit);

        let incomeBefore;
        let usersNum = 0;
        do {
          await regUsersAndPlayCases(1, 1, 20, 'EUR', promocode1, partnerId, promocodeId1, sourceId1, userDeposit);
          usersNum++;
          await sleep(2000);
          incomeBefore = await partner.getSourceIncome(cookie, sourceId1);
          // console.log(incomeBefore);
        } while (usersNum < 10 || incomeBefore.balance < 1);

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
