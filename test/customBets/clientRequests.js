import { betsCustom } from '../../src/methods/betsCustom';
import {
  checkLangsValid, checkGroup, checkEvent,
} from '../../src/expects/exCustomBets';
import { checkErrMsg } from '../../src/responseChecker';
import { betsCustomFixtures } from '../../src/methods/betsCustomFixtures';
import { formatDateYyyyMmDdHhIiSs, sleep } from '../../src/methods/utils';
import SocketClient from '../../src';


describe('Custom bets client requests', () => {
  let group;
  let event;
  let results;

  beforeAll(async () => {
    /* eslint prefer-destructuring: off */
    const { group: group1, event: event1, results: results1 } = await betsCustomFixtures
      .createGroupWithEventWithResults(5);
    // console.log(group);
    group = group1;
    event = event1;
    results = results1;
  });

  afterAll(async () => {
    await betsCustomFixtures.setGroupIsDisabled(group.id, 1);
  });

  describe('Lang = ru', () => {
    const LANG = 'ru';
    describe('Langs request', () => {
      it('C2034376 (+) Langs', async () => {
        const { data } = await betsCustom.langs();
        // console.log(data);
        checkLangsValid(data);
      });
    });

    describe('Groups request', () => {
      it('C2034377 (+) check group', async () => {
        const { data } = await betsCustom.groups();
        // console.log(data);
        checkGroup(data, group, LANG);
      });

      it('C2034378 (-) disabled groups are not displayed', async () => {
        await betsCustomFixtures.setGroupIsDisabled(group.id, 1);
        const { data } = await betsCustom.groups();
        // console.log(data);
        expect(data.find(receivedGroup => receivedGroup.id === group.id)).toBeUndefined();
        await betsCustomFixtures.setGroupIsDisabled(group.id, 0);
      });

      it('C2034379 (-) groups with no events are not displayed', async () => {
        const noEventsGroup = await betsCustomFixtures.addGroup();
        const { data } = await betsCustom.groups();
        // console.log(data);
        // this await is before expect to ensure that group is disabled even if expect fails
        await betsCustomFixtures.setGroupIsDisabled(noEventsGroup.id, 1);
        expect(data.find(receivedGroup => receivedGroup.id === noEventsGroup.id)).toBeUndefined();
      });

      it('C2034380 (-) groups with only disabled events are not displayed', async () => {
        await betsCustomFixtures.setEventIsDisabled(event.id, 1);
        const { data } = await betsCustom.groups();
        // console.log(data);
        // this await is before expect to ensure that event is enabled again even if expect fails
        await betsCustomFixtures.setEventIsDisabled(event.id, 0);
        expect(data.find(receivedGroup => receivedGroup.id === group.id)).toBeUndefined();
      });

      it('C2034381 (-) groups with only calculated events are not displayed ', async () => {
        await betsCustomFixtures.setEventCalculated(event.id, 1);
        const { data } = await betsCustom.groups();
        // console.log(data);
        // this await is before expect to ensure that event is enabled again even if expect fails
        await betsCustomFixtures.setEventCalculated(event.id, 0);
        expect(data.find(receivedGroup => receivedGroup.id === group.id)).toBeUndefined();
      });

      it('C2034382 (-) groups with only events with stop time < current time are not displayed', async () => {
        const newTime = formatDateYyyyMmDdHhIiSs(new Date(), true);
        await betsCustomFixtures.setEventStopTime(event.id, newTime);
        await sleep(5000);
        const { data } = await betsCustom.groups();
        // console.log(data);
        // this await is before expect to ensure that event is enabled again even if expect fails
        await betsCustomFixtures.setEventStopTime(event.id, event.stopAt);
        expect(data.find(receivedGroup => receivedGroup.id === group.id)).toBeUndefined();
      });
    });

    describe('Group events request', () => {
      it('C2034360 (+) check event with results', async () => {
        const { data } = await betsCustom.groupEvents(group.id, 1);
        // console.log(data);
        checkEvent(data, event, results, LANG);
      });

      it('C2034361 (+) check event without results', async () => {
        const { data } = await betsCustom.groupEvents(group.id, 0);
        // console.log(data);
        checkEvent(data, event, null, LANG);
      });

      it('C2034362 (-) with no group id', async () => {
        const { data } = await betsCustom.groupEvents();
        // console.log(data);
        checkErrMsg(data, 400, 'Bad request, groupId is required, no default value provided');
      });

      it('C2034363 (-) with unexistent group', async () => {
        const { data } = await betsCustom.groupEvents(3463653653, 1);
        // console.log(data);
        expect(JSON.stringify(data)).toEqual('[]');
      });

      it('C2034364 (-) with group id = string', async () => {
        const { data } = await betsCustom.groupEvents('groupId', 1);
        // console.log(data);
        checkErrMsg(data, 400, 'Bad request, groupId should have a type of number, but found string');
      });

      it('C2034365 (-) with group id < 0', async () => {
        const { data } = await betsCustom.groupEvents(-9);
        // console.log(data);
        expect(JSON.stringify(data)).toEqual('[]');
      });

      it('C2034366 (-) with group id = float number', async () => {
        const { data } = await betsCustom.groupEvents(3.4);
        // console.log(data);
        expect(JSON.stringify(data)).toEqual('[]');
      });

      it('C2034367 (-) with withResults parameter != 0 or 1', async () => {
        const { data } = await betsCustom.groupEvents(group.id, 5);
        // console.log(data);
        checkEvent(data, event, results, LANG);
      });

      it('C2034368 (-) with withResults parameter < 0', async () => {
        const { data } = await betsCustom.groupEvents(group.id, -1);
        // console.log(data);
        checkEvent(data, event, results, LANG);
      });

      it('C2034369 (-) with withResults parameter = float number', async () => {
        const { data } = await betsCustom.groupEvents(group.id, 2.5);
        // console.log(data);
        checkEvent(data, event, results, LANG);
      });

      it('C2034370 (-) with withResults parameter = string', async () => {
        const { data } = await betsCustom.groupEvents(group.id, 'withResults');
        // console.log(data);
        checkErrMsg(data, 400, 'Bad request, withResults should have a type of number, but found string');
      });

      it('C2034371 (-) disabled events are not displayed', async () => {
        await betsCustomFixtures.setEventIsDisabled(event.id, 1);
        const { data } = await betsCustom.groupEvents(group.id, 1);
        // console.log(data);
        // this await is before expect to ensure that event is enabled again even if expect fails
        await betsCustomFixtures.setEventIsDisabled(event.id, 0);
        expect(data.find(receivedEvent => receivedEvent.id === event.id)).toBeUndefined();
      });

      it('C2034372 (-) event with results number < 2 is not displayed', async () => {
        const noResultsEvent = await betsCustomFixtures.addEvent(group.id);
        const { data } = await betsCustom.groupEvents(group.id, 1);
        // console.log(data);
        // this await is before expect to ensure that event is enabled again even if expect fails
        await betsCustomFixtures.setEventIsDisabled(noResultsEvent.id, 1);
        expect(data.find(receivedEvent => receivedEvent.id === noResultsEvent.id)).toBeUndefined();
      });

      it('C2034373 (-) event with all results disabled is not displayed', async () => {
        const disabledResultsEvent = await betsCustomFixtures.addEvent(group.id);
        const disabledResult = await betsCustomFixtures.addResult(disabledResultsEvent.id);
        const disabledResult2 = await betsCustomFixtures.addResult(disabledResultsEvent.id);
        await betsCustomFixtures.setResultIsDisabled(disabledResult.id, 1);
        await betsCustomFixtures.setResultIsDisabled(disabledResult2.id, 1);
        const { data } = await betsCustom.groupEvents(group.id, 1);
        // console.log(data);
        // this await is before expect to ensure that event is enabled again even if expect fails
        await betsCustomFixtures.setEventIsDisabled(disabledResultsEvent.id, 1);
        expect(data.find(receivedEvent => receivedEvent.id === disabledResultsEvent.id))
          .toBeUndefined();
      });

      it('C2034374 (-) calculated event is not displayed', async () => {
        await betsCustomFixtures.setEventCalculated(event.id, 1);
        const { data } = await betsCustom.groupEvents(group.id, 1);
        // console.log(data);
        // this await is before expect to ensure that event is enabled again even if expect fails
        await betsCustomFixtures.setEventCalculated(event.id, 0);
        expect(data.find(receivedEvent => receivedEvent.id === event.id))
          .toBeUndefined();
      });

      it('C2034375 (-) event with stop time < current time is not displayed', async () => {
        const newTime = formatDateYyyyMmDdHhIiSs(new Date(), true);
        await betsCustomFixtures.setEventStopTime(event.id, newTime);
        await sleep(5000);
        const { data } = await betsCustom.groupEvents(group.id, 1);
        // console.log(data);
        // this await is before expect to ensure that event is enabled again even if expect fails
        await betsCustomFixtures.setEventStopTime(event.id, event.stopAt);
        expect(data.find(receivedEvent => receivedEvent.id === event.id))
          .toBeUndefined();
      });
    });

    describe('Event request', () => {
      it('C2034198 (+) check event', async () => {
        const { data } = await betsCustom.event(event.id);
        // console.log(data);
        checkEvent([data], event, results, LANG);
      });

      it('C2034199 (-) without event id', async () => {
        const { data } = await betsCustom.event();
        // console.log(data);
        checkErrMsg(data, 400, 'Bad request, id is required, no default value provided');
      });

      it('C2034200 (-) unexistent event', async () => {
        const { data } = await betsCustom.event(4553413213);
        // console.log(data);
        checkErrMsg(data, 400, 'Неверный запрос');
      });

      it('C2034201 (-) event id is string', async () => {
        const { data } = await betsCustom.event('event');
        // console.log(data);
        checkErrMsg(data, 400, 'Bad request, id should have a type of number, but found string');
      });

      it('C2034202 (-) event id < 0', async () => {
        const { data } = await betsCustom.event(-3);
        // console.log(data);
        checkErrMsg(data, 400, 'Неверный запрос');
      });

      it('C2034353 (-) event id = float number', async () => {
        const { data } = await betsCustom.event(1.5);
        // console.log(data);
        checkErrMsg(data, 400, 'Неверный запрос');
      });

      it('C2034354 (-) disabled event', async () => {
        await betsCustomFixtures.setEventIsDisabled(event.id, 1);
        const { data } = await betsCustom.event(event.id);
        // console.log(data);
        await betsCustomFixtures.setEventIsDisabled(event.id, 0);
        checkErrMsg(data, 400, 'Неверный запрос');
      });

      it('C2034355 (+) event with no results', async () => {
        const noResultsEvent = await betsCustomFixtures.addEvent(group.id);
        const { data } = await betsCustom.event(noResultsEvent.id);
        // console.log(data);
        // this await is before expect to ensure that event is enabled again even if expect fails
        await betsCustomFixtures.setEventIsDisabled(noResultsEvent.id, 1);
        checkEvent([data], noResultsEvent, false, LANG);
      });

      it('C2034356 (+) event with all results disabled', async () => {
        const disabledResultsEvent = await betsCustomFixtures.addEvent(group.id);
        const disabledResult = await betsCustomFixtures.addResult(disabledResultsEvent.id);
        const disabledResult2 = await betsCustomFixtures.addResult(disabledResultsEvent.id);
        await betsCustomFixtures.setResultIsDisabled(disabledResult.id, 1);
        await betsCustomFixtures.setResultIsDisabled(disabledResult2.id, 1);
        const { data } = await betsCustom.event(disabledResultsEvent.id);
        // console.log(data);
        // this await is before expect to ensure that event is enabled again even if expect fails
        await betsCustomFixtures.setEventIsDisabled(disabledResultsEvent.id, 1);
        checkEvent([data], disabledResultsEvent, false, LANG);
      });

      it('C2034357 (+) calculated event', async () => {
        await betsCustomFixtures.setEventCalculated(event.id, 1);
        const { data } = await betsCustom.event(event.id);
        // console.log(data);
        // this await is before expect to ensure that event is enabled again even if expect fails
        await betsCustomFixtures.setEventCalculated(event.id, 0);
        checkEvent([data], event, results, LANG, 1);
      });

      it('C2034358 (+) event with stop time < current time', async () => {
        const newTime = formatDateYyyyMmDdHhIiSs(new Date(), true);
        await betsCustomFixtures.setEventStopTime(event.id, newTime);
        await sleep(5000);
        const { data } = await betsCustom.event(event.id);
        // console.log(data);
        // this await is before expect to ensure that event is enabled again even if expect fails
        await betsCustomFixtures.setEventStopTime(event.id, event.stopAt);
        checkEvent([data], {
          id: event.id,
          groupId: event.groupId,
          createdAt: event.createdAt,
          updatedAt: event.updatedAt,
          titleRu: event.titleRu,
          descriptionRu: event.descriptionRu,
          startAt: event.startAt,
          stopAt: newTime,
        }, results, LANG);
      });
    });
  });

  describe('Lang = en', () => {
    const LANG = 'en';
    beforeEach(async () => {
      await socket.disconnect();
      socket = new SocketClient({ lang: LANG });
      await socket.connect();
    });

    describe('Langs request', () => {
      it('C2035342 (+) Langs', async () => {
        const { data } = await betsCustom.langs();
        // console.log(data);
        checkLangsValid(data);
      });
    });

    describe('Groups request', () => {
      it('C2035343 (+) check group', async () => {
        const { data } = await betsCustom.groups();
        // console.log(data);
        checkGroup(data, group, LANG);
      });

      it('C2035344 (-) disabled groups are not displayed', async () => {
        await betsCustomFixtures.setGroupIsDisabled(group.id, 1);
        const { data } = await betsCustom.groups();
        // console.log(data);
        // this await is before expect to ensure that group is disabled even if expect fails
        await betsCustomFixtures.setGroupIsDisabled(group.id, 0);
        expect(data.find(receivedGroup => receivedGroup.id === group.id)).toBeUndefined();
      });

      it('C2035345 (-) groups with no events are not displayed', async () => {
        const noEventsGroup = await betsCustomFixtures.addGroup();
        const { data } = await betsCustom.groups();
        // console.log(data);
        // this await is before expect to ensure that group is disabled even if expect fails
        await betsCustomFixtures.setGroupIsDisabled(noEventsGroup.id, 1);
        expect(data.find(receivedGroup => receivedGroup.id === noEventsGroup.id)).toBeUndefined();
      });

      it('C2035346 (-) groups with only disabled events are not displayed', async () => {
        await betsCustomFixtures.setEventIsDisabled(event.id, 1);
        const { data } = await betsCustom.groups();
        // console.log(data);
        // this await is before expect to ensure that event is enabled again even if expect fails
        await betsCustomFixtures.setEventIsDisabled(event.id, 0);
        expect(data.find(receivedGroup => receivedGroup.id === group.id)).toBeUndefined();
      });

      it('C2035347 (-) groups with only calculated events are not displayed ', async () => {
        await betsCustomFixtures.setEventCalculated(event.id, 1);
        const { data } = await betsCustom.groups();
        // console.log(data);
        // this await is before expect to ensure that event is enabled again even if expect fails
        await betsCustomFixtures.setEventCalculated(event.id, 0);
        expect(data.find(receivedGroup => receivedGroup.id === group.id)).toBeUndefined();
      });

      it('C2035348 (-) groups with only events with stop time < current time are not displayed', async () => {
        const newTime = formatDateYyyyMmDdHhIiSs(new Date(), true);
        await betsCustomFixtures.setEventStopTime(event.id, newTime);
        await sleep(5000);
        const { data } = await betsCustom.groups();
        // console.log(data);
        // this await is before expect to ensure that event is enabled again even if expect fails
        await betsCustomFixtures.setEventStopTime(event.id, event.stopAt);
        expect(data.find(receivedGroup => receivedGroup.id === group.id)).toBeUndefined();
      });
    });

    describe('Group events request', () => {
      it('C2035349 (+) check event with results', async () => {
        const { data } = await betsCustom.groupEvents(group.id, 1);
        // console.log(data);
        checkEvent(data, event, results, LANG);
      });

      it('C2035350 (+) check event without results', async () => {
        const { data } = await betsCustom.groupEvents(group.id, 0);
        // console.log(data);
        checkEvent(data, event, null, LANG);
      });

      it('C2035351 (-) with no group id', async () => {
        const { data } = await betsCustom.groupEvents();
        // console.log(data);
        checkErrMsg(data, 400, 'Bad request, groupId is required, no default value provided');
      });

      it('C2035352 (-) with unexistent group', async () => {
        const { data } = await betsCustom.groupEvents(3463653653, 1);
        // console.log(data);
        expect(JSON.stringify(data)).toEqual('[]');
      });

      it('C2035353 (-) with group id = string', async () => {
        const { data } = await betsCustom.groupEvents('groupId', 1);
        // console.log(data);
        checkErrMsg(data, 400, 'Bad request, groupId should have a type of number, but found string');
      });

      it('C2035354 (-) with group id < 0', async () => {
        const { data } = await betsCustom.groupEvents(-9);
        // console.log(data);
        expect(JSON.stringify(data)).toEqual('[]');
      });

      it('C2035355 (-) with group id = float number', async () => {
        const { data } = await betsCustom.groupEvents(3.4);
        // console.log(data);
        expect(JSON.stringify(data)).toEqual('[]');
      });

      it('C2035356 (-) with withResults parameter != 0 or 1', async () => {
        const { data } = await betsCustom.groupEvents(group.id, 5);
        // console.log(data);
        checkEvent(data, event, results, LANG);
      });

      it('C2035357 (-) with withResults parameter < 0', async () => {
        const { data } = await betsCustom.groupEvents(group.id, -1);
        // console.log(data);
        checkEvent(data, event, results, LANG);
      });

      it('C2035358 (-) with withResults parameter = float number', async () => {
        const { data } = await betsCustom.groupEvents(group.id, 2.5);
        // console.log(data);
        checkEvent(data, event, results, LANG);
      });

      it('C2035359 (-) with withResults parameter = string', async () => {
        const { data } = await betsCustom.groupEvents(group.id, 'withResults');
        // console.log(data);
        checkErrMsg(data, 400, 'Bad request, withResults should have a type of number, but found string');
      });

      it('C2035360 (-) disabled events are not displayed', async () => {
        await betsCustomFixtures.setEventIsDisabled(event.id, 1);
        const { data } = await betsCustom.groupEvents(group.id, 1);
        // console.log(data);
        // this await is before expect to ensure that event is enabled again even if expect fails
        await betsCustomFixtures.setEventIsDisabled(event.id, 0);
        expect(data.find(receivedEvent => receivedEvent.id === event.id)).toBeUndefined();
      });

      it('C2035361 (-) event with results number < 2 is not displayed', async () => {
        const noResultsEvent = await betsCustomFixtures.addEvent(group.id);
        const { data } = await betsCustom.groupEvents(group.id, 1);
        // console.log(data);
        // this await is before expect to ensure that event is enabled again even if expect fails
        await betsCustomFixtures.setEventIsDisabled(noResultsEvent.id, 1);
        expect(data.find(receivedEvent => receivedEvent.id === noResultsEvent.id)).toBeUndefined();
      });

      it('C2035362 (-) event with all results disabled is not displayed', async () => {
        const disabledResultsEvent = await betsCustomFixtures.addEvent(group.id);
        const disabledResult = await betsCustomFixtures.addResult(disabledResultsEvent.id);
        const disabledResult2 = await betsCustomFixtures.addResult(disabledResultsEvent.id);
        await betsCustomFixtures.setResultIsDisabled(disabledResult.id, 1);
        await betsCustomFixtures.setResultIsDisabled(disabledResult2.id, 1);
        const { data } = await betsCustom.groupEvents(group.id, 1);
        // console.log(data);
        // this await is before expect to ensure that event is enabled again even if expect fails
        await betsCustomFixtures.setEventIsDisabled(disabledResultsEvent.id, 1);
        expect(data.find(receivedEvent => receivedEvent.id === disabledResultsEvent.id))
          .toBeUndefined();
      });

      it('C2035363 (-) calculated event is not displayed', async () => {
        await betsCustomFixtures.setEventCalculated(event.id, 1);
        const { data } = await betsCustom.groupEvents(group.id, 1);
        // console.log(data);
        // this await is before expect to ensure that event is enabled again even if expect fails
        await betsCustomFixtures.setEventCalculated(event.id, 0);
        expect(data.find(receivedEvent => receivedEvent.id === event.id))
          .toBeUndefined();
      });

      it('C2035364 (-) event with stop time < current time is not displayed', async () => {
        const newTime = formatDateYyyyMmDdHhIiSs(new Date(), true);
        await betsCustomFixtures.setEventStopTime(event.id, newTime);
        await sleep(5000);
        const { data } = await betsCustom.groupEvents(group.id, 1);
        // console.log(data);
        // this await is before expect to ensure that event is enabled again even if expect fails
        await betsCustomFixtures.setEventStopTime(event.id, event.stopAt);
        expect(data.find(receivedEvent => receivedEvent.id === event.id))
          .toBeUndefined();
      });
    });

    describe('Event request', () => {
      it('C2035365 (+) check event', async () => {
        const { data } = await betsCustom.event(event.id);
        // console.log(data);
        checkEvent([data], event, results, LANG);
      });

      it('C2035366 (-) without event id', async () => {
        const { data } = await betsCustom.event();
        // console.log(data);
        checkErrMsg(data, 400, 'Bad request, id is required, no default value provided');
      });

      it('C2035367 (-) unexistent event', async () => {
        const { data } = await betsCustom.event(4553413213);
        // console.log(data);
        checkErrMsg(data, 400, 'Bad request');
      });

      it('C2035368 (-) event id is string', async () => {
        const { data } = await betsCustom.event('event');
        // console.log(data);
        checkErrMsg(data, 400, 'Bad request, id should have a type of number, but found string');
      });

      it('C2035369 (-) event id < 0', async () => {
        const { data } = await betsCustom.event(-3);
        // console.log(data);
        checkErrMsg(data, 400, 'Bad request');
      });

      it('C2035370 (-) event id = float number', async () => {
        const { data } = await betsCustom.event(1.5);
        // console.log(data);
        checkErrMsg(data, 400, 'Bad request');
      });

      it('C2035371 (-) disabled event', async () => {
        await betsCustomFixtures.setEventIsDisabled(event.id, 1);
        const { data } = await betsCustom.event(event.id);
        // console.log(data);
        await betsCustomFixtures.setEventIsDisabled(event.id, 0);
        checkErrMsg(data, 400, 'Bad request');
      });

      it('C2035372 (+) event with no results', async () => {
        const noResultsEvent = await betsCustomFixtures.addEvent(group.id);
        const { data } = await betsCustom.event(noResultsEvent.id);
        // console.log(data);
        // this await is before expect to ensure that event is enabled again even if expect fails
        await betsCustomFixtures.setEventIsDisabled(noResultsEvent.id, 1);
        checkEvent([data], noResultsEvent, false, LANG);
      });

      it('C2035373 (+) event with all results disabled', async () => {
        const disabledResultsEvent = await betsCustomFixtures.addEvent(group.id);
        const disabledResult = await betsCustomFixtures.addResult(disabledResultsEvent.id);
        const disabledResult2 = await betsCustomFixtures.addResult(disabledResultsEvent.id);
        await betsCustomFixtures.setResultIsDisabled(disabledResult.id, 1);
        await betsCustomFixtures.setResultIsDisabled(disabledResult2.id, 1);
        const { data } = await betsCustom.event(disabledResultsEvent.id);
        // console.log(data);
        // this await is before expect to ensure that event is enabled again even if expect fails
        await betsCustomFixtures.setEventIsDisabled(disabledResultsEvent.id, 1);
        checkEvent([data], disabledResultsEvent, false, LANG);
      });

      it('C2035374 (+) calculated event', async () => {
        await betsCustomFixtures.setEventCalculated(event.id, 1);
        const { data } = await betsCustom.event(event.id);
        // console.log(data);
        // this await is before expect to ensure that event is enabled again even if expect fails
        await betsCustomFixtures.setEventCalculated(event.id, 0);
        checkEvent([data], event, results, LANG, 1);
      });

      it('C2035375 (+) event with stop time < current time', async () => {
        const newTime = formatDateYyyyMmDdHhIiSs(new Date(), true);
        await betsCustomFixtures.setEventStopTime(event.id, newTime);
        await sleep(5000);
        const { data } = await betsCustom.event(event.id);
        // console.log(data);
        // this await is before expect to ensure that event is enabled again even if expect fails
        await betsCustomFixtures.setEventStopTime(event.id, event.stopAt);
        checkEvent([data], {
          id: event.id,
          groupId: event.groupId,
          createdAt: event.createdAt,
          updatedAt: event.updatedAt,
          titleEn: event.titleEn,
          descriptionEn: event.descriptionEn,
          startAt: event.startAt,
          stopAt: newTime,
        }, results, LANG);
      });
    });
  });
});
