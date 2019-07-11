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

describe('Bets make', () => {
  // TODO после обновить старые тесты с маркером dev


  /**
   get available matches
   service 'live/prematch'
   sportId => (football = 1)

   sport-all
   sport-categories
   sport-tournaments

   tournaments-hot**
   tournament-matches**
   */
});

describe('Ordinary bets', () => {
  it('(+) prematch', async () => {
    const [singleMatch] = await getSingleMatch(PREMATCH);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);

    const betResponse = await makeOrdinaryBet(coupon, currency, 1);
    console.log(betResponse);

    expect(betResponse.data[coupon.couponId].error).equal(false);
    expect(betResponse.status).equal(200);
  });

  it('(-) changed matchId', async () => {
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

  it('(-) changed service', async () => {
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

  it('(-) 1changed service', async () => {
    const [singleMatch] = await getSingleMatch(PREMATCH);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);
    coupon.service = LIVE;
    const betResponse = await makeOrdinaryBet(coupon, currency, 3);
    console.log(betResponse);

    expect(betResponse.data[coupon.couponId].status).equal(400);
    expect(betResponse.data[coupon.couponId].error.errorMessage)
      .equal(`Match ${coupon.matchId} not found at service ${LIVE}`);
    expect(betResponse.status).equal(200);
  });

  // TODO add to getSingleMatch status of returned match
  it('(+) live', async () => {
    const [singleMatch] = await getSingleMatch(LIVE);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);

    const betResponse = await makeOrdinaryBet(coupon, currency, 1);
    // console.log(betResponse);

    expect(betResponse.data[coupon.couponId].error).equal(false);
    expect(betResponse.status).equal(200);
  });

  it('(+) liveOld', async () => {
    const [singleMatch] = await getSingleMatch(LIVE);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);

    const betResponse = await makeOrdinaryBet(coupon, currency, 1);
    // console.log(betResponse);

    expect(betResponse.data[coupon.couponId].error).equal(false);
    expect(betResponse.status).equal(200);
  });

  it('changed coefficient', async () => {
    const [singleMatch] = getSingleMatch(PREMATCH);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);
    coupon.saveCoefficient = 999;
    const betResponse = await makeOrdinaryBet(coupon, currency, 1);
    // console.log(betResponse);

    expect(betResponse.status).equal(200);
    expect(betResponse.data[coupon.couponId].error.errorMessage).equal('Odds higher than market in Line Service');
    expect(betResponse.data[coupon.couponId].status).equal(400);
  });

  it('Ordinary bet OLD changed coefficient', async () => {
    const [singleMatch] = getSingleMatch(PREMATCH);
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
});

describe('Or1dinary bets', () => {
  //+
  it('MaxBetAmount', async () => {
    const [singleMatch] = await getSingleMatch(PREMATCH);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);

    const data = await getMaxBetAmount(coupon, singleMatch);

    // console.log(data);
  });

  it('MaxBetAmount OLD', async () => {
    const [singleMatch] = await getSingleMatch(PREMATCH);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);

    const data = await getMaxBetAmountOld(coupon, singleMatch);

    // console.log(data);
  });

  it('Prematch - express bet', async () => {
    const { data: { sportTournamentMap } } = await sportTournaments(PREMATCH, 'all');
    // console.log(sportTournamentMap);

    const { data: { matchMap } } = await tournamentMatches(
      PREMATCH,
      Object.values(Object.values(sportTournamentMap)[0])[0].tournamentId,
    );

    const coupon = generateExpressCoupon(matchMap, 2, 1);

    const betResponse = await makeExpressBet(Object.values(coupon));
    // console.log(betResponse);
    expect(Object.values(betResponse.data)[1].error).equal(false);
    expect(betResponse.status).equal(200);
  });
});
