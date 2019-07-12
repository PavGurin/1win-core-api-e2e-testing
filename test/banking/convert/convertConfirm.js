import { expect } from 'chai';
import { userList } from '../../../src/methods/userList';
import { checkErrMsg } from '../../../src/responseChecker';
import { banking, cbCurrency } from '../../../src/methods/banking';
import { mail } from '../../../src/methods/mail';
import { logOut } from '../../../src/methods/user';
import { sleep } from '../../../src/methods/utils';

describe.skip('Сonvert confirm', () => {
  let receivedMail = {};
  const balance = {};

  beforeEach(async () => {
    const loginData = await userList.loginWithMailConfirmationCodes();
    // TODO нужны функции для проверки баланса в долларах и евро и сохранять его в balance
    balance.rub = await banking.balanceCheck();

    const convertData = banking.convertCreate('1.59', 'USD', 'RUB');
    // TODO посмотреть что приходит
    console.log(convertData);
    receivedMail = await mail.getMessage(loginData.data.email);
    // TODO проверить что приходит в subject
    console.log(receivedMail);
    expect(receivedMail.subject).to.equal('1Win - Подтверждение конвертации');
    expect(receivedMail.from_name).to.equal('Confirmation - 1Win');
    expect(receivedMail.from_address).to.equal('confirmation@fbet.top');
  });

  afterEach(async () => { await logOut(); });

  it('C27124 (+) Сorrect code', async () => {
    // const confirmData = await socket.send('BANKING:convert-confirm',
    // { code: receivedMail.code });
    // console.log(confirmData);
    // expect(confirmData.status).to.equal(200);
    // expect(confirmData.data.id).to.exist;
  });

  it('C19352 (-) Incorrect code', async () => {
    const confirmData = await socket.send('BANKING:convert-confirm', { code: receivedMail.code + 1 });
    // console.log(data);
    checkErrMsg(confirmData.data, 400, 'Неверный ключ запроса');
  });

  it(' (-) Active code of other user', async () => {
    await logOut();
    await userList.loginWithRealMoney();
    await banking.convertCreate(100, 'RUB',
      'card_rub', 'USD');
    const confirmData = await socket.send('BANKING:convert-confirm', { code: receivedMail.code });
    // console.log(confirmData);
    expect(confirmData.status).to.equal(200);
    checkErrMsg(confirmData.data, 403, 'Выплата не найдена');
  });

  it(' (-) Expired code', async () => {
    // пока падает по таймауту
    // надо ждать 5 минут (300 000 мс), а у нас в настройках задан таймаут 10000 мс
    // Error: Timeout of 10000ms exceeded.

    // задержка в 5 минут, чтобы код протух
    await sleep(300000);
    const confirmData = await socket.send('BANKING:convert-confirm', { code: receivedMail.code });
    // console.log(confirmData);
    expect(confirmData.status).to.equal(200);
    // checkErrMsg(confirmData.data, 404, 'Выплата не найдена');
  });

  it(' (-) Second confirmation with the same code', async () => {
    // первое подтверждение
    const confirmData = await socket.send('BANKING:convert-confirm', { code: receivedMail.code });
    // console.log(confirmData);
    expect(confirmData.status).to.equal(200);
    expect(confirmData.data.id).to.exist;

    // второе подтверждение
    const confirmData2 = await socket.send('BANKING:convert-confirm', { code: receivedMail.code });
    // console.log(confirmData2);
    expect(confirmData2.status).to.equal(200);
    checkErrMsg(confirmData2.data, 403, 'Выплата не найдена');
  });

  // TODO доделать все тесты ниже и добавить ТК
  it(' (-) Active code of other operation that was obtained after convert code', async () => {
    await banking.transferCreate(20, 'RUB');
    const recMail = await mail.getMessage('confirmation_codes_user@ahem.email');
    const confirmData = await socket.send('BANKING:convert-confirm', { code: recMail.code });
    expect(confirmData.status).to.equal(200);
    console.log(confirmData);
    // checkErrMsg(confirmData.data, 400, 'Неверный ключ запроса');
  });

  it(' (-) Active code of other convert of this user', async () => {});

  it(' (-) Active code of other operation that was obtained before withdrawal code', async () => {});

  it('C (+) Balance checking after successful convert', async () => {
    const loginData = await userList.loginWithMailConfirmationCodes();
    const convertData = await banking.convertCreate(100, 'RUB', 'USD');
    const a = await cbCurrency('USD');
    console.log(a);
  });

  it(' (-) Balance checking after not successful convert', async () => {
  });
});
