import { expect } from 'chai';
import { checkErrMsg } from '../../src/responseChecker';

describe('Register - Short schema w/o currency', () => {
  const defaultRequest = params => socket.send('USER:auth-register',
    {
      isShort: true,
      country: 'someCountry',
      timezone: 23,
      ...params,
    });
  const currency = 'RUB';


  // проверка ответа успешной регистрации
  function checkRegInfo(data) {
    // длина email при регистрации в 1 клик = 15 символам
    expect(data.email)
      .to.have.lengthOf(15);
    // длина пароля при регистрации в 1 клик = 6 символам
    expect(data.password)
      .to.have.lengthOf(6);
    expect(data.country)
      .to.equal('someCountry');
    expect(data.currency).equal(currency);
  }

  // register via short scheme with 'visit_domain' and 'PartnerKey'
  it('C19301 (+) with visit_domain with PartnerKey', async () => {
    const { data } = await defaultRequest({
      visit_domain: 'someDomain',
      partner_key: defaultPartnerKey,
    });
    // console.log(data);
    checkRegInfo(data);
  });

  it('C19302 (+) with visit domain w/o PartnerKey', async () => {
    const { data } = await defaultRequest({
      visit_domain: 'someDomain',
    });
    // console.log(data);
    checkRegInfo(data);
  });

  it('C19303 (+) w/o visit_domain with PartnerKey', async () => {
    const { data } = await defaultRequest({
      partner_key: defaultPartnerKey,
    });
    // console.log(data);
    checkRegInfo(data);
    expect(data.partner_key)
      .to.equal(defaultPartnerKey);
  });

  it('C19304 (-) w/o visit_domain w/o PartnerKey', async () => {
    // request without mandatory params
    const { data } = await defaultRequest();
    // console.log(data);
    expect(data.status)
      .to.equal(400);
  });
});

describe('Register - Short schema with currency', () => {
  const defaultRequest = params => socket.send('USER:auth-register',
    {
      isShort: true,
      country: 'someCountry',
      timezone: 23,
      ...params,
    });

  // проверка ответа успешной регистрации
  function checkRegInfo(data, currency) {
    // длина email при регистрации в 1 клик = 15 символам
    expect(data.email)
      .to.have.lengthOf(15);
    // длина пароля при регистрации в 1 клик = 6 символам
    expect(data.password)
      .to.have.lengthOf(6);
    expect(data.country)
      .to.equal('someCountry');
    expect(data.currency).equal(currency);
  }

  it('C27393 - (+) with visit_domain with PartnerKey + RUB', async () => {
    const { data } = await defaultRequest({
      currency: 'RUB',
      visit_domain: 'someDomain',
      partner_key: defaultPartnerKey,
    });
    // console.log(data);
    checkRegInfo(data, 'RUB');
  });

  it('C27394 - (+) with visit_domain with PartnerKey + EUR', async () => {
    const { data } = await defaultRequest({
      currency: 'EUR',
      visit_domain: 'someDomain',
      partner_key: defaultPartnerKey,
    });
    // console.log(data);
    checkRegInfo(data, 'EUR');
  });

  it('C27410 - (+) with visit_domain with PartnerKey + USD', async () => {
    const { data } = await defaultRequest({
      currency: 'USD',
      visit_domain: 'someDomain',
      partner_key: defaultPartnerKey,
    });
    // console.log(data);
    checkRegInfo(data, 'USD');
  });

  it('C27411 - (+) with visit_domain with PartnerKey + currency = null', async () => {
    const { data } = await defaultRequest({
      currency: null,
      visit_domain: 'someDomain',
      partner_key: defaultPartnerKey,
    });
    // console.log(data);
    checkRegInfo(data, 'RUB');
  });

  it('C27412 - (+) with visit_domain with PartnerKey + currency = not exist', async () => {
    const { data } = await defaultRequest({
      currency: 'RUL',
      visit_domain: 'someDomain',
      partner_key: defaultPartnerKey,
    });
    // console.log(data);
    checkErrMsg(data, 400, 'currency is invalid');
  });

  it('C27428 - (+) with visit_domain with PartnerKey + currency = number ', async () => {
    const { data } = await defaultRequest({
      currency: 123,
      visit_domain: 'someDomain',
      partner_key: defaultPartnerKey,
    });
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, currency should have a type of string, but found number');
  });

  it('C27429 (+) with visit_domain with PartnerKey + currency = undefined', async () => {
    const { data } = await defaultRequest({
      currency: undefined,
      visit_domain: 'someDomain',
      partner_key: defaultPartnerKey,
    });
    // console.log(data);
    checkRegInfo(data, 'RUB');
  });


  it('C27430 (+) with visit_domain with PartnerKey + currency = empty', async () => {
    const { data } = await defaultRequest({
      currency: '',
      visit_domain: 'someDomain',
      partner_key: defaultPartnerKey,
    });
    // console.log(data);
    checkErrMsg(data, 400, 'currency is invalid');
  });
});
