import { expect } from 'chai';

export function checkInfoCase(data, idCases, cost, currency, id, max, min, name, priceMaxWin,
  priceMinWin, caseTypeId) {
  expect(data).to.be.an('array');
  expect(data[idCases].adjust).to.be.an('object');
  expect(data[idCases].cost).equal(cost);
  expect(data[idCases].currency).equal(currency);
  expect(data[idCases].id).equal(id);
  expect(data[idCases].max).equal(max);
  expect(data[idCases].min).equal(min);
  expect(data[idCases].name).equal(name);
  expect(data[idCases].priceMaxWin).equal(priceMaxWin);
  expect(data[idCases].priceMinWin).equal(priceMinWin);
  expect(data[idCases].caseTypeId).equal(caseTypeId);
}

export function checkCaseInfoByTypeId(data, idCases, caseTypeId, id) {
  expect(data[idCases].caseTypeId).equal(caseTypeId);
  expect(data[idCases].id).equal(id);
}

export function checkCaseResult(data, max, min) {
  expect(data.status).equal(200);
  expect(data.data.result).to.be.at.most(max);
  expect(data.data.result).to.be.at.least(min);
}
