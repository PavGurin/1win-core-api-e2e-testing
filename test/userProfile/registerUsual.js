/* eslint camelcase: 'off' */
import { expect } from 'chai';
import { randomNum, randomStr } from '../../src/randomizer';
import { checkErrorMsg } from '../../src/responseChecker';

describe('Register -Usual schema', () => {
  const defaultRequest = params => socket.send('USER:auth-register',
    {
      isShort: false,
      country: 'someCountry',
      timezone: 23,
      birthday: 946587600000,
      ...params,
    });

  // проверка ответа успешной регистрации
  function checkRegInfo(data, testText, testNumber) {
    expect(data.email)
      .to.equal(`${testText}_test@xyz.com`);
    expect(data.password)
      .to.equal(defaultPassword);
    expect(data.phone)
      .to.equal(`921${testNumber}`);
    expect(data.name)
      .to.equal(testText);
    expect(data.country)
      .to.equal('someCountry');
  }

  // (+) for positive tests (-) for negative tests
  it('C19305 (+) + visit_domain + PartnerKey', async () => {
    const testStr = randomStr();
    const testNum = randomNum();

    const { data } = await defaultRequest({
      name: testStr,
      email: `${testStr}_test@xyz.com`,
      phone: `921${testNum}`,
      password: defaultPassword,
      repeat_password: defaultPassword,
      visit_domain: defaultVisitDomain,
      partner_key: defaultPartnerKey,
    });
    // console.log(data);
    checkRegInfo(data, testStr, testNum);
  });

  it('C19306 (+) + visit_domain - PartnerKey', async () => {
    const testStr = randomStr();
    const testNum = randomNum();

    const { data } = await defaultRequest({
      isShort: false,
      name: testStr,
      email: `${testStr}_test@xyz.com`,
      phone: `921${testNum}`,
      password: defaultPassword,
      repeat_password: defaultPassword,
      visit_domain: defaultVisitDomain,
    });
    // console.log(data);
    checkRegInfo(data, testStr, testNum);
  });

  it('C19307 (+) - visit_domain + PartnerKey', async () => {
    const testStr = randomStr();
    const testNum = randomNum();

    const { data } = await defaultRequest({
      isShort: false,
      name: testStr,
      email: `${testStr}_test@xyz.com`,
      phone: `921${testNum}`,
      password: defaultPassword,
      repeat_password: defaultPassword,
      partner_key: defaultPartnerKey,
    });
    // console.log(data);
    checkRegInfo(data, testStr, testNum);
  });

  it('C19308 (-) - visit_domain - PartnerKey', async () => {
    const { data } = await defaultRequest({
      isShort: false,
      name: randomStr(),
      email: `${randomStr()}test@xyz.com`,
      phone: `921${randomNum}`,
      password: defaultPassword,
      repeat_password: defaultPassword,
    });
    // console.log(data);
    checkErrorMsg(data, 'Visit domain is required if partner key does not specified');
  });

  it('C19309 (-) short name', async () => {
    const testStr = randomStr(2);
    const testNum = randomNum();

    const { data } = await defaultRequest({
      isShort: false,
      name: testStr,
      email: `${testStr}_test@xyz.com`,
      phone: `921${testNum}`,
      password: defaultPassword,
      repeat_password: defaultPassword,
      partner_key: defaultPartnerKey,
    });
    // console.log(data);
    checkErrorMsg(data, 'Name is invalid, it\'s length must be from 3 to 16 symbols');
  });

  it('C19310 (-) long name', async () => {
    const testStr = randomStr(17);
    const testNum = randomNum();

    const { data } = await defaultRequest({
      isShort: false,
      name: testStr,
      email: `${testStr}_test@xyz.com`,
      phone: `921${testNum}`,
      password: defaultPassword,
      repeat_password: defaultPassword,
      partner_key: defaultPartnerKey,
    });
    // console.log(data);
    checkErrorMsg(data, 'Name is invalid, it\'s length must be from 3 to 16 symbols');
  });

  it('C19311 (-) short phone number', async () => {
    const testStr = randomStr();

    const { data } = await defaultRequest({
      isShort: false,
      name: testStr,
      email: `${testStr}_test@xyz.com`,
      phone: randomStr(4),
      password: defaultPassword,
      repeat_password: defaultPassword,
      partner_key: defaultPartnerKey,
    });
    // console.log(data);
    checkErrorMsg(data, 'Phone is invalid, it\'s length must be from 5 to 30 symbols');
  });

  it('C19312 (-) long phone number', async () => {
    const testStr = randomStr();

    const { data } = await defaultRequest({
      isShort: false,
      name: testStr,
      email: `${testStr}_test@xyz.com`,
      phone: randomStr(31),
      password: defaultPassword,
      repeat_password: defaultPassword,
      partner_key: defaultPartnerKey,
    });
    // console.log(data);
    checkErrorMsg(data, 'Phone is invalid, it\'s length must be from 5 to 30 symbols');
  });

  it('C19313 (-) different passwords', async () => {
    const testStr = randomStr();
    const testNum = randomNum();

    const { data } = await defaultRequest({
      isShort: false,
      name: testStr,
      email: `${testStr}_test@xyz.com`,
      phone: `921${testNum}`,
      password: testStr,
      repeat_password: `${testStr}1`,
      partner_key: defaultPartnerKey,
    });
    // console.log(data);
    checkErrorMsg(data, 'Password confirmation not matches to password');
  });

  it('C19314 (-) short password', async () => {
    const testStr = randomStr(5);
    const testNum = randomNum();

    const { data } = await defaultRequest({
      isShort: false,
      name: testStr,
      email: `${testStr}_test@xyz.com`,
      phone: `921${testNum}`,
      password: testStr,
      repeat_password: testStr,
      partner_key: defaultPartnerKey,
    });
    // console.log(data);
    checkErrorMsg(data, 'Password is invalid, it\'s length must be from 6 to 18 symbols');
  });

  it('C19315 (-) long password', async () => {
    const testStr = randomStr(19);
    const testNum = randomNum();

    const { data } = await defaultRequest({
      isShort: false,
      name: randomStr(),
      email: `${randomStr()}_test@xyz.com`,
      phone: `921${testNum}`,
      password: testStr,
      repeat_password: testStr,
      partner_key: defaultPartnerKey,
    });
    // console.log(data);
    checkErrorMsg(data, 'Password is invalid, it\'s length must be from 6 to 18 symbols');
  });
});
