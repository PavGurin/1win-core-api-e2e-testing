import { register } from '../../src/methods/register';
import { banking } from '../../src/methods/banking';
import { getUserBonusAmount, setUserBonusAmount } from '../../src/methods/user';
import { makeSuccessfulOrdinaryBet } from '../../src/methods/betsInBD';

describe('Bonus amount spending depending on bet coefficient', () => {
  const amount = 300;
  it('C1789788 (-) coeff < 3.0', async () => {
    const coeff = 2.99;

    const { data: user } = await register.oneClickRegUSD();
    // console.log(user.id);
    await banking.createDepositInBD(user.id, 'USD', amount, new Date(), 'card', '4276550046464601', 1, 'payterra');
    await setUserBonusAmount(user.id, amount);

    const bet = await makeSuccessfulOrdinaryBet(user, 'USD', amount, coeff);
    expect(bet.status).toBe(2);
    expect(bet.profit.toString()).toBe((amount * coeff).toFixed(0));
    expect(bet.promo_amount).toBe(0);

    const newBonusAmount = await getUserBonusAmount(user.id);
    expect(newBonusAmount).toBe(amount.toString());
  });

  it('C1789789 (+) coeff = 3.0', async () => {
    const coeff = 3.00;

    const { data: user } = await register.oneClickReg();
    // console.log(user.id);
    await banking.createDepositInBD(user.id, 'RUB', amount, new Date(), 'card_rub', '4276550046464601', 1, 'payterra');
    await setUserBonusAmount(user.id, amount);

    const bet = await await makeSuccessfulOrdinaryBet(user, 'RUB', amount, coeff);
    expect(bet.status).toBe(2);
    expect(bet.profit).toBe(amount * coeff);
    expect(bet.promo_amount).toBe(amount * 0.05);

    const newBonusAmount = await getUserBonusAmount(user.id);
    expect(newBonusAmount).toBe((amount * 0.95).toString());
  });

  it('C1789790 (+) coeff > 3.0', async () => {
    const coeff = 3.01;

    const { data: user } = await register.oneClickRegEUR();
    // console.log(user.id);
    await banking.createDepositInBD(user.id, 'EUR', amount, new Date(), 'card', '4276550046464601', 1, 'payterra');
    await setUserBonusAmount(user.id, amount);

    const bet = await makeSuccessfulOrdinaryBet(user, 'EUR', amount, coeff);
    expect(bet.status).toBe(2);
    expect(bet.profit.toString()).toBe((amount * coeff).toFixed(0));
    expect(bet.promo_amount).toBe(amount * 0.05);

    const newBonusAmount = await getUserBonusAmount(user.id);
    expect(newBonusAmount).toBe((amount * 0.95).toString());
  });
});
