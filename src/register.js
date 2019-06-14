const partner_key = 'test001';
const birthday = 946587600002;
const default_password = '123456';

export const register = {

    async one_click_reg() {
        return await socket.send('USER:auth-register',
            {
                isShort: true,
                country: 'ru',
                timezone: 23,
                partner_key: partner_key
            });
    }
};

