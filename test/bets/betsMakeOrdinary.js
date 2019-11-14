import { userList } from '../../src/methods/userList';
import {
  generateOrdinaryCoupon,
  makeOrdinaryBet,
} from '../../src/methods/better';

import {
  getInactiveSingleMatch,
  getMatchHistory, getSingleMatch,
} from '../../src/methods/matchStorage';

const PREMATCH = 'prematch';
const LIVE = 'live';
const ORDINARY = 'ordinary';

beforeEach(async () => {
  await userList.loginWithRealMoney(socket);
});

describe('Ordinary bets prematch', () => {
  it('C27551 (+) default bet', async () => {
    const singleMatch = await getSingleMatch(PREMATCH);
    // console.log(singleMatch);

    const coupon = await generateOrdinaryCoupon(singleMatch, 1);
    // console.log(coupon);

    const betResponse = await makeOrdinaryBet(socket, coupon, 10);
    // console.log(betResponse);

    expect(betResponse.data[coupon.couponId].error).toEqual(false);
    expect(betResponse.status).toEqual(200);
  });

  it('C27606 (+) default bet amount 10.99 (should be round to 10)', async () => {
    const betAmount = 10.99;
    const betType = ORDINARY;
    const limit = 1;
    const singleMatch = await getSingleMatch(PREMATCH);
    // console.log(singleMatch);

    const coupon = await generateOrdinaryCoupon(singleMatch, 1);
    // console.log(coupon);

    const betResponse = await makeOrdinaryBet(socket, coupon, betAmount);
    // console.log(betResponse);
    const { data: betsMap } = await getMatchHistory(socket, {
      limit,
      betType,
    });
    // console.log(betsMap);
    expect(Object.values(betsMap.betsMap)[0].amount).toEqual(Math.floor(betAmount));
    expect(Object.values(betsMap.betsMap)[0].betType).toEqual(betType);
    expect(Object.values(betsMap.betsMap).length).toEqual(limit);
    expect(betResponse.data[coupon.couponId].error).toEqual(false);
    expect(betResponse.status).toEqual(200);
  });

  it('C27552 (-) changed matchId', async () => {
    const singleMatch = await getSingleMatch(PREMATCH);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);
    coupon.matchId += 1;

    const betResponse = await makeOrdinaryBet(socket, coupon, 10);
    // console.log(betResponse);

    expect(betResponse.data[coupon.couponId].status).toEqual(400);
    expect(betResponse.data[coupon.couponId].error.errorMessage)
      .toEqual(`Match ${coupon.matchId} not found at service prematch`);
    expect(betResponse.status).toEqual(200);
  });

  it('C27553 (-) changed service', async () => {
    const singleMatch = await getSingleMatch(PREMATCH);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);
    coupon.service = LIVE;

    const betResponse = await makeOrdinaryBet(socket, coupon, 10);
    // console.log(betResponse);

    expect(betResponse.data[coupon.couponId].status).toEqual(400);
    expect(betResponse.data[coupon.couponId].error.errorMessage)
      .toEqual(`Match ${coupon.matchId} not found at service ${LIVE}`);
    expect(betResponse.status).toEqual(200);
  });

  it('C27554 changed coefficient', async () => {
    const singleMatch = await getSingleMatch(PREMATCH);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);
    coupon.coefficient += 0.2;
    // console.log(coupon);

    const betResponse = await makeOrdinaryBet(socket, coupon, 10);
    // console.log(betResponse);

    expect(betResponse.data[coupon.couponId].status).toEqual(400);
    expect(betResponse.data[coupon.couponId].error.errorMessage).toEqual('Odds higher than market in Line Service');
    expect(betResponse.status).toEqual(200);
  });

  it('C27555 (-) changed typeID', async () => {
    const singleMatch = await getSingleMatch(PREMATCH);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);
    coupon.typeId += 1;

    const betResponse = await makeOrdinaryBet(socket, coupon, 10);
    // console.log(betResponse);

    expect(betResponse.data[coupon.couponId].status).toEqual(400);
    expect(betResponse.data[coupon.couponId].error.errorMessage).toEqual('Requested odd not found');
    expect(betResponse.status).toEqual(200);
  });

  it('C27556 (-) changed outCome', async () => {
    const singleMatch = await getSingleMatch(PREMATCH);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);
    coupon.outCome += 1;

    const betResponse = await makeOrdinaryBet(socket, coupon, 10);
    // console.log(betResponse);

    expect(betResponse.data[coupon.couponId].status).toEqual(400);
    expect(betResponse.data[coupon.couponId].error.errorMessage).toEqual('Requested odd not found');
    expect(betResponse.status).toEqual(200);
  });

  it('C27557 (-) changed specialValue', async () => {
    const singleMatch = await getSingleMatch(PREMATCH);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);
    coupon.specialValue += 1;

    const betResponse = await makeOrdinaryBet(socket, coupon, 10);
    // console.log(betResponse);

    expect(betResponse.data[coupon.couponId].status).toEqual(400);
    expect(betResponse.data[coupon.couponId].error.errorMessage).toEqual('Requested odd not found');
    expect(betResponse.status).toEqual(200);
  });
});


