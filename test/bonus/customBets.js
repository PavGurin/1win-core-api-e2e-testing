import { register } from '../../src/methods/register';
import { banking } from '../../src/methods/banking';
import { getUserBonusAmount, setUserBonusAmount } from '../../src/methods/user';
import { betsCustom } from '../../src/methods/betsCustom';
import { betsCustomFixtures } from '../../src/methods/betsCustomFixtures';

describe('Bonus amount for custom bets', () => {
  const AMOUNT_RUB = 1000;
  const AMOUNT_USD = 100;
  const AMOUNT_EUR = 100;
  const AMOUNT_UAH = 500;

  let group;
  let event;
  let results;

  beforeAll(async () => {
    group = await betsCustomFixtures.addGroup();
    // console.log(group);
  });

  afterAll(async () => {
    await betsCustomFixtures.setGroupIsDisabled(group.id, 1);
  });

  describe('Coeff > 3', () => {
    const COEFF = 10.01;

    beforeEach(async () => {
      event = await betsCustomFixtures.addEvent(group.id);
      results = [await betsCustomFixtures.addResult(event.id,
        null, null, null, null, COEFF.toFixed(2)),
      await betsCustomFixtures.addResult(event.id)];
    });

    it('C2072151 (+) RUB', async () => {
      const { data: user } = await register.oneClickReg();
      // console.log(user);
      await banking.createDepositInBD(user.id, 'RUB', AMOUNT_RUB, new Date(), 'card_rub',
        '4276550046464601', 1, 'payterra');
      await setUserBonusAmount(user.id, AMOUNT_RUB);
      await banking.setBalance(user.id, AMOUNT_RUB);

      await betsCustom.successfulOrdinaryBet(event.id, results, AMOUNT_RUB);

      const newBonusAmount = await getUserBonusAmount(user.id);
      // console.log(newBonusAmount);
      expect(newBonusAmount).toBe((AMOUNT_RUB * 0.95).toString());
    });

    it('C2072152 (+) USD', async () => {
      const { data: user } = await register.oneClickRegUSD();
      // console.log(user);
      await banking.createDepositInBD(user.id, 'USD',
        AMOUNT_USD, new Date(), 'card', '4276550046464601', 1, 'payterra');
      await setUserBonusAmount(user.id, AMOUNT_USD);
      await banking.setBalance(user.id, AMOUNT_USD);

      await betsCustom.successfulOrdinaryBet(event.id, results, AMOUNT_USD);

      const newBonusAmount = await getUserBonusAmount(user.id);
      // console.log(newBonusAmount);
      expect(newBonusAmount).toBe((AMOUNT_USD * 0.95).toString());
    });

    it('C2072153 (+) EUR', async () => {
      const { data: user } = await register.oneClickRegEUR();
      // console.log(user);
      await banking.createDepositInBD(user.id, 'EUR', AMOUNT_EUR, new Date(), 'card', '4276550046464601', 1, 'payterra');
      await setUserBonusAmount(user.id, AMOUNT_EUR);
      await banking.setBalance(user.id, AMOUNT_EUR);

      await betsCustom.successfulOrdinaryBet(event.id, results, AMOUNT_EUR);

      const newBonusAmount = await getUserBonusAmount(user.id);
      // console.log(newBonusAmount);
      expect(newBonusAmount).toBe((AMOUNT_EUR * 0.95).toString());
    });

    it('C2072154 (+) UAH', async () => {
      const { data: user } = await register.oneClickRegUAH();
      // console.log(user);
      await banking.createDepositInBD(user.id, 'UAH', AMOUNT_UAH, new Date(), 'card_uah', '4276550046464601', 1, 'payterra');
      await setUserBonusAmount(user.id, AMOUNT_UAH);
      await banking.setBalance(user.id, AMOUNT_UAH);

      await betsCustom.successfulOrdinaryBet(event.id, results, AMOUNT_UAH);

      const newBonusAmount = await getUserBonusAmount(user.id);
      // console.log(newBonusAmount);
      expect(newBonusAmount).toBe((AMOUNT_UAH * 0.95).toString());
    });
  });
  describe('Coeff = 3', () => {
    const COEFF = 3.00;

    beforeEach(async () => {
      event = await betsCustomFixtures.addEvent(group.id);
      results = [await betsCustomFixtures.addResult(event.id,
        null, null, null, null, COEFF.toFixed(2)),
      await betsCustomFixtures.addResult(event.id)];
    });

    it('C2072155 (+) RUB', async () => {
      const { data: user } = await register.oneClickReg();
      // console.log(user);
      await banking.createDepositInBD(user.id, 'RUB', AMOUNT_RUB, new Date(), 'card_rub', '4276550046464601', 1, 'payterra');
      await setUserBonusAmount(user.id, AMOUNT_RUB);
      await banking.setBalance(user.id, AMOUNT_RUB);

      await betsCustom.successfulOrdinaryBet(event.id, results, AMOUNT_RUB);

      const newBonusAmount = await getUserBonusAmount(user.id);
      // console.log(newBonusAmount);
      expect(newBonusAmount).toBe((AMOUNT_RUB * 0.95).toString());
    });

    it('C2072156 (+) USD', async () => {
      const { data: user } = await register.oneClickRegUSD();
      // console.log(user);
      await banking.createDepositInBD(user.id, 'USD',
        AMOUNT_USD, new Date(), 'card', '4276550046464601', 1, 'payterra');
      await setUserBonusAmount(user.id, AMOUNT_USD);
      await banking.setBalance(user.id, AMOUNT_USD);

      await betsCustom.successfulOrdinaryBet(event.id, results, AMOUNT_USD);

      const newBonusAmount = await getUserBonusAmount(user.id);
      // console.log(newBonusAmount);
      expect(newBonusAmount).toBe((AMOUNT_USD * 0.95).toString());
    });

    it('C2072157 (+) EUR', async () => {
      const { data: user } = await register.oneClickRegEUR();
      // console.log(user);
      await banking.createDepositInBD(user.id, 'EUR', AMOUNT_EUR, new Date(), 'card', '4276550046464601', 1, 'payterra');
      await setUserBonusAmount(user.id, AMOUNT_EUR);
      await banking.setBalance(user.id, AMOUNT_EUR);

      await betsCustom.successfulOrdinaryBet(event.id, results, AMOUNT_EUR);

      const newBonusAmount = await getUserBonusAmount(user.id);
      // console.log(newBonusAmount);
      expect(newBonusAmount).toBe((AMOUNT_EUR * 0.95).toString());
    });

    it('C2072158 (+) UAH', async () => {
      const { data: user } = await register.oneClickRegUAH();
      // console.log(user);
      await banking.createDepositInBD(user.id, 'UAH', AMOUNT_UAH, new Date(), 'card_uah', '4276550046464601', 1, 'payterra');
      await setUserBonusAmount(user.id, AMOUNT_UAH);
      await banking.setBalance(user.id, AMOUNT_UAH);

      await betsCustom.successfulOrdinaryBet(event.id, results, AMOUNT_UAH);

      const newBonusAmount = await getUserBonusAmount(user.id);
      // console.log(newBonusAmount);
      expect(newBonusAmount).toBe((AMOUNT_UAH * 0.95).toString());
    });
  });
  describe('Coeff < 3', () => {
    const COEFF = 2.99;

    beforeEach(async () => {
      event = await betsCustomFixtures.addEvent(group.id);
      results = [await betsCustomFixtures.addResult(event.id,
        null, null, null, null, COEFF.toFixed(2)),
      await betsCustomFixtures.addResult(event.id)];
    });

    it('C2072159 (-) RUB', async () => {
      const { data: user } = await register.oneClickReg();
      // console.log(user);
      await banking.createDepositInBD(user.id, 'RUB', AMOUNT_RUB, new Date(), 'card_rub', '4276550046464601', 1, 'payterra');
      await setUserBonusAmount(user.id, AMOUNT_RUB);
      await banking.setBalance(user.id, AMOUNT_RUB);

      await betsCustom.successfulOrdinaryBet(event.id, results, AMOUNT_RUB);

      const newBonusAmount = await getUserBonusAmount(user.id);
      // console.log(newBonusAmount);
      expect(newBonusAmount).toBe(AMOUNT_RUB.toString());
    });

    it('C2072160 (-) USD', async () => {
      const { data: user } = await register.oneClickRegUSD();
      // console.log(user);
      await banking.createDepositInBD(user.id, 'USD',
        AMOUNT_USD, new Date(), 'card', '4276550046464601', 1, 'payterra');
      await setUserBonusAmount(user.id, AMOUNT_USD);
      await banking.setBalance(user.id, AMOUNT_USD);

      await betsCustom.successfulOrdinaryBet(event.id, results, AMOUNT_USD);

      const newBonusAmount = await getUserBonusAmount(user.id);
      // console.log(newBonusAmount);
      expect(newBonusAmount).toBe(AMOUNT_USD.toString());
    });

    it('C2072161 (-) EUR', async () => {
      const { data: user } = await register.oneClickRegEUR();
      // console.log(user);
      await banking.createDepositInBD(user.id, 'EUR', AMOUNT_EUR, new Date(), 'card', '4276550046464601', 1, 'payterra');
      await setUserBonusAmount(user.id, AMOUNT_EUR);
      await banking.setBalance(user.id, AMOUNT_EUR);

      await betsCustom.successfulOrdinaryBet(event.id, results, AMOUNT_EUR);

      const newBonusAmount = await getUserBonusAmount(user.id);
      // console.log(newBonusAmount);
      expect(newBonusAmount).toBe(AMOUNT_EUR.toString());
    });

    it('C2072162 (-) UAH', async () => {
      const { data: user } = await register.oneClickRegUAH();
      // console.log(user);
      await banking.createDepositInBD(user.id, 'UAH', AMOUNT_UAH, new Date(), 'card_uah', '4276550046464601', 1, 'payterra');
      await setUserBonusAmount(user.id, AMOUNT_UAH);
      await banking.setBalance(user.id, AMOUNT_UAH);

      await betsCustom.successfulOrdinaryBet(event.id, results, AMOUNT_UAH);

      const newBonusAmount = await getUserBonusAmount(user.id);
      // console.log(newBonusAmount);
      expect(newBonusAmount).toBe(AMOUNT_UAH.toString());
    });
  });
});
