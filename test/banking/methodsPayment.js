import { register } from '../../src/methods/register';

describe('Deposit requests', () => {
  /* eslint no-console:off */
  beforeEach(async () => {
    await register.oneClickReg();
  });

  it('with incorrect hash ', async () => {
    const { data } = await socket.send('BANKING:methods-payment', { currency: 'EUR' });
    console.log(data);
    for (let i = 0; i < Object.values(data).length; i++) {
      console.log(`${Object.values(data)[i].name}\n${Object.values(data)[i].currency}\n${
        Object.values(data)[i].position}`);
      // console.log(Object.values(data)[i].currency);
      // console.log(Object.values(data)[i].position);
    }
  });

  it('2with incorrect hash ', async () => {
    const { data } = await socket.send('BANKING:methods-payment', { currency: 'RUB' });
    console.log(data);
    for (let i = 0; i < Object.values(data).length; i++) {
      console.log(`${Object.values(data)[i].name}\n${Object.values(data)[i].currency}\n${
        Object.values(data)[i].position}`);
      // console.log(Object.values(data)[i].currency);
      // console.log(Object.values(data)[i].position);
    }
  });
});
