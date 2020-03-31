import { mysqlConnection } from './mysqlConnection';
import { sleep } from './utils';

// статусы ставки
// 0 = ожидание
// 1 = проиграл
// 2 = выиграл
// 3 = возврат
// 4 = продана

// type, timeOpen, timeClose, device - можно не указывать
export async function addBetToBD(userId, currency, amount, coeff, status,
  type = 'ordinary', timeOpen = new Date() / 1, timeClose = new Date() / 1, device = 'app-android') {
  const profit = status === 2 ? (amount * coeff).toFixed(2) : 0;
  await mysqlConnection.executeQuery(`INSERT INTO 1win.ma_bets(id_user, time_open, time_close, 
                         status, amount, total_coefficient, currency, sys, flags, profit, promo_amount, 
                         betType, device) 
                         VALUES(${userId}, '${timeOpen}', ${timeClose}, ${status}, ${amount}, ${coeff}, 
                                '${currency}', 0, 0, ${profit}, 0, '${type}', '${device}')`);
}

export async function addSoldBetToBD(userId, currency, amount, profit, coeff, type = 'ordinary', timeOpen = new Date() / 1, timeClose = new Date() / 1, device = 'app-android') {
  await mysqlConnection.executeQuery(`INSERT INTO 1win.ma_bets(id_user, time_open, time_close, 
                         status, amount, total_coefficient, currency, sys, flags, profit, promo_amount, 
                         betType, device) 
                         VALUES('${userId}', '${timeOpen}', '${timeClose}', '4', '${amount}', '${coeff}', 
                                '${currency}', '0', '0', '${profit}', '0', '${type}', '${device}')`);
}


export async function getUsersLastBetId(userId) {
  const result = await mysqlConnection.executeQuery(`SELECT id FROM 1win.ma_bets WHERE id_user = ${userId} ORDER BY id DESC LIMIT 1`);
  return result[0].id;
}

export async function getRandomSelection() {
  const selection = await mysqlConnection.executeQuery('SELECT * FROM 1win.ma_selections ORDER BY RAND() LIMIT 1');
  return selection[0];
}

export async function addSelectionToBD(betId, market, matchId, awayTeamId, homeTeamId,
  oddsId, typeId, subType, banker, ways, type,
  odd, line, freeText, matchName, status, voidFactor, description, mtsTicketId, betWinProportion) {
  await mysqlConnection.executeQuery(`INSERT INTO 1win.ma_selections(bet_id, market, match_id, awayteam_id, 
                               hometeam_id, odds_id, type_id, sub_type, banker, ways, type, odd, line, 
                               freetext, match_name, status, void_factor, description, mts_ticket_id, bet_win_proportion) 
                               VALUES ('${betId}', '${market}', '${matchId}', '${awayTeamId}', '${homeTeamId}', '${oddsId}', '${typeId}',
                                       '${subType}', '${banker}', '${ways}', '${type}', '${odd}', '${line}', '${freeText}', 
                                       '${matchName}', '${status}', '${voidFactor}', '${description}', '${mtsTicketId}', 
                                       '${betWinProportion}');`);
}

export async function getSelectionsByBetId(betId) {
  return mysqlConnection.executeQuery(`SELECT id from 1win.ma_selections WHERE bet_id = ${betId};`);
}

export async function setSelectionStatus(selectionId, newStatus) {
  await mysqlConnection.executeQuery(`UPDATE 1win.ma_selections SET status = '${newStatus}' WHERE id = ${selectionId}`);
}

export async function getBet(betId) {
  const result = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_bets WHERE id = ${betId};`);
  return result[0];
}

export async function makeSuccessfulOrdinaryBet(user, currency, amount, coeff) {
  // добавляем ставку для юзера в ma_bets
  await addBetToBD(user.id, currency, amount, coeff, 0, 'ordinary');
  const betId = await getUsersLastBetId(user.id);
  // console.log(betId);

  // копируем рандомный селекшн в ma_selections и привязываем его к ставке
  const selection = await getRandomSelection();
  // selection.description.replace(/.*("coefficient":.*..*)}}.*/, `"coefficient":${coeff}`);
  // console.log(selection);
  await addSelectionToBD(betId, selection.market, selection.match_id, selection.awayteam_id,
    selection.hometeam_id, selection.odds_id, selection.type_id, selection.sub_type,
    selection.banker, selection.ways, selection.type,
    coeff, selection.line, selection.freetext, selection.match_name, 0, selection.void_factor,
    selection.description, selection.mts_ticket_id, selection.bet_win_proportion);
  const selectionId = await getSelectionsByBetId(betId);
  // console.log(selectionId);

  // выставляем селекшену статус = выигрыш
  await setSelectionStatus(selectionId[0].id, 2);

  // ждем, пока отработает скрипт, проставляющий ставке статус такой, как у ее селекшена
  await sleep(60000);

  // достаем из базы ставку
  const bet = await getBet(betId);
  return bet;
}

export async function makeSuccessfulExpressBet(user, currency, amount, coeff) {
  // добавляем ставку для юзера в ma_bets
  await addBetToBD(user.id, currency, amount, coeff, 0, 'express');
  const betId = await getUsersLastBetId(user.id);
  // console.log(betId);

  const coeffs = [1.1, 2, Math.round(coeff / 1.1 / 2 * 100) / 100];

  for (let i = 0; i < 3; i++) {
    /* eslint no-await-in-loop:off */
    // копируем рандомный селекшн в ma_selections и привязываем его к ставке
    const selection = await getRandomSelection();
    // selection.description.replace(/.*("coefficient":.*..*)}}.*/, `"coefficient":${coeff}`);
    // console.log(selection);
    await addSelectionToBD(betId, selection.market, selection.match_id, selection.awayteam_id,
      selection.hometeam_id, selection.odds_id, selection.type_id, selection.sub_type,
      selection.banker, selection.ways, selection.type,
      coeffs[i], selection.line, selection.freetext, selection.match_name, 0, selection.void_factor,
      selection.description, selection.mts_ticket_id, selection.bet_win_proportion);
  }

  const selectionsIds = await getSelectionsByBetId(betId);
  // console.log(selectionsIds);

  // выставляем селекшенам статус = выигрыш
  selectionsIds.forEach(async (selection) => {
    await setSelectionStatus(selection.id, 2);
  });

  // ждем, пока отработает скрипт, проставляющий ставке статус такой, как у ее селекшена
  await sleep(60000);

  // достаем из базы ставку
  const bet = await getBet(betId);
  return bet;
}
