export function checkGameInfo(receivedGame, expectedGame) {
  expect(receivedGame.id).toEqual(expectedGame.id);
  expect(receivedGame.nameEn).toEqual(expectedGame.nameEn);
  expect(receivedGame.nameRu).toEqual(expectedGame.nameRu);
  expect(receivedGame.hasDemo).toEqual(expectedGame.hasDemo);
  expect(receivedGame.imageUrl).toEqual(expectedGame.imageUrl);
}

export function checkGameArray(received, expected) {
  expect(received.length).toEqual(expected.length);

  expected.forEach((expectedGame) => {
    const receivedGame = received.find(game => game.id === expectedGame.id);
    expect(receivedGame.id).toEqual(expectedGame.id);
    expect(receivedGame.nameEn).toEqual(expectedGame.nameEn);
    expect(receivedGame.nameRu).toEqual(expectedGame.nameRu);
    expect(receivedGame.hasDemo).toEqual(expectedGame.hasDemo);
    expect(receivedGame.imageUrl).toEqual(expectedGame.imageUrl);
  });
}

export function checkGameInfoIsValid(game) {
  expect(game.id).not.toBeNil();
  expect(game.nameEn).not.toBeNil();
  expect(game.nameRu).toBeDefined();
  expect(game.hasDemo).not.toBeNil();
  expect(game.imageUrl).not.toBeNil();
}

export function checkJackpotValid(received) {
  expect(received.current.RUB).toBeGreaterThanOrEqual(0);
  expect(received.current.USD).toBeGreaterThanOrEqual(0);
  expect(received.current.EUR).toBeGreaterThanOrEqual(0);
  expect(received.current.UAH).toBeGreaterThanOrEqual(0);

  expect(received.current.RUB).not.toEqual(received.current.USD);
  expect(received.current.RUB).not.toEqual(received.current.EUR);
  expect(received.current.RUB).not.toEqual(received.current.UAH);
  expect(received.current.USD).not.toEqual(received.current.EUR);
  expect(received.current.USD).not.toEqual(received.current.UAH);
  expect(received.current.EUR).not.toEqual(received.current.UAH);

  expect(received.issued.RUB).toEqual(0);
  expect(received.issued.USD).toEqual(0);
  expect(received.issued.EUR).toEqual(0);
  expect(received.issued.UAH).toEqual(0);
}

export function compareJackpot(jackpot1, jackpot2, expectedValue) {
  if (expectedValue) {
    expect(jackpot1).toEqual(jackpot2);
  } else {
    expect(jackpot2.current.RUB).toBeGreaterThan(jackpot1.current.RUB);
    expect(jackpot2.current.USD).toBeGreaterThan(jackpot1.current.USD);
    expect(jackpot2.current.EUR).toBeGreaterThan(jackpot1.current.EUR);
    expect(jackpot2.current.UAH).toBeGreaterThan(jackpot1.current.UAH);
  }
}

export function checkPoker(data) {
  expect(data.gameHtml).toBeString();
  expect(data.gameScript).toBeNull();
  expect(data.gameHtml).toContain('id="cubeia-iframe"');
  expect(data.gameHtml).toMatch(/.*src=".*cubeia.com\/poker-client\/poker\/login\/200\/.*/);
}
