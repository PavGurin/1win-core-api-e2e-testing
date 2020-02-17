import { randomNum, randomStr } from '../randomizer';

const partner_key = 'test001';

export const register = {

  async oneClickReg(oneClick) {
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

  async oneClickRegUSD() {
    return socket.send('USER:auth-register',
      {
        isShort: true,
        country: defaultCountry,
        timezone: 23,
        currency: 'USD',
        partner_key,
      });
  },

  async oneClickRegEUR() {
    return socket.send('USER:auth-register',
      {
        isShort: true,
        country: defaultCountry,
        timezone: 23,
        currency: 'EUR',
        partner_key,
      });
  },

  async oneClickRegUAH() {
    return socket.send('USER:auth-register',
      {
        isShort: true,
        country: defaultCountry,
        timezone: 23,
        currency: 'UAH',
        partner_key,
      });
  },

  async usualReg(usualRegistration) {
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
  async usualRegMailru(usualRegistration) {
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
  async regMailWithConfirmationCodes() {
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

  async oneClickWithVisitDomainRUB(visitDomain) {
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
  async oneClickWithVisitDomainUSD(visitDomain) {
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
  async oneClickWithVisitDomainEUR(visitDomain) {
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
  async usualRegWithVisitDomain(visitDomain) {
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

  async oneClickRegRubWithPromocode(promocode) {
    return socket.send('USER:auth-register',
      {
        isShort: true,
        country: defaultCountry,
        timezone: 23,
        partner_key: promocode,
        currency: 'RUB',
      });
  },
  async oneClickRegUsdWithPromocode(promocode) {
    return socket.send('USER:auth-register',
      {
        isShort: true,
        country: defaultCountry,
        timezone: 23,
        partner_key: promocode,
        currency: 'USD',
      });
  },
  async oneClickRegEurWithPromocode(promocode) {
    return socket.send('USER:auth-register',
      {
        isShort: true,
        country: defaultCountry,
        timezone: 23,
        partner_key: promocode,
        currency: 'EUR',
      });
  },
  async oneClickRegUahWithPromocode(promocode) {
    return socket.send('USER:auth-register',
      {
        isShort: true,
        country: defaultCountry,
        timezone: 23,
        partner_key: promocode,
        currency: 'UAH',
      });
  },

  async usualRegUsdPromocode(promocode) {
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
        currency: 'USD',
        partner_key: promocode,
      });
  },

  async usualRegRubPromocode(promocode) {
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
        partner_key: promocode,
      });
  },

  async usualRegEurPromocode(promocode) {
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
        currency: 'EUR',
        partner_key: promocode,
      });
  },

  async usualRegUahPromocode(promocode) {
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
        currency: 'UAH',
        partner_key: promocode,
      });
  },
};
