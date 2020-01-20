import { register } from '../../src/methods/register';
import { casino } from '../../src/methods/casino';
import { logOut } from '../../src/methods/user';
import { userList } from '../../src/methods/userList';
import { checkGameArray, checkGameInfo, checkGameInfoIsValid } from '../../src/expects/exCasinoGame';
import { checkErrMsg } from '../../src/responseChecker';

describe('Casino-favourites', () => {
  it('C1710944 (+) New user has no games in favourites', async () => {
    await register.oneClickReg();
    const { data } = await casino.getFavourites();
    expect(JSON.stringify(data)).toEqual('[]');
  });

  it('C1710945 (+) Add to favourites', async () => {
    await register.oneClickReg();

    const game = await casino.getRandomGame();
    const { data } = await casino.addToFavourites(game.id);

    expect(data.gameId).toEqual(game.id);
    expect(data.isFavourite).toEqual(true);
  });

  it('C1710946 (+) Game is in favourites after added', async () => {
    await register.oneClickReg();

    const game = await casino.getRandomGame();
    await casino.addToFavourites(game.id);
    const { data } = await casino.getFavourites();

    expect(data.length).toEqual(1);
    checkGameInfo(data[0], game);
  });

  it('C1710947 (+) Game stays in favourites after logout and login', async () => {
    const { data: user } = await register.oneClickReg();
    // console.log(user);

    const game = await casino.getRandomGame();
    await casino.addToFavourites(game.id);
    await logOut();
    await userList.loginWithParams(user.email, user.password);
    const { data: favourites } = await casino.getFavourites();

    expect(favourites.length).toEqual(1);
    checkGameInfo(favourites[0], game);
  });

  it('C1710948 (+) Several games in favourites', async () => {
    const gamesNumber = 10;
    const { data: user } = await register.oneClickReg();
    // console.log(user);

    const games = [];
    for (let i = 0; i < gamesNumber; i++) {
      /* eslint no-await-in-loop:off */
      const game = await casino.getRandomGame();
      await casino.addToFavourites(game.id);
      games.push(game);
    }

    const { data } = await casino.getFavourites();
    checkGameArray(data, games);
  });

  it('C1710949 (+) Remove from favourites', async () => {
    await register.oneClickReg();

    const game = await casino.getRandomGame();
    await casino.addToFavourites(game.id);

    const { data } = await casino.removeFromFavourites(game.id);
    expect(data.gameId).toEqual(game.id);
    expect(data.isFavourite).toEqual(false);
  });

  it('C1710950 (+) Game is not in favourites after removed', async () => {
    await register.oneClickReg();

    const game = await casino.getRandomGame();
    await casino.addToFavourites(game.id);
    await casino.removeFromFavourites(game.id);

    const { data } = await casino.getFavourites();
    expect(data.length).toEqual(0);
  });

  it('C1710950 (+) Game is not in favourites after removed, logout and login', async () => {
    const { data: user } = await register.oneClickReg();
    // console.log(user);

    const game = await casino.getRandomGame();
    await casino.addToFavourites(game.id);
    await casino.removeFromFavourites(game.id);
    await logOut();
    await userList.loginWithParams(user.email, user.password);
    const { data: favourites } = await casino.getFavourites();

    expect(favourites.length).toEqual(0);
  });

  it('C1710951 (+) Remove several games from favourites', async () => {
    const gamesNumber = 10;
    const gamesNumberToRemove = 6;

    const { data: user } = await register.oneClickReg();
    // console.log(user);

    const games = [];
    for (let i = 0; i < gamesNumber - gamesNumberToRemove; i++) {
      /* eslint no-await-in-loop:off */
      const game = await casino.getRandomGame();
      await casino.addToFavourites(game.id);
      games.push(game);
    }
    for (let i = 0; i < gamesNumberToRemove; i++) {
      /* eslint no-await-in-loop:off */
      const game = await casino.getRandomGame();
      await casino.addToFavourites(game.id);
      await casino.removeFromFavourites(game.id);
    }

    const { data } = await casino.getFavourites();
    checkGameArray(data, games);
  });

  it('C1710952 (-) Add game with unexistent id', async () => {
    // баг - ответ 500
    await register.oneClickReg();

    const { data } = await casino.addToFavourites('not_existent_game');
    // console.log(data);
    checkErrMsg(data, 400, 'Invalid game id');
  });

  it('C1713137 (+) Login with user who has casino-favourites', async () => {
    await userList.userWithCasinoFavourites();

    const { data } = await casino.getFavourites();
    // console.log(data);
    expect(data.length).not.toEqual(0);
    data.forEach((game) => { checkGameInfoIsValid(game); });
  });
});
