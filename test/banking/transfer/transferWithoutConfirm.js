import { userForAutoConfirm } from '../../../src/methods/userForAutoConfirm';
import { banking } from '../../../src/methods/banking';
import { getNewSocket } from '../../global';

describe('Transfer autoConfirm', () => {
  let socket;

  beforeEach(async () => { socket = await getNewSocket(); });

  it('C27472 - (+) correct transfer from email = @mail.ru', async () => {
    await userForAutoConfirm.EmailMail(socket);
    const { data } = await banking.transferCreateAll(socket, 'lina.solodova.94@inbox.ru', 34, 'RUB');
    // console.log(data);
    expect(data.confirmationRequested).toEqual(false);
    expect(data.email).not.toBeNull();
  });

  it('C27474 - (+) correct transfer from email = @inbox.ru', async () => {
    await userForAutoConfirm.EmailInbox(socket);
    const { data } = await banking.transferCreateAll(socket, 'lina.solodova.94@mail.ru', 34, 'RUB');
    // console.log(data);
    expect(data.confirmationRequested).toEqual(false);
    expect(data.email).not.toBeNull();
  });

  it('C27475 - (+) correct transfer from email = @bk.ru', async () => {
    await userForAutoConfirm.EmailBk(socket);
    const { data } = await banking.transferCreateAll(socket, 'lina.solodova.94@list.ru', 34, 'RUB');
    // console.log(data);
    expect(data.confirmationRequested).toEqual(false);
    expect(data.email).not.toBeNull();
  });

  it('C27476 - (+) correct transfer from email = @list.ru', async () => {
    await userForAutoConfirm.EmailList(socket);
    const { data } = await banking.transferCreateAll(socket, 'lina.solodova.94@bk.ru', 34, 'RUB');
    // console.log(data);
    expect(data.confirmationRequested).toEqual(false);
    expect(data.email).not.toBeNull();
  });
});
