export async function sportAll(service) {
  return socket.send('MATCH-STORAGE-2:sport-all', {
    service,
    timeFilter: {
      date: false,
      hour: false,
    },
  });
}

export async function sportCategories(service, sportId) {
  return socket.send('MATCH-STORAGE-2:sport-categories', {
    service,
    sportId,
    timeFilter: {
      date: false,
      hour: false,
    },
  });
}

export async function sportTournaments(service, tournamentId) {
  return socket.send('MATCH-STORAGE-2:sport-tournaments', {
    service,
    tournamentId,
    timeFilter: {
      date: false,
      hour: false,
    },
  });
}

export async function tournamentMatches(service, tournamentId) {
  return socket.send('MATCH-STORAGE-2:tournament-matches', {
    service,
    timeFilter: {
      date: false,
      hour: false,
    },
    tournamentId,
  });
}

export async function getSingleMatch(service) {
  const { data: { sportTournamentMap } } = await sportTournaments(service, 'all');
  console.log(sportTournamentMap);

  // const { data: { matchMap } } = await tournamentMatches(
  //   service,
  //   Object.values(Object.values(sportTournamentMap)[0])[0].tournamentId,
  // );

  const data = await tournamentMatches(
    service,
    Object.values(Object.values(sportTournamentMap)[0])[0].tournamentId,
  );
  console.log(data);

  return Object.values(data.data.matchMap);
}

export const getMatchHistory = async (socket, {
  betType = ['ordinary', 'express'],
  limit = 20,
  ...params
} = {}) => {
  if (!Array.isArray(limit)) {
    // eslint-disable-next-line no-param-reassign
    limit = [0, limit];
  }
  if (!Array.isArray(betType)) {
    // eslint-disable-next-line no-param-reassign
    betType = [betType];
  }

  return socket.send('BETS:bets-history', {
    limit,
    order: ['id', 'DESC'],
    where: {
      betType,
    },
    ...params,
  });
};

export async function getMatchById(id) {
  return socket.send('BETS:bets-get', {
    id,
    language: null,
  });
}
