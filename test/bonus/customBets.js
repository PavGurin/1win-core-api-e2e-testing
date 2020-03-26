import { register } from '../../src/methods/register';
import { banking } from '../../src/methods/banking';
import { getUserBonusAmount, setUserBonusAmount } from '../../src/methods/user';
import { betsCustom } from '../../src/methods/betsCustom';

describe('Bonus amount for custom bets', () => {
  const AMOUNT_RUB = 1000;
  const AMOUNT_USD = 100;
  const AMOUNT_EUR = 100;
  const AMOUNT_UAH = 500;

  describe('Coeff > 3', () => {
    const COEFF = 10.01;

    it('RUB', async () => {
      const { data: user } = await register.oneClickReg();
      // console.log(user);
      await banking.createDepositInBD(user.id, 'RUB', AMOUNT_RUB, new Date(), 'card_rub', '4276550046464601', 1, 'payterra');
      await setUserBonusAmount(user.id, AMOUNT_RUB);
      await banking.setBalance(user.id, AMOUNT_RUB);

      await betsCustom.successfulOrdinaryBet(AMOUNT_RUB, COEFF);

      const newBonusAmount = await getUserBonusAmount(user.id);
      // console.log(newBonusAmount);
      expect(newBonusAmount).toBe((AMOUNT_RUB * 0.95).toString());
    });

    it('USD', async () => {
      const { data: user } = await register.oneClickRegUSD();
      // console.log(user);
      await banking.createDepositInBD(user.id, 'USD',
        AMOUNT_USD, new Date(), 'card', '4276550046464601', 1, 'payterra');
      await setUserBonusAmount(user.id, AMOUNT_USD);
      await banking.setBalance(user.id, AMOUNT_USD);

      await betsCustom.successfulOrdinaryBet(AMOUNT_USD, COEFF);

      const newBonusAmount = await getUserBonusAmount(user.id);
      // console.log(newBonusAmount);
      expect(newBonusAmount).toBe((AMOUNT_USD * 0.95).toString());
    });

    it('EUR', async () => {
      const { data: user } = await register.oneClickRegEUR();
      // console.log(user);
      await banking.createDepositInBD(user.id, 'EUR', AMOUNT_EUR, new Date(), 'card', '4276550046464601', 1, 'payterra');
      await setUserBonusAmount(user.id, AMOUNT_EUR);
      await banking.setBalance(user.id, AMOUNT_EUR);

      await betsCustom.successfulOrdinaryBet(AMOUNT_EUR, COEFF);

      const newBonusAmount = await getUserBonusAmount(user.id);
      // console.log(newBonusAmount);
      expect(newBonusAmount).toBe((AMOUNT_EUR * 0.95).toString());
    });

    it('UAH', async () => {
      const { data: user } = await register.oneClickRegUahWithPromocode('custombets');
      // console.log(user);
      await banking.createDepositInBD(user.id, 'UAH', AMOUNT_UAH, new Date(), 'card_uah', '4276550046464601', 1, 'payterra');
      await setUserBonusAmount(user.id, AMOUNT_UAH);
      await banking.setBalance(user.id, AMOUNT_UAH);

      await betsCustom.successfulOrdinaryBet(AMOUNT_UAH, COEFF);

      const newBonusAmount = await getUserBonusAmount(user.id);
      // console.log(newBonusAmount);
      expect(newBonusAmount).toBe((AMOUNT_UAH * 0.95).toString());
    });
  });
  describe('Coeff = 3', () => {
    const COEFF = 3.00;

    it('RUB', async () => {
      const { data: user } = await register.oneClickReg();
      // console.log(user);
      await banking.createDepositInBD(user.id, 'RUB', AMOUNT_RUB, new Date(), 'card_rub', '4276550046464601', 1, 'payterra');
      await setUserBonusAmount(user.id, AMOUNT_RUB);
      await banking.setBalance(user.id, AMOUNT_RUB);

      await betsCustom.successfulOrdinaryBet(AMOUNT_RUB, COEFF);

      const newBonusAmount = await getUserBonusAmount(user.id);
      // console.log(newBonusAmount);
      expect(newBonusAmount).toBe((AMOUNT_RUB * 0.95).toString());
    });

    it('USD', async () => {
      const { data: user } = await register.oneClickRegUSD();
      // console.log(user);
      await banking.createDepositInBD(user.id, 'USD',
        AMOUNT_USD, new Date(), 'card', '4276550046464601', 1, 'payterra');
      await setUserBonusAmount(user.id, AMOUNT_USD);
      await banking.setBalance(user.id, AMOUNT_USD);

      await betsCustom.successfulOrdinaryBet(AMOUNT_USD, COEFF);

      const newBonusAmount = await getUserBonusAmount(user.id);
      // console.log(newBonusAmount);
      expect(newBonusAmount).toBe((AMOUNT_USD * 0.95).toString());
    });

    it('EUR', async () => {
      const { data: user } = await register.oneClickRegEUR();
      // console.log(user);
      await banking.createDepositInBD(user.id, 'EUR', AMOUNT_EUR, new Date(), 'card', '4276550046464601', 1, 'payterra');
      await setUserBonusAmount(user.id, AMOUNT_EUR);
      await banking.setBalance(user.id, AMOUNT_EUR);

      await betsCustom.successfulOrdinaryBet(AMOUNT_EUR, COEFF);

      const newBonusAmount = await getUserBonusAmount(user.id);
      // console.log(newBonusAmount);
      expect(newBonusAmount).toBe((AMOUNT_EUR * 0.95).toString());
    });

    it('UAH', async () => {
      const { data: user } = await register.oneClickRegUahWithPromocode('custombets');
      // console.log(user);
      await banking.createDepositInBD(user.id, 'UAH', AMOUNT_UAH, new Date(), 'card_uah', '4276550046464601', 1, 'payterra');
      await setUserBonusAmount(user.id, AMOUNT_UAH);
      await banking.setBalance(user.id, AMOUNT_UAH);

      await betsCustom.successfulOrdinaryBet(AMOUNT_UAH, COEFF);

      const newBonusAmount = await getUserBonusAmount(user.id);
      // console.log(newBonusAmount);
      expect(newBonusAmount).toBe((AMOUNT_UAH * 0.95).toString());
    });
  });
  describe('Coeff < 3', () => {
    const COEFF = 2.99;

    it('RUB', async () => {
      const { data: user } = await register.oneClickReg();
      // console.log(user);
      await banking.createDepositInBD(user.id, 'RUB', AMOUNT_RUB, new Date(), 'card_rub', '4276550046464601', 1, 'payterra');
      await setUserBonusAmount(user.id, AMOUNT_RUB);
      await banking.setBalance(user.id, AMOUNT_RUB);

      await betsCustom.successfulOrdinaryBet(AMOUNT_RUB, COEFF);

      const newBonusAmount = await getUserBonusAmount(user.id);
      // console.log(newBonusAmount);
      expect(newBonusAmount).toBe(AMOUNT_RUB.toString());
    });

    it('USD', async () => {
      const { data: user } = await register.oneClickRegUSD();
      // console.log(user);
      await banking.createDepositInBD(user.id, 'USD',
        AMOUNT_USD, new Date(), 'card', '4276550046464601', 1, 'payterra');
      await setUserBonusAmount(user.id, AMOUNT_USD);
      await banking.setBalance(user.id, AMOUNT_USD);

      await betsCustom.successfulOrdinaryBet(AMOUNT_USD, COEFF);

      const newBonusAmount = await getUserBonusAmount(user.id);
      // console.log(newBonusAmount);
      expect(newBonusAmount).toBe(AMOUNT_USD.toString());
    });

    it('EUR', async () => {
      const { data: user } = await register.oneClickRegEUR();
      // console.log(user);
      await banking.createDepositInBD(user.id, 'EUR', AMOUNT_EUR, new Date(), 'card', '4276550046464601', 1, 'payterra');
      await setUserBonusAmount(user.id, AMOUNT_EUR);
      await banking.setBalance(user.id, AMOUNT_EUR);

      await betsCustom.successfulOrdinaryBet(AMOUNT_EUR, COEFF);

      const newBonusAmount = await getUserBonusAmount(user.id);
      // console.log(newBonusAmount);
      expect(newBonusAmount).toBe(AMOUNT_EUR.toString());
    });

    it('UAH', async () => {
      const { data: user } = await register.oneClickRegUahWithPromocode('custombets');
      // console.log(user);
      await banking.createDepositInBD(user.id, 'UAH', AMOUNT_UAH, new Date(), 'card_uah', '4276550046464601', 1, 'payterra');
      await setUserBonusAmount(user.id, AMOUNT_UAH);
      await banking.setBalance(user.id, AMOUNT_UAH);

      await betsCustom.successfulOrdinaryBet(AMOUNT_UAH, COEFF);

      const newBonusAmount = await getUserBonusAmount(user.id);
      // console.log(newBonusAmount);
      expect(newBonusAmount).toBe(AMOUNT_UAH.toString());
    });
  });
});
