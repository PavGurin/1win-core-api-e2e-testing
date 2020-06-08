/**
 * @jest-environment node
 */


import { randomStr } from '../../../../src/randomizer';
import { partner } from '../../../../src/methods/partner';
import { checkPartnerError } from '../../../../src/expects/exPartner';
import { regUsersAndPlayCases } from '../../../../src/methods/regUsersForPartner';
import { register } from '../../../../src/methods/register';
import { rndNumInRange, rndPhoneForPartner, sleep } from '../../../../src/methods/utils';

const defaultPass = '123123AA';
describe('Revshare partner withdrawal tests', () => {
  /* eslint no-await-in-loop: off */
  let partnerEmail;
  let promocode1;
  let promocode2;

  beforeEach(async () => {
    partnerEmail = `${randomStr(10)}@ahem.email`;
    promocode1 = `${randomStr(8)}`;
    promocode2 = `${randomStr(8)}`;
  });

  describe('Valid email and phone linked', () => {
    it('C2161047 - Withdrawal with no email linked', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
      const withdrawal = await partner.withdrawalCreate(cookie, '20');
      // console.log(withdrawal);
      checkPartnerError(withdrawal, 400, 'Аккаунт не подключен');
    });
    it('C2161048 - Link not 1win user email', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
      const mailCon = await partner.mailConnect(cookie, `${randomStr(8)}@ahem.email`);
      // console.log(mailCon);
      checkPartnerError(mailCon, 404, 'Пользователь не найден');
      const withdrawal = await partner.withdrawalCreate(cookie, '20');
      // console.log(withdrawal);
      checkPartnerError(withdrawal, 400, 'Аккаунт не подключен');
    });
    it('C2161049 - Russian phone (starts with 7), confirm withdrawal', async () => {
      const { cookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
      const sourceId = await partner.getSourceId(cookie);
      const { data: { id: promocodeId1 } } = await partner
        .createPromocode(cookie, promocode1, sourceId);
      await regUsersAndPlayCases(10, 1, 500, 'RUB', promocode1, partnerId, promocodeId1, sourceId, 500);
      await partner.setBalance(partnerId, 500);
      await sleep(2000);

      const { data } = await register.oneClickReg();
      await partner.mailConnect(cookie, data.email);
      await partner.phoneConnect(cookie, `7${Math.floor(rndNumInRange(9000000000, 9999999999))}`);
      const withdrawal = await partner.withdrawalCreate(cookie, '500');
      // console.log(withdrawal);
      const withdrawalConfirm = await partner.withdrawalConfirm(cookie, withdrawal.code);
      // console.log(withdrawalComfirm);
      expect(withdrawalConfirm.balance).toEqual(0);
      const { data: { user: { balance } } } = await partner.getUserInfo(cookie);
      expect(balance).toEqual('0.00');
    });
    it('C2161050 - Not russian phone (starts not with 7) confirmed, confirm withdrawal', async () => {
      const { cookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
      const sourceId = await partner.getSourceId(cookie);
      const { data: { id: promocodeId1 } } = await partner
        .createPromocode(cookie, promocode1, sourceId);
      await regUsersAndPlayCases(10, 1, 500, 'RUB', promocode1, partnerId, promocodeId1, sourceId, 500);
      await partner.setBalance(partnerId, 500);
      await sleep(2000);

      const { data } = await register.oneClickReg();
      await partner.mailConnect(cookie, data.email);
      const phone = await partner.phoneConnect(cookie, `6${Math.floor(rndNumInRange(9000000000, 9999999999))}`);
      await partner.phoneConfirm(cookie, phone.code);
      const withdrawal = await partner.withdrawalCreate(cookie, '500');
      // console.log(withdrawal);
      const withdrawalConfirm = await partner.withdrawalConfirm(cookie, withdrawal.code);
      // console.log(withdrawalComfirm);
      expect(withdrawalConfirm.balance).toEqual(0);
      const { data: { user: { balance } } } = await partner.getUserInfo(cookie);
      expect(balance).toEqual('0.00');
    });
    it('C2161051 - Withdrawal with no phone linked', async () => {
      const { cookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
      const sourceId = await partner.getSourceId(cookie);
      const { data: { id: promocodeId1 } } = await partner
        .createPromocode(cookie, promocode1, sourceId);
      await regUsersAndPlayCases(10, 1, 500, 'RUB', promocode1, partnerId, promocodeId1, sourceId, 500);
      await partner.setBalance(partnerId, 500);
      await sleep(2000);

      const { data } = await register.oneClickReg();
      await partner.mailConnect(cookie, data.email);
      const withdrawal = await partner.addWithdrawal(cookie, '20');
      // console.log(withdrawal);
      expect(withdrawal.code).toBeDefined();
    });
    it('C2161052 - Russian phone (starts with 7) does not need to be confirmed when linked)', async () => {
      const { cookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
      const sourceId = await partner.getSourceId(cookie);
      const { data: { id: promocodeId1 } } = await partner
        .createPromocode(cookie, promocode1, sourceId);
      await regUsersAndPlayCases(10, 1, 500, 'RUB', promocode1, partnerId, promocodeId1, sourceId, 500);
      await partner.setBalance(partnerId, 500);
      await sleep(2000);

      const { data } = await register.oneClickReg();
      await partner.mailConnect(cookie, data.email);
      const phoneCon = await partner.phoneConnect(cookie, `7${Math.floor(rndNumInRange(9000000000, 9999999999))}`);
      // console.log(phoneCon);
      const withdrawal = await partner.withdrawalCreate(cookie, '20');
      // console.log(withdrawal);
      expect(withdrawal.code).toBeDefined();
    });
    it('C2161053 - Not russian phone (starts not with 7) needs to be confirmed', async () => {
      const { cookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
      const sourceId = await partner.getSourceId(cookie);
      const { data: { id: promocodeId1 } } = await partner
        .createPromocode(cookie, promocode1, sourceId);
      await regUsersAndPlayCases(10, 1, 500, 'RUB', promocode1, partnerId, promocodeId1, sourceId, 500);
      await partner.setBalance(partnerId, 500);
      await sleep(2000);

      const { data } = await register.oneClickReg();
      await partner.mailConnect(cookie, data.email);
      const phone = await partner.phoneConnect(cookie, `7${Math.floor(rndNumInRange(9000000000, 9999999999))}`);
      // console.log(phone);
      const withdrawal = await partner.withdrawalCreate(cookie, '500');
      // console.log(withdrawal);
      checkPartnerError(withdrawal, 400, 'Телефон не подтвержден');
    });
  });

  describe('Conditions on withdrawal are not fulfilled', () => {
    it('C2161029 - Active users < 10, RUB', async () => {
      const { cookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
      const sourceId1 = await partner.createSource(cookie, 'source1');
      const sourceId2 = await partner.createSource(cookie, 'source2');
      const { data: { id: promocodeId1 } } = await partner
        .createPromocode(cookie, promocode1, sourceId1);
      const { data: { id: promocodeId2 } } = await partner
        .createPromocode(cookie, promocode2, sourceId2);
      await regUsersAndPlayCases(3, 1, 500, 'RUB', promocode1, partnerId, promocodeId1, sourceId1, 500);
      await regUsersAndPlayCases(2, 1, 500, 'RUB', promocode2, partnerId, promocodeId2, sourceId2, 2500);
      await partner.setBalance(partnerId, 500);
      await sleep(2000);

      const { data } = await register.oneClickReg();
      await partner.connectUser(cookie, data.email, `${rndPhoneForPartner()}`);
      const withdrawal = await partner.addWithdrawal(cookie, '500');
      // console.log(withdrawal);
      checkPartnerError(withdrawal, 400, 'Для вывода средств, Вам необходимо привести не менее 10 клиентов через систему реферальных ссылок, а их общая сумма депозитов должна составлять не менее 5000 RUB. На данный момент у Вас привлечено 5 активных клиентов и общая сумма их депозитов составляет 6500 RUB.');
    });
    it('C2161030 - Active users < 10, USD', async () => {
      const { cookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
      const sourceId1 = await partner.createSource(cookie, 'source1');
      const sourceId2 = await partner.createSource(cookie, 'source2');
      const { data: { id: promocodeId1 } } = await partner
        .createPromocode(cookie, promocode1, sourceId1);
      const { data: { id: promocodeId2 } } = await partner
        .createPromocode(cookie, promocode2, sourceId2);
      await regUsersAndPlayCases(3, 1, 20, 'USD', promocode1, partnerId, promocodeId1, sourceId1, 20);
      await regUsersAndPlayCases(2, 1, 20, 'USD', promocode2, partnerId, promocodeId2, sourceId2, 20);
      await partner.setBalance(partnerId, 500);
      await sleep(2000);

      const { data } = await register.oneClickReg();
      await partner.connectUser(cookie, data.email, `${rndPhoneForPartner()}`);
      const withdrawal = await partner.addWithdrawal(cookie, '500');
      // console.log(withdrawal);
      checkPartnerError(withdrawal, 400, 'Для вывода средств, Вам необходимо привести не менее 10 клиентов через систему реферальных ссылок, а их общая сумма депозитов должна составлять не менее 80 USD. На данный момент у Вас привлечено 5 активных клиентов и общая сумма их депозитов составляет 100 USD.');
    });
    it('C2161031 - Active users < 10, EUR', async () => {
      const { cookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
      const sourceId1 = await partner.createSource(cookie, 'source1');
      const sourceId2 = await partner.createSource(cookie, 'source2');
      const { data: { id: promocodeId1 } } = await partner
        .createPromocode(cookie, promocode1, sourceId1);
      const { data: { id: promocodeId2 } } = await partner
        .createPromocode(cookie, promocode2, sourceId2);
      await regUsersAndPlayCases(3, 1, 20, 'EUR', promocode1, partnerId, promocodeId1, sourceId1, 20);
      await regUsersAndPlayCases(2, 1, 20, 'EUR', promocode2, partnerId, promocodeId2, sourceId2, 20);
      await partner.setBalance(partnerId, 500);
      await sleep(2000);

      const { data } = await register.oneClickReg();
      await partner.connectUser(cookie, data.email, `${rndPhoneForPartner()}`);
      const withdrawal = await partner.addWithdrawal(cookie, '500');
      // console.log(withdrawal);
      checkPartnerError(withdrawal, 400, 'Для вывода средств, Вам необходимо привести не менее 10 клиентов через систему реферальных ссылок, а их общая сумма депозитов должна составлять не менее 70 EUR. На данный момент у Вас привлечено 5 активных клиентов и общая сумма их депозитов составляет 100 EUR.');
    });

    it('C2161032 - Deposits amount < 5000, RUB', async () => {
      const { cookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
      const sourceId1 = await partner.createSource(cookie, 'source1');
      const sourceId2 = await partner.createSource(cookie, 'source2');
      const { data: { id: promocodeId1 } } = await partner
        .createPromocode(cookie, promocode1, sourceId1);
      const { data: { id: promocodeId2 } } = await partner
        .createPromocode(cookie, promocode2, sourceId2);
      await regUsersAndPlayCases(5, 1, 100, 'RUB', promocode1, partnerId, promocodeId1, sourceId1, 100);
      await regUsersAndPlayCases(5, 1, 100, 'RUB', promocode2, partnerId, promocodeId2, sourceId2, 100);
      await partner.setBalance(partnerId, 500);
      await sleep(2000);

      const { data } = await register.oneClickReg();
      await partner.connectUser(cookie, data.email, `${rndPhoneForPartner()}`);
      const withdrawal = await partner.addWithdrawal(cookie, '50');
      // console.log(withdrawal);
      checkPartnerError(withdrawal, 400, 'Для вывода средств, Вам необходимо привести не менее 10 клиентов через систему реферальных ссылок, а их общая сумма депозитов должна составлять не менее 5000 RUB. На данный момент у Вас привлечено 10 активных клиентов и общая сумма их депозитов составляет 1000 RUB.');
    });
    it('C2161033 - Deposits amount < 80, USD', async () => {
      const { cookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
      const sourceId1 = await partner.createSource(cookie, 'source1');
      const sourceId2 = await partner.createSource(cookie, 'source2');
      const { data: { id: promocodeId1 } } = await partner
        .createPromocode(cookie, promocode1, sourceId1);
      const { data: { id: promocodeId2 } } = await partner
        .createPromocode(cookie, promocode2, sourceId2);
      await regUsersAndPlayCases(5, 1, 2, 'USD', promocode1, partnerId, promocodeId1, sourceId1, 5);
      await regUsersAndPlayCases(5, 1, 2, 'USD', promocode2, partnerId, promocodeId2, sourceId2, 5);
      await partner.setBalance(partnerId, 50);
      await sleep(2000);

      const { data } = await register.oneClickReg();
      await partner.connectUser(cookie, data.email, `${rndPhoneForPartner()}`);
      const withdrawal = await partner.addWithdrawal(cookie, '50');
      // console.log(withdrawal);
      checkPartnerError(withdrawal, 400, 'Для вывода средств, Вам необходимо привести не менее 10 клиентов через систему реферальных ссылок, а их общая сумма депозитов должна составлять не менее 80 USD. На данный момент у Вас привлечено 10 активных клиентов и общая сумма их депозитов составляет 50 USD.');
    });
    it('C2161034 - Deposits amount < 70, EUR', async () => {
      const { cookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
      const sourceId1 = await partner.createSource(cookie, 'source1');
      const sourceId2 = await partner.createSource(cookie, 'source2');
      const { data: { id: promocodeId1 } } = await partner
        .createPromocode(cookie, promocode1, sourceId1);
      const { data: { id: promocodeId2 } } = await partner
        .createPromocode(cookie, promocode2, sourceId2);
      await regUsersAndPlayCases(5, 1, 2, 'EUR', promocode1, partnerId, promocodeId1, sourceId1, 5);
      await regUsersAndPlayCases(5, 1, 2, 'EUR', promocode2, partnerId, promocodeId2, sourceId2, 5);
      await partner.setBalance(partnerId, 50);
      await sleep(2000);

      const { data } = await register.oneClickReg();
      await partner.connectUser(cookie, data.email, `${rndPhoneForPartner()}`);
      const withdrawal = await partner.addWithdrawal(cookie, '50');
      // console.log(withdrawal);
      checkPartnerError(withdrawal, 400, 'Для вывода средств, Вам необходимо привести не менее 10 клиентов через систему реферальных ссылок, а их общая сумма депозитов должна составлять не менее 70 EUR. На данный момент у Вас привлечено 10 активных клиентов и общая сумма их депозитов составляет 50 EUR.');
    });

    it('C2161035 - Withdrawal amount < 5, RUB', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
      const { data } = await register.oneClickReg();
      await partner.connectUser(cookie, data.email, `${rndPhoneForPartner()}`);
      const withdrawal = await partner.addWithdrawal(cookie, '4');
      // console.log(withdrawal);
      checkPartnerError(withdrawal, 400, 'Минимальная сумма вывода - 5 RUB.');
    });
    it('C2161036 - Withdrawal amount < 2, USD', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
      const { data } = await register.oneClickReg();
      await partner.connectUser(cookie, data.email, `${rndPhoneForPartner()}`);
      const withdrawal = await partner.addWithdrawal(cookie, '1');
      // console.log(withdrawal);
      checkPartnerError(withdrawal, 400, 'Минимальная сумма вывода - 2 USD.');
    });
    it('C2161037 - Withdrawal amount < 1, EUR', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
      const { data } = await register.oneClickReg();
      await partner.connectUser(cookie, data.email, `${rndPhoneForPartner()}`);
      const withdrawal = await partner.addWithdrawal(cookie, '0.5');
      // console.log(withdrawal);
      checkPartnerError(withdrawal, 400, 'Минимальная сумма вывода - 1 EUR.');
    });

    it('C2161038 - Withdrawal amount > balance, RUB', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
      const { data } = await register.oneClickReg();
      await partner.connectUser(cookie, data.email, `${rndPhoneForPartner()}`);
      const withdrawal = await partner.addWithdrawal(cookie, '10');
      // console.log(withdrawal);
      checkPartnerError(withdrawal, 400, 'Недостаточно средств');
    });
    it('C2161039 - Withdrawal amount > balance, USD', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
      const { data } = await register.oneClickReg();
      await partner.connectUser(cookie, data.email, `${rndPhoneForPartner()}`);
      const withdrawal = await partner.addWithdrawal(cookie, '10');
      // console.log(withdrawal);
      checkPartnerError(withdrawal, 400, 'Недостаточно средств');
    });
    it('C2161040 - Withdrawal amount > balance, EUR', async () => {
      const { cookie } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
      const { data } = await register.oneClickReg();
      await partner.connectUser(cookie, data.email, `${rndPhoneForPartner()}`);
      const withdrawal = await partner.addWithdrawal(cookie, '10');
      // console.log(withdrawal);
      checkPartnerError(withdrawal, 400, 'Недостаточно средств');
    });
  });

  describe('Successful withdrawal & check balance', () => {
    it('C2161041 - Active users and their deposits are all on one source, RUB', async () => {
      const { cookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
      const sourceId1 = await partner.createSource(cookie, 'source1');
      const { data: { id: promocodeId1 } } = await partner
        .createPromocode(cookie, promocode1, sourceId1);
      await regUsersAndPlayCases(10, 1, 500, 'RUB', promocode1, partnerId, promocodeId1, sourceId1, 500);
      await partner.setBalance(partnerId, 500);
      await sleep(2000);

      const { data } = await register.oneClickReg();
      await partner.connectUser(cookie, data.email, `${rndPhoneForPartner()}`);
      const withdrawal = await partner.addWithdrawal(cookie, '437.25');
      // console.log(withdrawal);
      expect(withdrawal.balance).toEqual(62.75);
      const { data: { user: { balance } } } = await partner.getUserInfo(cookie);
      expect(balance).toEqual('62.75');
    });
    it('C2161042 - Active users and their deposits are on different sources, RUB', async () => {
      const { cookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
      const sourceId1 = await partner.createSource(cookie, 'source1');
      const sourceId2 = await partner.createSource(cookie, 'source2');
      const { data: { id: promocodeId1 } } = await partner
        .createPromocode(cookie, promocode1, sourceId1);
      const { data: { id: promocodeId2 } } = await partner
        .createPromocode(cookie, promocode2, sourceId2);
      await regUsersAndPlayCases(5, 1, 500, 'RUB', promocode1, partnerId, promocodeId1, sourceId1, 500);
      await regUsersAndPlayCases(5, 1, 500, 'RUB', promocode2, partnerId, promocodeId2, sourceId2, 500);
      await partner.setBalance(partnerId, 500);
      await sleep(2000);

      const { data } = await register.oneClickReg();
      await partner.connectUser(cookie, data.email, `${rndPhoneForPartner()}`);
      const withdrawal = await partner.addWithdrawal(cookie, '500');
      // console.log(withdrawal);
      expect(withdrawal.balance).toEqual(0);
      const { data: { user: { balance } } } = await partner.getUserInfo(cookie);
      expect(balance).toEqual('0.00');
    });

    it('C2161043 - Active users and their deposits are all on one source, USD', async () => {
      const { cookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
      const sourceId1 = await partner.createSource(cookie, 'source1');
      const { data: { id: promocodeId1 } } = await partner
        .createPromocode(cookie, promocode1, sourceId1);
      await regUsersAndPlayCases(10, 1, 20, 'USD', promocode1, partnerId, promocodeId1, sourceId1, 20);
      await partner.setBalance(partnerId, 50);
      await sleep(2000);

      const { data } = await register.oneClickReg();
      await partner.connectUser(cookie, data.email, `${rndPhoneForPartner()}`);
      const withdrawal = await partner.addWithdrawal(cookie, '50');
      // console.log(withdrawal);
      expect(withdrawal.balance).toEqual(0);
      const { data: { user: { balance } } } = await partner.getUserInfo(cookie);
      expect(balance).toEqual('0.00');
    });
    it('C2161044 - Active users and their deposits are on different sources, USD', async () => {
      const { cookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
      const sourceId1 = await partner.createSource(cookie, 'source1');
      const sourceId2 = await partner.createSource(cookie, 'source2');
      const { data: { id: promocodeId1 } } = await partner
        .createPromocode(cookie, promocode1, sourceId1);
      const { data: { id: promocodeId2 } } = await partner
        .createPromocode(cookie, promocode2, sourceId2);
      await regUsersAndPlayCases(5, 1, 20, 'USD', promocode1, partnerId, promocodeId1, sourceId1, 20);
      await regUsersAndPlayCases(5, 1, 20, 'USD', promocode2, partnerId, promocodeId2, sourceId2, 20);
      await partner.setBalance(partnerId, 50);
      await sleep(2000);

      const { data } = await register.oneClickReg();
      await partner.connectUser(cookie, data.email, `${rndPhoneForPartner()}`);
      const withdrawal = await partner.addWithdrawal(cookie, '10');
      // console.log(withdrawal);
      expect(withdrawal.balance).toEqual(40.00);
      const { data: { user: { balance } } } = await partner.getUserInfo(cookie);
      expect(balance).toEqual('40.00');
    });

    it('C2161045 - Active users and their deposits are all on one source, EUR', async () => {
      const { cookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
      const sourceId1 = await partner.createSource(cookie, 'source1');
      const { data: { id: promocodeId1 } } = await partner
        .createPromocode(cookie, promocode1, sourceId1);
      await regUsersAndPlayCases(10, 1, 20, 'EUR', promocode1, partnerId, promocodeId1, sourceId1, 20);
      await partner.setBalance(partnerId, 50);
      await sleep(2000);

      const { data } = await register.oneClickReg();
      await partner.connectUser(cookie, data.email, `${rndPhoneForPartner()}`);
      const withdrawal = await partner.addWithdrawal(cookie, '5.43');
      // console.log(withdrawal);
      expect(withdrawal.balance).toEqual(44.57);
      const { data: { user: { balance } } } = await partner.getUserInfo(cookie);
      expect(balance).toEqual('44.57');
    });
    it('C2161046 - Active users and their deposits are on different sources, EUR', async () => {
      const { cookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
      const sourceId1 = await partner.createSource(cookie, 'source1');
      const sourceId2 = await partner.createSource(cookie, 'source2');
      const { data: { id: promocodeId1 } } = await partner
        .createPromocode(cookie, promocode1, sourceId1);
      const { data: { id: promocodeId2 } } = await partner
        .createPromocode(cookie, promocode2, sourceId2);
      await regUsersAndPlayCases(5, 1, 20, 'EUR', promocode1, partnerId, promocodeId1, sourceId1, 20);
      await regUsersAndPlayCases(5, 1, 20, 'EUR', promocode2, partnerId, promocodeId2, sourceId2, 20);
      await partner.setBalance(partnerId, 50);
      await sleep(2000);

      const { data } = await register.oneClickReg();
      await partner.connectUser(cookie, data.email, `${rndPhoneForPartner()}`);
      const withdrawal = await partner.addWithdrawal(cookie, '50');
      // console.log(withdrawal);
      expect(withdrawal.balance).toEqual(0);
      const { data: { user: { balance } } } = await partner.getUserInfo(cookie);
      expect(balance).toEqual('0.00');
    });
  });
});
