import { expect } from 'chai';
import { userForAutoConfirm } from '../../../src/methods/userForAutoConfirm';
import { banking } from '../../../src/methods/banking';

describe('Withdrawal autoConfirm', () => {
  it('C27477 - (+) correct withdrawal from email = @mail.ru', async () => {
    await userForAutoConfirm.EmailMail();
    const { data } = await banking.withdrawalCreate(100, '0000111122223333',
      'card_rub', 'RUB');
    // console.log(data);
    expect(data.confirmationRequested).equal(false);
    expect(data.email).not.equal(null);
  });

  it('C27478 - (+) correct withdrawal from email = @inbox.ru', async () => {
    await userForAutoConfirm.EmailInbox();
    const { data } = await banking.withdrawalCreate(100, '0000111122223333',
      'card_rub', 'RUB');
    // console.log(data);
    expect(data.confirmationRequested).equal(false);
    expect(data.email).not.equal(null);
  });

  it('C27479 - (+) correct withdrawal from email = @bk.ru', async () => {
    await userForAutoConfirm.EmailBk();
    const { data } = await banking.withdrawalCreate(100, '0000111122223333',
      'card_rub', 'RUB');
    // console.log(data);
    expect(data.confirmationRequested).equal(false);
    expect(data.email).not.equal(null);
  });

  it('C27480 - (+) correct withdrawal from email = @list.ru', async () => {
    await userForAutoConfirm.EmailList();
    const { data } = await banking.withdrawalCreate(100, '0000111122223333',
      'card_rub', 'RUB');
    // console.log(data);
    expect(data.confirmationRequested).equal(false);
    expect(data.email).not.equal(null);
  });
});
