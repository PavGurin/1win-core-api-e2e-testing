import { expect } from 'chai';
import { register } from '../../src/methods/register';

describe('Registration 1 click', () => {
  it('Reg ', async () => {
    const user = await register.oneClickRegUSD();
    // console.log(user);
    expect(user.status).equal(200);
  });
});
