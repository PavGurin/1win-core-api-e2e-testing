import axios from 'axios';
import parser from 'fast-xml-parser';
import {randomStr} from '../randomizer';

export const banking = {

  async transfer_create(amount, currency) {
    return await socket.send('BANKING:transfer-create', {
      targetEmail: `${randomStr(5)}_transfet@test.xyz`,
      amount,
      currency,
    });
  },

  async withdrawal_create(amount, wallet, payment_system, currency) {
    return await socket.send('BANKING:withdrawal-create', {
      amount,
      wallet,
      payment_system,
      currency,
    });
    // console.log(JSON.stringify(result, null, 2));
  },

  async deposite_create_rub(amount, wallet, paymentType, currency) {
    return await socket.send('BANKING:deposit-create', {
      amount,
      wallet,
      paymentType,
      currency,
    });
  },

  async deposit_create_request(amount, wallet, paymentType, currency) {
    return await socket.send('BANKING:deposit-create-request', {
      amount,
      wallet,
      paymentType,
      currency,
    });
  },
};

/**
 * Получение стоймости валюты в рублях
 *
 * @param {string} charCode код валюты
 * @param {Date?} date дата на которую нужно посмотреть стоймость, если не указана, то сегодня
 */
export const cbCurrency = (charCode, date = new Date()) => axios
    .get(`http://www.cbr.ru/scripts/XML_daily.asp?date_req=${(`0${date.getDate()}`).slice(-2)}/${(`0${date.getMonth() + 1}`).slice(-2)}/${date.getFullYear()}`)
    .then(({data}) => parser.parse(data).ValCurs.Valute)
    .then(currencies => currencies.find(currency => currency.CharCode === charCode))
    .then(currency => currency.Value);
