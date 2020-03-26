import { checkArraySortedById } from '../methods/utils';
import { betsCustom } from '../methods/betsCustom';

const LANG_EN = 1;
const LANG_RU = 2;
const START_DATE = new Date('2020-01-30');


export function checkAdminTitlesValid(titles) {
  titles.forEach((title) => {
    expect(title.id).toBeGreaterThanOrEqual(1);
    expect(title.isDefault === 0 || title.isDefault === 1).toEqual(true);
    expect(title.langId).toBeGreaterThanOrEqual(1);
    expect(title.translateId).toBeGreaterThanOrEqual(1);
    expect(title.value).toBeString();
  });
}


export function checkResultValid(result, expectedEventId = null, admin = false, bulk = false) {
  expect(result.id).toBeGreaterThan(0);
  if (expectedEventId) {
    expect(result.eventId).toEqual(expectedEventId);
  } else {
    expect(result.eventId).toBeGreaterThanOrEqual(0);
  }
  expect(result.userAuthorId).toBeGreaterThanOrEqual(0);
  expect(result.factor).toBeString();
  expect(result.isDisabled === 0 || result.isDisabled === 1).toEqual(true);
  expect(result.outcome).toBeGreaterThanOrEqual(0);
  expect(new Date(result.createdAt)).toBeAfter(START_DATE);
  expect(new Date(result.updatedAt)).toBeAfter(START_DATE);
  if (!admin) {
    expect(result.title).toBeString();
    expect(result.description).toBeString();
    expect(result.titleId).toBeUndefined();
    expect(result.descriptionId).toBeUndefined();
  } else {
    expect(result.title).toBeUndefined();
    expect(result.description).toBeUndefined();
    if (!bulk) {
      checkAdminTitlesValid(result.titles);
    } else {
      checkAdminTitlesValid([result.titles]);
    }
    checkAdminTitlesValid(result.descriptions);
  }
}


export function checkResultsValid(results, expectedEventId, admin = false) {
  results.forEach((result) => {
    checkResultValid(result, expectedEventId, admin);
  });
}

export function checkEventValid(received, withResults, expectedEventId,
  admin = false, expectedGroupId = null) {
  expect(received).toBeObject();
  if (expectedEventId) {
    expect(received.id).toEqual(expectedEventId);
  } else {
    expect(received.id).toBeGreaterThan(0);
  }
  if (expectedGroupId) {
    expect(received.groupId).toEqual(expectedGroupId);
  } else {
    expect(received.groupId).toBeGreaterThan(0);
  }
  expect(new Date(received.createdAt)).toBeAfter(START_DATE);
  expect(new Date(received.updatedAt)).toBeAfter(START_DATE);
  expect(received.userAuthorId).toBeGreaterThanOrEqual(0);
  expect(received.startAt).not.toBeNil();
  expect(received.stopAt).not.toBeNil();
  expect(received.isCalculated).toBeGreaterThanOrEqual(0);
  expect(received.isDisabled === 0 || received.isDisabled === 1).toEqual(true);
  if (!admin) {
    expect(received.title).not.toBeNil();
    expect(received.descriptionId).toBeUndefined();
    expect(received.titles).toBeUndefined();
  } else {
    expect(received.descriptionId).toBeDefined();
    expect(received.titleId).toBeGreaterThan(0);
    checkAdminTitlesValid(received.titles);
  }
  if (withResults) {
    expect(received.results).toBeArray();
    checkResultsValid(received.results, received.id, admin);
  } else {
    expect(received.results).toBeUndefined();
  }
}


export function checkTranslations(receivedArray, expectedArray) {
  expectedArray.forEach((title, i) => {
    expect(receivedArray[i].value).toEqual(title.value);
    expect(receivedArray[i].langId).toEqual(title.langId);
    if (title.isDefault === true) {
      expect(receivedArray[i].isDefault).toEqual(1);
    } else {
      expect(receivedArray[i].isDefault).toEqual(0);
    }
  });
}

