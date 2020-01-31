import { register } from '../../src/methods/register';
import {
  getUserWithdrawalManualControl,
  setUserWithdrawalManualControl,
} from '../../src/methods/user';
import { userList } from '../../src/methods/userList';
import { banking } from '../../src/methods/banking';
import { usersWithManualControl } from '../../src/methods/usersWithBlockAndManualControl';


describe('Withdrawal manual control tests', () => {
  const BLOCKED_WALLET = '4775183475501655';

  describe('users without withdrawal_manual_control', () => {
    it('C28385 (+) withdrawal_manual_control = false by default', async () => {
      await register.oneClickReg();
      const meta = await socket.userMeta;
      // console.log(meta);
      expect(meta.withdrawal_manual_control).toEqual(false);
    });

    it('C28386 (+) withdrawal_manual_control = false when in db = true', async () => {
      const { data } = await register.usualReg();
      await setUserWithdrawalManualControl(data.id);
      await userList.loginWithParams(data.email, data.password);
      const meta = await socket.userMeta;
      // console.log(meta);
      expect(meta.withdrawal_manual_control).toEqual(false);
    });

    it('C28387 (+) withdrawal_manual_control = true in db after withdrawal to blocked wallet', async () => {
      const { data: user } = await register.usualReg();
      // console.log(currentUser.id);
      await banking.setBalance(user.id);
      await banking.withdrawalCreate(BLOCKED_WALLET, 'card_rub', 'RUB', 200);
      // console.log(withdrawal);

      expect(await getUserWithdrawalManualControl(user.id)).toEqual('true');
    });

    it('C28388 (+) withdrawal_manual_control = true in db after deposit from blocked wallet', async () => {
      const { data: user } = await register.usualReg();
      // console.log(currentUser.id);

      const { data: deposit } = await banking.depositCreate(BLOCKED_WALLET, 'card_rub', 'RUB', 200);
      expect(deposit.status).toEqual(500);
      expect(deposit.message).toEqual('Internal Server Error');
      // console.log(deposit);

      expect(await getUserWithdrawalManualControl(user.id)).toEqual('true');
    });
  });

  describe('withdrawal_manual_control = true + mail with auto confirm', () => {
    it('C28404 (+) withdrawal_manual_control = true + @mail withdrawal', async () => {
      const { data } = await usersWithManualControl.userMail();
      const { data: withdrawal } = await banking.withdrawalCreate('5698548963217458', 'card_rub', 'RUB', 100);
      // console.log(withdrawal);
      expect(withdrawal.confirmationRequested).toEqual(false);
      expect(await banking.getWithdrawalStatus(data.id)).toEqual(0);
    });

    it('C28405 (+) withdrawal_manual_control = true + @bk withdrawal', async () => {
      const { data } = await usersWithManualControl.userMail();
      const { data: withdrawal } = await banking.withdrawalCreate('5698548963217458', 'card_rub', 'RUB', 100);
      // console.log(withdrawal);
      expect(withdrawal.confirmationRequested).toEqual(false);
      expect(await banking.getWithdrawalStatus(data.id)).toEqual(0);
    });

    it('C28406 (+) withdrawal_manual_control = true + @inbox withdrawal', async () => {
      const { data } = await usersWithManualControl.userMail();
      await usersWithManualControl.userInbox();
      const { data: withdrawal } = await banking.withdrawalCreate('5698548963217458', 'card_rub', 'RUB', 100);
      // console.log(withdrawal);
      expect(withdrawal.confirmationRequested).toEqual(false);
      expect(await banking.getWithdrawalStatus(data.id)).toEqual(0);
    });

    it('C28407 (+) withdrawal_manual_control = true + @list withdrawal', async () => {
      const { data } = await usersWithManualControl.userMail();
      const { data: withdrawal } = await banking.withdrawalCreate('5698548963217458', 'card_rub', 'RUB', 100);
      // console.log(withdrawal);
      expect(withdrawal.confirmationRequested).toEqual(false);
      expect(await banking.getWithdrawalStatus(data.id)).toEqual(0);
    });
  });
});
