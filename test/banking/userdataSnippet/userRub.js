import { banking } from '../../../src/methods/banking';
import { checkUserdataSnippet } from '../../../src/expects/exBanking';
import { register } from '../../../src/methods/register';

describe('Userdata snippet for user with rub', () => {
  const currency = 'RUB';
  it('C2172089 user with no deposits', async () => {
    await register.oneClickReg();
    const { data } = await banking.userdataSnippet(currency);
    // console.log(data);
    checkUserdataSnippet(data, 'card_rub', 900);
  });

  describe('user with one deposit', () => {
    describe('deposit method = card_rub', () => {
      const paymentMethod = 'card_rub';
      const walletId = '4132788660217293';
      it('C2172090 amount < 900', async () => {
        const { data: user } = await register.oneClickReg();
        await banking
          .createDepositInBD(user.id, currency, 899, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 900);
      });
      it('C2172091 900 < amount < 1000', async () => {
        const { data: user } = await register.oneClickReg();
        await banking
          .createDepositInBD(user.id, currency, 958, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 900);
      });
      it('C2172092 amount >= 1000', async () => {
        const { data: user } = await register.oneClickReg();
        await banking
          .createDepositInBD(user.id, currency, 1015, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 1100);
      });
      it('C2172093 amount > max merchant amount', async () => {
        const { data: user } = await register.oneClickReg();
        await banking
          .createDepositInBD(user.id, currency, 120000, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 100000);
      });
    });
    describe('deposit method = qiwi_rub', () => {
      const paymentMethod = 'qiwi_rub';
      const walletId = '79001234567';
      it('C2172094 amount < 900', async () => {
        const { data: user } = await register.oneClickReg();
        await banking
          .createDepositInBD(user.id, currency, 352, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 900);
      });
      it('C2172095 900 < amount < 1000', async () => {
        const { data: user } = await register.oneClickReg();
        await banking
          .createDepositInBD(user.id, currency, 999, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 900);
      });
      it('C2172096 amount >= 1000', async () => {
        const { data: user } = await register.oneClickReg();
        await banking
          .createDepositInBD(user.id, currency, 1000, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 1000);
      });
      it('C2172097 amount > max merchant amount', async () => {
        const { data: user } = await register.oneClickReg();
        await banking
          .createDepositInBD(user.id, currency, 260000, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 250000);
      });
    });
    describe('deposit method = beeline_rub', () => {
      const paymentMethod = 'beeline_rub';
      const walletId = '9001234567';
      it('C2172098 amount < 900', async () => {
        const { data: user } = await register.oneClickReg();
        await banking
          .createDepositInBD(user.id, currency, 214, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 900);
      });
      it('C2172099 900 < amount < 1000', async () => {
        const { data: user } = await register.oneClickReg();
        await banking
          .createDepositInBD(user.id, currency, 999, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 900);
      });
      it('C2172100 amount > 1000', async () => {
        const { data: user } = await register.oneClickReg();
        await banking
          .createDepositInBD(user.id, currency, 1001, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 1100);
      });
      it('C2172101 amount > max merchant amount', async () => {
        const { data: user } = await register.oneClickReg();
        await banking
          .createDepositInBD(user.id, currency, 20020, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 15000);
      });
    });
    describe('deposit method = mts_rub', () => {
      const paymentMethod = 'mts_rub';
      const walletId = '9111234567';
      it('C2172102 amount < 900', async () => {
        const { data: user } = await register.oneClickReg();
        await banking
          .createDepositInBD(user.id, currency, 756, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 900);
      });
      it('C2172103 900 < amount < 1000', async () => {
        const { data: user } = await register.oneClickReg();
        await banking
          .createDepositInBD(user.id, currency, 901, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 900);
      });
      it('C2172104 amount > 1000', async () => {
        const { data: user } = await register.oneClickReg();
        await banking
          .createDepositInBD(user.id, currency, 1099, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 1100);
      });
      it('C2172105 amount > max merchant amount', async () => {
        const { data: user } = await register.oneClickReg();
        await banking
          .createDepositInBD(user.id, currency, 15000, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 14999);
      });
    });
    describe('deposit method = megafon_rub', () => {
      const paymentMethod = 'megafon_rub';
      const walletId = '9272388311';
      it('C2172106 amount < 900', async () => {
        const { data: user } = await register.oneClickReg();
        await banking
          .createDepositInBD(user.id, currency, 15, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 900);
      });
      it('C2172107 900 < amount < 1000', async () => {
        const { data: user } = await register.oneClickReg();
        await banking
          .createDepositInBD(user.id, currency, 944, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 900);
      });
      it('C2172108 amount > 1000', async () => {
        const { data: user } = await register.oneClickReg();
        // console.log(user.email, user.password);
        await banking
          .createDepositInBD(user.id, currency, 1000, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 1000);
      });
      it('C2172109 amount > max merchant amount', async () => {
        const { data: user } = await register.oneClickReg();
        await banking
          .createDepositInBD(user.id, currency, 15001, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 15000);
      });
    });
    describe('deposit method = tele2_rub', () => {
      const paymentMethod = 'tele2_rub';
      const walletId = '9521388311';
      it('C2172110 amount < 900', async () => {
        const { data: user } = await register.oneClickReg();
        await banking
          .createDepositInBD(user.id, currency, 111, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 900);
      });
      it('C2172111 900 < amount < 1000', async () => {
        const { data: user } = await register.oneClickReg();
        await banking
          .createDepositInBD(user.id, currency, 977, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 900);
      });
      it('C2172112 amount > 1000', async () => {
        const { data: user } = await register.oneClickReg();
        // console.log(user.email, user.password);
        await banking
          .createDepositInBD(user.id, currency, 5555, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 5600);
      });
      it('C2172113 amount > max merchant amount', async () => {
        const { data: user } = await register.oneClickReg();
        await banking
          .createDepositInBD(user.id, currency, 16666, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 15000);
      });
    });
    describe('deposit method = yamoney_rub', () => {
      const paymentMethod = 'yamoney_rub';
      const walletId = '231354153212';
      it('C2172114 amount < 900', async () => {
        const { data: user } = await register.oneClickReg();
        await banking
          .createDepositInBD(user.id, currency, 234, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 900);
      });
      it('C2172115 900 < amount < 1000', async () => {
        const { data: user } = await register.oneClickReg();
        await banking
          .createDepositInBD(user.id, currency, 987, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 900);
      });
      it('C2172116 amount > 1000', async () => {
        const { data: user } = await register.oneClickReg();
        // console.log(user.email, user.password);
        await banking
          .createDepositInBD(user.id, currency, 1009, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 1100);
      });
      it('C2172117 amount > max merchant amount', async () => {
        const { data: user } = await register.oneClickReg();
        await banking
          .createDepositInBD(user.id, currency, 150000, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 100000);
      });
    });
    describe('deposit method = piastrix_rub', () => {
      const paymentMethod = 'piastrix_rub';
      const walletId = 'P3545315';
      it('C2172118 amount < 900', async () => {
        const { data: user } = await register.oneClickReg();
        await banking
          .createDepositInBD(user.id, currency, 891, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 900);
      });
      it('C2172119 900 < amount < 1000', async () => {
        const { data: user } = await register.oneClickReg();
        await banking
          .createDepositInBD(user.id, currency, 900, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 900);
      });
      it('C2172120 amount > 1000', async () => {
        const { data: user } = await register.oneClickReg();
        // console.log(user.email, user.password);
        await banking
          .createDepositInBD(user.id, currency, 1200, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 1200);
      });
      it('C2172121 amount > max merchant amount', async () => {
        const { data: user } = await register.oneClickReg();
        await banking
          .createDepositInBD(user.id, currency, 100001, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 100000);
      });
    });
    describe('deposit method = btc_usd', () => {
      const paymentMethod = 'btc_usd';
      const walletId = '5123564544';
      it('C2172122 amount < 900', async () => {
        const { data: user } = await register.oneClickReg();
        await banking
          .createDepositInBD(user.id, currency, 666, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 2250);
      });
      it('C2172123 900 < amount < 1000', async () => {
        const { data: user } = await register.oneClickReg();
        await banking
          .createDepositInBD(user.id, currency, 965, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 2250);
      });
      it('C2172124 amount > 1000', async () => {
        const { data: user } = await register.oneClickReg();
        // console.log(user.email, user.password);
        await banking
          .createDepositInBD(user.id, currency, 3333, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 3400);
      });
      it('C2172125 amount > max merchant amount', async () => {
        const { data: user } = await register.oneClickReg();
        await banking
          .createDepositInBD(user.id, currency, 350000, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 210000);
      });
    });
    describe('deposit method = eth_usd', () => {
      const paymentMethod = 'eth_usd';
      const walletId = '876686785';
      it('C2172126 amount < 900', async () => {
        const { data: user } = await register.oneClickReg();
        await banking
          .createDepositInBD(user.id, currency, 230, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 1750);
      });
      it('C2172127 900 < amount < 1000', async () => {
        const { data: user } = await register.oneClickReg();
        await banking
          .createDepositInBD(user.id, currency, 999, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 1750);
      });
      it('C2172128 amount > 1000', async () => {
        const { data: user } = await register.oneClickReg();
        // console.log(user.email, user.password);
        await banking
          .createDepositInBD(user.id, currency, 1760, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 1800);
      });
      it('C2172129 amount > max merchant amount', async () => {
        const { data: user } = await register.oneClickReg();
        await banking
          .createDepositInBD(user.id, currency, 210001, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 210000);
      });
    });
  });

  describe('user with several deposits', () => {
    describe('same payment method', () => {
      const paymentMethod = 'card_rub';
      const walletId = '4132788660217293';
      it('average amount < 900', async () => {
        const { data: user } = await register.oneClickReg();
        await banking
          .createDepositInBD(user.id, currency, 200, new Date(), paymentMethod, walletId);
        await banking
          .createDepositInBD(user.id, currency, 300, new Date(), paymentMethod, walletId);
        await banking
          .createDepositInBD(user.id, currency, 400, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 900);
      });
      it('900 < average amount < 1000', async () => {
        const { data: user } = await register.oneClickReg();
        await banking
          .createDepositInBD(user.id, currency, 910, new Date(), paymentMethod, walletId);
        await banking
          .createDepositInBD(user.id, currency, 930, new Date(), paymentMethod, walletId);
        await banking
          .createDepositInBD(user.id, currency, 960, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 900);
      });
      it('average amount = 1000', async () => {
        const { data: user } = await register.oneClickReg();
        // console.log(user.email, user.password);
        await banking
          .createDepositInBD(user.id, currency, 950, new Date(), paymentMethod, walletId);
        await banking
          .createDepositInBD(user.id, currency, 1000, new Date(), paymentMethod, walletId);
        await banking
          .createDepositInBD(user.id, currency, 1050, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 1000);
      });
      it('average amount > 1000', async () => {
        const { data: user } = await register.oneClickReg();
        await banking
          .createDepositInBD(user.id, currency, 1060, new Date(), paymentMethod, walletId);
        await banking
          .createDepositInBD(user.id, currency, 2280, new Date(), paymentMethod, walletId);
        await banking
          .createDepositInBD(user.id, currency, 1150, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 1500);
      });
      it('average amount > max merchant amount', async () => {
        const { data: user } = await register.oneClickReg();
        await banking
          .createDepositInBD(user.id, currency, 111111, new Date(), paymentMethod, walletId);
        await banking
          .createDepositInBD(user.id, currency, 222222, new Date(), paymentMethod, walletId);
        await banking
          .createDepositInBD(user.id, currency, 333333, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 100000);
      });
    });
    describe('different payment methods', () => {
      const paymentMethod1 = 'card_rub';
      const walletId1 = '4132788660217293';
      const paymentMethod2 = 'mts_rub';
      const walletId2 = '9111234567';
      const paymentMethod3 = 'btc_usd';
      const walletId3 = '5123564544';
      it('C2172130 two deposits, different methods', async () => {
        const { data: user } = await register.oneClickReg();
        await banking
          .createDepositInBD(user.id, currency, 100, new Date(), paymentMethod2, walletId2);
        await banking
          .createDepositInBD(user.id, currency, 20, new Date(), paymentMethod1, walletId1);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod1, 900);
      });
      it('C2172131 two deposits with one payment method and one with other, avg amount < 900', async () => {
        const { data: user } = await register.oneClickReg();
        await banking
          .createDepositInBD(user.id, currency, 100, new Date(), paymentMethod1, walletId1);
        await banking
          .createDepositInBD(user.id, currency, 100, new Date(), paymentMethod2, walletId2);
        await banking
          .createDepositInBD(user.id, currency, 20, new Date(), paymentMethod2, walletId2);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod2, 900);
      });
      it('C2172132 two deposits with one payment method and one with other, 900 < avg amount < 1000', async () => {
        const { data: user } = await register.oneClickReg();
        await banking
          .createDepositInBD(user.id, currency, 900, new Date(), paymentMethod1, walletId1);
        await banking
          .createDepositInBD(user.id, currency, 950, new Date(), paymentMethod2, walletId2);
        await banking
          .createDepositInBD(user.id, currency, 961, new Date(), paymentMethod2, walletId2);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod2, 900);
      });
      it('C2172133 two deposits with one payment method and one with other, avg amount > 1000', async () => {
        const { data: user } = await register.oneClickReg();
        await banking
          .createDepositInBD(user.id, currency, 2000, new Date(), paymentMethod1, walletId1);
        await banking
          .createDepositInBD(user.id, currency, 1000, new Date(), paymentMethod2, walletId2);
        await banking
          .createDepositInBD(user.id, currency, 1100, new Date(), paymentMethod2, walletId2);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod2, 1400);
      });
      it('C2172134 two deposits with one payment method and one with other, avg amount > max merchant amount', async () => {
        const { data: user } = await register.oneClickReg();
        await banking
          .createDepositInBD(user.id, currency, 20000, new Date(), paymentMethod1, walletId1);
        await banking
          .createDepositInBD(user.id, currency, 14000, new Date(), paymentMethod2, walletId2);
        await banking
          .createDepositInBD(user.id, currency, 12000, new Date(), paymentMethod2, walletId2);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod2, 14999);
      });
      it('C2172135 two deposits with one payment method and one with other, avg amount < min merchant amount', async () => {
        const { data: user } = await register.oneClickReg();
        // console.log(user.email, user.password);
        await banking
          .createDepositInBD(user.id, currency, 100, new Date(), paymentMethod2, walletId2);
        await banking
          .createDepositInBD(user.id, currency, 1800, new Date(), paymentMethod3, walletId3);
        await banking
          .createDepositInBD(user.id, currency, 1800, new Date(), paymentMethod3, walletId3);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod3, 1300);
        // это ок, должен быть хардкод на фронте, переключится на мин сумму для btc/eth
      });
      it('C2172136 deposits with three methods, the most used is returned', async () => {
        /* eslint no-await-in-loop: off */
        const { data: user } = await register.oneClickReg();
        // console.log(user.email, user.password);
        for (let i = 0; i < 3; i++) {
          await banking
            .createDepositInBD(user.id, currency, 200, new Date(), paymentMethod1, walletId1);
        }
        for (let i = 0; i < 5; i++) {
          await banking
            .createDepositInBD(user.id, currency, 50, new Date(), paymentMethod2, walletId2);
        }
        for (let i = 0; i < 2; i++) {
          await banking
            .createDepositInBD(user.id, currency, 1750, new Date(), paymentMethod3, walletId3);
        }
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod2, 900);
      });
    });
  });
});
