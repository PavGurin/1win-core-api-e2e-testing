export function sportIdNameCheck(sport) {
  // проверка id и названия вида спорта
  expect(sport.sportId).not.toBeNil();
  expect(sport.sportName.en).not.toBeNil();
  expect(sport.sportName.ru).not.toBeNil();
}

export function tournamentNameCategoryCheck(tournament) {
  // проверка названия и страны/категории турнира
  expect(tournament.categoryName.en).not.toBeNil();
  expect(tournament.categoryName.ru).not.toBeNil();
  expect(tournament.tournamentName.en).not.toBeNil();
  expect(tournament.tournamentName.ru).not.toBeNil();
}

export function matchInfoCheck(match) {
  // проверка id матча и категории матча
  expect(match.matchId).not.toBeNil();
  expect(match.categoryId).not.toBeNil();

  // проверка названий команд
  expect(match.homeTeamName.en).not.toBeNil();
  expect(match.homeTeamName.ru).not.toBeNil();
  expect(match.awayTeamName.en).not.toBeNil();
  expect(match.awayTeamName.ru).not.toBeNil();

  // проверка статуса матча
  expect(match.matchResult.status === 'finished' || match.matchResult.status === 'cancelled'
    || match.matchResult.status === 'interrupted')
    .toEqual(true);

  // проверка счета матча
  if (match.matchResult.status === 'finished') {
    // если у матча статус 'finished'
    // то общий счет и счет за каждый период должны иметь вид хх:хх
    expect(match.matchResult.fullTimeScore.match(/.*:.*/).length).not.toBeNil();
    Object.values(match.matchResult.periodResultMap).forEach((period) => {
      expect(period.match(/.*:.*/).length).not.toBeNil();
    });
  } else if (match.matchResult.status === 'interrupted') {
    // если у матча статус 'interrupted'
    // то счет за каждый период должен иметь вид хх:хх
    Object.values(match.matchResult.periodResultMap).forEach((period) => {
      expect(period.match(/.*:.*/).length).not.toBeNil();
    });
  }
}

export function checkMatchTournamentSportNameIdEqual(match, sport, tournament) {
  // проверка, что id вида спорта и турнира, указанные для матча, есть
  // и совпадают с id вида спорта  и id турнира
  expect(match.sportId).toEqual(sport.sportId);
  expect(match.tournamentId.toString())
    .toEqual(Object.keys(sport.tournamentMap).find(key => sport.tournamentMap[key] === tournament));

  // проверка названий спорта, турнира, страны/категории турнира, указанных для матча
  expect(match.sportName.en).toEqual(sport.sportName.en);
  expect(match.sportName.ru).toEqual(sport.sportName.ru);
  expect(match.categoryName.en).toEqual(tournament.categoryName.en);
  expect(match.categoryName.ru).toEqual(tournament.categoryName.ru);
  expect(match.tournamentName.en).toEqual(tournament.tournamentName.en);
  expect(match.tournamentName.ru).toEqual(tournament.tournamentName.ru);
}

export function matchDateCheck(match, dateTimestamp) {
// проверка, что дата матча совпадает с отправленной
  const dayOfMatch = new Date(match.dateOfMatch);
  if (dayOfMatch.getUTCHours() >= 21 && dayOfMatch.getUTCHours()) {
    dayOfMatch.setUTCHours(dayOfMatch.getUTCHours() + 3);
  }

  expect(dayOfMatch.getUTCDate()).toEqual(dateTimestamp.getUTCDate());
  expect(dayOfMatch.getUTCMonth()).toEqual(dateTimestamp.getUTCMonth());
  expect(dayOfMatch.getUTCFullYear()).toEqual(dateTimestamp.getFullYear());
}

export function matchDateAndTimeCheck(match, startHourTimestamp) {
  // проверка, что время матча попадает в диапазон
  const dayOfMatch = new Date(match.dateOfMatch);
  expect(dayOfMatch >= startHourTimestamp).toEqual(true);
}

export function checkResultsByDate(resultsObject, dateTimestamp) {
  expect(Object.keys(resultsObject).length).not.toEqual(0);
  Object.values(resultsObject).forEach((sport) => {
    // console.log(sport);
    sportIdNameCheck(sport);

    // проверка турниров по спорту
    Object.values(sport.tournamentMap).forEach((tournament) => {
      // console.log(tournament);
      tournamentNameCategoryCheck(tournament);

      // проверка матчей турнира
      Object.values(tournament.matchMap).forEach((match) => {
        // console.log(match);
        matchInfoCheck(match);
        checkMatchTournamentSportNameIdEqual(match, sport, tournament);
        matchDateCheck(match, dateTimestamp);
      });
    });
  });
}

export function checkResultsByTime(resultsObject, startHourTimestamp) {
  expect(Object.keys(resultsObject).length).not.toEqual(0);
  Object.values(resultsObject).forEach((sport) => {
    // console.log(sport);
    sportIdNameCheck(sport);

    // проверка турниров по спорту
    Object.values(sport.tournamentMap).forEach((tournament) => {
      // console.log(tournament);
      tournamentNameCategoryCheck(tournament);

      // проверка матчей турнира
      Object.values(tournament.matchMap).forEach((match) => {
        // console.log(match);
        matchInfoCheck(match);
        checkMatchTournamentSportNameIdEqual(match, sport, tournament);
        matchDateAndTimeCheck(match, startHourTimestamp);
      });
    });
  });
}
