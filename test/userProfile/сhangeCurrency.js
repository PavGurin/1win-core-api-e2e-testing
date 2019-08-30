/* eslint camelcase: 'off' */
import { expect } from 'chai';
import { checkErrMsg } from '../../src/responseChecker';
import { register } from '../../src/methods/register';
import { getNewSocket } from '../global';
import { changeCurrency } from '../../src/methods/user';

describe('Change currency', () => {
  describe('Change currency when user have currency = rub', () => {
    let socket;

    beforeEach(async () => {
      socket = await getNewSocket();
      await register.oneClickReg(socket);
    });

    afterEach(() => socket.disconnect());

    it('C27441 - should be bad request, user have RUB yet ', async () => {
      const { data } = await changeCurrency('RUB', socket);
      // console.log(data);
      expect(data.currency).to.equal('RUB');
    });

    it('C27442 - should be bad request, unexist currency (string) ', async () => {
      const { data } = await changeCurrency('34', socket);

      checkErrMsg(data, 400, 'currency is invalid');
    });

    it('C27443 - should be bad request, unexist currency (number) ', async () => {
      const { data } = await changeCurrency(34, socket);

      checkErrMsg(data, 400, 'Bad request, currency should have a type of string, but found number');
    });

    it('C27444 - should be bad request, currency = empty ', async () => {
      const { data } = await changeCurrency('', socket);

      checkErrMsg(data, 400, 'currency is invalid');
    });

    it('C27445 - should be bad request, currency = null ', async () => {
      const { data } = await changeCurrency(null, socket);


      checkErrMsg(data, 400, 'Bad request, currency is required, no default value provided');
    });

    it('C27446 -should be bad request, without param currency ', async () => {
      const { data } = await changeCurrency(undefined, socket);

      checkErrMsg(data, 400, 'Bad request, currency is required, no default value provided');
    });

    it('C27447 - should be success with USD ', async () => {
      const { data } = await changeCurrency('USD', socket);

      // console.log(data);
      expect(data.currency).to.equal('USD');
    });

    it('C27448 - should be success with EUR ', async () => {
      const { data } = await changeCurrency('EUR', socket);


      expect(data.currency).to.equal('EUR');
    });
  });

  describe('Change currency when user have currency != rub', () => {
    let socket;

    beforeEach(async () => {
      socket = await getNewSocket();
    });

    afterEach(() => socket.disconnect());

    it('C27449 - should be success with RUB after reg one click with EUR', async () => {
      await register.oneClickRegEUR(socket);
      const { data } = await changeCurrency('RUB', socket);
      expect(data.currency).to.equal('RUB');
    });

    it('C27450 - should be success with EUR after reg one click with USD', async () => {
      await register.oneClickRegUSD(socket);
      // console.log(data1);
      const { data } = await changeCurrency('EUR', socket);

      // console.log(data);
      expect(data.currency).to.equal('EUR');
    });

    it('C27451 - should be success with RUB after reg usual with USD', async () => {
      await register.usualReg(socket);
      // console.log(data1);
      const { data } = await changeCurrency('EUR', socket);
      // console.log(data);
      expect(data.currency).to.equal('EUR');
    });
  });

  describe('Unauthorized', () => {
    it('C27440 - should be bad request without registration ', async () => {
      const { data } = await changeCurrency('RUB', socket);

      checkErrMsg(data, 400, 'Bad Request.');
    });
  });
});
