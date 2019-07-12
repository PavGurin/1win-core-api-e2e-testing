/* eslint camelcase: 'off' */
import { expect } from 'chai';
import { checkErrMsg } from '../../src/responseChecker';
import { register } from '../../src/methods/register';

describe('Change currency', () => {
  it('C27440 - should be bad request without registration ', async () => {
    const { data } = await socket.send('USER:profile-changeCurrency', {
      currency: 'RUB',
    });

    checkErrMsg(data, 404, 'Bad request');
  });

  it('C27441 - should be bad request, user have RUB yet ', async () => {
    register.oneClickReg();
    const { data } = await socket.send('USER:profile-changeCurrency', {
      currency: 'RUB',
    });

    checkErrMsg(data, 404, 'Bad request');
  });

  it('C27442 - should be bad request, unexist currency (string) ', async () => {
    register.oneClickReg();
    const { data } = await socket.send('USER:profile-changeCurrency', {
      currency: '34',
    });

    checkErrMsg(data, 400, 'currency is invalid');
  });

  it('C27443 - should be bad request, unexist currency (number) ', async () => {
    register.oneClickReg();
    const { data } = await socket.send('USER:profile-changeCurrency', {
      currency: 34,
    });

    checkErrMsg(data, 400, 'Bad request, currency should have a type of string, but found number');
  });

  it('C27444 - should be bad request, currency = empty ', async () => {
    register.oneClickReg();
    const { data } = await socket.send('USER:profile-changeCurrency', {
      currency: '',
    });

    checkErrMsg(data, 400, 'currency is invalid');
  });

  it('C27445 - should be bad request, currency = null ', async () => {
    register.oneClickReg();
    const { data } = await socket.send('USER:profile-changeCurrency', {
      currency: null,
    });

    checkErrMsg(data, 400, 'Bad request, currency is required, no default value provided');
  });

  it('C27446 -should be bad request, without param currency ', async () => {
    register.oneClickReg();
    const { data } = await socket.send('USER:profile-changeCurrency', {
    });

    checkErrMsg(data, 400, 'Bad request, currency is required, no default value provided');
  });

  it('C27447 - should be success with USD ', async () => {
    register.oneClickReg();
    const { data } = await socket.send('USER:profile-changeCurrency', {
      currency: 'USD',
    });

    expect(data.currency).to.equal('USD');
  });

  it('C27448 - should be success with EUR ', async () => {
    register.oneClickReg();
    const { data } = await socket.send('USER:profile-changeCurrency', {
      currency: 'EUR',
    });

    expect(data.currency).to.equal('EUR');
  });

  it('C27449 - should be success with RUB after reg one click with EUR', async () => {
    await socket.send('USER:auth-register',
      {
        isShort: true,
        country: defaultCountry,
        timezone: 23,
        partner_key: 'autotests111',
        currency: 'EUR',
      });
    // console.log(data1);
    const { data } = await socket.send('USER:profile-changeCurrency', {
      currency: 'RUB',
    });
    // console.log(data);
    expect(data.currency).to.equal('RUB');
  });

  it('C27450 - should be success with EUR after reg one click with USD', async () => {
    await socket.send('USER:auth-register',
      {
        isShort: true,
        country: defaultCountry,
        timezone: 23,
        partner_key: 'autotests111',
        currency: 'USD',
      });
    // console.log(data1);
    const { data } = await socket.send('USER:profile-changeCurrency', {
      currency: 'EUR',
    });
    // console.log(data);
    expect(data.currency).to.equal('EUR');
  });

  it('C27451 - should be success with RUB after reg usual with USD', async () => {
    register.usualReg();
    // console.log(data1);
    const { data } = await socket.send('USER:profile-changeCurrency', {
      currency: 'EUR',
    });
    // console.log(data);
    expect(data.currency).to.equal('EUR');
  });
});
