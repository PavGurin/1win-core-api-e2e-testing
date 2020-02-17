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
  // console.log(sportTournamentMap);
  const tournamentsAvailable = Object.values(sportTournamentMap).length;
  // console.log(tournamentsAvailable);
  let data;
  let availableMatchesCount;
  let betStatus;
  for (let i = 0; i < tournamentsAvailable; i++) {
    availableMatchesCount = Object.values(Object.values(sportTournamentMap)[i]).length;
    for (let m = availableMatchesCount - 1; m >= 0; m--) {
      // eslint-disable-next-line no-await-in-loop
      data = await tournamentMatches(
        service,
        Object.values(Object.values(sportTournamentMap)[i])[m].tournamentId,
      );
      betStatus = Object.values(data.data.matchMap)[0].betstatus;
      // console.log(betStatus);
      if (service === 'prematch' || betStatus === ('started')) {
        return (Object.values(data.data.matchMap))[0];
      }
    }
  }
  // eslint-disable-next-line no-console
  return console.log('error in betStatus method or there are no any matches available for bet');
}

export async function getInactiveSingleMatch(service) {
  // берем список всех матчей по параметру 'service'
  const { data: { sportTournamentMap } } = await sportTournaments(service, 'all');
  // console.log(sportTournamentMap);
  const tournamentsAvailable = Object.values(sportTournamentMap).length;
  // console.log(tournamentsAvailable);
  let data;
  let availableMatchesCount;
  let betStatus;
  for (let i = 0; i < tournamentsAvailable; i++) {
    availableMatchesCount = Object.values(Object.values(sportTournamentMap)[i]).length;
    for (let m = 0; m < availableMatchesCount; m++) {
      // eslint-disable-next-line no-await-in-loop
      data = await tournamentMatches(
        service,
        Object.values(Object.values(sportTournamentMap)[i])[m].tournamentId,
      );
      try {
        betStatus = Object.values(data.data.matchMap)[0].betstatus;
        // console.log(betStatus);
        if (betStatus !== ('started')) {
          return Object.values(data.data.matchMap)[m];
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('Error in blocked bet search method');
      }
    }
  }
  // eslint-disable-next-line no-console
  return console.log('error in betStatus method or there are no any matches available for bet');
}

export const getMatchHistory = async ({
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
