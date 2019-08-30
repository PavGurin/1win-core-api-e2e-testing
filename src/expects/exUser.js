import { expect } from 'chai';

export function checkRegInfo(data, testText, testNumber, currency) {
  expect(data.email)
    .to.equal(`${testText}_test@xyz.com`);
  expect(data.password)
    .to.equal(defaultPassword);
  expect(data.phone)
    .to.equal(`921${testNumber}`);
  expect(data.name)
    .to.equal(testText);
  expect(data.country)
    .to.equal('ru');
  expect(data.currency).equal(currency);
}

// проверка ответа успешной регистрации
export function checkRegShortInfo(data, currency) {
  // длина email при регистрации в 1 клик = 15 символам
  expect(data.email)
    .to.have.lengthOf(15);
  // длина пароля при регистрации в 1 клик = 6 символам
  expect(data.password)
    .to.have.lengthOf(6);
  expect(data.country)
    .to.equal('ru');
  expect(data.currency).equal(currency);
  expect(data.partner_key)
    .to.equal(defaultPartnerKey);
}

export function checkSuccessRecovery(regData, recoveryReq) {
  expect(recoveryReq).to.be.an('object');
  expect(recoveryReq.userId).equal(regData.id);
  expect(recoveryReq.email).satisfies(email => email.startsWith(regData.email.substr(0, 2)))
    .and.satisfies(email => email.endsWith(regData.email.substr(5)));
}
