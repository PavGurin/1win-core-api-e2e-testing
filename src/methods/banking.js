import axios from 'axios';
import parser from 'fast-xml-parser';
import { randomStr } from '../randomizer';

export const banking = {

    async transfet_create() {
        return await socket.send('BANKING:transfer-create', {
            targetEmail: randomStr(5) + '_transfet@test.xyz',
            amount: 100,
            currency: 'RUB'
        });
    },

    async withdrawal_create() {
        const result = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            wallet: '0000111122223333',
            payment_system: 'card_rub',
            currency: 'RUB'
        });
        //console.log(JSON.stringify(result, null, 2));
    }

};

/**
 * Получение стоймости валюты в рублях
 * 
 * @param {string} charCode код валюты
 * @param {Date?} date дата на которую нужно посмотреть стоймость, если не указана, то сегодня
 */
export const cbCurrency = (charCode, date = new Date()) => axios
    .get(`http://www.cbr.ru/scripts/XML_daily.asp?date_req=${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`)
    .then(({ data }) => parser.parse(data).ValCurs.Valute)
    .then(currencies => currencies.find(currency => currency.CharCode === charCode))
    .then(currency => currency.Value)