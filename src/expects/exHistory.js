export function checkHistoryDeposit(receivedData, expectedAmount, expectedCurrency,
  expectedPaymentSystem, expectedWallet, expectedStatus, expectedTime) {
  if (process.env.CYPRESS_TESTRAIL_PROJECT_ID) {
    expectedTime.setHours(expectedTime.getHours() - 3);
  }
  expect(receivedData.count).toBe(1);
  expect(receivedData.items[0].id).not.toBeNil();
  expect(receivedData.items[0].amount).toBe(expectedAmount);
  expect(receivedData.items[0].currency).toBe(expectedCurrency);
  expect(receivedData.items[0].payment_system).toBe(expectedPaymentSystem);
  expect(receivedData.items[0].wallet).toBe(expectedWallet);
  expect(receivedData.items[0].status).toBe(expectedStatus);
  expect(receivedData.items[0].time).toBe((expectedTime.setMilliseconds(0)) / 1);
}


export function checkHistoryCase(receivedData, expectedDate, expectedCurrency, expectedAmount) {
  expect(receivedData.count).toBe(1);
  expect(receivedData.items.length).toBe(1);
  expect(receivedData.items[0].id).toBe(`${expectedDate.getFullYear()}-${expectedDate.getMonth() + 1}-${expectedDate.getDate()}`);
  expect(receivedData.items[0].time).toBe(`${expectedDate.getFullYear()}-${expectedDate.getMonth() + 1}-${expectedDate.getDate()}T00:00:00.000Z`);
  expect((receivedData.items[0].pnl[expectedCurrency]).toFixed(2)).toBe(expectedAmount);
}
