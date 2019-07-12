import axios from 'axios';
import parser from 'fast-xml-parser';
import { randomStr } from '../randomizer';


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

  async depositCreateRub(amount, wallet, paymentType, currency) {
    return socket.send('BANKING:deposit-create', {
      amount,
      wallet,
      paymentType,
      currency,
    });
  },

  async depositCreateRequestRub(amount, wallet, paymentType, currency) {
    return socket.send('BANKING:deposit-create-request', {
      amount,
      wallet,
      paymentType,
      currency,
    });
  },

  async convertCreate(amount, senderCurrency, receiverCurrency) {
    return socket.send('BANKING:convert-create', {
      amount,
      senderCurrency,
      receiverCurrency,
    });
  },

  async balanceCheck() {
    const balanceData = await socket.send('GET:balance', {
      tg_hash: randomStr(5),
    });
    return balanceData.data.primary.amount;
  },
};

/**
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
