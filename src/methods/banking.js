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

  async withdrawalCreate(amount, wallet, payment_system, currency) {
    return socket.send('BANKING:withdrawal-create', {
      amount,
      wallet,
      payment_system,
      currency,
    });
    // console.log(JSON.stringify(result, null, 2));
  },

  async depositCreate(amount, wallet, paymentType, currency) {
    return socket.send('BANKING:deposit-create', {
      amount,
      wallet,
      paymentType,
      currency,
    });
  },

  async depositCreateRequest(amount, wallet, paymentType, currency) {
    return socket.send('BANKING:deposit-create-request', {
      amount,
      wallet,
      paymentType,
      currency,
    });
  },

  async balanceCheck() {
    const balanceData = await socket.send('GET:balance', {
      tg_hash: randomStr(5),
    });
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
