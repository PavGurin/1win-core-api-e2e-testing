export function checkTitles(data, expectedLang, expectedPath) {
  expect(data.success).toEqual(true);
  expect(data.title).toBeObject();
  expect(data.title.id).toBeGreaterThan(0);
  if (expectedLang) {
    expect(data.title.lang).toEqual(expectedLang);
  } else {
    expect(data.title.lang).toBeString();
  }
  if (expectedPath) {
    expect(data.title.path).toEqual(expectedPath);
  } else {
    expect(data.title.path).toBeString();
  }
  expect(data.title.text).toBeString();
  expect(data.title.is_dynamic).toBeOneOf([0, 1]);
}

export function checkTitlesToMatchExpected(data, expectedArray) {
  expect(data.success).toEqual(true);
  expect(data.titles.length).toEqual(expectedArray.length);
  expectedArray.forEach((title) => {
    const receivedTitle = data.titles.find(received => received.text === title.text);
    expect(receivedTitle.id).toBeGreaterThan(0);
    expect(receivedTitle.lang).toEqual(title.lang);
    expect(receivedTitle.path).toEqual(title.path);
    expect(receivedTitle.is_dynamic).toEqual(title.isDynamic);
  });
}

export function checkEmptyTitles(data) {
  expect(data.success).toEqual(true);
  expect(data.title).toBeUndefined();
}
