import axios from 'axios';
import parser from 'fast-xml-parser';
import { randomStr } from '../randomizer';
import { mysqlConnection } from './mysqlConnection';
import { formatDateYyyyMmDd, formatDateYyyyMmDdHhIiSs } from './utils';

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
                              currency, time, payment_system, wallet, status, ps_data, date, merchant_name, is_played_back) 
                              VALUES (${userId}, ${balanceAmount}, '${currency}',
                                     '${formatDateYyyyMmDdHhIiSs(date)}',
                                     '${paymentSystem}', '${walletId}', ${status}, '${walletId}', '${formatDateYyyyMmDd(date)}', '${merchantName}', '0')`);
  },

  async createTransferInBD(userId, currency = 'RUB', transferAmount = 1000,
    date = new Date(), status = 1, senderId = 136) {
    await mysqlConnection.executeQuery(`INSERT INTO 1win.ma_deposits (id_user, amount, 
                              currency, time, payment_system, wallet, status, date, is_played_back) 
                              VALUES (${userId}, ${transferAmount}, '${currency}',
                                     '${formatDateYyyyMmDdHhIiSs(date)}',
                                     'money-transfer', 'sender: ${senderId}', ${status}, '${formatDateYyyyMmDd(date)}', '0');`);
  },

  async createPartnerWithdrawalInBD(userId, currency = 'RUB', amount = 1000,
    partnerId = 182, date = new Date(), status = 1) {
    await mysqlConnection.executeQuery(`INSERT INTO 1win.ma_deposits (id_user, amount, 
                              currency, time, payment_system, wallet, status, date) 
                              VALUES (${userId}, ${amount}, '${currency}',
                                     '${formatDateYyyyMmDdHhIiSs(date)}',
                                     'partner', 'partner:${partnerId}', ${status}, '${formatDateYyyyMmDd(date)}')`);
  },


  async createWithdrawalInBD(userId, currency = 'RUB', withdrawalAmount = 1000,
    paymentSystem = 'card', walletId = '5120720257992179', status = 1, date = new Date(), merchantName = 'payterra') {
    await mysqlConnection.executeQuery(`INSERT INTO 1win.ma_withdrawal (id_user, amount, currency, time, 
                               payment_system, wallet, status, merchant_name, device, merchant_is_checked, date, payed_amount)
                              VALUES (${userId}, ${withdrawalAmount}, '${currency}',
                                     '${formatDateYyyyMmDdHhIiSs(date)}',
                                     '${paymentSystem}', '${walletId}', ${status}, '${merchantName}', 'app-android', 0,
                                      '${formatDateYyyyMmDd(date)}', 0)`);
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

export async function getCurrenciesFromDB(date) {
  let Date = '';
  if (date.getDay() === 7) date.setDate(date.getDate() - 1);
  if (date.getDay() === 1) date.setDate(date.getDate() - 2);
  date.getMonth() < 9 ? Date += `${date.getFullYear()}-0${date.getMonth() + 1}-`
    : Date += `${date.getFullYear()}-${date.getMonth() + 1}-`;
  date.getDate() < 10 ? Date += `0${date.getDate()}` : Date += `${date.getDate()}`;
  let currencies = await mysqlConnection.executeQuery(`select * from 1win.ma_exchange_rates where date = '${Date}';`);
  if (!currencies[0]) {
    currencies = await mysqlConnection.executeQuery('select * from 1win.ma_exchange_rates order by date desc limit 1;');
  }
  return currencies[0];
}
