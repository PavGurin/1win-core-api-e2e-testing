import { register } from '../../src/methods/register';
import { setUserBonusAmount } from '../../src/methods/user';
import { userList } from '../../src/methods/userList';

describe('Bonus amount tests', () => {
  it('C28628 (+) one click register rub, bonus_amount = 0 ', async () => {
    await register.oneClickReg(socket);
    const meta = await socket.userMeta;
    // console.log(meta);
    expect(meta.bonus_amount).toEqual(0);
  });

  it('C28629 (+) one click register usd, bonus_amount = 0 ', async () => {
    await register.oneClickRegUSD(socket);
    const meta = await socket.userMeta;
    // console.log(meta);
    expect(meta.bonus_amount).toEqual(0);
  });

  it('C28630 (+) one click register eur, bonus_amount = 0 ', async () => {
    await register.oneClickRegEUR(socket);
    const meta = await socket.userMeta;
    // console.log(meta);
    expect(meta.bonus_amount).toEqual(0);
  });

  it('C28631 (+) usual register, bonus_amount = 0', async () => {
    await register.usualReg(socket);
    const meta = await socket.userMeta;
    // console.log(meta);
    expect(meta.bonus_amount).toEqual(0);
  });

  it('C28632 (+) set bonus_amount 200 in db', async () => {
    const { data } = await register.oneClickReg(socket);
    await setUserBonusAmount(data.id, 200);
    await userList.loginWithParams(socket, data.email, data.password);
    const meta = await socket.userMeta;
    // console.log(meta);
    expect(meta.bonus_amount).toEqual(200);
  });

  it('C28633 (+) set bonus_amount 12345.67 in db', async () => {
    const { data } = await register.oneClickReg(socket);
    await setUserBonusAmount(data.id, 12345.67);
    await userList.loginWithParams(socket, data.email, data.password);
    const meta = await socket.userMeta;
    // console.log(meta);
    expect(meta.bonus_amount).toEqual(12345.67);
  });
});
