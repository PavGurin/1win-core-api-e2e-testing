import config from '../config';

export const casino = {

  async getGames() {
    const { data } = await socket.send('CASINO-3:games-get', {
      category: 1,
      onlyMobile: false,
    });
    return data;
  },

  async getRandomGame() {
    const games = await casino.getGames();
    return games[Math.floor(Math.random() * (games.length) + 1)];
  },

  async addToFavourites(gameId) {
    return socket.send('CASINO-3:games-favourites-toggle', {
      gameId: gameId, // eslint-disable-line object-shorthand
    });
  },

  async getFavourites() {
    return socket.send('CASINO-3:games-favourites-get', {});
  },

  async removeFromFavourites(gameInFavourtiesId) {
    return socket.send('CASINO-3:games-favourites-toggle', {
      gameId: gameInFavourtiesId, // eslint-disable-line object-shorthand
    });
  },

  async getCubeia(isMobile = false) {
    return socket.send('CASINO-3:games-cubeia', {
      backUrl: config.backendURL,
      isMobile: isMobile, // eslint-disable-line object-shorthand
    });
  },
};
