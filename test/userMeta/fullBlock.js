import { register } from '../../src/methods/register';
import { setUserFullBlock } from '../../src/methods/user';
import { userList } from '../../src/methods/userList';
import { sleep } from '../../src/methods/utils';

describe('Full block tests', () => {
  describe('no full block', () => {
    it('C28640 (+) full_block = false by default', async () => {
      await register.oneClickReg();
      const meta = await socket.userMeta;
      // console.log(meta);
      expect(meta.full_block.initial).toEqual(false);
    });
  });

  describe('login with full_block', () => {
    it('C28641 (+) full_block = true in bd, login blocked', async () => {
      const { data } = await register.oneClickReg();
      await setUserFullBlock(data.id);
      const { data: login } = userList.loginWithParams(data.email, data.password);
      await sleep(2000);
      expect(login).toBeUndefined();
    });
  });
});
