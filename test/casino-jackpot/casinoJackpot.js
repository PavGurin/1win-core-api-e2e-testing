import { checkJackpotValid, compareJackpot } from '../../src/expects/exCasinoGame';
import { register } from '../../src/methods/register';
import { sleep } from '../../src/methods/utils';

describe('Casino jackpot tests', () => {
  it('C1802172 - get jackpot, unregistered user', async () => {
    const jackpot = await socket.casinoJackpot;
    // console.log(jackpot);
    checkJackpotValid(jackpot);
  });

  it('C1802173 - get jackpot, registered user RUB', async () => {
    await register.oneClickReg();
    const jackpot = await socket.casinoJackpot;
    // console.log(jackpot);
    checkJackpotValid(jackpot);
  });

  it('C1802174 - get jackpot, registered user USD', async () => {
    await register.oneClickRegUSD();
    const jackpot = await socket.casinoJackpot;
    // console.log(jackpot);
    checkJackpotValid(jackpot);
  });

  it('C1802175 - get jackpot, registered user EUR', async () => {
    await register.oneClickRegEUR();
    const jackpot = await socket.casinoJackpot;
    // console.log(jackpot);
    checkJackpotValid(jackpot);
  });

  it('C1802176 - get jackpot, registered user UAH', async () => {
    await register.oneClickRegUAH();
    const jackpot = await socket.casinoJackpot;
    // console.log(jackpot);
    checkJackpotValid(jackpot);
  });

  it('C1802177 - jackpot value is updated after 10 seconds', async () => {
    const jackpot = await socket.casinoJackpot;
    // console.log(jackpot);
    await sleep(10000);
    const jackpot2 = await socket.casinoJackpot;
    // console.log(jackpot2);
    compareJackpot(jackpot, jackpot2, false);
  });

  it('C1802178 - jackpot value is not updated after less than 10 seconds', async () => {
    const jackpot = await socket.casinoJackpot;
    // console.log(jackpot);
    await sleep(5000);
    const jackpot2 = await socket.casinoJackpot;
    // console.log(jackpot2);
    compareJackpot(jackpot, jackpot2, true);
  });
});
