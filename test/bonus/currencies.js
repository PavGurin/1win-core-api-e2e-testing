import { register } from '../../src/methods/register';
import { banking } from '../../src/methods/banking';
import { getUserBonusAmount, setUserBonusAmount } from '../../src/methods/user';
import { makeSuccessfulOrdinaryBet } from '../../src/methods/betsInBD';

describe('Bonus amount spending depending on currency', () => {
  const amount = 500;
  const coeff = 3.56;
  describe('Bonus is paid when bet currency = first deposit currency', () => {
    it('C1789791 (+) currency = RUB', async () => {
      const { data: user } = await register.oneClickReg();
      // console.log(user.id);
      await banking.createDepositInBD(user.id, 'RUB', amount, new Date(), 'card_rub', '4276550046464601', 1, 'payterra');
      await banking.createDepositInBD(user.id, 'USD', amount, new Date(), 'card', '4276550046464601', 1, 'payterra');
      await setUserBonusAmount(user.id, amount);

      const bet = await makeSuccessfulOrdinaryBet(user, 'RUB', amount, coeff);
      expect(bet.status).toBe(2);
      expect(bet.profit).toBe(amount * coeff);
      expect(bet.promo_amount).toBe(amount * 0.05);

      const newBonusAmount = await getUserBonusAmount(user.id);
      expect(newBonusAmount).toBe((amount * 0.95).toString());
    });

    it('C1789792 (+) currency = USD', async () => {
      const { data: user } = await register.oneClickRegUSD();
      // console.log(user.id);
      await banking.createDepositInBD(user.id, 'USD', amount, new Date(), 'card', '4276550046464601', 1, 'payterra');
      await banking.createDepositInBD(user.id, 'RUB', amount, new Date(), 'card_rub', '4276550046464601', 1, 'payterra');
      await setUserBonusAmount(user.id, amount);

      const bet = await makeSuccessfulOrdinaryBet(user, 'USD', amount, coeff);
      expect(bet.status).toBe(2);
      expect(bet.profit).toBe(amount * coeff);
      expect(bet.promo_amount).toBe(amount * 0.05);

      const newBonusAmount = await getUserBonusAmount(user.id);
      expect(newBonusAmount).toBe((amount * 0.95).toString());
    });

    it('C1789793 (+) currency = EUR', async () => {
      const { data: user } = await register.oneClickRegEUR();
      // console.log(user.id);
      await banking.createDepositInBD(user.id, 'EUR', amount, new Date(), 'card', '4276550046464601', 1, 'payterra');
      await banking.createDepositInBD(user.id, 'USD', amount, new Date(), 'card', '4276550046464601', 1, 'payterra');
      await setUserBonusAmount(user.id, amount);

      const bet = await makeSuccessfulOrdinaryBet(user, 'EUR', amount, coeff);
      expect(bet.status).toBe(2);
      expect(bet.profit).toBe(amount * coeff);
      expect(bet.promo_amount).toBe(amount * 0.05);

      const newBonusAmount = await getUserBonusAmount(user.id);
      expect(newBonusAmount).toBe((amount * 0.95).toString());
    });
  });

  describe('Bonus is not paid when bet currency != first deposit currency', () => {
    it('C1789794 (-) first deposit = RUB, bet = USD', async () => {
      const { data: user } = await register.oneClickReg();
      // console.log(user.id);
      await banking.createDepositInBD(user.id, 'RUB', amount, new Date(), 'card_rub', '4276550046464601', 1, 'payterra');
      await banking.createDepositInBD(user.id, 'USD', amount, new Date(), 'card', '4276550046464601', 1, 'payterra');
      await setUserBonusAmount(user.id, amount);

      const bet = await makeSuccessfulOrdinaryBet(user, 'USD', amount, coeff);
      expect(bet.status).toBe(2);
      expect(bet.profit).toBe(amount * coeff);
      expect(bet.promo_amount).toBe(0);

      const newBonusAmount = await getUserBonusAmount(user.id);
      expect(newBonusAmount).toBe(amount.toString());
    });
    it('C1789795 (-) first deposit = RUB, bet = EUR', async () => {
      const { data: user } = await register.oneClickReg();
      // console.log(user.id);
      await banking.createDepositInBD(user.id, 'RUB', amount, new Date(), 'card_rub', '4276550046464601', 1, 'payterra');
      await banking.createDepositInBD(user.id, 'EUR', amount, new Date(), 'card', '4276550046464601', 1, 'payterra');
      await setUserBonusAmount(user.id, amount);

      const bet = await makeSuccessfulOrdinaryBet(user, 'EUR', amount, coeff);
      expect(bet.status).toBe(2);
      expect(bet.profit).toBe(amount * coeff);
      expect(bet.promo_amount).toBe(0);

      const newBonusAmount = await getUserBonusAmount(user.id);
      expect(newBonusAmount).toBe(amount.toString());
    });
    it('C1789796 (-) first deposit = USD, bet = RUB', async () => {
      const { data: user } = await register.oneClickRegUSD();
      // console.log(user.id);
      await banking.createDepositInBD(user.id, 'USD', amount, new Date(), 'card', '4276550046464601', 1, 'payterra');
      await banking.createDepositInBD(user.id, 'RUB', amount, new Date(), 'card_rub', '4276550046464601', 1, 'payterra');
      await setUserBonusAmount(user.id, amount);

      const bet = await makeSuccessfulOrdinaryBet(user, 'RUB', amount, coeff);
      expect(bet.status).toBe(2);
      expect(bet.profit).toBe(amount * coeff);
      expect(bet.promo_amount).toBe(0);

      const newBonusAmount = await getUserBonusAmount(user.id);
      expect(newBonusAmount).toBe(amount.toString());
    });

    it('C1789797 (-) first deposit = USD, bet = EUR', async () => {
      const { data: user } = await register.oneClickRegUSD();
      // console.log(user.id);
      await banking.createDepositInBD(user.id, 'USD', amount, new Date(), 'card', '4276550046464601', 1, 'payterra');
      await banking.createDepositInBD(user.id, 'EUR', amount, new Date(), 'card', '4276550046464601', 1, 'payterra');
      await setUserBonusAmount(user.id, amount);

      const bet = await makeSuccessfulOrdinaryBet(user, 'EUR', amount, coeff);
      expect(bet.status).toBe(2);
      expect(bet.profit).toBe(amount * coeff);
      expect(bet.promo_amount).toBe(0);

      const newBonusAmount = await getUserBonusAmount(user.id);
      expect(newBonusAmount).toBe(amount.toString());
    });
    it('C1789798 (-) first deposit = EUR, bet = RUB', async () => {
      const { data: user } = await register.oneClickRegEUR();
      // console.log(user.id);
      await banking.createDepositInBD(user.id, 'EUR', amount, new Date(), 'card', '4276550046464601', 1, 'payterra');
      await banking.createDepositInBD(user.id, 'RUB', amount, new Date(), 'card_rub', '4276550046464601', 1, 'payterra');
      await setUserBonusAmount(user.id, amount);

      const bet = await makeSuccessfulOrdinaryBet(user, 'RUB', amount, coeff);
      expect(bet.status).toBe(2);
      expect(bet.profit).toBe(amount * coeff);
      expect(bet.promo_amount).toBe(0);

      const newBonusAmount = await getUserBonusAmount(user.id);
      expect(newBonusAmount).toBe(amount.toString());
    });
    it('C1789799 (-) first deposit = EUR, bet = USD', async () => {
      const { data: user } = await register.oneClickRegEUR();
      // console.log(user.id);
      await banking.createDepositInBD(user.id, 'EUR', amount, new Date(), 'card', '4276550046464601', 1, 'payterra');
      await banking.createDepositInBD(user.id, 'USD', amount, new Date(), 'card', '4276550046464601', 1, 'payterra');
      await setUserBonusAmount(user.id, amount);

      const bet = await makeSuccessfulOrdinaryBet(user, 'USD', amount, coeff);
      expect(bet.status).toBe(2);
      expect(bet.profit).toBe(amount * coeff);
      expect(bet.promo_amount).toBe(0);

      const newBonusAmount = await getUserBonusAmount(user.id);
      expect(newBonusAmount).toBe(amount.toString());
    });
  });
});
