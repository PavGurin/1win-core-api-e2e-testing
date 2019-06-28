import { randomNum, randomStr } from '../randomizer';

const PartnerKey = 'test001';

export const register = {

  async oneClickReg() {
    return socket.send('USER:auth-register',
      {
        isShort: true,
        country: defaultCountry,
        timezone: 23,
        PartnerKey,
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
        PartnerKey,
        ...usualRegistration,
      });
  },
};
