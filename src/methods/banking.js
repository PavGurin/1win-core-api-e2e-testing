import axios from 'axios';
import parser from 'fast-xml-parser';
import { randomStr } from '../randomizer';
import { mysqlConnection } from './mysqlConnection';


export const banking = {

  async transferCreateAll(targetEmail, amount, currency) {
    return socket.send('BANKING:transfer-create', {
      targetEmail,
      amount,
      currency,
    });
  },

  async transferCreate(amount, currency) {
    return socket.send('BANKING:transfer-create', {
      targetEmail: 'test_transfer@test.xyz',
      amount,
      currency,
    });
  },
  async transferCreateAccount(amount, currency) {
    return socket.send('BANKING:transfer-create', {
      account: 'test_transfer@test.xyz',
      amount,
      currency,
    });
  },

  async withdrawalCreate(wallet, payment_system, currency, amount) {
    return socket.send('BANKING:withdrawal-create', {
      amount,
      wallet,
      payment_system,
      currency,
    });
    // console.log(JSON.stringify(result, null, 2));
  },

  async depositCreate(wallet, paymentType, currency, amount) {
    return socket.send('BANKING:deposit-create', {
      amount,
      wallet,
      paymentType,
      currency,
    });
  },

  async depositCreateRequest(wallet, paymentType, currency, amount) {
    return socket.send('BANKING:deposit-create-request', {
      amount,
      wallet,
      paymentType,
      currency,
    });
  },

  async balanceCheck() {
    const balanceData = await socket.send('GET:balance', {});
    return balanceData.data.primary.amount;
  },

  async setBalance(userId, amount = 200) {
    await mysqlConnection.executeQuery(`UPDATE 1win.ma_balance SET amount = ${amount} WHERE id_user = ${userId}`);
  },

  async getWithdrawalStatus(userId) {
    const result = await mysqlConnection.executeQuery(`SELECT status FROM 1win.ma_withdrawal WHERE id_user = ${userId} ORDER BY time DESC;`);
    // console.log(result);
    return result[0].status;
  },

  async checkWithdrawalPossible(moneyAmount) {
    return socket.send('BANKING:withdrawal-check', { amount: moneyAmount });
  },

  async createDepositInBD(userId, currency = 'RUB', balanceAmount = 1000,
    date = new Date(), paymentSystem = 'card_rub', walletId = '4132788660217293', status = 1, merchantName = 'payterra') {
    await mysqlConnection.executeQuery(`INSERT INTO 1win.ma_deposits (id_user, amount, 
                              currency, time, payment_system, wallet, status, ps_data, date, merchant_name) 
                              VALUES (${userId}, ${balanceAmount}, '${currency}',
                                     '${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}',
                                     '${paymentSystem}', '${walletId}', ${status}, '${walletId}', '${date.getFullYear()}-${date.getMonth()}-${date.getDate()}', '${merchantName}')`);
  },

  async createWithdrawalInBD(userId, withdrawalAmount, date,
    paymentSystem, walletId, status, merchantName) {
    if (merchantName) {
      await mysqlConnection.executeQuery(`INSERT INTO 1win.ma_withdrawal (id_user, amount, currency, time, 
                               payment_system, wallet, status, merchant_name, device, merchant_is_checked, date, payed_amount)
                              VALUES (${userId}, ${withdrawalAmount}, 'RUB',
                                     '${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}',
                                     '${paymentSystem}', '${walletId}', ${status}, '${merchantName}', 'app-android', 0,
                                      '${date.getFullYear()}-${date.getMonth()}-${date.getDate()}', 0)`);
    } else {
      await mysqlConnection.executeQuery(`INSERT INTO 1win.ma_deposits (id_user, amount, 
                              currency, time, payment_system, wallet, status, ps_data, date) 
                              VALUES (${userId}, ${withdrawalAmount}, 'RUB',
                                     '${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}',
                                     '${paymentSystem}', '${walletId}', ${status}, '${walletId}', '${date.getFullYear()}-${date.getMonth()}-${date.getDate()}')`);
    }
  },
};

/**
 * Пока оставить, вдруг будут изменения
 * Получение стоимости валюты в рублях
 *
 * @param {string} charCode код валюты
 * @param {Date?} date дата на которую нужно посмотреть стоимость, если не указана, то сегодня
 */
export const cbCurrency = (charCode, date = new Date()) => axios
  .get(`http://www.cbr.ru/scripts/XML_daily.asp?date_req=${(`0${date.getDate()}`).slice(-2)}/${(`0${date.getMonth() + 1}`).slice(-2)}/${date.getFullYear()}`)
  .then(({ data }) => parser.parse(data).ValCurs.Valute)
  .then(currencies => currencies.find(currency => currency.CharCode === charCode))
  .then(currency => currency.Value);
