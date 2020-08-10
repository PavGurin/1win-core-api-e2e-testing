import { mysqlConnection } from '../methods/mysqlConnection';

export function successDepositCreate(data,
  expectedCurrency, expectedPaymentType, expectedAmount) {
  expect(data.apiResponse.error).toEqual(false);
  expect(data.currency).toEqual(expectedCurrency);
  expect(data.paymentType).toEqual(expectedPaymentType);
  expect(data.amount).toEqual(expectedAmount);
}

export async function getLastDeposit(userId) {
  return mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${userId} ORDER BY id DESC;`);
}

export async function successDbDeposit(userId,
  expectedAmount, expectedWallet, expectedType, expectedCurrency) {
  const dbItem = await getLastDeposit(userId);
  expect(dbItem[0].amount).toEqual(expectedAmount);
  expect(dbItem[0].currency).toEqual(expectedCurrency);
  expect(dbItem[0].payment_system).toEqual(expectedType);
  expect(dbItem[0].wallet).toEqual(expectedWallet);
}

export function successWithdrawalCreate(data) {
  expect(data).toBeObject();
  expect(data.email).not.toEqual(null);
  expect(data.message).toEqual(undefined);
}

export function checkUserdataSnippet(data, expectedPaymentMethod, expectedAmount) {
  expect(data.mostPaymentMethod).toEqual(expectedPaymentMethod);
  expect(data.paymentAmountSnippet).toEqual(expectedAmount);
}
