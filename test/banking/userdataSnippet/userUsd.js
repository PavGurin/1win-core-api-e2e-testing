import { banking, getMinDepAmount } from '../../../src/methods/banking';
import { checkUserdataSnippet } from '../../../src/expects/exBanking';
import { register } from '../../../src/methods/register';

describe('Userdata snippet for user with usd', () => {
  const currency = 'USD';
  let minDepAmount;
  beforeAll(async () => {
    minDepAmount = await getMinDepAmount(currency);
  });

  it('C2172137 user with no deposits', async () => {
    await register.oneClickRegUSD();
    const { data } = await banking.userdataSnippet(currency);
    // console.log(data);
    checkUserdataSnippet(data, 'card', minDepAmount);
  });

  describe('user with one deposit', () => {
    describe('deposit method = card', () => {
      const paymentMethod = 'card';
      const walletId = '4132788660217293';
      it('C2172138 amount < 900 rub', async () => {
        const { data: user } = await register.oneClickRegUSD();
        await banking
          .createDepositInBD(user.id, currency, 5, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, minDepAmount);
      });
      it('C2172139 900 rub < amount < 1000 rub', async () => {
        const { data: user } = await register.oneClickRegUSD();
        await banking
          .createDepositInBD(user.id, currency, 14, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, minDepAmount);
      });
      it('C2172140 amount > 1000 rub', async () => {
        const { data: user } = await register.oneClickRegUSD();
        await banking
          .createDepositInBD(user.id, currency, 27, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 30);
      });
      it('C2172141 amount > max merchant amount', async () => {
        const { data: user } = await register.oneClickRegUSD();
        await banking
          .createDepositInBD(user.id, currency, 1001, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 1000);
      });
    });
    describe('deposit method = qiwi_usd', () => {
      const paymentMethod = 'qiwi_usd';
      const walletId = '79001234567';
      it('C2172142 amount < 900 rub', async () => {
        const { data: user } = await register.oneClickRegUSD();
        await banking
          .createDepositInBD(user.id, currency, 2, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, minDepAmount);
      });
      it('C2172143 900 rub < amount < 1000 rub', async () => {
        const { data: user } = await register.oneClickRegUSD();
        await banking
          .createDepositInBD(user.id, currency, 13, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, minDepAmount);
      });
      it('C2172144 amount > 1000 rub', async () => {
        const { data: user } = await register.oneClickRegUSD();
        await banking
          .createDepositInBD(user.id, currency, 16, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 20);
      });
      it('C2172145 amount > max merchant amount', async () => {
        const { data: user } = await register.oneClickRegUSD();
        await banking
          .createDepositInBD(user.id, currency, 3901, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 3900);
      });
    });
    describe('deposit method = btc_usd', () => {
      const paymentMethod = 'btc_usd';
      const walletId = '5123564544';
      it('C2172146 amount < 900 rub', async () => {
        const { data: user } = await register.oneClickRegUSD();
        await banking
          .createDepositInBD(user.id, currency, 10, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 25);
      });
      it('C2172147 900 rub < amount < 1000 rub', async () => {
        const { data: user } = await register.oneClickRegUSD();
        await banking
          .createDepositInBD(user.id, currency, 13, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 25);
      });
      it('C2172148 amount > 1000 rub', async () => {
        const { data: user } = await register.oneClickRegUSD();
        // console.log(user.email, user.password);
        await banking
          .createDepositInBD(user.id, currency, 267, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 270);
      });
      it('C2172149 amount > max merchant amount', async () => {
        const { data: user } = await register.oneClickRegUSD();
        await banking
          .createDepositInBD(user.id, currency, 3501, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 3500);
      });
    });
    describe('deposit method = eth_usd', () => {
      const paymentMethod = 'eth_usd';
      const walletId = '876686785';
      it('C2172150 amount < 900 rub', async () => {
        const { data: user } = await register.oneClickRegUSD();
        await banking
          .createDepositInBD(user.id, currency, 8, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 25);
      });
      it('C2172151 900 rub < amount < 1000 rub', async () => {
        const { data: user } = await register.oneClickRegUSD();
        await banking
          .createDepositInBD(user.id, currency, 14, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 25);
      });
      it('C2172152 amount > 1000 rub', async () => {
        const { data: user } = await register.oneClickRegUSD();
        // console.log(user.email, user.password);
        await banking
          .createDepositInBD(user.id, currency, 86, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 90);
      });
      it('C2172153 amount > max merchant amount', async () => {
        const { data: user } = await register.oneClickRegUSD();
        await banking
          .createDepositInBD(user.id, currency, 5000, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 3500);
      });
    });
  });

  describe('user with several deposits', () => {
    describe('same payment method', () => {
      const paymentMethod = 'card';
      const walletId = '4132788660217293';
      it('C2172159 average amount < 900 rub', async () => {
        const { data: user } = await register.oneClickRegUSD();
        await banking
          .createDepositInBD(user.id, currency, 11, new Date(), paymentMethod, walletId);
        await banking
          .createDepositInBD(user.id, currency, 12, new Date(), paymentMethod, walletId);
        await banking
          .createDepositInBD(user.id, currency, 11, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, minDepAmount);
      });
      it('C2172160 900 rub < average amount < 1000 rub', async () => {
        const { data: user } = await register.oneClickRegUSD();
        await banking
          .createDepositInBD(user.id, currency, 13, new Date(), paymentMethod, walletId);
        await banking
          .createDepositInBD(user.id, currency, 13, new Date(), paymentMethod, walletId);
        await banking
          .createDepositInBD(user.id, currency, 14, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, minDepAmount);
      });
      it('C2172162 average amount > 1000 rub', async () => {
        const { data: user } = await register.oneClickRegUSD();
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
      it('C2172163 average amount > max merchant amount', async () => {
        const { data: user } = await register.oneClickRegUSD();
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
      const paymentMethod2 = 'qiwi_usd';
      const walletId2 = '79031234567';
      const paymentMethod3 = 'btc_usd';
      const walletId3 = '5123564544';
      it('C2172164 two deposits, different methods', async () => {
        const { data: user } = await register.oneClickRegUSD();
        await banking
          .createDepositInBD(user.id, currency, 11, new Date(), paymentMethod2, walletId2);
        await banking
          .createDepositInBD(user.id, currency, 10, new Date(), paymentMethod1, walletId1);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod1, minDepAmount);
      });
      it('C2172165 two deposits with one payment method and one with other, avg amount < 900 rub', async () => {
        const { data: user } = await register.oneClickRegUSD();
        await banking
          .createDepositInBD(user.id, currency, 11, new Date(), paymentMethod1, walletId1);
        await banking
          .createDepositInBD(user.id, currency, 10, new Date(), paymentMethod2, walletId2);
        await banking
          .createDepositInBD(user.id, currency, 12, new Date(), paymentMethod2, walletId2);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod2, minDepAmount);
      });
      it('C2172166 two deposits with one payment method and one with other, 900 rub < avg amount < 1000 rub', async () => {
        const { data: user } = await register.oneClickRegUSD();
        await banking
          .createDepositInBD(user.id, currency, 13, new Date(), paymentMethod1, walletId1);
        await banking
          .createDepositInBD(user.id, currency, 14, new Date(), paymentMethod2, walletId2);
        await banking
          .createDepositInBD(user.id, currency, 13, new Date(), paymentMethod2, walletId2);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod2, minDepAmount);
      });
      it('C2172167 two deposits with one payment method and one with other, avg amount > 1000 rub', async () => {
        const { data: user } = await register.oneClickRegUSD();
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
      it('C2172168 two deposits with one payment method and one with other, avg amount > max merchant amount', async () => {
        const { data: user } = await register.oneClickRegUSD();
        await banking
          .createDepositInBD(user.id, currency, 1000, new Date(), paymentMethod1, walletId1);
        await banking
          .createDepositInBD(user.id, currency, 1000, new Date(), paymentMethod1, walletId1);
        await banking
          .createDepositInBD(user.id, currency, 3500, new Date(), paymentMethod2, walletId2);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod1, 1000);
      });
      it('C2172169 two deposits with one payment method and one with other, avg amount < min merchant amount', async () => {
        const { data: user } = await register.oneClickRegUSD();
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
      it('C2172170 deposits with three methods, the most used is returned', async () => {
        /* eslint no-await-in-loop: off */
        const { data: user } = await register.oneClickRegUSD();
        // console.log(user.email, user.password);
        for (let i = 0; i < 3; i++) {
          await banking
            .createDepositInBD(user.id, currency, 10, new Date(), paymentMethod1, walletId1);
        }
        for (let i = 0; i < 5; i++) {
          await banking
            .createDepositInBD(user.id, currency, 19, new Date(), paymentMethod2, walletId2);
        }
        for (let i = 0; i < 2; i++) {
          await banking
            .createDepositInBD(user.id, currency, 25, new Date(), paymentMethod3, walletId3);
        }
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod2, 20);
      });
    });
  });
});
