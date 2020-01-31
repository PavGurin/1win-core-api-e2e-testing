import { register } from '../../src/methods/register';
import { history } from '../../src/methods/history';
import { banking } from '../../src/methods/banking';
import { checkHistoryDeposit } from '../../src/expects/exHistory';
import { checkErrMsg } from '../../src/responseChecker';
import { userList } from '../../src/methods/userList';

describe('Deposits history', () => {
  describe('No deposits', () => {
    it('C1789747 (-) new user, try to open deposits', async () => {
      await register.oneClickReg();
      const { data } = await history.category('deposits');
      // console.log(data);
      expect(data.count).toBe(0);
      expect(data.items).toBeEmpty();
    });
  });

  describe('One deposit', () => {
    it('C1789748 (+) user with one successful deposit: card + RUB', async () => {
      const currency = 'RUB';
      const amount = 123.45;
      const paymentSystem = 'card_rub';
      const wallet = '5520718827238343';
      const status = 1;
      const time = new Date();
      const { data: user } = await register.oneClickReg();
      await banking.createDepositInBD(user.id, currency, amount, time, paymentSystem, wallet, status, 'payterra');
      const { data } = await history.category('deposits');
      // console.log(data);
      checkHistoryDeposit(data, amount, currency, paymentSystem, `${wallet.slice(0, 3)}**********${wallet.slice(13)}`, status, time);
    });

    it('C1789749 (+) user with one successful deposit: beeline + RUB', async () => {
      const currency = 'RUB';
      const amount = 78.96;
      const paymentSystem = 'beeline_rub';
      const wallet = '+79068963322';
      const status = 1;
      const time = new Date();
      const { data: user } = await register.oneClickReg();
      await banking.createDepositInBD(user.id, currency, amount, time, paymentSystem, wallet, status, 'payterra');
      const { data } = await history.category('deposits');
      // console.log(data);
      checkHistoryDeposit(data, amount, currency, paymentSystem, `${wallet.slice(1, 3)}*****${wallet.slice(8)}`, status, time);
    });

    it('C1789750 (+) user with one successful deposit: btc + RUB', async () => {
      const currency = 'RUB';
      const amount = 2111.14;
      const paymentSystem = 'btc_usd';
      const wallet = '213514684153216541';
      const status = 1;
      const time = new Date();
      const { data: user } = await register.oneClickReg();
      await banking.createDepositInBD(user.id, currency, amount, time, paymentSystem, wallet, status, 'payterra');
      const { data } = await history.category('deposits');
      // console.log(data);
      checkHistoryDeposit(data, amount, currency, paymentSystem, `${wallet.slice(0, 3)}************${wallet.slice(15)}`, status, time);
    });

    it('C1789751 (+) user with one successful deposit: eth + RUB', async () => {
      const currency = 'RUB';
      const amount = 5555.33;
      const paymentSystem = 'eth_usd';
      const wallet = '213514684153216541';
      const status = 1;
      const time = new Date();
      const { data: user } = await register.oneClickReg();
      await banking.createDepositInBD(user.id, currency, amount, time, paymentSystem, wallet, status, 'payterra');
      const { data } = await history.category('deposits');
      // console.log(data);
      checkHistoryDeposit(data, amount, currency, paymentSystem, `${wallet.slice(0, 3)}************${wallet.slice(15)}`, status, time);
    });

    it('C1789752 (+) user with one successful deposit: megafon + RUB', async () => {
      const currency = 'RUB';
      const amount = 78.96;
      const paymentSystem = 'megafon_rub';
      const wallet = '+79278963322';
      const status = 1;
      const time = new Date();
      const { data: user } = await register.oneClickReg();
      await banking.createDepositInBD(user.id, currency, amount, time, paymentSystem, wallet, status, 'payterra');
      const { data } = await history.category('deposits');
      // console.log(data);
      checkHistoryDeposit(data, amount, currency, paymentSystem, `${wallet.slice(1, 3)}*****${wallet.slice(8)}`, status, time);
    });

    it('C1789753 (+) user with one successful deposit: mts + RUB', async () => {
      const currency = 'RUB';
      const amount = 78.96;
      const paymentSystem = 'mts_rub';
      const wallet = '+79118963322';
      const status = 1;
      const time = new Date();
      const { data: user } = await register.oneClickReg();
      await banking.createDepositInBD(user.id, currency, amount, time, paymentSystem, wallet, status, 'payterra');
      const { data } = await history.category('deposits');
      // console.log(data);
      checkHistoryDeposit(data, amount, currency, paymentSystem, `${wallet.slice(1, 3)}*****${wallet.slice(8)}`, status, time);
    });

    it('C1789754 (+) user with one successful deposit: tele2 + RUB', async () => {
      const currency = 'RUB';
      const amount = 78.96;
      const paymentSystem = 'tele2_rub';
      const wallet = '+79608963322';
      const status = 1;
      const time = new Date();
      const { data: user } = await register.oneClickReg();
      await banking.createDepositInBD(user.id, currency, amount, time, paymentSystem, wallet, status, 'payterra');
      const { data } = await history.category('deposits');
      // console.log(data);
      checkHistoryDeposit(data, amount, currency, paymentSystem, `${wallet.slice(1, 3)}*****${wallet.slice(8)}`, status, time);
    });

    it('C1789755 (+) user with one successful deposit: qiwi + RUB', async () => {
      const currency = 'RUB';
      const amount = 78.96;
      const paymentSystem = 'qiwi_rub';
      const wallet = '+79278963322';
      const status = 1;
      const time = new Date();
      const { data: user } = await register.oneClickReg();
      await banking.createDepositInBD(user.id, currency, amount, time, paymentSystem, wallet, status, 'payterra');
      const { data } = await history.category('deposits');
      // console.log(data);
      checkHistoryDeposit(data, amount, currency, paymentSystem, `${wallet.slice(1, 3)}*****${wallet.slice(8)}`, status, time);
    });

    it('C1789756 (+) user with one successful deposit: yamoney + RUB', async () => {
      const currency = 'RUB';
      const amount = 569;
      const paymentSystem = 'yamoney_rub';
      const wallet = '1231wehju23y7tye';
      const status = 1;
      const time = new Date();
      const { data: user } = await register.oneClickReg();
      await banking.createDepositInBD(user.id, currency, amount, time, paymentSystem, wallet, status, 'payterra');
      const { data } = await history.category('deposits');
      // console.log(data);
      checkHistoryDeposit(data, amount, currency, paymentSystem, `${wallet.slice(0, 3)}**********${wallet.slice(13)}`, status, time);
    });

    it('C1789757 (+) user with one successful deposit: piastrix + RUB', async () => {
      const currency = 'RUB';
      const amount = 1368;
      const paymentSystem = 'piastrix_rub';
      const wallet = '254rer345tge645';
      const status = 1;
      const time = new Date();
      const { data: user } = await register.oneClickReg();
      await banking.createDepositInBD(user.id, currency, amount, time, paymentSystem, wallet, status, 'payterra');
      const { data } = await history.category('deposits');
      // console.log(data);
      checkHistoryDeposit(data, amount, currency, paymentSystem, `${wallet.slice(0, 3)}*********${wallet.slice(12)}`, status, time);
    });

    it('C1789758 (+) user with pending deposit', async () => {
      const currency = 'RUB';
      const amount = 123.45;
      const paymentSystem = 'card_rub';
      const wallet = '5520718827238343';
      const status = 0;
      const time = new Date();
      const { data: user } = await register.oneClickReg();
      await banking.createDepositInBD(user.id, currency, amount, time, paymentSystem, wallet, status, 'payterra');
      const { data } = await history.category('deposits');
      // console.log(data);
      checkHistoryDeposit(data, amount, currency, paymentSystem, `${wallet.slice(0, 3)}**********${wallet.slice(13)}`, status, time);
    });

    it('C1789759 (+) user with not successful deposit', async () => {
      const currency = 'RUB';
      const amount = 123.45;
      const paymentSystem = 'card_rub';
      const wallet = '5520718827238343';
      const status = 2;
      const time = new Date();
      const { data: user } = await register.oneClickReg();
      await banking.createDepositInBD(user.id, currency, amount, time, paymentSystem, wallet, status, 'payterra');
      const { data } = await history.category('deposits');
      // console.log(data);
      checkHistoryDeposit(data, amount, currency, paymentSystem, `${wallet.slice(0, 3)}**********${wallet.slice(13)}`, status, time);
    });

    it('C1789760 (+) user with one successful deposit: card + USD', async () => {
      const currency = 'USD';
      const amount = 123.45;
      const paymentSystem = 'card';
      const wallet = '5520718827238343';
      const status = 1;
      const time = new Date();
      const { data: user } = await register.oneClickReg();
      await banking.createDepositInBD(user.id, currency, amount, time, paymentSystem, wallet, status, 'payterra');
      const { data } = await history.category('deposits');
      // console.log(data);
      checkHistoryDeposit(data, amount, currency, paymentSystem, `${wallet.slice(0, 3)}**********${wallet.slice(13)}`, status, time);
    });

    it('C1789761 (+) user with one successful deposit: qiwi + USD', async () => {
      const currency = 'USD';
      const amount = 78.96;
      const paymentSystem = 'qiwi_usd';
      const wallet = '79278963322';
      const status = 1;
      const time = new Date();
      const { data: user } = await register.oneClickReg();
      await banking.createDepositInBD(user.id, currency, amount, time, paymentSystem, wallet, status, 'payterra');
      const { data } = await history.category('deposits');
      // console.log(data);
      checkHistoryDeposit(data, amount, currency, paymentSystem, `${wallet.slice(0, 2)}*****${wallet.slice(7)}`, status, time);
    });

    it('C1789762 (+) user with one successful deposit: btc + USD', async () => {
      const currency = 'USD';
      const amount = 2111.14;
      const paymentSystem = 'btc_usd';
      const wallet = '213514684153216541';
      const status = 1;
      const time = new Date();
      const { data: user } = await register.oneClickReg();
      await banking.createDepositInBD(user.id, currency, amount, time, paymentSystem, wallet, status, 'payterra');
      const { data } = await history.category('deposits');
      // console.log(data);
      checkHistoryDeposit(data, amount, currency, paymentSystem, `${wallet.slice(0, 3)}************${wallet.slice(15)}`, status, time);
    });

    it('C1789763 (+) user with one successful deposit: eth + USD', async () => {
      const currency = 'USD';
      const amount = 5555.33;
      const paymentSystem = 'eth_usd';
      const wallet = '213514684153216541';
      const status = 1;
      const time = new Date();
      const { data: user } = await register.oneClickReg();
      await banking.createDepositInBD(user.id, currency, amount, time, paymentSystem, wallet, status, 'payterra');
      const { data } = await history.category('deposits');
      // console.log(data);
      checkHistoryDeposit(data, amount, currency, paymentSystem, `${wallet.slice(0, 3)}************${wallet.slice(15)}`, status, time);
    });

    it('C1789764 (+) user with one successful deposit: card + EUR', async () => {
      const currency = 'EUR';
      const amount = 123.45;
      const paymentSystem = 'card';
      const wallet = '5520718827238343';
      const status = 1;
      const time = new Date();
      const { data: user } = await register.oneClickReg();
      await banking.createDepositInBD(user.id, currency, amount, time, paymentSystem, wallet, status, 'payterra');
      const { data } = await history.category('deposits');
      // console.log(data);
      checkHistoryDeposit(data, amount, currency, paymentSystem, `${wallet.slice(0, 3)}**********${wallet.slice(13)}`, status, time);
    });

    it('C1789765 (+) user with one successful deposit: qiwi + EUR', async () => {
      const currency = 'EUR';
      const amount = 78.96;
      const paymentSystem = 'qiwi_eur';
      const wallet = '79278963322';
      const status = 1;
      const time = new Date();
      const { data: user } = await register.oneClickReg();
      await banking.createDepositInBD(user.id, currency, amount, time, paymentSystem, wallet, status, 'payterra');
      const { data } = await history.category('deposits');
      // console.log(data);
      checkHistoryDeposit(data, amount, currency, paymentSystem, `${wallet.slice(0, 2)}*****${wallet.slice(7)}`, status, time);
    });

    it('C1789766 (+) user with one successful deposit: btc + EUR', async () => {
      const currency = 'EUR';
      const amount = 2111.14;
      const paymentSystem = 'btc_usd';
      const wallet = '213514684153216541';
      const status = 1;
      const time = new Date();
      const { data: user } = await register.oneClickReg();
      await banking.createDepositInBD(user.id, currency, amount, time, paymentSystem, wallet, status, 'payterra');
      const { data } = await history.category('deposits');
      // console.log(data);
      checkHistoryDeposit(data, amount, currency, paymentSystem, `${wallet.slice(0, 3)}************${wallet.slice(15)}`, status, time);
    });

    it('C1789767 (+) user with one successful deposit: eth + EUR', async () => {
      const currency = 'EUR';
      const amount = 5555.33;
      const paymentSystem = 'eth_usd';
      const wallet = '213514684153216541';
      const status = 1;
      const time = new Date();
      const { data: user } = await register.oneClickReg();
      await banking.createDepositInBD(user.id, currency, amount, time, paymentSystem, wallet, status, 'payterra');
      const { data } = await history.category('deposits');
      // console.log(data);
      checkHistoryDeposit(data, amount, currency, paymentSystem, `${wallet.slice(0, 3)}************${wallet.slice(15)}`, status, time);
    });
  });

  describe('Several deposits', () => {
    const DEPOSIT_AMOUNT = 20; // число депозитов у юзера, которым логинимся
    let userId;
    beforeEach(async () => {
      const { data } = await userList.userWithSeveralDeposits();
      userId = data.id;
    });

    it('C1789768 (+) no limit and no last id', async () => {
      const { data } = await history.category('deposits');
      // console.log(data);
      expect(data.count).toBe(DEPOSIT_AMOUNT);
      expect(data.items.length).toBe(10);
    });

    it('C1789769 (+) 0 < limit < depositAmount', async () => {
      const { data } = await history.categoryWithLimit('deposits', DEPOSIT_AMOUNT - 1);
      // console.log(data);
      expect(data.count).toBe(DEPOSIT_AMOUNT);
      expect(data.items.length).toBe(DEPOSIT_AMOUNT - 1);
    });

    it('C1789770 (+) limit = depositAmount', async () => {
      const { data } = await history.categoryWithLimit('deposits', DEPOSIT_AMOUNT);
      // console.log(data);
      expect(data.count).toBe(DEPOSIT_AMOUNT);
      expect(data.items.length).toBe(DEPOSIT_AMOUNT);
    });

    it('C1789771 (+) limit > depositAmount ', async () => {
      const { data } = await history.categoryWithLimit('deposits', DEPOSIT_AMOUNT + 1);
      // console.log(data);
      expect(data.count).toBe(DEPOSIT_AMOUNT);
      expect(data.items.length).toBe(DEPOSIT_AMOUNT);
    });

    it('C1789772 (-) limit = negative number ', async () => {
      const { data } = await history.categoryWithLimit('deposits', -10);
      // console.log(data);
      checkErrMsg(data, 400, 'Bad request, limit is invalid');
    });

    it('C1789773 (-) limit = 0', async () => {
      const { data } = await history.categoryWithLimit('deposits', 0);
      // console.log(data);
      expect(data.count).toBe(DEPOSIT_AMOUNT);
      expect(data.items).toBeEmpty();
    });

    it('C1789774 (-) limit = symbols', async () => {
      const { data } = await history.categoryWithLimit('deposits', 'djkdjkdjkd');
      // console.log(data);
      checkErrMsg(data, 400, 'Bad request, limit should have a type of number, but found string');
    });

    it('C1789775 (-) limit = not integer', async () => {
      const { data } = await history.categoryWithLimit('deposits', '6.5');
      // console.log(data);
      checkErrMsg(data, 400, 'Bad request, limit is invalid');
    });

    it('C1789776 (-) last id = id of first deposit', async () => {
      const depositIds = await history.getDepositsIds(userId);
      const { data } = await history.categoryWithLastId('deposits', depositIds[0].id);
      // console.log(data);
      expect(data.count).toBe(DEPOSIT_AMOUNT);
      expect(data.items).toBeEmpty();
    });

    it('C1789777 (+) last id = id of second deposit', async () => {
      const depositIds = await history.getDepositsIds(userId);
      const { data } = await history.categoryWithLastId('deposits', depositIds[1].id);
      // console.log(data);
      expect(data.count).toBe(DEPOSIT_AMOUNT);
      expect(data.items.length).toBe(1);
      expect(data.items[0].id).toBe(depositIds[0].id);
    });

    it('C1789778 (+) last id = id of some deposit', async () => {
      const id = 15;
      const depositIds = await history.getDepositsIds(userId);
      const { data } = await history.categoryWithLastId('deposits', depositIds[id].id);
      // console.log(data);
      expect(data.count).toBe(DEPOSIT_AMOUNT);
      expect(data.items.length).toBe(10);
      for (let i = 1; i <= 10; i++) {
        expect(data.items[i - 1].id).toBe(depositIds[id - i].id);
      }
    });

    it('C1789779 (+) last id = id of last deposit', async () => {
      const depositIds = await history.getDepositsIds(userId);
      const { data } = await history.categoryWithLastId('deposits', depositIds[DEPOSIT_AMOUNT - 1].id);
      // console.log(data);
      expect(data.count).toBe(DEPOSIT_AMOUNT);
      expect(data.items.length).toBe(10);
      for (let i = 1; i <= 10; i++) {
        expect(data.items[i - 1].id).toBe(depositIds[DEPOSIT_AMOUNT - 1 - i].id);
      }
    });

    it('C1789780 (-) last id < id of first deposit', async () => {
      const depositIds = await history.getDepositsIds(userId);
      const { data } = await history.categoryWithLastId('deposits', depositIds[0].id - 10);
      // console.log(data);
      expect(data.count).toBe(DEPOSIT_AMOUNT);
      expect(data.items).toBeEmpty();
    });

    it('C1789781 (+) last id > id of last deposit', async () => {
      const depositIds = await history.getDepositsIds(userId);
      const { data } = await history.categoryWithLastId('deposits', depositIds[DEPOSIT_AMOUNT - 1].id + 10);
      // console.log(data);
      expect(data.count).toBe(DEPOSIT_AMOUNT);
      expect(data.items.length).toBe(10);
    });

    it('C1789782 (-) last id = negative number', async () => {
      const { data } = await history.categoryWithLastId('deposits', -1234);
      // console.log(data);
      checkErrMsg(data, 400, 'Bad request, lastId is invalid');
    });

    it('C1789783 (-) last id = not integer', async () => {
      const { data } = await history.categoryWithLastId('deposits', 567.89);
      // console.log(data);
      expect(data.count).toBe(DEPOSIT_AMOUNT);
      expect(data.items).toBeEmpty();
    });

    it('C1789784 (-) last id = symbols', async () => {
      const { data } = await history.categoryWithLastId('deposits', 'cmvnbcmnvm');
      // console.log(data);
      checkErrMsg(data, 400, 'Bad request, lastId should have a type of number, but found string');
    });

    it('C1789785 (+) both limit and lastId, valid', async () => {
      const depositIds = await history.getDepositsIds(userId);
      const limit = 5;
      const { data } = await history.categoryWithLimitAndLastId('deposits', limit, depositIds[DEPOSIT_AMOUNT - 1].id);
      // console.log(data);
      expect(data.count).toBe(DEPOSIT_AMOUNT);
      expect(data.items.length).toBe(limit);
      for (let i = 1; i <= limit; i++) {
        expect(data.items[i - 1].id).toBe(depositIds[DEPOSIT_AMOUNT - 1 - i].id);
      }
    });

    it('C1789786 (-) both limit and lastId, limit invalid', async () => {
      const { data } = await history.categoryWithLimitAndLastId('deposits', -521251, 534546344521);
      // console.log(data);
      checkErrMsg(data, 400, 'Bad request, limit is invalid');
    });

    it('C1789787 (-) both limit and lastId, lastId invalid', async () => {
      const { data } = await history.categoryWithLimitAndLastId('deposits', 8, 'dfdfgfg');
      // console.log(data);
      checkErrMsg(data, 400, 'Bad request, lastId should have a type of number, but found string');
    });
  });
});
