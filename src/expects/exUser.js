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
  expect(recoveryReq.email).satisfies(email => email.startsWith(regData.email.substr(0, 2)))
    .and.satisfies(email => email.endsWith(regData.email.substr(5)));
}
