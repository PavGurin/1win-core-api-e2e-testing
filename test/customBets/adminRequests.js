/**
 * { status: 403, message: 'Access restricted for this transport' } на запросы админки
 * поэтому skip
 * чтобы тесты заработали, нужно чтобы для стейджа отключили эту проверку
 */


import { betsCustom } from '../../src/methods/betsCustom';
import {
  checkEventValid, checkGroupEventsValid,
  checkGroupsAdminValid,
  checkEventsBulk, checkResultsBulk,
  checkUnfinishedValid, checkCreatedGroup, checkChangedGroupTitles,
  checkCreatedEvent, checkChangedEvent, checkChangedResult,
} from '../../src/expects/exCustomBetsAdmin';
import { checkLangsValid } from '../../src/expects/exCustomBets';
import { checkErrMsg } from '../../src/responseChecker';
import { randomNum } from '../../src/randomizer';
import { formatDateYyyyMmDdHhIiSs } from '../../src/methods/utils';


describe.skip('Custom bets admin requests tests', () => {
  describe('Langs request', () => {
    it('Langs', async () => {
      const { data } = await betsCustom.langsAdmin();
      // console.log(data);
      checkLangsValid(data);
    });
  });

  describe('Groups request', () => {
    it('Groups', async () => {
      const { data } = await betsCustom.groupsAdmin();
      // console.log(data);
      checkGroupsAdminValid(data);
    });
    it('Disabled groups are displayed', async () => {
      const group = await betsCustom.createGroup();
      await betsCustom.changeGroup(group.id, null, 1);
      const { data } = await betsCustom.groupsAdmin();
      // console.log(data);
      expect(data.find(receivedGroup => receivedGroup.id === group.id)).toBeDefined();
    });
  });

  describe('Group events request', () => {
    it('no groupId', async () => {
      const { data } = await betsCustom.groupEventsAdmin();
      // console.log(data);
      checkErrMsg(data, 400, 'Bad request, groupId is required, no default value provided');
    });
    it('groupId of unexistent group', async () => {
      const { data } = await betsCustom.groupEventsAdmin(548678678);
      // console.log(data);
      expect(JSON.stringify(data)).toEqual('[]');
    });
    it('groupId < 0', async () => {
      const { data } = await betsCustom.groupEventsAdmin(-2);
      // console.log(data);
      expect(JSON.stringify(data)).toEqual('[]');
    });
    it('groupId = float number', async () => {
      const { data } = await betsCustom.groupEventsAdmin(2.7);
      // console.log(data);
      expect(JSON.stringify(data)).toEqual('[]');
    });
    it('groupId = string', async () => {
      const { data } = await betsCustom.groupEventsAdmin('groupId');
      // console.log(data);
      checkErrMsg(data, 400, 'Bad request, groupId should have a type of number, but found string');
    });
    it('correct groupId', async () => {
      const { data } = await betsCustom.groupEventsAdmin(1);
      // console.log(data);
      checkGroupEventsValid(data, 0, 1, true);
    });
    it('disabled events are displayed', async () => {
      const group = await betsCustom.createGroup();
      const event = await betsCustom.createEvent(group.id);
      await betsCustom.changeEvent(event.id, null, null, null, null, 1);
      const { data } = await betsCustom.groupEventsAdmin(group.id);
      // console.log(data);
      expect(data.find(receivedEvent => receivedEvent.id === event.id)).toBeDefined();
    });
  });

  describe('Event', () => {
    it('no id', async () => {
      const { data } = await betsCustom.eventAdmin();
      // console.log(data);
      checkErrMsg(data, 400, 'Bad request, id is required, no default value provided');
    });
    it('id of unexistent event', async () => {
      const { data } = await betsCustom.eventAdmin(965952764674);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });
    it('id = string', async () => {
      const { data } = await betsCustom.eventAdmin('event');
      // console.log(data);
      checkErrMsg(data, 400, 'Bad request, id should have a type of number, but found string');
    });
    it('id < 0', async () => {
      const { data } = await betsCustom.eventAdmin(-5454);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });
    it('id is float', async () => {
      const { data } = await betsCustom.eventAdmin(1.5);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });
    it('correct id', async () => {
      const { data } = await betsCustom.eventAdmin(1);
      // console.log(data);
      checkEventValid(data, 1, 1, true);
    });

    it('disabled event is displayed', async () => {
      const group = await betsCustom.createGroup();
      const event = await betsCustom.createEvent(group.id);
      await betsCustom.changeEvent(event.id, null, null, null, null, 1);
      const { data } = await betsCustom.eventAdmin(event.id);
      // console.log(data);
      checkEventValid(data, 1, event.id, true);
    });
  });

  describe('Unfinished events', () => {
    it('no count', async () => {
      const { data } = await betsCustom.unfinishedEvents();
      // console.log(data);
      checkErrMsg(data, 400, 'Bad request, count is required, no default value provided');
    });
    it('count < 0', async () => {
      const { data } = await betsCustom.unfinishedEvents(-456);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });
    it('count is float', async () => {
      const { data } = await betsCustom.unfinishedEvents(1.5);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });
    it('count = string', async () => {
      const { data } = await betsCustom.unfinishedEvents('string');
      // console.log(data);
      checkErrMsg(data, 400, 'Bad request, count should have a type of number, but found string');
    });
    it('correct count value', async () => {
      const { data } = await betsCustom.unfinishedEvents(5);
      // console.log(data);
      checkUnfinishedValid(data);
    });
  });

  describe('Events bulk request', () => {
    it('no ids', async () => {
      const { data } = await betsCustom.eventsBulk();
      // console.log(data);
      checkErrMsg(data, 400, 'Bad request, ids is required, no default value provided');
    });
    it('ids = string', async () => {
      const { data } = await betsCustom.eventsBulk('jklj');
      // console.log(data);
      checkErrMsg(data, 400, 'Bad request, ids should be array, but found string');
    });
    it('ids = number', async () => {
      const { data } = await betsCustom.eventsBulk(5);
      // console.log(data);
      checkErrMsg(data, 400, 'Bad request, ids should be array, but found number');
    });
    it('ids = object', async () => {
      const { data } = await betsCustom.eventsBulk({ 0: 5 });
      // console.log(data);
      checkErrMsg(data, 400, 'Bad request, ids should be array, but found object');
    });
    it('ids = empty array', async () => {
      const { data } = await betsCustom.eventsBulk([]);
      // console.log(data);
      expect(JSON.stringify(data)).toEqual('[]');
    });
    it('ids = array of invalid numbers', async () => {
      const { data } = await betsCustom.eventsBulk([-1, -2, 4.5]);
      // console.log(data);
      expect(JSON.stringify(data)).toEqual('[]');
    });
    it('ids = array of strings', async () => {
      const { data } = await betsCustom.eventsBulk(['lolo']);
      // console.log(data);
      checkErrMsg(data, 400, 'Bad request, ids[0] should have a type of number, but found string');
    });
    it('ids = array of unexistent ids', async () => {
      const { data } = await betsCustom.eventsBulk([418568476, 544564121]);
      // console.log(data);
      expect(JSON.stringify(data)).toEqual('[]');
    });
    it('one valid id', async () => {
      const { data } = await betsCustom.eventsBulk([3]);
      // console.log(data);
      checkEventsBulk(data, [3]);
    });
    it('several valid ids', async () => {
      const { data } = await betsCustom.eventsBulk([4, 2, 5, 1]);
      // console.log(data);
      checkEventsBulk(data, [1, 2, 4, 5]);
    });
    it('several valid + invalid ids', async () => {
      const { data } = await betsCustom.eventsBulk([4, 5, 52165521, 'abc']);
      // console.log(data);
      checkErrMsg(data, 400, 'Bad request, ids[3] should have a type of number, but found string');
    });
  });

  describe('Results bulk request', () => {
    it('no ids', async () => {
      const { data } = await betsCustom.resultsBulk();
      // console.log(data);
      checkErrMsg(data, 400, 'Bad request, ids is required, no default value provided');
    });
    it('ids = string', async () => {
      const { data } = await betsCustom.resultsBulk('jklj');
      // console.log(data);
      checkErrMsg(data, 400, 'Bad request, ids should be array, but found string');
    });
    it('ids = number', async () => {
      const { data } = await betsCustom.resultsBulk(5);
      // console.log(data);
      checkErrMsg(data, 400, 'Bad request, ids should be array, but found number');
    });
    it('ids = object', async () => {
      const { data } = await betsCustom.resultsBulk({ 0: 5 });
      // console.log(data);
      checkErrMsg(data, 400, 'Bad request, ids should be array, but found object');
    });
    it('ids = empty array', async () => {
      const { data } = await betsCustom.resultsBulk([]);
      // console.log(data);
      expect(JSON.stringify(data)).toEqual('[]');
    });
    it('ids = array of invalid numbers', async () => {
      const { data } = await betsCustom.resultsBulk([-1, -2, 4.5]);
      // console.log(data);
      expect(JSON.stringify(data)).toEqual('[]');
    });
    it('ids = array of strings', async () => {
      const { data } = await betsCustom.resultsBulk(['lolo']);
      // console.log(data);
      checkErrMsg(data, 400, 'Bad request, ids[0] should have a type of number, but found string');
    });
    it('ids = array of unexistent ids', async () => {
      const { data } = await betsCustom.resultsBulk([418568476, 544564121]);
      // console.log(data);
      expect(JSON.stringify(data)).toEqual('[]');
    });
    it('one valid id', async () => {
      const { data } = await betsCustom.resultsBulk([6]);
      // console.log(data);
      checkResultsBulk(data, [6]);
    });
    it('several valid ids', async () => {
      const { data } = await betsCustom.resultsBulk([5, 8, 3, 1]);
      // console.log(data);
      checkResultsBulk(data, [1, 3, 5, 8]);
    });
    it('several valid + invalid ids', async () => {
      const { data } = await betsCustom.resultsBulk([4, 5, 52165521, 'abc']);
      // console.log(data);
      checkErrMsg(data, 400, 'Bad request, ids[3] should have a type of number, but found string');
    });
  });

  describe('Add groups request', () => {
    let groupId;

    beforeEach(() => { groupId = null; });

    // disable created group after each test
    afterEach(async () => {
      if (groupId) {
        await betsCustom.changeGroup(groupId, null, 1);
      }
    });

    it('one translation', async () => {
      const group = [{
        value: `auto group ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      },
      ];

      const { data } = await betsCustom.addGroup(group);
      // console.log(data);
      expect(data.success).toEqual(true);
      groupId = await checkCreatedGroup(group);
    });

    it('one translation, no isDefault', async () => {
      const group = [{
        value: `auto group ${randomNum(10)}`,
        langId: 1,
      },
      ];

      const { data } = await betsCustom.addGroup(group);
      // console.log(data);
      expect(data.success).toEqual(true);
      checkErrMsg(data, 400, 'Неверный запрос');
    });

    it('one translation, no langId', async () => {
      const group = [{
        value: `auto group ${randomNum(10)}`,
        isDefault: true,
      },
      ];

      const { data } = await betsCustom.addGroup(group);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });

    it('one translation, no value', async () => {
      const group = [{
        isDefault: true,
        langId: 1,
      },
      ];

      const { data } = await betsCustom.addGroup(group);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });

    it('one translation, incorrect isDefault value', async () => {
      const group = [{
        value: `auto group ${randomNum(10)}`,
        isDefault: 'default',
        langId: 1,
      },
      ];

      const { data } = await betsCustom.addGroup(group);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });

    it('one translation, incorrect langId value', async () => {
      const group = [{
        value: `auto group ${randomNum(10)}`,
        isDefault: true,
        langId: 'language',
      },
      ];

      const { data } = await betsCustom.addGroup(group);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });

    it('one translation, incorrect value', async () => {
      const group = [{
        value: [],
        isDefault: true,
        langId: 1,
      },
      ];

      const { data } = await betsCustom.addGroup(group);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });

    it('two translations', async () => {
      const group = [{
        value: `auto group ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      }, {
        value: `авто группа ${randomNum(10)}`,
        langId: 2,
      },
      ];

      const { data } = await betsCustom.addGroup(group);
      // console.log(data);
      expect(data.success).toEqual(true);
      groupId = await checkCreatedGroup(group);
    });
    it('two translations, none of them has isDefault', async () => {
      const group = [{
        value: `auto group ${randomNum(10)}`,
        langId: 1,
      }, {
        value: `авто группа ${randomNum(10)}`,
        langId: 2,
      },
      ];

      const { data } = await betsCustom.addGroup(group);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });
    it('two translations, both of them have isDefault', async () => {
      const group = [{
        value: `auto group ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      }, {
        value: `авто группа ${randomNum(10)}`,
        langId: 2,
        isDefault: true,
      },
      ];

      const { data } = await betsCustom.addGroup(group);
      // console.log(data);
      groupId = await checkCreatedGroup(group);
    });
    it('two translations, one of them has incorrect langid', async () => {
      const group = [{
        value: `auto group ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      }, {
        value: `авто группа ${randomNum(10)}`,
        langId: 'qwer',
      },
      ];

      const { data } = await betsCustom.addGroup(group);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });
    it('two translations, one of them has incorrect isDefault', async () => {
      const group = [{
        value: `auto group ${randomNum(10)}`,
        langId: 1,
        isDefault: 'qwer',
      }, {
        value: `авто группа ${randomNum(10)}`,
        langId: 'qwer',
        isDefault: true,
      },
      ];

      const { data } = await betsCustom.addGroup(group);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });
    it('two translations, one of them has incorrect value', async () => {
      const group = [{
        value: [],
        langId: 1,
        isDefault: 'qwer',
      }, {
        value: `авто группа ${randomNum(10)}`,
        langId: 'qwer',
        isDefault: true,
      },
      ];

      const { data } = await betsCustom.addGroup(group);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });
    it('title is object', async () => {
      const group = {
        value: `auto group ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      };

      const { data } = await betsCustom.addGroup(group);
      // console.log(data);
      checkErrMsg(data, 400, 'Bad request, title should be array, but found object');
    });
  });

  describe('Change groups request', () => {
    let group;

    beforeEach(async () => {
      group = await betsCustom.createGroup();
      // console.log(group);
    });

    // disable created group after each test
    afterEach(async () => {
      await betsCustom.changeGroup(group.id, null, 1);
    });

    it('+ Change both titles', async () => {
      const newTitles = [{
        value: `auto changed group ${randomNum(10)}`,
        langId: 1,
      }, {
        value: `авто измененная группа ${randomNum(10)}`,
        langId: 2,
      },
      ];

      const { data: changed } = await betsCustom.changeGroup(group.id, newTitles);
      expect(changed.success).toEqual(true);
      // console.log(newTitles[0].value);
      const changedGroup = await betsCustom.getGroupById(group.id);
      // console.log(changedGroup);
      checkChangedGroupTitles(group, changedGroup, newTitles);
    });
    it('+ Change one title', async () => {
      const newTitle = {
        value: `auto changed group ${randomNum(10)}`,
        langId: 1,
      };

      const { data: changed } = await betsCustom.changeGroup(group.id, [newTitle]);
      expect(changed.success).toEqual(true);
      const changedGroup = await betsCustom.getGroupById(group.id);
      // console.log(changedGroup);
      checkChangedGroupTitles(group, changedGroup, [newTitle, group.titles[1]]);
    });
    it('+ Add title', async () => {
      const groupTitle = [{
        value: `auto group ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      },
      ];

      const newTitle = {
        value: `авто измененная группа ${randomNum(10)}`,
        langId: 2,
      };

      const groupOneTranslation = await betsCustom.createGroup(groupTitle);
      const { data: changed } = await betsCustom.changeGroup(groupOneTranslation.id, [newTitle]);
      expect(changed.success).toEqual(true);
      const changedGroup = await betsCustom.getGroupById(groupOneTranslation.id);
      // console.log(changedGroup);
      checkChangedGroupTitles(groupOneTranslation, changedGroup,
        [...groupOneTranslation.titles, newTitle]);
      await betsCustom.changeGroup(groupOneTranslation.id, null, 1);
    });
    it('- Add title with unexistent lang', async () => {
      const newTitle = {
        value: `auto changed group ${randomNum(10)}`,
        langId: 3,
      };

      const { data: changed } = await betsCustom.changeGroup(group.id, [newTitle]);
      checkErrMsg(changed, 400, 'Неверный запрос');
      const changedGroup = await betsCustom.getGroupById(group.id);
      // console.log(changedGroup);
      checkChangedGroupTitles(group, changedGroup, [...group.titles, newTitle]);
    });
    it('+ Disable group', async () => {
      const { data: changed } = await betsCustom.changeGroup(group.id, null, 1);
      expect(changed.success).toEqual(true);
      const changedGroup = await betsCustom.getGroupById(group.id);
      // console.log(changedGroup);
      expect(changedGroup.isDisabled).toEqual(1);
    });
    it('+ Enable group', async () => {
      await betsCustom.changeGroup(group.id, null, 1);
      const { data: changed } = await betsCustom.changeGroup(group.id, null, 0);
      expect(changed.success).toEqual(true);
      const changedGroup = await betsCustom.getGroupById(group.id);
      // console.log(changedGroup);
      expect(changedGroup.isDisabled).toEqual(0);
    });
    it('- Change isDefault for languages', async () => {
      const newTitles = [{
        value: `auto changed group ${randomNum(10)}`,
        langId: 1,
        isDefault: 0,
      }, {
        value: `авто измененная группа ${randomNum(10)}`,
        langId: 2,
        isDefault: 1,
      },
      ];

      const { data: changed } = await betsCustom.changeGroup(group.id, newTitles);
      // console.log(changed);
      expect(changed.success).toEqual(true);
      const changedGroup = await betsCustom.getGroupById(group.id);
      // console.log(changedGroup);
      checkChangedGroupTitles(group, changedGroup, [{
        value: newTitles[0].value,
        langId: newTitles[0].langId,
        isDefault: group.titles[0].isDefault,
      }, {
        value: newTitles[1].value,
        langId: newTitles[1].langId,
        isDefault: group.titles[1].isDefault,
      }]);
    });
    it('- request without group id', async () => {
      const newTitle = {
        value: `auto changed group ${randomNum(10)}`,
        langId: 3,
      };

      const { data: changed } = await betsCustom.changeGroup(null, [newTitle]);
      checkErrMsg(changed, 400, 'Bad request, id is required, no default value provided');
    });
    it('- request without lang id', async () => {
      const newTitle = {
        value: `auto changed group ${randomNum(10)}`,
      };

      const { data: changed } = await betsCustom.changeGroup(group.id, [newTitle]);
      // console.log(changed);
      checkErrMsg(changed, 400, 'Неверный запрос');
      const changedGroup = await betsCustom.getGroupById(group.id);
      // console.log(changedGroup);
      checkChangedGroupTitles(group, changedGroup, group.titles);
    });
    it('- request without value', async () => {
      const newTitle = {
        langId: 1,
      };

      const { data: changed } = await betsCustom.changeGroup(group.id, [newTitle]);
      // console.log(changed);
      checkErrMsg(changed, 400, 'Неверный запрос');
      const changedGroup = await betsCustom.getGroupById(group.id);
      // console.log(changedGroup);
      checkChangedGroupTitles(group, changedGroup, group.titles);
    });
    it('- incorrect group id', async () => {
      const newTitle = {
        value: `auto changed group ${randomNum(10)}`,
        langId: 3,
      };

      const { data: changed } = await betsCustom.changeGroup('fghfg', [newTitle]);
      // console.log(changed);
      checkErrMsg(changed, 400, 'Bad request, id should have a type of number, but found string');
    });
    it('- incorrect lang id', async () => {
      const newTitle = {
        value: `auto changed group ${randomNum(10)}`,
        langId: 'jkjklkl',
      };

      const { data: changed } = await betsCustom.changeGroup(group.id, [newTitle]);
      // console.log(changed);
      checkErrMsg(changed, 400, 'Неверный запрос');
    });
    it('- incorrect value', async () => {
      const newTitle = {
        value: {},
        langId: 1,
      };

      const { data: changed } = await betsCustom.changeGroup(group.id, [newTitle]);
      // console.log(changed);
      checkErrMsg(changed, 400, 'Неверный запрос');
    });
    it('- incorrect isDisabled value ', async () => {
      const { data: changed } = await betsCustom.changeGroup(group.id, null, 'disabled');
      // console.log(changed);
      checkErrMsg(changed, 400, 'Bad request, isDisabled should have a type of number, but found string');
    });
    it('- isDisabled value != 0 or 1', async () => {
      const { data: changed } = await betsCustom.changeGroup(group.id, null, -45);
      // console.log(changed);
      checkErrMsg(changed, 400, 'Неверный запрос');
      const changedGroup = await betsCustom.getGroupById(group.id);
      // console.log(changedGroup);
      expect(changedGroup.isDisabled).toEqual(0);
    });
  });

  describe('Add events request', () => {
    let groupId;
    let eventId;

    beforeEach(() => { groupId = null; eventId = null; });

    // disable created group after each test
    afterEach(async () => {
      if (groupId) {
        await betsCustom.changeGroup(groupId, null, 1);
        await betsCustom.changeEvent(eventId, null, null, null, null, 1);
      }
    });

    it('+ Add event with results', async () => {
      const eventTitles = [{
        value: `auto event ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      }, {
        value: `авто событие ${randomNum(10)}`,
        langId: 2,
      },
      ];
      const eventDescriptions = [{
        value: `auto event description ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      },
      {
        value: `авто описание события ${randomNum(10)}`,
        langId: 2,
      },
      ];
      const results = [{
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

      const start = formatDateYyyyMmDdHhIiSs(new Date());
      const stop = formatDateYyyyMmDdHhIiSs(new Date());

      // // console.log(start, stop);
      const group = await betsCustom.createGroup();
      groupId = group.id;
      const { data } = await betsCustom.addEvent(group.id,
        eventTitles, eventDescriptions, start, stop, results);
      // console.log(data);
      expect(data.success).toEqual(true);
      eventId = await checkCreatedEvent(group.id,
        eventTitles, eventDescriptions, start, stop, results);
    });

    it('- Add event with no group id', async () => {
      const eventTitles = [{
        value: `auto event ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      }, {
        value: `авто событие ${randomNum(10)}`,
        langId: 2,
      },
      ];
      const eventDescriptions = [{
        value: `auto event description ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      },
      {
        value: `авто описание события ${randomNum(10)}`,
        langId: 2,
      },
      ];
      const results = [{
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

      const start = formatDateYyyyMmDdHhIiSs(new Date());
      const stop = formatDateYyyyMmDdHhIiSs(new Date());

      // // console.log(start, stop);
      const { data } = await betsCustom.addEvent(null,
        eventTitles, eventDescriptions, start, stop, results);
      // console.log(data);
      checkErrMsg(data, 400, 'Bad request, groupId is required, no default value provided');
    });

    it('- Add event with no titles', async () => {
      const eventDescriptions = [{
        value: `auto event description ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      },
      {
        value: `авто описание события ${randomNum(10)}`,
        langId: 2,
      },
      ];
      const results = [{
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

      const start = formatDateYyyyMmDdHhIiSs(new Date());
      const stop = formatDateYyyyMmDdHhIiSs(new Date());

      const group = await betsCustom.createGroup();
      groupId = group.id;
      const { data } = await betsCustom.addEvent(group.id,
        null, eventDescriptions, start, stop, results);
      // console.log(data);
      checkErrMsg(data, 400, 'Bad request, title is required, no default value provided');
    });

    it('- Add event with no descriptions', async () => {
      const eventTitles = [{
        value: `auto event ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      }, {
        value: `авто событие ${randomNum(10)}`,
        langId: 2,
      },
      ];
      const results = [{
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

      const start = formatDateYyyyMmDdHhIiSs(new Date());
      const stop = formatDateYyyyMmDdHhIiSs(new Date());

      // // console.log(start, stop);
      const group = await betsCustom.createGroup();
      groupId = group.id;
      const { data } = await betsCustom.addEvent(group.id,
        eventTitles, null, start, stop, results);
      // console.log(data);
      checkErrMsg(400, data, 'Bad request, description is required, no default value provided');
    });

    it('- Add event with no start', async () => {
      const eventTitles = [{
        value: `auto event ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      }, {
        value: `авто событие ${randomNum(10)}`,
        langId: 2,
      },
      ];
      const eventDescriptions = [{
        value: `auto event description ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      },
      {
        value: `авто описание события ${randomNum(10)}`,
        langId: 2,
      },
      ];
      const results = [{
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

      const stop = formatDateYyyyMmDdHhIiSs(new Date());

      // // console.log(start, stop);
      const group = await betsCustom.createGroup();
      groupId = group.id;
      const { data } = await betsCustom.addEvent(group.id,
        eventTitles, eventDescriptions, null, stop, results);
      // console.log(data);
      checkErrMsg(data, 400, 'Bad request, start is required, no default value provided');
    });

    it('+ Add event with no stop', async () => {
      const eventTitles = [{
        value: `auto event ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      }, {
        value: `авто событие ${randomNum(10)}`,
        langId: 2,
      },
      ];
      const eventDescriptions = [{
        value: `auto event description ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      },
      {
        value: `авто описание события ${randomNum(10)}`,
        langId: 2,
      },
      ];
      const results = [{
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

      const start = formatDateYyyyMmDdHhIiSs(new Date());

      const group = await betsCustom.createGroup();
      groupId = group.id;
      const { data } = await betsCustom.addEvent(group.id,
        eventTitles, eventDescriptions, start, null, results);
      // console.log(data);
      expect(data.success).toEqual(true);
      eventId = await checkCreatedEvent(group.id,
        eventTitles, eventDescriptions, start, null, results);
    });

    it('- Add event with no results', async () => {
      const eventTitles = [{
        value: `auto event ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      }, {
        value: `авто событие ${randomNum(10)}`,
        langId: 2,
      },
      ];
      const eventDescriptions = [{
        value: `auto event description ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      },
      {
        value: `авто описание события ${randomNum(10)}`,
        langId: 2,
      },
      ];

      const start = formatDateYyyyMmDdHhIiSs(new Date());
      const stop = formatDateYyyyMmDdHhIiSs(new Date());

      // // console.log(start, stop);
      const group = await betsCustom.createGroup();
      groupId = group.id;
      const { data } = await betsCustom.addEvent(group.id,
        eventTitles, eventDescriptions, start, stop, null);
      // console.log(data);
      checkErrMsg(data, 400, 'Bad request, results is required, no default value provided');
    });

    it('+ Add event with one translation and isDefault = true', async () => {
      const eventTitles = [{
        value: `auto event ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      }];
      const eventDescriptions = [{
        value: `auto event description ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      }];
      const results = [{
        title: [{
          value: `auto result 1 ${randomNum(10)}`,
          langId: 1,
          isDefault: true,
        }],
        description: [{
          value: `auto result description 1 ${randomNum(10)}`,
          langId: 1,
          isDefault: true,
        }],
        factor: (Math.random() * 10).toFixed(2),
      }];

      const start = formatDateYyyyMmDdHhIiSs(new Date());
      const stop = formatDateYyyyMmDdHhIiSs(new Date());

      // // console.log(start, stop);
      const group = await betsCustom.createGroup();
      groupId = group.id;
      const { data } = await betsCustom.addEvent(group.id,
        eventTitles, eventDescriptions, start, stop, results);
      // console.log(data);
      expect(data.success).toEqual(true);
      eventId = await checkCreatedEvent(group.id,
        eventTitles, eventDescriptions, start, stop, results);
    });

    it('- Add event with one translation and no isDefault', async () => {
      const eventTitles = [{
        value: `auto event ${randomNum(10)}`,
        langId: 1,
      }];
      const eventDescriptions = [{
        value: `auto event description ${randomNum(10)}`,
        langId: 1,
      }];
      const results = [{
        title: [{
          value: `auto result 1 ${randomNum(10)}`,
          langId: 1,
        }],
        description: [{
          value: `auto result description 1 ${randomNum(10)}`,
          langId: 1,
        }],
        factor: (Math.random() * 10).toFixed(2),
      }];

      const start = formatDateYyyyMmDdHhIiSs(new Date());
      const stop = formatDateYyyyMmDdHhIiSs(new Date());

      // // console.log(start, stop);
      const group = await betsCustom.createGroup();
      groupId = group.id;
      const { data } = await betsCustom.addEvent(group.id,
        eventTitles, eventDescriptions, start, stop, results);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });

    it('- Add event with one translation and no value', async () => {
      const eventTitles = [{
        langId: 1,
        isDefault: true,
      }];
      const eventDescriptions = [{
        value: `auto event description ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      }];
      const results = [{
        title: [{
          value: `auto result 1 ${randomNum(10)}`,
          langId: 1,
          isDefault: true,
        }],
        description: [{
          value: `auto result description 1 ${randomNum(10)}`,
          langId: 1,
          isDefault: true,
        }],
        factor: (Math.random() * 10).toFixed(2),
      }];

      const start = formatDateYyyyMmDdHhIiSs(new Date());
      const stop = formatDateYyyyMmDdHhIiSs(new Date());

      // // console.log(start, stop);
      const group = await betsCustom.createGroup();
      groupId = group.id;
      const { data } = await betsCustom.addEvent(group.id,
        eventTitles, eventDescriptions, start, stop, results);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });

    it('- Add event with one translation and no langId', async () => {
      const eventTitles = [{
        value: `auto event description ${randomNum(10)}`,
        isDefault: true,
      }];
      const eventDescriptions = [{
        value: `auto event description ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      }];
      const results = [{
        title: [{
          value: `auto result 1 ${randomNum(10)}`,
          langId: 1,
          isDefault: true,
        }],
        description: [{
          value: `auto result description 1 ${randomNum(10)}`,
          langId: 1,
          isDefault: true,
        }],
        factor: (Math.random() * 10).toFixed(2),
      }];

      const start = formatDateYyyyMmDdHhIiSs(new Date());
      const stop = formatDateYyyyMmDdHhIiSs(new Date());

      // // console.log(start, stop);
      const group = await betsCustom.createGroup();
      groupId = group.id;
      const { data } = await betsCustom.addEvent(group.id,
        eventTitles, eventDescriptions, start, stop, results);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });

    it('- Add event with no description value', async () => {
      const eventTitles = [{
        value: `auto event description ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      }];
      const eventDescriptions = [{
        langId: 1,
        isDefault: true,
      }];
      const results = [{
        title: [{
          value: `auto result 1 ${randomNum(10)}`,
          langId: 1,
          isDefault: true,
        }],
        description: [{
          value: `auto result description 1 ${randomNum(10)}`,
          langId: 1,
          isDefault: true,
        }],
        factor: (Math.random() * 10).toFixed(2),
      }];

      const start = formatDateYyyyMmDdHhIiSs(new Date());
      const stop = formatDateYyyyMmDdHhIiSs(new Date());

      // // console.log(start, stop);
      const group = await betsCustom.createGroup();
      groupId = group.id;
      const { data } = await betsCustom.addEvent(group.id,
        eventTitles, eventDescriptions, start, stop, results);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });

    it('- Add event with no description langId', async () => {
      const eventTitles = [{
        value: `auto event description ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      }];
      const eventDescriptions = [{
        value: `auto event description ${randomNum(10)}`,
        isDefault: true,
      }];
      const results = [{
        title: [{
          value: `auto result 1 ${randomNum(10)}`,
          langId: 1,
          isDefault: true,
        }],
        description: [{
          value: `auto result description 1 ${randomNum(10)}`,
          langId: 1,
          isDefault: true,
        }],
        factor: (Math.random() * 10).toFixed(2),
      }];

      const start = formatDateYyyyMmDdHhIiSs(new Date());
      const stop = formatDateYyyyMmDdHhIiSs(new Date());

      // // console.log(start, stop);
      const group = await betsCustom.createGroup();
      groupId = group.id;
      const { data } = await betsCustom.addEvent(group.id,
        eventTitles, eventDescriptions, start, stop, results);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });

    it('- Add event with no description isDefault', async () => {
      const eventTitles = [{
        value: `auto event description ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      }];
      const eventDescriptions = [{
        value: `auto event description ${randomNum(10)}`,
        langId: 1,
      }];
      const results = [{
        title: [{
          value: `auto result 1 ${randomNum(10)}`,
          langId: 1,
          isDefault: true,
        }],
        description: [{
          value: `auto result description 1 ${randomNum(10)}`,
          langId: 1,
          isDefault: true,
        }],
        factor: (Math.random() * 10).toFixed(2),
      }];

      const start = formatDateYyyyMmDdHhIiSs(new Date());
      const stop = formatDateYyyyMmDdHhIiSs(new Date());

      // // console.log(start, stop);
      const group = await betsCustom.createGroup();
      groupId = group.id;
      const { data } = await betsCustom.addEvent(group.id,
        eventTitles, eventDescriptions, start, stop, results);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });

    it('- Add event with incorrect start', async () => {
      const eventTitles = [{
        value: `auto event description ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      }];
      const eventDescriptions = [{
        value: `auto event description ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      }];
      const results = [{
        title: [{
          value: `auto result 1 ${randomNum(10)}`,
          langId: 1,
          isDefault: true,
        }],
        description: [{
          value: `auto result description 1 ${randomNum(10)}`,
          langId: 1,
          isDefault: true,
        }],
        factor: (Math.random() * 10).toFixed(2),
      }];

      const start = '01/02/2020';
      const stop = formatDateYyyyMmDdHhIiSs(new Date());

      // // console.log(start, stop);
      const group = await betsCustom.createGroup();
      groupId = group.id;
      const { data } = await betsCustom.addEvent(group.id,
        eventTitles, eventDescriptions, start, stop, results);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });

    it('- Add event with incorrect stop', async () => {
      const eventTitles = [{
        value: `auto event description ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      }];
      const eventDescriptions = [{
        value: `auto event description ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      }];
      const results = [{
        title: [{
          value: `auto result 1 ${randomNum(10)}`,
          langId: 1,
          isDefault: true,
        }],
        description: [{
          value: `auto result description 1 ${randomNum(10)}`,
          langId: 1,
          isDefault: true,
        }],
        factor: (Math.random() * 10).toFixed(2),
      }];

      const start = formatDateYyyyMmDdHhIiSs(new Date());
      const stop = '05/05/2021';

      // // console.log(start, stop);
      const group = await betsCustom.createGroup();
      groupId = group.id;
      const { data } = await betsCustom.addEvent(group.id,
        eventTitles, eventDescriptions, start, stop, results);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });

    it('- Add event with no results title value', async () => {
      const eventTitles = [{
        value: `auto event description ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      }];
      const eventDescriptions = [{
        value: `auto event description ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      }];
      const results = [{
        title: [{
          langId: 1,
          isDefault: true,
        }],
        description: [{
          value: `auto result description 1 ${randomNum(10)}`,
          langId: 1,
          isDefault: true,
        }],
        factor: (Math.random() * 10).toFixed(2),
      }];

      const start = formatDateYyyyMmDdHhIiSs(new Date());
      const stop = formatDateYyyyMmDdHhIiSs(new Date());

      // // console.log(start, stop);
      const group = await betsCustom.createGroup();
      groupId = group.id;
      const { data } = await betsCustom.addEvent(group.id,
        eventTitles, eventDescriptions, start, stop, results);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });

    it('- Add event with no results title langId', async () => {
      const eventTitles = [{
        value: `auto event description ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      }];
      const eventDescriptions = [{
        value: `auto event description ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      }];
      const results = [{
        title: [{
          value: `auto result 1 ${randomNum(10)}`,
          isDefault: true,
        }],
        description: [{
          value: `auto result description 1 ${randomNum(10)}`,
          langId: 1,
          isDefault: true,
        }],
        factor: (Math.random() * 10).toFixed(2),
      }];

      const start = formatDateYyyyMmDdHhIiSs(new Date());
      const stop = formatDateYyyyMmDdHhIiSs(new Date());

      // // console.log(start, stop);
      const group = await betsCustom.createGroup();
      groupId = group.id;
      const { data } = await betsCustom.addEvent(group.id,
        eventTitles, eventDescriptions, start, stop, results);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });

    it('- Add event with no results title isDefault', async () => {
      const eventTitles = [{
        value: `auto event description ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      }];
      const eventDescriptions = [{
        value: `auto event description ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      }];
      const results = [{
        title: [{
          value: `auto result 1 ${randomNum(10)}`,
          langId: 1,
        }],
        description: [{
          value: `auto result description 1 ${randomNum(10)}`,
          langId: 1,
          isDefault: true,
        }],
        factor: (Math.random() * 10).toFixed(2),
      }];

      const start = formatDateYyyyMmDdHhIiSs(new Date());
      const stop = formatDateYyyyMmDdHhIiSs(new Date());

      // // console.log(start, stop);
      const group = await betsCustom.createGroup();
      groupId = group.id;
      const { data } = await betsCustom.addEvent(group.id,
        eventTitles, eventDescriptions, start, stop, results);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });

    it('- Add event with no results description value', async () => {
      const eventTitles = [{
        value: `auto event description ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      }];
      const eventDescriptions = [{
        value: `auto event description ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      }];
      const results = [{
        title: [{
          value: `auto result 1 ${randomNum(10)}`,
          langId: 1,
          isDefault: true,
        }],
        description: [{
          langId: 1,
          isDefault: true,
        }],
        factor: (Math.random() * 10).toFixed(2),
      }];

      const start = formatDateYyyyMmDdHhIiSs(new Date());
      const stop = formatDateYyyyMmDdHhIiSs(new Date());

      // // console.log(start, stop);
      const group = await betsCustom.createGroup();
      groupId = group.id;
      const { data } = await betsCustom.addEvent(group.id,
        eventTitles, eventDescriptions, start, stop, results);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });

    it('- Add event with no results description langId', async () => {
      const eventTitles = [{
        value: `auto event description ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      }];
      const eventDescriptions = [{
        value: `auto event description ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      }];
      const results = [{
        title: [{
          value: `auto result 1 ${randomNum(10)}`,
          langId: 1,
          isDefault: true,
        }],
        description: [{
          value: `auto result description 1 ${randomNum(10)}`,
          isDefault: true,
        }],
        factor: (Math.random() * 10).toFixed(2),
      }];

      const start = formatDateYyyyMmDdHhIiSs(new Date());
      const stop = formatDateYyyyMmDdHhIiSs(new Date());

      // // console.log(start, stop);
      const group = await betsCustom.createGroup();
      groupId = group.id;
      const { data } = await betsCustom.addEvent(group.id,
        eventTitles, eventDescriptions, start, stop, results);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });

    it('- Add event with no results description isDefault', async () => {
      const eventTitles = [{
        value: `auto event description ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      }];
      const eventDescriptions = [{
        value: `auto event description ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      }];
      const results = [{
        title: [{
          value: `auto result 1 ${randomNum(10)}`,
          langId: 1,
          isDefault: true,
        }],
        description: [{
          value: `auto result description 1 ${randomNum(10)}`,
          langId: 1,
        }],
        factor: (Math.random() * 10).toFixed(2),
      }];

      const start = formatDateYyyyMmDdHhIiSs(new Date());
      const stop = formatDateYyyyMmDdHhIiSs(new Date());

      // // console.log(start, stop);
      const group = await betsCustom.createGroup();
      groupId = group.id;
      const { data } = await betsCustom.addEvent(group.id,
        eventTitles, eventDescriptions, start, stop, results);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });

    it('- Add event with no results factor', async () => {
      const eventTitles = [{
        value: `auto event description ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      }];
      const eventDescriptions = [{
        value: `auto event description ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      }];
      const results = [{
        title: [{
          value: `auto result 1 ${randomNum(10)}`,
          langId: 1,
          isDefault: true,
        }],
        description: [{
          value: `auto result description 1 ${randomNum(10)}`,
          langId: 1,
          isDefault: true,
        }],
      }];

      const start = formatDateYyyyMmDdHhIiSs(new Date());
      const stop = formatDateYyyyMmDdHhIiSs(new Date());

      // // console.log(start, stop);
      const group = await betsCustom.createGroup();
      groupId = group.id;
      const { data } = await betsCustom.addEvent(group.id,
        eventTitles, eventDescriptions, start, stop, results);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });

    it('- Add event with incorrect factor', async () => {
      const eventTitles = [{
        value: `auto event description ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      }];
      const eventDescriptions = [{
        value: `auto event description ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      }];
      const results = [{
        title: [{
          value: `auto result 1 ${randomNum(10)}`,
          langId: 1,
          isDefault: true,
        }],
        description: [{
          value: `auto result description 1 ${randomNum(10)}`,
          langId: 1,
          isDefault: true,
        }],
        factor: 'abcdef',
      }];

      const start = formatDateYyyyMmDdHhIiSs(new Date());
      const stop = formatDateYyyyMmDdHhIiSs(new Date());

      // // console.log(start, stop);
      const group = await betsCustom.createGroup();
      groupId = group.id;
      const { data } = await betsCustom.addEvent(group.id,
        eventTitles, eventDescriptions, start, stop, results);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });

    it('+ Add event with factor = number', async () => {
      const eventTitles = [{
        value: `auto event description ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      }];
      const eventDescriptions = [{
        value: `auto event description ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      }];
      const results = [{
        title: [{
          value: `auto result 1 ${randomNum(10)}`,
          langId: 1,
          isDefault: true,
        }],
        description: [{
          value: `auto result description 1 ${randomNum(10)}`,
          langId: 1,
          isDefault: true,
        }],
        factor: 5.47,
      }];

      const start = formatDateYyyyMmDdHhIiSs(new Date());
      const stop = formatDateYyyyMmDdHhIiSs(new Date());

      // // console.log(start, stop);
      const group = await betsCustom.createGroup();
      groupId = group.id;
      const { data } = await betsCustom.addEvent(group.id,
        eventTitles, eventDescriptions, start, stop, results);
      // console.log(data);
      expect(data.success).toEqual(true);
      results[0].factor = results[0].factor.toString();
      eventId = await checkCreatedEvent(group.id,
        eventTitles, eventDescriptions, start, stop, results);
    });

    it('- Add event with start > stop', async () => {
      const eventTitles = [{
        value: `auto event ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      }];
      const eventDescriptions = [{
        value: `auto event description ${randomNum(10)}`,
        langId: 1,
        isDefault: true,
      }];
      const results = [{
        title: [{
          value: `auto result 1 ${randomNum(10)}`,
          langId: 1,
          isDefault: true,
        }],
        description: [{
          value: `auto result description 1 ${randomNum(10)}`,
          langId: 1,
          isDefault: true,
        }],
        factor: (Math.random() * 10).toFixed(2),
      }];

      const stop = formatDateYyyyMmDdHhIiSs(new Date());
      let startDate = new Date();
      startDate = startDate.setDate(startDate.getDate() + 1);
      const start = formatDateYyyyMmDdHhIiSs(new Date(startDate));

      const group = await betsCustom.createGroup();
      groupId = group.id;
      const { data } = await betsCustom.addEvent(group.id,
        eventTitles, eventDescriptions, start, stop, results);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });
  });

  describe('Change event request', () => {
    let group;
    let event;

    // disable created group after each test
    afterEach(async () => {
      await betsCustom.changeGroup(group.id, null, 1);
      await betsCustom.changeEvent(event.id, null, null, null, null, 1);
    });

    it('- change without eventId', async () => {
      const newTitle = { value: `авто измененное событие ${randomNum(10)}`, langId: 2 };

      group = await betsCustom.createGroup();
      event = await betsCustom.createEvent(group.id);
      const { data } = await betsCustom.changeEvent(null, [newTitle]);
      // console.log(data);
      checkErrMsg(data, 400, 'Bad request, id is required, no default value provided');
      const { data: eventAfterChange } = await betsCustom.eventAdmin(event.id);
      expect(eventAfterChange).toEqual(event);
    });

    it('+ change title', async () => {
      const newTitle = { value: `авто измененное событие ${randomNum(10)}`, langId: 2 };

      group = await betsCustom.createGroup();
      event = await betsCustom.createEvent(group.id);
      const { data } = await betsCustom.changeEvent(event.id, [newTitle]);
      // console.log(data);
      expect(data.success).toEqual(true);
      const { data: eventAfterChange } = await betsCustom.eventAdmin(event.id);
      checkChangedEvent(event, eventAfterChange, [event.titles[0], newTitle]);
    });

    it('+ add title', async () => {
      const newTitle = { value: `added title ${randomNum(10)}`, langId: 2 };

      group = await betsCustom.createGroup();
      event = await betsCustom.createEvent(group.id, [{ value: `auto event ${randomNum(10)}`, langId: 1, isDefault: 1 }]);
      const { data } = await betsCustom.changeEvent(event.id, [newTitle]);
      // console.log(data);
      expect(data.success).toEqual(true);
      const { data: eventAfterChange } = await betsCustom.eventAdmin(event.id);
      checkChangedEvent(event, eventAfterChange, [...event.titles, newTitle]);
    });

    it('- add title for unexistent lang', async () => {
      const newTitle = { value: 'qweqwe', langId: 55 };

      group = await betsCustom.createGroup();
      event = await betsCustom.createEvent(group.id);
      const { data } = await betsCustom.changeEvent(event.id, [newTitle]);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
      const { data: eventAfterChange } = await betsCustom.eventAdmin(event.id);
      expect(eventAfterChange).toEqual(event);
    });

    it('- change title without value', async () => {
      const newTitle = { langId: 2 };

      group = await betsCustom.createGroup();
      event = await betsCustom.createEvent(group.id);
      const { data } = await betsCustom.changeEvent(event.id, [newTitle]);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
      const { data: eventAfterChange } = await betsCustom.eventAdmin(event.id);
      expect(eventAfterChange).toEqual(event);
    });

    it('- change title without lang id', async () => {
      const newTitle = { value: 'qweqwe' };

      group = await betsCustom.createGroup();
      event = await betsCustom.createEvent(group.id);
      const { data } = await betsCustom.changeEvent(event.id, [newTitle]);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
      const { data: eventAfterChange } = await betsCustom.eventAdmin(event.id);
      expect(eventAfterChange).toEqual(event);
    });

    it('+ change description', async () => {
      const newDesc = { value: `авто измененное описание ${randomNum(10)}`, langId: 2 };

      group = await betsCustom.createGroup();
      event = await betsCustom.createEvent(group.id);
      const { data } = await betsCustom.changeEvent(event.id, null, [newDesc]);
      // console.log(data);
      expect(data.success).toEqual(true);
      const { data: eventAfterChange } = await betsCustom.eventAdmin(event.id);
      checkChangedEvent(event, eventAfterChange, null, [event.descriptions[0], newDesc]);
    });

    it('+ add description', async () => {
      const newDesc = { value: `added description ${randomNum(10)}`, langId: 2 };

      group = await betsCustom.createGroup();
      event = await betsCustom.createEvent(group.id, null, [{ value: `auto event ${randomNum(10)}`, langId: 1, isDefault: 1 }]);
      const { data } = await betsCustom.changeEvent(event.id, null, [newDesc]);
      // console.log(data);
      expect(data.success).toEqual(true);
      const { data: eventAfterChange } = await betsCustom.eventAdmin(event.id);
      checkChangedEvent(event, eventAfterChange, null, [...event.descriptions, newDesc]);
    });

    it('- add deswcription for unexistent lang', async () => {
      const newDesc = { value: 'qweqwe', langId: 55 };

      group = await betsCustom.createGroup();
      event = await betsCustom.createEvent(group.id);
      const { data } = await betsCustom.changeEvent(event.id, null, [newDesc]);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
      const { data: eventAfterChange } = await betsCustom.eventAdmin(event.id);
      expect(eventAfterChange).toEqual(event);
    });

    it('- change description without value', async () => {
      const newDesc = { langId: 2 };

      group = await betsCustom.createGroup();
      event = await betsCustom.createEvent(group.id);
      const { data } = await betsCustom.changeEvent(event.id, null, [newDesc]);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
      const { data: eventAfterChange } = await betsCustom.eventAdmin(event.id);
      expect(eventAfterChange).toEqual(event);
    });

    it('- change description without lang id', async () => {
      const newDesc = { value: 'qweqwe' };

      group = await betsCustom.createGroup();
      event = await betsCustom.createEvent(group.id);
      const { data } = await betsCustom.changeEvent(event.id, null, [newDesc]);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
      const { data: eventAfterChange } = await betsCustom.eventAdmin(event.id);
      expect(eventAfterChange).toEqual(event);
    });

    it('+ change start', async () => {
      let newStart = new Date();
      newStart.setDate(newStart.getHours() - 1);
      newStart = formatDateYyyyMmDdHhIiSs(newStart);

      group = await betsCustom.createGroup();
      event = await betsCustom.createEvent(group.id);
      const { data } = await betsCustom.changeEvent(event.id, null, null, newStart);
      // console.log(data);
      expect(data.success).toEqual(true);
      const { data: eventAfterChange } = await betsCustom.eventAdmin(event.id);
      checkChangedEvent(event, eventAfterChange, null, null, newStart);
    });

    it('- invalid start value', async () => {
      group = await betsCustom.createGroup();
      event = await betsCustom.createEvent(group.id);
      const { data } = await betsCustom.changeEvent(event.id, null, null, '02/20/2026');
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });

    it('+ change stop', async () => {
      let newStop = new Date();
      newStop.setDate(newStop.getHours() + 1);
      newStop = formatDateYyyyMmDdHhIiSs(newStop);

      group = await betsCustom.createGroup();
      event = await betsCustom.createEvent(group.id);
      const { data } = await betsCustom.changeEvent(event.id, null, null, null, newStop);
      // console.log(data);
      expect(data.success).toEqual(true);
      const { data: eventAfterChange } = await betsCustom.eventAdmin(event.id);
      checkChangedEvent(event, eventAfterChange, null, null, null, newStop);
    });

    it('- invalid stop value', async () => {
      group = await betsCustom.createGroup();
      event = await betsCustom.createEvent(group.id);
      const { data } = await betsCustom.changeEvent(event.id, null, null, null, '02/20/2026');
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });

    it('- start time after stop time', async () => {
      let date = new Date();
      date.setDate(date.getDate() - 1);
      date = formatDateYyyyMmDdHhIiSs(new Date(date));

      group = await betsCustom.createGroup();
      event = await betsCustom.createEvent(group.id);
      const { data } = await betsCustom.changeEvent(event.id, null, null, new Date(), date);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });

    it('+ Disable event', async () => {
      group = await betsCustom.createGroup();
      event = await betsCustom.createEvent(group.id);
      const { data } = await betsCustom.changeEvent(event.id, null, null, null, null, 1);
      // console.log(data);
      expect(data.success).toEqual(true);
      const { data: eventAfterChange } = await betsCustom.eventAdmin(event.id);
      checkChangedEvent(event, eventAfterChange, null, null, null, null, 1);
    });

    it('+ Enable event', async () => {
      group = await betsCustom.createGroup();
      event = await betsCustom.createEvent(group.id);
      await betsCustom.changeEvent(event.id, null, null, null, null, 1);
      const { data } = await betsCustom.changeEvent(event.id, null, null, null, null, 0);
      // console.log(data);
      expect(data.success).toEqual(true);
      const { data: eventAfterChange } = await betsCustom.eventAdmin(event.id);
      checkChangedEvent(event, eventAfterChange, null, null, null, null, 0);
    });

    it('- isDisabled is string', async () => {
      group = await betsCustom.createGroup();
      event = await betsCustom.createEvent(group.id);
      const { data } = await betsCustom.changeEvent(event.id, null, null, null, null, 'disabled');
      // console.log(data);
      checkErrMsg(data, 400, 'Bad request, isDisabled should have a type of number, but found string');
    });

    it('- isDisabled != 0 and 1', async () => {
      group = await betsCustom.createGroup();
      event = await betsCustom.createEvent(group.id);
      const { data } = await betsCustom.changeEvent(event.id, null, null, null, null, 15);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });

    it('- change default for titles', async () => {
      const newTitles = [{
        value: `auto changed event ${randomNum(10)}`,
        langId: 1,
        isDefault: 0,
      }, {
        value: `авто измененное событие ${randomNum(10)}`,
        langId: 2,
        isDefault: 1,
      },
      ];

      group = await betsCustom.createGroup();
      event = await betsCustom.createEvent(group.id);
      const { data } = await betsCustom.changeEvent(event.id, newTitles);
      // console.log(data);
      expect(data.success).toEqual(true);
      const { data: eventAfterChange } = await betsCustom.eventAdmin(event.id);
      checkChangedEvent(event, eventAfterChange, [{
        value: newTitles[0].value,
        langId: newTitles[0].langId,
        isDefault: event.titles[0].isDefault,
      }, {
        value: newTitles[1].value,
        langId: newTitles[1].langId,
        isDefault: event.titles[1].isDefault,
      }]);
    });

    it('- change default for descriptions', async () => {
      const newDesc = [{
        value: `auto changed description ${randomNum(10)}`,
        langId: 1,
        isDefault: 0,
      }, {
        value: `авто измененное описание ${randomNum(10)}`,
        langId: 2,
        isDefault: 1,
      },
      ];

      group = await betsCustom.createGroup();
      event = await betsCustom.createEvent(group.id);
      const { data } = await betsCustom.changeEvent(event.id, null, newDesc);
      // console.log(data);
      expect(data.success).toEqual(true);
      const { data: eventAfterChange } = await betsCustom.eventAdmin(event.id);
      checkChangedEvent(event, eventAfterChange, null, [{
        value: newDesc[0].value,
        langId: newDesc[0].langId,
        isDefault: event.titles[0].isDefault,
      }, {
        value: newDesc[1].value,
        langId: newDesc[1].langId,
        isDefault: event.titles[1].isDefault,
      }]);
    });

    it('+ Change all fileds at once', async () => {
      const newTitles = [{
        value: `auto changed event ${randomNum(10)}`,
        langId: 1,
        isDefault: 0,
      }, {
        value: `авто измененное событие ${randomNum(10)}`,
        langId: 2,
        isDefault: 1,
      },
      ];
      const newDesc = [{
        value: `auto changed event description ${randomNum(10)}`,
        langId: 1,
        isDefault: 0,
      }, {
        value: `авто измененное описание события ${randomNum(10)}`,
        langId: 2,
        isDefault: 1,
      },
      ];

      let newStart = new Date();
      newStart.setDate(newStart.getHours() - 1);
      newStart = formatDateYyyyMmDdHhIiSs(newStart);

      let newStop = new Date();
      newStop.setDate(newStop.getHours() + 1);
      newStop = formatDateYyyyMmDdHhIiSs(newStop);

      group = await betsCustom.createGroup();
      event = await betsCustom.createEvent(group.id);
      const { data } = await betsCustom.changeEvent(event.id, newTitles, newDesc,
        newStart, newStop, 1);
      // console.log(data);
      expect(data.success).toEqual(true);
      const { data: eventAfterChange } = await betsCustom.eventAdmin(event.id);
      checkChangedEvent(event, eventAfterChange, newTitles, newDesc, newStart, newStop, 1);
    });

    it('- add result', async () => {
      // в первой версии не поддерживается, проверка что запрс не падает с ошибкой
      group = await betsCustom.createGroup();
      event = await betsCustom.createEvent(group.id, null, null, null, null, []);
      const { data } = await socket.send('MATCH-STORAGE-CUSTOM:match-storage-custom-admin-events-change', {
        id: event.id,
        results: [{
          title: [{ value: 'new result', langId: 1, isDefault: true }],
          description: [{ value: 'new description', langId: 1, isDefault: true }],
          factor: '6',
        }],
      });
      // console.log(data);
      expect(data.success).toEqual(true);
    });
  });

  describe('Change results request', () => {
    let group;
    let event;
    let results;

    beforeEach(async () => {
      group = await betsCustom.createGroup();
      event = await betsCustom.createEvent(group.id);
      results = event.results; // eslint-disable-line prefer-destructuring
      // console.log(results);
    });

    // disable created group after each test
    afterEach(async () => {
      await betsCustom.changeGroup(group.id, null, 1);
      await betsCustom.changeEvent(event.id, null, null, null, null, 1);
    });

    it('+ Change title', async () => {
      const newTitle = { value: `auto changed result 1 ${randomNum(10)}`, langId: 1 };

      const { data } = await betsCustom.changeResult(results[0].id, [newTitle]);
      // console.log(data);
      expect(data.success).toEqual(true);
      const { data: { results: resultsAfterChange } } = await betsCustom.eventAdmin(event.id);
      checkChangedResult(results[0], resultsAfterChange[0], [newTitle, results[0].titles[1]]);
    });

    it('- no title value', async () => {
      const newTitle = { langId: 1 };

      const { data } = await betsCustom.changeResult(results[0].id, [newTitle]);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });

    it('- no title langId', async () => {
      const newTitle = { value: `auto changed result 1 ${randomNum(10)}` };

      const { data } = await betsCustom.changeResult(results[0].id, [newTitle]);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });

    it('- title isDefault is not changed', async () => {
      const newTitle = { value: `auto changed result 1 ${randomNum(10)}`, langId: 1, isDefault: false };

      const { data } = await betsCustom.changeResult(results[0].id, [newTitle]);
      expect(data.success).toEqual(true);
      const { data: { results: resultsAfterChange } } = await betsCustom.eventAdmin(event.id);
      checkChangedResult(results[0], resultsAfterChange[0],
        [{ value: newTitle.value, langId: newTitle.langId, isDefault: 1 }, results[0].titles[1]]);
    });

    it('+ Change description', async () => {
      const newDesc = { value: `auto changed description 1 ${randomNum(10)}`, langId: 1 };

      const { data } = await betsCustom.changeResult(results[0].id, null, [newDesc]);
      // console.log(data);
      expect(data.success).toEqual(true);
      const { data: { results: resultsAfterChange } } = await betsCustom.eventAdmin(event.id);
      checkChangedResult(results[0], resultsAfterChange[0], null, [newDesc]);
    });

    it('- no description value', async () => {
      const newDesc = { langId: 1 };

      const { data } = await betsCustom.changeResult(results[0].id, null, [newDesc]);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });

    it('- no description langid', async () => {
      const newDesc = { value: `auto changed description 1 ${randomNum(10)}` };

      const { data } = await betsCustom.changeResult(results[0].id, null, [newDesc]);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });

    it('- description isDefault is not changed', async () => {
      const newDesc = { value: `auto changed result 1 ${randomNum(10)}`, langId: 1, isDefault: false };

      const { data } = await betsCustom.changeResult(results[0].id, null, [newDesc]);
      expect(data.success).toEqual(true);
      const { data: { results: resultsAfterChange } } = await betsCustom.eventAdmin(event.id);
      checkChangedResult(results[0], resultsAfterChange[0], null,
        [{ value: newDesc.value, langId: newDesc.langId, isDefault: 1 },
          results[0].descriptions[1]]);
    });

    it('+ Change factor', async () => {
      const { data } = await betsCustom.changeResult(results[0].id, null, null, '15.51');
      // console.log(data);
      expect(data.success).toEqual(true);
      const { data: { results: resultsAfterChange } } = await betsCustom.eventAdmin(event.id);
      checkChangedResult(results[0], resultsAfterChange[0], null, null, '15.51');
    });

    it('- Set factor < 0', async () => {
      const { data } = await betsCustom.changeResult(results[0].id, null, null, '-1.35');
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });

    it('- Factor is number', async () => {
      const { data } = await betsCustom.changeResult(results[0].id, null, null, 15.51);
      // console.log(data);
      checkErrMsg(data, 400, 'Bad request, factor should have a type of string, but found number');
    });

    it('- Factor is string with symbols', async () => {
      const { data } = await betsCustom.changeResult(results[0].id, null, null, 'factor');
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });

    it('+ Set outcome = 1,2,3', async () => {
      const { data } = await betsCustom.changeResult(results[0].id, null, null, null, 1);
      const { data: data2 } = await betsCustom.changeResult(results[1].id, null, null, null, 2);
      expect(data.success).toEqual(true);
      expect(data2.success).toEqual(true);
      const { data: { results: resultsAfterChange } } = await betsCustom.eventAdmin(event.id);
      checkChangedResult(results[0], resultsAfterChange[0], null, null, null, 1);
      checkChangedResult(results[1], resultsAfterChange[1], null, null, null, 2);
      const { data: data3 } = await betsCustom.changeResult(results[0].id, null, null, null, 3);
      expect(data3.success).toEqual(true);
      const { data: { results: resultsAfterChange2 } } = await betsCustom.eventAdmin(event.id);
      checkChangedResult(results[0], resultsAfterChange2[0], null, null, null, 3);
    });

    it('- Set outcome = 0', async () => {
      const { data } = await betsCustom.changeResult(results[0].id, null, null, null, 0);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });

    it('- Set outcome != 0,1,2,3', async () => {
      const { data } = await betsCustom.changeResult(results[0].id, null, null, null, 10);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });

    it('- Set outcome = string', async () => {
      const { data } = await betsCustom.changeResult(results[0].id, null, null, null, '6');
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });

    it('+ Disable result', async () => {
      const { data } = await betsCustom.changeResult(results[0].id, null, null, null, null, 1);
      // console.log(data);
      expect(data.success).toEqual(true);
      const { data: { results: resultsAfterChange } } = await betsCustom.eventAdmin(event.id);
      checkChangedResult(results[0], resultsAfterChange[0], null, null, null, null, 1);
      checkChangedResult(results[1], resultsAfterChange[1]);
    });

    it('+ Enable result', async () => {
      await betsCustom.changeResult(results[0].id, null, null, null, null, 1);
      const { data } = await betsCustom.changeResult(results[0].id, null, null, null, null, 0);
      // console.log(data);
      expect(data.success).toEqual(true);
      const { data: { results: resultsAfterChange } } = await betsCustom.eventAdmin(event.id);
      checkChangedResult(results[0], resultsAfterChange[0], null, null, null, null, 0);
    });

    it('- isDisabled is string', async () => {
      const { data } = await betsCustom.changeResult(results[0].id, null, null, null, null, 'disabled');
      // console.log(data);
      checkErrMsg(data, 400, 'Bad request, isDisabled should have a type of number, but found string');
    });

    it('- isDisabled is boolean', async () => {
      const { data } = await betsCustom.changeResult(results[0].id, null, null, null, null, true);
      // console.log(data);
      checkErrMsg(data, 400, 'Bad request, isDisabled should have a type of number, but found boolean');
    });

    it('+ Change all fields at once', async () => {
      const newTitles = [{
        value: `auto changed result 1 ${randomNum(10)}`,
        langId: 1,
        isDefault: 0,
      }, {
        value: `авто измененный исход 1 ${randomNum(10)}`,
        langId: 2,
        isDefault: 1,
      },
      ];
      const newDesc = [{
        value: `auto changed result description 1 ${randomNum(10)}`,
        langId: 1,
        isDefault: 0,
      }, {
        value: `авто измененное описание исхода 1 ${randomNum(10)}`,
        langId: 2,
        isDefault: 1,
      },
      ];

      const { data } = await betsCustom.changeResult(results[0].id, newTitles, newDesc, '25.36', 2, 1);
      // console.log(data);
      expect(data.success).toEqual(true);
      const { data: { results: resultsAfterChange } } = await betsCustom.eventAdmin(event.id);
      checkChangedResult(results[0], resultsAfterChange[0], newTitles, newDesc, '25.36', 2, 1);
    });
  });
});
