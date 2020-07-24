import { banking, getMinDepAmount } from '../../../src/methods/banking';
import { checkUserdataSnippet } from '../../../src/expects/exBanking';
import { register } from '../../../src/methods/register';

describe('Userdata snippet for user with uah', () => {
  const currency = 'UAH';
  let minDepAmount;
  beforeAll(async () => {
    minDepAmount = await getMinDepAmount(currency);
  });

  it('C2172199 user with no deposits', async () => {
    await register.oneClickRegUAH();
    const { data } = await banking.userdataSnippet(currency);
    // console.log(data);
    checkUserdataSnippet(data, 'card', minDepAmount);
  });

  describe('user with one deposit', () => {
    describe('deposit method = card', () => {
      const paymentMethod = 'card';
      const walletId = '4132788660217293';
      it('C2172200 amount < 900 rub', async () => {
        const { data: user } = await register.oneClickRegUAH();
        await banking
          .createDepositInBD(user.id, currency, 100, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, minDepAmount);
      });
      it('C2172201 900 rub < amount < 1000 rub', async () => {
        const { data: user } = await register.oneClickRegUAH();
        await banking
          .createDepositInBD(user.id, currency, 374, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, minDepAmount);
      });
      it('C2172202 amount > 1000 rub', async () => {
        const { data: user } = await register.oneClickRegUAH();
        await banking
          .createDepositInBD(user.id, currency, 472, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 475);
      });
      it('C2172203 amount > max merchant amount', async () => {
        const { data: user } = await register.oneClickRegUAH();
        await banking
          .createDepositInBD(user.id, currency, 30001, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 30000);
      });
    });
  });

  describe('user with several deposits', () => {
    describe('same payment method', () => {
      const paymentMethod = 'card';
      const walletId = '4132788660217293';
      it('C2172204 average amount < 900 rub', async () => {
        const { data: user } = await register.oneClickRegUAH();
        await banking
          .createDepositInBD(user.id, currency, 150, new Date(), paymentMethod, walletId);
        await banking
          .createDepositInBD(user.id, currency, 169, new Date(), paymentMethod, walletId);
        await banking
          .createDepositInBD(user.id, currency, 254, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, minDepAmount);
      });
      it('C2172205 900 rub < average amount < 1000 rub', async () => {
        const { data: user } = await register.oneClickRegUAH();
        await banking
          .createDepositInBD(user.id, currency, 363, new Date(), paymentMethod, walletId);
        await banking
          .createDepositInBD(user.id, currency, 384, new Date(), paymentMethod, walletId);
        await banking
          .createDepositInBD(user.id, currency, 371, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, minDepAmount);
      });
      it('C2172206 average amount > 1000 rub', async () => {
        const { data: user } = await register.oneClickRegUAH();
        await banking
          .createDepositInBD(user.id, currency, 418, new Date(), paymentMethod, walletId);
        await banking
          .createDepositInBD(user.id, currency, 523, new Date(), paymentMethod, walletId);
        await banking
          .createDepositInBD(user.id, currency, 888, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 610);
      });
      it('C2172207 average amount > max merchant amount', async () => {
        const { data: user } = await register.oneClickRegUAH();
        await banking
          .createDepositInBD(user.id, currency, 30001, new Date(), paymentMethod, walletId);
        await banking
          .createDepositInBD(user.id, currency, 30002, new Date(), paymentMethod, walletId);
        await banking
          .createDepositInBD(user.id, currency, 30003, new Date(), paymentMethod, walletId);
        const { data } = await banking.userdataSnippet(currency);
        // console.log(data);
        checkUserdataSnippet(data, paymentMethod, 30000);
      });
    });
  });
});
