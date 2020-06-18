/**
 * @jest-environment node
 */

import { randomStr } from '../../../../src/randomizer';
import { partner } from '../../../../src/methods/partner';
import { register } from '../../../../src/methods/register';
import { checkPartnerError } from '../../../../src/expects/exPartner';
import { regUsersAndPlayCases } from '../../../../src/methods/regUsersForPartner';
import { rndPhoneForPartner, sleep } from '../../../../src/methods/utils';
import { mysqlConnection } from '../../../../src/methods/mysqlConnection';

const defaultPass = '123123AA';
describe('Withdrawal tests for user with subpartners', () => {
  /* eslint no-await-in-loop: off */
  let partnerEmail;
  let subpartnerEmail;
  let partnerPromocode;
  let subpartnerPromocode;

  beforeAll(async () => {
    const dbResult = await mysqlConnection.executeQuery('DELETE FROM 1win.riskmanagement_ip_log;');
    // console.log(dbResult);
    await sleep(1500);
  });

  beforeEach(async () => {
    partnerEmail = `${randomStr(10)}@ahem.email`;
    subpartnerEmail = `${randomStr(10)}@ahem.email`;
    partnerPromocode = `${randomStr(8)}`;
    subpartnerPromocode = `${randomStr(8)}`;
  });
  // есть деньги от субпартнера, но у самого парнера не выполнены условия для вывода
  describe('Not successful withdrawal', () => {
    it('C2171274 - Active users < 10, RUB', async () => {
      const { cookie: partnerCookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
      const hash = await partner.UrlSubPartner(partnerCookie);
      const { cookie: subpartnerCookie } = await partner
        .registerRevshare(subpartnerEmail, defaultPass, 'RUB', hash);
      const { data: { id: partnerPromocodeId } } = await partner
        .createPromocode(partnerCookie, partnerPromocode);
      await partner.createPromocode(subpartnerCookie, subpartnerPromocode);
      await regUsersAndPlayCases(2, 1, 100, 'RUB', partnerPromocode,
        partnerId, partnerPromocodeId, await partner.getSourceId(partnerCookie), 2500);

      let incomeFromSubpartner;
      do {
        await regUsersAndPlayCases(1, 1, 20, 'USD', subpartnerPromocode);
        const { data: { partners: [p0] } } = await partner.getStatsSubpartner(partnerCookie);
        incomeFromSubpartner = p0.webmasterSum;
        // console.log(incomeFromSubpartner);
      } while (incomeFromSubpartner < 5);
      await partner.setBalance(partnerId, incomeFromSubpartner);

      const { data } = await register.oneClickReg();
      await partner.connectUser(partnerCookie, data.email, `${rndPhoneForPartner()}`);
      const withdrawal = await partner.addWithdrawal(partnerCookie,
        incomeFromSubpartner.toFixed(2));
      // console.log(withdrawal);
      checkPartnerError(withdrawal, 400, 'Для вывода средств, Вам необходимо привести не менее 10 клиентов через систему реферальных ссылок, а их общая сумма депозитов должна составлять не менее 5000 RUB. На данный момент у Вас привлечено 2 активных клиентов и общая сумма их депозитов составляет 5000 RUB.');
    });
    it('C2171275 - Active users < 10, USD', async () => {
      const { cookie: partnerCookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
      const hash = await partner.UrlSubPartner(partnerCookie);
      const { cookie: subpartnerCookie } = await partner
        .registerRevshare(subpartnerEmail, defaultPass, 'RUB', hash);
      const { data: { id: partnerPromocodeId } } = await partner
        .createPromocode(partnerCookie, partnerPromocode);
      await partner.createPromocode(subpartnerCookie, subpartnerPromocode);
      await regUsersAndPlayCases(2, 1, 20, 'USD', partnerPromocode,
        partnerId, partnerPromocodeId, await partner.getSourceId(partnerCookie), 40);

      let incomeFromSubpartner;
      do {
        await regUsersAndPlayCases(1, 1, 20, 'USD', subpartnerPromocode);
        const { data: { partners: [p0] } } = await partner.getStatsSubpartner(partnerCookie);
        incomeFromSubpartner = p0.webmasterSum;
        // console.log(incomeFromSubpartner);
      } while (incomeFromSubpartner < 2);
      await partner.setBalance(partnerId, incomeFromSubpartner);

      const { data } = await register.oneClickReg();
      await partner.connectUser(partnerCookie, data.email, `${rndPhoneForPartner()}`);
      const withdrawal = await partner.addWithdrawal(partnerCookie,
        incomeFromSubpartner.toFixed(2));
      // console.log(withdrawal);
      checkPartnerError(withdrawal, 400, 'Для вывода средств, Вам необходимо привести не менее 10 клиентов через систему реферальных ссылок, а их общая сумма депозитов должна составлять не менее 80 USD. На данный момент у Вас привлечено 2 активных клиентов и общая сумма их депозитов составляет 80 USD.');
    });
    it('C2171276 - Active users < 10, EUR', async () => {
      const { cookie: partnerCookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
      const hash = await partner.UrlSubPartner(partnerCookie);
      const { cookie: subpartnerCookie } = await partner
        .registerRevshare(subpartnerEmail, defaultPass, 'RUB', hash);
      const { data: { id: partnerPromocodeId } } = await partner
        .createPromocode(partnerCookie, partnerPromocode);
      await partner.createPromocode(subpartnerCookie, subpartnerPromocode);
      await regUsersAndPlayCases(2, 1, 20, 'EUR', partnerPromocode,
        partnerId, partnerPromocodeId, await partner.getSourceId(partnerCookie), 35);

      let incomeFromSubpartner;
      do {
        await regUsersAndPlayCases(1, 1, 20, 'USD', subpartnerPromocode);
        const { data: { partners: [p0] } } = await partner.getStatsSubpartner(partnerCookie);
        incomeFromSubpartner = p0.webmasterSum;
        // console.log(incomeFromSubpartner);
      } while (incomeFromSubpartner < 1);
      await partner.setBalance(partnerId, incomeFromSubpartner);

      const { data } = await register.oneClickReg();
      await partner.connectUser(partnerCookie, data.email, `${rndPhoneForPartner()}`);
      const withdrawal = await partner.addWithdrawal(partnerCookie,
        incomeFromSubpartner.toFixed(2));
      // console.log(withdrawal);
      checkPartnerError(withdrawal, 400, 'Для вывода средств, Вам необходимо привести не менее 10 клиентов через систему реферальных ссылок, а их общая сумма депозитов должна составлять не менее 70 EUR. На данный момент у Вас привлечено 2 активных клиентов и общая сумма их депозитов составляет 70 EUR.');
    });

    it('C2171277 - Deposits amount < 5000, RUB', async () => {
      const { cookie: partnerCookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
      const hash = await partner.UrlSubPartner(partnerCookie);
      const { cookie: subpartnerCookie } = await partner
        .registerRevshare(subpartnerEmail, defaultPass, 'RUB', hash);
      const { data: { id: partnerPromocodeId } } = await partner
        .createPromocode(partnerCookie, partnerPromocode);
      await partner.createPromocode(subpartnerCookie, subpartnerPromocode);
      await regUsersAndPlayCases(10, 1, 100, 'RUB', partnerPromocode,
        partnerId, partnerPromocodeId, await partner.getSourceId(partnerCookie), 100);

      let incomeFromSubpartner;
      do {
        await regUsersAndPlayCases(1, 1, 20, 'USD', subpartnerPromocode);
        const { data: { partners: [p0] } } = await partner.getStatsSubpartner(partnerCookie);
        incomeFromSubpartner = p0.webmasterSum;
        // console.log(incomeFromSubpartner);
      } while (incomeFromSubpartner < 5);
      await partner.setBalance(partnerId, incomeFromSubpartner);

      const { data } = await register.oneClickReg();
      await partner.connectUser(partnerCookie, data.email, `${rndPhoneForPartner()}`);
      const withdrawal = await partner.addWithdrawal(partnerCookie,
        incomeFromSubpartner.toFixed(2));
      // console.log(withdrawal);
      checkPartnerError(withdrawal, 400, 'Для вывода средств, Вам необходимо привести не менее 10 клиентов через систему реферальных ссылок, а их общая сумма депозитов должна составлять не менее 5000 RUB. На данный момент у Вас привлечено 10 активных клиентов и общая сумма их депозитов составляет 1000 RUB.');
    });
    it('C2171278 - Deposits amount < 80, USD', async () => {
      const { cookie: partnerCookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
      const hash = await partner.UrlSubPartner(partnerCookie);
      const { cookie: subpartnerCookie } = await partner
        .registerRevshare(subpartnerEmail, defaultPass, 'RUB', hash);
      const { data: { id: partnerPromocodeId } } = await partner
        .createPromocode(partnerCookie, partnerPromocode);
      await partner.createPromocode(subpartnerCookie, subpartnerPromocode);
      await regUsersAndPlayCases(10, 1, 2, 'USD', partnerPromocode,
        partnerId, partnerPromocodeId, await partner.getSourceId(partnerCookie), 5);

      let incomeFromSubpartner;
      do {
        await regUsersAndPlayCases(1, 1, 20, 'USD', subpartnerPromocode);
        const { data: { partners: [p0] } } = await partner.getStatsSubpartner(partnerCookie);
        incomeFromSubpartner = p0.webmasterSum;
        // console.log(incomeFromSubpartner);
      } while (incomeFromSubpartner < 2);
      await partner.setBalance(partnerId, incomeFromSubpartner);

      const { data } = await register.oneClickReg();
      await partner.connectUser(partnerCookie, data.email, `${rndPhoneForPartner()}`);
      const withdrawal = await partner.addWithdrawal(partnerCookie,
        incomeFromSubpartner.toFixed(2));
      // console.log(withdrawal);
      checkPartnerError(withdrawal, 400, 'Для вывода средств, Вам необходимо привести не менее 10 клиентов через систему реферальных ссылок, а их общая сумма депозитов должна составлять не менее 80 USD. На данный момент у Вас привлечено 10 активных клиентов и общая сумма их депозитов составляет 50 USD.');
    });
    it('C2171279 - Deposits amount < 70, EUR', async () => {
      const { cookie: partnerCookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
      const hash = await partner.UrlSubPartner(partnerCookie);
      const { cookie: subpartnerCookie } = await partner
        .registerRevshare(subpartnerEmail, defaultPass, 'RUB', hash);
      const { data: { id: partnerPromocodeId } } = await partner
        .createPromocode(partnerCookie, partnerPromocode);
      await partner.createPromocode(subpartnerCookie, subpartnerPromocode);
      await regUsersAndPlayCases(10, 1, 2, 'EUR', partnerPromocode,
        partnerId, partnerPromocodeId, await partner.getSourceId(partnerCookie), 5);

      let incomeFromSubpartner;
      do {
        await regUsersAndPlayCases(1, 1, 20, 'USD', subpartnerPromocode);
        const { data: { partners: [p0] } } = await partner.getStatsSubpartner(partnerCookie);
        incomeFromSubpartner = p0.webmasterSum;
        // console.log(incomeFromSubpartner);
      } while (incomeFromSubpartner < 1);
      await partner.setBalance(partnerId, incomeFromSubpartner);

      const { data } = await register.oneClickReg();
      await partner.connectUser(partnerCookie, data.email, `${rndPhoneForPartner()}`);
      const withdrawal = await partner.addWithdrawal(partnerCookie,
        incomeFromSubpartner.toFixed(2));
      // console.log(withdrawal);
      checkPartnerError(withdrawal, 400, 'Для вывода средств, Вам необходимо привести не менее 10 клиентов через систему реферальных ссылок, а их общая сумма депозитов должна составлять не менее 70 EUR. На данный момент у Вас привлечено 10 активных клиентов и общая сумма их депозитов составляет 50 EUR.');
    });
  });
  // есть деньги от субпартнера, у партнера выполнены условия вывода
  describe('Successful withdrawal', () => {
    it('C2171280 - Money from one subpartner, withdraw only subpartners income, RUB', async () => {
      const { cookie: partnerCookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
      const hash = await partner.UrlSubPartner(partnerCookie);
      const { cookie: subpartnerCookie } = await partner
        .registerRevshare(subpartnerEmail, defaultPass, 'RUB', hash);
      const { data: { id: partnerPromocodeId } } = await partner
        .createPromocode(partnerCookie, partnerPromocode);
      await partner.createPromocode(subpartnerCookie, subpartnerPromocode);
      await regUsersAndPlayCases(10, 1, 100, 'RUB', partnerPromocode,
        partnerId, partnerPromocodeId, await partner.getSourceId(partnerCookie), 500);

      let incomeFromSubpartner;
      do {
        await regUsersAndPlayCases(1, 1, 20, 'USD', subpartnerPromocode);
        const { data: { partners: [p0] } } = await partner.getStatsSubpartner(partnerCookie);
        incomeFromSubpartner = p0.webmasterSum;
        // console.log(incomeFromSubpartner);
      } while (incomeFromSubpartner < 5);
      await partner.setBalance(partnerId, 500 + incomeFromSubpartner);

      const { data } = await register.oneClickReg();
      await partner.connectUser(partnerCookie, data.email, `${rndPhoneForPartner()}`);
      const withdrawal = await partner.addWithdrawal(partnerCookie,
        incomeFromSubpartner.toFixed(2));
      // console.log(withdrawal);});

      expect(withdrawal.balance).toEqual(500);
      const { data: { user: { balance } } } = await partner.getUserInfo(partnerCookie);
      expect(balance).toEqual('500.00');
    });
    it('C2171281 - Money from one subpartner, withdraw only subpartners income, USD', async () => {
      const { cookie: partnerCookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
      const hash = await partner.UrlSubPartner(partnerCookie);
      const { cookie: subpartnerCookie } = await partner
        .registerRevshare(subpartnerEmail, defaultPass, 'USD', hash);
      const { data: { id: partnerPromocodeId } } = await partner
        .createPromocode(partnerCookie, partnerPromocode);
      await partner.createPromocode(subpartnerCookie, subpartnerPromocode);
      await regUsersAndPlayCases(10, 1, 20, 'USD', partnerPromocode,
        partnerId, partnerPromocodeId, await partner.getSourceId(partnerCookie), 20);

      let incomeFromSubpartner;
      do {
        await regUsersAndPlayCases(1, 1, 20, 'USD', subpartnerPromocode);
        const { data: { partners: [p0] } } = await partner.getStatsSubpartner(partnerCookie);
        incomeFromSubpartner = p0.webmasterSum;
        // console.log(incomeFromSubpartner);
      } while (incomeFromSubpartner < 2);
      await partner.setBalance(partnerId, 50 + incomeFromSubpartner);

      const { data } = await register.oneClickReg();
      await partner.connectUser(partnerCookie, data.email, `${rndPhoneForPartner()}`);
      const withdrawal = await partner.addWithdrawal(partnerCookie,
        incomeFromSubpartner.toFixed(2));
      // console.log(withdrawal);});

      expect(withdrawal.balance).toEqual(50);
      const { data: { user: { balance } } } = await partner.getUserInfo(partnerCookie);
      expect(balance).toEqual('50.00');
    });
    it('C2171282 - Money from one subpartner, withdraw only subpartners income, EUR', async () => {
      const { cookie: partnerCookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
      const hash = await partner.UrlSubPartner(partnerCookie);
      const { cookie: subpartnerCookie } = await partner
        .registerRevshare(subpartnerEmail, defaultPass, 'EUR', hash);
      const { data: { id: partnerPromocodeId } } = await partner
        .createPromocode(partnerCookie, partnerPromocode);
      await partner.createPromocode(subpartnerCookie, subpartnerPromocode);
      await regUsersAndPlayCases(10, 1, 20, 'EUR', partnerPromocode,
        partnerId, partnerPromocodeId, await partner.getSourceId(partnerCookie), 50);

      let incomeFromSubpartner;
      do {
        await regUsersAndPlayCases(1, 1, 20, 'EUR', subpartnerPromocode);
        const { data: { partners: [p0] } } = await partner.getStatsSubpartner(partnerCookie);
        incomeFromSubpartner = p0.webmasterSum;
        // console.log(incomeFromSubpartner);
      } while (incomeFromSubpartner < 1);
      await partner.setBalance(partnerId, 50 + incomeFromSubpartner);

      const { data } = await register.oneClickReg();
      await partner.connectUser(partnerCookie, data.email, `${rndPhoneForPartner()}`);
      const withdrawal = await partner.addWithdrawal(partnerCookie,
        incomeFromSubpartner.toFixed(2));
      // console.log(withdrawal);});

      expect(withdrawal.balance).toEqual(50);
      const { data: { user: { balance } } } = await partner.getUserInfo(partnerCookie);
      expect(balance).toEqual('50.00');
    });
    it('C2171283 - Money from several subpartners, withdraw all balance, RUB', async () => {
      const subpartnerEmail2 = `${randomStr(10)}@ahem.email`;
      const subpartnerPromocode2 = `${randomStr(8)}`;

      const { cookie: partnerCookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
      const hash = await partner.UrlSubPartner(partnerCookie);
      const { cookie: subpartnerCookie } = await partner
        .registerRevshare(subpartnerEmail, defaultPass, 'RUB', hash);
      const { cookie: subpartnerCookie2 } = await partner
        .registerRevshare(subpartnerEmail2, defaultPass, 'RUB', hash);

      const { data: { id: partnerPromocodeId } } = await partner
        .createPromocode(partnerCookie, partnerPromocode);
      await partner.createPromocode(subpartnerCookie, subpartnerPromocode);
      await partner.createPromocode(subpartnerCookie2, subpartnerPromocode2);

      await regUsersAndPlayCases(10, 1, 100, 'RUB', partnerPromocode,
        partnerId, partnerPromocodeId, await partner.getSourceId(partnerCookie), 500);

      let incomeFromSubpartner;
      do {
        await regUsersAndPlayCases(1, 1, 20, 'USD', subpartnerPromocode);
        await regUsersAndPlayCases(1, 1, 20, 'USD', subpartnerPromocode2);
        const { data: { partners: [p0, p1] } } = await partner.getStatsSubpartner(partnerCookie);
        incomeFromSubpartner = p0.webmasterSum + p1.webmasterSum;
        // console.log(incomeFromSubpartner);
      } while (incomeFromSubpartner < 5);
      await partner.setBalance(partnerId, 500 + incomeFromSubpartner);

      const { data } = await register.oneClickReg();
      await partner.connectUser(partnerCookie, data.email, `${rndPhoneForPartner()}`);
      const withdrawal = await partner.addWithdrawal(partnerCookie,
        (500 + incomeFromSubpartner).toFixed(2));
      // console.log(withdrawal);});

      expect(withdrawal.balance).toEqual(0.00);
      const { data: { user: { balance } } } = await partner.getUserInfo(partnerCookie);
      expect(balance).toEqual('0.00');
    });
    it('C2171284 - Money from several subpartners, withdraw all balance, USD', async () => {
      const subpartnerEmail2 = `${randomStr(10)}@ahem.email`;
      const subpartnerPromocode2 = `${randomStr(8)}`;

      const { cookie: partnerCookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'USD');
      const hash = await partner.UrlSubPartner(partnerCookie);
      const { cookie: subpartnerCookie } = await partner
        .registerRevshare(subpartnerEmail, defaultPass, 'USD', hash);
      const { cookie: subpartnerCookie2 } = await partner
        .registerRevshare(subpartnerEmail2, defaultPass, 'USD', hash);

      const { data: { id: partnerPromocodeId } } = await partner
        .createPromocode(partnerCookie, partnerPromocode);
      await partner.createPromocode(subpartnerCookie, subpartnerPromocode);
      await partner.createPromocode(subpartnerCookie2, subpartnerPromocode2);

      await regUsersAndPlayCases(10, 1, 20, 'USD', partnerPromocode,
        partnerId, partnerPromocodeId, await partner.getSourceId(partnerCookie), 20);

      let incomeFromSubpartner;
      do {
        await regUsersAndPlayCases(1, 1, 20, 'USD', subpartnerPromocode);
        await regUsersAndPlayCases(1, 1, 20, 'USD', subpartnerPromocode2);
        const { data: { partners: [p0, p1] } } = await partner.getStatsSubpartner(partnerCookie);
        incomeFromSubpartner = p0.webmasterSum + p1.webmasterSum;
        // console.log(incomeFromSubpartner);
      } while (incomeFromSubpartner < 2);
      await partner.setBalance(partnerId, 50 + incomeFromSubpartner);

      const { data } = await register.oneClickReg();
      await partner.connectUser(partnerCookie, data.email, `${rndPhoneForPartner()}`);
      const withdrawal = await partner.addWithdrawal(partnerCookie,
        (50 + incomeFromSubpartner).toFixed(2));
      // console.log(withdrawal);});

      expect(withdrawal.balance).toEqual(0.00);
      const { data: { user: { balance } } } = await partner.getUserInfo(partnerCookie);
      expect(balance).toEqual('0.00');
    });
    it('C2171285 - Money from several subpartners, withdraw all balance, EUR', async () => {
      const subpartnerEmail2 = `${randomStr(10)}@ahem.email`;
      const subpartnerPromocode2 = `${randomStr(8)}`;

      const { cookie: partnerCookie, info: { user: { id: partnerId } } } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR');
      const hash = await partner.UrlSubPartner(partnerCookie);
      const { cookie: subpartnerCookie } = await partner
        .registerRevshare(subpartnerEmail, defaultPass, 'EUR', hash);
      const { cookie: subpartnerCookie2 } = await partner
        .registerRevshare(subpartnerEmail2, defaultPass, 'EUR', hash);

      const { data: { id: partnerPromocodeId } } = await partner
        .createPromocode(partnerCookie, partnerPromocode);
      await partner.createPromocode(subpartnerCookie, subpartnerPromocode);
      await partner.createPromocode(subpartnerCookie2, subpartnerPromocode2);

      await regUsersAndPlayCases(10, 1, 20, 'EUR', partnerPromocode,
        partnerId, partnerPromocodeId, await partner.getSourceId(partnerCookie), 20);

      let incomeFromSubpartner;
      do {
        await regUsersAndPlayCases(1, 1, 20, 'EUR', subpartnerPromocode);
        await regUsersAndPlayCases(1, 1, 20, 'EUR', subpartnerPromocode2);
        const { data: { partners: [p0, p1] } } = await partner.getStatsSubpartner(partnerCookie);
        incomeFromSubpartner = p0.webmasterSum + p1.webmasterSum;
        // console.log(incomeFromSubpartner);
      } while (incomeFromSubpartner < 1);
      await partner.setBalance(partnerId, 50 + incomeFromSubpartner);

      const { data } = await register.oneClickReg();
      await partner.connectUser(partnerCookie, data.email, `${rndPhoneForPartner()}`);
      const withdrawal = await partner.addWithdrawal(partnerCookie,
        (50 + incomeFromSubpartner).toFixed(2));
      // console.log(withdrawal);});

      expect(withdrawal.balance).toEqual(0.00);
      const { data: { user: { balance } } } = await partner.getUserInfo(partnerCookie);
      expect(balance).toEqual('0.00');
    });
  });
});
