import { register } from '../../src/methods/register';
import { history } from '../../src/methods/history';

describe('Casino history', () => {
  it(' (-) new user, try to open casino', async () => {
    await register.oneClickReg();
    const { data } = await history.category('casino');
    // console.log(data);
    expect(data.count).toBe(0);
    expect(data.items).toBeEmpty();
  });
});
