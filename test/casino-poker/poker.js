import { casino } from '../../src/methods/casino';
import { checkErrMsg } from '../../src/responseChecker';
import { register } from '../../src/methods/register';
import { checkPoker } from '../../src/expects/exCasinoGame';

describe('Casino poker tests', () => {
  it('C2055257 (-) unauthorized', async () => {
    const { data } = await casino.getCubeia();
    // console.log(data);
    checkErrMsg(data, 500, 'Internal Server Error');
  });

  it('C2055258 (+) RUB user', async () => {
    await register.oneClickReg();
    const { data } = await casino.getCubeia();
    // console.log(data);
    checkPoker(data);
  });

  it('C2055259 (+) USD user', async () => {
    await register.oneClickRegUSD();
    const { data } = await casino.getCubeia();
    // console.log(data);
    checkPoker(data);
  });

  it('C2055260 (+) EUR user', async () => {
    await register.oneClickRegEUR();
    const { data } = await casino.getCubeia();
    // console.log(data);
    checkPoker(data);
  });

  it('C2055261 (+) UAH user', async () => {
    await register.oneClickRegUAH();
    const { data } = await casino.getCubeia();
    // console.log(data);
    checkPoker(data);
  });
});
