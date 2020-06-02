/**
 * @jest-environment node
 */


import { partner } from '../../../src/methods/partner';
import { randomStr } from '../../../src/randomizer';
import { checkChatGreetingMessage } from '../../../src/expects/exPartner';

const defaultPass = '123123AA';
describe('Greeting message in support chat', () => {
  it('C2140380 New partner revshare RUB + RUS', async () => {
    const time = new Date();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const { cookie, info } = await partner.registerRevshare(partnerEmail, defaultPass, 'RUB');
    const chatMessages = await partner.getChatMessages(cookie);
    // console.log(chatMessages);
    checkChatGreetingMessage(chatMessages, info.user.id, time);
  });
  it('C2140381 New partner cpa USD + RUS', async () => {
    const time = new Date();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const { cookie, info } = await partner.registerCPA(partnerEmail, defaultPass, 'USD');
    const chatMessages = await partner.getChatMessages(cookie);
    // console.log(chatMessages);
    checkChatGreetingMessage(chatMessages, info.user.id, time);
  });
  it('C2140382 New partner hybrid EUR + RUS', async () => {
    const time = new Date();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const { cookie, info } = await partner.registerHybrid(partnerEmail, defaultPass, 'EUR');
    const chatMessages = await partner.getChatMessages(cookie);
    // console.log(chatMessages);
    checkChatGreetingMessage(chatMessages, info.user.id, time);
  });
  it('C2140383 New partner cpa RUB + ENG', async () => {
    const time = new Date();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const { cookie, info } = await partner.registerCPA(partnerEmail, defaultPass, 'RUB', 'en');
    const chatMessages = await partner.getChatMessages(cookie);
    // console.log(chatMessages);
    checkChatGreetingMessage(chatMessages, info.user.id, time);
  });
  it('C2140384 New partner hybrid USD + ENG', async () => {
    const time = new Date();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const { cookie, info } = await partner.registerHybrid(partnerEmail, defaultPass, 'USD', 'en');
    const chatMessages = await partner.getChatMessages(cookie);
    // console.log(chatMessages);
    checkChatGreetingMessage(chatMessages, info.user.id, time);
  });
  it('C2140385 New partner revshare EUR + ENG', async () => {
    const time = new Date();
    const partnerEmail = `${randomStr(10)}@ahem.email`;
    const { cookie, info } = await partner.registerRevshare(partnerEmail, defaultPass, 'EUR', '', 'en');
    const chatMessages = await partner.getChatMessages(cookie);
    // console.log(chatMessages);
    checkChatGreetingMessage(chatMessages, info.user.id, time);
  });
  it('C2140386 Old user does not have message', async () => {
    const { cookie } = await partner.login('partner_rub@ahem.email', defaultPass);
    const chatMessages = await partner.getChatMessages(cookie);
    // console.log(chatMessages);
    expect(JSON.stringify(chatMessages)).toEqual('[]');
  });
});
