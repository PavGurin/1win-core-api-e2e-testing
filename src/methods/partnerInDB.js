import { v4 as uuidv4 } from 'uuid';
import { mysqlConnection } from './mysqlConnection';
import { formatDateYyyyMmDdHhIiSs } from './utils';

export async function addFirstDeposit(partnerId, hashId, sourceId, userId, amount, date = new Date(), country = 'ru') {
  const Date = formatDateYyyyMmDdHhIiSs(date);

  const broadcaster_id = uuidv4();
  return mysqlConnection.executeQuery(`insert into 1win_partner.stats_v2(broadcaster_id, partner_id, hash_id, 
                                  source_id, user_id, event, event_value, event_source_id, date, country) 
                                  VALUES('${broadcaster_id}', 
                                         '${partnerId}', '${hashId}', '${sourceId}', '${userId}', 'FIRST_DEPOSIT', 
                                         '${amount}', '${userId}', '${Date}', '${country}')`);
}

export async function addDeposit(partnerId, hashId, sourceId, userId, amount, date = new Date(), country = 'ru') {
  const Date = formatDateYyyyMmDdHhIiSs(date);

  const broadcaster_id = uuidv4();
  return mysqlConnection.executeQuery(`insert into 1win_partner.stats_v2(broadcaster_id, partner_id, hash_id, 
                                  source_id, user_id, event, event_value, event_source_id, date, country) 
                                  VALUES('${broadcaster_id}', 
                                         '${partnerId}', '${hashId}', '${sourceId}', '${userId}', 'DEPOSIT', 
                                         '${amount}', '${userId}', '${Date}', '${country}');`);
}

export async function getLastPresetNumber() {
  const result = await mysqlConnection.executeQuery('select version from 1win_partner.cpa_preset order by version desc limit 1;');
  return result[0].version;
}

export async function createPreset(depositAmount, betCount, betAmount,
  gamblingAmount, totalAmount, timeFromReg, partnerProfit) {
  let presetNumber = await getLastPresetNumber();
  presetNumber++;
  await mysqlConnection.executeQuery(`insert into 1win_partner.cpa_preset values('${presetNumber}','cpa_deposit_amount', '${depositAmount}'), 
                                           ('${presetNumber}', 'cpa_bet_amount', '${betAmount}'), 
                                           ('${presetNumber}', 'cpa_bet_count', '${betCount}'), 
                                           ('${presetNumber}', 'cpa_gambling_amount', '${gamblingAmount}'),
                                           ('${presetNumber}', 'cpa_partner_profit', '${partnerProfit}'),
                                           ('${presetNumber}', 'cpa_total_amount', '${totalAmount}'),
                                           ('${presetNumber}', 'cpa_time_from_registration', '${timeFromReg}');`);
  return presetNumber;
}

export async function addHybridCpaPayment(partnerId) {
  const cpaPayouts = await mysqlConnection.executeQuery(`select * from 1win_partner.stats_v2 where partner_id = '${partnerId}' and event = 'CPA_PAYOUT';`);
  // eslint-disable-next-line no-restricted-syntax
  for await (const payout of cpaPayouts) {
    const broadcaster_id = uuidv4();
    await mysqlConnection.executeQuery(`insert into 1win_partner.stats_v2(broadcaster_id, partner_id, hash_id, 
                                  source_id, user_id, event, event_value, event_source_id, date, country) 
                                  VALUES ('${broadcaster_id}', '${partnerId}', '${payout.hash_id}', '${payout.source_id}', 
                                  '${payout.user_id}', 'PAYMENT', '${payout.event_value}', '${payout.broadcaster_id}', 
                                  '${formatDateYyyyMmDdHhIiSs(new Date())}', '${payout.country}');`);
  }
}
