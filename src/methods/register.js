import { randomNum, randomStr } from '../randomizer';

const partner_key = 'test001';

export const register = {

  async oneClickReg(socket, oneClick) {
    return socket.send('USER:auth-register',
      {
        isShort: true,
        country: defaultCountry,
        timezone: 23,
        partner_key,
        currency: 'RUB',
        ...oneClick,
      });
  },

  async oneClickRegUSD(socket) {
    return socket.send('USER:auth-register',
      {
        isShort: true,
        country: defaultCountry,
        timezone: 23,
        currency: 'USD',
        partner_key,
      });
  },

  async oneClickRegEUR(socket) {
    return socket.send('USER:auth-register',
      {
        isShort: true,
        country: defaultCountry,
        timezone: 23,
        currency: 'EUR',
        partner_key,
      });
  },

  async usualReg(socket, usualRegistration) {
    return socket.send('USER:auth-register',
      {
        isShort: false,
        name: randomStr(),
        email: `${randomStr(5)}_test@new.xyz`,
        phone: randomNum().toString(),
        password: defaultPassword,
        repeat_password: defaultPassword,
        country: defaultCountry,
        timezone: 23,
        birthday: 946587600000,
        currency: 'RUB',
        partner_key,
        ...usualRegistration,
      });
  },
  async usualRegMailru(socket, usualRegistration) {
    return socket.send('USER:auth-register',
      {
        isShort: false,
        name: randomStr(),
        email: `${randomStr(10)}_test@mail.ru`,
        phone: randomNum().toString(),
        password: defaultPassword,
        repeat_password: defaultPassword,
        country: defaultCountry,
        timezone: 23,
        birthday: 946587600000,
        currency: 'RUB',
        partner_key,
        ...usualRegistration,
      });
  },
  async regMailWithConfirmationCodes(socket) {
    return socket.send('USER:auth-register',
      {
        isShort: false,
        name: randomStr(),
        email: `${randomStr(10)}_test@ahem.email`,
        phone: randomNum().toString(),
        password: defaultPassword,
        repeat_password: defaultPassword,
        country: defaultCountry,
        timezone: 23,
        birthday: 946587600000,
        partner_key,
        currency: 'RUB',
      });
  },

  async oneClickWithVisitDomainRUB(socket, visitDomain) {
    return socket.send('USER:auth-register',
      {
        isShort: true,
        country: defaultCountry,
        timezone: 23,
        partner_key: '',
        sub_ids: ' ',
        visit_domain: visitDomain,
        currency: 'RUB',
      });
  },
  async oneClickWithVisitDomainUSD(socket, visitDomain) {
    return socket.send('USER:auth-register',
      {
        isShort: true,
        country: defaultCountry,
        timezone: 23,
        partner_key,
        currency: 'USD',
        visit_domain: visitDomain,
      });
  },
  async oneClickWithVisitDomainEUR(socket, visitDomain) {
    return socket.send('USER:auth-register',
      {
        isShort: true,
        country: defaultCountry,
        timezone: 23,
        partner_key,
        currency: 'EUR',
        visit_domain: visitDomain,
      });
  },
  async usualRegWithVisitDomain(socket, visitDomain) {
    return socket.send('USER:auth-register',
      {
        isShort: false,
        name: randomStr(),
        email: `${randomStr(5)}_test@new.xyz`,
        phone: randomNum().toString(),
        password: defaultPassword,
        repeat_password: defaultPassword,
        country: defaultCountry,
        timezone: 23,
        birthday: 946587600000,
        partner_key,
        visit_domain: visitDomain,
        currency: 'RUB',
      });
  },
};
