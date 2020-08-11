import { banking, getMinDepAmount } from '../../../src/methods/banking';
import { checkUserdataSnippet } from '../../../src/expects/exBanking';
import { register } from '../../../src/methods/register';

describe('Userdata snippet for user with eur', () => {
  const currency = 'EUR';
  let minDepAmount;
  beforeAll(async () => {
    minDepAmount = await getMinDepAmount(currency);
  });

  it('C2172171 user with no deposits', async () => {
    await register.oneClickRegEUR();
    const { data } = await banking.userdataSnippet(currency);
    // console.log(data);
    checkUserdataSnippet(data, 'card', minDepAmount);
  });

  describe('user with one deposit', () => {
    describe('deposit method = card', () => {
      const paymentMethod = 'card';
      const walletId = '4132788660217293';
      it('C2172172 amount < 900 rub', async () => {
        const { data: user } = await register.oneClickRegEUR();
        await banking
          .createDepositInBD(user.id, currency, 5, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, minDepAmount);
      });
      it('C2172173 900 rub < amount < 1000 rub', async () => {
        const { data: user } = await register.oneClickRegEUR();
        await banking
          .createDepositInBD(user.id, currency, 12, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, minDepAmount);
      });
      it('C2172174 amount > 1000 rub', async () => {
        const { data: user } = await register.oneClickRegEUR();
        await banking
          .createDepositInBD(user.id, currency, 16, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 20);
      });
      it('C2172175 amount > max merchant amount', async () => {
        const { data: user } = await register.oneClickRegEUR();
        await banking
          .createDepositInBD(user.id, currency, 1001, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 1000);
      });
    });
    describe('deposit method = qiwi_eur', () => {
      const paymentMethod = 'qiwi_eur';
      const walletId = '79041234567';
      it('C2172176 amount < 900 rub', async () => {
        const { data: user } = await register.oneClickRegEUR();
        await banking
          .createDepositInBD(user.id, currency, 10, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, minDepAmount);
      });
      it('C2172177 900 rub < amount < 1000 rub', async () => {
        const { data: user } = await register.oneClickRegEUR();
        await banking
          .createDepositInBD(user.id, currency, 11.5, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, minDepAmount);
      });
      it('C2172178 amount > 1000 rub', async () => {
        const { data: user } = await register.oneClickRegEUR();
        await banking
          .createDepositInBD(user.id, currency, 341, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 345);
      });
      it('C2172179 amount > max merchant amount', async () => {
        const { data: user } = await register.oneClickRegEUR();
        await banking
          .createDepositInBD(user.id, currency, 3401, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 3400);
      });
    });
    describe('deposit method = btc_usd', () => {
      const paymentMethod = 'btc_usd';
      const walletId = '5123564544';
      it('C2172180 amount < 900 rub', async () => {
        const { data: user } = await register.oneClickRegEUR();
        await banking
          .createDepositInBD(user.id, currency, 10, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 25);
      });
      it('C2172181 900 rub < amount < 1000 rub', async () => {
        const { data: user } = await register.oneClickRegEUR();
        await banking
          .createDepositInBD(user.id, currency, 11, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 25);
      });
      it('C2172182 amount > 1000 rub', async () => {
        const { data: user } = await register.oneClickRegEUR();
        // console.log(user.email, user.password);
        await banking
          .createDepositInBD(user.id, currency, 59, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 60);
      });
      it('C2172183 amount > max merchant amount', async () => {
        const { data: user } = await register.oneClickRegEUR();
        await banking
          .createDepositInBD(user.id, currency, 3301, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 3300);
      });
    });
    describe('deposit method = eth_usd', () => {
      const paymentMethod = 'eth_usd';
      const walletId = '876686785';
      it('C2172184 amount < 900 rub', async () => {
        const { data: user } = await register.oneClickRegEUR();
        await banking
          .createDepositInBD(user.id, currency, 9, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 25);
      });
      it('C2172185 900 rub < amount < 1000 rub', async () => {
        const { data: user } = await register.oneClickRegEUR();
        await banking
          .createDepositInBD(user.id, currency, 11, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 25);
      });
      it('C2172186 amount > 1000 rub', async () => {
        const { data: user } = await register.oneClickRegEUR();
        // console.log(user.email, user.password);
        await banking
          .createDepositInBD(user.id, currency, 1231, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 1235);
      });
      it('C2172187 amount > max merchant amount', async () => {
        const { data: user } = await register.oneClickRegEUR();
        await banking
          .createDepositInBD(user.id, currency, 3301, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 3300);
      });
    });
  });

  describe('user with several deposits', () => {
    describe('same payment method', () => {
      const paymentMethod = 'card';
      const walletId = '4132788660217293';
      it('C2172188 average amount < 900 rub', async () => {
        const { data: user } = await register.oneClickRegEUR();
        await banking
          .createDepositInBD(user.id, currency, 10, new Date(), paymentMethod, walletId);
        await banking
          .createDepositInBD(user.id, currency, 10, new Date(), paymentMethod, walletId);
        await banking
          .createDepositInBD(user.id, currency, 11, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, minDepAmount);
      });
      it('C2172189 900 rub < average amount < 1000 rub', async () => {
        const { data: user } = await register.oneClickRegEUR();
        await banking
          .createDepositInBD(user.id, currency, 12, new Date(), paymentMethod, walletId);
        await banking
          .createDepositInBD(user.id, currency, 11.5, new Date(), paymentMethod, walletId);
        await banking
          .createDepositInBD(user.id, currency, 12, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, minDepAmount);
      });
      it('C2172190 average amount > 1000 rub', async () => {
        const { data: user } = await register.oneClickRegEUR();
        await banking
          .createDepositInBD(user.id, currency, 30, new Date(), paymentMethod, walletId);
        await banking
          .createDepositInBD(user.id, currency, 18, new Date(), paymentMethod, walletId);
        await banking
          .createDepositInBD(user.id, currency, 35, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 30);
      });
      it('C2172191 average amount > max merchant amount', async () => {
        const { data: user } = await register.oneClickRegEUR();
        await banking
          .createDepositInBD(user.id, currency, 1001, new Date(), paymentMethod, walletId);
        await banking
          .createDepositInBD(user.id, currency, 1002, new Date(), paymentMethod, walletId);
        await banking
          .createDepositInBD(user.id, currency, 1003, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 1000);
      });
    });
    describe('different payment methods', () => {
      const paymentMethod1 = 'card';
      const walletId1 = '4132788660217293';
      const paymentMethod2 = 'qiwi_eur';
      const walletId2 = '79031234567';
      const paymentMethod3 = 'btc_usd';
      const walletId3 = '5123564544';
      it('C2172192 two deposits, different methods', async () => {
        const { data: user } = await register.oneClickRegEUR();
        await banking
          .createDepositInBD(user.id, currency, 11, new Date(), paymentMethod2, walletId2);
        await banking
          .createDepositInBD(user.id, currency, 10, new Date(), paymentMethod1, walletId1);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod1, minDepAmount);
      });
      it('C2172193 two deposits with one payment method and one with other, avg amount < 900 rub', async () => {
        const { data: user } = await register.oneClickRegEUR();
        await banking
          .createDepositInBD(user.id, currency, 11, new Date(), paymentMethod1, walletId1);
        await banking
          .createDepositInBD(user.id, currency, 10, new Date(), paymentMethod2, walletId2);
        await banking
          .createDepositInBD(user.id, currency, 10, new Date(), paymentMethod2, walletId2);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod2, minDepAmount);
      });
      it('C2172194 two deposits with one payment method and one with other, 900 rub < avg amount < 1000 rub', async () => {
        const { data: user } = await register.oneClickRegEUR();
        await banking
          .createDepositInBD(user.id, currency, 12, new Date(), paymentMethod1, walletId1);
        await banking
          .createDepositInBD(user.id, currency, 11, new Date(), paymentMethod2, walletId2);
        await banking
          .createDepositInBD(user.id, currency, 12, new Date(), paymentMethod2, walletId2);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod2, minDepAmount);
      });
      it('C2172195 two deposits with one payment method and one with other, avg amount > 1000 rub', async () => {
        const { data: user } = await register.oneClickRegEUR();
        await banking
          .createDepositInBD(user.id, currency, 20, new Date(), paymentMethod1, walletId1);
        await banking
          .createDepositInBD(user.id, currency, 31, new Date(), paymentMethod2, walletId2);
        await banking
          .createDepositInBD(user.id, currency, 58, new Date(), paymentMethod2, walletId2);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod2, 40);
      });
      it('C2172196 two deposits with one payment method and one with other, avg amount > max merchant amount', async () => {
        const { data: user } = await register.oneClickRegEUR();
        await banking
          .createDepositInBD(user.id, currency, 1000, new Date(), paymentMethod1, walletId1);
        await banking
          .createDepositInBD(user.id, currency, 1000, new Date(), paymentMethod1, walletId1);
        await banking
          .createDepositInBD(user.id, currency, 3300, new Date(), paymentMethod2, walletId2);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod1, 1000);
      });
      it('C2172197 two deposits with one payment method and one with other, avg amount < min merchant amount', async () => {
        const { data: user } = await register.oneClickRegEUR();
        // console.log(user.email, user.password);
        await banking
          .createDepositInBD(user.id, currency, 10, new Date(), paymentMethod2, walletId2);
        await banking
          .createDepositInBD(user.id, currency, 25, new Date(), paymentMethod3, walletId3);
        await banking
          .createDepositInBD(user.id, currency, 25, new Date(), paymentMethod3, walletId3);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod3, 20);
        // это ок, должен быть хардкод на фронте, переключится на мин сумму для btc/eth
      });
      it('C2172198 deposits with three methods, the most used is returned', async () => {
        /* eslint no-await-in-loop: off */
        const { data: user } = await register.oneClickRegEUR();
        // console.log(user.email, user.password);
        for (let i = 0; i < 3; i++) {
          await banking
            .createDepositInBD(user.id, currency, 10, new Date(), paymentMethod1, walletId1);
        }
        for (let i = 0; i < 5; i++) {
          await banking
            .createDepositInBD(user.id, currency, 41, new Date(), paymentMethod2, walletId2);
        }
        for (let i = 0; i < 2; i++) {
          await banking
            .createDepositInBD(user.id, currency, 38, new Date(), paymentMethod3, walletId3);
        }
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod2, 35);
      });
    });
  });
});
