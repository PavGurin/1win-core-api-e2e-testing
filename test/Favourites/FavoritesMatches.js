import { checkErrMsg, checkErrorMsg, checkSuccess } from '../../src/responseChecker';
import { register } from '../../src/methods/register';
import { favor } from '../../src/methods/favorite';
import { userList } from '../../src/methods/userList';

describe('Add favourites', () => {
  it('C135689074 - (+) add favourites tournament', async () => {
    await register.oneClickReg();
    const { data } = await favor.AddfavouriteTournament(1);
    checkErrMsg(data);
    const { data: data1 } = await favor.GetfavouriteTournament();
    console.log(data1);
    expect(data1['bets:tournament'].length).toEqual(1);
  });
  it.skip('C45689074 - (+) add favourites matches', async () => {
    await userList.loginWithParams('ginl39@1win.xyz', 'dreamteam');

    const game = await favor.getRandomGameMatches();
    console.log(game);
  });
  it('rega', async () => {
    await register.oneClickReg();
    const { data } = await favor.AddfavouriteTournament(1);
    checkErrMsg(data);
    const { data: data1 } = await favor.GetfavouriteTournament();
    console.log(data1);
    expect(data1['bets:tournament'].length).toEqual(1);
  });
});
