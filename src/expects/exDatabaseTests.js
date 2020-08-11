import { mysqlConnection } from '../methods/mysqlConnection';

export async function checkRegistrationDomain(userId, expectedDomain) {
  const res = await mysqlConnection.executeQuery(`SELECT value FROM 1win.ma_users_meta WHERE id_user = ${userId} AND ma_users_meta.key = 'registration_domain';`);
  expect(res[0].value).toEqual(expectedDomain);
}
