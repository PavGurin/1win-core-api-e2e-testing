import { userList } from '../../src/methods/userList';


describe('login.token', () => {
  it('login.token', async () => {
    const user = await userList.loginWithRealMoney();
    // console.log(user);
    const meta = await socket.loginToken;
    // console.log(meta);
  });
});
