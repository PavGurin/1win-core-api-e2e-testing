import { register } from '../../src/methods/register';
import { banking } from '../../src/methods/banking';
import { getUserBonusAmount, setUserBonusAmount } from '../../src/methods/user';
import { makeSuccessfulExpressBet } from '../../src/methods/betsInBD';

describe('Bonus amount spending depending on bet coefficient', () => {
  const amount = 300;
  it('C1868684 (-) coeff < 3.0', async () => {
    const coeff = 2.99;

    const { data: user } = await register.oneClickRegUSD();
    // console.log(user.id);
    await banking.createDepositInBD(user.id, 'USD', amount, new Date(), 'card', '4276550046464601', 1, 'payterra');
    await setUserBonusAmount(user.id, amount);

    const bet = await makeSuccessfulExpressBet(user, 'USD', amount, coeff);
    expect(bet.status).toBe(2);
    expect(bet.promo_amount).toBe(0);

    const newBonusAmount = await getUserBonusAmount(user.id);
    expect(newBonusAmount).toBe(amount.toString());
  });

  it('C1868685 (-) coeff = 3.0', async () => {
    const coeff = 3.00;

    const { data: user } = await register.oneClickReg();
    // console.log(user.id);
    await banking.createDepositInBD(user.id, 'RUB', amount, new Date(), 'card_rub', '4276550046464601', 1, 'payterra');
    await setUserBonusAmount(user.id, amount);

    const bet = await await makeSuccessfulExpressBet(user, 'RUB', amount, coeff);
    expect(bet.status).toBe(2);
    expect(bet.promo_amount).toBe(0);

    const newBonusAmount = await getUserBonusAmount(user.id);
    expect(newBonusAmount).toBe(amount.toString());
  });

  it('C1868686 (-) coeff > 3.0', async () => {
    const coeff = 3.01;

    const { data: user } = await register.oneClickRegEUR();
    // console.log(user.id);
    await banking.createDepositInBD(user.id, 'EUR', amount, new Date(), 'card', '4276550046464601', 1, 'payterra');
    await setUserBonusAmount(user.id, amount);

    const bet = await makeSuccessfulExpressBet(user, 'EUR', amount, coeff);
    expect(bet.status).toBe(2);
    expect(bet.promo_amount).toBe(0);

    const newBonusAmount = await getUserBonusAmount(user.id);
    expect(newBonusAmount).toBe(amount.toString());
  });
});
