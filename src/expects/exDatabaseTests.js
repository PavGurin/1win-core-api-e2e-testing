import { mysqlConnection } from '../methods/mysqlConnection';

export function successDbDeposit(dbItem,
  expectedAmount, expectedWallet, expectedType, expectedCurrency) {
  expect(dbItem[0].amount).toEqual(expectedAmount);
  expect(dbItem[0].currency).toEqual(expectedCurrency);
  expect(dbItem[0].payment_system).toEqual(expectedType);
  expect(dbItem[0].wallet).toEqual(expectedWallet);
}

export async function checkRegistrationDomain(userId, expectedDomain) {
  const res = await mysqlConnection.executeQuery(`SELECT value FROM 1win.ma_users_meta WHERE id_user = ${userId} AND ma_users_meta.key = 'registration_domain';`);
  expect(res[0].value).toEqual(expectedDomain);
}
