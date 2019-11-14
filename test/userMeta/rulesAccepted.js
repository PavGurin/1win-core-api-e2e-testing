import { register } from '../../src/methods/register';

describe('Rules accepted tests', () => {
  it('C28375 (+) rules_accepted = true after one click reg with rub', async () => {
    await register.oneClickReg(socket);
    const meta = await socket.userMeta;
    // console.log(meta);
    expect(meta.rules_accepted).toEqual(true);
  });

  it('C28376 (+) rules_accepted = true after one click reg with usd', async () => {
    await register.oneClickRegUSD(socket);
    const meta = await socket.userMeta;
    // console.log(meta);
    expect(meta.rules_accepted).toEqual(true);
  });

  it('C28377 (+) rules_accepted = true after one click reg with eur', async () => {
    await register.oneClickRegEUR(socket);
    const meta = await socket.userMeta;
    // console.log(meta);
    expect(meta.rules_accepted).toEqual(true);
  });

  it('C28378 (+) rules_accepted = true after usual registration', async () => {
    await register.usualReg(socket);
    const meta = await socket.userMeta;
    // console.log(meta);
    expect(meta.rules_accepted).toEqual(true);
  });
});
