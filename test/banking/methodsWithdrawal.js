import { register } from '../../src/methods/register';

describe('Deposit requests', () => {
  beforeEach(async () => {
    await register.oneClickReg();
  });

  it('with incorrect hash ', async () => {
    const { data } = await socket.send('BANKING:methods-withdrawal', { currency: 'RUB' });
    // console.log(data);
    for (let i = 0; i < Object.values(data).length; i++) {
      console.log(`${Object.values(data)[i].name}\n${Object.values(data)[i].currency}\n${
        Object.values(data)[i].position}`);
      // console.log(Object.values(data)[i].currency);
      // console.log(Object.values(data)[i].position);
    }
  });
});
