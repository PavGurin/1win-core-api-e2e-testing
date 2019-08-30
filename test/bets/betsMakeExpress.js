import { expect } from 'chai';

import { userList } from '../../src/methods/userList';
import {
  generateExpressCoupon,
  makeExpressBet,
} from '../../src/methods/better';

import { sportTournaments, tournamentMatches } from '../../src/methods/matchStorage';

const PREMATCH = 'prematch';
const LIVE = 'live';

beforeEach(async () => {
  await userList.loginWithRealMoney(socket);
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
    console.log(betResponse);

    expect(betResponse.data[Object.keys(coupon.betsMap)[0]].error).equal(false);
    expect(betResponse.status).equal(200);
  });

  it('C27563 Ordinary - express bet 100', async () => {
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

  it('C27563 Prematch - express bet 100', async () => {
    const { data: { sportTournamentMap } } = await sportTournaments(PREMATCH, 'all');
    // console.log(sportTournamentMap);

    const { data: { matchMap } } = await tournamentMatches(
      LIVE,
      Object.values(Object.values(sportTournamentMap)[0])[0].tournamentId,
    );

    const coupon = generateExpressCoupon(matchMap, 100, 10);

    const betResponse = await makeExpressBet(Object.values(coupon));
    // console.log(betResponse);

    expect(betResponse.data[Object.keys(coupon.betsMap)[0]].error).equal(false);
    expect(betResponse.status).equal(200);
  });
});
