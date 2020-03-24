import { checkErrMsg, checkSuccess } from '../../src/responseChecker';
import { register } from '../../src/methods/register';
import { favor } from '../../src/methods/favorite';
import { getSingleMatch } from '../../src/methods/matchStorage';


const PREMATCH = 'prematch';
describe('Add favourites', () => {
  it('C2036784 - (+) add favourites tournament', async () => {
    await register.oneClickReg();
    const { data } = await favor.AddfavouriteTournament(10);
    // console.log(data)
    const { data: data1 } = await favor.checkFavourites();
    // console.log(data1['bets:tournament'][0]);
    expect(data1['bets:tournament'][0]).toEqual(10);
  });
  it('C2036785 - (+) add favourites matches', async () => {
    await register.oneClickReg();
    const singleMatch = await getSingleMatch(PREMATCH);
    // console.log(singleMatch.matchId);
    const data = await favor.getAndDeleteRandomMatches(singleMatch.matchId);
    checkSuccess(data);
    const { data: data1 } = await favor.checkFavourites();
    expect(singleMatch.matchId).toEqual(data1['bets:match'][0]);
  });
  it('C2036786 - (+) delete favourites matches', async () => {
    await register.oneClickReg();
    const singleMatch = await getSingleMatch(PREMATCH);
    // console.log(singleMatch.matchId);
    const data = await favor.getAndDeleteRandomMatches(singleMatch.matchId);
    checkSuccess(data);
    const { data: data1 } = await favor.checkFavourites();
    expect(singleMatch.matchId).toEqual(data1['bets:match'][0]);
    const data2 = await favor.getAndDeleteRandomMatches(singleMatch.matchId);
    // console.log(data2);
    const { data: data3 } = await favor.checkFavourites();
    // console.log(JSON.stringify(data3));
    expect(JSON.stringify(data3)).toEqual('{}');
  });
  it('C2036787 - (+) add favourites match and tournament', async () => {
    await register.oneClickReg();
    const singleMatch = await getSingleMatch(PREMATCH);
    // console.log(singleMatch.matchId);
    const data = await favor.getAndDeleteRandomMatches(singleMatch.matchId);
    checkSuccess(data);
    const { data: data1 } = await favor.AddfavouriteTournament(1);
    const { data: data2 } = await favor.checkFavourites();
    expect(singleMatch.matchId).toEqual(data2['bets:match'][0]);
    expect(data2['bets:tournament'].length).toEqual(1);
    // console.log(data2);
  });
  it('C2036788 - (+) add favourites matches without register', async () => {
    const singleMatch = await getSingleMatch(PREMATCH);
    // console.log(singleMatch.matchId);
    const data = await favor.getAndDeleteRandomMatches(singleMatch.matchId);
    checkSuccess(data);
    const { data: data1 } = await favor.checkFavourites();
    // console.log(data1);
    checkErrMsg(data1, 401, 'Unauthorized');
  });
});
