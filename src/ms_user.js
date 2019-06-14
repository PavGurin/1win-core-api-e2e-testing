import {randomNum, randomStr} from './randomizer';

export const update_profile = (updateProfile) => socket.send('USER:profile-update',
    {
        name: randomStr(),
        email: randomStr(5) + '_upd@test.xyz',
        phone: randomNum().toString(),
        password: '',
        birthday: 946587600002,
        country: default_country,
        timezone: 1,
        ...updateProfile
    });