export function checkChangedTranslations(beforeChange, afterChange, expectedTranslations) {
  afterChange.forEach((translation, i) => {
    expect(translation.value).toEqual(expectedTranslations[i].value);
    expect(translation.langId).toEqual(expectedTranslations[i].langId);
    if (beforeChange[i]) {
      expect(translation.id).toEqual(beforeChange[i].id);
      expect(translation.translateId).toEqual(beforeChange[i].translateId);
      expect(translation.isDefault).toEqual(beforeChange[i].isDefault);
    } else {
      expect(translation.id).toBeGreaterThan(0);
      expect(translation.translateId).toEqual(beforeChange[0].translateId);
      expect(translation.isDefault).toEqual(0);
    }
  });
}


export function checkGroupEventsValid(received, withResults, expectedGroupid, admin = false) {
  expect(received).toBeArray();
  received.forEach((event) => {
    checkEventValid(event, withResults, null, admin, expectedGroupid);
  });
}

export function checkGroupsAdminValid(received) {
  expect(received).toBeArray();
  received.forEach((group) => {
    expect(group.id).toBeGreaterThanOrEqual(1);
    expect(group.titleId).toBeGreaterThanOrEqual(1);
    expect(group.isDisabled === 0 || group.isDisabled === 1).toEqual(true);
    expect(group.userAuthorId).toBeGreaterThanOrEqual(0);
    expect(new Date(group.createdAt)).toBeAfter(START_DATE);
    expect(new Date(group.updatedAt)).toBeAfter(START_DATE);
    expect(group.titles).toBeArray();
    checkAdminTitlesValid(group.titles);
  });
}

export function checkEventsBulk(received, expectedIdsArray) {
  expect(received).toBeArray();
  expect(received.length).toEqual(expectedIdsArray.length);
  expectedIdsArray.forEach((id) => {
    const event = received.find(item => item.id === id);
    expect(event.group_id).toBeGreaterThan(0);
    expect(event.title_id).toBeGreaterThan(0);
    expect(new Date(event.created_at)).toBeAfter(START_DATE);
    expect(new Date(event.updated_at)).toBeAfter(START_DATE);
    expect(event.user_author_id).toBeGreaterThanOrEqual(0);
    expect(event.description_id).toBeDefined();
    expect(event.start_at).not.toBeNil();
    expect(event.stop_at).not.toBeNil();
    expect(event.is_calculated).toBeGreaterThanOrEqual(0);
    expect(event.is_disabled === 0 || event.is_disabled === 1).toEqual(true);
  });
  expect(checkArraySortedById(received)).toEqual(true);
}

export function checkResultsBulk(received, expectedIdsArray) {
  expect(received).toBeArray();
  expect(received.length).toEqual(expectedIdsArray.length);
  expect(checkArraySortedById(received)).toEqual(true);
  expectedIdsArray.forEach((id) => {
    const result = received.find(item => item.id === id);
    checkResultValid(result, null, true, true);
  });
}

export function checkUnfinishedValid(received) {
  expect(received).toBeArray();
}

export async function checkCreatedGroup(expectedGroup) {
  const group = await betsCustom.getGroupByTitle(expectedGroup[0].value);
  // console.log(group);
  checkTranslations(group.titles, expectedGroup);
  expect(group.isDisabled).toEqual(0);
  return group.id;
}

export function checkChangedGroupTitles(groupBeforeChange,
  groupAfterChange, expectedTitlesAfterChange) {
  expect(groupAfterChange.id).toEqual(groupBeforeChange.id);
  expect(groupAfterChange.titleId).toEqual(groupBeforeChange.titleId);
  expect(groupAfterChange.createdAt).toEqual(groupBeforeChange.createdAt);
  expect(new Date(groupAfterChange.updatedAt))
    .not.toBeBefore(new Date(groupBeforeChange.updatedAt));
  expect(groupAfterChange.isDisabled).toEqual(groupBeforeChange.isDisabled);
  expect(groupAfterChange.userAuthorId).toEqual(groupBeforeChange.userAuthorId);
  checkChangedTranslations(groupBeforeChange.titles, groupAfterChange.titles,
    expectedTitlesAfterChange);
}

function dateForCompare(date) {
  const result = new Date(date);
  result.setHours(result.getHours() + 3);
  return result.toISOString();
}

