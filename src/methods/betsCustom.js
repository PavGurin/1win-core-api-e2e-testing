/**
 *  ДОКА
 *  https://fbet-gitlab.ex2b.co/backend/proposals/issues/2
 */


/* eslint object-shorthand: off */
import { randomNum, randomStr } from '../randomizer';
import { formatDateYyyyMmDdHhIiSs, sleep } from './utils';
import { betsCustomFixtures } from './betsCustomFixtures';

export const betsCustom = {
  /**
   * клиентские запросы
   */
  async langs() {
    return socket.send('MATCH-STORAGE-CUSTOM:match-storage-custom-langs', {});
  },

  async groups() {
    return socket.send('MATCH-STORAGE-CUSTOM:match-storage-custom-groups', {});
  },

  async groupEvents(groupId, withResults = 0) {
    return socket.send('MATCH-STORAGE-CUSTOM:match-storage-custom-events', {
      groupId: groupId,
      withResults: withResults,
    });
  },

  async event(eventId) {
    return socket.send('MATCH-STORAGE-CUSTOM:match-storage-custom-event', {
      id: eventId,
    });
  },

  async makeBetShort(id, amount) {
    return socket.send('BETS:bets-make', {
      betsMap: {
        someString: {
          amount,
          couponList: [
            {
              id,
              providerId: 3,
            },
          ],
        },
      },
    });
  },

  async makeOrdinaryBet(resultId, amount, coeff) {
    return socket.send('BETS:bets-make', {
      betsMap: {
        someString: {
          amount,
          couponList: [
            {
              id: resultId,
              coefficient: coeff,
              providerId: 3,
            },
          ],
        },
      },
    });
  },

  async makeExpressBet(resultIdCoeffArray, amount) {
    const couponList = [];
    resultIdCoeffArray.forEach((item) => {
      couponList.push({
        id: item.id,
        coefficient: item.coeff,
        providerId: 3,
      });
    });
    return socket.send('BETS:bets-make', {
      betsMap: {
        someString: {
          amount,
          couponList: couponList,
        },
      },
    });
  },

  async successfulOrdinaryBet(eventId, results, amount) {
    let stop = new Date();
    stop.setSeconds(stop.getSeconds() + 10);
    stop = formatDateYyyyMmDdHhIiSs(stop, true);

    await betsCustomFixtures.setEventStopTime(eventId, stop);

    const { data } = await this.makeOrdinaryBet(results[0].id, amount, results[0].factor);
    // console.log(data);

    await sleep(10000);
    await betsCustomFixtures.setResultOutcome(results[0].id, 2);
    await betsCustomFixtures.setResultOutcome(results[1].id, 1);
    await sleep(45000);
  },

  async maxBetAmount(resultId, coeff) {
    return socket.send('BETS:bets-maxBetAmount', {
      couponList: [
        {
          id: resultId,
          providerId: 3,
          coefficient: coeff,
          match: {
            categoryId: 0,
            matchId: 0,
            sportId: 0,
            tournamentId: 0,
          },
          odd: {
            coefficient: '',
            outCome: '',
            service: '',
            specialValue: '',
            subTypeId: 0,
            typeId: 0,
          },
        },
      ],
    });
  },

  /**
   * запросы для админки
   * ! не работают,  если на стейдже не отключена проверка на транспорт, ошибка
   * { status: 403, message: 'Access restricted for this transport' }
   */
  async langsAdmin() {
    return socket.send('MATCH-STORAGE-CUSTOM:match-storage-custom-admin-langs', {});
  },

  async groupsAdmin() {
    return socket.send('MATCH-STORAGE-CUSTOM:match-storage-custom-admin-groups', {});
  },

  async groupEventsAdmin(groupId) {
    return socket.send('MATCH-STORAGE-CUSTOM:match-storage-custom-admin-events', {
      groupId: groupId,
    });
  },

  async eventAdmin(eventId) {
    return socket.send('MATCH-STORAGE-CUSTOM:match-storage-custom-admin-event', {
      id: eventId,
    });
  },

  async addGroup(groupNameLangArray) {
    return socket.send('MATCH-STORAGE-CUSTOM:match-storage-custom-admin-groups-add', {
      title: groupNameLangArray,
    });
  },

  async getGroupByTitle(groupTitle) {
    const { data: groups } = await this.groupsAdmin();
    // console.log(groups);
    return groups.find(receivedGroup => receivedGroup.titles
      .some(title => title.value === groupTitle));
  },

  async getGroupById(groupId) {
    const { data: groups } = await this.groupsAdmin();
    return groups.find(receivedGroup => receivedGroup.id === groupId);
  },

  async createGroup(group) {
    if (!group) {
      // eslint-disable-next-line no-param-reassign
      group = [{
        value: `auto group ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      }, {
        value: `авто группа ${randomNum(10)}`,
        langId: 2,
      },
      ];
    }
    await this.addGroup(group);
    return this.getGroupByTitle(group[0].value);
  },

  async changeGroup(groupId, groupNameLangArray, isDisabled) {
    return socket.send('MATCH-STORAGE-CUSTOM:match-storage-custom-admin-groups-change', {
      id: groupId,
      title: groupNameLangArray,
      isDisabled: isDisabled,
    });
  },

  async addEvent(groupId, titlesArray, descriptionsArray, start, stop, resultsArray) {
    return socket.send('MATCH-STORAGE-CUSTOM:match-storage-custom-admin-events-add', {
      groupId: groupId,
      title: titlesArray,
      description: descriptionsArray,
      start: start,
      stop: stop,
      results: resultsArray,
    });
  },

  async allEvents(groupId) {
    const { data } = await socket.send('MATCH-STORAGE-CUSTOM:match-storage-custom-admin-events', {
      groupId,
    });
    return data;
  },

  async addEventHardcode() {
    const data = await socket.send('MATCH-STORAGE-CUSTOM:match-storage-custom-admin-events-add', {
      groupId: 2, // группа исходов
      title: [
        {
          value: 'Успешный деплой',
          langId: 2,
          isDefault: 1, // Обязательный флаг у одного из переводов
        },
        {
          value: 'Successful deploy',
          langId: 1,
        },
      ],
      description: [
        {
          value: 'Пройдет ли деплой без багов',
          langId: 2,
          isDefault: 1, // Обязательный флаг у одного из переводов
        },
        {
          value: 'Will the deploy pass without bugs',
          langId: 1,
        },
      ],
      start: '2020-02-06 11:22:45', // дата старта события строкой такого формата
      stop: '2020-02-29 15:15:36', // дата завершения события строкой такого формата, можно не указывать сразу
      results: [
        {
          title: [
            {
              value: 'Да',
              langId: 2,
              isDefault: 1, // Обязательный флаг у одного из переводов
            },
            {
              value: 'Yes',
              langId: 1,
            },
          ],
          description: [
            {
              value: 'Багов нет',
              langId: 2,
              isDefault: 1, // Обязательный флаг у одного из переводов
            },
            {
              value: 'There are no bugs',
              langId: 1,
            },
          ],
          factor: '10',
        }],
    });
    // console.log(data);
    return data;
  },

  async getEventByTitle(eventGroupId, eventTitle) {
    const { data: events } = await this.groupEventsAdmin(eventGroupId);
    const result = events.find(event => event.titles.some(title => title.value === eventTitle));
    return this.eventAdmin(result.id);
  },

  async createEvent(groupId, eventTitles, eventDescriptions, start, stop, eventResults) {
    /* eslint no-param-reassign:off */
    if (!eventTitles) {
      eventTitles = [{
        value: `auto event ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      }, {
        value: `авто событие ${randomNum(10)}`,
        langId: 2,
      },
      ];
    }

    if (!eventDescriptions) {
      eventDescriptions = [{
        value: `auto event description ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      },
      {
        value: `авто описание события ${randomNum(10)}`,
        langId: 2,
      },
      ];
    }

    if (!start) {
      start = formatDateYyyyMmDdHhIiSs(new Date());
    }

    if (!stop) {
      stop = formatDateYyyyMmDdHhIiSs(new Date());
    }

    if (!eventResults) {
      eventResults = [{
        title: [{
          value: `auto result 1 ${randomNum(10)}`,
          langId: 1,
          isDefault: true,
        }, {
          value: `авто исход 1 ${randomNum(10)}`,
          langId: 2,
        }],
        description: [{
          value: `auto result description 1 ${randomNum(10)}`,
          langId: 1,
          isDefault: true,
        }, {
          value: `авто описание исхода 1 ${randomNum(10)}`,
          langId: 2,
        }],
        factor: (Math.random() * 10).toFixed(2),
      }, {
        title: [{
          value: `auto result 2 ${randomNum(10)}`,
          langId: 1,
          isDefault: true,
        }, {
          value: `авто исход 2 ${randomNum(10)}`,
          langId: 2,
        }],
        description: [{
          value: `auto result description 2 ${randomNum(10)}`,
          langId: 1,
          isDefault: true,
        }, {
          value: `авто описание исхода 2 ${randomNum(10)}`,
          langId: 2,
        }],
        factor: (Math.random() * 10).toFixed(2),
      }];
    }

    await this.addEvent(groupId, eventTitles, eventDescriptions, start, stop, eventResults);
    // await sleep(500);
    const { data: event } = await this.getEventByTitle(groupId, eventTitles[0].value);
    return event;
  },

  async changeEvent(eventId, title, description, start, stop, isDisabled) {
    return socket.send('MATCH-STORAGE-CUSTOM:match-storage-custom-admin-events-change', {
      id: eventId,
      title: title,
      description: description,
      start: start,
      stop: stop,
      isDisabled: isDisabled,
    });
  },

  async changeResult(resultId, titleArray, descriptionArray, factor, outcome,
    isDisabled) {
    return socket.send('MATCH-STORAGE-CUSTOM:match-storage-custom-admin-results-change', {
      id: resultId,
      title: titleArray,
      description: descriptionArray,
      factor: factor,
      outcome: outcome,
      isDisabled: isDisabled,
    });
  },

  async unfinishedEvents(count) {
    return socket.send('MATCH-STORAGE-CUSTOM:match-storage-custom-admin-events-unfinished', {
      count: count,
    });
  },

  async finishEvents(eventIdsArray) {
    return socket.send('MATCH-STORAGE-CUSTOM:match-storage-custom-admin-events-finish', {
      events: eventIdsArray,
    });
  },

  async eventsBulk(eventIdsArray) {
    return socket.send('MATCH-STORAGE-CUSTOM:match-storage-custom-admin-events-bulk', {
      ids: eventIdsArray,
    });
  },


  async resultsBulk(resultIdsArray) {
    return socket.send('MATCH-STORAGE-CUSTOM:match-storage-custom-admin-results-bulk', {
      ids: resultIdsArray,
    });
  },
};
