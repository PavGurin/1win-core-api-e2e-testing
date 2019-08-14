import { expect } from 'chai';
import { getMatchHistory, getSingleMatch } from '../../src/methods/matchStorage';
import { generateOrdinaryCoupon, getMaxBetAmountOld, makeOrdinaryBetOld } from '../../src/methods/better';
import { userList } from '../../src/methods/userList';

const currency = 'RUB';
const PREMATCH = 'prematch';
const ORDINARY = 'ordinary';
const LIVE = 'live';

beforeEach(async () => {
  await userList.loginWithRealMoney();
});

describe.skip('Old bets requests', () => {
  it('C27558 (+) liveOld', async () => {
    const [singleMatch] = await getSingleMatch(LIVE);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);

    const betResponse = await makeOrdinaryBetOld(coupon, currency, 1);
    // console.log(betResponse);

    expect(betResponse.data[coupon.couponId].error).equal(false);
    expect(betResponse.status).equal(200);
  });

  it('C27607 (+) default bet amount 1.99 (should be round to 1', async () => {
    const [singleMatch] = await getSingleMatch(PREMATCH);
    // console.log(singleMatch);

    const coupon = await generateOrdinaryCoupon(singleMatch, currency, 1);
    // console.log(coupon);

    const betResponse = await makeOrdinaryBetOld(coupon, currency, 1.99);
    // console.log(betResponse);
    const { data: betsMap } = await getMatchHistory(ORDINARY, 1);
    // console.log(betsMap);
    expect(Object.values(betsMap.betsMap)[0].amount).equal(1);
    expect(betResponse.status).equal(200);
  });

  it('C27559 (-) Ordinary bet OLD changed coefficient', async () => {
    const [singleMatch] = await getSingleMatch(PREMATCH);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);
    coupon.coefficient = 10;

    const betResponse = await makeOrdinaryBetOld(coupon, currency, 1);
    // console.log(betResponse);

    expect(betResponse.status).equal(200);
    expect(betResponse[coupon.couponId].error.errorMessage).equal('Odds higher than market in Line Service');
    expect(betResponse[coupon.couponId].status).equal(400);
  });

  it('C27560 (+) MaxBetAmount OLD', async () => {
    const betAmount = 1;

    const [singleMatch] = await getSingleMatch(PREMATCH);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);

    const data = await getMaxBetAmountOld(coupon, singleMatch);
    // console.log(data.maxBetAmount);

    await makeOrdinaryBetOld(coupon, currency, betAmount);

    const data2 = await getMaxBetAmountOld(coupon, singleMatch);
    // console.log(data2.maxBetAmount);

    expect(data2.maxBetAmount).equal(data.maxBetAmount - betAmount);
  });
});
