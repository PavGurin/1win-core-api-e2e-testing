export const favor = {

  async AddfavouriteTournament(tournamentId) {
    return socket.send('MS-FAVOURITE:favourites-toggle', {
      type: 'bets:tournament',
      id: tournamentId,
    });
  },
  async GetfavouriteTournament() {
    return socket.send('MS-FAVOURITE:favourites-get', {
      type: 'bets:tournament',
    });
  },
  async getGamesMatches() {
    const { data } = await socket.send('MATCH-TRANSLATIONS:translations ', {
    });
    return { data };
  },
  async getRandomGameMatches() {
    const { data } = await favor.getGamesMatches();
    console.log(data);
    // return data.data.translations[1];
  },

  async addToFavourites(gameId) {
    return socket.send('CASINO-3:games-favourites-toggle', {
      gameId: gameId, // eslint-disable-line object-shorthand
    });
  },
};