describe('Ordinary bets live @master', () => {
  it.skip('C27564 (+) default bet', async () => {
    const singleMatch = await getSingleMatch(LIVE);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);

    const betResponse = await makeOrdinaryBet(socket, coupon, 10);
    // console.log(betResponse);

    expect(betResponse.data[coupon.couponId].error).toEqual(false);
    expect(betResponse.status).toEqual(200);
  });

  it('C659352 (-) blocked \'live\' bet', async () => {
    const singleMatch = await getInactiveSingleMatch(LIVE);
    // console.log(singleMatch);

    const coupon = await generateOrdinaryCoupon(singleMatch, 1);
    // console.log(coupon);

    const betResponse = await makeOrdinaryBet(socket, coupon, 10);
    // console.log(betResponse);

    expect(Object.values(betResponse.data)[1].error.errorMessage).toEqual('Betting on match is closed');
    expect(Object.values(betResponse.data)[0]).toEqual(200);
  });

  it('C27565 (-) changed matchId', async () => {
    const singleMatch = await getSingleMatch(LIVE);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);
    coupon.matchId += 1;

    const betResponse = await makeOrdinaryBet(socket, coupon, 10);
    // console.log(betResponse);

    expect(betResponse.data[coupon.couponId].status).toEqual(400);
    expect(betResponse.data[coupon.couponId].error.errorMessage)
      .toEqual(`Match ${coupon.matchId} not found at service live`);
    expect(betResponse.status).toEqual(200);
  });

  it('C27566 (-) changed service', async () => {
    const singleMatch = await getSingleMatch(LIVE);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);
    coupon.service = PREMATCH;

    const betResponse = await makeOrdinaryBet(socket, coupon, 10);
    // console.log(betResponse);

    expect(betResponse.data[coupon.couponId].status).toEqual(400);
    expect(betResponse.data[coupon.couponId].error.errorMessage)
      .toEqual(`Match ${coupon.matchId} not found at service ${PREMATCH}`);
    expect(betResponse.status).toEqual(200);
  });

  it('C27567 (-) changed coefficient', async () => {
    const singleMatch = await getSingleMatch(PREMATCH);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);
    coupon.coefficient = 999;

    const betResponse = await makeOrdinaryBet(socket, coupon, 10);
    // console.log(betResponse);

    expect(betResponse.status).toEqual(200);
    // expect(betResponse.data[coupon.couponId].error).to.not.equal(false);
    expect(betResponse.data[coupon.couponId].error.errorMessage).toEqual('Odds higher than market in Line Service');
  });

  it('C27568 (-) changed typeID', async () => {
    const singleMatch = await getSingleMatch(LIVE);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);
    coupon.typeId += 1;

    const betResponse = await makeOrdinaryBet(socket, coupon, 10);
    // console.log(betResponse);

    expect(betResponse.data[coupon.couponId].status).toEqual(400);
    expect(betResponse.data[coupon.couponId].error.errorMessage).toEqual('Requested odd not found');
    expect(betResponse.status).toEqual(200);
  });

  it('C27569 (-) changed outCome', async () => {
    const singleMatch = await getSingleMatch(LIVE);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);
    coupon.outCome += 1;

    const betResponse = await makeOrdinaryBet(socket, coupon, 10);
    // console.log(betResponse);

    expect(betResponse.data[coupon.couponId].status).toEqual(400);
    expect(betResponse.data[coupon.couponId].error.errorMessage).toEqual('Requested odd not found');
    expect(betResponse.status).toEqual(200);
  });

  it('C27570 (-) changed specialValue', async () => {
    const singleMatch = await getSingleMatch(LIVE);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);
    coupon.specialValue += 1;

    const betResponse = await makeOrdinaryBet(socket, coupon, 10);
    // console.log(betResponse);

    expect(betResponse.data[coupon.couponId].status).toEqual(400);
    expect(betResponse.data[coupon.couponId].error.errorMessage).toEqual('Requested odd not found');
    expect(betResponse.status).toEqual(200);
  });
});
