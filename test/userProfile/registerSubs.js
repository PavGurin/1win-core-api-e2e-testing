/* eslint camelcase: 'off' */
import { expect } from 'chai';
import { randomNum, randomStr } from '../../src/randomizer';
import { dbSubIdCheck, emptyDbSubIdCheck } from '../../src/methods/dbSubIdCheck';
import { sleep } from '../../src/methods/utils';

describe('Register with sub id parameter', () => {
  const defaultRequest = params => socket.send('USER:auth-register',
    {
      isShort: false,
      country: 'someCountry',
      timezone: 23,
      birthday: 946587600000,
      ...params,
    });

  // проверка ответа успешной регистрации
  function checkRegInfo(data, testText, testNumber, currency) {
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
    expect(data.currency).equal(currency);
  }

  const visit_domain = 'some_domain';
  const partner_key = 'test001';

  // (+) for positive tests (-) for negative tests
  it('C20067 (+) Sub id 1', async () => {
    const testStr = randomStr();
    const testNum = randomNum();

    const { data } = await defaultRequest({
      name: testStr,
      sub_ids: 'sub1=sub_1',
      email: `${testStr}_test@xyz.com`,
      phone: `921${testNum}`,
      password: defaultPassword,
      repeat_password: defaultPassword,
      visit_domain,
      partner_key,
    });
    // console.log(data);
    checkRegInfo(data, testStr, testNum, 'RUB');
    await sleep(1000);
    await dbSubIdCheck(data.id, 'REGISTRATION', {
      sub1: 'sub_1',
      sub2: null,
      sub3: null,
      sub4: null,
      sub5: null,
    });
  });

  it('C20068 (+) Sub id 2', async () => {
    const testStr = randomStr();
    const testNum = randomNum();

    const { data } = await defaultRequest({
      name: testStr,
      sub_ids: 'sub2=sub_2',
      email: `${testStr}_test@xyz.com`,
      phone: `921${testNum}`,
      password: defaultPassword,
      repeat_password: defaultPassword,
      visit_domain,
      partner_key,
    });
    // console.log(data);
    checkRegInfo(data, testStr, testNum, 'RUB');
    await sleep(1000);
    await dbSubIdCheck(data.id, 'REGISTRATION', {
      sub1: null,
      sub2: 'sub_2',
      sub3: null,
      sub4: null,
      sub5: null,
    });
  });

  it('C20069 (+) Sub id 3', async () => {
    const testStr = randomStr();
    const testNum = randomNum();

    const { data } = await defaultRequest({
      name: testStr,
      sub_ids: 'sub3=sub_3',
      email: `${testStr}_test@xyz.com`,
      phone: `921${testNum}`,
      password: defaultPassword,
      repeat_password: defaultPassword,
      visit_domain,
      partner_key,
    });
    // console.log(data);
    checkRegInfo(data, testStr, testNum, 'RUB');
    await sleep(1000);
    await dbSubIdCheck(data.id, 'REGISTRATION', {
      sub1: null,
      sub2: null,
      sub3: 'sub_3',
      sub4: null,
      sub5: null,
    });
  });

  it('C20070 (+) Sub id 4', async () => {
    const testStr = randomStr();
    const testNum = randomNum();

    const { data } = await defaultRequest({
      name: testStr,
      sub_ids: 'sub4=sub_4',
      email: `${testStr}_test@xyz.com`,
      phone: `921${testNum}`,
      password: defaultPassword,
      repeat_password: defaultPassword,
      visit_domain,
      partner_key,
    });
    // console.log(data);
    checkRegInfo(data, testStr, testNum, 'RUB');
    await sleep(1000);
    await dbSubIdCheck(data.id, 'REGISTRATION', {
      sub1: null,
      sub2: null,
      sub3: null,
      sub4: 'sub_4',
      sub5: null,
    });
  });

  it('C20071 (+) Sub id 5', async () => {
    const testStr = randomStr();
    const testNum = randomNum();

    const { data } = await defaultRequest({
      name: testStr,
      sub_ids: 'sub5=sub_5',
      email: `${testStr}_test@xyz.com`,
      phone: `921${testNum}`,
      password: defaultPassword,
      repeat_password: defaultPassword,
      visit_domain,
      partner_key,
    });
    // console.log(data);
    checkRegInfo(data, testStr, testNum, 'RUB');
    await sleep(1000);
    await dbSubIdCheck(data.id, 'REGISTRATION', {
      sub1: null,
      sub2: null,
      sub3: null,
      sub4: null,
      sub5: 'sub_5',
    });
  });

  it('C20072 (+) All sub ids (from 1 to 5)', async () => {
    const testStr = randomStr();
    const testNum = randomNum();

    const { data } = await defaultRequest({
      name: testStr,
      sub_ids: 'sub1=sub_1&sub2=sub_2&sub3=sub_3&sub4=sub_4&sub5=sub_5',
      email: `${testStr}_test@xyz.com`,
      phone: `921${testNum}`,
      password: defaultPassword,
      repeat_password: defaultPassword,
      visit_domain,
      partner_key,
    });
    // console.log(data);
    checkRegInfo(data, testStr, testNum, 'RUB');
    await sleep(1000);
    await dbSubIdCheck(data.id, 'REGISTRATION', {
      sub1: 'sub_1',
      sub2: 'sub_2',
      sub3: 'sub_3',
      sub4: 'sub_4',
      sub5: 'sub_5',
    });
  });

  it('C20073 (+) Sub ids (1-3-5)', async () => {
    const testStr = randomStr();
    const testNum = randomNum();

    const { data } = await defaultRequest({
      name: testStr,
      sub_ids: 'sub1=sub_1&sub3=sub_3&sub5=sub_5',
      email: `${testStr}_test@xyz.com`,
      phone: `921${testNum}`,
      password: defaultPassword,
      repeat_password: defaultPassword,
      visit_domain,
      partner_key,
    });
    // console.log(data);
    checkRegInfo(data, testStr, testNum, 'RUB');
    await sleep(1000);
    await dbSubIdCheck(data.id, 'REGISTRATION', {
      sub1: 'sub_1',
      sub2: null,
      sub3: 'sub_3',
      sub4: null,
      sub5: 'sub_5',
    });
  });

  it('C20074 (+) Sub id with legal symbols', async () => {
    const testStr = randomStr();
    const testNum = randomNum();

    const { data } = await defaultRequest({
      name: testStr,
      sub_ids: 'sub1=_-',
      email: `${testStr}_test@xyz.com`,
      phone: `921${testNum}`,
      password: defaultPassword,
      repeat_password: defaultPassword,
      visit_domain,
      partner_key,
    });
    // console.log(data);
    checkRegInfo(data, testStr, testNum, 'RUB');
    await sleep(1000);
    await dbSubIdCheck(data.id, 'REGISTRATION', {
      sub1: '_-',
      sub2: null,
      sub3: null,
      sub4: null,
      sub5: null,
    });
  });

  it('C20075 (-) Sub id with rus language', async () => {
    const testStr = randomStr();
    const testNum = randomNum();

    const { data } = await defaultRequest({
      name: testStr,
      sub_ids: 'sub1=кириллица',
      email: `${testStr}_test@xyz.com`,
      phone: `921${testNum}`,
      password: defaultPassword,
      repeat_password: defaultPassword,
      visit_domain,
      partner_key,
    });
    // console.log(data);
    checkRegInfo(data, testStr, testNum, 'RUB');
    await sleep(1000);
    await emptyDbSubIdCheck(data.id, 'REGISTRATION');
  });

  it('C20076 (-) Sub id with illegal symbols', async () => {
    const testStr = randomStr();
    const testNum = randomNum();

    const { data } = await defaultRequest({
      name: testStr,
      sub_ids: 'sub1=/?*= +|`~±§^',
      email: `${testStr}_test@xyz.com`,
      phone: `921${testNum}`,
      password: defaultPassword,
      repeat_password: defaultPassword,
      visit_domain,
      partner_key,
    });
    // console.log(data);
    checkRegInfo(data, testStr, testNum, 'RUB');
    await sleep(1000);
    await emptyDbSubIdCheck(data.id, 'REGISTRATION');
  });

  // shouldn't be saved
  it('C20484 (-) Sub id with legal and illegal symbols', async () => {
    const testStr = randomStr();
    const testNum = randomNum();

    const { data } = await defaultRequest({
      name: testStr,
      sub_ids: 'sub1=-_=&sub2=?*^',
      email: `${testStr}_test@xyz.com`,
      phone: `921${testNum}`,
      password: defaultPassword,
      repeat_password: defaultPassword,
      visit_domain,
      partner_key,
      currency: 'USD',
    });
    // console.log(data);
    checkRegInfo(data, testStr, testNum, 'USD');
    await sleep(1000);
    await emptyDbSubIdCheck(data.id, 'REGISTRATION');
  });

  // sub1 should be saved, sub2 and sub3 shouldn't
  it('C20485 (+) Legal sub1 + illegal sub2 + mixed sub3', async () => {
    const testStr = randomStr();
    const testNum = randomNum();

    const { data } = await defaultRequest({
      name: testStr,
      sub_ids: 'sub1=legal&sub2=?*^&sub3=^mixed^',
      email: `${testStr}_test@xyz.com`,
      phone: `921${testNum}`,
      password: defaultPassword,
      repeat_password: defaultPassword,
      visit_domain,
      partner_key,
      currency: 'EUR',
    });
    // console.log(data);
    checkRegInfo(data, testStr, testNum, 'EUR');
    await sleep(1000);
    await dbSubIdCheck(data.id, 'REGISTRATION', {
      sub1: 'legal',
      sub2: null,
      sub3: null,
      sub4: null,
      sub5: null,
    });
  });

  it('C20486 (+) Sub with 500+ length', async () => {
    const testStr = randomStr();
    const testNum = randomNum();
    const subId1 = randomStr(505);

    const { data } = await defaultRequest({
      name: testStr,
      sub_ids: `sub1=${subId1}`,
      email: `${testStr}_test@xyz.com`,
      phone: `921${testNum}`,
      password: defaultPassword,
      repeat_password: defaultPassword,
      visit_domain,
      partner_key,
      currency: 'USD',
    });
    // console.log(data);
    checkRegInfo(data, testStr, testNum, 'USD');
    await sleep(1000);
    await dbSubIdCheck(data.id, 'REGISTRATION', {
      sub1: (subId1.slice(0, 128)),
      sub2: null,
      sub3: null,
      sub4: null,
      sub5: null,
    });
  });
});
