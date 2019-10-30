import { userList } from '../../src/methods/userList';
import { register } from '../../src/methods/register';

describe('Balance get', () => {
  it('C19353 (+) Without money', async () => {
    await register.oneClickReg(socket);
    const { data } = await socket.send('BANKING:balance-get');
    // console.log(data);
    expect(data).toMatchSnapshot();
  });

  it('C19354 (+) With money rub ', async () => {
    await userList.loginWithRub(socket);
    const { data } = await socket.send('BANKING:balance-get');
    // console.log(data);
    expect(data['0'].balance).not.toEqual(0);
    expect(data['0'].currency).toEqual('RUB');
    expect(data['1'].balance).not.toEqual(0);
    expect(data['1'].currency).toEqual('USD');
    expect(data['2'].balance).toEqual(0);
    expect(data['2'].currency).toEqual('EUR');
  });

  it('C21429 (+) Balance USD, RUB, EUR > 0', async () => {
    await userList.loginWithRealMoney(socket);
    const { data } = await socket.send('BANKING:balance-get');
    // console.log(data);
    expect(data).toMatchSnapshot();
  });
});
