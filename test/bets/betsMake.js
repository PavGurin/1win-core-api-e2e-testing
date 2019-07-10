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

import { sportTournaments, tournamentMatches } from '../../src/methods/matchStorage';

describe('Bets make', () => {
  // TODO после обновить старые тесты с маркером dev

  const currency = 'RUB';
  const PREMATCH = 'prematch';
  const LIVE = 'live';

  beforeEach(async () => {
    await userList.loginWithRealMoney();
  });


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


  //+
  it('Ordinary bet', async () => {
    const { data: { sportTournamentMap } } = await sportTournaments(PREMATCH, 'all');
    // console.log(sportTournamentMap);

    const { data: { matchMap } } = await tournamentMatches(
      PREMATCH,
      Object.values(Object.values(sportTournamentMap)[0])[0].tournamentId,
    );
    // console.log(matchMap);

    const [singleMatch] = Object.values(matchMap);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);

    const betResponse = await makeOrdinaryBet(coupon, currency, 1);
    console.log(betResponse);

    // expect(betResponse.data[coupon.couponId].error).equal(false);
    expect(betResponse.status).equal(200);
  });

  it('Ordinary bet changed coefficient', async () => {
    const { data: { sportTournamentMap } } = await sportTournaments(PREMATCH, 'all');
    // console.log(sportTournamentMap);

    const { data: { matchMap } } = await tournamentMatches(
      PREMATCH,
      Object.values(Object.values(sportTournamentMap)[0])[0].tournamentId,
    );
    // console.log(matchMap);

    const [singleMatch] = Object.values(matchMap);
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);
    coupon.saveCoefficient = 10;
    const betResponse = await makeOrdinaryBet(coupon, currency, 1);
    console.log(betResponse);

    expect(betResponse.status).equal(200);
    expect(betResponse.data[coupon.couponId].error.errorMessage).equal('Odds higher than market in Line Service');
    expect(betResponse.data[coupon.couponId].status).equal(400);
  });

  it('Ordinary bet OLD changed coefficient', async () => {
    const { data: { sportTournamentMap } } = await sportTournaments(PREMATCH, 'all');
    // console.log(sportTournamentMap);

    const { data: { matchMap } } = await tournamentMatches(
      PREMATCH,
      Object.values(Object.values(sportTournamentMap)[0])[0].tournamentId,
    );
    // console.log(matchMap);

    const [singleMatch] = Object.values(matchMap);
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

  //+
  it('MaxBetAmount', async () => {
    const { data: { sportTournamentMap } } = await sportTournaments(PREMATCH, 'all');
    // console.log(sportTournamentMap);

    const { data: { matchMap } } = await tournamentMatches(PREMATCH,
      Object.values(Object.values(sportTournamentMap)[0])[0].tournamentId);
      // console.log(matchMap);

    const singleMatch = Object.values(matchMap)[0];
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);

    const data = await getMaxBetAmount(coupon, singleMatch);

    console.log(data);
  });

  it('MaxBetAmount OLD', async () => {
    const { data: { sportTournamentMap } } = await sportTournaments(PREMATCH, 'all');
    // console.log(sportTournamentMap);

    const { data: { matchMap } } = await tournamentMatches(PREMATCH,
      Object.values(Object.values(sportTournamentMap)[0])[0].tournamentId);
    // console.log(matchMap);

    const singleMatch = Object.values(matchMap)[0];
    // console.log(singleMatch);

    const coupon = generateOrdinaryCoupon(singleMatch);
    // console.log(coupon);

    const data = await getMaxBetAmountOld(coupon, singleMatch);

    console.log(data);
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
