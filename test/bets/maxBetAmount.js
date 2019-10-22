import { expect } from 'chai';
import { getSingleMatch } from '../../src/methods/matchStorage';
import { generateOrdinaryCoupon, getMaxBetAmount, makeOrdinaryBet } from '../../src/methods/better';
import { userList } from '../../src/methods/userList';

const PREMATCH = 'prematch';

beforeEach(async () => {
  await userList.loginWithRealMoney(socket);
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
    // test
    expect(Object.values(maxBetAmount2)[0]).equal((Object.values(maxBetAmount1)[0] - betAmount));
  });
});
