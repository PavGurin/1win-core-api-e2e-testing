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

describe('Series', () => {
  it.only('Series test', async () => {
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
});
