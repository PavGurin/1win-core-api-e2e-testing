import { checkMeta } from '../../src/expects/userMeta';
import { register } from '../../src/methods/register';


describe('C26424 - Get data about user from user.meta', () => {
  it('all expects', async () => {
    register.oneClickReg();
    const meta = await socket.userMeta;
    // console.log(meta);
    checkMeta(meta);
  });
});
