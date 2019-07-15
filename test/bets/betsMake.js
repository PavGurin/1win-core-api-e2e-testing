import { expect } from 'chai';

import { userList } from '../../src/methods/userList';
import {
  generateExpressCoupon,
  generateOrdinaryCoupon,
  getMaxBetAmount,
  getMaxBetAmountOld,
  makeExpressBet,
  makeOrdinaryBet,
  makeOrdinaryBetOld,
} from '../../src/methods/better';

import { getSingleMatch, sportTournaments, tournamentMatches } from '../../src/methods/matchStorage';

const currency = 'RUB';
const PREMATCH = 'prematch';
const LIVE = 'live';

beforeEach(async () => {
  await userList.loginWithRealMoney();
});

describe('Ordinary bets prematch', () => {
  it('C27551 (+) default bet', async () => {
    const [singleMatch] = await getSingleMatch(PREMATCH);
    console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch, currency, 1);
    // console.log(coupon);

    const betResponse = await makeOrdinaryBet(coupon, currency, 1);
    console.log(betResponse);

    expect(betResponse.data[coupon.couponId].error).equal(false);
    expect(betResponse.status).equal(200);
  });

  it('C27552 (-) changed matchId', async () => {
    const [singleMatch] = await getSingleMatch(PREMATCH);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);
    coupon.matchId += 1;
    const betResponse = await makeOrdinaryBet(coupon, currency, 1);
    // console.log(betResponse);

    expect(betResponse.data[coupon.couponId].status).equal(400);
    expect(betResponse.data[coupon.couponId].error.errorMessage)
      .equal(`Match ${coupon.matchId} not found at service prematch`);
    expect(betResponse.status).equal(200);
  });

  it('C27553 (-) changed service', async () => {
    const [singleMatch] = await getSingleMatch(PREMATCH);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);
    coupon.service = LIVE;
    const betResponse = await makeOrdinaryBet(coupon, currency, 3);
    // console.log(betResponse);

    expect(betResponse.data[coupon.couponId].status).equal(400);
    expect(betResponse.data[coupon.couponId].error.errorMessage)
      .equal(`Match ${coupon.matchId} not found at service ${LIVE}`);
    expect(betResponse.status).equal(200);
  });

  it('C27554 (bug) changed coefficient', async () => {
    const [singleMatch] = await getSingleMatch(PREMATCH);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);
    coupon.saveCoefficient = 2;
    const betResponse = await makeOrdinaryBet(coupon, currency, 1);
    // console.log(betResponse);

    expect(betResponse.data[coupon.couponId].status).equal(400);
    expect(betResponse.data[coupon.couponId].error.errorMessage).equal('Odds higher than market in Line Service');
    expect(betResponse.status).equal(200);
  });

  it('C27555 (-) changed typeID', async () => {
    const [singleMatch] = await getSingleMatch(PREMATCH);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);
    coupon.typeId += 1;
    const betResponse = await makeOrdinaryBet(coupon, currency, 3);
    // console.log(betResponse);

    expect(betResponse.data[coupon.couponId].status).equal(400);
    expect(betResponse.data[coupon.couponId].error.errorMessage).equal('Requested odd not found');
    expect(betResponse.status).equal(200);
  });

  it('C27556 (-) changed outCome', async () => {
    const [singleMatch] = await getSingleMatch(PREMATCH);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);
    coupon.outCome += 1;
    const betResponse = await makeOrdinaryBet(coupon, currency, 3);
    // console.log(betResponse);

    expect(betResponse.data[coupon.couponId].status).equal(400);
    expect(betResponse.data[coupon.couponId].error.errorMessage).equal('Requested odd not found');
    expect(betResponse.status).equal(200);
  });

  it('C27557 (-) changed specialValue', async () => {
    const [singleMatch] = await getSingleMatch(PREMATCH);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);
    coupon.specialValue += 1;
    const betResponse = await makeOrdinaryBet(coupon, currency, 3);
    // console.log(betResponse);

    expect(betResponse.data[coupon.couponId].status).equal(400);
    expect(betResponse.data[coupon.couponId].error.errorMessage).equal('Requested odd not found');
    expect(betResponse.status).equal(200);
  });
});

