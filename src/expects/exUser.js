import { mysqlConnection } from '../methods/mysqlConnection';

export function checkRegInfo(data, testText, testNumber, currency) {
  expect(data.email)
    .toEqual(`${testText}_test@xyz.com`);
  expect(data.password)
    .toEqual(defaultPassword);
  expect(data.phone)
    .toEqual(`921${testNumber}`);
  expect(data.name)
    .toEqual(testText);
  expect(data.country)
    .toEqual('ru');
  expect(data.currency).toEqual(currency);
}

// проверка ответа успешной регистрации
export function checkRegShortInfo(data, currency) {
  // длина email при регистрации в 1 клик = 15 символам
  expect(data.email)
    .toHaveLength(15);
  // длина пароля при регистрации в 1 клик = 6 символам
  expect(data.password)
    .toHaveLength(6);
  expect(data.country)
    .toEqual('ru');
  expect(data.currency).toEqual(currency);
  expect(data.partner_key)
    .toEqual(defaultPartnerKey);
}

export function checkSuccessRecovery(regData, recoveryReq) {
  expect(recoveryReq).toBeObject('object');
  expect(recoveryReq.userId).toEqual(regData.id);
}

export async function checkPwaBonus(userId, expectedBonusAmount, expectedPwaInstalled = 'true') {
  const meta = {};
  const res = await mysqlConnection.executeQuery(`select * from 1win.ma_users_meta where id_user = '${userId}'`);
  res.forEach((row) => {
    meta[`${row.key}`] = row.value;
  });
  // console.log(meta);
  if (expectedPwaInstalled) {
    expect(meta.pwa_installed).toEqual(expectedPwaInstalled);
  } else {
    expect(meta.pwa_installed).toBeUndefined();
  }
  if (expectedBonusAmount) {
    expect(meta.pwa_bonus_gained).toEqual('true');
    expect(meta.bonus_amount).toEqual(expectedBonusAmount.toString());
  } else {
    expect(meta.pwa_bonus_gained).toBeUndefined();
    expect(meta.bonus_amount).toBeUndefined();
  }
}
