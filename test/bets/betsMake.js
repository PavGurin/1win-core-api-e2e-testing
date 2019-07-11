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
  it('(+) default bet', async () => {
    const [singleMatch] = await getSingleMatch(PREMATCH);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch, currency, 1);
    // console.log(coupon);

    const betResponse = await makeOrdinaryBet(coupon, currency, 1);
    // console.log(betResponse);

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

  it('(bug) changed coefficient', async () => {
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

  it('(-) changed typeID', async () => {
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

  it('(-) changed outCome', async () => {
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

  it('(-) changed specialValue', async () => {
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
  it('(+) default bet', async () => {
    const [singleMatch] = await getSingleMatch(LIVE);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);

    const betResponse = await makeOrdinaryBet(coupon, currency, 1);
    // console.log(betResponse);

    expect(betResponse.data[coupon.couponId].error).equal(false);
    expect(betResponse.status).equal(200);
  });

  it('(-) changed matchId', async () => {
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

  it('(-) changed service', async () => {
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

  it('(bug) changed coefficient', async () => {
    const [singleMatch] = await getSingleMatch(LIVE);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);
    coupon.saveCoefficient = 2;
    const betResponse = await makeOrdinaryBet(coupon, currency, 1);
    // console.log(betResponse);

    expect(betResponse.status).equal(200);
    // expect(betResponse.data[coupon.couponId].error).to.not.equal(false);
    expect(betResponse.data[coupon.couponId].error.errorMessage).equal('Odds higher than market in Line Service');
  });

  it('(-) changed typeID', async () => {
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

  it('(-) changed outCome', async () => {
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

  it('(-) changed specialValue', async () => {
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

  it('Ordinary bet OLD changed coefficient', async () => {
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

  it('MaxBetAmount OLD', async () => {
    const betAmount = 1;

    const [singleMatch] = await getSingleMatch(PREMATCH);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    console.log(coupon);

    const data = await getMaxBetAmountOld(coupon, singleMatch);
    console.log(data.maxBetAmount);


    const bet = await makeOrdinaryBet(coupon, currency, betAmount);
    console.log(bet);

    const data2 = await getMaxBetAmountOld(coupon, singleMatch);
    console.log(data2.maxBetAmount);

    expect(data2.maxBetAmount).to.not.equal(data.maxBetAmount).equal(data.maxBetAmount - betAmount);
  });
});


describe('maxBetAmount', () => {
  //+
  it('MaxBetAmount', async () => {
    const betAmount = 1;

    const [singleMatch] = await getSingleMatch(PREMATCH);
    // console.log(singleMatch);

    let coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);

    const { data: { maxBetAmount: maxBetAmount1 } } = await getMaxBetAmount(coupon, singleMatch);
    // console.log(maxBetAmount1);

    const bet = await makeOrdinaryBet(coupon, currency, betAmount);
    // console.log(bet);

    coupon = generateOrdinaryCoupon(singleMatch);

    const { data: { maxBetAmount: maxBetAmount2 } } = await getMaxBetAmount(coupon, singleMatch);
    // console.log(maxBetAmount2);

    expect(maxBetAmount2).to.not.equal(maxBetAmount1).equal(maxBetAmount1 - betAmount);
  });
});

describe('Express', () => {
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
    expect(betResponse.data[Object.keys(coupon.betsMap)[0]].error).equal(false);
    expect(betResponse.status).equal(200);
  });
});
