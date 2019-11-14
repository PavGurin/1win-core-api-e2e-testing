import { register } from '../../src/methods/register';
import { sleep } from '../../src/methods/utils';
import { mail } from '../../src/methods/mail';
import { randomStr } from '../../src/randomizer';
import { sendUserDataToEmail } from '../../src/methods/user';
import { checkMailRequisites, checkMailTextLoginPass } from '../../src/expects/exMail';
import { getNewSocket } from '../global';

describe('Send login and password to email after one click registration', () => {
  let socket;

  beforeEach(async () => {
    socket = await getNewSocket();
  });

  afterEach(() => socket.disconnect());
  it('C28154 - (+) login and password to email successful after register with RUB ', async () => {
    const { data } = await register.oneClickReg(socket);
    const emailToSend = `${randomStr(10)}@ahem.email`;
    const sendData = await sendUserDataToEmail(socket, emailToSend, data.email, data.password);
    expect(sendData.status).toEqual(200);
    await sleep(4000);
    const receivedMail = await mail.getMessage(emailToSend);
    checkMailRequisites(receivedMail, '1Win - Ваш аккаунт 1win', 'Info - 1Win', 'svnmsk@fastmail.com');
    checkMailTextLoginPass(receivedMail.text, data.email, data.password);
  });
  it('C28155 - (+) login and password to email successful after register with USD ', async () => {
    const { data } = await register.oneClickRegUSD(socket);
    const emailToSend = `${randomStr(10)}@ahem.email`;
    const sendData = await sendUserDataToEmail(socket, emailToSend, data.email, data.password);
    expect(sendData.status).toEqual(200);
    await sleep(4000);
    const receivedMail = await mail.getMessage(emailToSend);
    checkMailRequisites(receivedMail, '1Win - Ваш аккаунт 1win', 'Info - 1Win', 'svnmsk@fastmail.com');
    checkMailTextLoginPass(receivedMail.text, data.email, data.password);
  });
  it('C28156 - (+) login and password to email successful after register with EUR ', async () => {
    const { data } = await register.oneClickRegEUR(socket);
    const emailToSend = `${randomStr(10)}@ahem.email`;
    const sendData = await sendUserDataToEmail(socket, emailToSend, data.email, data.password);
    expect(sendData.status).toEqual(200);
    await sleep(4000);
    const receivedMail = await mail.getMessage(emailToSend);
    checkMailRequisites(receivedMail, '1Win - Ваш аккаунт 1win', 'Info - 1Win', 'svnmsk@fastmail.com');
    checkMailTextLoginPass(receivedMail.text, data.email, data.password);
  });
});
