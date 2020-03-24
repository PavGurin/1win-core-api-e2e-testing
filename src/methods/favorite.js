export const favor = {

  async AddfavouriteTournament(tournamentId) {
    return socket.send('MS-FAVOURITE:favourites-toggle', {
      type: 'bets:tournament',
      id: tournamentId,
    });
  },
  async getAndDeleteRandomMatches(matchId) {
    return socket.send('MS-FAVOURITE:favourites-toggle', {
      type: 'bets:match',
      id: matchId,
    });
  },

  async checkFavourites() {
    return socket.send('MS-FAVOURITE:favourites-get', {
      type: ['bets:tournament', 'bets:match'],
    });
  },
};
