export function checkTitle(data, expectedLang, expectedPath) {
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

export function checkEmptyTitle(data) {
  expect(data.success).toEqual(true);
  expect(data.title).toBeUndefined();
}
