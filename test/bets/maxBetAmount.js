import { getSingleMatch } from '../../src/methods/matchStorage';
import { generateOrdinaryCoupon, getMaxBetAmount, makeOrdinaryBet } from '../../src/methods/better';
import { userList } from '../../src/methods/userList';
import { register } from '../../src/methods/register';
import { banking } from '../../src/methods/banking';

const PREMATCH = 'prematch';

beforeEach(async () => {
  // await userList.loginWithRealMoney();
  const { data: user } = await register.oneClickReg();
  await banking.setBalance(user.id);
});


describe('maxBetAmount', () => {
  it('C27561 (+) MaxBetAmount', async () => {
    const betAmount = 10;

    const singleMatch = await getSingleMatch(PREMATCH);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);

    const { data: { maxBetAmount: maxBetAmount1 } } = await getMaxBetAmount(coupon, singleMatch);
    // console.log(maxBetAmount1);

    await makeOrdinaryBet(coupon, betAmount);

    const { data: { maxBetAmount: maxBetAmount2 } } = await getMaxBetAmount(coupon, singleMatch);
    // console.log(maxBetAmount2);

    expect(maxBetAmount2.RUB).toEqual(maxBetAmount1.RUB - betAmount);
  });
});
