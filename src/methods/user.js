import { randomNum, randomStr } from '../randomizer';
import { mysqlConnection } from './mysqlConnection';

export const updateProfile = (socket, newProfile) => socket.send('USER:profile-update',
  {
    name: randomStr(),
    email: `${randomStr(5)}_test@new.xyz`,
    phone: randomNum().toString(),
    password: '',
    birthday: 946587600002,
    country: defaultCountry,
    timezone: 1,
    ...newProfile,
  });

export async function changeCurrency(currency, socket) {
  return socket.send('USER:profile-changeCurrency', {
    currency,
  });
}

export async function logOut() {
  // Выход текущего пользователя
  return socket.send('USER:auth-logout', {
    tg_hash: randomStr(5),
  });
}

export async function sendUserDataToEmail(emailToSend, oneClickRegEmail, oneClickRegPassword) {
  return socket.send('POST:user_info_send_to_email', {
    email: emailToSend,
    login: oneClickRegEmail,
    password: oneClickRegPassword,
  });
}

export async function forgotRecovery(account) {
  return socket.send('USER:forgot-recovery', {
    account,
  });
}

export async function forgotConfirm(userId, code, password, repeat_password) {
  return socket.send('USER:forgot-confirm', {
    userId,
    code,
    password,
    repeat_password,
  });
}

export async function setUserRiskCoef(userId, coef) {
  return mysqlConnection.executeQuery(`INSERT INTO 1win.ma_users_meta VALUES ('${userId}','user_risk_coefficient',${coef});`);
}

export async function setUserWithdrawalBlock(userId) {
  return mysqlConnection.executeQuery(`INSERT INTO 1win.ma_users_meta VALUES ('${userId}','withdrawal_block','true');`);
}

export async function setUserWithdrawalManualControl(userId) {
  return mysqlConnection.executeQuery(`INSERT INTO 1win.ma_users_meta VALUES ('${userId}','withdrawal_manual_control','true');`);
}

export async function setUserDemoWithdrawal(userId) {
  return mysqlConnection.executeQuery(`INSERT INTO 1win.ma_users_meta VALUES ('${userId}','user_demo_withdrawal','true');`);
}

export async function setUserCasesWinner(userId) {
  return mysqlConnection.executeQuery(`INSERT INTO 1win.ma_users_meta VALUES ('${userId}','cases_winner','true');`);
}

export async function setUserBonusAmount(userId, amount) {
  return mysqlConnection.executeQuery(`INSERT INTO 1win.ma_users_meta VALUES ('${userId}','bonus_amount',${amount});`);
}

export async function setUserFullBlock(userId) {
  return mysqlConnection.executeQuery(`INSERT INTO 1win.ma_users_meta VALUES ('${userId}','full_block','true');`);
}
