import { expect } from 'chai';

import { userList } from '../../src/methods/userList';
import {
  generateExpressCoupon,
  generateOrdinaryCoupon,
  makeExpressBet,
  makeOrdinaryBet,
} from '../../src/methods/better';

import {
  getMatchHistory, getSingleMatch, sportTournaments, tournamentMatches,
} from '../../src/methods/matchStorage';

const PREMATCH = 'prematch';
const LIVE = 'live';
const ORDINARY = 'ordinary';

beforeEach(async () => {
  await userList.loginWithRealMoney(socket);
});

describe('Ordinary bets prematch', () => {
  it('C27551 (+) default bet', async () => {
    const [singleMatch] = await getSingleMatch(PREMATCH);
    // console.log(singleMatch);

    const coupon = await generateOrdinaryCoupon(singleMatch, 1);
    // console.log(coupon);

    const betResponse = await makeOrdinaryBet(coupon, 10);
    // console.log(betResponse);

    expect(betResponse.data[coupon.couponId].error).equal(false);
    expect(betResponse.status).equal(200);
  });

  it('C27606 (+) default bet amount 10.99 (should be round to 10)', async () => {
    const betAmount = 10.99;
    const betType = ORDINARY;
    const limit = 1;
    const [singleMatch] = await getSingleMatch(PREMATCH);
    // console.log(singleMatch);

    const coupon = await generateOrdinaryCoupon(singleMatch, 1);
    // console.log(coupon);

    const betResponse = await makeOrdinaryBet(coupon, betAmount);
    // console.log(betResponse);
    const { data: betsMap } = await getMatchHistory(socket, { limit, betType });
    // console.log(betsMap);
    expect(Object.values(betsMap.betsMap)[0].amount).equal(Math.floor(betAmount));
    expect(Object.values(betsMap.betsMap)[0].betType).equal(betType);
    expect(Object.values(betsMap.betsMap).length).equal(limit);
    expect(betResponse.data[coupon.couponId].error).equal(false);
    expect(betResponse.status).equal(200);
  });

  it('C27552 (-) changed matchId', async () => {
    const [singleMatch] = await getSingleMatch(PREMATCH);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);
    coupon.matchId += 1;

    const betResponse = await makeOrdinaryBet(coupon, 10);
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

    const betResponse = await makeOrdinaryBet(coupon, 10);
    // console.log(betResponse);

    expect(betResponse.data[coupon.couponId].status).equal(400);
    expect(betResponse.data[coupon.couponId].error.errorMessage)
      .equal(`Match ${coupon.matchId} not found at service ${LIVE}`);
    expect(betResponse.status).equal(200);
  });

  it('C27554 changed coefficient', async () => {
    const [singleMatch] = await getSingleMatch(PREMATCH);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);
    coupon.coefficient += 0.1;
    // console.log(coupon);

    const betResponse = await makeOrdinaryBet(coupon, 10);
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

    const betResponse = await makeOrdinaryBet(coupon, 10);
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

    const betResponse = await makeOrdinaryBet(coupon, 10);
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

    const betResponse = await makeOrdinaryBet(coupon, 10);
    // console.log(betResponse);

    expect(betResponse.data[coupon.couponId].status).equal(400);
    expect(betResponse.data[coupon.couponId].error.errorMessage).equal('Requested odd not found');
    expect(betResponse.status).equal(200);
  });

  it(' (-) changed specialValue', async () => {
    const [singleMatch] = await getSingleMatch(PREMATCH);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);
    coupon.specialValue += 1;

    const betResponse = await makeOrdinaryBet(coupon, 10);
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

    const betResponse = await makeOrdinaryBet(coupon, 1);
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

    const betResponse = await makeOrdinaryBet(coupon, 10);
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

    const betResponse = await makeOrdinaryBet(coupon, 10);
    // console.log(betResponse);

    expect(betResponse.data[coupon.couponId].status).equal(400);
    expect(betResponse.data[coupon.couponId].error.errorMessage)
      .equal(`Match ${coupon.matchId} not found at service ${PREMATCH}`);
    expect(betResponse.status).equal(200);
  });

  it('C27567 (-) changed coefficient', async () => {
    const [singleMatch] = await getSingleMatch(PREMATCH);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);
    coupon.coefficient = 999;

    const betResponse = await makeOrdinaryBet(coupon, 10);
    // console.log(betResponse);

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

    const betResponse = await makeOrdinaryBet(coupon, 10);
    // console.log(betResponse);

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

    const betResponse = await makeOrdinaryBet(coupon, 10);
    // console.log(betResponse);

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

    const betResponse = await makeOrdinaryBet(coupon, 10);
    // console.log(betResponse);

    expect(betResponse.data[coupon.couponId].status).equal(400);
    expect(betResponse.data[coupon.couponId].error.errorMessage).equal('Requested odd not found');
    expect(betResponse.status).equal(200);
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
    // console.log(matchMap);

    const coupon = generateExpressCoupon(matchMap, 2, 10);
    // console.log(coupon);

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

    const coupon = generateExpressCoupon(matchMap, 100, 10);

    const betResponse = await makeExpressBet(Object.values(coupon));
    // console.log(betResponse);

    expect(betResponse.data[Object.keys(coupon.betsMap)[0]].error).equal(false);
    expect(betResponse.status).equal(200);
  });
});
