import { userForAutoConfirm } from '../../../src/methods/userForAutoConfirm';
import { banking } from '../../../src/methods/banking';
import { cases } from '../../../src/methods/cases';

describe('Withdrawal autoConfirm', () => {
  it('C27477 - (+) correct withdrawal from email = @mail.ru', async () => {
    await userForAutoConfirm.EmailMail();
    await cases.playCaseWithoutChance(4);
    const { data } = await banking.withdrawalCreate('0000111122223333', 'card_rub', 'RUB', 100);
    // console.log(data);
    expect(data.confirmationRequested).toEqual(false);
    expect(data.email).not.toBeNull();
  });

  it('C27478 - (+) correct withdrawal from email = @inbox.ru', async () => {
    await userForAutoConfirm.EmailInbox();
    await cases.playCaseWithoutChance(4);
    const { data } = await banking.withdrawalCreate('0000111122223333', 'card_rub', 'RUB', 100);
    // console.log(data);
    expect(data.confirmationRequested).toEqual(false);
    expect(data.email).not.toBeNull();
  });

  it('C27479 - (+) correct withdrawal from email = @bk.ru', async () => {
    await userForAutoConfirm.EmailBk();
    await cases.playCaseWithoutChance(4);
    const { data } = await banking.withdrawalCreate('0000111122223333', 'card_rub', 'RUB', 100);
    // console.log(data);
    expect(data.confirmationRequested).toEqual(false);
    expect(data.email).toBeNull();
  });

  it('C27480 - (+) correct withdrawal from email = @list.ru', async () => {
    await userForAutoConfirm.EmailList();
    await cases.playCaseWithoutChance(4);
    const { data } = await banking.withdrawalCreate('0000111122223333', 'card_rub', 'RUB', 100);
    // console.log(data);
    expect(data.confirmationRequested).toEqual(false);
    expect(data.email).not.toBeNull();
  });
});
