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
