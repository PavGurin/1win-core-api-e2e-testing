import { randomNum, randomStr } from '../randomizer';

export const updateProfile = updateProfile => socket.send('USER:profile-update',
  {
    name: randomStr(),
    email: `${randomStr(5)}_test@new.xyz`,
    phone: randomNum().toString(),
    password: '',
    birthday: 946587600002,
    country: defaultCountry,
    timezone: 1,
    ...updateProfile,
  });

export async function logOut() {
  // Выход текущего пользователя
  return await socket.send('USER:auth-logout', {
    tg_hash: randomStr(5),
  });
}
