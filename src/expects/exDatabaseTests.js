import { expect } from 'chai';
import { mysqlConnection } from '../methods/mysqlConnection';

export function successDbDeposit(dbItem,
  expectedAmount, expectedWallet, expectedType, expectedCurrency) {
  expect(Object.keys(dbItem).length).to.equal(1);
  expect(dbItem[0].amount).to.equal(expectedAmount);
  expect(dbItem[0].currency).to.equal(expectedCurrency);
  expect(dbItem[0].payment_system).to.equal(expectedType);
  expect(dbItem[0].wallet).to.equal(expectedWallet);
}

export async function checkRegistrationDomain(userId, expectedDomain) {
  const res = await mysqlConnection.executeQuery(`SELECT value FROM 1win.ma_users_meta WHERE id_user = ${userId} AND ma_users_meta.key = 'registration_domain';`);
  expect(res[0].value).equal(expectedDomain);
}
