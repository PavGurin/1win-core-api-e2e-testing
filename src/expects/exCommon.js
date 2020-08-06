export function checkTitles(data, expectedLang, expectedPath) {
  expect(data.success).toEqual(true);
  expect(data.titles.length).not.toEqual(0);
  data.titles.forEach((title) => {
    expect(title.id).toBeGreaterThan(0);
    if (expectedLang) {
      expect(title.lang).toEqual(expectedLang);
    } else {
      expect(title.lang).toBeString();
    }
    if (expectedPath) {
      expect(title.path).toEqual(expectedPath);
    } else {
      expect(title.path).toBeString();
    }
    expect(title.text).toBeString();
    expect(title.is_dynamic).toBeOneOf([0, 1]);
  });
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
  expect(data.titles.length).toEqual(0);
}