export async function checkCreatedEvent(groupId, expectedEventTitles,
  expectedEventDescriptions, expectedStart, expectedStop, expectedEventResults) {
  const { data: event } = await betsCustom.getEventByTitle(groupId, expectedEventTitles[0].value);
  // console.log(event);
  checkTranslations(event.titles, expectedEventTitles);
  checkTranslations(event.descriptions, expectedEventDescriptions);
  // проверить что будет со временем в CI
  expect(event.startAt).toEqual(dateForCompare(expectedStart));
  if (expectedStop) {
    expect(event.stopAt).toEqual(dateForCompare(expectedStop));
  } else {
    expect(event.stopAt).toEqual(null);
  }
  event.results.forEach((result, i) => {
    expect(result.factor).toEqual(expectedEventResults[i].factor);
    checkTranslations(result.titles, expectedEventResults[i].title);
    checkTranslations(result.descriptions, expectedEventResults[i].description);
  });
}

export function checkChangedEvent(eventBeforeChange, eventAfterChange,
  newTitlesArray, newDescriptionsArray, newStart, newStop, newIsDisabled) {
  expect(eventAfterChange.id).toEqual(eventBeforeChange.id);
  expect(eventAfterChange.groupId).toEqual(eventBeforeChange.groupId);
  expect(eventAfterChange.titleId).toEqual(eventBeforeChange.titleId);
  expect(eventAfterChange.createdAt).toEqual(eventBeforeChange.createdAt);
  expect(new Date(eventAfterChange.updatedAt))
    .not.toBeBefore(new Date(eventBeforeChange.updatedAt));
  expect(eventAfterChange.userAuthorId).toEqual(eventBeforeChange.userAuthorId);
  expect(eventAfterChange.descriptionId).toEqual(eventBeforeChange.descriptionId);
  if (newStart) {
    expect(eventAfterChange.startAt).toEqual(dateForCompare(newStart));
  } else {
    expect(eventAfterChange.startAt).toEqual(eventBeforeChange.startAt);
  }
  if (newStop) {
    expect(eventAfterChange.stopAt).toEqual(dateForCompare(newStop));
  } else {
    expect(eventAfterChange.stopAt).toEqual(eventBeforeChange.stopAt);
  }
  if (newIsDisabled) {
    expect(eventAfterChange.isDisabled).toEqual(newIsDisabled);
  } else {
    expect(eventAfterChange.isDisabled).toEqual(eventBeforeChange.isDisabled);
  }
  if (newTitlesArray) {
    checkChangedTranslations(eventBeforeChange.titles, eventAfterChange.titles, newTitlesArray);
  } else {
    expect(eventAfterChange.titles).toEqual(eventBeforeChange.titles);
  }
  if (newDescriptionsArray) {
    checkChangedTranslations(eventBeforeChange.descriptions,
      eventAfterChange.descriptions, newDescriptionsArray);
  } else {
    expect(eventAfterChange.descriptions).toEqual(eventBeforeChange.descriptions);
  }
}

export function checkChangedResult(resultBeforeChange, resultAfterChange, newTitlesArray,
  newDescriptionsArray, newFactor, newOutcome, newIsDisabled) {
  if (newTitlesArray) {
    checkChangedTranslations(resultBeforeChange.titles, resultAfterChange.titles, newTitlesArray);
  } else {
    expect(resultAfterChange.titles).toEqual(resultBeforeChange.titles);
  }
  if (newDescriptionsArray) {
    checkChangedTranslations(resultBeforeChange.descriptions,
      resultAfterChange.descriptions, newDescriptionsArray);
  } else {
    expect(resultAfterChange.descriptions).toEqual(resultBeforeChange.descriptions);
  }
  if (newFactor) {
    expect(resultAfterChange.factor).toEqual(newFactor);
  } else {
    expect(resultAfterChange.factor).toEqual(resultBeforeChange.factor);
  }
  if (newOutcome) {
    expect(resultAfterChange.outcome).toEqual(newOutcome);
  } else {
    expect(resultAfterChange.outcome).toEqual(resultBeforeChange.outcome);
  }
  if (newIsDisabled) {
    expect(resultAfterChange.isDisabled).toEqual(newIsDisabled);
  } else {
    expect(resultAfterChange.isDisabled).toEqual(resultBeforeChange.isDisabled);
  }
}
