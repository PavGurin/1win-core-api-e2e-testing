
export function successDepositCreate(data,
  expectedCurrency, expectedPaymentType, expectedAmount) {
  expect(data.apiResponse.error).toEqual(false);
  expect(data.currency).toEqual(expectedCurrency);
  expect(data.paymentType).toEqual(expectedPaymentType);
  expect(data.amount).toEqual(expectedAmount);
}

export function successWithdrawalCreate(data) {
  expect(data).toBeObject();
  expect(data.email).not.toEqual(null);
  expect(data.message).toEqual(undefined);
}
