import { userList } from '../../src/methods/userList';
import { checkMeta } from '../../src/expects/userMeta';


describe('C26424 - Get data about user from user.meta', () => {
  it('all expects', async () => {
    userList.loginWithRealMoney();
    const meta = await socket.userMeta;
    // console.log(meta);
    checkMeta(meta);
  });
});
