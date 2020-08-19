import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { randomNum, randomStr } from '../randomizer';
import { mysqlConnection } from './mysqlConnection';
import { formatDateYyyyMmDdHhIiSs, sleep } from './utils';

const PARTNER_STAGING_URL = 'https://partner.staging.1win.cloud/';
// const AUTH_TOKEN = 'Basic YWRtaW46Zk1xM0VaVXB2OGhOMmg=';
const TIMEOUT = 40000;

function getCookie(headers) {
  const cookie1 = (headers['set-cookie'][0]).match(/(.*); path=.*/)[1];
  const cookie2 = (headers['set-cookie'][1]).match(/(.*); path=.*/)[1];
  return `${cookie1}; ${cookie2}`;
}

export const partner = {
  /** Database methods */

  // устанавливает cpa = true для партнера с id = userId
  async setCPA(userId) {
    await mysqlConnection.executeQuery(`insert into 1win_partner.users_meta values (${userId}, 'cpa', 'true')`);
  },

  // устанавливает cpa = true и hybrid = true для партнера с id = userId
  async setHybrid(userId) {
    await mysqlConnection.executeQuery(`insert into 1win_partner.users_meta values (${userId}, 'cpa', 'true');`);
    await mysqlConnection.executeQuery(`insert into 1win_partner.users_meta values (${userId}, 'hybrid', 'true');`);
  },

  // включает мультибаланс для партнера с id = userId
  async setMultibalance(userId) {
    await mysqlConnection.executeQuery(`insert into 1win_partner.users_meta values (${userId}, 'enable_multibalance', 'true');`);
  },

  // устанавливает для промокода/ссылки с id = keyId номер пресета presetId
  async setCpaPresetForPartnerKey(keyId, presetId) {
    await mysqlConnection.executeQuery(`update 1win_partner.partner_keys set preset_id = ${presetId} where id = ${keyId};`);
  },

  // возвращает последний id пресета
  async getLastPresetNumber() {
    const result = await mysqlConnection.executeQuery('select version from 1win_partner.cpa_preset order by version desc limit 1;');
    return result[0].version;
  },

  // создает новый пресет с указанными параметрами и возвращает его id (presetNumber)
  async createPreset(depositAmount, betCount, betAmount,
    gamblingAmount, totalAmount, timeFromReg, partnerProfit) {
    let presetNumber = await this.getLastPresetNumber();
    presetNumber++;
    await mysqlConnection.executeQuery(`insert into 1win_partner.cpa_preset values('${presetNumber}','cpa_deposit_amount', '${depositAmount}'), 
                                           ('${presetNumber}', 'cpa_bet_amount', '${betAmount}'), 
                                           ('${presetNumber}', 'cpa_bet_count', '${betCount}'), 
                                           ('${presetNumber}', 'cpa_gambling_amount', '${gamblingAmount}'),
                                           ('${presetNumber}', 'cpa_partner_profit', '${partnerProfit}'),
                                           ('${presetNumber}', 'cpa_total_amount', '${totalAmount}'),
                                           ('${presetNumber}', 'cpa_time_from_registration', '${timeFromReg}');`);
    return presetNumber;
  },

  // добавляет выплаты сра (то что делается из админки)
  async addCpaPayment(partnerId) {
    const cpaPayouts = await mysqlConnection.executeQuery(`select * from 1win_partner.stats_v2 where partner_id = '${partnerId}' and event = 'CPA_PAYOUT';`);
    // eslint-disable-next-line no-restricted-syntax
    for await (const payout of cpaPayouts) {
      const broadcaster_id = uuidv4();
      await mysqlConnection.executeQuery(`insert into 1win_partner.stats_v2(broadcaster_id, partner_id, hash_id, 
                                  source_id, user_id, event, event_value, event_source_id, date, country) 
                                  VALUES ('${broadcaster_id}', '${partnerId}', '${payout.hash_id}', '${payout.source_id}', 
                                  '${payout.user_id}', 'PAYMENT', '${payout.event_value}', '${payout.broadcaster_id}', 
                                  '${formatDateYyyyMmDdHhIiSs(new Date())}', '${payout.country}');`);
    }
  },

  // добавляет для юзера, привязанного к партнеру, первый депозит (event = FIRST_DEPOSIT)
  async addFirstDeposit(partnerId, hashId, sourceId, userId, amount, date = new Date(), country = 'ru') {
    const Date = formatDateYyyyMmDdHhIiSs(date);

    const broadcaster_id = uuidv4();
    return mysqlConnection.executeQuery(`insert into 1win_partner.stats_v2(broadcaster_id, partner_id, hash_id, 
                                  source_id, user_id, event, event_value, event_source_id, date, country) 
                                  VALUES('${broadcaster_id}', 
                                         '${partnerId}', '${hashId}', '${sourceId}', '${userId}', 'FIRST_DEPOSIT', 
                                         '${amount}', '${userId}', '${Date}', '${country}')`);
  },

  // добавляет для юзера, привязанного к партнеру, депозит (event = DEPOSIT)
  async addDeposit(partnerId, hashId, sourceId, userId, amount, date = new Date(), country = 'ru') {
    const Date = formatDateYyyyMmDdHhIiSs(date);

    const broadcaster_id = uuidv4();
    return mysqlConnection.executeQuery(`insert into 1win_partner.stats_v2(broadcaster_id, partner_id, hash_id, 
                                  source_id, user_id, event, event_value, event_source_id, date, country) 
                                  VALUES('${broadcaster_id}', 
                                         '${partnerId}', '${hashId}', '${sourceId}', '${userId}', 'DEPOSIT', 
                                         '${amount}', '${userId}', '${Date}', '${country}');`);
  },

  // устанавливает в базе баланс партнера = amount
  async setBalance(partnerId, amount) {
    if (amount) {
      return mysqlConnection.executeQuery(`update 1win_partner.users set balance = '${amount}' where id = '${partnerId}';`);
    } else { // eslint-disable-line no-else-return
      const [result] = await mysqlConnection.executeQuery(`select balance_v2_hook_test from 1win_partner.users where id = '${partnerId}';`);
      return mysqlConnection.executeQuery(`update 1win_partner.users set balance = '${result.balance_v2_hook_test}' where id = '${partnerId}';`);
    }
  },

  /** Partner REST methods */
  // логин партнером с email и password, возвращает {data, cookie}
  // cookie используется для дальнейших запросов этим партнером
  // data - ответ на запрос /login
  async login(email, password) {
    try {
      const { data, headers } = await axios.post(`${PARTNER_STAGING_URL}/api/v2/user/login`, {
        login: email,
        password: password, // eslint-disable-line object-shorthand
        disableCaptcha: true,
      });
      /* , {
        headers: {
          Authorization: AUTH_TOKEN,
        },
      } */
      const cookie = getCookie(headers);
      // console.log(data);
      // console.log(headers);
      return { data, cookie };
    } catch (error) {
      // console.log(error.data);
      return error.data;
    }
  },

  // возвращает инфу о юзере {data} содержащую id, email, валюта и проч.
  async getUserInfo(cookie) {
    try {
      const { data } = await axios.post(`${PARTNER_STAGING_URL}/api/v2/user/info`, {}, {
        headers: {
          // Authorization: AUTH_TOKEN,
          Cookie: cookie,
        },
      });
      // console.log(data);
      return { data };
    } catch (error) {
      // console.log(error.data);
      return error.data;
    }
  },

  // регистрирует партнера с заданными параметрами
  async register(email, password, currency, hash = '', lang = 'ru') {
    try {
      const { data } = await axios.post(`${PARTNER_STAGING_URL}/api/v2/user/register`, {
        name: `${randomStr(10)}`, // eslint-disable-line object-shorthand
        email: email, // eslint-disable-line object-shorthand
        phone: `${randomNum(10)}`,
        skype: `${randomNum(10)}`,
        about: 'vk',
        password: password, // eslint-disable-line object-shorthand
        password_repeat: password,
        currency: currency, // eslint-disable-line object-shorthand
        owner_hash: hash,
        domain: 'partner-staging.1win.dev',
        traffic_source: 'autotests',
        language: lang,
        disableCaptcha: true,
        collaboration_model: 'RS',
      });
      /* , {
        headers: {
          Authorization: AUTH_TOKEN,
        },
      } */
      // console.log(data);
      return data;
    } catch (error) {
      // console.log(error.data);
      return error.data;
    }
  },

  // регистрирует Revshare партнера и выполняет логин, возвращает { data, cookie, info }
  // cookie используется для дальнейших запросов этим партнером
  // data - ответ на запрос /login
  // info - инфа о юзере
  async registerRevshare(email, password, currency, hash = '', lang = 'ru') {
    await this.register(email, password, currency, hash, lang);
    const { data, cookie } = await this.login(email, password);
    const { data: info } = await this.getUserInfo(cookie);
    return { data, cookie, info };
  },

  // регистрирует CPA партнера и выполняет логин, возвращает { data, cookie, info }
  // cookie используется для дальнейших запросов этим партнером
  // data - ответ на запрос /login
  // info - инфа о юзере
  async registerCPA(email, password, currency, lang = 'ru') {
    await this.register(email, password, currency, '', lang);
    const { data, cookie } = await this.login(email, password);
    const { data: info } = await this.getUserInfo(cookie);
    await this.setCPA(info.user.id);
    return { data, cookie, info };
  },

  // регистрирует гибридного партнера и выполняет логин, возвращает { data, cookie, info }
  // cookie используется для дальнейших запросов этим партнером
  // data - ответ на запрос /login
  // info - инфа о юзере
  async registerHybrid(email, password, currency, lang = 'ru') {
    await this.register(email, password, currency, '', lang);
    const { data, cookie } = await this.login(email, password);
    const { data: info } = await this.getUserInfo(cookie);
    await this.setHybrid(info.user.id);
    return { data, cookie, info };
  },

  // возвращает список всех источников (массив)
  // нужна cookie партнера
  async getSources(cookie) {
    try {
      const { data } = await axios.get(`${PARTNER_STAGING_URL}/api/v2/sources/list`, {
        headers: {
          // Authorization: AUTH_TOKEN,
          Cookie: cookie,
        },
      });
      // console.log(data);
      return data.results;
    } catch (error) {
      // console.log(error.data);
      return error.data;
    }
  },

  // возвращает id источника по его названию
  // если не указать, то вернется id источника по умолчанию
  // нужна cookie партнера
  async getSourceId(cookie, sourceName = 'Источник по умолчанию') {
    try {
      const { data } = await axios.get(`${PARTNER_STAGING_URL}/api/v2/sources/list?p=1`, {
        headers: {
          // Authorization: AUTH_TOKEN,
          Cookie: cookie,
        },
      });
      // console.log(data);
      const source = data.results.find(result => result.name === sourceName);
      return source.id;
    } catch (error) {
      // console.log(error.data);
      return error.data;
    }
  },

  // создает новый источник c заданными параметрами и возвращает его id
  // нужна cookie партнера
  async createSource(cookie, sourceName, sourceLink = `${randomStr(10)}`, sourceDescription = `${randomStr(10)}`, sourceType = 1) {
    if (!sourceName) {
      // eslint-disable-next-line no-param-reassign
      sourceName = `${randomStr(10)}`;
    }
    try {
      const { data } = await axios.post(`${PARTNER_STAGING_URL}/api/v2/sources/add`, {
        name: sourceName,
        link: sourceLink,
        type: sourceType,
        comment: sourceDescription,
      }, {
        headers: {
          // Authorization: AUTH_TOKEN,
          Cookie: cookie,
        },
      });
      const id = await this.getSourceId(cookie, sourceName);
      return id;
    } catch (error) {
      // console.log(error.data);
      return error.data;
    }
  },

  // создает промокод promocode, возвращает {data} - ответ на запрос promo/add
  // нужна cookie партнера, для которого хотим создать
  // sourceId - id источника, можно не указывать, тогда будет промокод для источника по умолчанию
  async createPromocode(cookie, promocode, sourceId) {
    try {
      let source;
      if (sourceId) { source = sourceId; } else (source = await this.getSourceId(cookie));
      const { data } = await axios.post(`${PARTNER_STAGING_URL}/api/v2/promo/add`, {
        name: promocode,
        source_id: source,
        // source_id: sourceId || await this.getDefaultSourceId(),
      }, {
        headers: {
          // Authorization: AUTH_TOKEN,
          Cookie: cookie,
        },
      });
      // console.log(data);
      return { data };
    } catch (error) {
      // console.log(error.data);
      return error.data;
    }
  },

  // создает промокод promocode с привязанным пресетом с id = cpaPreset,
  // возвращает {data} - ответ на запрос promo/add
  // нужна cookie партнера, для которого хотим создать
  // sourceId - id источника, можно не указывать, тогда будет промокод для источника по умолчанию
  async createPromocodeWithCPA(cookie, promocode, sourceId, cpaPreset = 7) {
    const { data } = await this.createPromocode(cookie, promocode, sourceId);
    await this.setCpaPresetForPartnerKey(data.id, cpaPreset);
    return { data };
  },

  // возвращает общую стату {data}
  // linkPromoId - id промокода или ссылки, можно не указывать
  // sourceId - id источника, можно не указывать
  // метод запрашивает стату в течение времени TIMEOUT с интервалом 2 секунды, пока
  // expectedParameter не будет ненулевым
  // пример использования: await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
  // это нужно для борьбы с тем, что иногда стата приходит долго, а иногда сразу,
  // чтобы не делать большое время ождания статы
  async getStatsAll(cookie, linkPromoId, sourceId, expectedParameter) {
    let left_ms = TIMEOUT;
    let data;
    while (left_ms > 0) {
      /* eslint no-await-in-loop:off */
      try {
        const { data: data1 } = await axios.get(`${PARTNER_STAGING_URL}/api/v2/stats_v2/all`, {
          params: {
            sources: sourceId,
            hashId: linkPromoId,
          },
          headers: {
            // Authorization: AUTH_TOKEN,
            Cookie: cookie,
          },
        });
        // console.log(data);
        data = data1;
      } catch (error) {
        // console.log(error.data);
        // eslint-disable-next-line prefer-destructuring
        data = error.data;
      }
      if (data.values[expectedParameter] !== undefined && data.values[expectedParameter] !== 0) {
        return { data };
      }
      await sleep(2000);
      left_ms -= 2000;
    }
    return { data };
  },

  // возвращает стату за день day {data}
  // linkPromoId - id промокода или ссылки, можно не указывать
  // sourceId - id источника, можно не указывать
  // метод запрашивает стату в течение времени TIMEOUT с интервалом 2 секунды, пока
  // expectedParameter не будет ненулевым
  // пример использования: await partner.getStatsAll(cookie, promocodeId, undefined, 'difference');
  // это нужно для борьбы с тем, что иногда стата приходит долго, а иногда сразу,
  // чтобы не делать большое время ождания статы
  async getStatsDay(cookie, day, linkPromoId, sourceId, expectedParameter) {
    let left_ms = TIMEOUT;
    let data;
    while (left_ms > 0) {
      /* eslint no-await-in-loop:off */
      try {
        const { data: data1 } = await axios.get(`${PARTNER_STAGING_URL}/api/v2/stats_v2/days`, {
          params: {
            day: `${day / 1}, ${day / 1}`,
            sources: sourceId,
            hashId: linkPromoId,
          },
          headers: {
          // Authorization: AUTH_TOKEN,
            Cookie: cookie,
          },
        });
        // console.log(data);
        data = data1;
      } catch (error) {
      // console.log(error.data);
        // eslint-disable-next-line prefer-destructuring
        data = error.data;
      }
      if (data.days[0][expectedParameter] !== undefined && data.days[0][expectedParameter] !== 0) {
        return { data };
      }
      await sleep(2000);
      left_ms -= 2000;
    }
    return { data };
  },

  // возвращает стату по источнику с id = sourceId {profit, balance}
  // нужна cookie партнера
  async getSourceIncome(cookie, sourceId) {
    let source;
    try {
      const { data } = await axios.get(`${PARTNER_STAGING_URL}/api/v2/sources/list?p=1`, {
        headers: {
          // Authorization: AUTH_TOKEN,
          Cookie: cookie,
        },
      });
      source = data.results.find(item => item.id === sourceId);
    } catch (error) {
      // console.log(error.data);
      // eslint-disable-next-line prefer-destructuring
      source = error.data;
    }
    return { profit: source.profit, balance: source.balance };
  },

  // возвращает hash для регистрации субпартнера
  // нужна cookie партнера
  async UrlSubPartner(cookie) {
    try {
      const { data: { hash } } = await axios.get(`${PARTNER_STAGING_URL}/api/v2/links/subpartner`, {
        headers: {
          // Authorization: AUTH_TOKEN,
          cookie: cookie, // eslint-disable-line object-shorthand
        },
      });
      return hash;
    } catch (error) {
      // console.log(error.data);
      return error.data;
    }
  },

  // возвращает статистику по субпартнерам {data}
  // нужна cookie партнера
  async getStatsSubpartner(cookie) {
    try {
      const { data } = await axios.get(`${PARTNER_STAGING_URL}/api/v2/stats_v2/subpartners`, {
        headers: {
          // Authorization: AUTH_TOKEN,
          Cookie: cookie,
        },
      });
      // console.log(data);
      return { data };
    } catch (error) {
      // console.log(error.data);
      return error.data;
    }
  },

  // возвращает все источники sources(массив)
  // нужна cookie партнера
  async sourcesSearch(cookie) {
    try {
      const { data } = await axios.post(`${PARTNER_STAGING_URL}/api/v2/sources/search`, {
        text: '',
      }, {
        headers: {
          // Authorization: AUTH_TOKEN,
          Cookie: cookie,
        },
      });
      // console.log(data);
      return data.sources;
    } catch (error) {
      // console.log(error.data);
      return error.data;
    }
  },

  // привязывает к партнеру почту email
  // нужна cookie партнера
  async mailConnect(cookie, email) {
    try {
      const { data: mailConnect } = await axios.post(`${PARTNER_STAGING_URL}/api/v2/withdrawals/connect_user`, {
        email,
      }, {
        headers: {
          // Authorization: AUTH_TOKEN,
          Cookie: cookie,
        },
      });
      // console.log(mailConnect);
      return mailConnect;
    } catch (error) {
      // console.log(error.data);
      return error.data;
    }
  },

  // привязывает к партнеру телефон phone
  // нужна cookie партнера
  async phoneConnect(cookie, phone) {
    try {
      const { data } = await axios.post(`${PARTNER_STAGING_URL}/api/v2/user/add_phone`, {
        phone,
      }, {
        headers: {
          // Authorization: AUTH_TOKEN,
          Cookie: cookie,
        },
      });
      // console.log(data);
      return data;
    } catch (error) {
      // console.log(error.data);
      return error.data;
    }
  },

  // подтверждение привязанного телефона кодом code
  // нужна cookie партнера
  async phoneConfirm(cookie, code) {
    try {
      const { data } = await axios.post(`${PARTNER_STAGING_URL}/api/v2/user/add_phone_confirm`, {
        code,
      }, {
        headers: {
          // Authorization: AUTH_TOKEN,
          Cookie: cookie,
        },
      });
      // console.log(data);
      return data;
    } catch (error) {
      // console.log(error.data);
      return error.data;
    }
  },

  // создает вывод суммой amount из источника sourceId
  // (для юзера с мультибалансом sourceId можно не указывать)
  // нужна cookie партнера
  async withdrawalCreate(cookie, amount, sourceId) {
    try {
      const { data } = await axios.post(`${PARTNER_STAGING_URL}/api/v2/withdrawals/add`, {
        sourceId,
        sum: amount,
      }, {
        headers: {
          Cookie: cookie,
        },
      });
      // console.log(data);
      return data;
    } catch (error) {
      // console.log(error.data);
      return error.data;
    }
  },

  // подтверждение вывода кодом code
  // нужна cookie партнера
  async withdrawalConfirm(cookie, code) {
    try {
      const { data } = await axios.post(`${PARTNER_STAGING_URL}/api/v2/withdrawals/add_confirm`, {
        code,
      }, {
        headers: {
          Cookie: cookie,
        },
      });
      // console.log(confirm);
      return data;
    } catch (error) {
      // console.log(error.data);
      return error.data;
    }
  },

  // привязывает к партнеру юзера 1вин с email и phone
  // с подветрджением телефона
  // нужна cookie партнера
  async connectUser(cookie, email, phone) {
    try {
      let phoneConfirm;
      const mailConnect = await this.mailConnect(cookie, email);
      // console.log(mailConnect);
      const addPhone = await this.phoneConnect(cookie, phone);
      // console.log(addPhone);
      if (addPhone.code) {
        phoneConfirm = await this.phoneConfirm(cookie, addPhone.code);
        // console.log(phoneConfirm);
      }
      return phoneConfirm || addPhone;
    } catch (error) {
      // console.log(error.data);
      return error.data;
    }
  },

  // получение списка всех выводов партнера
  async withdrawalsList(cookie) {
    try {
      const { data } = await axios.get(`${PARTNER_STAGING_URL}/api/v2/withdrawals/list`, {
        headers: {
          Cookie: cookie,
        },
      });
      return { data };
    } catch (error) {
      // console.log(error.data);
      return error.data;
    }
  },

  // создает вывод из источника с id = sourceId с суммой amount
  // с подтверждеием кода
  // нужна cookie партнера
  async addWithdrawal(cookie, amount, sourceId) {
    try {
      let withdrawalConfirm;
      const withdrawalCreate = await this.withdrawalCreate(cookie, amount, sourceId);
      // console.log(withdrawalCreate);
      if (withdrawalCreate.code) {
        withdrawalConfirm = await this.withdrawalConfirm(cookie, withdrawalCreate.code);
        // console.log(withdrawalConfirm);
      }
      return withdrawalConfirm || withdrawalCreate;
    } catch (error) {
      // console.log(error.data);
      return error.data;
    }
  },

  // возвращает сообщения в чате messages(массив)
  // нужна cookie партнера
  async getChatMessages(cookie) {
    try {
      const { data } = await axios.get(`${PARTNER_STAGING_URL}/api/v2/chat`, {
        headers: {
          Cookie: cookie,
        },
      });
      return data.messages;
    } catch (error) {
      // console.log(error.data);
      return error.data;
    }
  },
};
