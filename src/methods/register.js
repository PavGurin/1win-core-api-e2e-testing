import {randomNum, randomStr} from '../randomizer';

const partnerKey = 'test001';

export const register = {

    async oneClickReg() {
        return await socket.send('USER:auth-register',
            {
                isShort: true,
                country: defaultCountry,
                timezone: 23,
                partner_key: partnerKey
            });
    },

    async usualReg(usualRegistration) {
        return await socket.send('USER:auth-register',
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
                partner_key: partnerKey,
                ...usualRegistration
            });
    }
};
