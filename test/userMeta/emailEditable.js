import { expect } from 'chai';
import { register } from '../../src/methods/register';
import { randomStr } from '../../src/randomizer';
import { logOut, updateProfile } from '../../src/methods/user';
import { mysqlConnection } from '../../src/methods/mysqlConnection';

describe('Email editable tests', () => {
  beforeEach(async () => { await logOut(); });

  it('C28369 (+) email_editable = true after one click reg with rub', async () => {
    await register.oneClickReg(socket);
    const meta = await socket.userMeta;
    // console.log(meta);
    expect(meta.email_editable).equal(true);
  });

  it('C28370 (+) email_editable = true after one click reg with usd', async () => {
    await register.oneClickRegUSD(socket);
    const meta = await socket.userMeta;
    // console.log(meta);
    expect(meta.email_editable).equal(true);
  });

  it('C28371 (+) email_editable = true after one click reg with eur', async () => {
    await register.oneClickRegEUR(socket);
    const meta = await socket.userMeta;
    // console.log(meta);
    expect(meta.email_editable).equal(true);
  });

  it('C28372 (+) email_editable = false after usual registration', async () => {
    await register.usualReg(socket);
    const meta = await socket.userMeta;
    // console.log(meta);
    expect(meta.email_editable).equal(false);
  });

  it('C28373 (+) email_editable = false after one click reg and change email', async () => {
    const { data } = await register.oneClickReg(socket);
    await updateProfile(socket, {
      email: `${randomStr(10)}@test.ru`,
      password: data.password,
    });

    // TODO понять почему не меняется socket.userMeta, пока проверка в бд
    // const meta = await socket.userMeta;
    // console.log(meta);
    // expect(meta.email_editable).equal(false);
    const res = await mysqlConnection.executeQuery(`SELECT value FROM 1win.ma_users_meta WHERE id_user = ${data.id} AND ma_users_meta.key = 'email_editable';`);
    expect(res[0].value).equal('0');
  });

  it('C28374 (-) email_editable = true after one click reg and not successful change email', async () => {
    const { data } = await register.oneClickReg(socket);
    await socket.send('USER:profile-update', {
      email: `${randomStr(10)}_@test.ru`,
      password: '',
    });
    // TODO понять почему не меняется socket.userMeta, пока проверка в бд
    // const meta = await socket.userMeta;
    // expect(meta.email_editable).equal(true);
    const res = await mysqlConnection.executeQuery(`SELECT value FROM 1win.ma_users_meta WHERE id_user = ${data.id} AND ma_users_meta.key = 'email_editable';`);
    expect(res[0].value).equal('true');
  });
});
