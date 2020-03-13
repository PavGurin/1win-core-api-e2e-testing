import axios from 'axios';
import { randomNum, randomStr } from '../randomizer';
import { mysqlConnection } from './mysqlConnection';

const PARTNER_STAGING_URL = 'https://partner-staging.1win.dev';
// const AUTH_TOKEN = 'Basic YWRtaW46Zk1xM0VaVXB2OGhOMmg=';

function getCookie(headers) {
  const cookie1 = (headers['set-cookie'][0]).match(/(.*); path=.*/)[1];
  const cookie2 = (headers['set-cookie'][1]).match(/(.*); path=.*/)[1];
  return `${cookie1}; ${cookie2}`;
}

export const partner = {
  async register(email, password, currency, hash = '') {
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
        disableCaptcha: true,
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

  async setCPA(userId) {
    await mysqlConnection.executeQuery(`insert into 1win_partner.users_meta values (${userId}, 'cpa', 'true')`);
  },

  async setHybrid(userId) {
    await mysqlConnection.executeQuery(`insert into 1win_partner.users_meta values (${userId}, 'hybrid', 'true')`);
  },

  async registerWithCPA(email, password, currency) {
    await partner.register(email, password, currency);
    const { data, cookie } = await partner.login(email, password);
    const { data: info } = await partner.getUserInfo(cookie);
    await partner.setCPA(info.user.id);
    return { data, cookie };
  },

  async registerHybrid(email, password, currency) {
    await partner.register(email, password, currency);
    const { data, cookie } = await partner.login(email, password);
    const { data: info } = await partner.getUserInfo(cookie);
    await partner.setCPA(info.user.id);
    await partner.setHybrid(info.user.id);
    return { data, cookie, partnerId: info.user.id };
  },

  async createPromocode(cookie, promocode, sourceId) {
    try {
      let source;
      if (sourceId) { source = sourceId; } else (source = await partner.getDefaultSourceId(cookie));
      const { data } = await axios.post(`${PARTNER_STAGING_URL}/api/v2/promo/add`, {
        name: promocode,
        source_id: source,
        // source_id: sourceId || await partner.getDefaultSourceId(),
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

  async setCpaPresetForPartnerKey(keyId, presetId) {
    await mysqlConnection.executeQuery(`update 1win_partner.partner_keys set preset_id = ${presetId} where id = ${keyId};`);
  },

  async createPromocodeWithCPA(cookie, promocode, sourceId, cpaPreset = 7) {
    const { data } = await partner.createPromocode(cookie, promocode, sourceId);
    await partner.setCpaPresetForPartnerKey(data.id, cpaPreset);
    return { data };
  },
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

  async getDefaultSourceId(cookie) {
    try {
      const { data } = await axios.get(`${PARTNER_STAGING_URL}/api/v2/sources/list?p=1`, {
        headers: {
          // Authorization: AUTH_TOKEN,
          Cookie: cookie,
        },
      });
      // console.log(data);
      return data.results[0].id;
    } catch (error) {
      // console.log(error.data);
      return error.data;
    }
  },

  async getStatsAll(cookie, linkPromoId, sourceId) {
    try {
      const { data } = await axios.get(`${PARTNER_STAGING_URL}/api/v2/stats_v2/all`, {
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
      return { data };
    } catch (error) {
      // console.log(error.data);
      return error.data;
    }
  },

  async getStatsDay(cookie, day, linkPromoId, sourceId) {
    try {
      const { data } = await axios.get(`${PARTNER_STAGING_URL}/api/v2/stats_v2/days`, {
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
      return { data };
    } catch (error) {
      // console.log(error.data);
      return error.data;
    }
  },
};
