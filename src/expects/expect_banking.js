import { expect } from 'chai';

// eslint-disable-next-line max-len
export function successDepositCreate(data,
  expectedCurrency, expectedPaymentType, expectedAmount) {
  expect(data.apiResponse.error).equal(false);
  expect(data.currency).equal(expectedCurrency);
  expect(data.paymentType).equal(expectedPaymentType);
  expect(data.amount).equal(expectedAmount);
}

export function successWithdrawalCreate(data) {
  expect(data).to.be.an('object');
  expect(data.email).not.equal(null);
  expect(data.message).equal(undefined);
}
