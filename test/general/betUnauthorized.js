import {
  getMatchById, getSingleMatch, sportTournaments, tournamentMatches,
} from '../../src/methods/matchStorage';
import { checkErrMsg } from '../../src/responseChecker';
import {
  generateExpressCoupon, generateOrdinaryCoupon, makeExpressBet, makeOrdinaryBet,
} from '../../src/methods/better';
import { logOut } from '../../src/methods/user';

describe('Unauthorized ', () => {
  const PREMATCH = 'prematch';

  it('C22023 (-) non authorized user get bet', async () => {
    const { data } = await getMatchById(25);
    // console.log(data);
    checkErrMsg(data, 401, 'Unauthorized');
  });
  it('C1531595 Prematch - express bet', async () => {
    const { data: { sportTournamentMap } } = await sportTournaments(PREMATCH, 'all');
    // console.log(sportTournamentMap);

    const { data: { matchMap } } = await tournamentMatches(
      PREMATCH,
      Object.values(Object.values(sportTournamentMap)[0])[0].tournamentId,
    );
    const coupon = generateExpressCoupon(matchMap, 2, 10);
    // console.log(coupon);
    const betResponse = await makeExpressBet(Object.values(coupon));
    //  console.log(betResponse);
    expect(betResponse.data.status).toEqual(401);
  });
  it('C1531594 Prematch - ordinary bet', async () => {
    const singleMatch = await getSingleMatch(PREMATCH);
    // console.log(singleMatch);

    const coupon = await generateOrdinaryCoupon(singleMatch, 1);
    // console.log(coupon);
    const betResponse = await makeOrdinaryBet(coupon, 10);
    // console.log(betResponse);
    expect(betResponse.data.status).toEqual(401);
  });
});
