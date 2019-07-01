import { userList } from '../../src/methods/userList';
import { checkUserMeta } from '../../src/expects/userMeta';


describe('C26424 - Get data about user from user.meta', () => {
  it('all expects', async () => {
    userList.loginWithRealMoney();
    const data = await socket.userMeta;
    console.log(data);

    checkUserMeta(data, false, false, false,
      false, 0, true, false, true, false,
      true, false, false, 1);
  });
});
