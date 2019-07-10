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
