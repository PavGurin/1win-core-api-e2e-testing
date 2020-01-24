import { register } from '../../src/methods/register';

describe(' Get user data from from user.meta', () => {
  it('C26424 - all expects', async () => {
    register.oneClickReg();
    const meta = await socket.userMeta;
    // console.log(meta);
    expect(meta).toMatchSnapshot();
  });
});
