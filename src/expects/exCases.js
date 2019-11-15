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