describe('Ordinary bets live', () => {
  // TODO add to getSingleMatch status of returned match
  it('C27564 (+) default bet', async () => {
    const [singleMatch] = await getSingleMatch(LIVE);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);

    const betResponse = await makeOrdinaryBet(coupon, currency, 1);
    // console.log(betResponse);

    expect(betResponse.data[coupon.couponId].error).equal(false);
    expect(betResponse.status).equal(200);
  });

  it('C27565 (-) changed matchId', async () => {
    const [singleMatch] = await getSingleMatch(LIVE);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);
    coupon.matchId += 1;
    const betResponse = await makeOrdinaryBet(coupon, currency, 1);
    // console.log(betResponse);

    expect(betResponse.data[coupon.couponId].status).equal(400);
    expect(betResponse.data[coupon.couponId].error.errorMessage)
      .equal(`Match ${coupon.matchId} not found at service live`);
    expect(betResponse.status).equal(200);
  });

  it('C27566 (-) changed service', async () => {
    const [singleMatch] = await getSingleMatch(LIVE);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);
    coupon.service = PREMATCH;
    const betResponse = await makeOrdinaryBet(coupon, currency, 3);
    // console.log(betResponse);

    expect(betResponse.data[coupon.couponId].status).equal(400);
    expect(betResponse.data[coupon.couponId].error.errorMessage)
      .equal(`Match ${coupon.matchId} not found at service ${PREMATCH}`);
    expect(betResponse.status).equal(200);
  });

  it('C27567 (bug) changed coefficient', async () => {
    const [singleMatch] = await getSingleMatch(LIVE);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);
    coupon.saveCoefficient = 55;
    const betResponse = await makeOrdinaryBet(coupon, currency, 1);
    console.log(betResponse);

    expect(betResponse.status).equal(200);
    // expect(betResponse.data[coupon.couponId].error).to.not.equal(false);
    expect(betResponse.data[coupon.couponId].error.errorMessage).equal('Odds higher than market in Line Service');
  });

  it('C27568 (-) changed typeID', async () => {
    const [singleMatch] = await getSingleMatch(LIVE);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);
    coupon.typeId += 1;
    const betResponse = await makeOrdinaryBet(coupon, currency, 3);
    console.log(betResponse);

    expect(betResponse.data[coupon.couponId].status).equal(400);
    expect(betResponse.data[coupon.couponId].error.errorMessage).equal('Requested odd not found');
    expect(betResponse.status).equal(200);
  });

  it('C27569 (-) changed outCome', async () => {
    const [singleMatch] = await getSingleMatch(LIVE);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);
    coupon.outCome += 1;
    const betResponse = await makeOrdinaryBet(coupon, currency, 3);
    console.log(betResponse);

    expect(betResponse.data[coupon.couponId].status).equal(400);
    expect(betResponse.data[coupon.couponId].error.errorMessage).equal('Requested odd not found');
    expect(betResponse.status).equal(200);
  });

  it('C27570 (-) changed specialValue', async () => {
    const [singleMatch] = await getSingleMatch(LIVE);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);
    coupon.specialValue += 1;
    const betResponse = await makeOrdinaryBet(coupon, currency, 3);
    console.log(betResponse);

    expect(betResponse.data[coupon.couponId].status).equal(400);
    expect(betResponse.data[coupon.couponId].error.errorMessage).equal('Requested odd not found');
    expect(betResponse.status).equal(200);
  });
});

describe('Old bets requests', () => {
  it('C27558 (+) liveOld', async () => {
    const [singleMatch] = await getSingleMatch(LIVE);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);

    const betResponse = await makeOrdinaryBet(coupon, currency, 1);
    // console.log(betResponse);

    expect(betResponse.data[coupon.couponId].error).equal(false);
    expect(betResponse.status).equal(200);
  });

  it('C27559 (-) Ordinary bet OLD changed coefficient', async () => {
    const [singleMatch] = await getSingleMatch(PREMATCH);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);
    coupon.saveCoefficient = 10;
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

    const bet = await makeOrdinaryBetOld(coupon, currency, betAmount);
    // console.log(bet);

    const data2 = await getMaxBetAmountOld(coupon, singleMatch);
    // console.log(data2.maxBetAmount);

    expect(data2.maxBetAmount).equal(data.maxBetAmount - betAmount);
  });
});


describe('maxBetAmount', () => {
  it('C27561 (+) MaxBetAmount', async () => {
    const betAmount = 1;

    const [singleMatch] = await getSingleMatch(PREMATCH);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);

    const data = await getMaxBetAmount(coupon, singleMatch);
    console.log(data);

    const bet = await makeOrdinaryBet(coupon, currency, betAmount);
    // console.log(bet);
    // coupon = generateOrdinaryCoupon(singleMatch);

    const data2 = await getMaxBetAmount(coupon, singleMatch);
    console.log(data2);

    expect(data2.maxBetAmount).equal(data.maxBetAmount - betAmount);
  });
});

describe('Express', () => {
  it('C27562 Prematch - express bet', async () => {
    const { data: { sportTournamentMap } } = await sportTournaments(PREMATCH, 'all');
    // console.log(sportTournamentMap);

    const { data: { matchMap } } = await tournamentMatches(
      PREMATCH,
      Object.values(Object.values(sportTournamentMap)[0])[0].tournamentId,
    );

    const coupon = generateExpressCoupon(matchMap, 2, 1);

    const betResponse = await makeExpressBet(Object.values(coupon));
    // console.log(betResponse);
    expect(betResponse.data[Object.keys(coupon.betsMap)[0]].error).equal(false);
    expect(betResponse.status).equal(200);
  });

  it('C27563 Prematch - express bet 100', async () => {
    const { data: { sportTournamentMap } } = await sportTournaments(PREMATCH, 'all');
    // console.log(sportTournamentMap);

    const { data: { matchMap } } = await tournamentMatches(
      PREMATCH,
      Object.values(Object.values(sportTournamentMap)[0])[0].tournamentId,
    );

    const coupon = generateExpressCoupon(matchMap, 100, 1);

    const betResponse = await makeExpressBet(Object.values(coupon));
    // console.log(betResponse);
    expect(betResponse.data[Object.keys(coupon.betsMap)[0]].error).equal(false);
    expect(betResponse.status).equal(200);
  });
});
