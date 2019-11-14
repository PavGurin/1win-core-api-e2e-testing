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
    // console.log(betResponse);

    expect(betResponse.data[Object.keys(coupon.betsMap)[0]].error).toEqual(false);
    expect(betResponse.status).toEqual(200);
  });

  it('C27563 Prematch - express bet 10', async () => {
    const { data: { sportTournamentMap } } = await sportTournaments(PREMATCH, 'all');
    // console.log(sportTournamentMap);

    const { data: { matchMap } } = await tournamentMatches(
      PREMATCH,
      Object.values(Object.values(sportTournamentMap)[0])[0].tournamentId,
    );

    const coupon = generateExpressCoupon(matchMap, 5, 10);
    // console.log(coupon);

    const betResponse = await makeExpressBet(Object.values(coupon));
    // console.log(betResponse);
    // console.log(betResponse.data[Object.keys(coupon.betsMap)[0]].error);

    expect(betResponse.data[Object.keys(coupon.betsMap)[0]].error).toEqual(false);
    expect(betResponse.status).toEqual(200);
  });

  it.skip('C558186 Live - express bet 100', async () => {
    const { data: { sportTournamentMap } } = await sportTournaments(LIVE, 'all');
    // console.log(sportTournamentMap);

    const { data: { matchMap } } = await tournamentMatches(
      LIVE,
      Object.values(Object.values(sportTournamentMap)[0])[0].tournamentId,
    );
    // console.log(matchMap);

    const coupon = generateExpressCoupon(matchMap, 5, 10);
    // console.log(coupon);

    const betResponse = await makeExpressBet(Object.values(coupon));
    // console.log(betResponse);

    expect(betResponse.data[Object.keys(coupon.betsMap)[0]].error).toEqual(false);
    expect(betResponse.status).toEqual(200);
  });
});
