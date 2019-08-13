import { expect } from 'chai';
import { register } from '../../src/methods/register';
import { logOut } from '../../src/methods/user';

describe('Rules accepted tests', () => {
  beforeEach(async () => { await logOut(); });

  it('C28375 (+) rules_accepted = true after one click reg with rub', async () => {
    await register.oneClickReg();
    const meta = await socket.userMeta;
    // console.log(meta);
    expect(meta.rules_accepted).equal(true);
  });

  it('C28376 (+) rules_accepted = true after one click reg with usd', async () => {
    await register.oneClickRegUSD();
    const meta = await socket.userMeta;
    // console.log(meta);
    expect(meta.rules_accepted).equal(true);
  });

  it('C28377 (+) rules_accepted = true after one click reg with eur', async () => {
    await register.oneClickRegEUR();
    const meta = await socket.userMeta;
    // console.log(meta);
    expect(meta.rules_accepted).equal(true);
  });

  it('C28378 (+) rules_accepted = true after usual registration', async () => {
    await register.usualReg();
    const meta = await socket.userMeta;
    // console.log(meta);
    expect(meta.rules_accepted).equal(true);
  });
});
