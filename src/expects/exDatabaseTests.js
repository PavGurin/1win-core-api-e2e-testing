import { expect } from 'chai';

export function successDbDeposit(dbItem,
  expectedAmount, expectedWallet, expectedType, expectedCurrency) {
  expect(Object.keys(dbItem).length).to.equal(1);
  expect(dbItem[0].amount).to.equal(expectedAmount);
  expect(dbItem[0].currency).to.equal(expectedCurrency);
  expect(dbItem[0].payment_system).to.equal(expectedType);
  expect(dbItem[0].wallet).to.equal(expectedWallet);
}
