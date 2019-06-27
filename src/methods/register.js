import {randomNum, randomStr} from '../randomizer';

const partner_key = 'test001';

export const register = {

    async one_click_reg() {
        return await socket.send('USER:auth-register',
            {
                isShort: true,
                country: default_country,
                timezone: 23,
                partner_key,
            });
    },

    async usual_reg(usualRegistration) {
        return await socket.send('USER:auth-register',
            {
                isShort: false,
                name: randomStr(),
                email: `${randomStr(5)}_test@new.xyz`,
                phone: randomNum().toString(),
                password: default_password,
                repeat_password: default_password,
                country: default_country,
                timezone: 23,
                birthday: 946587600000,
                partner_key,
                ...usualRegistration,
            });
    },
};
