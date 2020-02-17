import { round } from '../methods/utils';

export function checkInfoCase(data, idCases, cost, currency, id, max, min, name, priceMaxWin,
  priceMinWin, caseTypeId) {
  expect(data).toBeArray();
  expect(data[idCases].adjust).toBeObject();
  expect(data[idCases].cost).toEqual(cost);
  expect(data[idCases].currency).toEqual(currency);
  expect(data[idCases].id).toEqual(id);
  expect(data[idCases].max).toEqual(max);
  expect(data[idCases].min).toEqual(min);
  expect(data[idCases].name).toEqual(name);
  expect(data[idCases].priceMaxWin).toEqual(priceMaxWin);
  expect(data[idCases].priceMinWin).toEqual(priceMinWin);
  expect(data[idCases].caseTypeId).toEqual(caseTypeId);
  expect(data[idCases].totalOpen).toBeNumber();
  expect(data[idCases].totallyWon).toBeNumber();
}

export function checkCaseInfoByTypeId(data, idCases, caseTypeId, id) {
  expect(data[idCases].caseTypeId).toEqual(caseTypeId);
  expect(data[idCases].id).toEqual(id);
}

export function checkCaseResult(data, max, min) {
  expect(data.status).toEqual(200);
  expect(data.data.result).toBeLessThanOrEqual(max);
  expect(data.data.result).toBeGreaterThanOrEqual(min);
}

export function checkStatsValid(receivedStats) {
  expect(receivedStats.playersOnline).not.toBeNil();
  expect(receivedStats.playersOnline).toBeNumber();

  expect(receivedStats.todayIssued.RUB).not.toBeNil();
  expect(receivedStats.todayIssued.RUB).toBeNumber();
  expect(receivedStats.todayIssued.USD).not.toBeNil();
  expect(receivedStats.todayIssued.USD).toBeNumber();
  expect(receivedStats.todayIssued.EUR).not.toBeNil();
  expect(receivedStats.todayIssued.EUR).toBeNumber();
  expect(receivedStats.todayIssued.UAH).not.toBeNil();
  expect(receivedStats.todayIssued.UAH).toBeNumber();

  expect(receivedStats.totalIssued.RUB).not.toBeNil();
  expect(receivedStats.totalIssued.RUB).toBeNumber();
  expect(receivedStats.totalIssued.USD).not.toBeNil();
  expect(receivedStats.totalIssued.USD).toBeNumber();
  expect(receivedStats.totalIssued.EUR).not.toBeNil();
  expect(receivedStats.totalIssued.EUR).toBeNumber();
  expect(receivedStats.totalIssued.UAH).not.toBeNil();
  expect(receivedStats.totalIssued.UAH).toBeNumber();

  expect(receivedStats.totalOpen).not.toBeNil();
  expect(receivedStats.totalOpen).toBeNumber();

  Object.values(receivedStats.cases).forEach((caseId) => {
    expect(caseId.RUB.open).not.toBeNil();
    expect(caseId.RUB.open).toBeNumber();
    expect(caseId.RUB.issued).not.toBeNil();
    expect(caseId.RUB.issued).toBeNumber();

    expect(caseId.USD.open).not.toBeNil();
    expect(caseId.USD.open).toBeNumber();
    expect(caseId.USD.issued).not.toBeNil();
    expect(caseId.USD.issued).toBeNumber();

    expect(caseId.EUR.open).not.toBeNil();
    expect(caseId.EUR.open).toBeNumber();
    expect(caseId.EUR.issued).not.toBeNil();
    expect(caseId.EUR.issued).toBeNumber();

    expect(caseId.UAH.open).not.toBeNil();
    expect(caseId.UAH.open).toBeNumber();
    expect(caseId.UAH.issued).not.toBeNil();
    expect(caseId.UAH.issued).toBeNumber();
  });
}

export function compareCasesStats(stats1, stats2, expectedResult) {
  if (expectedResult) {
    expect(stats1).toEqual(stats2);
  } else {
    expect(stats1 !== stats2).toEqual(true);
  }
}

