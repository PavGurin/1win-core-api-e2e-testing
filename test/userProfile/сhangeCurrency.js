/* eslint camelcase: 'off' */
import { checkErrMsg } from '../../src/responseChecker';
import { register } from '../../src/methods/register';
import { changeCurrency } from '../../src/methods/user';

describe('Change currency when user have currency = rub', () => {
  beforeEach(async () => {
    await register.oneClickReg();
  });

  it('C27441 - should be bad request, user have RUB yet ', async () => {
    const { data } = await changeCurrency('RUB');
    // console.log(data);
    expect(data.currency).toEqual('RUB');
  });

  it('C27442 - should be bad request, unexist currency (string) ', async () => {
    const { data } = await changeCurrency('34');

    checkErrMsg(data, 400, 'currency is invalid');
  });

  it('C27443 - should be bad request, unexist currency (number) ', async () => {
    const { data } = await changeCurrency(34);

    checkErrMsg(data, 400, 'Bad request, currency should have a type of string, but found number');
  });

  it('C27444 - should be bad request, currency = empty ', async () => {
    const { data } = await changeCurrency('');

    checkErrMsg(data, 400, 'currency is invalid');
  });

  it('C27445 - should be bad request, currency = null ', async () => {
    const { data } = await changeCurrency(null);


    checkErrMsg(data, 400, 'Bad request, currency is required, no default value provided');
  });

  it('C27446 -should be bad request, without param currency ', async () => {
    const { data } = await changeCurrency(undefined);

    checkErrMsg(data, 400, 'Bad request, currency is required, no default value provided');
  });

  it('C27447 - should be success with USD ', async () => {
    const { data } = await changeCurrency('USD');

    // console.log(data);
    expect(data.currency).toEqual('USD');
  });

  it('C27448 - should be success with EUR ', async () => {
    const { data } = await changeCurrency('EUR');

    // console.log(data);
    expect(data.currency).toEqual('EUR');
  });
});

describe('Change currency when user have currency != rub', () => {
  it('C27449 - should be success with RUB after reg one click with EUR', async () => {
    await register.oneClickRegEUR();
    const { data } = await changeCurrency('RUB');
    expect(data.currency).toEqual('RUB');
  });

  it('C27450 - should be success with EUR after reg one click with USD', async () => {
    await register.oneClickRegUSD();
    // console.log(data1);
    const { data } = await changeCurrency('EUR');

    // console.log(data);
    expect(data.currency).toEqual('EUR');
  });

  it('C27451 - should be success with RUB after reg usual with USD', async () => {
    await register.usualReg();
    // console.log(data1);
    const { data } = await changeCurrency('EUR');
    // console.log(data);
    expect(data.currency).toEqual('EUR');
  });
});
