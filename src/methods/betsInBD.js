import { mysqlConnection } from './mysqlConnection';

// статусы ставки
// 1 = проиграл
// 2 = выиграл
// type, timeOpen, timeClose, device - можно не указывать
export async function addBetToBD(userId, currency, amount, coeff, status,
  type, timeOpen, timeClose, device) {
  const betType = type || 'ordinary';
  const betTimeOpen = timeOpen || new Date() / 1;
  const betTimeClose = timeClose || new Date() / 1;
  const betDevice = device || 'app-android';
  const profit = status === 2 ? (amount * coeff).toFixed(2) : 0;
  await mysqlConnection.executeQuery(`INSERT INTO 1win.ma_bets(id_user, time_open, time_close, 
                         status, amount, total_coefficient, currency, sys, flags, profit, promo_amount, 
                         betType, device) 
                         VALUES(${userId}, '${betTimeOpen}', ${betTimeClose}, ${status}, ${amount}, ${coeff}, 
                                '${currency}', 0, 0, ${profit}, 0, '${betType}', '${betDevice}')`);
}
