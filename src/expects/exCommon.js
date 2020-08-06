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

export function checkEmptyTitles(data) {
  expect(data.success).toEqual(true);
  expect(data.titles.length).toEqual(0);
}
