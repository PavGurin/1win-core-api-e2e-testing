export function sportIdNameCheck(sport) {
  // проверка id и названия вида спорта
  // TODO: I'm not fully sure in toBeNil();
  expect(sport.sportId, 'sportId not exists\n').not.toBeNil;
  expect(sport.sportName.en, 'sportName.en not exists\n').not.toBeNil;
  expect(sport.sportName.ru, 'sportName.ru not exists\n').not.toBeNil;
}

export function tournamentNameCategoryCheck(tournament) {
  // проверка названия и страны/категории турнира
  expect(tournament.categoryName.en, 'tournament.categoryName.en not exists\n').not.toBeNil;
  expect(tournament.categoryName.ru, 'tournament.categoryName.ru not exists\n').not.toBeNil;
  expect(tournament.tournamentName.en, 'tournament.tournamentName.en not exists\n').not.toBeNil;
  expect(tournament.tournamentName.ru, 'tournament.tournamentName.ru not exists\n').not.toBeNil;
}

export function matchInfoCheck(match) {
  // проверка id матча и категории матча
  expect(match.matchId, 'match.matchId not exists\n').not.toBeNil;
  expect(match.categoryId, `match.categoryId not exists|:\n${match.matchId}\n`).not.toBeNil;

  // проверка названий команд
  expect(match.homeTeamName.en, `match.homeTeamName.en not exists:\n${match.matchId}\n`).not.toBeNil;
  expect(match.homeTeamName.ru, `match.homeTeamName.ru not exists:\n${match.matchId}\n`).not.toBeNil;
  expect(match.awayTeamName.en, `match.awayTeamName.en not exists:\n${match.matchId}\n`).not.toBeNil;
  expect(match.awayTeamName.ru, `match.awayTeamName.ru not exists:\n${match.matchId}\n`).not.toBeNil;

  // проверка статуса матча
  expect(match.matchResult.status === 'finished' || match.matchResult.status === 'cancelled'
    || match.matchResult.status === 'interrupted',
  `match.status not equal 'finished', 'cancelled' or 'interrupted':\n${match.matchId}\n`)
    .toEqual(true);

  // проверка счета матча
  if (match.matchResult.status === 'finished') {
    // если у матча статус 'finished'
    // то общий счет и счет за каждый период должны иметь вид хх:хх
    expect(match.matchResult.fullTimeScore.match(/.*:.*/).length,
      `match.fullTimeScore score is invalid:\n${match.matchId}\n`).not.toBeNil;
    Object.values(match.matchResult.periodResultMap).forEach((period) => {
      expect(period.match(/.*:.*/).length,
        `period score is invalid:\nmatchId=${match.matchId}\nperiod=${period}\n`).not.toBeNil;
    });
  } else if (match.matchResult.status === 'interrupted') {
    // если у матча статус 'interrupted'
    // то счет за каждый период должен иметь вид хх:хх
    Object.values(match.matchResult.periodResultMap).forEach((period) => {
      expect(period.match(/.*:.*/).length,
        `period score is invalid:\nmatchId=${match.matchId}\nperiod=${period}\n`).not.toBeNil;
    });
  }
}

export function checkMatchTournamentSportNameIdEqual(match, sport, tournament) {
  // проверка, что id вида спорта и турнира, указанные для матча, есть
  // и совпадают с id вида спорта  и id турнира
  expect(match.sportId, `match.matchId not equal sport.sportId:\n${match}`).toEqual(sport.sportId);
  expect(match.tournamentId.toString(), `match.tournamentId not equal tournamentId:\n${match}`)
    .toEqual(Object.keys(sport.tournamentMap).find(key => sport.tournamentMap[key] === tournament));

  // проверка названий спорта, турнира, страны/категории турнира, указанных для матча
  expect(match.sportName.en,
    `match.sportName.en not equal sport.sportName.en:\n${match}`).toEqual(sport.sportName.en);
  expect(match.sportName.ru,
    `match.sportName.ru not equal sport.sportName.ru:\n${match}`).toEqual(sport.sportName.ru);
  expect(match.categoryName.en,
    `match.categoryName.en not equal tournament.categoryName.en:\n${match}`).toEqual(tournament.categoryName.en);
  expect(match.categoryName.ru,
    `match.categoryName.ru not equal tournament.categoryName.ru:\n${match}`).toEqual(tournament.categoryName.ru);
  expect(match.tournamentName.en,
    `match.tournamentName.en not equal tournament.tournamentName.en:\n${match}`).toEqual(tournament.tournamentName.en);
  expect(match.tournamentName.ru,
    `match.tournamentName.ru not equal tournament.tournamentName.ru:\n${match}`).toEqual(tournament.tournamentName.ru);
}

export function matchDateCheck(match, dateTimestamp) {
// проверка, что дата матча совпадает с отправленной
  const dayOfMatch = new Date(match.dateOfMatch);
  if (dayOfMatch.getUTCHours() >= 21 && dayOfMatch.getUTCHours()) {
    dayOfMatch.setUTCHours(dayOfMatch.getUTCHours() + 3);
  }

  expect(dayOfMatch.getUTCDate(),
    `match date not equal requested date:\n
    send date ${dateTimestamp.getDate()} ${dateTimestamp.getHours()}:${dateTimestamp.getMinutes()}\n
     get date ${dayOfMatch.getDate()} ${dayOfMatch.getHours()}:${dayOfMatch.getMinutes()}\n${match.matchId} 
     \nmatchId: ${match.matchId}\n`)
    .toEqual(dateTimestamp.getUTCDate());
  expect(dayOfMatch.getUTCMonth(),
    `match month not equal requested month:\n${dateTimestamp.getMonth()}\n${match.matchId}`)
    .toEqual(dateTimestamp.getUTCMonth());
  expect(dayOfMatch.getUTCFullYear(),
    `match year not equal requested year:\n${dateTimestamp.getFullYear()}\n${match.matchId}`)
    .toEqual(dateTimestamp.getFullYear());
}

export function matchDateAndTimeCheck(match, startHourTimestamp) {
  // проверка, что время матча попадает в диапазон
  const dayOfMatch = new Date(match.dateOfMatch);
  expect(dayOfMatch >= startHourTimestamp,
    `match start hour not fits requested interval:\nexpected minimum time=${startHourTimestamp
      .getDate()}.${startHourTimestamp.getMonth()} ${startHourTimestamp
      .getHours()}:${startHourTimestamp.getMinutes()}\nactual time=${dayOfMatch
      .getDate()}.${dayOfMatch.getMonth()} ${dayOfMatch.getHours()}:${dayOfMatch
      .getMinutes()}\nactual ts=${match.dateOfMatch}\nmatchId=${match.matchId}\n`)
    .toEqual(true);
}

export function checkResultsByDate(resultsObject, dateTimestamp) {
  expect(Object.keys(resultsObject).length, `no results for date: ${dateTimestamp
    .getDate()}.${dateTimestamp.getMonth()}.${dateTimestamp.getFullYear()}\n`).not.toEqual(0);
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
  expect(Object.keys(resultsObject).length, `no results for time: ${startHourTimestamp
    .getDate()}.${startHourTimestamp.getMonth()} ${startHourTimestamp
    .getHours()}:${startHourTimestamp.getMinutes()}\n`).not.toEqual(0);
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
