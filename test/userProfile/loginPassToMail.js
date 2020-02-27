/**
 * @jest-environment node
 */

import { register } from '../../src/methods/register';
import { sleep } from '../../src/methods/utils';
import { mail } from '../../src/methods/mail';
import { randomStr } from '../../src/randomizer';
import { sendUserDataToEmail } from '../../src/methods/user';
import { checkMailRequisites, checkMailTextLoginPass } from '../../src/expects/exMail';

describe.skip('Sending login and password to email after one click registration  //blocked cause message is not sent on staging', () => {
  it('C28154 - (+) Registration(RUB)', async () => {
    const { data } = await register.oneClickReg();
    const emailToSend = `${randomStr(10)}@ahem.email`;
    const { data: sendData } = await sendUserDataToEmail(emailToSend, data.email, data.password);
    expect(sendData.status).toEqual(200);
    await sleep(4000);
    const receivedMail = await mail.getMessage(emailToSend);
    checkMailRequisites(receivedMail, '1Win - Ваш аккаунт 1win', 'Info - 1Win', 'staging@fastmail.com');
    checkMailTextLoginPass(receivedMail.text, data.email, data.password);
  });
  it('C28155 - (+) Registration(USD) ', async () => {
    const { data } = await register.oneClickRegUSD();
    const emailToSend = `${randomStr(10)}@ahem.email`;
    const { data: sendData } = await sendUserDataToEmail(emailToSend, data.email, data.password);
    // console.log(sendData);
    expect(sendData.status).toEqual(200);
    await sleep(4000);
    const receivedMail = await mail.getMessage(emailToSend);
    checkMailRequisites(receivedMail, '1Win - Ваш аккаунт 1win', 'Info - 1Win', 'staging@fastmail.com');
    checkMailTextLoginPass(receivedMail.text, data.email, data.password);
  });
  it('C28156 - (+) Registration(EUR)', async () => {
    const { data } = await register.oneClickRegEUR();
    const emailToSend = `${randomStr(10)}@ahem.email`;
    const { data: sendData } = await sendUserDataToEmail(emailToSend, data.email, data.password);
    expect(sendData.status).toEqual(200);
    await sleep(4000);
    const receivedMail = await mail.getMessage(emailToSend);
    checkMailRequisites(receivedMail, '1Win - Ваш аккаунт 1win', 'Info - 1Win', 'staging@fastmail.com');
    checkMailTextLoginPass(receivedMail.text, data.email, data.password);
  });
});
