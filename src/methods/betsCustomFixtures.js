/* eslint no-param-reassign: off */

import { mysqlConnection } from './mysqlConnection';
import { randomNum } from '../randomizer';
import { formatDateYyyyMmDdHhIiSs, rndNumInRange } from './utils';

async function getLastTranslationId() {
  const [res] = await mysqlConnection.executeQuery('select translate_id from 1win_test.custom_translations order by translate_id desc limit 1;', 'custom_bets');
  // console.log(res);
  return res.translate_id;
}

export const betsCustomFixtures = {
  async deafaultLangs() {
    return mysqlConnection.executeQuery('insert into 1win_test.custom_langs (id, value, title_ru, title_world, is_disabled) values(\'1\', \'en\', \'Английский\', \'English\', 0), (\'2\', \'ru\', \'Русский\', \'Russian\', 0);',
      'custom_bets');
  },

  async addLang(value, titleRu, titleEn, isDisabled) {
    return mysqlConnection.executeQuery(`insert into 1win_test.custom_langs(value, title_ru, title_world, is_disabled) 
     values (${value}, ${titleRu}, ${titleEn}, ${isDisabled})`, 'custom_bets');
  },

  async addGroup(titleRu, titleEn, createdAt = formatDateYyyyMmDdHhIiSs(new Date()),
    updatedAt = formatDateYyyyMmDdHhIiSs(new Date()), isDisabled = 0) {
    const rnd = randomNum(10);
    if (!titleRu) { titleRu = `название группы ${rnd}`; }
    if (!titleEn) { titleEn = `group title ${rnd}`; }

    const tid = await getLastTranslationId();

    await mysqlConnection.executeQuery(`insert into 1win_test.custom_translations (translate_id, value, lang_id, is_default) 
          values ('${tid + 1}', '${titleRu}', 2, 1), ('${tid + 1}', '${titleEn}', 1, 0);`, 'custom_bets');

    await mysqlConnection.executeQuery(`insert into 1win_test.custom_groups (title_id, created_at, updated_at, is_disabled, user_author_id) 
     values ('${tid + 1}','${createdAt}', '${updatedAt}', '${isDisabled}', '1001')`, 'custom_bets');

    const [groupId] = await mysqlConnection.executeQuery(`select id from 1win_test.custom_groups where created_at = '${createdAt}' and title_id = '${tid + 1}' ;`, 'custom_bets');
    return {
      titleRu, titleEn, createdAt, updatedAt, id: groupId.id,
    };
  },

  async addEvent(groupId, titleRu, titleEn, descriptionRu, descriptionEn,
    createdAt = formatDateYyyyMmDdHhIiSs(new Date()),
    updatedAt = formatDateYyyyMmDdHhIiSs(new Date()),
    startAt = formatDateYyyyMmDdHhIiSs(new Date()), stopAt, isDisabled = 0) {
    const rnd = randomNum(10);
    if (!titleRu) { titleRu = `название события ${rnd}`; }
    if (!titleEn) { titleEn = `event title ${rnd}`; }
    if (!descriptionRu) { descriptionRu = `описание события ${rnd}`; }
    if (!descriptionEn) { descriptionEn = `event description ${rnd}`; }
    if (!stopAt) {
      stopAt = new Date();
      stopAt.setDate(stopAt.getDate() + 10);
      stopAt = formatDateYyyyMmDdHhIiSs(stopAt);
    }

    const tid = await getLastTranslationId();

    await mysqlConnection.executeQuery(`insert into 1win_test.custom_translations (translate_id, value, lang_id, is_default)
           values ('${tid + 1}', '${titleRu}', 2, 1), ('${tid + 1}', '${titleEn}', 1, 0),
                  ('${tid + 2}', '${descriptionRu}', 2, 1), ('${tid + 2}', '${descriptionEn}', 1, 0)`, 'custom_bets');

    await mysqlConnection.executeQuery(`insert into 1win_test.custom_events (group_id, title_id, created_at, updated_at, 
                                     user_author_id, description_id, start_at, stop_at, is_calculated, is_disabled)
        values ('${groupId}', '${tid + 1}', '${createdAt}', '${updatedAt}', 
                '1001', '${tid + 2}', '${startAt}', '${stopAt}', '0', '${isDisabled}')`, 'custom_bets');

    const [eventId] = await mysqlConnection.executeQuery(`select id from 1win_test.custom_events where created_at = '${createdAt}' and title_id = '${tid + 1}' ;`, 'custom_bets');
    return { // eslint-disable-next-line max-len
      groupId, titleRu, titleEn, descriptionRu, descriptionEn, createdAt, updatedAt, startAt, stopAt, id: eventId.id,
    };
  },

  async addResult(eventId, titleRu, titleEn, descriptionRu, descriptionEn,
    factor = rndNumInRange(1, 10).toFixed(2), isDisabled = 0, outcome = 0,
    createdAt = formatDateYyyyMmDdHhIiSs(new Date()),
    updatedAt = formatDateYyyyMmDdHhIiSs(new Date())) {
    const rnd = randomNum(10);
    if (!titleRu) { titleRu = `название исхода ${rnd}`; }
    if (!titleEn) { titleEn = `result title ${rnd}`; }
    if (!descriptionRu) { descriptionRu = `описание исхода ${rnd}`; }
    if (!descriptionEn) { descriptionEn = `result description ${rnd}`; }

    const tid = await getLastTranslationId();

    await mysqlConnection.executeQuery(`insert into 1win_test.custom_translations (translate_id, value, lang_id, is_default)
           values ('${tid + 1}', '${titleRu}', 2, 1), ('${tid + 1}', '${titleEn}', 1, 0),
                  ('${tid + 2}', '${descriptionRu}', 2, 1), ('${tid + 2}', '${descriptionEn}', 1, 0)`, 'custom_bets');

    await mysqlConnection.executeQuery(`insert into 1win_test.custom_results (event_id, title_id, user_author_id,
                                      factor, is_disabled, outcome, created_at, updated_at, description_id)
        values ('${eventId}', '${tid + 1}', '1001', '${factor}', '${isDisabled}', '${outcome}', '${createdAt}', 
                '${updatedAt}', ${tid + 2})`, 'custom_bets');

    const [resultId] = await mysqlConnection.executeQuery(`select id from 1win_test.custom_results where created_at = '${createdAt}' and factor = '${factor}' ;`, 'custom_bets');
    return {
      eventId,
      titleRu,
      titleEn,
      descriptionRu,
      descriptionEn,
      factor,
      outcome,
      createdAt,
      updatedAt,
      id: resultId.id,
    };
  },

  async createGroupWithEventWithResults(resultsNumber) {
    const group = await this.addGroup();
    const event = await this.addEvent(group.id);
    const num = [...Array(resultsNumber).keys()];
    const results = [];
    for await (const i of num) { // eslint-disable-line no-restricted-syntax
      results.push(await this.addResult(event.id)); // eslint-disable-line no-await-in-loop
    }

    return { group, event, results };
  },

  async setGroupIsDisabled(groupId, isDisabled) {
    return mysqlConnection.executeQuery(`update 1win_test.custom_groups set is_disabled = '${isDisabled}' where id = '${groupId}';`, 'custom_bets');
  },

  async setEventIsDisabled(eventId, isDisabled) {
    return mysqlConnection.executeQuery(`update 1win_test.custom_events set is_disabled = '${isDisabled}' where id = '${eventId}';`, 'custom_bets');
  },

  async setResultIsDisabled(resultId, isDisabled) {
    return mysqlConnection.executeQuery(`update 1win_test.custom_results set is_disabled = '${isDisabled}' where id = '${resultId}';`, 'custom_bets');
  },

  async setEventCalculated(eventId, isCalculated) {
    return mysqlConnection.executeQuery(`update 1win_test.custom_events set is_calculated = '${isCalculated}' where id = '${eventId}';`, 'custom_bets');
  },

  async setEventStopTime(eventId, stopTime) {
    return mysqlConnection.executeQuery(`update 1win_test.custom_events set stop_at = '${stopTime}' where id = '${eventId}';`, 'custom_bets');
  },
};
