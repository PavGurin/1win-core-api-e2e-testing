import { banking } from '../../src/methods/banking';
import { register } from '../../src/methods/register';
import { cases } from '../../src/methods/cases';
import { getUserWithdrawalManualControl } from '../../src/methods/user';
import { sleep } from '../../src/methods/utils';

// юзеру выставляется withdrawal_manual_control, если:
// 1) это новый юзер (зарегался не ранее трех дней назад + нет выводов)
// 2) у юзера есть два не успешных депозита со статусом 2 с карты
// 3) юзер делает вывод не на ту же карту, с которой/которых были депозиты

describe('Anti - carding', () => {
  describe('RUB', () => {
    it('C1961974 (+) 2 failed deposits, withdrawal to advcash', async () => {
      const { data: user } = await register.usualRegMailru();
      // console.log(user.id);

      await banking.createDepositInBD(user.id, 'RUB', 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'RUB', 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'RUB', 1000, new Date(), 'card_rub', '55005500663311220', '1', 'payterra');
      await banking.setBalance(user.id, 1000);

      const { data: caseResult } = await cases.playCaseWithoutChance(6);

      const { data } = await banking.withdrawalCreate('wallet@mail.ru', 'advcash_rub', 'RUB', caseResult.result);
      // console.log(data);
      await sleep(500);
      expect(await getUserWithdrawalManualControl(user.id)).toEqual('true');
    });

    it('C1961975 (+) 2 failed deposits, withdrawal to beeline', async () => {
      const { data: user } = await register.usualRegMailru();
      // console.log(user.id);

      await banking.createDepositInBD(user.id, 'RUB', 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'RUB', 1000, new Date(), 'card_rub', '9696585874741212', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'RUB', 1000, new Date(), 'card_rub', '3344665588997700', '1', 'payterra');
      await banking.setBalance(user.id, 1000);

      const { data: caseResult } = await cases.playCaseWithoutChance(6);

      const { data } = await banking.withdrawalCreate('79030954215', 'beeline_rub', 'RUB', caseResult.result);
      // console.log(data);
      await sleep(500);
      expect(await getUserWithdrawalManualControl(user.id)).toEqual('true');
    });

    it('C1961976 (+) 2 failed deposits, withdrawal to megafon', async () => {
      const { data: user } = await register.usualRegMailru();
      // console.log(user.id);

      await banking.createDepositInBD(user.id, 'RUB', 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'RUB', 1000, new Date(), 'card_rub', '9696585874741212', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'RUB', 1000, new Date(), 'card_rub', '3344665588997700', '1', 'payterra');
      await banking.setBalance(user.id, 1000);

      const { data: caseResult } = await cases.playCaseWithoutChance(6);

      const { data } = await banking.withdrawalCreate('79272388306', 'megafon_rub', 'RUB', caseResult.result);
      // console.log(data);
      await sleep(500);
      expect(await getUserWithdrawalManualControl(user.id)).toEqual('true');
    });

    it('C1961977 (+) 2 failed deposits, withdrawal to mts', async () => {
      const { data: user } = await register.usualRegMailru();
      // console.log(user.id);

      await banking.createDepositInBD(user.id, 'RUB', 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'RUB', 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'RUB', 1000, new Date(), 'card_rub', '55005500663311220', '1', 'payterra');
      await banking.setBalance(user.id, 1000);

      const { data: caseResult } = await cases.playCaseWithoutChance(6);

      const { data } = await banking.withdrawalCreate('79112365498', 'mts_rub', 'RUB', caseResult.result);
      // console.log(data);
      await sleep(500);
      expect(await getUserWithdrawalManualControl(user.id)).toEqual('true');
    });

    it('C1961978 (+) 2 failed deposits, withdrawal to payeer', async () => {
      const { data: user } = await register.usualRegMailru();
      // console.log(user.id);

      await banking.createDepositInBD(user.id, 'RUB', 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'RUB', 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'RUB', 1000, new Date(), 'card_rub', '55005500663311220', '1', 'payterra');
      await banking.setBalance(user.id, 1000);

      const { data: caseResult } = await cases.playCaseWithoutChance(6);

      const { data } = await banking.withdrawalCreate('P001200356', 'payeer_rub', 'RUB', caseResult.result);
      // console.log(data);
      await sleep(500);
      expect(await getUserWithdrawalManualControl(user.id)).toEqual('true');
    });

    it('C1961979 (+) 2 failed deposits, withdrawal to qiwi', async () => {
      const { data: user } = await register.usualRegMailru();
      // console.log(user.id);

      await banking.createDepositInBD(user.id, 'RUB', 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'RUB', 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'RUB', 1000, new Date(), 'card_rub', '55005500663311220', '1', 'payterra');
      await banking.setBalance(user.id, 1000);

      const { data: caseResult } = await cases.playCaseWithoutChance(6);

      const { data } = await banking.withdrawalCreate('+9729001234567', 'qiwi_rub', 'RUB', caseResult.result);
      // console.log(data);
      await sleep(500);
      expect(await getUserWithdrawalManualControl(user.id)).toEqual('true');
    });

    it('C1961980 (+) 2 failed deposits, withdrawal to tele2', async () => {
      const { data: user } = await register.usualRegMailru();
      // console.log(user.id);

      await banking.createDepositInBD(user.id, 'RUB', 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'RUB', 1000, new Date(), 'card_rub', '9696585874741212', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'RUB', 1000, new Date(), 'card_rub', '3344665588997700', '1', 'payterra');
      await banking.setBalance(user.id, 1000);

      const { data: caseResult } = await cases.playCaseWithoutChance(6);

      const { data } = await banking.withdrawalCreate('79522308274', 'tele2_rub', 'RUB', caseResult.result);
      // console.log(data);
      await sleep(500);
      expect(await getUserWithdrawalManualControl(user.id)).toEqual('true');
    });

    it('C1961981 (+) 2 failed deposits, withdrawal to yamoney', async () => {
      const { data: user } = await register.usualRegMailru();
      // console.log(user.id);

      await banking.createDepositInBD(user.id, 'RUB', 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'RUB', 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'RUB', 1000, new Date(), 'card_rub', '55005500663311220', '1', 'payterra');
      await banking.setBalance(user.id, 1000);

      const { data: caseResult } = await cases.playCaseWithoutChance(6);

      const { data } = await banking.withdrawalCreate('4100100000000', 'yamoney_rub', 'RUB', caseResult.result);
      // console.log(data);
      await sleep(500);
      expect(await getUserWithdrawalManualControl(user.id)).toEqual('true');
    });

    it('C1961982 (-) 2 failed deposits, withdrawal on same card', async () => {
      const { data: user } = await register.usualRegMailru();
      // console.log(user.id);

      await banking.createDepositInBD(user.id, 'RUB', 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'RUB', 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'RUB', 1000, new Date(), 'card_rub', '55005500663311220', '1', 'payterra');
      await banking.setBalance(user.id, 1000);

      const { data: caseResult } = await cases.playCaseWithoutChance(6);

      const { data } = await banking.withdrawalCreate('55005500663311220', 'card_rub', 'RUB', caseResult.result);
      // console.log(data);
      await sleep(500);
      expect(await getUserWithdrawalManualControl(user.id)).toEqual(undefined);
    });

    it('C1961983 (+) 2 failed deposits, withdrawal to other card', async () => {
      const { data: user } = await register.usualRegMailru();
      // console.log(user.id);

      await banking.createDepositInBD(user.id, 'RUB', 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'RUB', 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'RUB', 1000, new Date(), 'card_rub', '55005500663311220', '1', 'payterra');
      await banking.setBalance(user.id, 1000);

      const { data: caseResult } = await cases.playCaseWithoutChance(6);

      const { data } = await banking.withdrawalCreate('4801769871971639', 'card_rub', 'RUB', caseResult.result);
      // console.log(data);
      await sleep(500);
      expect(await getUserWithdrawalManualControl(user.id)).toEqual('true');
    });

    it('C1961984 (-) deposits from different cards, withdrawal to one of them', async () => {
      const { data: user } = await register.usualRegMailru();
      // console.log(user.id);

      await banking.createDepositInBD(user.id, 'RUB', 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'RUB', 1000, new Date(), 'card_rub', '4271661979600601', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'RUB', 1000, new Date(), 'card_rub', '5297251452740533', '1', 'payterra');
      await banking.setBalance(user.id, 1000);

      const { data: caseResult } = await cases.playCaseWithoutChance(6);

      const { data } = await banking.withdrawalCreate('4271661979600601', 'card_rub', 'RUB', caseResult.result);
      // console.log(data);
      await sleep(500);
      expect(await getUserWithdrawalManualControl(user.id)).toEqual(undefined);
    });

    it('C1961985 (+) deposits from different cards, withdrawal not to one of them', async () => {
      const { data: user } = await register.usualRegMailru();
      // console.log(user.id);

      await banking.createDepositInBD(user.id, 'RUB', 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'RUB', 1000, new Date(), 'card_rub', '4271661979600601', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'RUB', 1000, new Date(), 'card_rub', '5297251452740533', '1', 'payterra');
      await banking.setBalance(user.id, 1000);

      const { data: caseResult } = await cases.playCaseWithoutChance(6);

      const { data } = await banking.withdrawalCreate('3529668360323620', 'card_rub', 'RUB', caseResult.result);
      // console.log(data);
      await sleep(500);
      expect(await getUserWithdrawalManualControl(user.id)).toEqual('true');
    });

    it('C1961986 (-) old user', async () => {
      const { data: user } = await register.usualRegMailru();
      // console.log(user.id);
      await banking.createWithdrawalInBD(user.id, 'RUB', 100, 'card_rub', '6363454521218989', 1, new Date());

      await banking.createDepositInBD(user.id, 'RUB', 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'RUB', 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'RUB', 1000, new Date(), 'card_rub', '55005500663311220', '1', 'payterra');
      await banking.setBalance(user.id, 1000);

      const { data: caseResult } = await cases.playCaseWithoutChance(6);

      const { data } = await banking.withdrawalCreate('79112365498', 'mts_rub', 'RUB', caseResult.result);
      // console.log(data);
      await sleep(500);
      expect(await getUserWithdrawalManualControl(user.id)).toEqual(undefined);
    });

    it('C1961987 (-) 1 failed deposit, withdrawal to phone', async () => {
      const { data: user } = await register.usualRegMailru();
      // console.log(user.id);

      await banking.createDepositInBD(user.id, 'RUB', 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'RUB', 1000, new Date(), 'card_rub', '55005500663311220', '1', 'payterra');
      await banking.setBalance(user.id, 1000);

      const { data: caseResult } = await cases.playCaseWithoutChance(6);

      const { data } = await banking.withdrawalCreate('79112365498', 'mts_rub', 'RUB', caseResult.result);
      // console.log(data);
      await sleep(500);
      expect(await getUserWithdrawalManualControl(user.id)).toEqual(undefined);
    });
  });

  describe('USD', () => {
    it('C1961988 (+) 2 failed deposits, withdrawal to qiwi', async () => {
      const { data: user } = await register.oneClickRegUSD();
      // console.log(user.id);

      await banking.createDepositInBD(user.id, 'USD', 200, new Date(), 'card', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'USD', 200, new Date(), 'card', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'USD', 200, new Date(), 'card', '55005500663311220', '1', 'payterra');
      await banking.setBalance(user.id, 200);

      const { data: caseResult } = await cases.playCaseWithoutChance(17);

      const { data } = await banking.withdrawalCreate('+9729001234567', 'qiwi_usd', 'USD', caseResult.result);
      // console.log(data);
      await sleep(500);
      expect(await getUserWithdrawalManualControl(user.id)).toEqual('true');
    });

    it('C1961989 (+) 2 failed deposits, withdrawal to webmoney', async () => {
      const { data: user } = await register.oneClickRegUSD();
      // console.log(user.id);

      await banking.createDepositInBD(user.id, 'USD', 200, new Date(), 'card', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'USD', 200, new Date(), 'card', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'USD', 200, new Date(), 'card', '55005500663311220', '1', 'payterra');
      await banking.setBalance(user.id, 200);

      const { data: caseResult } = await cases.playCaseWithoutChance(17);

      const { data } = await banking.withdrawalCreate('Z123456789012', 'webmoney_usd', 'USD', caseResult.result);
      // console.log(data);
      await sleep(500);
      expect(await getUserWithdrawalManualControl(user.id)).toEqual('true');
    });

    it('C1961990 (-) 2 failed deposits, withdrawal on same card', async () => {
      const { data: user } = await register.oneClickRegUSD();
      // console.log(user.id);

      await banking.createDepositInBD(user.id, 'USD', 200, new Date(), 'card', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'USD', 200, new Date(), 'card', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'USD', 200, new Date(), 'card', '55005500663311220', '1', 'payterra');
      await banking.setBalance(user.id, 200);

      const { data: caseResult } = await cases.playCaseWithoutChance(17);

      const { data } = await banking.withdrawalCreate('55005500663311220', 'card', 'USD', caseResult.result);
      // console.log(data);
      await sleep(500);
      expect(await getUserWithdrawalManualControl(user.id)).toEqual(undefined);
    });

    it('C1961991 (+) 2 failed deposits, withdrawal to other card', async () => {
      const { data: user } = await register.oneClickRegUSD();
      // console.log(user.id);

      await banking.createDepositInBD(user.id, 'USD', 200, new Date(), 'card', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'USD', 200, new Date(), 'card', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'USD', 200, new Date(), 'card', '55005500663311220', '1', 'payterra');
      await banking.setBalance(user.id, 200);

      const { data: caseResult } = await cases.playCaseWithoutChance(17);

      const { data } = await banking.withdrawalCreate('4801769871971639', 'card', 'USD', caseResult.result);
      // console.log(data);
      await sleep(500);
      expect(await getUserWithdrawalManualControl(user.id)).toEqual('true');
    });

    it('C1961992 (-) deposits from different cards, withdrawal to one of them', async () => {
      const { data: user } = await register.oneClickRegUSD();
      // console.log(user.id);

      await banking.createDepositInBD(user.id, 'USD', 200, new Date(), 'card', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'USD', 200, new Date(), 'card', '4271661979600601', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'USD', 200, new Date(), 'card', '5297251452740533', '1', 'payterra');
      await banking.setBalance(user.id, 200);

      const { data: caseResult } = await cases.playCaseWithoutChance(17);

      const { data } = await banking.withdrawalCreate('4271661979600601', 'card', 'USD', caseResult.result);
      // console.log(data);
      await sleep(500);
      expect(await getUserWithdrawalManualControl(user.id)).toEqual(undefined);
    });

    it('C1961993 (+) deposits from different cards, withdrawal not to one of them', async () => {
      const { data: user } = await register.oneClickRegUSD();
      // console.log(user.id);

      await banking.createDepositInBD(user.id, 'USD', 200, new Date(), 'card', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'USD', 200, new Date(), 'card', '4271661979600601', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'USD', 200, new Date(), 'card', '5297251452740533', '1', 'payterra');
      await banking.setBalance(user.id, 200);

      const { data: caseResult } = await cases.playCaseWithoutChance(17);

      const { data } = await banking.withdrawalCreate('3529668360323620', 'card', 'USD', caseResult.result);
      // console.log(data);
      await sleep(500);
      expect(await getUserWithdrawalManualControl(user.id)).toEqual('true');
    });

    it('C1961994 (-) old user', async () => {
      const { data: user } = await register.oneClickRegUSD();
      // console.log(user.id);
      await banking.createWithdrawalInBD(user.id, 'USD', 100, 'card', '6363454521218989', 1, new Date());

      await banking.createDepositInBD(user.id, 'USD', 200, new Date(), 'card', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'USD', 200, new Date(), 'card', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'USD', 200, new Date(), 'card', '55005500663311220', '1', 'payterra');
      await banking.setBalance(user.id, 200);

      const { data: caseResult } = await cases.playCaseWithoutChance(17);

      const { data } = await banking.withdrawalCreate('6363454521218989', 'card', 'USD', caseResult.result);
      // console.log(data);
      await sleep(500);
      expect(await getUserWithdrawalManualControl(user.id)).toEqual(undefined);
    });

    it('C1961995 (-) 1 failed deposit, withdrawal to webmoney', async () => {
      const { data: user } = await register.oneClickRegUSD();
      // console.log(user.id);

      await banking.createDepositInBD(user.id, 'USD', 200, new Date(), 'card', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'USD', 200, new Date(), 'card', '55005500663311220', '1', 'payterra');
      await banking.setBalance(user.id, 200);

      const { data: caseResult } = await cases.playCaseWithoutChance(17);

      const { data } = await banking.withdrawalCreate('6363454521218989', 'card', 'USD', caseResult.result);
      // console.log(data);
      await sleep(500);
      expect(await getUserWithdrawalManualControl(user.id)).toEqual(undefined);
    });
  });

  describe('EUR', () => {
    it('C1962000 (+) 2 failed deposits, withdrawal to qiwi', async () => {
      const { data: user } = await register.oneClickRegEUR();
      // console.log(user.id);

      await banking.createDepositInBD(user.id, 'EUR', 200, new Date(), 'card', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'EUR', 200, new Date(), 'card', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'EUR', 200, new Date(), 'card', '55005500663311220', '1', 'payterra');
      await banking.setBalance(user.id, 200);

      const { data: caseResult } = await cases.playCaseWithoutChance(25);

      const { data } = await banking.withdrawalCreate('+79272388306', 'qiwi_eur', 'EUR', caseResult.result);
      // console.log(data);
      await sleep(500);
      expect(await getUserWithdrawalManualControl(user.id)).toEqual('true');
    });

    it('C1962001 (-) 2 failed deposits, withdrawal on same card', async () => {
      const { data: user } = await register.oneClickRegEUR();
      // console.log(user.id);

      await banking.createDepositInBD(user.id, 'EUR', 200, new Date(), 'card', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'EUR', 200, new Date(), 'card', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'EUR', 200, new Date(), 'card', '55005500663311220', '1', 'payterra');
      await banking.setBalance(user.id, 200);

      const { data: caseResult } = await cases.playCaseWithoutChance(25);

      const { data } = await banking.withdrawalCreate('55005500663311220', 'card', 'EUR', caseResult.result);
      // console.log(data);
      await sleep(500);
      expect(await getUserWithdrawalManualControl(user.id)).toEqual(undefined);
    });

    it('C1962002 (+) 2 failed deposits, withdrawal to other card', async () => {
      const { data: user } = await register.oneClickRegEUR();
      // console.log(user.id);

      await banking.createDepositInBD(user.id, 'EUR', 200, new Date(), 'card', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'EUR', 200, new Date(), 'card', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'EUR', 200, new Date(), 'card', '55005500663311220', '1', 'payterra');
      await banking.setBalance(user.id, 200);

      const { data: caseResult } = await cases.playCaseWithoutChance(25);

      const { data } = await banking.withdrawalCreate('4801769871971639', 'card', 'EUR', caseResult.result);
      // console.log(data);
      await sleep(500);
      expect(await getUserWithdrawalManualControl(user.id)).toEqual('true');
    });

    it('C1962003 (-) deposits from different cards, withdrawal to one of them', async () => {
      const { data: user } = await register.oneClickRegEUR();
      // console.log(user.id);

      await banking.createDepositInBD(user.id, 'EUR', 200, new Date(), 'card', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'EUR', 200, new Date(), 'card', '4271661979600601', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'EUR', 200, new Date(), 'card', '5297251452740533', '1', 'payterra');
      await banking.setBalance(user.id, 200);

      const { data: caseResult } = await cases.playCaseWithoutChance(25);

      const { data } = await banking.withdrawalCreate('4271661979600601', 'card', 'EUR', caseResult.result);
      // console.log(data);
      await sleep(500);
      expect(await getUserWithdrawalManualControl(user.id)).toEqual(undefined);
    });

    it('C1962004 (+) deposits from different cards, withdrawal not to one of them', async () => {
      const { data: user } = await register.oneClickRegEUR();
      // console.log(user.id);

      await banking.createDepositInBD(user.id, 'EUR', 200, new Date(), 'card', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'EUR', 200, new Date(), 'card', '4271661979600601', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'EUR', 200, new Date(), 'card', '5297251452740533', '1', 'payterra');
      await banking.setBalance(user.id, 200);

      const { data: caseResult } = await cases.playCaseWithoutChance(25);

      const { data } = await banking.withdrawalCreate('3529668360323620', 'card', 'EUR', caseResult.result);
      // console.log(data);
      await sleep(500);
      expect(await getUserWithdrawalManualControl(user.id)).toEqual('true');
    });

    it('C1962005 (-) old user', async () => {
      const { data: user } = await register.oneClickRegEUR();
      // console.log(user.id);
      await banking.createWithdrawalInBD(user.id, 'EUR', 100, 'card', '6363454521218989', 1, new Date());

      await banking.createDepositInBD(user.id, 'EUR', 200, new Date(), 'card', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'EUR', 200, new Date(), 'card', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'EUR', 200, new Date(), 'card', '55005500663311220', '1', 'payterra');
      await banking.setBalance(user.id, 200);

      const { data: caseResult } = await cases.playCaseWithoutChance(25);

      const { data } = await banking.withdrawalCreate('6363454521218989', 'card', 'EUR', caseResult.result);
      // console.log(data);
      await sleep(500);
      expect(await getUserWithdrawalManualControl(user.id)).toEqual(undefined);
    });

    it('C1962006 (-) 1 failed deposit, withdrawal to card', async () => {
      const { data: user } = await register.oneClickRegEUR();
      // console.log(user.id);

      await banking.createDepositInBD(user.id, 'EUR', 200, new Date(), 'card', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'EUR', 200, new Date(), 'card', '55005500663311220', '1', 'payterra');
      await banking.setBalance(user.id, 200);

      const { data: caseResult } = await cases.playCaseWithoutChance(25);

      const { data } = await banking.withdrawalCreate('6363454521218989', 'card', 'EUR', caseResult.result);
      // console.log(data);
      await sleep(500);
      expect(await getUserWithdrawalManualControl(user.id)).toEqual(undefined);
    });
  });

  describe('UAH', () => {
    it('C1962007 (-) 2 failed deposits, withdrawal to same card', async () => {
      const { data: user } = await register.oneClickRegUAH();
      // console.log(user.id);

      await banking.createDepositInBD(user.id, 'UAH', 500, new Date(), 'card_uah', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'UAH', 500, new Date(), 'card_uah', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'UAH', 500, new Date(), 'card_uah', '55005500663311220', '1', 'payterra');
      await banking.setBalance(user.id, 500);

      const { data: caseResult } = await cases.playCaseWithoutChance(31);

      const { data } = await banking.withdrawalCreate('55005500663311220', 'card_uah', 'UAH', caseResult.result);
      // console.log(data);
      await sleep(500);
      expect(await getUserWithdrawalManualControl(user.id)).toEqual(undefined);
    });

    it('C1962008 (+) 2 failed deposits, withdrawal to other card', async () => {
      const { data: user } = await register.oneClickRegUAH();
      // console.log(user.id);

      await banking.createDepositInBD(user.id, 'UAH', 500, new Date(), 'card_uah', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'UAH', 500, new Date(), 'card_uah', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'UAH', 500, new Date(), 'card_uah', '55005500663311220', '1', 'payterra');
      await banking.setBalance(user.id, 500);

      const { data: caseResult } = await cases.playCaseWithoutChance(31);

      const { data } = await banking.withdrawalCreate('4801769871971639', 'card_uah', 'UAH', caseResult.result);
      // console.log(data);
      await sleep(500);
      expect(await getUserWithdrawalManualControl(user.id)).toEqual('true');
    });

    it('C1962009 (-) deposits from different cards, withdrawal to one of them', async () => {
      const { data: user } = await register.oneClickRegUAH();
      // console.log(user.id);

      await banking.createDepositInBD(user.id, 'UAH', 500, new Date(), 'card_uah', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'UAH', 500, new Date(), 'card_uah', '4271661979600601', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'UAH', 500, new Date(), 'card_uah', '5297251452740533', '1', 'payterra');
      await banking.setBalance(user.id, 500);

      const { data: caseResult } = await cases.playCaseWithoutChance(31);

      const { data } = await banking.withdrawalCreate('4271661979600601', 'card_uah', 'UAH', caseResult.result);
      // console.log(data);
      await sleep(500);
      expect(await getUserWithdrawalManualControl(user.id)).toEqual(undefined);
    });

    it('C1962010 (+) deposits from different cards, withdrawal not to one of them', async () => {
      const { data: user } = await register.oneClickRegUAH();
      // console.log(user.id);

      await banking.createDepositInBD(user.id, 'UAH', 500, new Date(), 'card_uah', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'UAH', 500, new Date(), 'card_uah', '4271661979600601', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'UAH', 500, new Date(), 'card_uah', '5297251452740533', '1', 'payterra');
      await banking.setBalance(user.id, 500);

      const { data: caseResult } = await cases.playCaseWithoutChance(31);

      const { data } = await banking.withdrawalCreate('3529668360323620', 'card_uah', 'UAH', caseResult.result);
      // console.log(data);
      await sleep(500);
      expect(await getUserWithdrawalManualControl(user.id)).toEqual('true');
    });

    it('C1962011 (-) old user', async () => {
      const { data: user } = await register.oneClickRegUAH();
      // console.log(user.id);
      await banking.createWithdrawalInBD(user.id, 'UAH', 100, 'card_uah', '6363454521218989', 1, new Date());

      await banking.createDepositInBD(user.id, 'UAH', 500, new Date(), 'card_uah', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'UAH', 500, new Date(), 'card_uah', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'UAH', 500, new Date(), 'card_uah', '55005500663311220', '1', 'payterra');
      await banking.setBalance(user.id, 500);

      const { data: caseResult } = await cases.playCaseWithoutChance(31);

      const { data } = await banking.withdrawalCreate('6363454521218989', 'card_uah', 'UAH', caseResult.result);
      // console.log(data);
      await sleep(500);
      expect(await getUserWithdrawalManualControl(user.id)).toEqual(undefined);
    });

    it('C1962012 (-) 1 failed deposit, withdrawal to card', async () => {
      const { data: user } = await register.oneClickRegUAH();
      // console.log(user.id);

      await banking.createDepositInBD(user.id, 'UAH', 500, new Date(), 'card_uah', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 'UAH', 500, new Date(), 'card_uah', '55005500663311220', '1', 'payterra');
      await banking.setBalance(user.id, 500);

      const { data: caseResult } = await cases.playCaseWithoutChance(31);

      const { data } = await banking.withdrawalCreate('6363454521218989', 'card_uah', 'UAH', caseResult.result);
      // console.log(data);
      await sleep(500);
      expect(await getUserWithdrawalManualControl(user.id)).toEqual(undefined);
    });
  });
});
