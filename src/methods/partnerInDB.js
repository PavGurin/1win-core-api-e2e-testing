import { mysqlConnection } from './mysqlConnection';
import { randomStr } from '../randomizer';

export async function addFirstDeposit(partnerId, hashId, sourceId, userId, amount, date = new Date(), country = 'ru') {
  let Date = '';
  if (date.getDay() === 7) date.setDate(date.getDate() - 1);
  if (date.getDay() === 1) date.setDate(date.getDate() - 2);
  date.getMonth() < 9 ? Date += `${date.getFullYear()}-0${date.getMonth() + 1}-${date.getDate()} ${date.getUTCHours()}:${date.getMinutes()}:${date.getSeconds()}`
    : Date += `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getUTCHours()}:${date.getMinutes()}:${date.getSeconds()}`;

  const broadcaster_id = `${randomStr(8)}-${randomStr(4)}-${randomStr(4)}-${randomStr(12)}`;
  return mysqlConnection.executeQuery(`insert into 1win_partner.stats_v2(broadcaster_id, partner_id, hash_id, 
                                  source_id, user_id, event, event_value, event_source_id, date, country) 
                                  VALUES('${broadcaster_id}', 
                                         '${partnerId}', '${hashId}', '${sourceId}', '${userId}', 'FIRST_DEPOSIT', 
                                         '${amount}', '${userId}', '${Date}', '${country}')`);
}

export async function addDeposit(partnerId, hashId, sourceId, userId, amount, date = new Date(), country = 'ru') {
  let Date = '';
  if (date.getDay() === 7) date.setDate(date.getDate() - 1);
  if (date.getDay() === 1) date.setDate(date.getDate() - 2);
  date.getMonth() < 9 ? Date += `${date.getFullYear()}-0${date.getMonth() + 1}-${date.getDate()} ${date.getUTCHours()}:${date.getMinutes()}:${date.getSeconds()}`
    : Date += `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getUTCHours()}:${date.getMinutes()}:${date.getSeconds()}`;

  const broadcaster_id = `${randomStr(8)}-${randomStr(4)}-${randomStr(4)}-${randomStr(12)}`;
  return mysqlConnection.executeQuery(`insert into 1win_partner.stats_v2(broadcaster_id, partner_id, hash_id, 
                                  source_id, user_id, event, event_value, event_source_id, date, country) 
                                  VALUES('${broadcaster_id}', 
                                         '${partnerId}', '${hashId}', '${sourceId}', '${userId}', 'DEPOSIT', 
                                         '${amount}', '${userId}', '${Date}', '${country}');`);
}


export async function createPreset(version, depositAmount, betCount, betAmount,
  gamblingAmount, totalAmount, timeFromReg, partnerProfit) {
  return mysqlConnection.executeQuery(`insert into 1win_partner.cpa_preset values('${version}','cpa_deposit_amount', '${depositAmount}'), 
                                           ('${version}', 'cpa_bet_amount', '${betAmount}'), 
                                           ('${version}', 'cpa_bet_count', '${betCount}'), 
                                           ('${version}', 'cpa_gambling_amount', '${gamblingAmount}'),
                                           ('${version}', 'cpa_partner_profit', '${partnerProfit}'),
                                           ('${version}', 'cpa_total_amount', '${totalAmount}'),
                                           ('${version}', 'cpa_time_from_registration', '${timeFromReg}');`);
}

export async function getLastPresetNumber() {
  const result = await mysqlConnection.executeQuery('select version from 1win_partner.cpa_preset order by version desc limit 1;');
  return result[0].version;
}