export function checkConvertation(stats, currencies) {
  expect(stats.totalIssued.USD).not.toEqual(round(stats.totalIssued.RUB / currencies.usd));
  expect(stats.totalIssued.EUR).not.toEqual(round(stats.totalIssued.RUB / currencies.eur));
  expect(stats.totalIssued.UAH).not.toEqual(round(stats.totalIssued.RUB / currencies.uah));

  Object.values(stats.cases).forEach((caseId) => {
    expect(caseId.USD.issued).not.toEqual(round(caseId.RUB.issued / currencies.usd));
    expect(caseId.EUR.issued).not.toEqual(round(caseId.RUB.issued / currencies.eur));
    expect(caseId.UAH.issued).not.toEqual(round(caseId.RUB.issued / currencies.uah));
  });

  // баг https://fbet-gitlab.ex2b.co/backend/money-cases/issues/41
  expect(stats.todayIssued.USD).not.toEqual(round(stats.todayIssued.RUB / currencies.usd));
  expect(stats.todayIssued.EUR).not.toEqual(round(stats.todayIssued.RUB / currencies.eur));
  expect(stats.todayIssued.UAH).not.toEqual(round(stats.todayIssued.RUB / currencies.uah));
}

export function checkRatingValid(receivedRating) {
  expect(receivedRating).toBeArray();
  receivedRating.forEach((item) => {
    expect(item.id).not.toBeNil();
    expect(item.id).toBeNumber();

    expect(item.cost).not.toBeNil();
    expect(item.cost).toBeNumber();

    expect(item.caseTypeId).not.toBeNil();
    expect(item.caseTypeId).toBeNumber();

    expect(item.name).not.toBeNil();
    expect(item.name).toBeString();

    expect(item.date).not.toBeNil();
    expect(item.date).toBeString();
  });
}

export function checkRatingRecord(ratingRecordItem,
  expectedName, expectedWinAmount, expectedCaseTypeId, expectedDate) {
  expect(ratingRecordItem.name).toEqual(expectedName);
  expect(ratingRecordItem.cost).toEqual(expectedWinAmount);
  expect(ratingRecordItem.caseTypeId).toEqual(expectedCaseTypeId);
  const date = new Date(ratingRecordItem.date);
  expect(date.getFullYear()).toEqual(expectedDate.getFullYear());
  expect(date.getMonth()).toEqual(expectedDate.getMonth());
  expect(date.getDate()).toEqual(expectedDate.getDate());
  // TODO понять как определяется возвращаемое время, чтобы вычесть нужное число часов
  // expect(date.getHours()).toEqual(expectedDate.getHours());
  expect(date.getMinutes()).toEqual(expectedDate.getMinutes());
}

export function compareTotallyWon(casesInfoRub,
  casesInfoUsd, casesInfoEur, casesInfoUah, currencies) {
  casesInfoRub.forEach(async (caseRub) => {
    const caseUsd = casesInfoUsd.find(item => item.name === caseRub.name);
    const caseEur = casesInfoEur.find(item => item.name === caseRub.name);
    const caseUah = casesInfoUah.find(item => item.name === caseRub.name);

    expect(caseRub.totallyWon).not.toEqual(caseUsd.totallyWon);
    expect(caseRub.totallyWon).not.toEqual(caseEur.totallyWon);
    expect(caseRub.totallyWon).not.toEqual(caseUah.totallyWon);
    expect(caseUsd.totallyWon).not.toEqual(caseEur.totallyWon);
    expect(caseUsd.totallyWon).not.toEqual(caseUah.totallyWon);
    expect(caseEur.totallyWon).not.toEqual(caseUah.totallyWon);

    expect(caseUsd.totallyWon).not.toEqual(round(caseRub.totallyWon / currencies.usd));
    expect(caseEur.totallyWon).not.toEqual(round(caseRub.totallyWon / currencies.eur));
    expect(caseUah.totallyWon).not.toEqual(round(caseRub.totallyWon / currencies.uah));
  });
}

export function checkOpenedAmount(receivedStats) {
  Object.values(receivedStats.cases).forEach((item) => {
    expect(item.RUB.open).not.toEqual(item.USD.open);
    expect(item.RUB.open).not.toEqual(item.EUR.open);
    expect(item.RUB.open).not.toEqual(item.UAH.open);
    expect(item.USD.open).not.toEqual(item.EUR.open);
    expect(item.USD.open).not.toEqual(item.UAH.open);
    expect(item.EUR.open).not.toEqual(item.UAH.open);
  });
}
