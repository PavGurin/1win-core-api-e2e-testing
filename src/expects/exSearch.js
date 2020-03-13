import { generateExpressCoupon } from '../methods/better';

export function checkSearchResults(results, expectedSubString, matchesFound, tournamentsFound, lang = 'ru', expectedService) {
  if (tournamentsFound) {
    results.tournaments.forEach((tournament) => {
      expect(tournament.tournamentName[lang].toLowerCase()
        .includes(expectedSubString)).toEqual(true);
      if (expectedService) {
        expect(tournament.service).toEqual(expectedService);
      }
    });
  } else {
    expect(JSON.stringify(results.tournaments)).toEqual('[]');
  }
  if (matchesFound) {
    Object.values(results.matches).forEach((match) => {
      // console.log(match);
      match.forEach((item) => {
        expect(item.awayTeamName[lang].toLowerCase().includes(expectedSubString)
            || item.homeTeamName[lang].toLowerCase().includes(expectedSubString))
          .toEqual(true);
        if (expectedService) {
          expect(item.service).toEqual(expectedService);
        }
      });
    });
  } else {
    expect(JSON.stringify(results.matches)).toEqual('{}');
  }
}

export function checkEmptySearch(data, status) {
  expect(status).toEqual(200);
  expect(Object.values(data.data.matches).length).toBeGreaterThan(0);
  expect(Object.values(data.data.tournaments).length).toBeGreaterThan(0);
}
