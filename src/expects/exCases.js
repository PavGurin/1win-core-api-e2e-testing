import { expect } from 'chai';

export function checkInfoCase(data, idCases, cost, currency, id, max, min, name, priceMaxWin,
  priceMinWin) {
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
}

export function checkCaseResult(data, max, min) {
  expect(data.status).equal(200);
  expect(data.data.result).to.be.below(max);
  expect(data.data.result).to.be.above(min);
}
