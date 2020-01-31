import { mysqlConnection } from './mysqlConnection';

export async function addCasinoGamePlayedInBD(userId, lossAmount, profitAmount, currency, date,
  gameName = 'spinomenal_SlotMachine_LotusKingdom', provider = 'Spinomenal', device = 'app-android') {
  await mysqlConnection.executeQuery(`INSERT INTO 1win.ma_withdrawal(id_user, amount, currency, time, 
                               time_confirm, payment_system, wallet, status, merchant_name, device, merchant_is_checked, date) 
                               VALUES (${userId}, ${lossAmount}, '${currency}', 
                                       '${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}', 
                                       '0000-00-00 00:00:00', 'casino', '${gameName}', 1, '${provider}', '${device}', 0, 
                                       '${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}');`);
  await mysqlConnection.executeQuery(`INSERT INTO 1win.ma_deposits(id_user, amount, currency, time, payment_system, wallet, status, date,
      merchant_name, device)
    VALUES(${userId}, ${profitAmount}, '${currency}',
      '${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}',
      'casino', '${gameName}', 1,
      '${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}', '${provider}', '${device}');`);
}
