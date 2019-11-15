import { userForAutoConfirm } from '../../../src/methods/userForAutoConfirm';
import { banking } from '../../../src/methods/banking';

describe('Transfer autoConfirm', () => {
  it('C27472 - (+) correct transfer from email = @mail.ru', async () => {
    await userForAutoConfirm.EmailMail();
    const { data } = await banking.transferCreateAll('lina.solodova.94@inbox.ru', 34, 'RUB');
    // console.log(data);
    expect(data.confirmationRequested).toEqual(false);
    expect(data.email).not.toBeNull();
  });

  it('C27474 - (+) correct transfer from email = @inbox.ru', async () => {
    await userForAutoConfirm.EmailInbox();
    const { data } = await banking.transferCreateAll('lina.solodova.94@mail.ru', 34, 'RUB');
    // console.log(data);
    expect(data.confirmationRequested).toEqual(false);
    expect(data.email).not.toBeNull();
  });

  it('C27475 - (+) correct transfer from email = @bk.ru', async () => {
    await userForAutoConfirm.EmailBk();
    const { data } = await banking.transferCreateAll('lina.solodova.94@list.ru', 34, 'RUB');
    // console.log(data);
    expect(data.confirmationRequested).toEqual(false);
    expect(data.email).not.toBeNull();
  });

  it('C27476 - (+) correct transfer from email = @list.ru', async () => {
    await userForAutoConfirm.EmailList();
    const { data } = await banking.transferCreateAll('lina.solodova.94@bk.ru', 34, 'RUB');
    // console.log(data);
    expect(data.confirmationRequested).toEqual(false);
    expect(data.email).not.toBeNull();
  });
});
